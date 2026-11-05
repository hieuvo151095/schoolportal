import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTriangleExclamation,
  faTrash,
  faTimes,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';

interface DeleteAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  announcementTitle?: string;
  isBulk?: boolean;
  bulkCount?: number;
}

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 32rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
`;

export const DeleteAnnouncementModal: React.FC<DeleteAnnouncementModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  announcementTitle,
  isBulk = false,
  bulkCount = 1
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-rose-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-lg">
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-900">
                {isBulk ? `Xác Nhận Xóa ${bulkCount} Thông Báo` : 'Xác Nhận Xóa Thông Báo'}
              </h3>
              <p className="text-xs text-rose-700">
                Thao tác này sẽ gỡ bỏ bản tin khỏi hệ thống
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-700 leading-relaxed">
            {isBulk ? (
              <span>
                Bạn có chắc chắn muốn xóa <strong>{bulkCount} thông báo</strong> đã chọn không?
              </span>
            ) : (
              <span>
                Bạn có chắc chắn muốn xóa thông báo:{' '}
                <strong className="text-slate-900">"{announcementTitle}"</strong>?
              </span>
            )}
          </p>

          {/* Statutory Irrevocable Email Notice (BR10, BT-01, BT-02, K040) */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <div className="text-amber-600 text-lg flex-shrink-0 mt-0.5">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <div className="text-xs text-amber-900 leading-relaxed">
              <p className="font-bold mb-1 text-amber-950">Cảnh báo tính pháp lý & Lưu ý ngoại lệ:</p>
              <p>
                Lưu ý: Người dùng sẽ không thể xem các thông tin liên quan đến thông báo này trên cả Web và App, trừ những email đã được gửi ra.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-100 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-rose-600 text-white text-sm font-semibold rounded-lg hover:bg-rose-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faTrash} />
            <span>Xác nhận xóa</span>
          </button>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DeleteAnnouncementModal;
