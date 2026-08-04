import type { HoSoTruong } from '../types/domain'
import { STORAGE_KEYS } from './keys'

export function getHoSoTruong(): HoSoTruong | null {
  const raw = localStorage.getItem(STORAGE_KEYS.hoSoTruong)
  if (!raw) return null
  try {
    return JSON.parse(raw) as HoSoTruong
  } catch {
    return null
  }
}

export function saveHoSoTruong(hoSo: HoSoTruong): void {
  localStorage.setItem(STORAGE_KEYS.hoSoTruong, JSON.stringify(hoSo))
}
