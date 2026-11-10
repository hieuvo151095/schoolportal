import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@/components/ds';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FileInfoCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const FileMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const FileIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: #fee2e2;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const FileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const FileName = styled.div`
  font-weight: 700;
  font-size: 15px;
  color: #1e293b;
`;

const FileSub = styled.div`
  font-size: 13px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: #f8fafc;
    border-color: #94a3b8;
  }
`;

const DownloadButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: #0070ce;
  border: 1px solid #0070ce;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: #005bb5;
  }
`;

const DocumentCanvas = styled.div<{ $scale: number }>`
  background: #525659;
  border-radius: 12px;
  padding: 40px;
  min-height: 520px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow: auto;
`;

const Paper = styled.div<{ $scale: number }>`
  background: #ffffff;
  width: 760px;
  min-height: 800px;
  padding: 48px 56px;
  border-radius: 4px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  transform: scale(${(props) => props.$scale});
  transform-origin: top center;
  transition: transform 0.2s ease;
`;

const PaperHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #0070ce;
  padding-bottom: 20px;
  margin-bottom: 28px;
`;

const SchoolBrand = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #0070ce;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DocumentTitle = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const MockTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-top: 16px;

  th,
  td {
    border: 1px solid #cbd5e1;
    padding: 8px 10px;
    text-align: center;
  }

  th {
    background: #f1f5f9;
    font-weight: 700;
    color: #1e293b;
  }
`;

interface TimetableFileViewProps {
  fileName?: string;
  fileSize?: number;
  fileUrl?: string;
  className: string;
  semesterName: string;
}

export const TimetableFileView: React.FC<TimetableFileViewProps> = ({
  fileName = 'thoi-khoa-bieu.pdf',
  fileSize = 1258291,
  fileUrl = '#',
  className,
  semesterName,
}) => {
  const [scale, setScale] = useState<number>(1);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.15, 1.45));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.15, 0.7));
  const handleResetZoom = () => setScale(1);

  return (
    <Container>
      <FileInfoCard>
        <FileMeta>
          <FileIcon>
            <Icon name="file-pdf" size={24} className="text-[#006FDA]" />
          </FileIcon>
          <FileDetails>
            <FileName>{fileName}</FileName>
            <FileSub>
              <span>{formatFileSize(fileSize)}</span>
              <span>•</span>
              <span>Định dạng: PDF Document</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <Icon name="check" size={12} />
                <span>Đã đính kèm</span>
              </span>
            </FileSub>
          </FileDetails>
        </FileMeta>

        <ActionGroup>
          <ActionButton onClick={handleZoomOut} title="Thu nhỏ">
            <Icon name="minus" size={12} />
          </ActionButton>
          <ActionButton onClick={handleResetZoom} title="Mặc định">
            <span>{Math.round(scale * 100)}%</span>
          </ActionButton>
          <ActionButton onClick={handleZoomIn} title="Phóng to">
            <Icon name="plus" size={12} />
          </ActionButton>

          <DownloadButton href={fileUrl} download={fileName} target="_blank" rel="noreferrer">
            <Icon name="arrow-down-to-bracket" size={13} />
            <span>Tải tệp xuống</span>
          </DownloadButton>
        </ActionGroup>
      </FileInfoCard>

      <DocumentCanvas $scale={scale}>
        <Paper $scale={scale}>
          <PaperHeader>
            <div>
              <SchoolBrand>HỆ THỐNG TRƯỜNG TIỂU HỌC QUỐC TẾ SOHA</SchoolBrand>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                Năm học: 2026 - 2027
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#475569' }}>
              <div>Ban Giám Hiệu Phê Duyệt</div>
              <div style={{ fontWeight: 700, color: '#15803d' }}>ĐÃ KÝ SỐ</div>
            </div>
          </PaperHeader>

          <DocumentTitle>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
              THỜI KHÓA BIỂU CHÍNH THỨC
            </h2>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#0070ce' }}>
              {className} — {semesterName}
            </div>
          </DocumentTitle>

          <MockTable>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Tiết</th>
                <th>Thứ Hai</th>
                <th>Thứ Ba</th>
                <th>Thứ Tư</th>
                <th>Thứ Năm</th>
                <th>Thứ Sáu</th>
                <th>Thứ Bảy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Tiết 1</strong><br /><small>08:00 - 08:40</small></td>
                <td>Chào cờ</td>
                <td>Toán</td>
                <td>Tiếng Việt</td>
                <td>Tiếng Anh</td>
                <td>Toán</td>
                <td>GDTC</td>
              </tr>
              <tr>
                <td><strong>Tiết 2</strong><br /><small>08:45 - 09:25</small></td>
                <td>Tiếng Việt</td>
                <td>Tiếng Việt</td>
                <td>Toán</td>
                <td>Đạo đức</td>
                <td>Tiếng Việt</td>
                <td>Âm nhạc</td>
              </tr>
              <tr>
                <td><strong>Tiết 3</strong><br /><small>09:50 - 10:30</small></td>
                <td>Toán</td>
                <td>Tiếng Anh</td>
                <td>TN & XH</td>
                <td>Mỹ thuật</td>
                <td>Tiếng Anh</td>
                <td>Sinh hoạt</td>
              </tr>
              <tr>
                <td><strong>Tiết 4</strong><br /><small>10:35 - 11:15</small></td>
                <td>Thể dục</td>
                <td>TN & XH</td>
                <td>Tin học</td>
                <td>Tiếng Việt</td>
                <td>Toán</td>
                <td>—</td>
              </tr>
            </tbody>
          </MockTable>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px' }}>
            <div style={{ textAlign: 'center', width: '200px' }}>
              <div style={{ fontWeight: 600, fontSize: '13px' }}>GIÁO VIÊN CHỦ NHIỆM</div>
              <div style={{ marginTop: '48px', fontWeight: 700, color: '#1e293b' }}>
                Cô Lan Hương
              </div>
            </div>
            <div style={{ textAlign: 'center', width: '200px' }}>
              <div style={{ fontWeight: 600, fontSize: '13px' }}>HIỆU TRƯỞNG</div>
              <div style={{ marginTop: '48px', fontWeight: 700, color: '#1e293b' }}>
                TS. Nguyễn Văn Hùng
              </div>
            </div>
          </div>
        </Paper>
      </DocumentCanvas>
    </Container>
  );
};
