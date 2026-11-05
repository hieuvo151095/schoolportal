import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCamera } from '@fortawesome/free-solid-svg-icons';

interface FacePhotoLightboxModalProps {
  photoUrl: string | null;
  studentName: string | null;
  onClose: () => void;
}

export const FacePhotoLightboxModal: React.FC<FacePhotoLightboxModalProps> = ({
  photoUrl,
  studentName,
  onClose,
}) => {
  if (!photoUrl) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col items-center p-5 space-y-4"
      >
        <div className="w-full flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs">
              <FontAwesomeIcon icon={faCamera} />
            </div>
            <span className="text-xs font-bold text-gray-800 truncate">
              {studentName ? `Ảnh nhận diện - ${studentName}` : 'Ảnh nhận diện'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
            title="Đóng"
          >
            <FontAwesomeIcon icon={faTimes} className="text-sm" />
          </button>
        </div>

        <div className="relative w-full aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center shadow-inner">
          <img
            src={photoUrl}
            alt={studentName || 'Ảnh nhận diện'}
            className="w-full h-full object-cover"
          />
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};
