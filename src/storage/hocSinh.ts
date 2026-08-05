import { buildHocSinhSeed } from '../mock-data/hocSinhSeed'
import type { HocSinhRow } from '../types/domain'
import { STORAGE_KEYS } from './keys'

type HocSinhStore = Record<string, HocSinhRow[]>

function readStore(): HocSinhStore {
  const raw = localStorage.getItem(STORAGE_KEYS.hocSinh)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as HocSinhStore
  } catch {
    return {}
  }
}

export function getHocSinhStore(): HocSinhStore {
  return readStore()
}

export function getHocSinhByNienKhoa(nienKhoa: string): HocSinhRow[] {
  return readStore()[nienKhoa] ?? []
}

/** Toàn bộ học sinh (mọi niên khoá) chưa qua module "Đồng bộ" — dùng ở module Đồng bộ. */
export function getHocSinhChoDongBo(): HocSinhRow[] {
  return Object.values(readStore()).flat().filter((row) => !row.daDongBo)
}

/** Tìm 1 học sinh theo Mã HS, không phân biệt niên khoá — dùng để kiểm tra daDongBo của Mã HS
 * mà 1 hoá đơn tham chiếu (xem dongBoLogic.ts). */
export function getHocSinhByMa(maHocSinh: string): HocSinhRow | undefined {
  return Object.values(readStore()).flat().find((row) => row.maHocSinh === maHocSinh)
}

/** Set daDongBo=true cho đúng các học sinh được liệt kê (theo nienKhoa+maHocSinh) — dùng khi xác
 * nhận đồng bộ thành công ở module "Đồng bộ". Bỏ qua bản ghi không tìm thấy (đã bị xoá/đổi). */
export function markHocSinhDaDongBo(items: { nienKhoa: string; maHocSinh: string }[]): void {
  const store = readStore()
  for (const { nienKhoa, maHocSinh } of items) {
    const row = store[nienKhoa]?.find((r) => r.maHocSinh === maHocSinh)
    if (row) row.daDongBo = true
  }
  localStorage.setItem(STORAGE_KEYS.hocSinh, JSON.stringify(store))
}

/** Thêm dữ liệu mới vào danh sách học sinh của 1 niên khoá — nối vào dữ liệu cũ, không xoá dữ
 * liệu đã có (uploadConfig.existingDataCheck đã chặn trùng maHocSinh với dữ liệu cũ từ trước, nên
 * rows truyền vào đây luôn là bản ghi mới hoàn toàn). */
export function saveHocSinhByNienKhoa(nienKhoa: string, rows: HocSinhRow[]): void {
  const store = readStore()
  store[nienKhoa] = [...(store[nienKhoa] ?? []), ...rows]
  localStorage.setItem(STORAGE_KEYS.hocSinh, JSON.stringify(store))
}

/** Sinh sẵn dữ liệu mẫu cho 1 niên khoá nếu chưa có dữ liệu — để Tab "Danh sách" không trống
 * khi demo lần đầu, và làm khoá ngoại sẵn có cho dữ liệu mẫu Hoá đơn. Idempotent. */
export function ensureSeededHocSinh(nienKhoa: string): void {
  const store = readStore()
  if (store[nienKhoa]?.length) return
  store[nienKhoa] = buildHocSinhSeed(nienKhoa)
  localStorage.setItem(STORAGE_KEYS.hocSinh, JSON.stringify(store))
}
