import type { HoSoTruong } from '../types/domain'
import { getCurrentNienKhoa } from '../utils/nienKhoa'

/** Danh sách trường mẫu để chọn ở màn đăng nhập — đa dạng cấp học/hệ thống đối tác để test UI.
 * Đây là bản seed ban đầu cho Hồ sơ trường, người dùng vẫn sửa được sau khi đăng nhập. */
export const MOCK_SCHOOLS: HoSoTruong[] = [
  {
    maTruong: 'MN001',
    tenTruong: 'Trường Mầm non Hoa Sen',
    xaPhuong: 'Phường Bến Nghé',
    capHoc: 'Mầm non',
    heThongDoiTac: 'SSC',
    nienKhoa: getCurrentNienKhoa(),
  },
  {
    maTruong: 'TH001',
    tenTruong: 'Trường Tiểu học Kim Đồng',
    xaPhuong: 'Phường Bến Thành',
    capHoc: 'Tiểu học',
    heThongDoiTac: 'Misa',
    nienKhoa: getCurrentNienKhoa(),
  },
  {
    maTruong: 'TH002',
    tenTruong: 'Trường Tiểu học Nguyễn Bỉnh Khiêm',
    xaPhuong: 'Phường Tân Định',
    capHoc: 'Tiểu học',
    heThongDoiTac: 'Viettel',
    nienKhoa: getCurrentNienKhoa(),
  },
  {
    maTruong: 'THCS001',
    tenTruong: 'Trường THCS Trần Phú',
    xaPhuong: 'Phường Đa Kao',
    capHoc: 'THCS',
    heThongDoiTac: 'VNPT',
    nienKhoa: getCurrentNienKhoa(),
  },
  {
    maTruong: 'THCS002',
    tenTruong: 'Trường THCS Lê Quý Đôn',
    xaPhuong: 'Phường Xuân Hoà',
    capHoc: 'THCS',
    heThongDoiTac: 'eNetViet',
    nienKhoa: getCurrentNienKhoa(),
  },
  {
    maTruong: 'THPT001',
    tenTruong: 'Trường THPT Nguyễn Thị Minh Khai',
    xaPhuong: 'Phường Sài Gòn',
    capHoc: 'THPT',
    heThongDoiTac: 'YoYoSchool',
    nienKhoa: getCurrentNienKhoa(),
  },
  {
    maTruong: 'THPT002',
    tenTruong: 'Trường THPT Bùi Thị Xuân',
    xaPhuong: 'Phường Chợ Quán',
    capHoc: 'THPT',
    heThongDoiTac: 'ECO School',
    nienKhoa: getCurrentNienKhoa(),
  },
  {
    maTruong: 'MN002',
    tenTruong: 'Trường Mầm non Sao Mai',
    xaPhuong: 'Xã Bình Chánh',
    capHoc: 'Mầm non',
    heThongDoiTac: 'Misa',
    nienKhoa: getCurrentNienKhoa(),
  },
]
