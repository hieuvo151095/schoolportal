import React from 'react';
import { Icon, SlideOver } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '@/store';
import { closeProfileModal } from '@/store/slices/feedbackSlice';
import { formatFallbackField } from '@/utils/feedbackValidation';

export default function ProfileQuickViewModal() {
  const dispatch = useAppDispatch();
  const { profileModal } = useAppSelector((state) => state.feedback);

  if (!profileModal.data) {
    return null;
  }

  const { type, data } = profileModal;
  const isStudent = type === 'student';

  const handleClose = () => {
    dispatch(closeProfileModal());
  };

  return (
    <SlideOver
      open={profileModal.isOpen}
      onClose={handleClose}
      title={isStudent ? 'Thông tin học sinh' : 'Thông tin phụ huynh'}
      description="Xem nhanh hồ sơ đối tượng liên quan trong luồng góp ý"
      icon={isStudent ? 'graduation-cap' : 'user'}
      width={480}
      secondaryAction={{
        label: 'Đóng',
        onClick: handleClose,
      }}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
          {data.avatarUrl ? (
            <img
              src={data.avatarUrl}
              alt={data.fullName}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-blue-100 text-[#0070CE] flex items-center justify-center text-xl font-bold border-2 border-blue-200">
              <Icon name={isStudent ? 'graduation-cap' : 'user'} size={24} />
            </div>
          )}
          <div>
            <h4 className="text-base font-bold text-slate-800">{data.fullName}</h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {isStudent
                ? `Học sinh lớp ${formatFallbackField(data.className, 'lớp')}`
                : `Mối quan hệ: ${formatFallbackField(data.relationship, 'quan hệ')}`}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Chi tiết hồ sơ
          </h4>

          {isStudent ? (
            <>
              <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl text-xs">
                <span className="text-slate-500 flex items-center gap-2">
                  <Icon name="id-badge" size={14} className="text-slate-400" />
                  Mã học sinh:
                </span>
                <span className="font-bold text-slate-800 font-mono">
                  {formatFallbackField(data.studentCode || data.id, 'mã học sinh')}
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl text-xs">
                <span className="text-slate-500 flex items-center gap-2">
                  <Icon name="graduation-cap" size={14} className="text-slate-400" />
                  Lớp hiện tại:
                </span>
                <span className="font-bold text-[#0070CE]">
                  {formatFallbackField(data.className, 'lớp học')}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl text-xs">
                <span className="text-slate-500 flex items-center gap-2">
                  <Icon name="phone" size={14} className="text-slate-400" />
                  Số điện thoại:
                </span>
                <span className="font-bold text-slate-800">
                  {formatFallbackField(data.phone, 'số điện thoại')}
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl text-xs">
                <span className="text-slate-500 flex items-center gap-2">
                  <Icon name="envelope" size={14} className="text-slate-400" />
                  Email liên hệ:
                </span>
                <span className="font-medium text-slate-800 truncate max-w-[200px]">
                  {formatFallbackField(data.email, 'email')}
                </span>
              </div>
              {data.studentName && (
                <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl text-xs">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Icon name="graduation-cap" size={14} className="text-slate-400" />
                    Phụ huynh của:
                  </span>
                  <span className="font-bold text-[#0070CE]">
                    {data.studentName} ({data.studentClass})
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </SlideOver>
  );
}
