import React from 'react';
import { MediaGalleryViewMode } from '../../../types/media';
import { SearchField, Tag, SegmentedControl } from '@/components/ds';

interface MediaToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: MediaGalleryViewMode;
  onViewModeChange: (mode: MediaGalleryViewMode) => void;
  totalAlbums: number;
  totalPhotos: number;
  recognitionRate: number;
  onOpenCreateAlbum?: () => void;
  onOpenFaceRecognition?: () => void;
}

export const MediaToolbar: React.FC<MediaToolbarProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  totalAlbums,
  totalPhotos,
}) => {
  return (
    <div
      className="ecomd-filterbar flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full max-w-full min-w-0 p-3 sm:px-4 sm:py-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-12)]"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
        <Tag variant="default" className="h-9 px-3 font-semibold justify-center sm:justify-start flex-none">
          {totalAlbums} Album • {totalPhotos} Ảnh & Video
        </Tag>

        <div className="w-full sm:w-72 flex-1 min-w-0">
          <SearchField
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Tìm album theo tên, chủ đề..."
            className="ecomd-filterbar__search w-full"
          />
        </div>
      </div>

      <div className="flex items-center justify-center sm:justify-end flex-none">
        <SegmentedControl
          value={viewMode}
          onChange={onViewModeChange}
          items={[
            { key: 'grid', label: 'Lưới', icon: 'layer-group' },
            { key: 'list', label: 'Danh sách', icon: 'clipboard-list' },
          ]}
        />
      </div>
    </div>
  );
};

export default MediaToolbar;
