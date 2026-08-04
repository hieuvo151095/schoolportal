// Kích thước cột chuẩn dùng chung cho mọi DataGrid trong app — đảm bảo khoảng cách cột
// nhất quán giữa các bảng, và đủ rộng để nội dung (badge trạng thái, tên người...) không
// bị vỡ dòng khi cột co hẹp lại. Đối chiếu đúng theo bộ hằng số tương ứng bên dashportal.
export const COL_MA = { minWidth: 100, defaultWidth: 110 }
export const COL_TEN = { minWidth: 160, defaultWidth: 190 }
export const COL_SO_TIEN = { minWidth: 130, defaultWidth: 150 }
export const COL_NGAY = { minWidth: 110, defaultWidth: 120 }
export const COL_BADGE = { minWidth: 120, defaultWidth: 140 }
export const COL_HANH_DONG = { minWidth: 150, defaultWidth: 160 }
/** Đủ rộng cho badge dài nhất "Thanh toán một phần" không xuống dòng. */
export const COL_TRANG_THAI_RONG = { minWidth: 170, defaultWidth: 190 }
/** Đủ rộng cho "Nguyễn Thị Kế toán / Trần Văn Hiệu phó" trên 1 hàng. */
export const COL_NGUOI_KEP = { minWidth: 280, defaultWidth: 340 }
