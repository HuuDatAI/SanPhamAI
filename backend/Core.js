/**
 * Core: cấu hình, lỗi, truy cập Sheet, xác thực admin.
 * Không có secret trong mã nguồn. Mọi cấu hình nằm trong Script Properties:
 *   SHEET_ID, IMAGES_FOLDER_ID, VIDEOS_FOLDER_ID, ADMIN_EMAIL, OAUTH_CLIENT_ID, ALLOWED_ORIGINS
 */

const SCHEMA = {
  Content: ['id', 'type', 'slug', 'status', 'featured', 'sort_order', 'revision', 'draft_json', 'published_json', 'created_at', 'updated_at', 'published_at'],
  Categories: ['id', 'kind', 'name', 'slug', 'sort_order', 'active', 'revision', 'updated_at'],
  Media: ['id', 'provider', 'drive_file_id', 'youtube_id', 'mime_type', 'name', 'size_bytes', 'alt_text', 'processing_status', 'managed_by_app', 'app_permission_id', 'visibility_state', 'created_at', 'updated_at'],
  MediaRefs: ['owner_type', 'owner_id', 'snapshot', 'media_id', 'role'],
  Settings: ['key', 'draft_value_json', 'published_value_json', 'revision', 'updated_at'],
  AnalyticsDaily: ['date_local', 'entity_type', 'entity_id', 'views', 'zalo_clicks', 'updated_at'],
  AuditLog: ['id', 'operation_id', 'actor_id', 'action', 'entity_type', 'entity_id', 'result', 'created_at', 'error_code'],
  PublishJobs: ['operation_id', 'entity_type', 'entity_id', 'expected_revision', 'phase', 'previous_snapshot_json', 'target_snapshot_json', 'attempts', 'updated_at', 'error_code'],
};

const CELL_MAX = 50000; // giới hạn ký tự một ô Google Sheets

function ApiError(code, message, retryable) {
  this.code = code;
  this.message = message;
  this.retryable = !!retryable;
}

function cfg_(key, required) {
  const v = PropertiesService.getScriptProperties().getProperty(key);
  if (!v && required !== false) throw new ApiError('CONFIG_MISSING', 'Thiếu cấu hình: ' + key, false);
  return v || '';
}

function nowIso_() {
  return new Date().toISOString();
}

function uuid_() {
  return Utilities.getUuid();
}

function sheet_(name) {
  const sh = SpreadsheetApp.openById(cfg_('SHEET_ID')).getSheetByName(name);
  if (!sh) throw new ApiError('CONFIG_MISSING', 'Chưa chạy setup(): thiếu tab ' + name, false);
  return sh;
}

/** Chặn chèn công thức: chuỗi bắt đầu bằng = + - @ được lưu dạng văn bản (dấu ' đầu ô không thuộc giá trị). */
function toCell_(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'boolean' || typeof v === 'number') return v;
  const s = String(v);
  if (s.length > CELL_MAX) {
    throw new ApiError('VALIDATION_ERROR', 'Nội dung dài ' + s.length + ' ký tự, vượt giới hạn ' + CELL_MAX + ' ký tự của một ô. Hãy rút gọn hoặc tách nội dung.', false);
  }
  return /^[=+\-@'\t\r]/.test(s) ? "'" + s : s;
}

function readTable_(name) {
  const sh = sheet_(name);
  const last = sh.getLastRow();
  const cols = SCHEMA[name];
  if (last < 2) return [];
  const values = sh.getRange(2, 1, last - 1, cols.length).getValues();
  return values.map(function (r, i) {
    const o = { _row: i + 2 };
    cols.forEach(function (c, j) { o[c] = r[j]; });
    return o;
  });
}

function appendRow_(name, obj) {
  const cols = SCHEMA[name];
  const sh = sheet_(name);
  const row = sh.getLastRow() + 1;
  sh.getRange(row, 1, 1, cols.length).setValues([cols.map(function (c) { return toCell_(obj[c]); })]);
  return row;
}

function updateRow_(name, rowIndex, obj) {
  const cols = SCHEMA[name];
  sheet_(name).getRange(rowIndex, 1, 1, cols.length).setValues([cols.map(function (c) { return toCell_(obj[c]); })]);
}

function deleteRows_(name, predicate) {
  const sh = sheet_(name);
  const rows = readTable_(name);
  for (let i = rows.length - 1; i >= 0; i--) {
    if (predicate(rows[i])) sh.deleteRow(rows[i]._row);
  }
}

function withLock_(fn) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) throw new ApiError('BUSY', 'Hệ thống đang bận, vui lòng thử lại.', true);
  try {
    return fn();
  } finally {
    SpreadsheetApp.flush();
    lock.releaseLock();
  }
}

/**
 * Xác thực admin bằng Google ID token. Không dùng Session.getActiveUser()
 * (web app chạy "Execute as me / Anyone" không biết danh tính khách) và không tin email client tự khai.
 */
function verifyAdmin_(idToken) {
  const clientId = cfg_('OAUTH_CLIENT_ID');
  const adminEmail = cfg_('ADMIN_EMAIL').toLowerCase();
  if (!idToken || typeof idToken !== 'string' || idToken.length > 4096) {
    throw new ApiError('AUTH_REQUIRED', 'Cần đăng nhập Google.', false);
  }
  const res = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken), { muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) throw new ApiError('AUTH_REQUIRED', 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.', false);
  const c = JSON.parse(res.getContentText());
  const issOk = c.iss === 'accounts.google.com' || c.iss === 'https://accounts.google.com';
  if (c.aud !== clientId || !issOk || !(Number(c.exp) * 1000 > Date.now())) {
    throw new ApiError('AUTH_REQUIRED', 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.', false);
  }
  if (String(c.email_verified) !== 'true' || String(c.email || '').toLowerCase() !== adminEmail) {
    throw new ApiError('FORBIDDEN', 'Tài khoản này không có quyền quản trị.', false);
  }
  return { sub: c.sub };
}

function audit_(actorId, action, entityType, entityId, result, errorCode, operationId) {
  try {
    appendRow_('AuditLog', {
      id: uuid_(), operation_id: operationId || '', actor_id: actorId || '', action: action,
      entity_type: entityType || '', entity_id: entityId || '', result: result, created_at: nowIso_(), error_code: errorCode || '',
    });
  } catch (e) { /* ghi log lỗi không được làm hỏng thao tác chính */ }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function handle_(fn) {
  try {
    return json_({ ok: true, data: fn() });
  } catch (e) {
    if (e instanceof ApiError) return json_({ ok: false, error: { code: e.code, message: e.message, retryable: e.retryable } });
    console.error(e && e.stack ? e.stack : e);
    return json_({ ok: false, error: { code: 'INTERNAL', message: 'Lỗi hệ thống, vui lòng thử lại.', retryable: true } });
  }
}

/** Chạy một lần trong trình soạn thảo: tạo các tab theo schema (không xóa dữ liệu đã có). */
function setup() {
  const ss = SpreadsheetApp.openById(cfg_('SHEET_ID'));
  Object.keys(SCHEMA).forEach(function (name) {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    const cols = SCHEMA[name];
    sh.getRange(1, 1, 1, cols.length).setValues([cols]).setFontWeight('bold');
    sh.setFrozenRows(1);
  });
  const first = ss.getSheetByName('Sheet1') || ss.getSheetByName('Trang tính1');
  if (first && first.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(first);
  return 'OK';
}
