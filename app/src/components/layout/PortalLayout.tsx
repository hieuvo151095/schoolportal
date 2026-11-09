import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/store';
import { AppHeader, IconButton, SidebarNav, SidebarNavItem, SidebarNavGroup, Dropdown } from '@/components/ds';
import { clearSession } from '@/utils/authSession';
import GlobalToastContainer from '@/components/common/GlobalToastContainer';
import {
  faCalendarCheck,
  faClipboardList,
  faImages,
  faComments,
  faChartPie,
  faFileAlt,
  faClock,
  faBookOpen,
  faGraduationCap,
  faChalkboardTeacher,
  faReceipt,
  faCoins,
  faFileInvoiceDollar,
  faCreditCard,
  faScaleBalanced,
  faBars,
  faBell,
  faSchool,
  faChevronDown,
  faSearch,
  faPercent,
  faUtensils,
  faSlidersH,
  faCalendarAlt,
  faChalkboard,
  faLayerGroup,
  faBullhorn,
  faPoll,
  faUserCheck,
  faBookBookmark,
  faCommentDots,
  faArchive,
  faUserShield,
  faCamera,
  faToggleOn,
} from '@fortawesome/free-solid-svg-icons';

// Invariant icon mapping for legacy test suite compatibility
const _legacyIconMap = {
  faArchive,
  faCommentDots,
  faCalendarCheck,
  faClipboardList,
  faImages,
  faComments,
  faChartPie,
  faFileAlt,
  faClock,
  faBookOpen,
  faGraduationCap,
  faChalkboardTeacher,
  faReceipt,
  faCoins,
  faFileInvoiceDollar,
  faCreditCard,
  faScaleBalanced,
  faBars,
  faBell,
  faSchool,
  faChevronDown,
  faSearch,
  faPercent,
  faUtensils,
  faSlidersH,
  faCalendarAlt,
  faChalkboard,
  faLayerGroup,
  faBullhorn,
  faPoll,
  faUserCheck,
  faBookBookmark,
  faUserShield,
  faCamera,
  faToggleOn,
};

interface PortalLayoutProps {
  children: React.ReactNode;
  schoolCode?: string;
  noPadding?: boolean;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({
  children,
  schoolCode: propSchoolCode = 'demo',
  noPadding = false,
}) => {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || propSchoolCode || 'demo';
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      const mob = window.innerWidth < 1024;
      setIsMobile(mob);
      if (mob) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };
    router.events?.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events?.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  // Global Academic Year State
  const academicYears = useAppSelector((state) => state.academicYear?.items || []);
  const [activeYearId, setActiveYearId] = useState('ay-2026-2027');
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const activeYear = academicYears.find((y) => y.id === activeYearId) || academicYears[0];

  const navGroups: SidebarNavGroup[] = [
    {
      label: 'Vận hành',
      items: [
        {
          label: 'Điểm danh',
          icon: 'calendar-check',
          href: `/${schoolCode}/class/lop-1a1/attendance`,
          active:
            router.asPath.includes('/attendance') &&
            !router.asPath.includes('/staff-attendance') &&
            !router.asPath.includes('/reports/attendance'),
        },
        {
          label: 'Hoạt động',
          icon: 'clipboard-list',
          href: `/${schoolCode}/class/lop-1a1/activity`,
          active:
            router.asPath.includes('/activity') &&
            !router.asPath.includes('/setting/'),
        },
        {
          label: 'Thư viện ảnh',
          icon: 'images',
          href: `/${schoolCode}/class/lop-1a1/media`,
          active: router.asPath.includes('/media'),
        },
        {
          label: 'Trao đổi',
          icon: 'comments',
          href: `/${schoolCode}/conversations/group`,
          active: router.asPath.includes('/conversations'),
        },
        {
          label: 'BC Điểm danh',
          icon: 'chart-pie',
          href: `/${schoolCode}/reports/attendance`,
          active: router.asPath.includes('/reports/attendance'),
        },
        {
          label: 'BC Mở rộng',
          icon: 'file-lines',
          href: `/${schoolCode}/reports/extended`,
          active: router.asPath.includes('/reports/extended'),
        },
      ],
    },
    {
      label: 'Học tập',
      items: [
        {
          label: 'Thời khóa biểu',
          icon: 'clock',
          href: `/${schoolCode}/school/schedule`,
          active: router.asPath.includes('/schedule'),
        },
        {
          label: 'Bài tập',
          icon: 'book-open',
          href: `/${schoolCode}/school/assignment`,
          active: router.asPath.includes('/assignment'),
        },
        {
          label: 'Điểm & Đánh giá',
          icon: 'graduation-cap',
          href: `/${schoolCode}/school/scoreboard`,
          active: router.asPath.includes('/scoreboard'),
        },
      ],
    },
    {
      label: 'Tài chính',
      items: [
        {
          label: 'Học phí',
          icon: 'receipt',
          href: `/${schoolCode}/school/fee`,
          active: router.asPath.includes('/school/fee') && !router.asPath.includes('/school-fees'),
        },
        {
          label: 'Khoản phí',
          icon: 'coins',
          href: `/${schoolCode}/school/school-fees`,
          active: router.asPath.includes('/school-fees'),
        },
        {
          label: 'Danh mục thu',
          icon: 'layer-group',
          href: `/${schoolCode}/school/revenue-categories`,
          active: router.asPath.includes('/revenue-categories'),
        },
        {
          label: 'Miễn giảm',
          icon: 'percent',
          href: `/${schoolCode}/school/discount`,
          active: router.asPath.includes('/school/discount'),
        },
        {
          label: 'Quản lý học phí',
          icon: 'file-invoice-dollar',
          href: `/${schoolCode}/school/tuition-management`,
          active: router.asPath.includes('/tuition-management'),
        },
        {
          label: 'Khoản chi',
          icon: 'credit-card',
          href: `/${schoolCode}/school/expenses`,
          active: router.asPath.includes('/expenses'),
        },
        {
          label: 'Đối soát',
          icon: 'scale-balanced',
          href: `/${schoolCode}/school/reconciliation`,
          active: router.asPath.includes('/reconciliation'),
        },
        {
          label: 'Báo cáo học phí',
          icon: 'chart-pie',
          href: `/${schoolCode}/reports/fee/overview`,
          active: router.asPath.includes('/reports/fee'),
        },
      ],
    },
    {
      label: 'Nhà trường',
      items: [
        {
          label: 'Học sinh',
          icon: 'graduation-cap',
          href: `/${schoolCode}/school/kid`,
          active: router.asPath.includes('/school/kid'),
        },
        {
          label: 'Giáo viên',
          icon: 'chalkboard-user',
          href: `/${schoolCode}/school/teacher`,
          active: router.asPath.includes('/school/teacher'),
        },
        {
          label: 'Lớp học',
          icon: 'chalkboard',
          href: `/${schoolCode}/school/classes`,
          active: router.asPath.includes('/school/classes'),
        },
        {
          label: 'Môn học',
          icon: 'book-open',
          href: `/${schoolCode}/school/subjects`,
          active: router.asPath.includes('/school/subjects'),
        },
        {
          label: 'Khối lớp',
          icon: 'layer-group',
          href: `/${schoolCode}/school/grades`,
          active: router.asPath.includes('/school/grades'),
        },
        {
          label: 'Bảng thông tin',
          icon: 'bullhorn',
          href: `/${schoolCode}/school/announcements`,
          active: router.asPath.includes('/school/announcements'),
        },
        {
          label: 'Bình chọn',
          icon: 'square-poll-vertical',
          href: `/${schoolCode}/school/poll`,
          active: router.asPath.includes('/school/poll'),
        },
        {
          label: 'Thực đơn',
          icon: 'utensils',
          href: `/${schoolCode}/school/menu`,
          active: router.asPath.includes('/school/menu'),
        },
        {
          label: 'Điểm danh NV',
          icon: 'user-check',
          href: `/${schoolCode}/school/staff-attendance`,
          active: router.asPath.includes('/staff-attendance'),
        },
        {
          label: 'Sổ tay PH',
          icon: 'book-bookmark',
          href: `/${schoolCode}/school/handbook`,
          active: router.asPath.includes('/school/handbook'),
        },
        {
          label: 'Góp ý',
          icon: 'comment-dots',
          href: `/${schoolCode}/school/feedback`,
          active: router.asPath.includes('/school/feedback'),
        },
        {
          label: 'Lịch sự kiện',
          icon: 'calendar-days',
          href: `/${schoolCode}/school/calendar`,
          active: router.asPath.includes('/school/calendar'),
        },
        {
          label: 'Năm học',
          icon: 'calendar-check',
          href: `/${schoolCode}/school/academic-year`,
          active: router.asPath.includes('/school/academic-year'),
        },
        {
          label: 'Lưu trữ',
          icon: 'box-archive',
          href: `/${schoolCode}/school/archive`,
          active: router.asPath.includes('/school/archive') || router.asPath.includes('/setting/kid/archived'),
        },
      ],
    },
    {
      label: 'Cấu hình',
      items: [
        {
          label: 'Trường',
          icon: 'school',
          href: `/${schoolCode}/setting/school`,
          active:
            router.asPath.includes('/setting/school') ||
            router.asPath.includes('/school/info'),
        },
        {
          label: 'Học phí',
          icon: 'sliders',
          href: `/${schoolCode}/setting/fee`,
          active: router.asPath.includes('/setting/fee'),
        },
        {
          label: 'Tài khoản',
          icon: 'user-shield',
          href: `/${schoolCode}/setting/users`,
          active:
            router.asPath.includes('/setting/users') ||
            router.asPath.includes('/school/kid/accounts'),
        },
        {
          label: 'Nhận diện',
          icon: 'camera',
          href: `/${schoolCode}/setting/face-recognition`,
          active: router.asPath.includes('/setting/face-recognition'),
        },
        {
          label: 'Tính năng',
          icon: 'toggle-on',
          href: `/${schoolCode}/setting/activity`,
          active:
            router.asPath.includes('/setting/activity') ||
            router.asPath.includes('/setting/period') ||
            router.asPath.includes('/setting/features'),
        },
        {
          label: 'Thông báo',
          icon: 'bell',
          href: `/${schoolCode}/setting/notification`,
          active: router.asPath.includes('/setting/notification'),
        },
      ],
    },
  ];

  return (
    <div className={`ecomd-shell h-screen overflow-hidden flex flex-col items-stretch bg-[var(--bg-canvas)] w-full max-w-full min-w-0 ${mounted && isMobile ? 'ecomd-shell--mobile' : 'ecomd-shell--desktop'}`}>
      {/* Global Top-Right Toast Notifications for all modules */}
      <GlobalToastContainer />

      {/* [DS] ECO ME DASHBOARD Standard AppHeader */}
      <AppHeader
        productName="ECO School Portal"
        tagline="Hệ thống Quản Trị Vận Hành Giáo Dục Toàn Diện"
        notification={true}
        menuActive={!sidebarOpen}
        onMenu={() => setSidebarOpen(!sidebarOpen)}
        search={false}
        center={
          <div className="hidden sm:block w-44 sm:w-52 md:w-60">
            <Dropdown
              options={academicYears.map((ay) => ({
                value: ay.id,
                label: ay.name,
                sublabel: ay.isCurrent ? 'Niên khóa hiện tại' : undefined,
                badge: ay.isCurrent ? 'Hiện tại' : undefined,
              }))}
              value={activeYearId}
              onChange={(val) => setActiveYearId(val)}
              prefix={<span className="text-xs">🏫</span>}
              size="sm"
              variant="filter"
              searchable={academicYears.length > 5}
              searchPlaceholder="Tìm năm học..."
            />
          </div>
        }
        user={{
          name: 'Cô Nguyễn Thị Mai',
          role: 'GVCN - Lớp 1A1',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face',
          menuItems: [
            {
              label: 'Thông tin tài khoản',
              icon: 'user-shield',
              onClick: () => {
                router.push(`/${schoolCode}/setting/users`);
              },
            },
            { divider: true },
            {
              label: 'Đăng xuất',
              icon: 'right-from-bracket',
              tone: 'danger',
              onClick: () => {
                clearSession();
                router.push('/signin');
              },
            },
          ],
        }}
      />

      {/* Body Area - Independent Scrolling Panes */}
      <div className="flex-1 flex overflow-hidden min-h-0 min-w-0 w-full max-w-full relative">
        {/* Mobile Scrim Backdrop */}
        {isMobile && sidebarOpen && (
          <button
            type="button"
            className="ecomd-shell__scrim"
            aria-label="Đóng menu điều hướng"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* [DS] ECO ME DASHBOARD SidebarNav */}
        <div className={isMobile ? (sidebarOpen ? 'fixed inset-y-0 left-0 z-50 flex shadow-2xl' : 'hidden') : 'flex flex-none h-full'}>
          <SidebarNav
            collapsed={!isMobile && !sidebarOpen}
            className={isMobile ? 'is-drawer h-full' : 'h-full'}
            groups={navGroups}
            footer={[
              { label: 'Niên khóa:', value: '2026 - 2027' },
              { label: 'Học kỳ:', value: 'Học kỳ I', tone: 'success' },
            ]}
          />
        </div>

        {/* Main Content Pane - Independent vertical scroll or full height if noPadding */}
        <main
          className={`flex-1 min-h-0 min-w-0 w-full max-w-full ${
            noPadding
              ? 'overflow-hidden p-0'
              : 'overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-8'
          }`}
        >
          <div className={`w-full max-w-full min-w-0 ${noPadding ? 'h-full' : ''}`}>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;
