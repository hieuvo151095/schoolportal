import React from 'react';
import { SlideOver, Icon, Button, Avatar } from '@/components/ds';
import { StudentRecognitionStat } from '../../../types/media';

interface FaceRecognitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: StudentRecognitionStat[];
  isScanning: boolean;
  scanMessage: string | null;
  onStartScan: () => void;
}

export const FaceRecognitionModal: React.FC<FaceRecognitionModalProps> = ({
  isOpen,
  onClose,
  stats,
  isScanning,
  scanMessage,
  onStartScan,
}) => {
  const totalPhotosCount = 36;
  const recognizedTotal = stats.reduce((acc, s) => acc + s.recognizedPhotosCount, 0);
  const recognitionRate = Math.min(100, Math.round((recognizedTotal / totalPhotosCount) * 100));

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      icon="robot"
      title="Tổng Quan Nhận Diện Hình Ảnh AI (Lớp 1A1)"
      description="Theo dõi tỉ lệ phát hiện khuôn mặt và tự động gắn thẻ học sinh"
      width={600}
      secondaryAction={{
        label: 'Đóng',
        onClick: onClose,
      }}
    >
      <div className="space-y-5 text-xs">
        {/* KPI Recognition Rate Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white shadow-xs">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-blue-100 font-bold">
                Độ phủ nhận diện hình ảnh
              </div>
              <div className="text-xl font-extrabold mt-0.5">
                Đã có {recognizedTotal}/{totalPhotosCount} hình ảnh được nhận diện
              </div>
              <p className="text-xs text-blue-100 mt-1">
                Độ chính xác trung bình toàn lớp đạt <strong>92.5%</strong>.
              </p>
            </div>
            <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center border border-white/20 text-xl font-black">
              {recognitionRate}%
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-black/20 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${recognitionRate}%` }}
            />
          </div>
        </div>

        {/* Success scan alert */}
        {scanMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center gap-2 text-xs font-medium">
            <Icon name="check" size={14} className="text-emerald-600 shrink-0" />
            <span>{scanMessage}</span>
          </div>
        )}

        {/* Manual AI Scan Action Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="font-bold text-slate-800 text-xs">
              Quét nhận diện khuôn mặt tự động
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Hệ thống AI sẽ quét toàn bộ ảnh trong các album và gắn thẻ tự động.
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={onStartScan}
            disabled={isScanning}
            icon={isScanning ? 'spinner' : 'rotate'}
          >
            {isScanning ? 'Đang phân tích AI...' : 'Bắt đầu quét AI'}
          </Button>
        </div>

        {/* Student Breakdown Table */}
        <div>
          <div className="font-bold text-slate-800 text-xs mb-2">
            Danh sách học sinh & Số ảnh nhận diện (Lớp 1A1)
          </div>
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[10px]">
                <tr>
                  <th className="p-3 pl-4">Học sinh</th>
                  <th className="p-3">Số ảnh nhận diện</th>
                  <th className="p-3">Độ tin cậy</th>
                  <th className="p-3 text-right pr-4">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.map((student) => (
                  <tr key={student.studentId} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-3 pl-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          name={student.studentName}
                          src={student.avatarUrl}
                          size="sm"
                        />
                        <div>
                          <div className="font-bold text-slate-800">{student.studentName}</div>
                          <div className="text-[10px] text-slate-400">Mã: {student.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-bold text-slate-700">
                      {student.recognizedPhotosCount} hình ảnh
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <Icon name="check" size={10} />
                        <span>{student.confidenceRate}%</span>
                      </span>
                    </td>
                    <td className="p-3 text-right pr-4">
                      <button
                        type="button"
                        onClick={() => alert(`Xem các ảnh đã nhận diện của ${student.studentName}`)}
                        className="text-xs font-semibold text-[#0070CE] hover:underline cursor-pointer"
                      >
                        Xem ảnh
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SlideOver>
  );
};

export default FaceRecognitionModal;
