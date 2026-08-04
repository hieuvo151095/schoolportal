import { useState } from 'react'

export interface HistoryFilters {
  q: string
  context: string
  tuNgay: string
  denNgay: string
}

export const HISTORY_FILTER_DEFAULTS: HistoryFilters = {
  q: '',
  context: 'all',
  tuNgay: '',
  denNgay: '',
}

export interface HistoryFiltersApi {
  filters: HistoryFilters
  apply: (draft: HistoryFilters) => void
  reset: () => void
}

/** State "đã áp dụng" cho filter bảng Lịch sử đồng bộ — local state (không cần URL, vì mỗi
 * bảng là 1 khối con trong trang, không phải trang riêng cần deep-link). */
export function useHistoryFilters(): HistoryFiltersApi {
  const [filters, setFilters] = useState<HistoryFilters>(HISTORY_FILTER_DEFAULTS)

  return {
    filters,
    apply: (draft) => setFilters(draft),
    reset: () => setFilters(HISTORY_FILTER_DEFAULTS),
  }
}
