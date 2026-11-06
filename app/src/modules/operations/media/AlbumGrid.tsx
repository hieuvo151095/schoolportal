import React, { useState } from 'react';
import { PhotoAlbum, MediaGalleryViewMode } from '../../../types/media';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { StatusTag, Tag, EmptyState, IconButton, Icon } from '@/components/ds';

interface AlbumGridProps {
  albums: PhotoAlbum[];
  viewMode: MediaGalleryViewMode;
  onSelectAlbum: (albumId: string) => void;
  onDeleteAlbum?: (albumId: string) => void;
}

export const AlbumGrid: React.FC<AlbumGridProps> = ({
  albums,
  viewMode,
  onSelectAlbum,
  onDeleteAlbum,
}) => {
  const [albumToDelete, setAlbumToDelete] = useState<PhotoAlbum | null>(null);

  const formatDate = (isoDate: string) => {
    try {
      const d = new Date(isoDate);
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return isoDate;
    }
  };

  const handleConfirmDelete = () => {
    if (albumToDelete && onDeleteAlbum) {
      onDeleteAlbum(albumToDelete.id);
      setAlbumToDelete(null);
    }
  };

  if (albums.length === 0) {
    return (
      <div className="ecomd-table-card" style={{ padding: 'var(--space-48) var(--space-20)' }}>
        <EmptyState
          icon="images"
          title="Không tìm thấy album nào"
          description="Hãy thử tìm kiếm với từ khóa khác hoặc bấm nút 'Tạo album mới'."
        />
      </div>
    );
  }

  return (
    <>
      {viewMode === 'list' ? (
        /* List view mode */
        <div className="ecomd-table-card w-full max-w-full min-w-0">
          <div className="ecomd-table-scroll w-full max-w-full min-w-0">
            <table className="ecomd-table w-full max-w-full min-w-0">
              <thead>
                <tr>
                  <th className="body-xs-semibold" style={{ paddingLeft: 'var(--space-20)' }}>Album</th>
                  <th className="body-xs-semibold">Phân loại</th>
                  <th className="body-xs-semibold">Số lượng ảnh</th>
                  <th className="body-xs-semibold">Phạm vi hiển thị</th>
                  <th className="body-xs-semibold">Cập nhật lần cuối</th>
                  <th className="body-xs-semibold text-right" style={{ paddingRight: 'var(--space-20)' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {albums.map((album) => (
                  <tr
                    key={album.id}
                    onClick={() => onSelectAlbum(album.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="is-primary" style={{ paddingLeft: 'var(--space-20)' }}>
                      <div className="ecomd-cell__value">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
                          <img
                            src={album.coverPhotoUrl}
                            alt={album.title}
                            style={{
                              width: '56px',
                              height: '40px',
                              borderRadius: 'var(--radius-6)',
                              objectFit: 'cover',
                              border: '1px solid var(--border-default)',
                              flexShrink: 0,
                            }}
                          />
                          <div>
                            <div className="body-sm-bold" style={{ color: 'var(--text-heading)' }}>
                              {album.title}
                            </div>
                            <div className="body-xs" style={{ color: 'var(--text-subtle)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {album.description || 'Chưa có mô tả'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">Phân loại</span>
                      <div className="ecomd-cell__value">
                        {album.isSystem ? (
                          <StatusTag tone="info" label="Hệ thống" />
                        ) : (
                          <StatusTag tone="neutral" label="Tự tạo" />
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">Số lượng ảnh</span>
                      <div className="ecomd-cell__value">
                        <Tag variant="default">{album.photoCount} ảnh</Tag>
                      </div>
                    </td>
                    <td>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">Phạm vi</span>
                      <div className="ecomd-cell__value">
                        <span className="body-xs" style={{ color: 'var(--text-body)' }}>
                          {album.audienceScope === 'whole_school' ? 'Toàn trường' : 'Lớp 1A1'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="ecomd-cell__label body-xs-medium" aria-hidden="true">Cập nhật</span>
                      <div className="ecomd-cell__value">
                        <span className="body-xs" style={{ color: 'var(--text-subtle)' }}>
                          {formatDate(album.updatedAt)}
                        </span>
                      </div>
                    </td>
                    <td className="is-actions" style={{ textAlign: 'right', paddingRight: 'var(--space-20)' }}>
                      <div className="ecomd-cell__value">
                        {!album.isSystem && onDeleteAlbum && (
                          <IconButton
                            icon="trash"
                            label="Xóa album"
                            size="sm"
                            onClick={(e?: React.MouseEvent) => {
                              if (e) e.stopPropagation();
                              setAlbumToDelete(album);
                            }}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid view mode - Clean, responsive layout */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full min-w-0">
          {albums.map((album) => (
            <div
              key={album.id}
              onClick={() => onSelectAlbum(album.id)}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-12)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'box-shadow .2s ease, border-color .2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'var(--border-strong)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                e.currentTarget.style.borderColor = 'var(--border-default)';
              }}
            >
              {/* Cover Photo Banner */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 10',
                  overflow: 'hidden',
                  background: 'var(--bg-muted)',
                }}
              >
                <img
                  src={album.coverPhotoUrl}
                  alt={album.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 40%, transparent 100%)',
                  }}
                />

                {/* Top Left: System badge */}
                <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  {album.isSystem ? (
                    <StatusTag tone="info" label="Album hệ thống" />
                  ) : (
                    <StatusTag tone="neutral" label="Tự tạo" />
                  )}
                </div>

                {/* Bottom Left: Audience Scope */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  }}
                >
                  <Icon name="school" size={12} color="#fff" />
                  <span>{album.audienceScope === 'whole_school' ? 'Toàn trường' : 'Lớp 1A1'}</span>
                </div>

                {/* Bottom Right: Photo Count */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(4px)',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Icon name="images" size={11} color="var(--eco-yellow)" />
                  <span>{album.photoCount} ảnh</span>
                </div>
              </div>

              {/* Body Content */}
              <div
                style={{
                  padding: 'var(--space-14) var(--space-16)',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 'var(--space-8)',
                }}
              >
                <div>
                  <h3
                    className="title-md"
                    style={{
                      margin: 0,
                      color: 'var(--text-heading)',
                      fontSize: '14px',
                      fontWeight: 700,
                      lineHeight: '20px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={album.title}
                  >
                    {album.title}
                  </h3>
                  <p
                    className="body-xs"
                    style={{
                      margin: '4px 0 0',
                      color: 'var(--text-subtle)',
                      lineHeight: '18px',
                      height: '36px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {album.description || 'Chưa có mô tả chi tiết cho album này.'}
                  </p>
                </div>

                {/* Footer info: Date & Actions */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 'var(--space-10)',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '12px',
                    color: 'var(--text-subtle)',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Icon name="calendar-days" size={12} color="var(--text-muted)" />
                    <span>{formatDate(album.updatedAt)}</span>
                  </span>

                  {!album.isSystem && onDeleteAlbum && (
                    <IconButton
                      icon="trash"
                      label="Xóa album"
                      size="sm"
                      onClick={(e?: React.MouseEvent) => {
                        if (e) e.stopPropagation();
                        setAlbumToDelete(album);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {albumToDelete && (
        <ConfirmDeleteModal
          isOpen={Boolean(albumToDelete)}
          title={`Xóa album "${albumToDelete.title}"?`}
          message={
            <span>
              Album này hiện có <strong>{albumToDelete.photoCount}</strong> bức ảnh. Bạn có chắc chắn muốn xóa không?
            </span>
          }
          onClose={() => setAlbumToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default AlbumGrid;
