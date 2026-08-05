import { getDanhMucPhiByNienKhoa, saveDanhMucPhiByNienKhoa } from '../../storage/danhMucPhi'
import type { UploadEntityConfig, UploadFieldConfig } from '../../upload-engine/types'
import {
  THAM_CHIEU_PHAP_LY_LIST,
  type DanhMucKhoanThu,
  type DonViTinh,
  type KhoanPhiRow,
  type NguonThu,
  type NhomPhi,
} from '../../types/domain'
import { getNienKhoaOptions } from '../../utils/nienKhoa'

const NIEN_KHOA_OPTIONS = getNienKhoaOptions()

const DON_VI_TINH_LIST: DonViTinh[] = ['tháng', 'giờ', 'lần', 'ngày', 'năm', 'chuyến']
const NGUON_THU_LIST: NguonThu[] = ['Học phí', 'Dịch vụ', 'Bán trú']
const NHOM_PHI_LIST: NhomPhi[] = ['Thu theo tháng', 'Thu theo năm', 'Thu không định kỳ']
const DANH_MUC_KHOAN_THU_LIST: DanhMucKhoanThu[] = [
  'Học phí',
  'Bán trú',
  'Đưa đón',
  'Bảo hiểm y tế',
  'Đồng phục',
  'Ngoại khoá',
  'Khoản thu khác',
]

const fields: UploadFieldConfig<KhoanPhiRow>[] = [
  {
    key: 'maPhi',
    columnLabel: 'Mã Phí',
    type: 'string',
    required: true,
    exampleValues: ['HP001', 'BT001'],
  },
  {
    key: 'tenPhi',
    columnLabel: 'Tên phí',
    type: 'string',
    required: true,
    exampleValues: ['Học phí tháng', 'Bán trú'],
  },
  {
    key: 'soTien',
    columnLabel: 'Số tiền',
    type: 'number',
    required: true,
    min: 0,
    exampleValues: ['500000', '300000'],
  },
  {
    key: 'donViTinh',
    columnLabel: 'Đơn vị tính',
    type: 'enum',
    required: true,
    enumValues: DON_VI_TINH_LIST,
    exampleValues: ['tháng', 'tháng'],
  },
  {
    key: 'nguonThu',
    columnLabel: 'Nguồn thu',
    type: 'enum',
    required: true,
    enumValues: NGUON_THU_LIST,
    exampleValues: ['Học phí', 'Bán trú'],
  },
  {
    key: 'nhomPhi',
    columnLabel: 'Nhóm phí',
    type: 'enum',
    required: true,
    enumValues: NHOM_PHI_LIST,
    exampleValues: ['Thu theo tháng', 'Thu theo tháng'],
  },
  {
    key: 'danhMucKhoanThu',
    columnLabel: 'Danh mục khoản thu',
    type: 'enum',
    required: true,
    enumValues: DANH_MUC_KHOAN_THU_LIST,
    exampleValues: ['Học phí', 'Bán trú'],
  },
  {
    key: 'nienKhoa',
    columnLabel: 'Niên khoá',
    type: 'enum',
    required: true,
    enumValues: NIEN_KHOA_OPTIONS,
    exampleValues: [NIEN_KHOA_OPTIONS[0], NIEN_KHOA_OPTIONS[0]],
  },
  {
    key: 'thamChieuPhapLy',
    columnLabel: 'Tham chiếu pháp lý',
    type: 'string',
    required: false,
    exampleValues: [THAM_CHIEU_PHAP_LY_LIST[0], ''],
  },
  {
    key: 'ghiChu',
    columnLabel: 'Ghi chú',
    type: 'string',
    required: false,
    exampleValues: ['Thu theo học kỳ', ''],
  },
]

export const danhMucPhiUploadConfig: UploadEntityConfig<KhoanPhiRow> = {
  entityKey: 'danhMucPhi',
  entityLabel: 'Danh mục Phí',
  fields,
  uniqueKey: 'maPhi',
  existingDataCheck: { key: 'maPhi', getExistingRows: (nienKhoa) => getDanhMucPhiByNienKhoa(nienKhoa) },
  contextField: { key: 'nienKhoa', label: 'Niên khoá' },
  buildRow: (row, nienKhoa) => ({
    maPhi: row.maPhi as string,
    tenPhi: row.tenPhi as string,
    soTien: row.soTien as number,
    donViTinh: row.donViTinh as DonViTinh,
    nguonThu: row.nguonThu as NguonThu,
    nhomPhi: row.nhomPhi as NhomPhi,
    danhMucKhoanThu: row.danhMucKhoanThu as DanhMucKhoanThu,
    nienKhoa,
    thamChieuPhapLy: (row.thamChieuPhapLy as string) || '',
    ghiChu: (row.ghiChu as string) || '',
    daDongBo: false,
  }),
  persist: (rows, nienKhoa) => saveDanhMucPhiByNienKhoa(nienKhoa, rows),
}
