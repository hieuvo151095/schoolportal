import { useState } from 'react'

/** Lớp "draft" cục bộ quanh 1 filter đã áp dụng — filter bar chỉnh sửa draft trước, chỉ ghi
 * thật ra ngoài khi gọi apply(). Tự đồng bộ lại draft khi "applied" đổi vì lý do khác (Làm
 * mới, chọn lại context...). Generic, không phụ thuộc router/URL. */
export function useFilterDraft<T extends object>(applied: T): [T, (patch: Partial<T>) => void] {
  const [draft, setDraft] = useState<T>(applied)
  const [appliedSnapshot, setAppliedSnapshot] = useState<T>(applied)

  const appliedKey = JSON.stringify(applied)
  if (appliedKey !== JSON.stringify(appliedSnapshot)) {
    setAppliedSnapshot(applied)
    setDraft(applied)
  }

  function setDraftField(patch: Partial<T>) {
    setDraft((prev) => ({ ...prev, ...patch }))
  }

  return [draft, setDraftField]
}
