/**
 * Mock data fixture for School Announcement Board (Bảng Thông Tin)
 * Module M5 / Feature 039-school-announcement-board-bang-thong-tin
 */

import type { Announcement } from '../types/announcement.ts';

export const INITIAL_MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-001',
    schoolCode: 'demo',
    title: 'Thông báo về việc thu học phí và các khoản dịch vụ tháng 10/2026',
    content: `<p>Kính gửi: Toàn thể Quý phụ huynh học sinh Trường Tiểu học & THCS Vinschool,</p>
<p>Nhà trường xin trân trọng thông báo về việc phát hành và thu học phí kỳ tháng 10/2026. Chi tiết các khoản thu bao gồm:</p>
<ul>
  <li>Học phí chính khóa tháng 10/2026</li>
  <li>Tiền ăn bán trú và dịch vụ chăm sóc bán trú</li>
  <li>Dịch vụ xe buýt đưa đón học sinh (nếu có đăng ký)</li>
  <li>Khoản hoàn tiền ăn tháng 9 đối với các ngày nghỉ học có phép hợp lệ</li>
</ul>
<p>Quý phụ huynh vui lòng thanh toán trực tuyến qua Cổng thông tin tài chính trước ngày 15/10/2026 để nhà trường kịp thời quyết toán sổ sách.</p>
<p>Trân trọng cảm ơn sự phối hợp của Quý phụ huynh!</p>`,
    excerpt: 'Thông báo phát hành phiếu thu học phí và tiền ăn bán trú tháng 10/2026 kèm cơ chế hoàn tiền vắng tháng 9.',
    category: 'hoc_phi',
    priority: 'important',
    status: 'da_gui',
    channels: ['portal', 'email', 'push'],
    audienceScope: 'toan_truong',
    subAudience: 'parents',
    targetGradeIds: [],
    targetClassIds: [],
    targetStaffRoles: [],
    attachments: [
      {
        id: 'att-001',
        fileName: 'Ke_hoach_thu_hoc_phi_T10_2026.pdf',
        fileSize: 1250000,
        fileType: 'pdf',
        fileUrl: '/docs/Ke_hoach_thu_hoc_phi_T10_2026.pdf'
      }
    ],
    publishedAt: '2026-10-01T08:00:00.000Z',
    createdBy: 'usr-admin-01',
    authorName: 'Phòng Tài Chính Kế Toán',
    authorRole: 'Kế toán trưởng',
    createdAt: '2026-09-30T10:30:00.000Z',
    updatedAt: '2026-10-01T08:00:00.000Z',
    isPinned: true,
    recipientCount: 540,
    emailSentCount: 528,
    portalReadCount: 462
  },
  {
    id: 'ann-002',
    schoolCode: 'demo',
    title: 'Thông báo khẩn: Cho học sinh nghỉ học tránh bão số 4 ngày 08/10/2026',
    content: `<p>Thực hiện công văn chỉ đạo khẩn của Sở Giáo dục và Đào tạo TP.HCM về việc phòng chống cơn bão số 4 đổ bộ:</p>
<p>Nhà trường xin thông báo cho toàn thể học sinh từ Khối Mầm non đến THCS được <strong>nghỉ học tập trung vào ngày Thứ Năm (08/10/2026)</strong>.</p>
<p>Các giáo viên bộ môn sẽ gửi bài tập ôn luyện tại nhà qua mục Học tập > Bài tập trên Cổng thông tin. Kính mong Quý phụ huynh lưu ý quản lý và đảm bảo an toàn cho các con tại gia đình.</p>`,
    excerpt: 'Học sinh toàn trường được nghỉ học tập trung ngày 08/10/2026 để phòng chống ảnh hưởng cơn bão số 4.',
    category: 'khan_cap',
    priority: 'urgent',
    status: 'da_gui',
    channels: ['portal', 'email', 'sms', 'push'],
    audienceScope: 'toan_truong',
    subAudience: 'all',
    targetGradeIds: [],
    targetClassIds: [],
    targetStaffRoles: [],
    attachments: [],
    publishedAt: '2026-10-06T15:30:00.000Z',
    createdBy: 'usr-principal-01',
    authorName: 'Ban Giám Hiệu',
    authorRole: 'Hiệu trưởng',
    createdAt: '2026-10-06T15:00:00.000Z',
    updatedAt: '2026-10-06T15:30:00.000Z',
    isPinned: true,
    recipientCount: 620,
    emailSentCount: 615,
    portalReadCount: 580
  },
  {
    id: 'ann-003',
    schoolCode: 'demo',
    title: 'Kế hoạch tổ chức Ngày hội Khoa học & STEM Khối 10 năm học 2026-2027',
    content: `<p>Nhằm thúc đẩy tinh thần nghiên cứu sáng tạo và ứng dụng kiến thức liên môn, Tổ Tự nhiên phát động Ngày hội Khoa học STEM dành cho học sinh Khối 10.</p>
<p>Thời gian tổ chức: 08:00 - 16:30 Thứ Bảy ngày 24/10/2026 tại Nhà thi đấu đa năng.</p>
<p>Các lớp đăng ký đề tài nghiên cứu và mô hình thí nghiệm với giáo viên phụ trách trước ngày 15/10/2026.</p>`,
    excerpt: 'Phát động ngày hội khoa học và sáng tạo STEM dành riêng cho học sinh các lớp Khối 10.',
    category: 'su_kien',
    priority: 'normal',
    status: 'da_len_lich',
    channels: ['portal', 'email', 'push'],
    audienceScope: 'khoi_lop',
    subAudience: 'all',
    targetGradeIds: ['k10'],
    targetClassIds: ['c10a1', 'c10a2'],
    targetStaffRoles: [],
    attachments: [
      {
        id: 'att-002',
        fileName: 'The_le_cuoc_thi_STEM_Khoi10.docx',
        fileSize: 850000,
        fileType: 'docx',
        fileUrl: '/docs/The_le_cuoc_thi_STEM_Khoi10.docx'
      }
    ],
    scheduledAt: '2026-10-10T07:00:00.000Z',
    createdBy: 'usr-teacher-01',
    authorName: 'Thầy Nguyễn Văn An',
    authorRole: 'Tổ trưởng chuyên môn',
    createdAt: '2026-10-05T09:00:00.000Z',
    updatedAt: '2026-10-05T09:00:00.000Z',
    isPinned: false,
    recipientCount: 140,
    emailSentCount: 0,
    portalReadCount: 0
  },
  {
    id: 'ann-004',
    schoolCode: 'demo',
    title: 'Lịch thi khảo sát chất lượng đầu năm môn Toán & Ngữ văn',
    content: `<p>Phòng Đào tạo xin thông báo lịch khảo sát năng lực đầu năm học dành cho học sinh các khối lớp THCS và THPT:</p>
<ul>
  <li>Môn Toán: Sáng Thứ Ba ngày 13/10/2026 (90 phút)</li>
  <li>Môn Ngữ văn: Chiều Thứ Ba ngày 13/10/2026 (90 phút)</li>
</ul>
<p>Đề nghị học sinh có mặt tại phòng thi trước giờ phát đề 15 phút và mang đầy đủ dụng cụ học tập.</p>`,
    excerpt: 'Thông báo lịch thi và quy chế thi khảo sát chất lượng đầu năm học 2026-2027.',
    category: 'hoc_tap',
    priority: 'important',
    status: 'da_gui',
    channels: ['portal', 'push'],
    audienceScope: 'toan_truong',
    subAudience: 'students',
    targetGradeIds: [],
    targetClassIds: [],
    targetStaffRoles: [],
    attachments: [],
    publishedAt: '2026-10-02T10:00:00.000Z',
    createdBy: 'usr-academic-01',
    authorName: 'Phòng Đào Tạo',
    authorRole: 'Trưởng phòng đào tạo',
    createdAt: '2026-10-02T08:30:00.000Z',
    updatedAt: '2026-10-02T10:00:00.000Z',
    isPinned: false,
    recipientCount: 420,
    emailSentCount: 0,
    portalReadCount: 388
  },
  {
    id: 'ann-005',
    schoolCode: 'demo',
    title: 'Kế hoạch nghỉ lễ Ngày Nhà giáo Việt Nam 20/11 và thi đua dạy tốt',
    content: `<p>Bản thảo nội dung phát động phong trào thi đua chào mừng ngày Nhà giáo Việt Nam 20/11.</p>
<p>Các nội dung trọng tâm bao gồm: Hội giảng cấp trường, tuần lễ tiết học tốt, thi làm báo tường và hội diễn văn nghệ.</p>`,
    excerpt: 'Dự thảo kế hoạch thi đua dạy tốt học tốt và tổ chức mít tinh kỷ niệm 20/11.',
    category: 'nghi_le',
    priority: 'normal',
    status: 'nhap',
    channels: ['portal', 'email'],
    audienceScope: 'nhan_vien',
    subAudience: 'teachers',
    targetGradeIds: [],
    targetClassIds: [],
    targetStaffRoles: ['teacher', 'staff'],
    attachments: [],
    createdBy: 'usr-admin-01',
    authorName: 'Công Đoàn Trường',
    authorRole: 'Chủ tịch công đoàn',
    createdAt: '2026-10-04T14:15:00.000Z',
    updatedAt: '2026-10-04T14:15:00.000Z',
    isPinned: false,
    recipientCount: 48,
    emailSentCount: 0,
    portalReadCount: 0
  },
  {
    id: 'ann-006',
    schoolCode: 'demo',
    title: 'Họp phụ huynh đầu năm học lớp 10A1 và 10A2',
    content: `<p>Kính gửi Quý phụ huynh học sinh lớp 10A1 và 10A2,</p>
<p>Ban Giám hiệu trân trọng kính mời Quý phụ huynh tham dự buổi họp phụ huynh đầu năm học để thảo luận về phương hướng học tập và ban đại diện cha mẹ học sinh.</p>
<p>Thời gian: 08:30 Chủ Nhật ngày 11/10/2026 tại phòng học của lớp.</p>`,
    excerpt: 'Thư mời họp phụ huynh đầu năm học 2026-2027 cho hai lớp 10A1 và 10A2.',
    category: 'chung',
    priority: 'normal',
    status: 'da_gui',
    channels: ['portal', 'email'],
    audienceScope: 'lop_hoc',
    subAudience: 'parents',
    targetGradeIds: ['k10'],
    targetClassIds: ['c10a1', 'c10a2'],
    targetStaffRoles: [],
    attachments: [],
    publishedAt: '2026-10-03T09:00:00.000Z',
    createdBy: 'usr-teacher-02',
    authorName: 'Cô Lê Thị Mai',
    authorRole: 'Giáo viên chủ nhiệm',
    createdAt: '2026-10-03T08:00:00.000Z',
    updatedAt: '2026-10-03T09:00:00.000Z',
    isPinned: false,
    recipientCount: 70,
    emailSentCount: 70,
    portalReadCount: 65
  }
];

export const MOCK_SCHOOL_CLASSES_FOR_TARGETING = [
  { id: 'c10a1', name: 'Lớp 10A1', gradeLevelId: 'k10', studentCount: 35 },
  { id: 'c10a2', name: 'Lớp 10A2', gradeLevelId: 'k10', studentCount: 35 },
  { id: 'c10a3', name: 'Lớp 10A3', gradeLevelId: 'k10', studentCount: 34 },
  { id: 'c11a1', name: 'Lớp 11A1', gradeLevelId: 'k11', studentCount: 36 },
  { id: 'c11a2', name: 'Lớp 11A2', gradeLevelId: 'k11', studentCount: 35 },
  { id: 'c12a1', name: 'Lớp 12A1', gradeLevelId: 'k12', studentCount: 32 },
  { id: 'c06a1', name: 'Lớp 6A1', gradeLevelId: 'k06', studentCount: 38 },
  { id: 'c07a1', name: 'Lớp 7A1', gradeLevelId: 'k07', studentCount: 37 },
  { id: 'c01a1', name: 'Lớp 1A1', gradeLevelId: 'k01', studentCount: 30 }
];
