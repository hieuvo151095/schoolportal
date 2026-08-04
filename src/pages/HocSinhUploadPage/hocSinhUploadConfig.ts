import { saveHocSinhByNienKhoa } from '../../storage/hocSinh'
import type { GioiTinh, HocSinhRow } from '../../types/domain'
import type { UploadEntityConfig, UploadFieldConfig } from '../../upload-engine/types'

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
]

export const hocSinhUploadConfig: UploadEntityConfig<HocSinhRow> = {
  entityKey: 'hocSinh',
  entityLabel: 'Học sinh',
  fields,
  uniqueKey: 'maHocSinh',
  contextField: { key: 'nienKhoa', label: 'Niên khoá' },
  buildRow: (row) => ({
    maHocSinh: row.maHocSinh as string,
    hoTen: row.hoTen as string,
    lop: row.lop as string,
    khoi: row.khoi as string,
    gioiTinh: row.gioiTinh as GioiTinh,
  }),
  persist: (rows, nienKhoa) => saveHocSinhByNienKhoa(nienKhoa, rows),
}
