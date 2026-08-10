import {
  ArrowSyncRegular,
  DataBarVerticalRegular,
  DocumentBulletListRegular,
  FolderRegular,
} from '@fluentui/react-icons'
import type { FluentIcon } from '@fluentui/react-icons'

export interface NavLeaf {
  path: string
  label: string
  icon: FluentIcon
}

export const navTree: NavLeaf[] = [
  { path: '/dashboard', label: 'Tổng quan', icon: DataBarVerticalRegular },
  { path: '/danh-muc-phi', label: 'Danh mục thu', icon: FolderRegular },
  { path: '/hoa-don', label: 'Nhập dữ liệu', icon: DocumentBulletListRegular },
  { path: '/dong-bo', label: 'Nộp báo cáo', icon: ArrowSyncRegular },
]

export interface BreadcrumbTrailItem {
  label: string
  path?: string
}

export function getBreadcrumbTrail(pathname: string): BreadcrumbTrailItem[] {
  const trail: BreadcrumbTrailItem[] = [{ label: 'Trang chủ', path: '/dashboard' }]
  const entry = navTree.find((item) => item.path === pathname)
  if (entry && entry.path !== '/dashboard') {
    trail.push({ label: entry.label })
  }
  return trail
}
