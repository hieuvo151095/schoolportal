import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@/components/ds';
import { useAppDispatch } from '@/store';
import { addComment } from '@/store/slices/feedbackSlice';
import { validateCommentSubmission } from '@/utils/feedbackValidation';
import { FeedbackAttachment } from '@/types/feedback';

interface DiscussionComposerProps {
  feedbackId: string;
  isClosed?: boolean;
}

export default function DiscussionComposer({
  feedbackId,
  isClosed = false,
}: DiscussionComposerProps) {
  const dispatch = useAppDispatch();
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<FeedbackAttachment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validation = validateCommentSubmission(content);
  const isSubmitDisabled = !validation.isValid || isClosed;

  const handleSend = () => {
    if (isSubmitDisabled) return;

    dispatch(
      addComment({
        feedbackId,
        content: content.trim(),
        authorRole: 'admin',
        authorName: 'Ban Quản Trị Nhà Trường',
        authorAvatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=60',
        attachments: attachments.length > 0 ? attachments : undefined,
      })
    );

    setContent('');
    setAttachments([]);
    setError(null);
  };

  const handleAttachMockPhoto = () => {
    const mockPhoto: FeedbackAttachment = {
      id: `att-${Date.now()}`,
      fileName: `tai_lieu_dinh_kem_${attachments.length + 1}.jpg`,
      fileUrl:
        'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=60',
      fileSize: 524288,
      mimeType: 'image/jpeg',
    };
    setAttachments([...attachments, mockPhoto]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  if (isClosed) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center text-xs text-slate-500">
        Góp ý này đã được Đóng (Hoàn tất). Để gửi thêm phản hồi, ticket cần được mở lại.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
      <div className="relative">
        <textarea
          rows={3}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Nhập nội dung phản hồi chính thức tới phụ huynh..."
          className="w-full text-xs text-slate-800 placeholder-slate-400 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
        />
      </div>

      {/* Attachment Previews */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 my-2">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded px-2 py-1 text-[11px]"
            >
              <Icon name="images" className="w-3.5 h-3.5" />
              <span className="truncate max-w-[150px]">{att.fileName}</span>
              <button
                type="button"
                onClick={() => handleRemoveAttachment(att.id)}
                className="text-blue-500 hover:text-blue-800 ml-1 p-0.5"
              >
                <Icon name="xmark" className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={handleAttachMockPhoto}
          className="inline-flex items-center text-xs text-slate-500 hover:text-blue-600 font-medium px-2 py-1 rounded hover:bg-slate-50 transition-colors"
          title="Đính kèm ảnh minh chứng"
        >
          <Icon name="paperclip" className="mr-1.5 w-3.5 h-3.5" />
          Đính kèm ảnh ({attachments.length})
        </button>

        <button
          type="button"
          onClick={handleSend}
          disabled={isSubmitDisabled}
          className={`inline-flex items-center px-4 py-1.5 text-xs font-semibold rounded-lg shadow-sm transition-all ${
            isSubmitDisabled
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-95'
          }`}
        >
          <Icon name="paper-plane" className="mr-1.5 w-3.5 h-3.5" />
          Gửi phản hồi
        </button>
      </div>
    </div>
  );
}
