import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faRobot,
  faCheckCircle,
  faSyncAlt,
  faEye,
  faCamera,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
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
  if (!isOpen) return null;

  const totalPhotosCount = 36;
  const recognizedTotal = stats.reduce((acc, s) => acc + s.recognizedPhotosCount, 0);
  const recognitionRate = Math.min(100, Math.round((recognizedTotal / totalPhotosCount) * 100));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-[#0070CE] flex items-center justify-center">
              <FontAwesomeIcon icon={faRobot} className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Tổng Quan Nhận Diện Hình Ảnh AI (Lớp 1A1)
              </h2>
              <p className="text-[11px] text-slate-500">
                Theo dõi tỉ lệ phát hiện khuôn mặt và tự động gắn thẻ học sinh
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* KPI Recognition Rate Banner (BR08) */}
          <div className="bg-gradient-to-r from-blue-500 to-[#0070CE] rounded-xl p-4 text-white shadow-xs">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-blue-100 font-bold">
                  Độ phủ nhận diện hình ảnh
                </div>
                <div className="text-2xl font-extrabold font-heading mt-0.5">
                  Đã có {recognizedTotal}/{totalPhotosCount} hình ảnh được nhận diện
                </div>
                <p className="text-xs text-blue-100 mt-1">
                  Độ chính xác trung bình toàn lớp đạt <strong>92.5%</strong>.
                </p>
              </div>
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 text-xl font-black">
                {recognitionRate}%
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-black/20 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-[#FEC020] h-full rounded-full transition-all duration-500"
                style={{ width: `${recognitionRate}%` }}
              ></div>
            </div>
          </div>

          {/* Success scan alert */}
          {scanMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center gap-2 text-xs font-medium animate-fadeIn">
              <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{scanMessage}</span>
            </div>
          )}

          {/* Manual AI Scan Action Bar (BR09) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-slate-800 text-xs">
                Quét nhận diện khuôn mặt tự động
              </div>
              <div className="text-[11px] text-slate-500">
                Hệ thống AI sẽ quét toàn bộ ảnh trong các album và gắn thẻ tự động.
              </div>
            </div>
            <button
              type="button"
              onClick={onStartScan}
              disabled={isScanning}
              className={`px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xs flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                isScanning
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-[#0070CE] hover:bg-[#1A94FF] active:bg-[#005096]'
              }`}
            >
              <FontAwesomeIcon icon={faSyncAlt} className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Đang phân tích AI...' : 'Bắt đầu quét AI'}</span>
            </button>
          </div>

          {/* Student Breakdown Table (BR08) */}
          <div>
            <div className="font-bold text-slate-800 text-xs mb-2">
              Danh sách học sinh & Số ảnh nhận diện (Lớp 1A1)
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
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
                          <img
                            src={student.avatarUrl}
                            alt={student.studentName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
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
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <FontAwesomeIcon icon={faCheckCircle} className="w-2.5 h-2.5" />
                          <span>{student.confidenceRate}%</span>
                        </span>
                      </td>
                      <td className="p-3 text-right pr-4">
                        <button
                          type="button"
                          onClick={() => alert(`Xem các ảnh đã nhận diện của ${student.studentName}`)}
                          className="text-xs font-semibold text-[#0070CE] hover:underline"
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

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
