import React, { useState, useMemo } from 'react';
import { Icon, Dropdown } from '@/components/ds';
import { StudentVoterRecord } from '@/types/poll';
import { normalizeVietnameseText } from '@/utils/pollValidation';

interface PollVoterRosterProps {
  voters: StudentVoterRecord[];
  classes: Array<{ id: string; name: string }>;
  onOpenHistoryModal: (studentId: string) => void;
}

export const PollVoterRoster: React.FC<PollVoterRosterProps> = ({
  voters,
  classes,
  onOpenHistoryModal,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'voted' | 'not_voted'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredVoters = useMemo(() => {
    return voters.filter((voter) => {
      // Class filter
      if (selectedClassId !== 'all' && voter.classId !== selectedClassId) {
        return false;
      }

      // Status filter
      if (statusFilter === 'voted' && !voter.hasVoted) return false;
      if (statusFilter === 'not_voted' && voter.hasVoted) return false;

      // Search query (BR10: accent-insensitive matching on student name)
      if (searchQuery.trim()) {
        const query = normalizeVietnameseText(searchQuery);
        const name = normalizeVietnameseText(voter.studentName);
        const cls = normalizeVietnameseText(voter.className);
        if (!name.includes(query) && !cls.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [voters, selectedClassId, statusFilter, searchQuery]);

  const totalVoters = voters.length;
  const votedCount = voters.filter((v) => v.hasVoted).length;
  const notVotedCount = totalVoters - votedCount;

  const formatTimestamp = (iso?: string) => {
    if (!iso) return '-';
    const date = new Date(iso);
    if (isNaN(date.getTime())) return iso;
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      {/* Title & Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Danh sách đã bình chọn ({votedCount}/{totalVoters})
          </h3>
          <p className="text-xs text-slate-500">
            Theo dõi chi tiết tình trạng tham gia bình chọn của từng học sinh theo lớp
          </p>
        </div>

        {/* Quick Tally Chips */}
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center">
            <Icon name="check" className="mr-1 text-[10px]" />
            Đã bình chọn: {votedCount}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 flex items-center">
            <Icon name="xmark" className="mr-1 text-[10px]" />
            Chưa bình chọn: {notVotedCount}
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon name="magnifying-glass" className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm học sinh theo tên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#0070CE]"
          />
        </div>

        {/* Class Filter */}
        <div className="w-full sm:w-48">
          <Dropdown
            value={selectedClassId}
            onChange={(val) => setSelectedClassId(String(val))}
            options={[
              { value: 'all', label: 'Tất cả lớp' },
              ...classes.map((cls) => ({ value: cls.id, label: `Lớp ${cls.name}` })),
            ]}
            placeholder="Tất cả lớp"
            size="sm"
            fullWidth
          />
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-44">
          <Dropdown
            value={statusFilter}
            onChange={(val) => setStatusFilter(val as any)}
            options={[
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'voted', label: 'Đã bình chọn' },
              { value: 'not_voted', label: 'Chưa bình chọn' },
            ]}
            placeholder="Tất cả trạng thái"
            size="sm"
            fullWidth
          />
        </div>
      </div>

      {/* Voter Table */}
      {filteredVoters.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Không tìm thấy học sinh phù hợp.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-3 w-10 text-center">STT</th>
                <th className="py-3 px-3 min-w-[200px]">Học sinh</th>
                <th className="py-3 px-3 w-24">Lớp</th>
                <th className="py-3 px-3 w-32 text-center">Trạng thái</th>
                <th className="py-3 px-3 min-w-[220px]">Bình chọn</th>
                <th className="py-3 px-3 w-36">Thời gian</th>
                <th className="py-3 px-3 w-16 text-center">Lịch sử</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVoters.map((voter, index) => {
                return (
                  <tr key={voter.studentId} className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-3 px-3 text-center text-slate-400 font-medium">
                      {index + 1}
                    </td>

                    {/* Student Name & Avatar (BR11 verbatim display) */}
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0070CE] font-bold flex items-center justify-center text-xs shadow-inner shrink-0">
                          {voter.studentName.charAt(0)}
                        </div>
                        <span className="truncate max-w-[220px]">{voter.studentName}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-700 font-medium">
                      {voter.className}
                    </td>

                    <td className="py-3 px-3 text-center">
                      {voter.hasVoted ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Đã bình chọn
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500">
                          Chưa bình chọn
                        </span>
                      )}
                    </td>

                    {/* Selected Options */}
                    <td className="py-3 px-3 text-slate-700">
                      {voter.hasVoted && voter.selectedOptionTitles && voter.selectedOptionTitles.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {voter.selectedOptionTitles.map((t, idx) => (
                            <span
                              key={idx}
                              className="inline-block px-2 py-0.5 rounded bg-blue-50 border border-blue-100 text-[11px] font-medium text-[#0070CE]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">-</span>
                      )}
                    </td>

                    {/* Last Voted At */}
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {formatTimestamp(voter.lastVotedAt)}
                    </td>

                    {/* History Icon Trigger (BR08) */}
                    <td className="py-3 px-3 text-center">
                      {voter.hasVoted && voter.voteHistory && voter.voteHistory.length > 0 ? (
                        <button
                          onClick={() => onOpenHistoryModal(voter.studentId)}
                          className="w-7 h-7 rounded-lg text-slate-400 hover:text-[#0070CE] hover:bg-blue-50 flex items-center justify-center transition-colors mx-auto"
                          title="Lịch sử thay đổi lựa chọn"
                        >
                          <Icon name="clock" className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default PollVoterRoster;
