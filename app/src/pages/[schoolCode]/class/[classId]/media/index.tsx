import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  createAlbum,
  deleteAlbum,
  deletePhotos,
  openAlbum,
  closeAlbum,
  setGalleryViewMode,
  setInsideAlbumViewMode,
  setFilter,
  toggleSelectPhoto,
  selectAllPhotosInAlbum,
  clearSelectedPhotos,
  setSearchQuery,
  openCreateAlbumModal,
  closeCreateAlbumModal,
  openFilterModal,
  closeFilterModal,
  openFaceRecognitionModal,
  closeFaceRecognitionModal,
  startAIScan,
  finishAIScan,
} from '@/store/slices/mediaSlice';
import PortalLayout from '@/components/layout/PortalLayout';
import { MediaToolbar } from '@/modules/operations/media/MediaToolbar';
import { AlbumGrid } from '@/modules/operations/media/AlbumGrid';
import { AlbumDetailView } from '@/modules/operations/media/AlbumDetailView';
import { CreateAlbumModal } from '@/modules/operations/media/CreateAlbumModal';
import { MediaFilterModal } from '@/modules/operations/media/MediaFilterModal';
import { FaceRecognitionModal } from '@/modules/operations/media/FaceRecognitionModal';
import { PageHeader, Button } from '@/components/ds';

export default function MediaPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const classId = (router.query.classId as string) || 'lop-1a1';

  const dispatch = useAppDispatch();
  const {
    albums,
    photos,
    activeAlbumId,
    searchQuery,
    galleryViewMode,
    insideAlbumViewMode,
    filter,
    selectedPhotoIds,
    isCreateAlbumModalOpen,
    isFilterModalOpen,
    isFaceRecognitionModalOpen,
    recognitionStats,
    isScanningAI,
    aiScanSuccessMessage,
  } = useAppSelector((state) => state.media);

  // Active selected album object if inside an album
  const activeAlbum = useMemo(() => {
    if (!activeAlbumId) return null;
    return albums.find((a) => a.id === activeAlbumId) || null;
  }, [albums, activeAlbumId]);

  // Photos belonging to the active album
  const activeAlbumPhotos = useMemo(() => {
    if (!activeAlbumId) return [];
    return photos.filter((p) => p.albumId === activeAlbumId);
  }, [photos, activeAlbumId]);

  // Filtered albums for gallery view
  const filteredAlbums = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return albums.filter((album) => {
      const matchesClass =
        album.classId === classId || album.audienceScope === 'whole_school';
      if (!matchesClass) return false;

      if (q) {
        const titleMatch = album.title.toLowerCase().includes(q);
        const descMatch = (album.description || '').toLowerCase().includes(q);
        return titleMatch || descMatch;
      }
      return true;
    });
  }, [albums, classId, searchQuery]);

  // Total summary statistics
  const totalAlbumsCount = filteredAlbums.length;
  const totalPhotosCount = photos.length;
  const recognizedCount = recognitionStats.reduce((acc, s) => acc + s.recognizedPhotosCount, 0);
  const recognitionRate = Math.min(100, Math.round((recognizedCount / 36) * 100));

  const handleStartAIScan = () => {
    dispatch(startAIScan());
    setTimeout(() => {
      dispatch(finishAIScan({ recognizedNewCount: 4 }));
    }, 1800);
  };

  return (
    <PortalLayout schoolCode={schoolCode}>
      <Head>
        <title>Thư viện ảnh Lớp học | School Operating Portal</title>
        <meta
          name="description"
          content="Thư viện ảnh và video lớp học, album sự kiện và nhận diện khuôn mặt học sinh - ECO School Portal"
        />
      </Head>

      <div className="space-y-4">
        {/* Main Content Pane: either Album Gallery OR Inside Album Detail */}
        {!activeAlbum ? (
          <div className="space-y-4">
            {/* Top Page Header */}
            <PageHeader
              title="Thư Viện Ảnh Lớp 1A1"
              description="Kho lưu trữ ảnh, video hoạt động và nhận diện khuôn mặt học sinh"
              actions={
                <div className="flex items-center gap-3">
                  <Button
                    variant="secondary"
                    icon="camera"
                    onClick={() => dispatch(openFaceRecognitionModal())}
                  >
                    Nhận diện AI ({recognitionRate}%)
                  </Button>
                  <Button
                    variant="primary"
                    icon="plus"
                    onClick={() => dispatch(openCreateAlbumModal())}
                  >
                    Tạo album mới
                  </Button>
                </div>
              }
            />

            {/* Gallery Toolbar */}
            <MediaToolbar
              searchQuery={searchQuery}
              onSearchChange={(q) => dispatch(setSearchQuery(q))}
              viewMode={galleryViewMode}
              onViewModeChange={(m) => dispatch(setGalleryViewMode(m))}
              totalAlbums={totalAlbumsCount}
              totalPhotos={totalPhotosCount}
              recognitionRate={recognitionRate}
            />

            {/* Albums Grid or List View */}
            <AlbumGrid
              albums={filteredAlbums}
              viewMode={galleryViewMode}
              onSelectAlbum={(id) => dispatch(openAlbum(id))}
              onDeleteAlbum={(id) => dispatch(deleteAlbum(id))}
            />
          </div>
        ) : (
          /* Inside Album View */
          <AlbumDetailView
            album={activeAlbum}
            photos={activeAlbumPhotos}
            filter={filter}
            viewMode={insideAlbumViewMode}
            selectedPhotoIds={selectedPhotoIds}
            onBackToAlbums={() => dispatch(closeAlbum())}
            onOpenFilterModal={() => dispatch(openFilterModal())}
            onViewModeChange={(m) => dispatch(setInsideAlbumViewMode(m))}
            onToggleSelectPhoto={(id) => dispatch(toggleSelectPhoto(id))}
            onSelectAllPhotos={(sel) => dispatch(selectAllPhotosInAlbum(sel))}
            onClearSelection={() => dispatch(clearSelectedPhotos())}
            onDeletePhotos={(photoIds) => dispatch(deletePhotos({ albumId: activeAlbum.id, photoIds }))}
          />
        )}
      </div>

      {/* Create Album Modal */}
      <CreateAlbumModal
        isOpen={isCreateAlbumModalOpen}
        onClose={() => dispatch(closeCreateAlbumModal())}
        onSubmit={(data) => dispatch(createAlbum(data))}
      />

      {/* Advanced Filter Modal (BR06) */}
      <MediaFilterModal
        isOpen={isFilterModalOpen}
        currentFilter={filter}
        onClose={() => dispatch(closeFilterModal())}
        onApplyFilter={(f) => dispatch(setFilter(f))}
      />

      {/* AI Facial Recognition Modal (BR08 & BR09) */}
      <FaceRecognitionModal
        isOpen={isFaceRecognitionModalOpen}
        onClose={() => dispatch(closeFaceRecognitionModal())}
        stats={recognitionStats}
        isScanning={isScanningAI}
        scanMessage={aiScanSuccessMessage}
        onStartScan={handleStartAIScan}
      />
    </PortalLayout>
  );
}
