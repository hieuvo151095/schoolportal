export function formatMonthYear(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${month}/${d.getFullYear()}`
}

export function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString('vi-VN')
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('vi-VN')
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('vi-VN') + ' đ'
}
