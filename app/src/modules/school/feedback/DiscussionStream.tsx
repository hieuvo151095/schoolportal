import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faSchool,
  faComments,
  faPaperclip,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { FeedbackItem, FeedbackComment } from '@/types/feedback';

interface DiscussionStreamProps {
  item: FeedbackItem;
}

export default function DiscussionStream({ item }: DiscussionStreamProps) {
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear()} ${d
      .getHours()
      .toString()
      .padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 mb-4">
      {/* Turn-Taking Status Banner (BR05) */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs">
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faClock} className="text-slate-400" />
          <span className="text-slate-600">Trạng thái trao đổi:</span>
          {item.waitingFor === 'school' ? (
            <span className="font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              Chờ phản hồi từ nhà trường
            </span>
          ) : (
            <span className="font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
              Chờ phản hồi từ phụ huynh
            </span>
          )}
        </div>
        <div className="text-[11px] text-slate-400">
          Tổng số phản hồi: <span className="font-semibold text-slate-600">{item.comments.length}</span>
        </div>
      </div>

      {/* Initial Parent Request */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
              <FontAwesomeIcon icon={faUser} />
            </span>
            <div>
              <p className="text-xs font-bold text-slate-800">
                {item.parentName}{' '}
                <span className="font-normal text-slate-500">
                  (Phụ huynh em {item.studentName} - {item.studentClass})
                </span>
              </p>
              <p className="text-[10px] text-slate-400">{formatDate(item.createdAt)}</p>
            </div>
          </div>
          <span className="text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
            Ý kiến khởi tạo
          </span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
          {item.description}
        </p>

        {/* Initial Attachments */}
        {item.attachments && item.attachments.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap gap-2">
            {item.attachments.map((att) => (
              <a
                key={att.id}
                href={att.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-blue-600 hover:text-blue-800 hover:border-blue-300 transition-colors shadow-sm"
              >
                <FontAwesomeIcon icon={faPaperclip} />
                <span className="max-w-[200px] truncate">{att.fileName}</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Chronological Discussion Comments */}
      {item.comments.map((comment) => {
        const isSchool = comment.authorRole === 'admin' || comment.authorRole === 'teacher';
        return (
          <div
            key={comment.id}
            className={`flex flex-col ${isSchool ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3.5 text-xs shadow-sm border ${
                isSchool
                  ? 'bg-blue-50/70 border-blue-200 text-slate-800'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1.5 pb-1 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      isSchool
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <FontAwesomeIcon icon={isSchool ? faSchool : faUser} />
                  </span>
                  <span className="font-semibold text-slate-800">
                    {comment.authorName}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                      isSchool
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isSchool ? 'Nhà trường' : 'Phụ huynh'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {formatDate(comment.createdAt)}
                </span>
              </div>

              <p className="leading-relaxed whitespace-pre-wrap">{comment.content}</p>

              {comment.attachments && comment.attachments.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {comment.attachments.map((att) => (
                    <a
                      key={att.id}
                      href={att.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 text-[11px] text-blue-600 hover:underline bg-white px-2 py-0.5 rounded border border-slate-200"
                    >
                      <FontAwesomeIcon icon={faPaperclip} />
                      <span className="truncate max-w-[150px]">{att.fileName}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
