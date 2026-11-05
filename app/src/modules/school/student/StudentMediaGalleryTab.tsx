import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faImages,
  faWandMagicSparkles,
  faDownload,
  faExpand,
  faTimes,
  faCheckCircle,
  faCalendarAlt,
  faFolderOpen,
  faFilter,
  faSyncAlt,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import type { Student } from '../../../types/student';
import { useAppDispatch, useAppSelector } from '../../../store';
import { addToast } from '../../../store/slices/toastSlice';
import { Dropdown } from '@/components/ds';

interface StudentMediaGalleryTabProps {
  student: Student;
  schoolCode: string;
}

interface TaggedKidPhoto {
  id: string;
  albumId: string;
  albumTitle: string;
  url: string;
  thumbnailUrl: string;
  caption: string;
  date: string;
  confidence: number;
  aiDetectedFace: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  tags: string[];
}

export const StudentMediaGalleryTab: React.FC<StudentMediaGalleryTabProps> = ({
  student,
  schoolCode,
}) => {
  const dispatch = useAppDispatch();

  // Redux media albums
  const albums = useAppSelector((state) => state.media?.albums || []);
  const reduxPhotos = useAppSelector((state) => state.media?.photos || []);

  // AI Face scanning simulation state
  const [isScanning, setIsScanning] = useState(false);
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<TaggedKidPhoto | null>(null);
  const [selectedAlbumFilter, setSelectedAlbumFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'confidence'>('newest');

  // Initial tagged photos for this student
  const [taggedPhotos, setTaggedPhotos] = useState<TaggedKidPhoto[]>([
    {
      id: 'photo-tag-01',
      albumId: 'sys-album-activity-11a1',
      albumTitle: 'Tiết học STEAM & Chế tạo Robot',
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
      caption: `${student.fullName} hào hứng cùng nhóm thực hành lập trình robot di chuyển.`,
      date: '15/10/2026',
      confidence: 99.4,
      aiDetectedFace: { x: 35, y: 25, width: 20, height: 25 },
      tags: ['Học tập', 'STEAM', 'Lập trình'],
    },
    {
      id: 'photo-tag-02',
      albumId: 'sys-album-activity-11a1',
      albumTitle: 'Dã ngoại trải nghiệm sinh thái',
      url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80',
      caption: `Khoảnh khắc tham gia trò chơi kéo co đồng đội của ${student.fullName}.`,
      date: '02/10/2026',
      confidence: 98.7,
      aiDetectedFace: { x: 45, y: 30, width: 18, height: 22 },
      tags: ['Dã ngoại', 'Thể thao', 'Đồng đội'],
    },
    {
      id: 'photo-tag-03',
      albumId: 'album-khai-giang-2026',
      albumTitle: 'Lễ Khai giảng năm học 2026 - 2027',
      url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
      caption: `${student.fullName} cùng các bạn trong hàng ngũ lớp nhận cờ thi đua đầu năm.`,
      date: '05/09/2026',
      confidence: 99.1,
      aiDetectedFace: { x: 50, y: 20, width: 22, height: 26 },
      tags: ['Sự kiện', 'Khai giảng', 'Toàn trường'],
    },
    {
      id: 'photo-tag-04',
      albumId: 'sys-album-activity-11a1',
      albumTitle: 'Hoạt động Thể thao & Bơi lội',
      url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=1200&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&auto=format&fit=crop&q=80',
      caption: `Tiết học bơi khởi động và rèn luyện thể lực của học sinh.`,
      date: '22/09/2026',
      confidence: 97.8,
      aiDetectedFace: { x: 40, y: 35, width: 19, height: 24 },
      tags: ['Bơi lội', 'Thể chất'],
    },
    {
      id: 'photo-tag-05',
      albumId: 'sys-album-activity-11a1',
      albumTitle: 'Tiết học Tiếng Anh tăng cường',
      url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=1200&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
      caption: `Thuyết trình dự án tiếng Anh trước giáo viên nước ngoài.`,
      date: '18/09/2026',
      confidence: 98.9,
      aiDetectedFace: { x: 48, y: 22, width: 20, height: 25 },
      tags: ['Tiếng Anh', 'Thuyết trình'],
    },
    {
      id: 'photo-tag-06',
      albumId: 'sys-album-activity-11a1',
      albumTitle: 'Ngày hội Đọc sách & Khoa học',
      url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&auto=format&fit=crop&q=80',
      caption: `${student.fullName} đọc sách và nghiên cứu tư liệu tại thư viện trung tâm.`,
      date: '28/09/2026',
      confidence: 99.5,
      aiDetectedFace: { x: 38, y: 28, width: 21, height: 27 },
      tags: ['Thư viện', 'Đọc sách'],
    },
  ]);

  // Handle AI facial recognition scan simulation
  const handleTriggerAIScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      // Simulate finding a new recognized photo from another album
      const newPhoto: TaggedKidPhoto = {
        id: `photo-tag-new-${Date.now()}`,
        albumId: 'sys-album-activity-11a1',
        albumTitle: 'Giờ Sinh hoạt CLB Cờ vua',
        url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
        caption: `AI nhận diện khuôn mặt tự động phát hiện ${student.fullName} trong giải cờ vua giao hữu.`,
        date: '29/10/2026',
        confidence: 99.6,
        aiDetectedFace: { x: 42, y: 24, width: 20, height: 25 },
        tags: ['Cờ vua', 'Nhận diện mới'],
      };

      setTaggedPhotos((prev) => [newPhoto, ...prev]);
      setIsScanning(false);

      dispatch(
        addToast({
          type: 'success',
          message: `Quét AI hoàn tất! Đã nhận diện và gom thêm 1 bức ảnh mới của ${student.fullName}.`,
        })
      );
    }, 1200);
  };

  // Distinct albums list for filter dropdown
  const albumOptions = useMemo(() => {
    const unique = new Map<string, string>();
    taggedPhotos.forEach((p) => {
      unique.set(p.albumId, p.albumTitle);
    });

    const opts = [{ value: 'all', label: 'Tất cả album ảnh' }];
    unique.forEach((title, id) => {
      opts.push({ value: id, label: title });
    });
    return opts;
  }, [taggedPhotos]);

  // Filtered & sorted photos
  const filteredPhotos = useMemo(() => {
    let result = [...taggedPhotos];

    if (selectedAlbumFilter !== 'all') {
      result = result.filter((p) => p.albumId === selectedAlbumFilter);
    }

    if (sortOrder === 'confidence') {
      result.sort((a, b) => b.confidence - a.confidence);
    } else if (sortOrder === 'oldest') {
      result.reverse();
    }

    return result;
  }, [taggedPhotos, selectedAlbumFilter, sortOrder]);

  const avgConfidence = useMemo(() => {
    if (taggedPhotos.length === 0) return 0;
    const sum = taggedPhotos.reduce((acc, curr) => acc + curr.confidence, 0);
    return (sum / taggedPhotos.length).toFixed(1);
  }, [taggedPhotos]);

  return (
    <div className="space-y-6">
      {/* 1. Header Overview & AI Recognition Hub */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center text-xl shadow-sm shrink-0">
              <FontAwesomeIcon icon={faImages} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-800">
                  Kho ảnh nhận diện AI của {student.fullName}
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                  AI Face Recognition
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Trí tuệ nhân tạo tự động đối soát khuôn mặt và chỉ gom lưu những bức ảnh có mặt học sinh này từ toàn bộ thư viện trường.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              disabled={isScanning}
              onClick={handleTriggerAIScan}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white transition-all shadow-sm ${
                isScanning
                  ? 'bg-purple-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-200 active:scale-95'
              }`}
            >
              <FontAwesomeIcon
                icon={isScanning ? faSyncAlt : faWandMagicSparkles}
                className={isScanning ? 'animate-spin' : ''}
              />
              <span>{isScanning ? 'Đang quét ảnh AI...' : 'Quét nhận diện ảnh mới'}</span>
            </button>

            <Link
              href={`/${schoolCode}/class/${student.classId || 'class-11a1'}/media`}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            >
              <FontAwesomeIcon icon={faFolderOpen} className="text-slate-400" />
              <span>Thư viện ảnh lớp</span>
            </Link>
          </div>
        </div>

        {/* AI Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-5 pt-5 border-t border-slate-100 text-xs">
          <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100">
            <div className="text-purple-600 font-semibold mb-0.5">Ảnh đã nhận diện</div>
            <div className="text-lg font-bold text-slate-800">{taggedPhotos.length} bức ảnh</div>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <div className="text-emerald-700 font-semibold mb-0.5">Độ chính xác AI trung bình</div>
            <div className="text-lg font-bold text-slate-800">{avgConfidence}%</div>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
            <div className="text-blue-700 font-semibold mb-0.5">Album tham gia</div>
            <div className="text-lg font-bold text-slate-800">{albumOptions.length - 1} album</div>
          </div>

          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
            <div className="text-amber-700 font-semibold mb-0.5">Nhận diện gần nhất</div>
            <div className="text-lg font-bold text-slate-800">{taggedPhotos[0]?.date || 'Chưa có'}</div>
          </div>
        </div>
      </div>

      {/* 2. Filter & Controls Bar */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Album Filter */}
          <div className="w-56">
            <Dropdown
              options={albumOptions}
              value={selectedAlbumFilter}
              onChange={(val) => setSelectedAlbumFilter(val)}
              size="sm"
              variant="filter"
            />
          </div>

          {/* Sort Order */}
          <div className="w-44">
            <Dropdown
              options={[
                { value: 'newest', label: 'Mới nhất trước' },
                { value: 'oldest', label: 'Cũ nhất trước' },
                { value: 'confidence', label: 'Độ chính xác AI' },
              ]}
              value={sortOrder}
              onChange={(val) => setSortOrder(val as any)}
              size="sm"
              variant="filter"
            />
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Hiển thị <span className="font-bold text-slate-800">{filteredPhotos.length}</span> / {taggedPhotos.length} ảnh của {student.fullName}
        </div>
      </div>

      {/* 3. Photo Gallery Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto text-2xl">
            <FontAwesomeIcon icon={faImages} />
          </div>
          <h4 className="text-base font-bold text-slate-800">Không tìm thấy ảnh phù hợp</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Không có bức ảnh nào trong album đã chọn có khuôn mặt của học sinh. Bạn có thể bấm "Quét nhận diện ảnh mới" để rà soát toàn bộ thư viện.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
            >
              {/* Photo Image with Overlay */}
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer" onClick={() => setActiveLightboxPhoto(photo)}>
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* AI Tag Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs font-semibold bg-purple-900/80 text-white backdrop-blur-xs shadow-xs">
                  <FontAwesomeIcon icon={faWandMagicSparkles} className="text-amber-300 text-2xs" />
                  <span>AI: {photo.confidence}%</span>
                </div>

                {/* Date Badge */}
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-2xs font-medium bg-black/50 text-white backdrop-blur-xs">
                  {photo.date}
                </div>

                {/* Hover overlay action */}
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLightboxPhoto(photo);
                    }}
                    className="w-9 h-9 rounded-full bg-white/90 text-slate-800 hover:bg-white flex items-center justify-center text-sm shadow-md transition-transform hover:scale-110"
                    title="Phóng to"
                  >
                    <FontAwesomeIcon icon={faExpand} />
                  </button>
                  <a
                    href={photo.url}
                    download={`photo-${student.id}-${photo.id}.jpg`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-9 h-9 rounded-full bg-white/90 text-slate-800 hover:bg-white flex items-center justify-center text-sm shadow-md transition-transform hover:scale-110"
                    title="Tải ảnh về"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </a>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                <div>
                  <div className="flex items-center gap-1.5 text-2xs font-semibold text-purple-700 mb-1">
                    <FontAwesomeIcon icon={faFolderOpen} className="text-2xs" />
                    <span className="truncate">{photo.albumTitle}</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium line-clamp-2">
                    {photo.caption}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-2xs text-slate-400">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {photo.tags.map((t) => (
                      <span key={t} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveLightboxPhoto(photo)}
                    className="text-[#0070CE] font-semibold hover:underline"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Lightbox Detail Modal */}
      {activeLightboxPhoto && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                <span className="px-2 py-0.5 rounded bg-purple-600 text-white text-2xs">
                  AI Tag: {activeLightboxPhoto.confidence}%
                </span>
                <span>{activeLightboxPhoto.albumTitle}</span>
                <span className="text-slate-400">• {activeLightboxPhoto.date}</span>
              </div>

              <button
                type="button"
                onClick={() => setActiveLightboxPhoto(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="text-base" />
              </button>
            </div>

            {/* Image Preview Area */}
            <div className="relative bg-slate-950 flex items-center justify-center overflow-hidden flex-1 min-h-[360px]">
              <img
                src={activeLightboxPhoto.url}
                alt={activeLightboxPhoto.caption}
                className="max-h-[60vh] max-w-full object-contain"
              />

              {/* Visual simulated AI face detection box */}
              <div
                style={{
                  position: 'absolute',
                  left: `${activeLightboxPhoto.aiDetectedFace.x}%`,
                  top: `${activeLightboxPhoto.aiDetectedFace.y}%`,
                  width: `${activeLightboxPhoto.aiDetectedFace.width}%`,
                  height: `${activeLightboxPhoto.aiDetectedFace.height}%`,
                }}
                className="border-2 border-purple-400 rounded-lg shadow-lg shadow-purple-500/40 pointer-events-none flex items-start justify-end p-1 animate-pulse"
              >
                <span className="bg-purple-600 text-white text-2xs px-1 rounded font-bold shadow-xs">
                  {student.fullName} ({activeLightboxPhoto.confidence}%)
                </span>
              </div>
            </div>

            {/* Lightbox Footer */}
            <div className="p-5 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800">
                  {activeLightboxPhoto.caption}
                </p>
                <p className="text-xs text-slate-500">
                  Nhận diện tự động dựa trên hồ sơ khuôn mặt CSDL học sinh • Đã lưu vào kho ảnh cá nhân của {student.fullName}.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <a
                  href={activeLightboxPhoto.url}
                  download={`photo-${student.id}.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0070CE] hover:bg-[#005ba8] rounded-xl transition-colors shadow-sm"
                >
                  <FontAwesomeIcon icon={faDownload} />
                  <span>Tải ảnh gốc</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
