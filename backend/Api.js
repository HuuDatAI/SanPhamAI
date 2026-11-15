/**
 * Điểm vào web app.
 *   GET  ?action=public.*            -> chỉ snapshot đã xuất bản
 *   POST text/plain JSON {action, idToken, payload}
 * Mọi action admin.* / media.* đều qua verifyAdmin_ trước khi làm bất cứ việc gì.
 */

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function doGet(e) {
  return handle_(function () {
    const p = (e && e.parameter) || {};
    switch (p.action) {
      case 'public.ping': return { time: nowIso_() };
      case 'public.list': return publicList_(p.type);
      case 'public.get': return publicGet_(p.type, p.slug);
      default: throw new ApiError('NOT_FOUND', 'Không có thao tác này.', false);
    }
  });
}

function doPost(e) {
  return handle_(function () {
    let req;
    try { req = JSON.parse(e.postData.contents); } catch (err) { throw new ApiError('VALIDATION_ERROR', 'Yêu cầu không hợp lệ.', false); }
    const action = String(req.action || '');
    const p = req.payload || {};
    if (!/^(admin|media)\./.test(action)) throw new ApiError('NOT_FOUND', 'Không có thao tác này.', false);
    const actor = verifyAdmin_(req.idToken); // ném AUTH_REQUIRED / FORBIDDEN
    switch (action) {
      case 'admin.whoami': return { admin: true };
      case 'admin.list': return adminList_();
      case 'admin.saveDraft': return adminSaveDraft_(actor, p);
      case 'admin.publish': return adminPublish_(actor, p);
      case 'admin.hide': return adminHide_(actor, p);
      case 'media.startUpload': return mediaStartUpload_(p);
      case 'media.completeUpload': return mediaCompleteUpload_(p);
      default: throw new ApiError('NOT_FOUND', 'Không có thao tác này.', false);
    }
  });
}

/* ---------- Công khai: tuyệt đối không đọc draft_json ---------- */

function publicItem_(row) {
  return {
    id: row.id, type: row.type, slug: row.slug, featured: String(row.featured) === 'true',
    sortOrder: Number(row.sort_order) || 0, publishedAt: row.published_at,
    content: JSON.parse(row.published_json),
  };
}

function publicList_(type) {
  return readTable_('Content')
    .filter(function (r) { return r.status === 'published' && r.published_json && (!type || r.type === type); })
    .sort(function (a, b) { return Number(a.sort_order) - Number(b.sort_order); })
    .map(publicItem_);
}

function publicGet_(type, slug) {
  const row = readTable_('Content').filter(function (r) {
    return r.status === 'published' && r.published_json && r.type === type && r.slug === slug;
  })[0];
  if (!row) throw new ApiError('NOT_FOUND', 'Nội dung không tồn tại hoặc không còn công khai.', false);
  return publicItem_(row);
}

/* ---------- Admin ---------- */

function adminList_() {
  return readTable_('Content').map(function (r) {
    return {
      id: r.id, type: r.type, slug: r.slug, status: r.status, revision: Number(r.revision),
      draft: r.draft_json ? JSON.parse(r.draft_json) : null, hasPublished: !!r.published_json, updatedAt: r.updated_at,
    };
  });
}

function mediaIdsOf_(payload) {
  const out = [];
  if (payload.cover_media_id) out.push({ id: payload.cover_media_id, role: 'cover' });
  (payload.gallery_media_ids || []).forEach(function (id) { out.push({ id: id, role: 'gallery' }); });
  if (payload.video_media_id) out.push({ id: payload.video_media_id, role: 'video' });
  return out;
}

function setRefs_(ownerId, snapshot, payload) {
  deleteRows_('MediaRefs', function (r) { return r.owner_type === 'content' && r.owner_id === ownerId && r.snapshot === snapshot; });
  mediaIdsOf_(payload).forEach(function (x) {
    appendRow_('MediaRefs', { owner_type: 'content', owner_id: ownerId, snapshot: snapshot, media_id: x.id, role: x.role });
  });
}

function adminSaveDraft_(actor, p) {
  if (p.type !== 'project' && p.type !== 'course') throw new ApiError('VALIDATION_ERROR', 'Loại nội dung không hợp lệ.', false);
  if (!SLUG_RE.test(String(p.slug || '')) || p.slug.length > 80) throw new ApiError('VALIDATION_ERROR', 'Slug chỉ gồm chữ thường, số và dấu gạch ngang.', false);
  const draft = p.draft;
  if (!draft || typeof draft !== 'object' || !String(draft.title || '').trim()) throw new ApiError('VALIDATION_ERROR', 'Thiếu tên nội dung.', false);
  return withLock_(function () {
    const rows = readTable_('Content');
    const t = nowIso_();
    if (rows.some(function (r) { return r.type === p.type && r.slug === p.slug && r.id !== p.id; })) {
      throw new ApiError('VALIDATION_ERROR', 'Slug đã được dùng.', false);
    }
    let row;
    if (p.id) {
      row = rows.filter(function (r) { return r.id === p.id; })[0];
      if (!row) throw new ApiError('NOT_FOUND', 'Không tìm thấy nội dung.', false);
      if (Number(row.revision) !== Number(p.expectedRevision)) {
        throw new ApiError('REVISION_CONFLICT', 'Nội dung đã được sửa ở nơi khác. Tải lại trước khi lưu.', false);
      }
      row.slug = p.slug;
      row.draft_json = JSON.stringify(draft);
      row.revision = Number(row.revision) + 1;
      row.updated_at = t;
      updateRow_('Content', row._row, row);
    } else {
      row = {
        id: uuid_(), type: p.type, slug: p.slug, status: 'draft', featured: false, sort_order: rows.length + 1, revision: 1,
        draft_json: JSON.stringify(draft), published_json: '', created_at: t, updated_at: t, published_at: '',
      };
      appendRow_('Content', row);
    }
    setRefs_(row.id, 'draft', draft);
    audit_(actor.sub, 'saveDraft', p.type, row.id, 'ok');
    return { id: row.id, revision: Number(row.revision) };
  });
}

/**
 * Xuất bản (bản PoC Giai đoạn 0; job nhiều pha + retry theo operation_id làm ở Giai đoạn 3).
 * Thứ tự: chia sẻ media -> commit snapshot. Chia sẻ lỗi thì snapshot cũ giữ nguyên và
 * quyền vừa cấp mà không còn tham chiếu công khai sẽ bị thu hồi lại.
 */
function adminPublish_(actor, p) {
  return withLock_(function () {
    const contents = readTable_('Content');
    const row = contents.filter(function (r) { return r.id === p.id; })[0];
    if (!row) throw new ApiError('NOT_FOUND', 'Không tìm thấy nội dung.', false);
    if (Number(row.revision) !== Number(p.expectedRevision)) throw new ApiError('REVISION_CONFLICT', 'Nội dung đã được sửa ở nơi khác.', false);
    const draft = JSON.parse(row.draft_json);
    const medias = readTable_('Media');
    const touched = [];
    try {
      mediaIdsOf_(draft).forEach(function (x) {
        const m = medias.filter(function (r) { return r.id === x.id; })[0];
        if (!m) throw new ApiError('VALIDATION_ERROR', 'Media không tồn tại: ' + x.id, false);
        if (m.provider === 'drive' && m.processing_status !== 'ready') throw new ApiError('MEDIA_NOT_READY', 'Media chưa tải lên xong: ' + m.name, true);
        const before = m.app_permission_id;
        ensurePublic_(m);
        m.updated_at = nowIso_();
        updateRow_('Media', m._row, m);
        if (!before && m.app_permission_id) touched.push(m);
      });
    } catch (err) {
      const refs = readTable_('MediaRefs');
      touched.forEach(function (m) {
        if (publicRefCount_(m.id, contents, refs) === 0) {
          try { revokeAppPermission_(m); m.updated_at = nowIso_(); updateRow_('Media', m._row, m); } catch (e2) { updateRow_('Media', m._row, m); }
        }
      });
      audit_(actor.sub, 'publish', row.type, row.id, 'error', err.code || 'INTERNAL', p.operationId);
      throw err;
    }
    row.published_json = row.draft_json;
    row.status = 'published';
    row.published_at = nowIso_();
    row.updated_at = row.published_at;
    row.revision = Number(row.revision) + 1;
    updateRow_('Content', row._row, row);
    setRefs_(row.id, 'published', draft);
    audit_(actor.sub, 'publish', row.type, row.id, 'ok', '', p.operationId);
    return { id: row.id, revision: Number(row.revision), status: 'published' };
  });
}

/** Ẩn: bỏ khỏi đọc công khai trước, rồi thu hồi quyền của media không còn tham chiếu công khai nào. */
function adminHide_(actor, p) {
  return withLock_(function () {
    const contents = readTable_('Content');
    const row = contents.filter(function (r) { return r.id === p.id; })[0];
    if (!row) throw new ApiError('NOT_FOUND', 'Không tìm thấy nội dung.', false);
    row.status = 'hidden';
    row.updated_at = nowIso_();
    row.revision = Number(row.revision) + 1;
    updateRow_('Content', row._row, row);
    const refs = readTable_('MediaRefs');
    const medias = readTable_('Media');
    const pending = [];
    refs.filter(function (r) { return r.owner_id === row.id && r.snapshot === 'published'; }).forEach(function (r) {
      const m = medias.filter(function (x) { return x.id === r.media_id; })[0];
      if (!m || publicRefCount_(m.id, contents, refs) > 0) return; // còn nội dung công khai khác dùng
      try { revokeAppPermission_(m); } catch (err) { pending.push(m.id); }
      m.updated_at = nowIso_();
      updateRow_('Media', m._row, m);
    });
    audit_(actor.sub, 'hide', row.type, row.id, pending.length ? 'revoke_pending' : 'ok', pending.length ? 'REVOKE_FAILED' : '', p.operationId);
    return { id: row.id, revision: Number(row.revision), status: 'hidden', revokePending: pending };
  });
}
