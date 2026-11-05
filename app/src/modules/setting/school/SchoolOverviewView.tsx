import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSchool,
  faEdit,
  faClock,
  faUserCheck,
  faCircleInfo,
  faGlobe,
  faPhone,
  faEnvelope,
  faLocationDot,
  faLanguage,
  faQuoteLeft,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from '../../../store';
import { EcoButton, EcoBadge } from '../../../components/eco';
import { PageHeader, Button } from '@/components/ds';

export const SchoolOverviewView: React.FC = () => {
  const router = useRouter();
  const { schoolCode } = router.query;
  const sCode = (schoolCode as string) || 'demo';

  const { profile, operatingHours, attendanceRules } = useAppSelector(
    (state) => state.schoolProfile
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Thông tin trường học"
        description="Hồ sơ định danh tổ chức, thời gian vận hành và quy định điểm danh toàn trường"
        actions={
          <Link href={`/${sCode}/setting/school/edit`} style={{ textDecoration: 'none' }}>
            <Button variant="primary" icon="pen">
              Chỉnh sửa
            </Button>
          </Link>
        }
      />

      {/* Grid Layout: Card 1 (Master Identity) & Cards 2, 3 (Operations & Attendance) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Master Institutional Profile */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faSchool} className="text-eco-blue text-sm" />
                <h2 className="text-base font-bold text-gray-900">Thông tin cơ bản</h2>
              </div>
              <EcoBadge variant="info" size="sm">
                Mã: {profile.schoolCode}
              </EcoBadge>
            </div>

            {/* School Brand Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-gray-50/70 p-5 rounded-xl border border-gray-100">
              <div className="w-20 h-20 rounded-xl bg-white border border-gray-200 shadow-xs flex items-center justify-center overflow-hidden shrink-0">
                {profile.logoUrl ? (
                  <img
                    src={profile.logoUrl}
                    alt={profile.name}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <div className="text-center p-2 text-eco-blue">
                    <FontAwesomeIcon icon={faSchool} className="text-3xl" />
                  </div>
                )}
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="text-lg font-bold text-gray-900 leading-snug">{profile.name}</h3>
                {profile.shortName && (
                  <p className="text-sm font-medium text-gray-600">{profile.shortName}</p>
                )}
                {/* Educational Stages (Read-Only) */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-gray-500 font-medium">Cấp đào tạo:</span>
                  {profile.educationStages.map((stage) => (
                    <EcoBadge key={stage} variant="neutral" size="sm">
                      {stage}
                    </EcoBadge>
                  ))}
                  <span className="text-[11px] text-gray-400 italic">
                    (Liên hệ Eco School để thay đổi)
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Properties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3.5 bg-gray-50/50 rounded-lg border border-gray-100 space-y-1">
                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faLocationDot} className="text-gray-400 text-xs" />
                  Địa chỉ
                </span>
                <p className="font-medium text-gray-900 leading-relaxed">
                  {profile.address || '—'}
                </p>
              </div>

              <div className="p-3.5 bg-gray-50/50 rounded-lg border border-gray-100 space-y-1">
                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 text-xs" />
                  Email liên hệ
                </span>
                <p className="font-medium text-gray-900">{profile.email || '—'}</p>
              </div>

              <div className="p-3.5 bg-gray-50/50 rounded-lg border border-gray-100 space-y-1">
                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faPhone} className="text-gray-400 text-xs" />
                  Số điện thoại
                </span>
                <p className="font-medium text-gray-900">{profile.phone || '—'}</p>
              </div>

              <div className="p-3.5 bg-gray-50/50 rounded-lg border border-gray-100 space-y-1">
                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faGlobe} className="text-gray-400 text-xs" />
                  Website
                </span>
                <p className="font-medium text-gray-900">
                  {profile.website ? (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-eco-blue hover:underline inline-flex items-center gap-1"
                    >
                      {profile.website}
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[10px]" />
                    </a>
                  ) : (
                    '—'
                  )}
                </p>
              </div>

              <div className="p-3.5 bg-gray-50/50 rounded-lg border border-gray-100 space-y-1 sm:col-span-2">
                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faQuoteLeft} className="text-gray-400 text-xs" />
                  Khẩu hiệu (Slogan)
                </span>
                <p className="font-medium text-gray-800 italic">
                  {profile.slogan ? `"${profile.slogan}"` : 'Chưa thiết lập'}
                </p>
              </div>

              <div className="p-3.5 bg-gray-50/50 rounded-lg border border-gray-100 space-y-1 sm:col-span-2">
                <span className="text-xs text-gray-500">Thông tin liên hệ bổ sung</span>
                <p className="font-medium text-gray-800">
                  {profile.contactInfo || 'Chưa thiết lập'}
                </p>
              </div>

              <div className="p-3.5 bg-gray-50/50 rounded-lg border border-gray-100 space-y-1 sm:col-span-2 flex items-center justify-between">
                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faLanguage} className="text-gray-400 text-xs" />
                  Ngôn ngữ thông báo mặc định
                </span>
                <EcoBadge variant="neutral" size="sm">
                  {profile.defaultLanguage === 'vi' ? 'Tiếng Việt (vi)' : 'English (en)'}
                </EcoBadge>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Hours & Attendance Rules */}
        <div className="space-y-6">
          {/* Card 2: Giờ hoạt động trường (Weekly Hours) */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="text-emerald-600 text-sm" />
                <h2 className="text-base font-bold text-gray-900">Giờ hoạt động</h2>
              </div>
              <span className="text-xs text-gray-400">Thứ 2 - CN</span>
            </div>

            <div className="space-y-2">
              {operatingHours.map((hour) => (
                <div
                  key={hour.dayOfWeek}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50/60 border border-gray-100 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-semibold text-[11px] ${
                        hour.isOpen
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}
                    >
                      {hour.dayLabel}
                    </span>
                  </div>
                  <div>
                    {hour.isOpen ? (
                      <span className="font-semibold text-gray-800 tracking-wide">
                        {hour.openTime} – {hour.closeTime}
                      </span>
                    ) : (
                      <span className="text-gray-400 font-medium">Không hoạt động</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Quy định điểm danh */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUserCheck} className="text-amber-600 text-sm" />
                <h2 className="text-base font-bold text-gray-900">Quy định điểm danh</h2>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Hình thức điểm danh:</span>
                  <EcoBadge variant="info" size="sm">
                    {attendanceRules.attendanceMode}
                  </EcoBadge>
                </div>
                <div className="text-gray-500 text-[11px] pt-1">
                  <span>Khung giờ: </span>
                  <span className="font-medium text-gray-700">
                    Sáng {attendanceRules.morningSessionTime} | Chiều{' '}
                    {attendanceRules.afternoonSessionTime}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 italic pt-0.5">
                  *{attendanceRules.sessionTimeNotice}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">Quy định đến muộn:</span>
                  {attendanceRules.lateArrivalEnabled ? (
                    <EcoBadge variant="warning" size="sm">
                      Bật ({attendanceRules.lateArrivalThresholdMinutes} phút)
                    </EcoBadge>
                  ) : (
                    <EcoBadge variant="neutral" size="sm">
                      Đang tắt
                    </EcoBadge>
                  )}
                </div>
                <p className="text-gray-500 text-[11px]">
                  {attendanceRules.lateArrivalEnabled
                    ? `Học sinh đến sau giờ quy định ${attendanceRules.lateArrivalThresholdMinutes} phút sẽ tính là đến muộn.`
                    : 'Không tính mốc đến muộn cho học sinh.'}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">Quy định về muộn:</span>
                  {attendanceRules.lateDepartureEnabled ? (
                    <EcoBadge variant="warning" size="sm">
                      Đang bật
                    </EcoBadge>
                  ) : (
                    <EcoBadge variant="neutral" size="sm">
                      Đang tắt
                    </EcoBadge>
                  )}
                </div>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  {attendanceRules.lateDepartureNotice}
                </p>
                {attendanceRules.lateDepartureEnabled && (
                  <div className="pt-1">
                    <Link
                      href={`/${sCode}/setting/fee`}
                      className="text-eco-blue hover:underline inline-flex items-center gap-1 font-medium text-[11px]"
                    >
                      Cài đặt phí trông học sinh về muộn tại đây
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[9px]" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
