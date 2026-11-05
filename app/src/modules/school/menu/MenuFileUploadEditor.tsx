import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloudUploadAlt,
  faFilePdf,
  faFileImage,
  faDownload,
  faTrashAlt,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

interface MenuFileUploadEditorProps {
  fileAttachment?: {
    name: string;
    size: number;
    url: string;
    mimeType: string;
  };
  onFileChange: (file?: { name: string; size: number; url: string; mimeType: string }) => void;
  readOnly?: boolean;
}

export const MenuFileUploadEditor: React.FC<MenuFileUploadEditorProps> = ({
  fileAttachment,
  onFileChange,
  readOnly = false,
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleSimulateUpload = (filename: string, mime: string) => {
    onFileChange({
      name: filename,
      size: 1024 * 850, // ~850 KB
      url: `/files/menus/${filename}`,
      mimeType: mime,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-sm space-y-5">
      {/* Sample menu download link */}
      <div className="flex items-center justify-between p-3.5 bg-blue-50/60 rounded-xl border border-blue-200/70 text-xs">
        <div className="text-blue-900">
          Chưa có file mẫu thiết kế sẵn? Tải xuống biểu mẫu thực đơn tiêu chuẩn của nhà trường:
        </div>
        <button
          type="button"
          onClick={() => {
            alert('Đang tải xuống biểu mẫu thực đơn: Mau_Thuc_Don_Tieu_Chuan.xlsx');
          }}
          className="px-3 py-1.5 bg-white text-blue-700 hover:bg-blue-50 rounded-lg border border-blue-300 font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors flex-shrink-0"
        >
          <FontAwesomeIcon icon={faDownload} className="text-[10px]" />
          Tải mẫu thực đơn (.xlsx)
        </button>
      </div>

      {/* Upload Dropzone */}
      {!fileAttachment ? (
        !readOnly && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleSimulateUpload('Thuc_don_tuan_dinh_kem.pdf', 'application/pdf');
            }}
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
              dragActive
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-gray-200 hover:border-blue-400 bg-gray-50/30'
            }`}
            onClick={() => handleSimulateUpload('Thuc_don_tuan_dinh_kem.pdf', 'application/pdf')}
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 text-2xl shadow-inner">
              <FontAwesomeIcon icon={faCloudUploadAlt} />
            </div>
            <h4 className="text-sm font-semibold text-gray-800">
              Kéo thả file thực đơn vào đây hoặc nhấp để tải lên
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Hỗ trợ định dạng file PDF, PNG, JPG, JPEG (kích thước tối đa 20MB)
            </p>
          </div>
        )
      ) : (
        /* Uploaded File Card */
        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-xl flex-shrink-0">
              <FontAwesomeIcon
                icon={fileAttachment.mimeType.includes('pdf') ? faFilePdf : faFileImage}
              />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                {fileAttachment.name}
                <span className="text-emerald-600 text-xs" title="Đã tải lên thành công">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {formatFileSize(fileAttachment.size)} • {fileAttachment.mimeType}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={fileAttachment.url}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg inline-flex items-center gap-1.5 transition-colors"
            >
              <FontAwesomeIcon icon={faDownload} className="text-[10px]" />
              Xem file
            </a>
            {!readOnly && (
              <button
                type="button"
                onClick={() => onFileChange(undefined)}
                className="w-8 h-8 rounded-lg text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                title="Gỡ bỏ file này"
              >
                <FontAwesomeIcon icon={faTrashAlt} className="text-xs" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
