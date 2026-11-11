import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  ReactNode,
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from 'react';
import { ICONS, resolveIcon, IconName } from './icons';

export interface DropdownOption<T = string> {
  value: T;
  label: string;
  sublabel?: string;
  icon?: IconName | ReactNode;
  disabled?: boolean;
  badge?: string;
  badgeTone?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  [key: string]: any;
}

export interface DropdownProps<T = string> {
  options: Array<string | DropdownOption<T> | { value: T; label: string; [k: string]: any }>;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T, option?: DropdownOption<T>) => void;
  placeholder?: string;
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  clearable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'subtle' | 'ghost' | 'filter';
  prefix?: ReactNode;
  prefixIcon?: IconName;
  suffix?: ReactNode;
  trigger?: ReactNode | ((ctx: { value?: T; isOpen: boolean; selectedOption?: DropdownOption<T> }) => ReactNode);
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  style?: CSSProperties;
  menuStyle?: CSSProperties;
  maxMenuHeight?: number | string;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  fullWidth?: boolean;
  emptyText?: string;
  renderOption?: (option: DropdownOption<T>, isSelected: boolean) => ReactNode;
  name?: string;
  id?: string;
  'aria-label'?: string;
}

function cx(...classes: any[]): string {
  return classes.filter(Boolean).join(' ');
}

function foldText(s: string): string {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

const SvgIcon: React.FC<{ name: string; size?: number; className?: string }> = ({
  name,
  size = 14,
  className,
}) => {
  const key = resolveIcon(name);
  if (!key || !ICONS[key]) return null;
  const d = ICONS[key];
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${d[0]} ${d[1]}`}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={d[2]} />
    </svg>
  );
};

export function Dropdown<T = string>(p: DropdownProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Normalize options
  const normalizedOptions: DropdownOption<T>[] = useMemo(() => {
    return (p.options || []).map((o) => {
      if (typeof o === 'string') {
        return { value: o as unknown as T, label: o };
      }
      return {
        value: o.value,
        label: o.label !== undefined ? String(o.label) : String(o.value),
        sublabel: (o as any).sublabel,
        icon: (o as any).icon,
        disabled: !!(o as any).disabled,
        badge: (o as any).badge,
        badgeTone: (o as any).badgeTone,
      };
    });
  }, [p.options]);

  // Current controlled or default value
  const [internalValue, setInternalValue] = useState<T | undefined>(
    p.value !== undefined ? p.value : p.defaultValue
  );

  const currentValue = p.value !== undefined ? p.value : internalValue;

  const selectedOption = useMemo(() => {
    return normalizedOptions.find(
      (o) => String(o.value) === (currentValue !== undefined ? String(currentValue) : '')
    );
  }, [normalizedOptions, currentValue]);

  const isDefaultOrEmpty = useMemo(() => {
    if (!selectedOption) return true;
    const strVal = String(selectedOption.value);
    const strLabel = String(selectedOption.label);
    const foldedVal = foldText(strVal);
    const foldedLabel = foldText(strLabel);
    if (
      strVal === '' ||
      strVal === 'all' ||
      strVal === 'tat_ca' ||
      foldedVal.startsWith('tat ca') ||
      foldedLabel.startsWith('tat ca')
    ) {
      return true;
    }
    if (p.defaultValue !== undefined && strVal === String(p.defaultValue)) return true;
    if (selectedOption.isPlaceholder) return true;
    return false;
  }, [selectedOption, p.defaultValue]);

  const isPlaceholderActive = !selectedOption || (Boolean(p.placeholder) && isDefaultOrEmpty);

  const displayLabel = useMemo(() => {
    if (p.placeholder && isDefaultOrEmpty) {
      return p.placeholder;
    }
    return selectedOption ? selectedOption.label : p.placeholder || 'Chọn...';
  }, [selectedOption, p.placeholder, isDefaultOrEmpty]);

  // Determine if searchable
  const isSearchable =
    p.searchable === true ||
    (p.searchable === undefined && normalizedOptions.length >= 7);

  // Filter options based on search query
  const q = foldText(searchQuery).trim();
  const filteredOptions = useMemo(() => {
    if (!q) return normalizedOptions;
    return normalizedOptions.filter((o) => {
      const matchLabel = foldText(o.label).includes(q);
      const matchSub = o.sublabel ? foldText(o.sublabel).includes(q) : false;
      return matchLabel || matchSub;
    });
  }, [normalizedOptions, q]);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    if (!isOpen) return;

    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    const onDocKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchQuery('');
        if (triggerRef.current) triggerRef.current.focus();
      }
    };

    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onDocKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onDocKeyDown);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && isSearchable && searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isSearchable]);

  // Handle option selection
  const handleSelect = (opt: DropdownOption<T>) => {
    if (opt.disabled) return;
    if (p.value === undefined) {
      setInternalValue(opt.value);
    }
    if (p.onChange) {
      p.onChange(opt.value, opt);
    }
    setIsOpen(false);
    setSearchQuery('');
    if (triggerRef.current) triggerRef.current.focus();
  };

  // Handle clear selection
  const handleClear = (e: ReactMouseEvent) => {
    e.stopPropagation();
    const emptyVal = '' as unknown as T;
    if (p.value === undefined) {
      setInternalValue(emptyVal);
    }
    if (p.onChange) {
      p.onChange(emptyVal, undefined);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: ReactKeyboardEvent) => {
    if (p.disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, Math.max(filteredOptions.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex]);
      }
    }
  };

  // Determine sizing classes
  const size = p.size || 'md';
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs min-h-[30px] rounded-lg',
    md: 'px-3.5 py-2 text-sm min-h-[38px] rounded-lg',
    lg: 'px-4 py-2.5 text-base min-h-[44px] rounded-xl',
  }[size];

  // Determine variant classes
  const variant = p.variant || 'default';
  const variantClasses = {
    default: cx(
      'bg-white text-slate-800 shadow-2xs hover:border-slate-300',
      isOpen ? 'border-[#0066cc] border-[1.5px] shadow-sm text-slate-900' : 'border border-slate-300'
    ),
    outlined: cx(
      'bg-transparent text-slate-800 hover:border-slate-400',
      isOpen ? 'border-[#0066cc] border-[1.5px]' : 'border border-slate-300'
    ),
    subtle: cx(
      'bg-slate-50 text-slate-800 hover:bg-slate-100/80',
      isOpen ? 'border-[#0066cc] border-[1.5px] bg-white' : 'border border-slate-200/80'
    ),
    ghost: cx(
      'bg-transparent border-0 shadow-none text-slate-800 px-2 py-1.5 hover:bg-slate-50/60 rounded-lg',
      isOpen && 'bg-slate-50'
    ),
    filter: cx(
      'bg-white text-slate-700 text-xs font-medium shadow-2xs hover:border-slate-300 rounded-lg',
      isOpen ? 'border-[#0066cc] border-[1.5px]' : 'border border-slate-200'
    ),
  }[variant];

  const fullWidth = Boolean(p.fullWidth);

  return (
    <div
      ref={rootRef}
      className={cx(
        'ecomd-dropdown relative inline-block text-left',
        isOpen ? 'z-[950] is-open' : 'z-auto',
        fullWidth && 'w-full',
        p.className
      )}
      style={p.style}
    >
      {/* Label */}
      {p.label && (
        <label
          htmlFor={p.id}
          className="block text-xs font-semibold text-slate-700 mb-1.5"
        >
          {p.label}
        </label>
      )}

      {/* Trigger */}
      {typeof p.trigger === 'function' ? (
        p.trigger({ value: currentValue, isOpen, selectedOption })
      ) : p.trigger ? (
        <div onClick={() => !p.disabled && setIsOpen(!isOpen)}>{p.trigger}</div>
      ) : (
        <div
          ref={triggerRef}
          id={p.id}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-disabled={p.disabled}
          aria-label={p['aria-label']}
          tabIndex={p.disabled ? -1 : 0}
          onClick={() => !p.disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={cx(
            'flex items-center justify-between transition-all cursor-pointer outline-none select-none',
            sizeClasses,
            variantClasses,
            p.disabled && 'opacity-50 cursor-not-allowed bg-slate-50',
            p.error && 'border-red-400 focus:border-red-500 focus:ring-red-200',
            p.triggerClassName
          )}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
            {p.prefix && <span className="shrink-0 flex items-center">{p.prefix}</span>}
            {p.prefixIcon && (
              <span className="shrink-0 flex items-center text-slate-400">
                <SvgIcon name={p.prefixIcon} size={size === 'sm' ? 12 : 14} />
              </span>
            )}
            {selectedOption?.icon && (
              <span className="shrink-0 flex items-center text-slate-500">
                {typeof selectedOption.icon === 'string' ? (
                  <SvgIcon name={selectedOption.icon} size={size === 'sm' ? 12 : 14} />
                ) : (
                  selectedOption.icon
                )}
              </span>
            )}
            <span
              className={cx(
                'truncate font-normal block',
                isPlaceholderActive ? 'text-slate-400' : 'text-slate-800 font-medium'
              )}
            >
              {displayLabel}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {p.suffix}
            {p.clearable && selectedOption && !p.disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-slate-300 hover:text-slate-600 p-0.5 rounded-full transition-colors"
                title="Xóa lựa chọn"
              >
                <SvgIcon name="xmark" size={10} />
              </button>
            )}
            <span
              className={cx(
                'text-slate-400 transition-transform duration-200 flex items-center',
                isOpen && 'rotate-180 text-[#006FDA]'
              )}
            >
              <SvgIcon name="chevron-down" size={size === 'sm' ? 10 : 12} />
            </span>
          </div>
        </div>
      )}

      {/* Floating Menu */}
      {isOpen && (
        <div
          role="listbox"
          className={cx(
            'absolute z-[1000] mt-1.5 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden',
            fullWidth ? 'w-full max-w-full left-0 right-0' : '',
            p.placement === 'top-start' || p.placement === 'top-end'
              ? 'bottom-full mb-1.5'
              : 'top-full',
            p.placement === 'bottom-end' || p.placement === 'top-end'
              ? 'right-0'
              : 'left-0',
            p.menuClassName
          )}
          style={{
            width: fullWidth ? '100%' : undefined,
            maxWidth: fullWidth ? '100%' : '100vw',
            minWidth: fullWidth ? '100%' : '200px',
            boxSizing: 'border-box',
            maxHeight: p.maxMenuHeight || 320,
            ...p.menuStyle,
          }}
        >
          {/* Optional Search Bar */}
          {isSearchable && (
            <div className="p-2 border-b border-slate-100 bg-slate-50/70 sticky top-0 z-10">
              <div className="flex items-center px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus-within:border-[#006FDA] focus-within:ring-1 focus-within:ring-[#006FDA]/20">
                <SvgIcon name="search" size={13} className="text-slate-400 mr-2 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  placeholder={p.searchPlaceholder || 'Tìm kiếm...'}
                  className="w-full text-xs bg-transparent outline-none text-slate-800 placeholder-slate-400 font-normal"
                  onClick={(e) => e.stopPropagation()}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="text-slate-400 hover:text-slate-600 p-0.5 ml-1"
                  >
                    <SvgIcon name="xmark" size={11} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto py-1 divide-y divide-slate-50/60">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-slate-400 font-normal">
                {p.emptyText || 'Không có tùy chọn phù hợp'}
              </div>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected =
                  String(opt.value) === (currentValue !== undefined ? String(currentValue) : '');
                const isHighlighted = idx === highlightedIndex;

                if (p.renderOption) {
                  return (
                    <div
                      key={String(opt.value)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(opt);
                      }}
                    >
                      {p.renderOption(opt, isSelected)}
                    </div>
                  );
                }

                return (
                  <div
                    key={String(opt.value)}
                    role="option"
                    aria-selected={isSelected}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(opt);
                    }}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={cx(
                      'px-3.5 py-2.5 text-sm flex items-center justify-between cursor-pointer transition-colors select-none rounded-lg mx-1 my-0.5 min-w-0 max-w-full overflow-hidden',
                      isSelected
                        ? 'bg-[#ebf5ff] text-[#0066cc] font-semibold'
                        : isHighlighted
                        ? 'bg-slate-50 text-slate-900'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900',
                      opt.disabled && 'opacity-40 cursor-not-allowed pointer-events-none'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
                      {opt.icon && (
                        <span
                          className={cx(
                            'shrink-0',
                            isSelected ? 'text-[#0066cc]' : 'text-slate-400'
                          )}
                        >
                          {typeof opt.icon === 'string' ? (
                            <SvgIcon name={opt.icon} size={14} />
                          ) : (
                            opt.icon
                          )}
                        </span>
                      )}
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <div className={cx('truncate', isSelected ? 'font-semibold text-[#0066cc]' : 'font-normal')}>{opt.label}</div>
                        {opt.sublabel && (
                          <div className="text-2xs text-slate-400 truncate mt-0.5 font-normal">
                            {opt.sublabel}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {opt.badge && (
                        <span className="px-1.5 py-0.5 text-2xs rounded bg-slate-100 text-slate-600 font-medium">
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#0066cc] text-white flex items-center justify-center shrink-0 shadow-xs">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Helper text or Error message */}
      {p.error ? (
        <p className="mt-1 text-xs text-red-500 font-medium">{p.error}</p>
      ) : p.helperText ? (
        <p className="mt-1 text-xs text-slate-400">{p.helperText}</p>
      ) : null}

      {/* Hidden input for form support */}
      {p.name && (
        <input
          type="hidden"
          name={p.name}
          value={currentValue !== undefined ? String(currentValue) : ''}
        />
      )}
    </div>
  );
}

// Convenient Alias
export const DropdownSelect = Dropdown;
