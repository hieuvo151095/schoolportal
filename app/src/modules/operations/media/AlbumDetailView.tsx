import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faCalendarAlt,
  faFilter,
  faDownload,
  faCheckSquare,
  faSquare,
  faCheck,
  faTimes,
  faTrash,
  faRobot,
  faUserTag,
  faThLarge,
  faStream,
  faShieldAlt,
  faUsers,
  faImages,
} from '@fortawesome/free-solid-svg-icons';
import {
  PhotoAlbum,
  PhotoAsset,
  InsideAlbumViewMode,
  MediaFilterState,
} from '../../../types/media';
import { groupPhotosByUploadDate, filterPhotos } from '../../../utils/mediaValidation';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface AlbumDetailViewProps {
  album: PhotoAlbum;
  photos: PhotoAsset[];
  filter: MediaFilterState;
  viewMode: InsideAlbumViewMode;
  selectedPhotoIds: string[];
  onBackToAlbums: () => void;
  onOpenFilterModal: () => void;
  onViewModeChange: (mode: InsideAlbumViewMode) => void;
  onToggleSelectPhoto: (photoId: string) => void;
  onSelectAllPhotos: (selectAll: boolean) => void;
  onClearSelection: () => void;
  onDeletePhotos?: (photoIds: string[]) => void;
}

export const AlbumDetailView: React.FC<AlbumDetailViewProps> = ({
  album,
  photos,
  filter,
  viewMode,
  selectedPhotoIds,
  onBackToAlbums,
  onOpenFilterModal,
  onViewModeChange,
  onToggleSelectPhoto,
  onSelectAllPhotos,
  onClearSelection,
  onDeletePhotos,
}) => {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [showDeletePhotosModal, setShowDeletePhotosModal] = useState<boolean>(false);

  // Apply active filters & sorting
  const filteredPhotos = filterPhotos(photos, filter);

  // Group by upload date for 'by_date' mode (BR04)
  const groupedPhotos = groupPhotosByUploadDate(filteredPhotos);
  const sortedDates = Object.keys(groupedPhotos).sort((a, b) => {
    if (filter.sortBy === 'oldest') return a.localeCompare(b);
    return b.localeCompare(a);
  });

  const isAllSelected =
    filteredPhotos.length > 0 && selectedPhotoIds.length === filteredPhotos.length;

  const handleDownloadSelected = () => {
    if (selectedPhotoIds.length === 0) return;
    setDownloadNotice(`Đang nén và tải xuống ${selectedPhotoIds.length} hình ảnh (ZIP)...`);
    setTimeout(() => {
      setDownloadNotice(null);
      alert(`Đã tải xuống thành công gói ${selectedPhotoIds.length} ảnh!`);
    }, 1500);
  };

  const formatDisplayDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-5">
      {/* Standard Album Hero Banner Header (Matching Le Khai Giang specification) */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 min-h-[190px] flex flex-col justify-between p-6 md:p-8">
        {/* Background Cover Image with Rich Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={album.coverPhotoUrl}
            alt={album.title}
            className="w-full h-full object-cover opacity-50 filter blur-[0.5px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/75 to-slate-900/40"></div>
        </div>

        {/* Content Container (Layered above backdrop) */}
        <div className="relative z-10">
          <button
            type="button"
            onClick={onBackToAlbums}
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-white bg-black/40 hover:bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-xs transition-all mb-3 cursor-pointer"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
            <span>Quay lại tất cả album</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            {album.isSystem ? (
              <span className="text-[11px] font-bold text-white bg-blue-600/90 px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
                <FontAwesomeIcon icon={faShieldAlt} className="w-2.5 h-2.5" />
                <span>Album hệ thống</span>
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-white bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                Tự tạo
              </span>
            )}
            <span className="text-[11px] font-semibold text-white/90 bg-black/40 px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
              <FontAwesomeIcon icon={faUsers} className="w-2.5 h-2.5 text-blue-300" />
              <span>{album.audienceScope === 'whole_school' ? 'Toàn trường' : 'Lớp 1A1'}</span>
            </span>
            <span className="text-[11px] font-semibold text-amber-300 bg-black/40 px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs border border-white/10">
              <FontAwesomeIcon icon={faImages} className="w-2.5 h-2.5" />
              <span>{filteredPhotos.length} hình ảnh</span>
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white font-heading tracking-tight drop-shadow-xs">
            {album.title}
          </h1>

          {album.description && (
            <p className="text-xs md:text-sm text-white/85 mt-2 max-w-2xl leading-relaxed">
              {album.description}
            </p>
          )}
        </div>
      </div>

      {/* Control Bar: Filters, View Mode Toggle (BR05), Multi-Select (BR07) */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Filter modal trigger (BR06) & Active Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onOpenFilterModal}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filter.filterType !== 'all'
                ? 'bg-[#0070CE] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FontAwesomeIcon icon={faFilter} className="w-3 h-3" />
            <span>Lọc mở rộng</span>
            {filter.filterType === 'students' && filter.selectedStudentIds.length > 0 && (
              <span className="bg-white/20 px-1.5 py-0.2 rounded text-[10px]">
                {filter.selectedStudentIds.length} HS
              </span>
            )}
            {filter.filterType === 'unassigned' && (
              <span className="bg-white/20 px-1.5 py-0.2 rounded text-[10px]">Chưa gắn thẻ</span>
            )}
          </button>

          {/* Select All Checkbox */}
          <button
            type="button"
            onClick={() => onSelectAllPhotos(!isAllSelected)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <FontAwesomeIcon
              icon={isAllSelected ? faCheckSquare : faSquare}
              className={`w-3.5 h-3.5 ${isAllSelected ? 'text-[#0070CE]' : 'text-slate-400'}`}
            />
            <span>{isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}</span>
          </button>
        </div>

        {/* Right: View Mode Toggle (Theo ngày vs Danh sách phẳng - BR05) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
            <button
              type="button"
              onClick={() => onViewModeChange('by_date')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'by_date'
                  ? 'bg-white text-[#0070CE] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Album theo ngày"
            >
              <FontAwesomeIcon icon={faStream} className="w-3 h-3" />
              <span className="hidden sm:inline">Theo ngày</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('flat')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'flat'
                  ? 'bg-white text-[#0070CE] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Album dạng danh sách"
            >
              <FontAwesomeIcon icon={faThLarge} className="w-3 h-3" />
              <span className="hidden sm:inline">Dạng danh sách</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Batch Selection Bar (BR07) */}
      {selectedPhotoIds.length > 0 && (
        <div className="bg-slate-900 text-white rounded-xl px-5 py-3 shadow-lg flex items-center justify-between gap-4 animate-fadeIn sticky top-20 z-20">
          <div className="flex items-center gap-3">
            <span className="bg-[#FEC020] text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
              {selectedPhotoIds.length} ảnh đã chọn
            </span>
            <button
              type="button"
              onClick={onClearSelection}
              className="text-xs text-slate-300 hover:text-white underline"
            >
              Bỏ chọn
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadSelected}
              className="px-3 py-1.5 text-xs font-bold bg-[#0070CE] hover:bg-[#1A94FF] text-white rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faDownload} className="w-3 h-3" />
              <span>Tải xuống ZIP</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDeletePhotosModal(true)}
              className="px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              title="Xóa các hình ảnh đã chọn khỏi album"
            >
              <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
              <span>Xóa {selectedPhotoIds.length} ảnh</span>
            </button>
          </div>
        </div>
      )}

      {/* Download Progress Toast */}
      {downloadNotice && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-slate-700 animate-fadeIn">
          <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Empty State */}
      {filteredPhotos.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
            <FontAwesomeIcon icon={faFilter} className="w-6 h-6" />
          </div>
          <div className="text-base font-bold text-slate-800">Không có ảnh nào phù hợp</div>
          <p className="text-xs text-slate-500 mt-1">
            Hãy kiểm tra lại bộ lọc học sinh hoặc thiết lập lại để xem toàn bộ ảnh.
          </p>
        </div>
      )}

      {/* Photo Gallery Rendering */}
      {viewMode === 'by_date' ? (
        /* BR04: Grouped by upload date */
        <div className="space-y-6">
          {sortedDates.map((dateKey) => {
            const datePhotos = groupedPhotos[dateKey] || [];
            const firstPhoto = datePhotos[0];

            return (
              <div key={dateKey} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                {/* Date group header (BR04) */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-[#0070CE] w-3.5 h-3.5" />
                    <span className="font-bold text-slate-800 uppercase tracking-wide">
                      {formatDisplayDate(dateKey)}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-medium">
                      Đăng bởi <strong className="text-slate-800">{firstPhoto?.uploadedBy || 'Giáo viên'}</strong>
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    {datePhotos.length} hình ảnh
                  </span>
                </div>

                {/* Photo grid for this date */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                  {datePhotos.map((photo) => {
                    const isSelected = selectedPhotoIds.includes(photo.id);

                    return (
                      <div
                        key={photo.id}
                        onClick={() => onToggleSelectPhoto(photo.id)}
                        className={`group relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all ${
                          isSelected
                            ? 'ring-3 ring-[#0070CE] border-transparent scale-98'
                            : 'border-slate-200 hover:border-blue-400 hover:shadow-xs'
                        }`}
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption || 'Ảnh hoạt động'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Checkbox overlay (BR07) */}
                        <div
                          className={`absolute top-2 left-2 w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-[#0070CE] text-white shadow-xs'
                              : 'bg-black/40 text-transparent group-hover:text-white/60 hover:bg-black/60'
                          }`}
                        >
                          <FontAwesomeIcon icon={faCheck} className="w-3.5 h-3.5" />
                        </div>

                        {/* AI recognition tag badge */}
                        {photo.recognizedFaceCount > 0 && (
                          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                            <FontAwesomeIcon icon={faRobot} className="w-2.5 h-2.5 text-blue-300" />
                            <span>{photo.recognizedFaceCount} khuôn mặt</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Flat Grid View (BR05) */
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {filteredPhotos.map((photo) => {
              const isSelected = selectedPhotoIds.includes(photo.id);

              return (
                <div
                  key={photo.id}
                  onClick={() => onToggleSelectPhoto(photo.id)}
                  className={`group relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all ${
                    isSelected
                      ? 'ring-3 ring-[#0070CE] border-transparent scale-98'
                      : 'border-slate-200 hover:border-blue-400 hover:shadow-xs'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Ảnh hoạt động'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Checkbox overlay (BR07) */}
                  <div
                    className={`absolute top-2 left-2 w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#0070CE] text-white shadow-xs'
                        : 'bg-black/40 text-transparent group-hover:text-white/60 hover:bg-black/60'
                    }`}
                  >
                    <FontAwesomeIcon icon={faCheck} className="w-3.5 h-3.5" />
                  </div>

                  {photo.recognizedFaceCount > 0 && (
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                      <FontAwesomeIcon icon={faRobot} className="w-2.5 h-2.5 text-blue-300" />
                      <span>{photo.recognizedFaceCount}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmation Modal before Deleting Selected Photos */}
      <ConfirmDeleteModal
        isOpen={showDeletePhotosModal}
        title="Xác nhận xóa hình ảnh"
        message={
          <div>
            <p>
              Bạn có chắc chắn muốn xóa <strong>{selectedPhotoIds.length} hình ảnh</strong> đã chọn khỏi album <strong>"{album.title}"</strong> không?
            </p>
            <p className="mt-1 text-slate-500">
              Các hình ảnh này sẽ bị gỡ bỏ vĩnh viễn khỏi thư viện ảnh của lớp học.
            </p>
          </div>
        }
        confirmText={`Xác nhận xóa (${selectedPhotoIds.length} ảnh)`}
        cancelText="Hủy bỏ"
        onConfirm={() => {
          if (onDeletePhotos) {
            onDeletePhotos(selectedPhotoIds);
          }
          setShowDeletePhotosModal(false);
        }}
        onClose={() => setShowDeletePhotosModal(false)}
      />
    </div>
  );
};
