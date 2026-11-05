import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSort,
  faSortUp,
  faSortDown,
  faCheck,
  faClock,
  faEdit,
  faCalendarTimes,
  faLock,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  StaffAttendanceRosterItem,
  StaffRole,
} from '../../../types/staffAttendance';
import {
  getRoleBadgeConfig,
  validateTimeFormat,
  isDateLockedForEdit,
} from '../../../utils/staffAttendanceValidation';

interface StaffAttendanceTableProps {
  roster: StaffAttendanceRosterItem[];
  date: string;
  sortDirection: 'asc' | 'desc';
  activeAbsenceStaffId?: string | null;
  onSortToggle?: () => void;
  onToggleSort?: () => void;
  onCheckIn: (staffId: string) => void;
  onCheckOut: (staffId: string) => void;
  onUpdateTime: (staffId: string, type: 'checkIn' | 'checkOut', time: string) => void;
  onOpenAbsenceModal: (staffId: string) => void;
  onUpdateNote: (staffId: string, note: string) => void;
  onOpenProfile?: (staffId: string) => void;
  onViewProfile?: (staffId: string) => void;
  onToastError?: (msg: string) => void;
}

export const StaffAttendanceTable: React.FC<StaffAttendanceTableProps> = ({
  roster,
  date,
  sortDirection,
  activeAbsenceStaffId = null,
  onSortToggle,
  onToggleSort,
  onCheckIn,
  onCheckOut,
  onUpdateTime,
  onOpenAbsenceModal,
  onUpdateNote,
  onOpenProfile,
  onViewProfile,
  onToastError = () => {},
}) => {
  const handleSort = onToggleSort || onSortToggle || (() => {});
  const handleProfile = onViewProfile || onOpenProfile || (() => {});
  const handleError = onToastError;
  const isLocked = isDateLockedForEdit(date);

  // Local editing states for inline time badges: { `${staffId}-${type}`: timeValue }
  const [editingTimeKey, setEditingTimeKey] = useState<string | null>(null);
  const [editingTimeValue, setEditingTimeValue] = useState<string>('');

  // Local editing states for notes: { [staffId]: noteValue }
  const [editingNoteStaffId, setEditingNoteStaffId] = useState<string | null>(null);
  const [editingNoteValue, setEditingNoteValue] = useState<string>('');

  const handleStartEditingTime = (staffId: string, type: 'checkIn' | 'checkOut', initialTime: string) => {
    if (isLocked) return;
    const key = `${staffId}-${type}`;
    setEditingTimeKey(key);
    setEditingTimeValue(initialTime || '');
  };

  const handleBlurTime = (staffId: string, type: 'checkIn' | 'checkOut', priorTime: string) => {
    if (!editingTimeKey) return;

    const trimmed = editingTimeValue.trim();
    // Format validation (BR04, DD-01)
    if (!validateTimeFormat(trimmed)) {
      handleError('Thời gian không đúng định dạng.');
      // Rollback to prior valid value
      setEditingTimeValue(priorTime);
    } else if (trimmed !== priorTime) {
      onUpdateTime(staffId, type, trimmed);
    }

    setEditingTimeKey(null);
  };

  const handleStartEditingNote = (staffId: string, currentNote: string) => {
    if (isLocked) return;
    setEditingNoteStaffId(staffId);
    setEditingNoteValue(currentNote || '');
  };

  const handleBlurNote = (staffId: string, priorNote: string) => {
    if (editingNoteStaffId !== staffId) return;
    const trimmed = editingNoteValue.trim();
    if (trimmed !== (priorNote || '')) {
      onUpdateNote(staffId, trimmed);
    }
    setEditingNoteStaffId(null);
  };

  return (
    <div className="ecomd-table-card">
      <div className="ecomd-table-scroll">
        <table className="ecomd-table ecomd-table--dense w-full">
          <thead>
            <tr>
              <th scope="col" className="body-xs-semibold text-[var(--text-subtle)]" style={{ width: '48px', textAlign: 'center' }}>
                STT
              </th>
              
              {/* Sortable Nickname Header (BR12) */}
              <th scope="col" className="body-xs-semibold text-[var(--text-subtle)] is-primary" style={{ minWidth: '220px' }}>
                <button
                  type="button"
                  data-testid="sort-nickname-button"
                  onClick={handleSort}
                  className="group inline-flex items-center gap-1.5 font-semibold text-[var(--text-heading)] hover:text-[var(--eco-blue-strong)] focus:outline-none"
                  aria-label="Sắp xếp theo tên nhân viên"
                >
                  <span>Nhân viên</span>
                  <FontAwesomeIcon
                    icon={sortDirection === 'asc' ? faSortUp : faSortDown}
                    className="text-[var(--eco-blue-strong)] text-xs transition-transform"
                  />
                </button>
              </th>

              <th scope="col" className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '130px' }}>
                Vai trò
              </th>
              <th scope="col" className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '140px', textAlign: 'center' }}>
                Check-In
              </th>
              <th scope="col" className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '140px', textAlign: 'center' }}>
                Check-Out
              </th>
              <th scope="col" className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '120px', textAlign: 'center' }}>
                Vắng
              </th>
              <th scope="col" className="body-xs-semibold text-[var(--text-subtle)]" style={{ minWidth: '180px' }}>
                Ghi chú
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {roster.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 px-4 text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faCalendarTimes} className="text-3xl text-gray-300" />
                    <p className="text-sm font-medium">Không tìm thấy nhân viên nào phù hợp với bộ lọc.</p>
                  </div>
                </td>
              </tr>
            ) : (
              roster.map((item, index) => {
                const { staff, attendance } = item;
                const isAbsent = attendance.isAbsent;
                const isCurrentRowAbsenceModalOpen = activeAbsenceStaffId === staff.id;
                // Row action buttons disabled while modal is open (BR06)
                const isRowActionDisabled = isLocked || isAbsent || isCurrentRowAbsenceModalOpen;

                const checkInKey = `${staff.id}-checkIn`;
                const checkOutKey = `${staff.id}-checkOut`;
                const isEditingCheckIn = editingTimeKey === checkInKey;
                const isEditingCheckOut = editingTimeKey === checkOutKey;
                const isEditingNote = editingNoteStaffId === staff.id;

                return (
                  <tr
                    key={staff.id}
                    data-testid={`staff-row-${staff.id}`}
                    className={`hover:bg-gray-50/60 transition-colors ${
                      isAbsent ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    {/* STT */}
                    <td className="px-4 py-3 text-center text-xs text-gray-400 font-medium">
                      {index + 1}
                    </td>

                    {/* Staff Profile (BR11) */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {staff.avatar ? (
                          <img
                            src={staff.avatar}
                            alt={staff.nickname}
                            className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {staff.nickname.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <button
                            type="button"
                            data-testid={`staff-nickname-link-${staff.id}`}
                            onClick={() => handleProfile(staff.id)}
                            className="font-bold text-gray-900 hover:text-blue-600 hover:underline text-sm truncate block text-left"
                            title="Xem thông tin nhân viên"
                          >
                            {staff.nickname}
                          </button>
                          <div className="text-xs text-gray-500 truncate flex items-center gap-2">
                            <span>{staff.name}</span>
                            {staff.code ? (
                              <span className="font-mono text-[11px] bg-gray-100 text-gray-600 px-1 rounded">
                                {staff.code}
                              </span>
                            ) : (
                              <span className="text-[11px] text-gray-400 italic">Chưa có mã NV</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Roles (BR08: Multi-role Badges) */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {staff.roles.map((role: StaffRole) => {
                          const config = getRoleBadgeConfig(role);
                          return (
                            <span
                              key={role}
                              data-testid={`badge-role-${role}`}
                              className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-md border ${config.bg} ${config.text} ${config.border}`}
                            >
                              {config.label}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    {/* Check-In Column (BR03, BR04) */}
                    <td className="px-4 py-3 text-center">
                      {isAbsent ? (
                        <span className="text-xs text-gray-400 italic">—</span>
                      ) : attendance.checkInTime ? (
                        isEditingCheckIn ? (
                          <input
                            type="text"
                            data-testid={`input-checkin-${staff.id}`}
                            autoFocus
                            maxLength={5}
                            value={editingTimeValue}
                            onChange={(e) => setEditingTimeValue(e.target.value)}
                            onBlur={() => handleBlurTime(staff.id, 'checkIn', attendance.checkInTime || '')}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleBlurTime(staff.id, 'checkIn', attendance.checkInTime || '');
                              }
                            }}
                            className="w-18 px-2 py-1 text-xs font-mono font-bold text-center border-2 border-blue-500 rounded-lg focus:outline-none bg-blue-50"
                          />
                        ) : (
                          <button
                            type="button"
                            data-testid={`badge-checkin-${staff.id}`}
                            onClick={() => handleStartEditingTime(staff.id, 'checkIn', attendance.checkInTime || '')}
                            disabled={isLocked}
                            className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 transition-colors ${
                              isLocked ? 'cursor-not-allowed opacity-80' : 'hover:bg-blue-100 hover:border-blue-300'
                            }`}
                            title={isLocked ? 'Đã khóa chỉnh sửa' : 'Nhấp để sửa giờ check-in'}
                          >
                            <FontAwesomeIcon icon={faClock} className="text-[10px] text-blue-500" />
                            <span>{attendance.checkInTime}</span>
                            {!isLocked && (
                              <FontAwesomeIcon
                                icon={faEdit}
                                className="text-[9px] text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                              />
                            )}
                          </button>
                        )
                      ) : (
                        <button
                          type="button"
                          data-testid={`btn-checkin-${staff.id}`}
                          onClick={() => onCheckIn(staff.id)}
                          disabled={isRowActionDisabled}
                          className={`inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 shadow-2xs transition-colors ${
                            isRowActionDisabled
                              ? 'opacity-40 cursor-not-allowed'
                              : 'hover:bg-blue-700 active:scale-98'
                          }`}
                        >
                          <FontAwesomeIcon icon={faCheck} className="text-[11px]" />
                          <span>Check-In</span>
                        </button>
                      )}
                    </td>

                    {/* Check-Out Column (BR03, BR04) */}
                    <td className="px-4 py-3 text-center">
                      {isAbsent ? (
                        <span className="text-xs text-gray-400 italic">—</span>
                      ) : attendance.checkOutTime ? (
                        isEditingCheckOut ? (
                          <input
                            type="text"
                            data-testid={`input-checkout-${staff.id}`}
                            autoFocus
                            maxLength={5}
                            value={editingTimeValue}
                            onChange={(e) => setEditingTimeValue(e.target.value)}
                            onBlur={() => handleBlurTime(staff.id, 'checkOut', attendance.checkOutTime || '')}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleBlurTime(staff.id, 'checkOut', attendance.checkOutTime || '');
                              }
                            }}
                            className="w-18 px-2 py-1 text-xs font-mono font-bold text-center border-2 border-amber-500 rounded-lg focus:outline-none bg-amber-50"
                          />
                        ) : (
                          <button
                            type="button"
                            data-testid={`badge-checkout-${staff.id}`}
                            onClick={() => handleStartEditingTime(staff.id, 'checkOut', attendance.checkOutTime || '')}
                            disabled={isLocked}
                            className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 transition-colors ${
                              isLocked ? 'cursor-not-allowed opacity-80' : 'hover:bg-amber-100 hover:border-amber-300'
                            }`}
                            title={isLocked ? 'Đã khóa chỉnh sửa' : 'Nhấp để sửa giờ check-out'}
                          >
                            <FontAwesomeIcon icon={faClock} className="text-[10px] text-amber-600" />
                            <span>{attendance.checkOutTime}</span>
                            {!isLocked && (
                              <FontAwesomeIcon
                                icon={faEdit}
                                className="text-[9px] text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              />
                            )}
                          </button>
                        )
                      ) : (
                        <button
                          type="button"
                          data-testid={`btn-checkout-${staff.id}`}
                          onClick={() => onCheckOut(staff.id)}
                          disabled={isRowActionDisabled}
                          className={`inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-900 bg-amber-400 shadow-2xs transition-colors ${
                            isRowActionDisabled
                              ? 'opacity-40 cursor-not-allowed'
                              : 'hover:bg-amber-500 active:scale-98'
                          }`}
                        >
                          <FontAwesomeIcon icon={faCheck} className="text-[11px]" />
                          <span>Check-Out</span>
                        </button>
                      )}
                    </td>

                    {/* Vắng Column (BR05, BR06) */}
                    <td className="px-4 py-3 text-center">
                      {isAbsent ? (
                        <button
                          type="button"
                          data-testid={`badge-absence-${staff.id}`}
                          onClick={() => onOpenAbsenceModal(staff.id)}
                          disabled={isLocked}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                            attendance.absenceType === 'khong_phep'
                              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          }`}
                          title="Nhấp để sửa hoặc hủy báo vắng"
                        >
                          <span>
                            {attendance.absenceType === 'khong_phep' ? 'Vắng không phép' : 'Vắng có phép'}
                          </span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          data-testid={`btn-toggle-absence-${staff.id}`}
                          onClick={() => onOpenAbsenceModal(staff.id)}
                          disabled={isLocked}
                          className={`px-3 py-1 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors ${
                            isLocked ? 'cursor-not-allowed opacity-50' : ''
                          }`}
                        >
                          Báo vắng
                        </button>
                      )}
                    </td>

                    {/* Ghi chú Column (BR07: Inline Auto-save on Blur) */}
                    <td className="px-5 py-3">
                      {isEditingNote ? (
                        <input
                          type="text"
                          data-testid={`input-note-${staff.id}`}
                          autoFocus
                          value={editingNoteValue}
                          onChange={(e) => setEditingNoteValue(e.target.value)}
                          onBlur={() => handleBlurNote(staff.id, attendance.generalNote || '')}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleBlurNote(staff.id, attendance.generalNote || '');
                            }
                          }}
                          placeholder="Nhập ghi chú..."
                          className="w-full px-2.5 py-1 text-xs border border-blue-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                        />
                      ) : (
                        <div
                          data-testid={`cell-note-${staff.id}`}
                          onClick={() => handleStartEditingNote(staff.id, attendance.generalNote || '')}
                          className={`group flex items-center justify-between gap-1 py-1 px-2 rounded-lg text-xs transition-colors ${
                            isLocked
                              ? 'text-gray-500'
                              : 'cursor-pointer hover:bg-gray-100/70 text-gray-700'
                          }`}
                          title={isLocked ? 'Đã khóa' : 'Nhấp để chỉnh sửa ghi chú'}
                        >
                          <span className={`truncate max-w-[200px] ${!attendance.generalNote ? 'text-gray-300 italic' : ''}`}>
                            {attendance.generalNote || 'Chưa có ghi chú'}
                          </span>
                          {!isLocked && (
                            <FontAwesomeIcon
                              icon={faEdit}
                              className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            />
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Tally (BR10: Always visible) */}
      <div
        data-testid="attendance-footer-total"
        className="px-6 py-3 bg-gray-50/90 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600 font-semibold"
      >
        <span>Danh sách điểm danh nhân viên</span>
        <span className="text-gray-800">
          Tổng: <span className="font-bold text-blue-600">{roster.length}</span> nhân viên
        </span>
      </div>
    </div>
  );
};
