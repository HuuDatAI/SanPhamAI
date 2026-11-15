# ADR-0001 — Kiến trúc website portfolio (Giai đoạn 0)

- Trạng thái: **ĐỀ XUẤT — chưa khóa**. Các mục đánh dấu `CHƯA PoC` phải chạy thật trước khi khóa.
- Ngày: 2026-11-15 (Asia/Bangkok)
- Phạm vi: nâng cấp repo `sonreus259-gif/du-an` trên nhánh `feat/portfolio-upgrade`. `main` là production.

## 1. Hiện trạng đã xác minh

| Hạng mục | Kết quả | Cách kiểm |
|---|---|---|
| Repo nguồn | `sonreus259-gif/du-an`, public, nhánh mặc định `main`, 1 commit `a639991` | `gh api repos/...` |
| Triển khai | GitHub Pages kiểu `legacy`, nguồn `main` thư mục `/` → mọi commit vào `main` là deploy ngay | `gh api repos/.../pages` |
| Mã nguồn | 1 tệp `index.html` (HTML/CSS/JS thuần, không build, không README/AGENTS.md) | đọc tệp |
| Dữ liệu hiện tại | Đọc thẳng một Google Sheet **công khai** qua gviz CSV; có seed nhúng sẵn | đọc mã + `curl` |
| Drive | Thư mục gốc + `Videos` + `Images`: chủ sở hữu là tài khoản người dùng, riêng tư, đang trống | Drive metadata/permissions |

Tái sử dụng từ `index.html`: font Be Vietnam Pro/Lexend (hỗ trợ tiếng Việt), hàm chuẩn hóa bỏ dấu để tìm kiếm, tạo slug, escape HTML, trích YouTube ID, nhúng `youtube-nocookie`, trạng thái rỗng, `prefers-reduced-motion`. Không giữ: đọc Sheet công khai, màu riêng cho từng ngành (yêu cầu mới: một màu chủ đạo), nút "Vào dự án" bị vô hiệu thay vì ẩn.

## 2. Quyết định đề xuất

```
Khách ──► GitHub Pages (HTML tĩnh dựng sẵn cho từng URL)
            │  fetch JSON (chỉ snapshot đã xuất bản, whitelist trường)
            ▼
        Apps Script Web App  ── chạy với quyền chủ sở hữu ──► Google Sheet (riêng tư)
            ▲      │                                        └► Drive (file riêng tư; cấp anyone-reader từng file khi xuất bản)
  ID token  │      └─ tạo phiên resumable upload, trả URL phiên
Admin ──────┘
  └── PUT từng khối video thẳng tới Drive (không qua Apps Script)
```

### 2.1 Frontend
- **Astro + TypeScript, xuất tĩnh**, build bằng GitHub Actions rồi deploy lên GitHub Pages của chính repo này.
- Mỗi dự án/khóa học được dựng thành tệp HTML thật (`/du-an/du-an/<slug>/`, `/du-an/khoa-hoc/<slug>/`) → mở trực tiếp và refresh trả HTTP 200, có title/description/OG riêng. Không dùng mẹo `404.html` (trả mã 404, hỏng xem trước liên kết).
- Trang chi tiết sau khi tải sẽ hỏi lại API công khai: nội dung vừa bị ẩn thì hiện "không còn công khai" ngay, không chờ build lại.
- Slug chưa được build (vừa xuất bản, build chưa xong) → trang dự phòng render phía client từ API; slug lạ → trang not-found.
- Seed mẫu nằm sau một service adapter; có nhãn "Minh họa"; đổi sang backend thật bằng cấu hình.
- Trang quản trị là SPA client-side trong cùng site (`/du-an/admin/`), `noindex`. Không chứa dữ liệu nháp trong HTML tĩnh.

### 2.2 Backend: Google Apps Script Web App
- Deploy: **Execute as: Me (chủ sở hữu)**, **Who has access: Anyone**. Sheet và Drive không chia sẻ cho ai.
- Ở chế độ này `Session.getActiveUser()` **không** cho biết danh tính khách → không dùng để xác thực.
- **Xác thực admin**: trình duyệt đăng nhập bằng Google Identity Services, gửi **ID token** kèm mỗi lệnh admin. Backend kiểm tra token qua `https://oauth2.googleapis.com/tokeninfo` (chữ ký, hạn), rồi kiểm `aud` = Client ID của ứng dụng, `iss`, `email_verified`, và `sub`/email khớp allowlist lưu trong Script Properties. Không tin email do client tự khai. Lệnh ghi/report thiếu hoặc sai token → `AUTH_REQUIRED`/`FORBIDDEN`.
- **Đọc công khai**: chỉ trả `published_json` của hàng `status = published` + whitelist settings; cache bằng `CacheService`, khóa theo phiên bản xuất bản.
- **Ghi**: `LockService` + `expected_revision` → `REVISION_CONFLICT` khi hai tab cùng sửa. Chuỗi bắt đầu `= + - @` được vô hiệu hóa công thức trước khi ghi. Kiểm độ dài trước khi ghi (ô Sheets tối đa 50.000 ký tự) — vượt thì báo lỗi, không cắt.
- **Gọi từ trình duyệt**: `fetch` dạng simple request (`Content-Type: text/plain`, không header tùy biến) để không phát sinh preflight; token nằm trong body, không nằm trong URL.

### 2.3 Upload media
- Admin gọi `media.startUpload` → backend (token của chủ sở hữu, phía server) gọi Drive `files?uploadType=resumable` với thư mục đích riêng tư và header `Origin` của site → nhận **URL phiên** → trả cho admin.
- Trình duyệt `PUT` từng khối (bội số 256 KB) thẳng tới URL phiên; hỏi trạng thái bằng `Content-Range: bytes */<tổng>` để tiếp tục sau khi mất mạng; có tiến độ/hủy/thử lại.
- OAuth token của chủ sở hữu **không rời server**. URL phiên chỉ giữ trong bộ nhớ tab admin, không ghi vào Sheet/log/localStorage.
- `media.completeUpload` → backend tự đọc lại metadata file từ Drive (id, kích thước, MIME, thư mục cha) rồi mới ghi `Media`; không tin metadata client gửi.
- Website không đặt trần dung lượng; trần thực tế là dung lượng tài khoản Google. Lỗi hết dung lượng → báo rõ, gợi ý dán link YouTube.
- **Phương án dự phòng** nếu PoC CORS của URL phiên thất bại: admin xin access token phạm vi `drive.file` bằng GIS token client và tự khởi tạo phiên từ trình duyệt (cần thêm bước cấp quyền thư mục).

### 2.4 Xuất bản / ẩn
- Job nhiều pha lưu trong `PublishJobs` với `operation_id`: `VALIDATED → SHARED → COMMITTED → DONE` (ẩn: `UNPUBLISHED → REVOKED → DONE`). Retry cùng `operation_id` chạy tiếp từ pha dở, không tạo quyền trùng.
- Chia sẻ: tạo permission `anyone/reader` **từng file** có `managed_by_app = true`, lưu `app_permission_id`. Không đụng thư mục.
- Thu hồi: chỉ xóa đúng `app_permission_id`, và chỉ khi `MediaRefs` không còn tham chiếu nào từ snapshot đã xuất bản hoặc settings (QR, ảnh profile).
- Lỗi giữa chừng: giữ snapshot cũ, thu hồi quyền vừa cấp mà không còn ai dùng, job ở trạng thái lỗi để retry; admin thấy rõ.
- Sau `COMMITTED`: gọi GitHub `repository_dispatch` để build lại trang tĩnh. Cần một fine-grained token GitHub (chỉ repo này) lưu trong Script Properties — **không** nằm trong repo. Thiếu token thì site vẫn chạy nhờ render dự phòng phía client.
- Giới hạn phải nói với người dùng: file đã công khai có thể đã bị tải về; thu hồi quyền không xóa bản sao đó.

### 2.5 Thống kê
- Client gửi event `{eventId, type: view|zalo_click, entityType, entityId}` bằng `sendBeacon`/`fetch keepalive`, không chờ kết quả → không chặn mở Zalo.
- Chống trùng: 1 lượt xem / nội dung / tab-phiên (sessionStorage, 30 phút); backend bỏ `eventId` đã thấy (CacheService).
- Backend chỉ nhận enum hợp lệ và ID đang published; cộng dồn vào `AnalyticsDaily` dưới `LockService`; ngày theo Asia/Bangkok. Không lưu raw event, IP, fingerprint.
- Mở QR không sinh event `zalo_click`.

## 3. Phương án đã cân nhắc

| Phương án | Kết luận |
|---|---|
| Giữ một `index.html` + Sheet công khai | Loại: lộ Sheet, không có nháp/quyền ghi, không có URL riêng |
| SPA + `404.html` trên Pages | Loại: URL chi tiết trả mã 404, không có OG riêng |
| Admin chạy trong HtmlService của Apps Script | Dự phòng cho xác thực nếu không tạo được OAuth Client; giao diện bị bó trong iframe của Google |
| Cloudflare Pages / Netlify / Vercel (miễn phí) | Khả thi nhưng cần tạo tài khoản mới và đổi hosting → chỉ làm nếu người dùng quyết định (mục 5) |
| Firebase/Cloud Functions | Loại: dễ đòi bật billing |

## 4. Quota và chi phí (đọc lại tài liệu chính thức ngày 2026-11-15)

| Dịch vụ | Giới hạn miễn phí liên quan | Ảnh hưởng |
|---|---|---|
| Apps Script (gmail.com) | 6 phút/lần chạy; 30 lần chạy đồng thời/người; UrlFetch 20.000/ngày, 50 MB/lần; Properties 50.000 đọc-ghi/ngày, 9 KB/giá trị | Đủ cho site nhỏ; lưu lượng tăng đột biến sẽ lỗi tạm → frontend có trạng thái lỗi + thử lại, trang tĩnh vẫn hiện |
| Drive | Dung lượng dùng chung của tài khoản Google (15 GB miễn phí, chung với Gmail/Photos) | Video chiếm dung lượng; hết thì upload lỗi → dùng YouTube |
| Sheets | 10 triệu ô/bảng tính; 50.000 ký tự/ô | Validate độ dài trước ghi |
| GitHub Pages | Site ≤ 1 GB; 100 GB băng thông/tháng (mềm); 10 build/giờ (mềm, không áp cho Actions tùy biến); deploy ≤ 10 phút | Media nằm ở Drive/YouTube nên site rất nhỏ |
| GitHub Actions | Miễn phí cho repo public | Build mỗi lần xuất bản |
| Google Cloud (OAuth Client ID) | Tạo project + OAuth Client không cần billing | Người dùng tự tạo; không bật billing |

Tổng chi phí dự kiến: **0 đồng**, không cần thẻ. Không cam kết miễn phí vĩnh viễn — các nhà cung cấp có thể đổi hạn mức.

Nguồn: `docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits`, `developers.google.com/apps-script/guides/services/quotas`, `developers.google.com/apps-script/guides/web`, `developers.google.com/workspace/drive/api/guides/manage-uploads`, `support.google.com/drive/answer/6374270`.

## 5. Điểm cần người dùng quyết định: điều khoản GitHub Pages

Tài liệu GitHub Pages ghi Pages không dùng làm hosting miễn phí để **chạy online business, site thương mại điện tử, hoặc site chủ yếu nhằm tạo thuận lợi cho giao dịch thương mại / cung cấp SaaS**.

Site này trưng bày dự án và dẫn sang Zalo; không có giỏ hàng, thanh toán hay đơn hàng trên trang. DEV đánh giá đây là portfolio/giới thiệu dịch vụ — loại site rất phổ biến trên Pages — nhưng câu chữ điều khoản không vạch ranh rõ ràng và GitHub là bên có quyền diễn giải.

- **Đề xuất**: giữ GitHub Pages (đúng ưu tiên "giữ hosting hiện tại"), kiến trúc tách backend nên chuyển host sau này chỉ là đổi nơi deploy.
- **Thay thế miễn phí**: Cloudflare Pages (cần tạo tài khoản; repo giữ nguyên).

## 6. Rủi ro còn mở
1. CORS của URL phiên resumable khi phiên do server khởi tạo — phải PoC; đã có phương án dự phòng (2.3).
2. `UrlFetchApp` có cho đặt header `Origin` hay không — phải PoC.
3. Video Drive vừa upload cần thời gian chuyển mã; chia sẻ `anyone` có thể bị chính sách tài khoản chặn — phải PoC.
4. Nhúng video Drive qua iframe `/preview` phụ thuộc cookie bên thứ ba ở một số trình duyệt → luôn có nút "Mở trên Drive".
5. Độ trễ build lại sau xuất bản (ước 1–3 phút) — đã có render dự phòng phía client.

## 7. Trạng thái kiểm chứng

| Hạng mục | Trạng thái | Loại bằng chứng |
|---|---|---|
| Repo, nhánh production, nhánh làm việc | PASS | Thật |
| Production không bị đụng | PASS | Thật |
| Quyền/chủ sở hữu thư mục Drive | PASS | Thật |
| Quota/điều khoản | PASS | Đọc tài liệu chính thức |
| Chỉ một admin ghi được (ID token + allowlist) | **CHƯA PoC — BLOCKED** | Cần Apps Script + OAuth Client ID |
| Đọc công khai không lộ nháp | **CHƯA PoC — BLOCKED** | Cần Apps Script + Sheet |
| Resumable upload lớn, ngắt/tiếp tục | **CHƯA PoC — BLOCKED** | Cần Apps Script có quyền Drive |
| Share/revoke, file dùng chung | **CHƯA PoC — BLOCKED** | Cần Apps Script có quyền Drive |

Cần từ người dùng (không gửi mật khẩu trong chat):
1. Cho phép tạo một Apps Script project + một Google Sheet database mới trong tài khoản chủ Drive, và tự bấm chấp thuận quyền khi Google hỏi.
2. Tự tạo OAuth Client ID (loại Web) trong Google Cloud Console — không bật billing — rồi gửi **Client ID** (không phải secret).
3. Xác nhận tài khoản Google nào là admin duy nhất.
4. Quyết định ở mục 5.

## 8. Bổ sung (BA-005/BA-009): luồng xuất bản tĩnh, ẩn nội dung và giới hạn riêng tư

### 8.1 Luồng đề xuất (CHƯA triển khai; không có dispatch/deploy nào được kích hoạt)
1. Admin bấm **Xuất bản** → backend validate, cấp quyền media, ghi snapshot vào Sheet, đánh dấu `COMMITTED`.
2. Backend gửi `repository_dispatch` (token fine-grained giới hạn đúng repo này, lưu trong Script Properties; **không** ở browser, Sheet hay repo).
3. GitHub Actions: tải toàn bộ snapshot đã xuất bản từ API công khai → `astro build` → deploy Pages. Mỗi lần build **sinh lại toàn bộ** site; slug không còn `published` thì không có tệp HTML.
4. Thời gian có hiệu lực ước tính: build + deploy 1–3 phút, cộng cache CDN của GitHub Pages (thường tối đa ~10 phút). Con số cần đo thật khi được phép chạy workflow.

### 8.2 Ẩn nội dung: điều gì thật sự biến mất, khi nào
| Thành phần | Hiệu lực khi bấm Ẩn |
|---|---|
| API công khai (`public.*`) | Ngay (đọc trực tiếp Sheet, có thể kèm cache ngắn của Apps Script) |
| Quyền Drive của media do ứng dụng cấp | Ngay sau khi thu hồi thành công; thất bại thì hiện trạng thái `REVOKE_FAILED` để retry |
| Tệp HTML đã deploy | **Chưa biến mất** cho tới khi build kế tiếp deploy xong, rồi tới khi CDN hết cache |
| Bản sao ngoài tầm kiểm soát (công cụ tìm kiếm, web archive, ảnh chụp màn hình, bản đã tải) | **Không thu hồi được** |

Kết luận: ẩn ở API **không** làm nội dung trong HTML/cache đã phát hành riêng tư ngay lập tức. Nếu trang chi tiết chỉ che bằng JS khi gọi API, nội dung vẫn nằm trong nguồn HTML — đó chỉ là che UI, không phải thu hồi. Giao diện quản trị phải nói rõ điều này khi Ẩn ("đã gỡ khỏi API; trang tĩnh sẽ cập nhật sau ~X phút").

### 8.3 Đánh giá mô hình "không nhúng nội dung cần thu hồi trong artifact công khai"
- **Mô hình A (đề xuất mặc định)**: HTML tĩnh chứa nội dung đã xuất bản → SEO và xem trước liên kết tốt; chấp nhận độ trễ thu hồi ở bảng 8.2. Phù hợp nội dung vốn dành để công khai (dự án, khóa học giới thiệu).
- **Mô hình B (tùy chọn theo từng mục)**: HTML chỉ là khung (tiêu đề + mô tả ngắn), phần thân tải lúc chạy từ API. Ẩn có hiệu lực gần như ngay với phần thân; đổi lại SEO/OG kém hơn và trang không đọc được khi tắt JS hoặc API lỗi.
- Đề xuất: mặc định A; cho phép đặt cờ "chỉ tải lúc chạy" cho mục nào chủ website muốn thu hồi nhanh. Cần chủ website xác nhận trước khi cài đặt.
- Việc **không nên làm**: coi runtime fetch như cơ chế riêng tư; dùng nó để tuyên bố nội dung "đã xóa".

### 8.4 Ràng buộc upload (cập nhật theo review mã Media.js)
- Phiên resumable được liên kết với `mediaId` **phía server** (CacheService, hết hạn 6 giờ, không ghi Sheet/log). `media.completeUpload` chỉ nhận `mediaId`, bỏ qua mọi URL phiên do client gửi → "mediaId A + phiên B" không thể xảy ra.
- Kiểm `status` HTTP trước khi parse; đối chiếu thư mục cha, chủ sở hữu, dung lượng **và MIME** với giá trị đã khai khi bắt đầu.
- Trạng thái tách bạch: `uploading` → ảnh `ready`; video `processing` → `ready` chỉ khi Drive đã sinh `videoMediaMetadata`. Xuất bản bị chặn (`MEDIA_NOT_READY`) khi video còn `processing`; vẫn cần player có thông báo + nút mở nguồn vì `ready` không bảo đảm phát được trên mọi trình duyệt.
- Trạng thái kiểm chứng: ca T11 (A+B), T12 (sai MIME), T13 (phiên hết hạn) đã viết trong `Poc.js`, **chưa chạy trên Google** — xem TEST_REPORT.
