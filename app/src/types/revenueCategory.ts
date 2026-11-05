/**
 * Data contracts for Revenue Category (Danh Mục Thu) sub-module
 * Operating Portal - Finviet / SOHA
 * Connected with Department of Education Database (CSDL Sở) & Managing Portal
 */

export type RevenueCategoryStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

export interface RevenueCategory {
  id: number;
  external_id?: string;
  code: string;
  name: string;
  unit: string;
  legal_reference?: string | null;
  note?: string | null;
  effective_from: string;
  effective_to?: string | null;
  status: RevenueCategoryStatus;
  active: boolean;
  usable: boolean;
  synced_at?: string;
}

export interface RevenueCategoryFilter {
  search?: string;
  status?: number | ''; // 1: active (Đang áp dụng), 0: inactive (Ngừng áp dụng), '': all
  page?: number;
  limit?: number;
}

export interface RevenueCategoryState {
  list: RevenueCategory[];
  dropdownList: RevenueCategory[];
  pagination: {
    total: number;
    count: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
  filter: RevenueCategoryFilter;
  loading: boolean;
  loadingDropdown: boolean;
  syncing: boolean;
  updatingSetting: boolean;
  error: string | null;
}
