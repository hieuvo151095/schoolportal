import React from 'react';
import { SlideOver, Icon, Avatar } from '@/components/ds';

export interface PersonDetailData {
  name: string;
  code: string;
  roleOrClass: string;
  phone?: string;
  avatarUrl?: string;
  isStaff: boolean;
  totalPresent: number;
  totalAbsentExcused: number;
  totalAbsentUnexcused: number;
  totalLate: number;
  records: Record<string, any>;
}

export interface PersonAttendanceDetailModalProps {
  person: PersonDetailData;
  days: Array<{ date: string; dayNumber: number; weekday: string }>;
  month: number;
  year: number;
  onClose: () => void;
}

export const PersonAttendanceDetailModal: React.FC<PersonAttendanceDetailModalProps> = ({
  person,
  days,
  month,
  year,
  onClose,
}) => {
  const monthDisplay = month < 10 ? `0${month}` : `${month}`;

  return (
    <SlideOver
      open={Boolean(person)}
      onClose={onClose}
      icon="user"
      title={person.name}
      description={`${person.roleOrClass} • Mã: ${person.code}`}
      width={560}
      primaryAction={{
        label: 'Đóng',
        onClick: onClose,
      }}
      secondaryAction={null}
    >
      <div className="space-y-5">
        {/* Person Brief Card */}
        <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
          <Avatar
            name={person.name}
            src={person.avatarUrl}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-900 truncate">{person.name}</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {person.roleOrClass} • Mã định danh: <span className="font-mono font-semibold">{person.code}</span>
            </p>
            {person.phone && (
              <p className="text-xs text-slate-500 mt-0.5">
                Điện thoại: <span className="font-mono">{person.phone}</span>
              </p>
            )}
          </div>
        </div>

        {/* 4 Stat Overview Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 flex flex-col">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Có mặt</span>
            <span className="text-lg font-bold text-emerald-700 mt-1">{person.totalPresent} ngày</span>
          </div>

          <div className="p-3 rounded-xl bg-sky-50 border border-sky-200/80 flex flex-col">
            <span className="text-[11px] font-semibold text-sky-800 uppercase tracking-wider">Vắng có phép</span>
            <span className="text-lg font-bold text-sky-700 mt-1">{person.totalAbsentExcused} ngày</span>
          </div>

          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 flex flex-col">
            <span className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider">Vắng không phép</span>
            <span className="text-lg font-bold text-rose-700 mt-1">{person.totalAbsentUnexcused} ngày</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 flex flex-col">
            <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">Đi / Về muộn</span>
            <span className="text-lg font-bold text-amber-700 mt-1">{person.totalLate} lần</span>
          </div>
        </div>

        {/* Daily Records List */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
          <div className="bg-slate-50 px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              Nhật ký điểm danh tháng {monthDisplay}/{year}
            </span>
            <span className="text-slate-500 font-medium">Tổng: {days.length} ngày</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
            {days.map((d) => {
              const isWeekend = d.weekday === 'T7' || d.weekday === 'CN';
              const rec = person.records[d.date];
              const isPresent = rec?.isPresent ?? (rec?.status === 'present');
              const status = rec?.status || (isPresent ? 'present' : isWeekend ? 'weekend' : 'unmarked');

              return (
                <div
                  key={d.date}
                  className={`flex items-center justify-between px-3.5 py-2 text-xs transition-colors ${
                    isWeekend ? 'bg-slate-50/60' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <span
                      className={`text-[11px] font-bold w-6 ${
                        isWeekend ? 'text-rose-500' : 'text-slate-400'
                      }`}
                    >
                      {d.weekday}
                    </span>
                    <span className="font-medium text-slate-700">
                      {d.dayNumber}/{monthDisplay}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isWeekend ? (
                      <span className="text-[11px] text-slate-400 italic">Nghỉ cuối tuần</span>
                    ) : (
                      <>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            status === 'present'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : status === 'absent_excused'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : status === 'absent_unexcused'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {status === 'present' && <><Icon name="check" size={10} /> Có mặt</>}
                          {status === 'absent_excused' && <><Icon name="clock" size={10} /> Vắng CP</>}
                          {status === 'absent_unexcused' && <><Icon name="triangle-exclamation" size={10} /> Vắng KP</>}
                          {status === 'unmarked' && 'Chưa ghi nhận'}
                        </span>

                        {rec?.checkInTime && (
                          <span className="text-[11px] text-slate-600 font-mono">
                            {rec.checkInTime}
                            {rec.checkOutTime ? ` - ${rec.checkOutTime}` : ''}
                          </span>
                        )}

                        {(rec?.isLateArrival || rec?.isLateDeparture) && (
                          <span
                            title="Đi hoặc về muộn"
                            className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md font-bold"
                          >
                            Muộn
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SlideOver>
  );
};

export default PersonAttendanceDetailModal;
