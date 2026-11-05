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
      className="ecomd-filterbar"
      style={{
        padding: 'var(--space-12) var(--space-16)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-12)',
      }}
    >
      <div className="ecomd-filterbar__filters">
        <Tag variant="default" style={{ height: '36px', padding: '0 var(--space-12)', fontWeight: 600 }}>
          {totalAlbums} Album • {totalPhotos} Ảnh & Video
        </Tag>

        <div style={{ width: '320px' }}>
          <SearchField
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Tìm album theo tên, chủ đề..."
          />
        </div>
      </div>

      <div className="ecomd-filterbar__actions">
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
