import type { HoaDonKhoanPhiRow } from '../types/domain'
import { STORAGE_KEYS } from './keys'

type HoaDonKhoanPhiStore = Record<string, HoaDonKhoanPhiRow[]>

function readStore(): HoaDonKhoanPhiStore {
  const raw = localStorage.getItem(STORAGE_KEYS.hoaDonKhoanPhi)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as HoaDonKhoanPhiStore
  } catch {
    return {}
  }
}

export function getHoaDonKhoanPhiByKy(ky: string): HoaDonKhoanPhiRow[] {
  return readStore()[ky] ?? []
}

export function getHoaDonKhoanPhiBySoHoaDon(ky: string, soHoaDon: string): HoaDonKhoanPhiRow[] {
  return getHoaDonKhoanPhiByKy(ky).filter((row) => row.soHoaDon === soHoaDon)
}

/** Thêm khoản phí vào 1 kỳ. soHoaDon nào xuất hiện trong `rows` thì XOÁ hết khoản phí cũ của đúng
 * soHoaDon đó trước khi thêm rows mới vào (upsert theo lô) — cần thiết vì hoá đơn trùng Mã HĐ với
 * dữ liệu cũ giờ được phép ghi đè (không còn bị chặn tuyệt đối, xem storage/hoaDon.ts
 * saveHoaDonByKy), khoản phí chi tiết theo đó cũng phải đổi theo dữ liệu MỚI, không giữ khoản phí
 * cũ lẫn với khoản phí mới của cùng 1 hoá đơn. soHoaDon hoàn toàn mới thì hành vi y hệt append cũ. */
export function saveHoaDonKhoanPhiByKy(ky: string, rows: HoaDonKhoanPhiRow[]): void {
  const store = readStore()
  const soHoaDonMoi = new Set(rows.map((r) => r.soHoaDon))
  const conLai = (store[ky] ?? []).filter((r) => !soHoaDonMoi.has(r.soHoaDon))
  store[ky] = [...conLai, ...rows]
  localStorage.setItem(STORAGE_KEYS.hoaDonKhoanPhi, JSON.stringify(store))
}
