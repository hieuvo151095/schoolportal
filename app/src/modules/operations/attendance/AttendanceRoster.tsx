import React, { useState } from 'react';
import {
  StudentAttendance,
  HealthCondition,
  HEALTH_CONDITIONS,
} from '@/types/attendance';
import { StatusTag, Tag, Avatar, EmptyValue, IconButton, Icon } from '@/components/ds';

interface AttendanceRosterProps {
  students: StudentAttendance[];
  selectedStudentIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (select: boolean) => void;
  onCheckIn: (studentId: string) => void;
  onCheckOut: (studentId: string) => void;
  onUpdateTime?: (studentId: string, type: 'arrivalTime' | 'departureTime', time: string) => void;
  onOpenPickupModal: (student: StudentAttendance) => void;
  onUpdateHealth: (studentId: string, temp: number, condition: HealthCondition) => void;
  onUpdateNotes: (studentId: string, notes: string) => void;
}

export const AttendanceRoster: React.FC<AttendanceRosterProps> = ({
  students,
  selectedStudentIds,
  onToggleSelect,
  onSelectAll,
  onCheckIn,
  onCheckOut,
  onUpdateTime,
  onOpenPickupModal,
  onUpdateHealth,
  onUpdateNotes,
}) => {
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');

  // Inline temperature editing state
  const [editingTempStudentId, setEditingTempStudentId] = useState<string | null>(null);
  const [tempInputValue, setTempInputValue] = useState<string>('');

  // Inline time editing state for arrival / departure
  const [editingTimeKey, setEditingTimeKey] = useState<string | null>(null);
  const [tempTimeValue, setTempTimeValue] = useState<string>('');

  const isAllSelected = students.length > 0 && selectedStudentIds.length === students.length;

  const startEditTime = (studentId: string, type: 'arrivalTime' | 'departureTime', currentTime: string | null) => {
    setEditingTimeKey(`${studentId}-${type}`);
    setTempTimeValue(currentTime || '07:30');
  };

  const saveTime = (studentId: string, type: 'arrivalTime' | 'departureTime', originalTime: string | null) => {
    const trimmed = tempTimeValue.trim();
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (timeRegex.test(trimmed) && trimmed !== originalTime) {
      if (onUpdateTime) {
        onUpdateTime(studentId, type, trimmed);
      }
    }
    setEditingTimeKey(null);
  };

  const startEditNotes = (student: StudentAttendance) => {
    setEditingNotesId(student.studentId);
    setTempNotes(student.notes || '');
  };

  const saveNotes = (studentId: string) => {
    onUpdateNotes(studentId, tempNotes);
    setEditingNotesId(null);
  };

  const startEditTemperature = (student: StudentAttendance) => {
    setEditingTempStudentId(student.studentId);
    setTempInputValue(student.temperature ? student.temperature.toString() : '37.0');
  };

  const saveTemperature = (studentId: string, currentCondition: HealthCondition) => {
    const parsed = parseFloat(tempInputValue);
    if (!isNaN(parsed) && parsed >= 34.0 && parsed <= 43.0) {
      const rounded = Math.round(parsed * 10) / 10;
      const condition = rounded > 37.5 && currentCondition === 'Bình thường' ? 'Cảm sốt' : currentCondition;
      onUpdateHealth(studentId, rounded, condition);
    }
    setEditingTempStudentId(null);
  };

  const renderStatusBadge = (student: StudentAttendance) => {
    switch (student.status) {
      case 'present':
        return <StatusTag tone="success" label="Có mặt" icon />;
      case 'excused_absent':
        return (
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <StatusTag tone="warning" label="Nghỉ có phép" icon />
            {student.refundEligible && (
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--eco-blue-strong)',
                  fontWeight: 600,
                }}
              >
                (Hoàn tiền)
              </span>
            )}
          </div>
        );
      case 'unexcused_absent':
        return <StatusTag tone="danger" label="Nghỉ không phép" icon />;
      case 'unmarked':
      default:
        return <StatusTag tone="neutral" label="Chưa điểm danh" icon />;
    }
  };

  return (
    <div>
      {/* Notice banner for future/unmarked attendance day */}
      {students.length > 0 && students.every((s) => s.status === 'unmarked' && !s.arrivalTime) && (
        <div
          style={{
            background: 'var(--semantic-warning-soft)',
            borderBottom: '1px solid var(--border-warning-soft)',
            padding: 'var(--space-10) var(--space-20)',
            fontSize: '13px',
            color: 'var(--semantic-warning-strong)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-8)',
          }}
        >
          <Icon name="calendar-days" size={16} color="var(--semantic-warning-strong)" />
          <span>
            <strong>Chưa có dữ liệu điểm danh cho ngày này.</strong> Bạn có thể bắt đầu điểm danh đón học sinh bằng nút <strong>&quot;Đón&quot;</strong> trên từng hàng hoặc chọn nhiều em để <strong>&quot;Đón hàng loạt&quot;</strong>.
          </span>
        </div>
      )}

      <div className="ecomd-table-scroll">
        <table className="ecomd-table ecomd-table--dense">
          <thead>
            <tr>
              <th className="is-check" style={{ width: '36px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: 'var(--eco-blue-strong)',
                    cursor: 'pointer',
                  }}
                />
              </th>
              <th style={{ width: '36px', textAlign: 'center' }} className="body-xs-semibold">STT</th>
              <th style={{ minWidth: '190px' }} className="is-primary body-xs-semibold">Học sinh</th>
              <th style={{ minWidth: '100px' }} className="body-xs-semibold">Giờ đón</th>
              <th style={{ minWidth: '110px' }} className="body-xs-semibold">Giờ trả</th>
              <th style={{ minWidth: '130px' }} className="body-xs-semibold">Người đón</th>
              <th style={{ width: '120px' }} className="body-xs-semibold" title="Sức khỏe & Thân nhiệt">Sức khỏe</th>
              <th style={{ minWidth: '140px' }} className="body-xs-semibold">Ghi chú</th>
              <th style={{ minWidth: '110px', textAlign: 'center' }} className="body-xs-semibold">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: 'var(--space-48) var(--space-20)', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-8)' }}>
                    <Icon name="users" size={32} color="var(--text-muted)" />
                    <span className="title-md" style={{ color: 'var(--text-heading)' }}>
                      Không tìm thấy học sinh nào phù hợp
                    </span>
                    <span className="body-xs" style={{ color: 'var(--text-subtle)' }}>
                      Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student, idx) => {
                const isSelected = selectedStudentIds.includes(student.studentId);
                const isCheckedIn = Boolean(student.arrivalTime && student.status === 'present');

                return (
                  <tr
                    key={student.studentId}
                    style={{
                      background: isSelected ? 'var(--semantic-info-soft)' : undefined,
                    }}
                  >
                    {/* Checkbox */}
                    <td className="is-check" style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(student.studentId)}
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: 'var(--eco-blue-strong)',
                          cursor: 'pointer',
                        }}
                      />
                    </td>

                    {/* STT */}
                    <td style={{ textAlign: 'center', color: 'var(--text-subtle)', fontVariantNumeric: 'tabular-nums' }}>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">STT</span>
                      <div className="ecomd-cell__value">{idx + 1}</div>
                    </td>

                    {/* Student Info */}
                    <td className="is-primary">
                      <div className="ecomd-cell__value">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-10)' }}>
                          <Avatar
                            src={student.avatarUrl}
                            name={student.fullName}
                            size="md"
                          />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="body-sm-bold" style={{ color: 'var(--text-heading)' }}>
                              {student.fullName}
                            </span>
                            <span
                              className="body-xs"
                              style={{
                                fontFamily: 'var(--font-mono)',
                                color: 'var(--text-subtle)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <span>{student.studentCode}</span>
                              <span style={{ color: student.gender === 'female' ? '#ec4899' : '#3b82f6', fontSize: '10px' }}>
                                {student.gender === 'female' ? '♀' : '♂'}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Giờ đón */}
                    <td>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">Giờ đón</span>
                      <div className="ecomd-cell__value">
                        {student.arrivalTime ? (
                          editingTimeKey === `${student.studentId}-arrivalTime` ? (
                            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--bg-surface)', padding: '2px 4px', borderRadius: 'var(--radius-6)', border: '2px solid var(--eco-blue-strong)' }}>
                              <input
                                type="text"
                                maxLength={5}
                                value={tempTimeValue}
                                onChange={(e) => setTempTimeValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveTime(student.studentId, 'arrivalTime', student.arrivalTime);
                                  if (e.key === 'Escape') setEditingTimeKey(null);
                                }}
                                onBlur={() => saveTime(student.studentId, 'arrivalTime', student.arrivalTime)}
                                style={{
                                  width: '54px',
                                  textAlign: 'center',
                                  fontFamily: 'var(--font-mono)',
                                  fontWeight: 700,
                                  fontSize: '12px',
                                  border: 'none',
                                  outline: 'none',
                                  padding: 0,
                                }}
                                autoFocus
                              />
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
                              <div
                                onClick={() => startEditTime(student.studentId, 'arrivalTime', student.arrivalTime)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '13px',
                                  fontWeight: 700,
                                  color: 'var(--text-heading)',
                                  background: 'var(--bg-muted)',
                                  padding: '2px 8px',
                                  borderRadius: 'var(--radius-4)',
                                  cursor: 'pointer',
                                  border: '1px solid var(--border-default)',
                                }}
                                title="Nhấp để sửa giờ đón"
                              >
                                <span>{student.arrivalTime}</span>
                                <Icon name="pen" size={10} color="var(--text-subtle)" />
                              </div>
                              {student.isLate && (
                                <span
                                  style={{
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    color: 'var(--semantic-warning-strong)',
                                    background: 'var(--semantic-warning-soft)',
                                    padding: '1px 6px',
                                    borderRadius: 'var(--radius-4)',
                                    border: '1px solid var(--border-warning-soft)',
                                  }}
                                  title="Đến muộn sau 08:00"
                                >
                                  Đến muộn
                                </span>
                              )}
                            </div>
                          )
                        ) : (
                          <button
                            type="button"
                            onClick={() => onCheckIn(student.studentId)}
                            style={{
                              fontSize: '12px',
                              fontWeight: 700,
                              color: 'var(--semantic-success-strong)',
                              background: 'var(--semantic-success-soft)',
                              border: '1px solid var(--border-success-soft)',
                              padding: '4px 12px',
                              borderRadius: 'var(--radius-6)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'all .15s',
                            }}
                          >
                            <Icon name="check" size={12} />
                            <span>Đón</span>
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Giờ trả */}
                    <td>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">Giờ trả</span>
                      <div className="ecomd-cell__value">
                        {student.departureTime ? (
                          editingTimeKey === `${student.studentId}-departureTime` ? (
                            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--bg-surface)', padding: '2px 4px', borderRadius: 'var(--radius-6)', border: '2px solid var(--eco-blue-strong)' }}>
                              <input
                                type="text"
                                maxLength={5}
                                value={tempTimeValue}
                                onChange={(e) => setTempTimeValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveTime(student.studentId, 'departureTime', student.departureTime);
                                  if (e.key === 'Escape') setEditingTimeKey(null);
                                }}
                                onBlur={() => saveTime(student.studentId, 'departureTime', student.departureTime)}
                                style={{
                                  width: '54px',
                                  textAlign: 'center',
                                  fontFamily: 'var(--font-mono)',
                                  fontWeight: 700,
                                  fontSize: '12px',
                                  border: 'none',
                                  outline: 'none',
                                  padding: 0,
                                }}
                                autoFocus
                              />
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                              <div
                                onClick={() => startEditTime(student.studentId, 'departureTime', student.departureTime)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '13px',
                                  fontWeight: 700,
                                  color: 'var(--eco-blue-strong)',
                                  background: 'var(--semantic-info-soft)',
                                  padding: '2px 8px',
                                  borderRadius: 'var(--radius-4)',
                                  cursor: 'pointer',
                                  border: '1px solid var(--border-info-soft)',
                                }}
                                title="Nhấp để sửa giờ trả"
                              >
                                <span>{student.departureTime}</span>
                                <Icon name="pen" size={10} color="var(--eco-blue-strong)" />
                              </div>
                              <IconButton
                                icon="gear"
                                label="Ủy quyền người đón"
                                disabled={!isCheckedIn}
                                onClick={() => onOpenPickupModal(student)}
                                size="sm"
                              />
                            </div>
                          )
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                            <button
                              type="button"
                              disabled={!isCheckedIn}
                              onClick={() => onCheckOut(student.studentId)}
                              style={{
                                fontSize: '12px',
                                fontWeight: 700,
                                padding: '4px 12px',
                                borderRadius: 'var(--radius-6)',
                                border: isCheckedIn ? '1px solid var(--border-info-soft)' : '1px solid var(--border-default)',
                                background: isCheckedIn ? 'var(--semantic-info-soft)' : 'var(--bg-muted)',
                                color: isCheckedIn ? 'var(--eco-blue-strong)' : 'var(--text-disabled)',
                                cursor: isCheckedIn ? 'pointer' : 'not-allowed',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                              title={isCheckedIn ? 'Xác nhận trả học sinh' : 'Cần điểm danh đón trước khi trả'}
                            >
                              <Icon name="right-from-bracket" size={12} />
                              <span>Trả</span>
                            </button>

                            <IconButton
                              icon="gear"
                              label="Ủy quyền người đón"
                              disabled={!isCheckedIn}
                              onClick={() => onOpenPickupModal(student)}
                              size="sm"
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Người đón */}
                    <td>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">Người đón</span>
                      <div className="ecomd-cell__value">
                        {student.pickupGuardianName ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Icon name="user-shield" size={13} color="var(--semantic-success)" />
                            <span
                              className="body-xs-semibold"
                              style={{ color: 'var(--text-heading)', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                              title={student.pickupGuardianName}
                            >
                              {student.pickupGuardianName}
                            </span>
                          </div>
                        ) : (
                          <EmptyValue italic>Chưa ghi nhận</EmptyValue>
                        )}
                      </div>
                    </td>

                    {/* Sức khỏe & Thân nhiệt */}
                    <td>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">Sức khỏe</span>
                      <div className="ecomd-cell__value">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {/* Temperature click-to-edit */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {editingTempStudentId === student.studentId ? (
                              <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--bg-surface)', padding: '2px 4px', borderRadius: 'var(--radius-6)', border: '2px solid var(--eco-blue-strong)' }}>
                                <input
                                  type="number"
                                  step="0.1"
                                  min="34.0"
                                  max="43.0"
                                  value={tempInputValue}
                                  onChange={(e) => setTempInputValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveTemperature(student.studentId, student.healthCondition);
                                    if (e.key === 'Escape') setEditingTempStudentId(null);
                                  }}
                                  onBlur={() => saveTemperature(student.studentId, student.healthCondition)}
                                  style={{
                                    width: '50px',
                                    textAlign: 'center',
                                    fontFamily: 'var(--font-mono)',
                                    fontWeight: 700,
                                    fontSize: '12px',
                                    border: 'none',
                                    outline: 'none',
                                    padding: 0,
                                  }}
                                  autoFocus
                                />
                              </div>
                            ) : (
                              <div
                                onClick={() => startEditTemperature(student)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '2px 6px',
                                  borderRadius: 'var(--radius-4)',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  fontFamily: 'var(--font-mono)',
                                  cursor: 'pointer',
                                  border: student.temperature > 37.5 ? '1px solid var(--border-danger-soft)' : '1px solid var(--border-default)',
                                  background: student.temperature > 37.5 ? 'var(--semantic-danger-soft)' : 'var(--bg-muted)',
                                  color: student.temperature > 37.5 ? 'var(--semantic-danger-strong)' : 'var(--text-body)',
                                }}
                                title="Nhấp để chỉnh sửa thân nhiệt"
                              >
                                <span>{student.temperature ? `${student.temperature.toFixed(1)}°C` : '--'}</span>
                                <Icon name="pen" size={10} color="var(--text-subtle)" />
                              </div>
                            )}
                          </div>

                          {/* Health condition select */}
                          <select
                            value={student.healthCondition}
                            onChange={(e) =>
                              onUpdateHealth(
                                student.studentId,
                                student.temperature,
                                e.target.value as HealthCondition
                              )
                            }
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-4)',
                              border: '1px solid var(--border-default)',
                              background:
                                student.healthCondition === 'Bình thường'
                                  ? 'var(--bg-surface)'
                                  : 'var(--semantic-warning-soft)',
                              color:
                                student.healthCondition === 'Bình thường'
                                  ? 'var(--text-body)'
                                  : 'var(--semantic-warning-strong)',
                              cursor: 'pointer',
                            }}
                          >
                            {HEALTH_CONDITIONS.map((cond) => (
                              <option key={cond} value={cond}>
                                {cond}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </td>

                    {/* Ghi chú */}
                    <td>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">Ghi chú</span>
                      <div className="ecomd-cell__value">
                        {editingNotesId === student.studentId ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input
                              type="text"
                              value={tempNotes}
                              onChange={(e) => setTempNotes(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveNotes(student.studentId);
                                if (e.key === 'Escape') setEditingNotesId(null);
                              }}
                              onBlur={() => saveNotes(student.studentId)}
                              style={{
                                width: '120px',
                                padding: '2px 6px',
                                fontSize: '12px',
                                border: '1px solid var(--eco-blue-strong)',
                                borderRadius: 'var(--radius-4)',
                                outline: 'none',
                              }}
                              autoFocus
                            />
                          </div>
                        ) : (
                          <div
                            onClick={() => startEditNotes(student)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              color: student.notes ? 'var(--text-body)' : 'var(--text-muted)',
                            }}
                            title="Nhấp để sửa ghi chú"
                          >
                            <span style={{ maxWidth: '85px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {student.notes || 'Thêm ghi chú...'}
                            </span>
                            <Icon name="pen" size={10} color="var(--text-subtle)" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td className="is-actions" style={{ textAlign: 'center' }}>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">Trạng thái</span>
                      <div className="ecomd-cell__value">
                        {renderStatusBadge(student)}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Card Footer: Student count */}
      {students.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-12) var(--space-20)',
            borderTop: '1px solid var(--border-default)',
            fontSize: '13px',
            color: 'var(--text-subtle)',
            background: 'var(--bg-surface)',
          }}
        >
          <span>Hiển thị <strong>{students.length}</strong> học sinh</span>
          <span style={{ fontSize: '12px' }}>Đồng bộ thời gian thực với ứng dụng Phụ huynh</span>
        </div>
      )}
    </div>
  );
};

export default AttendanceRoster;
