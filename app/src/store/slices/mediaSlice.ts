import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PhotoAlbum,
  PhotoAsset,
  StudentRecognitionStat,
  MediaFilterState,
  MediaGalleryViewMode,
  InsideAlbumViewMode,
  AudienceScope,
} from '../../types/media';
import {
  INITIAL_PHOTO_ALBUMS,
  INITIAL_PHOTO_ASSETS,
  MOCK_STUDENT_RECOGNITION_STATS,
} from '../../services/mockMediaData';

export interface MediaState {
  albums: PhotoAlbum[];
  photos: PhotoAsset[];
  activeAlbumId: string | null;
  selectedClassId: string;
  searchQuery: string;
  galleryViewMode: MediaGalleryViewMode;
  insideAlbumViewMode: InsideAlbumViewMode;
  filter: MediaFilterState;
  selectedPhotoIds: string[];
  isCreateAlbumModalOpen: boolean;
  isFilterModalOpen: boolean;
  isFaceRecognitionModalOpen: boolean;
  recognitionStats: StudentRecognitionStat[];
  isScanningAI: boolean;
  aiScanSuccessMessage: string | null;
}

const initialState: MediaState = {
  albums: INITIAL_PHOTO_ALBUMS,
  photos: INITIAL_PHOTO_ASSETS,
  activeAlbumId: null,
  selectedClassId: 'lop-1a1',
  searchQuery: '',
  galleryViewMode: 'grid',
  insideAlbumViewMode: 'by_date',
  filter: {
    filterType: 'all',
    selectedStudentIds: [],
    sortBy: 'newest',
  },
  selectedPhotoIds: [],
  isCreateAlbumModalOpen: false,
  isFilterModalOpen: false,
  isFaceRecognitionModalOpen: false,
  recognitionStats: MOCK_STUDENT_RECOGNITION_STATS,
  isScanningAI: false,
  aiScanSuccessMessage: null,
};

export interface CreateAlbumPayload {
  title: string;
  description?: string;
  audienceScope: AudienceScope;
  coverPhotoUrl?: string;
  taggedStudentIds?: string[];
}

export const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    createAlbum: (state, action: PayloadAction<CreateAlbumPayload>) => {
      const newId = `alb-custom-${Date.now()}`;
      const nowIso = new Date().toISOString();
      const defaultCover =
        action.payload.coverPhotoUrl ||
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80';

      const newAlbum: PhotoAlbum = {
        id: newId,
        classId: state.selectedClassId,
        title: action.payload.title,
        description: action.payload.description || '',
        coverPhotoUrl: defaultCover,
        audienceScope: action.payload.audienceScope,
        isSystem: false,
        photoCount: 0,
        taggedStudentIds: action.payload.taggedStudentIds || [],
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      state.albums.push(newAlbum);
      state.isCreateAlbumModalOpen = false;
    },

    updateAlbum: (
      state,
      action: PayloadAction<{ id: string; title: string; description?: string; audienceScope: AudienceScope }>
    ) => {
      const album = state.albums.find((a) => a.id === action.payload.id);
      if (album && !album.isSystem) {
        album.title = action.payload.title;
        album.description = action.payload.description;
        album.audienceScope = action.payload.audienceScope;
        album.updatedAt = new Date().toISOString();
      }
    },

    deleteAlbum: (state, action: PayloadAction<string>) => {
      const album = state.albums.find((a) => a.id === action.payload);
      if (album && !album.isSystem) {
        state.albums = state.albums.filter((a) => a.id !== action.payload);
        state.photos = state.photos.filter((p) => p.albumId !== action.payload);
        if (state.activeAlbumId === action.payload) {
          state.activeAlbumId = null;
        }
      }
    },

    deletePhotos: (
      state,
      action: PayloadAction<{ albumId: string; photoIds: string[] }>
    ) => {
      const { albumId, photoIds } = action.payload;
      state.photos = state.photos.filter((p) => !photoIds.includes(p.id));
      state.selectedPhotoIds = state.selectedPhotoIds.filter((id) => !photoIds.includes(id));
      const album = state.albums.find((a) => a.id === albumId);
      if (album) {
        album.photoCount = state.photos.filter((p) => p.albumId === albumId).length;
      }
    },

    openAlbum: (state, action: PayloadAction<string>) => {
      state.activeAlbumId = action.payload;
      state.selectedPhotoIds = [];
      state.filter = {
        filterType: 'all',
        selectedStudentIds: [],
        sortBy: 'newest',
      };
    },

    closeAlbum: (state) => {
      state.activeAlbumId = null;
      state.selectedPhotoIds = [];
    },

    setGalleryViewMode: (state, action: PayloadAction<MediaGalleryViewMode>) => {
      state.galleryViewMode = action.payload;
    },

    setInsideAlbumViewMode: (state, action: PayloadAction<InsideAlbumViewMode>) => {
      state.insideAlbumViewMode = action.payload;
    },

    setFilter: (state, action: PayloadAction<MediaFilterState>) => {
      state.filter = action.payload;
      state.isFilterModalOpen = false;
    },

    toggleSelectPhoto: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedPhotoIds.includes(id)) {
        state.selectedPhotoIds = state.selectedPhotoIds.filter((pId) => pId !== id);
      } else {
        state.selectedPhotoIds.push(id);
      }
    },

    selectAllPhotosInAlbum: (state, action: PayloadAction<boolean>) => {
      if (action.payload && state.activeAlbumId) {
        const albumPhotos = state.photos.filter((p) => p.albumId === state.activeAlbumId);
        state.selectedPhotoIds = albumPhotos.map((p) => p.id);
      } else {
        state.selectedPhotoIds = [];
      }
    },

    clearSelectedPhotos: (state) => {
      state.selectedPhotoIds = [];
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    openCreateAlbumModal: (state) => {
      state.isCreateAlbumModalOpen = true;
    },

    closeCreateAlbumModal: (state) => {
      state.isCreateAlbumModalOpen = false;
    },

    openFilterModal: (state) => {
      state.isFilterModalOpen = true;
    },

    closeFilterModal: (state) => {
      state.isFilterModalOpen = false;
    },

    openFaceRecognitionModal: (state) => {
      state.isFaceRecognitionModalOpen = true;
      state.aiScanSuccessMessage = null;
    },

    closeFaceRecognitionModal: (state) => {
      state.isFaceRecognitionModalOpen = false;
      state.aiScanSuccessMessage = null;
    },

    startAIScan: (state) => {
      state.isScanningAI = true;
    },

    finishAIScan: (state, action: PayloadAction<{ recognizedNewCount: number }>) => {
      state.isScanningAI = false;
      state.aiScanSuccessMessage = `Đã hoàn tất nhận diện AI! Tìm thấy và gắn thẻ thêm ${action.payload.recognizedNewCount} khuôn mặt học sinh trong album.`;

      // Update recognition stats
      state.recognitionStats = state.recognitionStats.map((stat) => ({
        ...stat,
        recognizedPhotosCount: stat.recognizedPhotosCount + 1,
        confidenceRate: Math.min(99.4, +(stat.confidenceRate + 0.5).toFixed(1)),
      }));
    },
  },
});

export const {
  createAlbum,
  updateAlbum,
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
} = mediaSlice.actions;

export default mediaSlice.reducer;
