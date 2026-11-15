/**
 * PoC Giai đoạn 0 — chủ sở hữu chạy runPoc() trong trình soạn thảo Apps Script.
 * Dùng đúng các hàm thật (adminSaveDraft_/adminPublish_/adminHide_/ensurePublic_...), gọi Drive thật.
 * Kết quả ghi vào tab "PocLog". Dữ liệu thử được dọn sau khi chạy (file thử vào Thùng rác).
 */

/**
 * Đo từ góc nhìn khách (không token). Drive trả 303 cho cả file công khai lẫn riêng tư nên KHÔNG so với 200:
 * phân loại theo nơi chuyển hướng: accounts.google.com = đòi đăng nhập (riêng tư); *usercontent.google.com = tải được (công khai).
 */
function pocAnon_(fileId) {
  const res = UrlFetchApp.fetch('https://drive.google.com/uc?export=download&id=' + fileId, { muteHttpExceptions: true, followRedirects: false });
  const code = res.getResponseCode();
  const h = res.getAllHeaders();
  const loc = String(h.Location || h.location || '');
  const m = loc.match(/^https?:\/\/([^\/]+)/);
  const host = m ? m[1] : '';
  let cls = 'unknown';
  if (/accounts.google.com/.test(host) || code === 404) cls = 'private';
  else if (/usercontent.google.com|googleusercontent.com/.test(host)) cls = 'public';
  return { cls: cls, code: code, host: host, text: cls + '(' + code + ' ' + host + ')' };
}

/** Sự thật từ Drive API: file có quyền type=anyone không (không phụ thuộc cách đo ẩn danh). */
function pocAnyone_(fileId) {
  const res = driveFetch_('get', DRIVE_API + '/files/' + fileId + '/permissions?fields=permissions(id,type,role)');
  return JSON.parse(res.getContentText()).permissions.some(function (x) { return x.type === 'anyone'; });
}

function pocMakeFile_(name) {
  const res = driveFetch_('post', DRIVE_API + '/files?fields=id', { name: name, parents: [cfg_('IMAGES_FOLDER_ID')], mimeType: 'text/plain' });
  const id = JSON.parse(res.getContentText()).id;
  const mediaId = uuid_();
  const t = nowIso_();
  appendRow_('Media', {
    id: mediaId, provider: 'drive', drive_file_id: id, youtube_id: '', mime_type: 'text/plain', name: name, size_bytes: 0, alt_text: '',
    processing_status: 'ready', managed_by_app: true, app_permission_id: '', visibility_state: 'private', created_at: t, updated_at: t,
  });
  return { mediaId: mediaId, fileId: id };
}

function runPoc() {
  setup();
  const ss = SpreadsheetApp.openById(cfg_('SHEET_ID'));
  const log = ss.getSheetByName('PocLog') || ss.insertSheet('PocLog');
  log.clear();
  log.appendRow(['time', 'test', 'result', 'evidence']);
  const actor = { sub: 'poc-owner' };
  const tag = 'poc-' + Date.now();
  const made = [];
  function rec(name, pass, evidence) { log.appendRow([nowIso_(), name, pass ? 'PASS' : 'FAIL', toCell_(String(evidence))]); }
  function attempt(name, fn) { try { fn(); } catch (e) { rec(name, false, 'EXCEPTION ' + (e.code || '') + ' ' + e.message); } }

  attempt('T1 formula-injection', function () {
    const evil = '=HYPERLINK("http://x","y")';
    const s = adminSaveDraft_(actor, { type: 'project', slug: tag + '-f', draft: { title: evil } });
    made.push(s.id);
    const row = readTable_('Content').filter(function (r) { return r.id === s.id; })[0];
    const cell = sheet_('Content').getRange(row._row, SCHEMA.Content.indexOf('slug') + 1);
    const titleBack = JSON.parse(row.draft_json).title;
    const probe = sheet_('PocLog').getRange('F1');
    probe.setValue(toCell_(evil));
    rec('T1 formula-injection', probe.getFormula() === '' && probe.getValue() === evil && titleBack === evil && cell.getFormula() === '',
      'formula="' + probe.getFormula() + '" value=' + probe.getValue());
    probe.clear();
  });

  attempt('T2 oversize-cell-rejected', function () {
    let code = 'none';
    try { adminSaveDraft_(actor, { type: 'project', slug: tag + '-big', draft: { title: 'x', problem: new Array(CELL_MAX + 10).join('a') } }); } catch (e) { code = e.code; }
    rec('T2 oversize-cell-rejected', code === 'VALIDATION_ERROR', 'code=' + code);
  });

  let A, B, shared, only;
  attempt('T3 draft-not-public', function () {
    shared = pocMakeFile_(tag + '-shared.txt');
    only = pocMakeFile_(tag + '-onlyA.txt');
    A = adminSaveDraft_(actor, { type: 'project', slug: tag + '-a', draft: { title: 'A v1', cover_media_id: shared.mediaId, gallery_media_ids: [only.mediaId] } });
    B = adminSaveDraft_(actor, { type: 'project', slug: tag + '-b', draft: { title: 'B v1', cover_media_id: shared.mediaId } });
    made.push(A.id, B.id);
    const leaked = JSON.stringify(publicList_('project')).indexOf(tag) >= 0;
    rec('T3 draft-not-public', !leaked && pocAnon_(shared.fileId).cls === 'private' && !pocAnyone_(shared.fileId), 'public.list chứa nháp=' + leaked + '; anon=' + pocAnon_(shared.fileId).text + '; permissions anyone=' + pocAnyone_(shared.fileId));
  });

  attempt('T4 publish-shares-only-needed', function () {
    A = adminPublish_(actor, { id: A.id, expectedRevision: A.revision, operationId: tag + '-pa' });
    B = adminPublish_(actor, { id: B.id, expectedRevision: B.revision, operationId: tag + '-pb' });
    const folderPerms = JSON.parse(driveFetch_('get', DRIVE_API + '/files/' + cfg_('IMAGES_FOLDER_ID') + '/permissions?fields=permissions(type)').getContentText()).permissions;
    const folderPublic = folderPerms.some(function (x) { return x.type === 'anyone'; });
    const s1 = pocAnon_(shared.fileId), s2 = pocAnon_(only.fileId);
    const p1 = pocAnyone_(shared.fileId), p2 = pocAnyone_(only.fileId);
    rec('T4 publish-shares-only-needed', s1.cls === 'public' && s2.cls === 'public' && p1 && p2 && !folderPublic && publicList_('project').length >= 2, 'anon shared=' + s1.text + ' onlyA=' + s2.text + '; perm anyone shared=' + p1 + ' onlyA=' + p2 + '; folderPublic=' + folderPublic);
  });

  attempt('T5 edit-draft-keeps-published', function () {
    const s = adminSaveDraft_(actor, { id: A.id, type: 'project', slug: tag + '-a', expectedRevision: A.revision, draft: { title: 'A v2 NHAP', cover_media_id: shared.mediaId, gallery_media_ids: [only.mediaId] } });
    A.revision = s.revision;
    const pub = publicGet_('project', tag + '-a').content.title;
    rec('T5 edit-draft-keeps-published', pub === 'A v1', 'public title=' + pub);
  });

  attempt('T6 stale-revision-conflict', function () {
    let code = 'none';
    try { adminSaveDraft_(actor, { id: A.id, type: 'project', slug: tag + '-a', expectedRevision: A.revision - 1, draft: { title: 'tab cu' } }); } catch (e) { code = e.code; }
    rec('T6 stale-revision-conflict', code === 'REVISION_CONFLICT', 'code=' + code);
  });

  attempt('T7 hide-one-shared-file-stays', function () {
    const r = adminHide_(actor, { id: A.id, operationId: tag + '-ha' });
    const s1 = pocAnon_(shared.fileId), s2 = pocAnon_(only.fileId);
    const p1 = pocAnyone_(shared.fileId), p2 = pocAnyone_(only.fileId);
    let gone = false;
    try { publicGet_('project', tag + '-a'); } catch (e) { gone = e.code === 'NOT_FOUND'; }
    rec('T7 hide-one-shared-file-stays', gone && p1 && !p2 && s1.cls === 'public' && s2.cls === 'private' && r.revokePending.length === 0, 'A gone=' + gone + '; perm anyone shared=' + p1 + ' onlyA=' + p2 + '; anon shared=' + s1.text + ' onlyA=' + s2.text);
  });

  attempt('T8 hide-last-revokes', function () {
    const before = pocAnyone_(shared.fileId); // phải đang công khai thì ca này mới có giá trị
    adminHide_(actor, { id: B.id, operationId: tag + '-hb' });
    const after = pocAnyone_(shared.fileId), s1 = pocAnon_(shared.fileId);
    rec('T8 hide-last-revokes', before === true && after === false && s1.cls === 'private', 'trước ẩn anyone=' + before + '; sau ẩn anyone=' + after + '; anon=' + s1.text);
  });

  attempt('T9 external-permission-untouched', function () {
    const ext = pocMakeFile_(tag + '-external.txt');
    driveFetch_('post', DRIVE_API + '/files/' + ext.fileId + '/permissions', { type: 'anyone', role: 'reader' }); // giả lập quyền cấp ngoài ứng dụng
    let C = adminSaveDraft_(actor, { type: 'project', slug: tag + '-c', draft: { title: 'C', cover_media_id: ext.mediaId } });
    made.push(C.id);
    C = adminPublish_(actor, { id: C.id, expectedRevision: C.revision });
    const row = readTable_('Media').filter(function (r) { return r.id === ext.mediaId; })[0];
    const appOwned = !!row.app_permission_id; // phải rỗng: quyền này không do ứng dụng cấp
    adminHide_(actor, { id: C.id });
    const still = pocAnyone_(ext.fileId), s = pocAnon_(ext.fileId);
    rec('T9 external-permission-untouched', !appOwned && still === true && s.cls === 'public', 'app_permission_id rỗng=' + !appOwned + '; sau ẩn anyone còn=' + still + '; anon=' + s.text);
  });

  attempt('T10 resumable-session-server-init', function () {
    const origin = cfg_('ALLOWED_ORIGINS').split(',')[0].trim();
    const total = 3 * 262144; // 768 KB, gửi 3 khối
    const s = mediaStartUpload_({ name: tag + '-upload.png', mimeType: 'image/png', size: total, origin: origin });
    const chunk = Utilities.newBlob(new Array(262144 + 1).join('a')).getBytes();
    const r1 = UrlFetchApp.fetch(s.uploadUrl, { method: 'put', payload: chunk, headers: { 'Content-Range': 'bytes 0-262143/' + total }, muteHttpExceptions: true });
    let early = 'none';
    try { mediaCompleteUpload_({ mediaId: s.mediaId }); } catch (e) { early = e.code; }
    const q = UrlFetchApp.fetch(s.uploadUrl, { method: 'put', headers: { 'Content-Range': 'bytes */' + total }, muteHttpExceptions: true });
    const range = q.getAllHeaders().Range || q.getAllHeaders().range;
    UrlFetchApp.fetch(s.uploadUrl, { method: 'put', payload: chunk, headers: { 'Content-Range': 'bytes 262144-524287/' + total }, muteHttpExceptions: true });
    const r3 = UrlFetchApp.fetch(s.uploadUrl, { method: 'put', payload: chunk, headers: { 'Content-Range': 'bytes 524288-786431/' + total }, muteHttpExceptions: true });
    const done = mediaCompleteUpload_({ mediaId: s.mediaId });
    rec('T10 resumable-session-server-init', r1.getResponseCode() === 308 && early === 'MEDIA_NOT_READY' && range === 'bytes=0-262143' && done.sizeBytes === total,
      'chunk1=' + r1.getResponseCode() + ' completeSớm=' + early + ' resumeRange=' + range + ' cuối=' + r3.getResponseCode() + ' size=' + done.sizeBytes);
  });

  function putAll_(url, total) {
    const chunk = Utilities.newBlob(new Array(262144 + 1).join('b')).getBytes();
    for (let off = 0; off < total; off += 262144) {
      UrlFetchApp.fetch(url, { method: 'put', payload: chunk, headers: { 'Content-Range': 'bytes ' + off + '-' + (off + 262143) + '/' + total }, muteHttpExceptions: true });
    }
  }

  attempt('T11 session-bound-to-mediaId', function () {
    const origin = cfg_('ALLOWED_ORIGINS').split(',')[0].trim();
    const total = 262144; // cùng dung lượng, cùng thư mục, cùng loại
    const a = mediaStartUpload_({ name: tag + '-A.png', mimeType: 'image/png', size: total, origin: origin });
    const b = mediaStartUpload_({ name: tag + '-B.png', mimeType: 'image/png', size: total, origin: origin });
    putAll_(b.uploadUrl, total); // chỉ phiên B tải xong
    let code = 'none';
    try { mediaCompleteUpload_({ mediaId: a.mediaId, uploadUrl: b.uploadUrl }); } catch (e) { code = e.code; } // client "khai" phiên B cho A
    const rowA = readTable_('Media').filter(function (r) { return r.id === a.mediaId; })[0];
    const okB = mediaCompleteUpload_({ mediaId: b.mediaId });
    rec('T11 session-bound-to-mediaId', code === 'MEDIA_NOT_READY' && !rowA.drive_file_id && okB.status === 'ready',
      'A+phiênB -> ' + code + '; A.drive_file_id="' + rowA.drive_file_id + '"; B -> ' + okB.status);
  });

  attempt('T12 mime-mismatch-rejected', function () {
    const origin = cfg_('ALLOWED_ORIGINS').split(',')[0].trim();
    const total = 262144;
    const s = mediaStartUpload_({ name: tag + '-mime.png', mimeType: 'image/png', size: total, origin: origin });
    putAll_(s.uploadUrl, total);
    const row = readTable_('Media').filter(function (r) { return r.id === s.mediaId; })[0];
    row.mime_type = 'image/jpeg'; // giả lập dữ liệu kỳ vọng khác thực tế
    updateRow_('Media', row._row, row);
    let code = 'none';
    try { mediaCompleteUpload_({ mediaId: s.mediaId }); } catch (e) { code = e.code; }
    rec('T12 mime-mismatch-rejected', code === 'UPLOAD_FAILED', 'code=' + code);
  });

  attempt('T13 expired-session-rejected', function () {
    const origin = cfg_('ALLOWED_ORIGINS').split(',')[0].trim();
    const s = mediaStartUpload_({ name: tag + '-exp.png', mimeType: 'image/png', size: 262144, origin: origin });
    CacheService.getScriptCache().remove('up:' + s.mediaId); // giả lập hết hạn
    let code = 'none';
    try { mediaCompleteUpload_({ mediaId: s.mediaId }); } catch (e) { code = e.code; }
    rec('T13 expired-session-rejected', code === 'UPLOAD_SESSION_EXPIRED', 'code=' + code);
  });

  // Dọn dữ liệu thử: file vào Thùng rác, xóa hàng thử.
  attempt('cleanup', function () {
    readTable_('Media').filter(function (m) { return String(m.name).indexOf(tag) === 0 && m.drive_file_id; }).forEach(function (m) {
      driveFetch_('patch', DRIVE_API + '/files/' + m.drive_file_id, { trashed: true });
    });
    deleteRows_('Media', function (m) { return String(m.name).indexOf(tag) === 0; });
    deleteRows_('MediaRefs', function (r) { return made.indexOf(r.owner_id) >= 0; });
    deleteRows_('Content', function (r) { return made.indexOf(r.id) >= 0; });
    deleteRows_('AuditLog', function (r) { return r.actor_id === 'poc-owner'; });
    rec('cleanup', true, 'đã dọn');
  });
  return 'Xem tab PocLog';
}
