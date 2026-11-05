import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faUserGraduate,
  faUser,
  faPhone,
  faEnvelope,
  faGraduationCap,
  faIdCard,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import { closeProfileModal } from '@/store/slices/feedbackSlice';
import { formatFallbackField } from '@/utils/feedbackValidation';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 440px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: modalFadeIn 0.15s ease-out;

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export default function ProfileQuickViewModal() {
  const dispatch = useAppDispatch();
  const { profileModal } = useAppSelector((state) => state.feedback);

  if (!profileModal.isOpen || !profileModal.data) {
    return null;
  }

  const { type, data } = profileModal;
  const isStudent = type === 'student';

  const handleClose = () => {
    dispatch(closeProfileModal());
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                isStudent ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
              }`}
            >
              <FontAwesomeIcon icon={isStudent ? faUserGraduate : faUser} />
            </span>
            <h3 className="text-xs font-bold text-slate-800">
              {isStudent ? 'Thông tin học sinh' : 'Thông tin phụ huynh'}
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="p-5">
          <div className="flex items-center space-x-3.5 mb-4 pb-4 border-b border-slate-100">
            {data.avatarUrl ? (
              <img
                src={data.avatarUrl}
                alt={data.fullName}
                className="w-12 h-12 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-lg font-bold">
                <FontAwesomeIcon icon={isStudent ? faUserGraduate : faUser} />
              </div>
            )}
            <div>
              <h4 className="text-sm font-bold text-slate-800">{data.fullName}</h4>
              <p className="text-xs text-slate-500">
                {isStudent
                  ? `Học sinh lớp ${formatFallbackField(data.className, 'lớp')}`
                  : `Mối quan hệ: ${formatFallbackField(data.relationship, 'quan hệ')}`}
              </p>
            </div>
          </div>

          {/* Details List */}
          <div className="space-y-2.5 text-xs">
            {isStudent ? (
              <>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 flex items-center">
                    <FontAwesomeIcon icon={faIdCard} className="w-4 mr-2 text-slate-400" />
                    Mã học sinh:
                  </span>
                  <span className="font-medium text-slate-800">
                    {formatFallbackField(data.studentCode || data.id, 'mã học sinh')}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 flex items-center">
                    <FontAwesomeIcon icon={faGraduationCap} className="w-4 mr-2 text-slate-400" />
                    Lớp hiện tại:
                  </span>
                  <span className="font-semibold text-blue-600">
                    {formatFallbackField(data.className, 'lớp học')}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 flex items-center">
                    <FontAwesomeIcon icon={faPhone} className="w-4 mr-2 text-slate-400" />
                    Số điện thoại:
                  </span>
                  <span className="font-medium text-slate-800">
                    {formatFallbackField(data.phone, 'số điện thoại')}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 flex items-center">
                    <FontAwesomeIcon icon={faEnvelope} className="w-4 mr-2 text-slate-400" />
                    Email liên hệ:
                  </span>
                  <span className="font-medium text-slate-800 truncate max-w-[220px]">
                    {formatFallbackField(data.email, 'email')}
                  </span>
                </div>
                {data.studentName && (
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 flex items-center">
                      <FontAwesomeIcon icon={faUserGraduate} className="w-4 mr-2 text-slate-400" />
                      Phụ huynh của:
                    </span>
                    <span className="font-semibold text-blue-600">
                      {data.studentName} ({data.studentClass})
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm transition-colors"
          >
            Đóng
          </button>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
}
