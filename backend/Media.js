/**
 * Media: resumable upload thẳng tới Drive, chia sẻ/thu hồi quyền theo tham chiếu.
 * Token OAuth của chủ sở hữu chỉ dùng phía server, không bao giờ trả về client.
 */

const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD = 'https://www.googleapis.com/upload/drive/v3/files';

function driveFetch_(method, url, body, extraHeaders) {
  const headers = { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() };
  Object.keys(extraHeaders || {}).forEach(function (k) { headers[k] = extraHeaders[k]; });
  const opt = { method: method, headers: headers, muteHttpExceptions: true };
  if (body !== undefined) {
    opt.contentType = 'application/json; charset=UTF-8';
    opt.payload = JSON.stringify(body);
  }
  return UrlFetchApp.fetch(url, opt);
}

function driveError_(res, fallbackCode) {
  const code = res.getResponseCode();
  let reason = '';
  try { reason = JSON.parse(res.getContentText()).error.errors[0].reason; } catch (e) { /* không phải JSON */ }
  if (reason === 'storageQuotaExceeded' || reason === 'quotaExceeded') {
    return new ApiError('QUOTA_EXCEEDED', 'Google Drive đã hết dung lượng. Hãy giải phóng dung lượng hoặc dùng link YouTube.', false);
  }
  if (code === 429 || code >= 500 || reason === 'userRateLimitExceeded' || reason === 'rateLimitExceeded') {
    return new ApiError(fallbackCode, 'Google Drive tạm thời quá tải, vui lòng thử lại.', true);
  }
  return new ApiError(fallbackCode, 'Google Drive từ chối thao tác (' + code + (reason ? ', ' + reason : '') + ').', false);
}

function allowedOrigin_(origin) {
  const list = cfg_('ALLOWED_ORIGINS').split(',').map(function (s) { return s.trim(); });
  if (list.indexOf(origin) < 0) throw new ApiError('VALIDATION_ERROR', 'Origin không được phép.', false);
  return origin;
}

/** Bắt đầu phiên resumable. Trả URL phiên cho admin; trình duyệt PUT bytes thẳng tới Drive. */
function mediaStartUpload_(p) {
  const name = String(p.name || '').trim();
  const mime = String(p.mimeType || '');
  const size = Number(p.size);
  const isVideo = /^video\//.test(mime);
  const isImage = /^image\/(png|jpeg|webp|gif)$/.test(mime);
  if (!name || name.length > 200) throw new ApiError('VALIDATION_ERROR', 'Tên tệp không hợp lệ.', false);
  if (!isVideo && !isImage) throw new ApiError('VALIDATION_ERROR', 'Chỉ nhận ảnh (PNG/JPEG/WebP/GIF) hoặc video.', false);
  if (!(size > 0)) throw new ApiError('VALIDATION_ERROR', 'Dung lượng tệp không hợp lệ.', false);
  const folderId = cfg_(isVideo ? 'VIDEOS_FOLDER_ID' : 'IMAGES_FOLDER_ID');
  const res = driveFetch_('post', DRIVE_UPLOAD + '?uploadType=resumable', { name: name, parents: [folderId], mimeType: mime }, {
    'X-Upload-Content-Type': mime,
    'X-Upload-Content-Length': String(size),
    Origin: allowedOrigin_(String(p.origin || '')),
  });
  if (res.getResponseCode() !== 200) throw driveError_(res, 'UPLOAD_FAILED');
  const h = res.getAllHeaders();
  const uploadUrl = h.Location || h.location;
  if (!uploadUrl) throw new ApiError('UPLOAD_FAILED', 'Drive không trả về phiên upload.', true);
  const id = uuid_();
  const t = nowIso_();
  // Ràng buộc phiên với mediaId phía server (BA-009). Chỉ lưu trong cache có hạn, không ghi Sheet/log.
  CacheService.getScriptCache().put('up:' + id, uploadUrl, 21600);
  withLock_(function () {
    appendRow_('Media', {
      id: id, provider: 'drive', drive_file_id: '', youtube_id: '', mime_type: mime, name: name, size_bytes: size,
      alt_text: String(p.altText || '').slice(0, 300), processing_status: 'uploading', managed_by_app: true,
      app_permission_id: '', visibility_state: 'private', created_at: t, updated_at: t,
    });
  });
  return { mediaId: id, uploadUrl: uploadUrl };
}

/**
 * Xác nhận hoàn tất. URL phiên LẤY TỪ CACHE phía server theo mediaId; mọi uploadUrl client gửi lên bị bỏ qua,
 * nên "mediaId A + phiên B" không thể xảy ra. Chưa đủ bytes -> MEDIA_NOT_READY (không báo hoàn tất giả).
 *
 * Trạng thái: uploading -> (ảnh) ready | (video) processing -> ready.
 * "Đã tải xong" khác "phát được": video chỉ ready khi Drive đã sinh videoMediaMetadata.
 */
function driveFileMeta_(fileId) {
  const res = driveFetch_('get', DRIVE_API + '/files/' + fileId + '?fields=id,size,mimeType,parents,trashed,ownedByMe,videoMediaMetadata(durationMillis)');
  if (res.getResponseCode() !== 200) throw driveError_(res, 'UPLOAD_FAILED'); // kiểm status TRƯỚC khi parse
  return JSON.parse(res.getContentText());
}

function mediaCompleteUpload_(p) {
  return withLock_(function () {
    const m = readTable_('Media').filter(function (r) { return r.id === p.mediaId; })[0];
    if (!m) throw new ApiError('NOT_FOUND', 'Không tìm thấy media.', false);
    if (m.processing_status !== 'uploading') {
      return { mediaId: m.id, driveFileId: m.drive_file_id, sizeBytes: Number(m.size_bytes), mimeType: m.mime_type, status: m.processing_status }; // idempotent
    }
    const uploadUrl = CacheService.getScriptCache().get('up:' + m.id);
    if (!uploadUrl) throw new ApiError('UPLOAD_SESSION_EXPIRED', 'Phiên tải lên đã hết hạn hoặc không tồn tại. Hãy bắt đầu tải lại.', false);
    const res = UrlFetchApp.fetch(uploadUrl, { method: 'put', headers: { 'Content-Range': 'bytes */' + m.size_bytes }, muteHttpExceptions: true });
    const code = res.getResponseCode();
    if (code === 308) throw new ApiError('MEDIA_NOT_READY', 'Tệp chưa tải lên xong.', true);
    if (code !== 200 && code !== 201) throw driveError_(res, 'UPLOAD_FAILED');
    const fileId = JSON.parse(res.getContentText()).id;
    const meta = driveFileMeta_(fileId);
    const isVideo = /^video\//.test(m.mime_type);
    const expectedFolder = cfg_(isVideo ? 'VIDEOS_FOLDER_ID' : 'IMAGES_FOLDER_ID');
    if (meta.trashed || !meta.ownedByMe || (meta.parents || []).indexOf(expectedFolder) < 0 ||
        Number(meta.size) !== Number(m.size_bytes) || meta.mimeType !== m.mime_type) {
      throw new ApiError('UPLOAD_FAILED', 'Tệp trên Drive không khớp với phiên upload (thư mục, dung lượng hoặc loại tệp).', false);
    }
    m.drive_file_id = fileId;
    m.processing_status = isVideo && !(meta.videoMediaMetadata && meta.videoMediaMetadata.durationMillis) ? 'processing' : 'ready';
    m.updated_at = nowIso_();
    updateRow_('Media', m._row, m);
    CacheService.getScriptCache().remove('up:' + m.id);
    return { mediaId: m.id, driveFileId: fileId, sizeBytes: Number(meta.size), mimeType: meta.mimeType, status: m.processing_status };
  });
}

/** Hỏi lại Drive xem video đang 'processing' đã phát được chưa. */
function mediaRefresh_(p) {
  return withLock_(function () {
    const m = readTable_('Media').filter(function (r) { return r.id === p.mediaId; })[0];
    if (!m || !m.drive_file_id) throw new ApiError('NOT_FOUND', 'Không tìm thấy media.', false);
    if (m.processing_status === 'processing') {
      const meta = driveFileMeta_(m.drive_file_id);
      if (meta.videoMediaMetadata && meta.videoMediaMetadata.durationMillis) {
        m.processing_status = 'ready';
        m.updated_at = nowIso_();
        updateRow_('Media', m._row, m);
      }
    }
    return { mediaId: m.id, status: m.processing_status };
  });
}

/** Media đang được tham chiếu bởi snapshot đã xuất bản (nội dung published hoặc settings). */
function publicRefCount_(mediaId, contents, refs) {
  const publishedIds = {};
  contents.forEach(function (c) { if (c.status === 'published') publishedIds[c.id] = true; });
  return refs.filter(function (r) {
    if (r.media_id !== mediaId || r.snapshot !== 'published') return false;
    return r.owner_type === 'settings' || publishedIds[r.owner_id];
  }).length;
}

/**
 * Cấp anyone/reader cho đúng một file do ứng dụng quản lý. Idempotent.
 * Nếu file đã có quyền "anyone" từ trước (cấp ngoài ứng dụng) thì không nhận là của ứng dụng.
 */
function ensurePublic_(m) {
  if (m.provider !== 'drive') return m;
  if (String(m.managed_by_app) !== 'true') throw new ApiError('SHARE_FAILED', 'Tệp không do ứng dụng quản lý nên không tự đổi quyền.', false);
  const list = driveFetch_('get', DRIVE_API + '/files/' + m.drive_file_id + '/permissions?fields=permissions(id,type,role)');
  if (list.getResponseCode() !== 200) throw driveError_(list, 'SHARE_FAILED');
  const existing = JSON.parse(list.getContentText()).permissions.filter(function (x) { return x.type === 'anyone'; })[0];
  if (existing) {
    m.visibility_state = 'public';
    return m; // đã công khai; app_permission_id giữ nguyên (rỗng nếu quyền do bên ngoài cấp)
  }
  const res = driveFetch_('post', DRIVE_API + '/files/' + m.drive_file_id + '/permissions?fields=id', { type: 'anyone', role: 'reader' });
  if (res.getResponseCode() !== 200) {
    m.visibility_state = 'error';
    throw driveError_(res, 'SHARE_FAILED');
  }
  m.app_permission_id = JSON.parse(res.getContentText()).id;
  m.visibility_state = 'public';
  return m;
}

/** Thu hồi đúng quyền do ứng dụng cấp. Không đụng quyền cấp ngoài ứng dụng. Idempotent. */
function revokeAppPermission_(m) {
  if (m.provider !== 'drive' || !m.app_permission_id) return m;
  const res = driveFetch_('delete', DRIVE_API + '/files/' + m.drive_file_id + '/permissions/' + m.app_permission_id);
  const code = res.getResponseCode();
  if (code !== 204 && code !== 404) {
    m.visibility_state = 'error';
    throw driveError_(res, 'REVOKE_FAILED');
  }
  m.app_permission_id = '';
  m.visibility_state = 'private';
  return m;
}
