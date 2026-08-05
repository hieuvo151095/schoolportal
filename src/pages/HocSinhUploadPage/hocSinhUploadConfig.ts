import { getHocSinhByNienKhoa, saveHocSinhByNienKhoa } from '../../storage/hocSinh'
import type { GioiTinh, HocSinhRow } from '../../types/domain'
import type { UploadEntityConfig, UploadFieldConfig } from '../../upload-engine/types'
import { getNienKhoaOptions } from '../../utils/nienKhoa'

const NIEN_KHOA_OPTIONS = getNienKhoaOptions()
const GIOI_TINH_LIST: GioiTinh[] = ['Nam', 'Nữ']

const fields: UploadFieldConfig<HocSinhRow>[] = [
  {
    key: 'maHocSinh',
    columnLabel: 'Mã HS',
    type: 'string',
    required: true,
    exampleValues: ['HS0001', 'HS0002'],
  },
  {
    key: 'hoTen',
    columnLabel: 'Họ tên',
    type: 'string',
    required: true,
    exampleValues: ['Nguyễn Văn An', 'Trần Thị Bình'],
  },
  {
    key: 'lop',
    columnLabel: 'Lớp',
    type: 'string',
    required: true,
    exampleValues: ['6A', '6A'],
  },
  {
    key: 'khoi',
    columnLabel: 'Khối',
    type: 'string',
    required: true,
    exampleValues: ['6', '6'],
  },
  {
    key: 'gioiTinh',
    columnLabel: 'Giới tính',
    type: 'enum',
    required: true,
    enumValues: GIOI_TINH_LIST,
    exampleValues: ['Nam', 'Nữ'],
  },
  {
    key: 'nienKhoa',
    columnLabel: 'Niên khoá',
    type: 'enum',
    required: true,
    enumValues: NIEN_KHOA_OPTIONS,
    exampleValues: [NIEN_KHOA_OPTIONS[0], NIEN_KHOA_OPTIONS[0]],
  },
]

export const hocSinhUploadConfig: UploadEntityConfig<HocSinhRow> = {
  entityKey: 'hocSinh',
  entityLabel: 'Học sinh',
  fields,
  uniqueKey: 'maHocSinh',
  existingDataCheck: { key: 'maHocSinh', getExistingRows: (nienKhoa) => getHocSinhByNienKhoa(nienKhoa) },
  contextField: { key: 'nienKhoa', label: 'Niên khoá' },
  buildRow: (row, nienKhoa) => ({
    maHocSinh: row.maHocSinh as string,
    hoTen: row.hoTen as string,
    lop: row.lop as string,
    khoi: row.khoi as string,
    gioiTinh: row.gioiTinh as GioiTinh,
    nienKhoa,
    daDongBo: false,
  }),
  persist: (rows, nienKhoa) => saveHocSinhByNienKhoa(nienKhoa, rows),
}
