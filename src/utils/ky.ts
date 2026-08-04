import { formatMonthYear } from './date'

export const DEFAULT_KY = formatMonthYear(new Date())

/** 6 kỳ báo cáo gần nhất (kể cả kỳ hiện tại), định dạng "MM/YYYY". */
export function getKyOptions(): string[] {
  const today = new Date()
  const options: string[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
    options.push(formatMonthYear(d))
  }
  return options
}
