# Phân tích website tham khảo (video "Build Cinematic Websites with Claude Code FAST") và cách chuyển thể sang STECH

Ngày: 2026-11-16. Người phân tích: DEV (Claude).

## 1. Cách xem và giới hạn (nói thẳng)
- **Đã xem trực tiếp** video trên Chrome của người dùng (tắt tiếng, nhảy tới từng mốc, chụp khung hình): 1:24, 2:15, 4:50, 5:40, 6:12, 6:18, 6:31, 7:42. Khung video đang ở 480p nên chữ nhỏ trong ảnh không đọc được hết.
- **Chưa đọc transcript** (mở transcript không nằm trong lượt này); các nhận định về lời nói của tác giả lấy từ tài liệu BA (tệp 08), không phải từ chính tôi nghe/đọc.
- **Chưa xem hết video:** chỉ các mốc nêu trên. Hiệu ứng chuyển động (nhịp, easing, thời lượng) **không thể đo từ khung tĩnh**; các thông số motion của STECH là điều chỉnh của riêng tôi, không phải số đo từ mẫu.
- Trình duyệt tích hợp trong ứng dụng bị Google chặn bằng CAPTCHA khi mở YouTube; không vượt CAPTCHA, đã dùng Chrome của người dùng.
- Không mở trang demo của tác giả, không truy cập link quảng cáo hay công cụ trả phí.

## 2. Quan sát (website tham khảo là website thám hiểm núi; chỉ học kỹ thuật thiết kế)
| Hạng mục | Quan sát |
|---|---|
| Bản đầu (1:24, 2:15) | Nền tối, ảnh toàn khổ, chữ tiêu đề rất lớn kiểu hẹp in hoa, nút cam. Đây là bản thử nghiệm; **không** lấy làm chuẩn. |
| Bản cuối: hero (4:50, 6:12) | Nền trời gradient xanh nhạt → trắng. Một chữ khổng lồ ("SUMMIT") nằm **phía sau** chủ thể cắt rời, làm chủ thể "nhô" ra trước chữ; phần chân chủ thể mờ vào lớp mây. Tiêu đề phụ + một dòng mô tả ngắn ở góc trái dưới. |
| Dẫn tới hành động | Ngay dưới tiêu đề phụ có **thanh tìm kiếm dạng viên thuốc** gồm 4 ô chọn + một nút cam hình mũi tên. Một nút nổi bật duy nhất (cam). |
| Header | Logo trái, điều hướng giữa, "Đăng nhập" + nút viền phải. Trên hero: trong suốt; sau khi cuộn: nền xanh navy đậm. Mục đang chọn có gạch dưới. |
| Nhịp nền (6:18 → 6:31) | Hero sáng → khu thẻ nền trắng ngà → khu "hành trình" **nền tối toàn khổ**. Nền đổi giữa các khối để tạo nhịp, không cùng một màu. |
| Dãy thẻ (6:18) | Hàng thẻ dọc cao, ảnh làm nền cả thẻ, nhãn nhỏ góc trên, mũi tên góc phải, tên lớn + 3 thông số nhỏ ở đáy; thẻ ngoài cùng bị cắt ở mép ("peek"); nút ‹ › điều khiển; nút viền "Xem tất cả". |
| Khu tương tác theo cuộn (6:31, 7:42) | Thước độ cao dọc bên trái có điểm đánh dấu dịch theo tiến trình cuộn; tên điểm đến chữ lớn mờ; hàng thông số; cảnh nền đổi theo tiến trình cuộn (ngày → hoàng hôn). Video được "scrub" theo cuộn. |
| Lưới / khoảng cách (5:40, từ mô tả của tác giả) | Lưới 12 cột, lề 56 px, hệ 8 px, chữ nội dung 16 px; thành phần tái sử dụng: Button, Peek Card, Expedition Card, Departure Row. |
| Phân cấp chữ | Tiêu đề lớn có hai cấp rõ (khổng lồ trang trí / vừa mang nội dung), nhãn nhỏ in hoa cách chữ phía trên mỗi khối. |
| Tỷ lệ ảnh–chữ | Ảnh chiếm phần lớn diện tích hero và thẻ; chữ ngắn. |

## 3. Chuyển thể sang STECH
Học cách làm, **không** mang nội dung/hình/tên/mã của mẫu (không núi, bản đồ, độ cao, logo).

| Mẫu | STECH |
|---|---|
| Chữ khổng lồ phía sau chủ thể cắt rời | Chữ "DỰ ÁN" khổng lồ nằm **sau** một tổ hợp 3 cửa sổ phần mềm minh họa nhiều lớp (không dùng ảnh dashboard giả làm bằng chứng; chỉ hình vẽ dạng khung, có nhãn "Hình minh họa") |
| Thanh tìm 4 ô + nút cam | Thanh viên thuốc: tìm kiếm + lọc ngành + lọc loại giải pháp + xóa; thực sự lọc danh sách bên dưới |
| Header trong suốt → navy khi cuộn | Giữ nguyên ý (cần JS; không JS thì header sáng cố định) |
| Hero sáng → thẻ sáng → khu tối | Hero trời nhạt → "Dự án nổi bật" nền navy → "Tất cả dự án" nền xám sáng → băng liên hệ + footer navy |
| Thước độ cao theo cuộn | Thước **tiến trình dự án** 01–05 với điểm đánh dấu dịch theo mục đang xem (thay độ cao bằng số thứ tự) |
| Dãy thẻ "peek" | Không dùng cuộn ngang để tìm dự án (yêu cầu của bạn): danh sách đầy đủ là lưới; "sân khấu" nổi bật chuyển hình theo mục |
| Video scrub theo cuộn | **Chưa làm**: chưa có tệp video phù hợp; dùng chuyển hình theo tiến trình cuộn. Sẽ ghi rõ ở báo cáo. |
| Màu | Nền xám-trắng lạnh `#f5f7fa`, mực `#0b1220`, navy `#0b1424`, **một màu nhấn cam** `#ff6b2c` (nút, trạng thái chọn, điểm đánh dấu, vòng focus). Chữ trên nền cam dùng mực đậm (tương phản đạt); liên kết dùng mực + gạch chân, không dùng chữ cam trên nền sáng (không đủ tương phản). |
| Chữ | Be Vietnam Pro cho nội dung; Barlow Condensed (có tiếng Việt) chỉ cho chữ khổng lồ trang trí và chữ số, vì chữ hẹp in hoa có dấu tiếng Việt khó đọc ở cỡ vừa. |

## 4. Không làm
Không phủ gradient xanh/tím lên toàn trang, không robot/hạt sáng/icon 3D, không chữ cỡ quá lớn ở nội dung chính (phản hồi trước: chữ to, trang dài), không ghim cuộn kéo dài, không hiệu ứng theo chuột.
