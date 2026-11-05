/* [DS] ECO ME DASHBOARD — namespace window.ECOMD */

/** Tên icon Font Awesome 6 Free (Solid) có trong bộ, ví dụ 'magnifying-glass', 'chalkboard-user' — xem ECOMD.Icon.names(); hoặc alias: search, close, menu, more, add, edit, delete, success, error, info, warning. Tên không có: vẽ ô giữ chỗ nét đứt cùng cỡ. */
export type IconName = string;

/* ---------- Nền tảng ---------- */

export interface IconProps {
  name: IconName;
  /** Khung size × size px. Mặc định 16. */
  size?: number;
  /** Mặc định theo màu chữ (currentColor). Ưu tiên token: 'var(--text-subtle)'. */
  color?: string;
  /** Nhãn cho trình đọc màn hình; bỏ trống với icon trang trí. */
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare const Icon: ((props: IconProps) => JSX.Element) & {
  has(name: string): boolean;
  names(): string[];
  aliases(): Record<string, string>;
  /** Thêm icon: { 'tên': [width, height, 'path d'] } (lấy từ @fortawesome/free-solid-svg-icons). */
  register(map: Record<string, [number, number, string]>): void;
  source: { set: string; version: string; license: string; url: string };
};

/* ---------- Hành động ---------- */

export interface ButtonProps {
  /** primary = nền eco-blue-strong (CTA chính, 1 nút/màn) · secondary = nền bg-subtle, viền (công cụ phụ) ·
   *  ghost = không nền, chữ text-nav (nút đóng / huỷ trong popup) · text = chữ nhỏ text-subtle (hành động phụ nhẹ: "Đặt lại bộ lọc"). Mặc định primary. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'text';
  /** Chỉ cho secondary: đang bật (bộ lọc đang áp dụng) — nền semantic-info-soft, chữ eco-blue-strong. */
  active?: boolean;
  /** Chấm 8px eco-blue-strong sau nhãn, báo đang có giá trị (đi với active). */
  indicator?: boolean;
  /** Icon 12px trước (left, mặc định) hoặc sau (right) nhãn. */
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  /** Rộng 100% khung chứa. */
  block?: boolean;
  disabled?: boolean;
  /** Chỉ để vẽ trạng thái trong mockup; hover / focus thật đã tự có. */
  state?: 'default' | 'hover' | 'focus';
  /** Có href: render <a> (bỏ qua khi disabled). */
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare const Button: (props: ButtonProps) => JSX.Element;

export interface IconButtonProps {
  icon: IconName;
  /** Bắt buộc: aria-label và tooltip. */
  label: string;
  /** sm = icon 14px (thao tác hàng, mặc định) · md = icon 16px (AppHeader). Khung luôn 32px. */
  size?: 'sm' | 'md';
  /** Chấm đỏ báo có mục mới. */
  badge?: boolean;
  /** Đang bật: nền bg-muted (nút menu khi sidebar đang thu gọn). Đặt aria-pressed. */
  active?: boolean;
  disabled?: boolean;
  state?: 'default' | 'hover' | 'focus';
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  style?: React.CSSProperties;
}
export declare const IconButton: (props: IconButtonProps) => JSX.Element;

/* ---------- Biểu mẫu ---------- */

export interface SearchFieldProps {
  /** md = trong trang, 14px, tối thiểu 240px (mặc định) · sm = trên AppHeader, 12px, rộng 224px. */
  size?: 'md' | 'sm';
  /** Liệt kê trường tìm được, ví dụ 'Tìm theo tên, mã NV, email, SĐT, CCCD...'. */
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  /** aria-label; mặc định = placeholder. */
  label?: string;
  block?: boolean;
  state?: 'default' | 'focus';
  className?: string;
  style?: React.CSSProperties;
}
export declare const SearchField: (props: SearchFieldProps) => JSX.Element;

export interface SelectFieldProps {
  /** Lựa chọn đầu tiên là mặc định "Tất cả …". */
  options: Array<string | { value: string; label: string }>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, e: React.ChangeEvent<HTMLSelectElement>) => void;
  /** aria-label; mặc định = nhãn lựa chọn đầu. */
  label?: string;
  disabled?: boolean;
  state?: 'default' | 'focus';
  className?: string;
  style?: React.CSSProperties;
}
export declare const SelectField: (props: SelectFieldProps) => JSX.Element;

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  /** Chọn một phần (header bảng khi chỉ vài hàng được chọn). */
  indeterminate?: boolean;
  disabled?: boolean;
  /** Nhãn chữ bên phải; bỏ trống thì bắt buộc aria-label. */
  label?: React.ReactNode;
  /** Dòng mô tả dưới nhãn (nhãn chuyển sang body-sm-medium, checkbox căn đầu dòng). */
  description?: React.ReactNode;
  'aria-label'?: string;
  onChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  style?: React.CSSProperties;
}
export declare const Checkbox: (props: CheckboxProps) => JSX.Element;

/* ---------- Điều hướng ---------- */

export interface AppHeaderProps {
  /** Mặc định 'ECO School Portal'. */
  productName?: string;
  /** Chip ngữ cảnh cạnh tên sản phẩm, ví dụ 'Lớp 1A1'. */
  context?: string;
  tagline?: string;
  /** Icon trên ô logo, mặc định 'school'. */
  logoIcon?: IconName;
  /** Props cho SearchField cỡ sm; false = ẩn ô tìm. */
  search?: SearchFieldProps | false;
  /** Hiện chấm báo mới trên chuông. */
  notification?: boolean;
  onNotification?: (e: React.MouseEvent) => void;
  user?: { name: string; role?: string; avatar?: string };
  /** false = ẩn nút menu. */
  onMenu?: ((e: React.MouseEvent) => void) | false;
  /** Nút menu ở trạng thái đang bật (SidebarNav đang thu gọn). */
  menuActive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export declare const AppHeader: (props: AppHeaderProps) => JSX.Element;

export interface SidebarNavItem {
  key?: string;
  icon: IconName;
  label: string;
  href?: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}
export interface SidebarNavGroup {
  key?: string;
  label?: string;
  icon?: IconName;
  items: SidebarNavItem[];
  defaultExpanded?: boolean;
}
export interface SidebarNavProps {
  /** Nhóm với nhãn VIẾT HOA, ví dụ 'VẬN HÀNH'. */
  groups: SidebarNavGroup[];
  /** key (hoặc label) của mục đang chọn; thay cho item.active. */
  activeKey?: string;
  /** Chỉ để vẽ hover trong mockup. */
  hoverKey?: string;
  /** Dòng nhãn – giá trị ở chân sidebar, ví dụ Niên khóa, Học kỳ. */
  footer?: Array<{ label: string; value: React.ReactNode; tone?: 'default' | 'success' }>;
  /** aria-label của nav, mặc định 'Điều hướng chính'. */
  label?: string;
  /** Thu gọn hoàn toàn (rộng 0), bật / tắt bằng nút menu trên AppHeader. */
  collapsed?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export declare const SidebarNav: (props: SidebarNavProps) => JSX.Element;

/* ---------- Nội dung ---------- */

export interface PageHeaderProps {
  /** Hoa Mỗi Chữ: 'Danh Sách Giáo Viên'. */
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Nút bên phải (ít dùng; CTA chính thường ở FilterBar). */
  actions?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare const PageHeader: (props: PageHeaderProps) => JSX.Element;

export interface StatCardProps {
  label: React.ReactNode;
  value: React.ReactNode;
  icon?: IconName;
  /** neutral (mặc định) · success · info · warning · purple. */
  tone?: 'neutral' | 'success' | 'info' | 'warning' | 'purple';
  className?: string;
  style?: React.CSSProperties;
}
export declare const StatCard: ((props: StatCardProps) => JSX.Element) & {
  /** Lưới StatCard: mặc định 5 cột, 2 cột dưới 640px, gap space-12. */
  Group: (props: { columns?: number; children?: React.ReactNode; className?: string; style?: React.CSSProperties }) => JSX.Element;
};

export interface StatusTagProps {
  /** success (đang hoạt động) · warning (tạm dừng, chờ) · danger (lỗi, huỷ) · info (vai trò chính, đang xử lý) · neutral (mặc định: kết thúc, nháp). */
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  label?: React.ReactNode;
  children?: React.ReactNode;
  /** true = icon mặc định theo tone; tên icon = icon riêng; bỏ trống = không icon. */
  icon?: boolean | IconName;
  className?: string;
  style?: React.CSSProperties;
}
export declare const StatusTag: (props: StatusTagProps) => JSX.Element;

export interface TagProps {
  /** default = lớp, nhãn ngắn · code = mã (mono) · success = lớp chủ nhiệm · warning = chip ngữ cảnh. */
  variant?: 'default' | 'code' | 'success' | 'warning';
  /** Bo tròn hoàn toàn (chip ngữ cảnh trên AppHeader). */
  pill?: boolean;
  label?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare const Tag: (props: TagProps) => JSX.Element;

export interface EmptyValueProps {
  /** Viết 'Chưa …': 'Chưa chủ nhiệm', 'Chưa phân công'. */
  label?: React.ReactNode;
  children?: React.ReactNode;
  /** In nghiêng khi thiếu dữ liệu định danh: 'Chưa có mã nhân viên'. */
  italic?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export declare const EmptyValue: (props: EmptyValueProps) => JSX.Element;

export interface AvatarProps {
  /** Ảnh vuông, ưu tiên khuôn mặt. Không có: hiện chữ cái đầu của tên (chữ đầu của họ tên). */
  src?: string;
  /** Họ tên; dùng làm alt và để lấy chữ cái đầu. */
  name?: string;
  /** Ghi đè chữ cái đầu. */
  initials?: string;
  /** md 40px (bảng, mặc định) · sm 32px (AppHeader). */
  size?: 'md' | 'sm';
  /** Vòng eco-yellow-strong — chỉ cho người đang đăng nhập. */
  ring?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export declare const Avatar: (props: AvatarProps) => JSX.Element;

/* ---------- Mẫu ghép ---------- */

export interface FilterBarProps {
  /** Props cho SearchField; false = không có ô tìm. */
  search?: SearchFieldProps | false;
  /** Mỗi phần tử là props của một SelectField. */
  filters?: SelectFieldProps[];
  /** Nút secondary "Bộ lọc nâng cao"; active = đang có bộ lọc nâng cao (nền xanh nhạt + chấm). */
  advanced?: { label?: string; active?: boolean; onClick?: (e: React.MouseEvent) => void } | false;
  /** CTA primary bên phải; icon mặc định 'plus'. */
  action?: { label: string; icon?: IconName | null; href?: string; onClick?: (e: React.MouseEvent) => void };
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare const FilterBar: (props: FilterBarProps) => JSX.Element;

export interface DataTableColumn<R = any> {
  key: string;
  /** Hoa chữ đầu: 'Mã nhân viên'. */
  title: React.ReactNode;
  align?: 'left' | 'right';
  width?: number | string;
  render?: (row: R, index: number) => React.ReactNode;
}
export interface DataTableProps<R = any> {
  columns: DataTableColumn<R>[];
  rows: R[];
  /** Tên trường hoặc hàm lấy khoá hàng; mặc định chỉ số. */
  rowKey?: string | ((row: R) => string | number);
  /** Cột checkbox đầu bảng. */
  selectable?: boolean;
  selected?: Array<string | number>;
  onSelect?: (keys: Array<string | number>) => void;
  /** aria-label checkbox từng hàng, ví dụ r => 'Chọn giáo viên ' + r.name. */
  rowLabel?: (row: R) => string;
  selectAllLabel?: string;
  /** Nội dung footer, ví dụ <>Hiển thị <b>7</b> giáo viên</>. */
  footer?: React.ReactNode;
  /** Chữ của EmptyState khi không có hàng. */
  emptyText?: React.ReactNode;
  /** Icon của EmptyState, ví dụ 'user-tie'. */
  emptyIcon?: IconName;
  /** Thay toàn bộ nội dung khi bảng rỗng. */
  empty?: React.ReactNode;
  /** Chỉ để vẽ hover một hàng trong mockup. */
  hoverIndex?: number;
  className?: string;
  style?: React.CSSProperties;
}
export declare const DataTable: (<R = any>(props: DataTableProps<R>) => JSX.Element) & {
  /** Ô người: Avatar + tên (link khi có href) + dòng phụ. */
  Person: (props: { name: string; meta?: React.ReactNode; avatar?: string; href?: string }) => JSX.Element;
  /** Nhóm Tag xuống dòng, rộng tối đa 200px. */
  Tags: (props: { children?: React.ReactNode }) => JSX.Element;
  /** IconButton ellipsis-vertical cho cột Thao tác; có items thì bấm mở DropdownMenu. */
  RowAction: (props: { icon?: IconName; label?: string; items?: DropdownMenuItem[]; onClick?: (e: React.MouseEvent) => void; defaultOpen?: boolean; hoverIndex?: number }) => JSX.Element;
};

export interface EmptyStateProps {
  /** Icon 30px màu border-strong; mặc định 'magnifying-glass'; false = không icon. */
  icon?: IconName | false;
  /** Một câu nói rõ không có gì: 'Không tìm thấy giáo viên nào phù hợp'. */
  label?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare const EmptyState: (props: EmptyStateProps) => JSX.Element;

/* ---------- Lớp phủ ---------- */

export type DropdownMenuItem =
  | { icon?: IconName; label: React.ReactNode; onClick?: (e: React.MouseEvent) => void; href?: string; disabled?: boolean;
      /** danger = hành động phá huỷ (chữ + icon text-danger), đặt cuối menu sau một divider. */
      tone?: 'default' | 'danger' }
  | { divider: true };
export interface DropdownMenuProps {
  items: DropdownMenuItem[];
  /** Phần tử bấm để mở (thường là IconButton). Bỏ trống: chỉ vẽ khung menu (mockup). */
  trigger?: React.ReactElement;
  /** Mép căn của menu so với trigger. Mặc định right. */
  align?: 'right' | 'left';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Chỉ để vẽ hover một mục trong mockup. */
  hoverIndex?: number;
  className?: string;
  style?: React.CSSProperties;
}
export declare const DropdownMenu: (props: DropdownMenuProps) => JSX.Element;

export interface PopupModalAction { label: React.ReactNode; icon?: IconName; onClick?: (e: React.MouseEvent) => void; disabled?: boolean }
export interface PopupModalProps {
  /** Mặc định true. */
  open?: boolean;
  /** Icon trong ô 40px nền semantic-info-soft cạnh tiêu đề. */
  icon?: IconName;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Nút X, phím Esc, bấm lớp phủ. false = ẩn nút X. */
  onClose?: ((e?: any) => void) | false;
  /** Nút primary bên phải chân: 'Áp dụng'. */
  primaryAction?: PopupModalAction;
  /** Nút ghost cạnh primary; mặc định { label: 'Đóng', onClick: onClose }; null = ẩn. */
  secondaryAction?: PopupModalAction | null;
  /** Nút text bên trái chân: 'Đặt lại bộ lọc'. */
  extraAction?: PopupModalAction;
  /** Thay toàn bộ chân hành động. */
  footer?: React.ReactNode;
  /** Rộng tối đa; mặc định 448px. */
  width?: number | string;
  /** Bấm lớp phủ để đóng; mặc định true. */
  closeOnOverlay?: boolean;
  /** Vẽ trong khung cha (position absolute) thay vì phủ cả màn — cho mockup. */
  inline?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare const PopupModal: ((props: PopupModalProps) => JSX.Element | null) & {
  /** Nhóm tuỳ chọn có nhãn VIẾT HOA trong thân popup. */
  Section: (props: { label?: React.ReactNode; children?: React.ReactNode }) => JSX.Element;
};

export interface SegmentedControlItem<T extends string = string> {
  key: T;
  label: React.ReactNode;
  icon?: IconName;
  count?: number;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string> {
  items: SegmentedControlItem<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

export declare const SegmentedControl: <T extends string = string>(props: SegmentedControlProps<T>) => JSX.Element;


export interface TextFieldProps {
  label?: React.ReactNode;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: IconName;
  /** Thông báo lỗi dưới ô; đồng thời đổi viền sang đỏ và gắn role="alert". */
  error?: React.ReactNode;
  hint?: React.ReactNode;
  disabled?: boolean;
  autoComplete?: string;
  name?: string;
  autoFocus?: boolean;
  size?: 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}
/** type="password" tự có nút hiện/ẩn mật khẩu. */
export declare const TextField: (props: TextFieldProps) => JSX.Element;

export interface ComboboxOption {
  value: string;
  label: string;
}
export interface ComboboxFieldProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  icon?: IconName;
  label?: React.ReactNode;
  error?: React.ReactNode;
  disabled?: boolean;
  /** Mặc định true: gõ để lọc (không phân biệt dấu). */
  searchable?: boolean;
  emptyText?: string;
  size?: 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}
export declare const ComboboxField: (props: ComboboxFieldProps) => JSX.Element;
