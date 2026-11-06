---
title: Đặc Tả Đăng Nhập & Xác Thực
type: source
sources:
  - raw/specs/prd-dang-nhap-xac-thuc.md
  - repo:docs/prd/PRD_Dang_Nhap_VI.md
updated: 2026-11-05
---

# Đặc Tả Đăng Nhập & Xác Thực

## Thông tin nguồn
- **Tên tài liệu:** PRD Đăng Nhập & Xác Thực Hệ Thống School Operating Portal
- **Đường dẫn gốc:** `raw/specs/prd-dang-nhap-xac-thuc.md` / `repo:docs/prd/PRD_Dang_Nhap_VI.md`
- **Phiên bản:** v1.0.0
- **Phạm vi:** Xác thực người dùng đa trường, cơ chế SSO, bảo mật khóa tài khoản và kiểm soát phiên JWT

## Nội dung chính
Tài liệu quy định chi tiết luồng xác thực an toàn vào hệ thống School Operating Portal:
1. Đăng nhập truyền thống với định danh mã trường `{schoolCode}`: Kiểm tra hợp lệ tài khoản gắn liền với tenant trường học, phân định vai trò Ban Giám Hiệu, Giáo viên, Kế toán.
2. Đăng nhập một lần (SSO - Single Sign-On): Cho phép quản trị viên từ hệ thống Managing Portal điều hướng trực tiếp sang trường con với phiên đăng nhập hợp lệ.
3. Chống dò mật khẩu (Brute-force): Giới hạn tối đa 5 lần thử sai liên tiếp; khóa tạm thời tài khoản trong 15 phút hoặc yêu cầu CAPTCHA.
4. Quản lý phiên làm việc JWT kép: Access Token có hiệu lực 15 phút; Refresh Token có hiệu lực 7 ngày lưu trữ an toàn trong HttpOnly Cookie; cơ chế Silent Refresh không làm gián đoạn người dùng.
5. Thu hồi phiên đăng nhập từ xa khi phát hiện rủi ro an ninh hoặc khi người dùng thực hiện đổi mật khẩu tài khoản.

## Mã yêu cầu được định nghĩa
| Mã | Tóm tắt quy tắc | Đoạn trong nguồn |
|---|---|---|
| DN-03 | Xác thực đăng nhập một lần SSO (Single Sign-On) tích hợp với hệ thống Managing Portal | §2.2 |
| DN-04 | Cơ chế khóa tạm thời tài khoản chống tấn công dò mật khẩu sau 5 lần thử thất bại | §3.1 |
| DN-05 | Kiểm soát vòng đời phiên làm việc và tự động làm mới JWT Access/Refresh Token | §3.3 |
| DN-06 | Thu hồi phiên làm việc từ xa và đăng xuất an toàn trên toàn bộ thiết bị đang hoạt động | §3.4 |

## Điểm đáng chú ý / mâu thuẫn
- Không có mâu thuẫn nghiệp vụ. Hệ thống áp dụng nghiêm ngặt cơ chế cô lập tenant đa trường (`{schoolCode}`) để ngăn chặn rò rỉ token chéo giữa các cơ sở giáo dục.

## Trang chịu ảnh hưởng
- [Phân hệ Đăng nhập & Xác thực](../overview/module-auth.md)
- [Thực thể Phiên đăng nhập](../entities/auth-session.md)
- [Khái niệm Cô lập đa trường học](../concepts/multi-tenancy-isolation.md)
- [Luồng đăng nhập đa trường](../flows/fl-dang-nhap-da-truong.md)
- [Màn hình đăng nhập](../screens/m7-sm2-dang-nhap.md)
- [Màn hình quản trị tài khoản cá nhân](../screens/m7-sm1-khac.md)
