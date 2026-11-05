/**
 * Mock Data Fixtures for School Parent Handbook (Sổ Tay PH)
 * Realistic Vietnamese educational institutional knowledge base
 */

import type { HandbookCategory, HandbookArticle } from '../types/parentHandbook.ts';

export const INITIAL_HANDBOOK_CATEGORIES: HandbookCategory[] = [
  // Root Category 1
  {
    id: 'cat-01',
    schoolCode: 'demo',
    name: 'Quy định chung & Nội quy nhà trường',
    note: 'Các quy định hành chính, nội quy cơ sở vật chất và văn hóa ứng xử áp dụng toàn trường',
    parentCategoryId: null,
    displayOrder: 0,
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-15T09:30:00Z',
  },
  // Sub-categories under cat-01
  {
    id: 'cat-01-01',
    schoolCode: 'demo',
    name: 'Thời gian biểu & Đưa đón học sinh',
    note: 'Quy định khung giờ cổng trường, xe buýt tuyến và ủy quyền người đón hộ',
    parentCategoryId: 'cat-01',
    displayOrder: 0,
    createdAt: '2026-08-01T08:30:00Z',
    updatedAt: '2026-08-16T10:00:00Z',
  },
  {
    id: 'cat-01-02',
    schoolCode: 'demo',
    name: 'Đồng phục & Dụng cụ học tập',
    note: 'Quy định trang phục theo mùa, lịch mặc đồng phục thể chất và đồ dùng cá nhân',
    parentCategoryId: 'cat-01',
    displayOrder: 1,
    createdAt: '2026-08-01T09:00:00Z',
    updatedAt: '2026-08-17T11:00:00Z',
  },

  // Root Category 2
  {
    id: 'cat-02',
    schoolCode: 'demo',
    name: 'Y tế, An toàn & Dinh dưỡng',
    note: 'Chính sách chăm sóc sức khỏe ban đầu, vệ sinh an toàn thực phẩm và phòng dịch',
    parentCategoryId: null,
    displayOrder: 1,
    createdAt: '2026-08-02T08:00:00Z',
    updatedAt: '2026-08-18T14:00:00Z',
  },
  // Sub-categories under cat-02
  {
    id: 'cat-02-01',
    schoolCode: 'demo',
    name: 'Khám sức khỏe định kỳ & BHYT',
    note: 'Kế hoạch kiểm tra nha học đường, thị lực và quyền lợi bảo hiểm y tế bắt buộc',
    parentCategoryId: 'cat-02',
    displayOrder: 0,
    createdAt: '2026-08-02T08:30:00Z',
    updatedAt: '2026-08-19T09:00:00Z',
  },
  {
    id: 'cat-02-02',
    schoolCode: 'demo',
    name: 'Quy trình gửi thuốc & Chăm sóc y tế',
    note: 'Hướng dẫn phụ huynh ủy quyền cho phòng Y tế cho học sinh uống thuốc trong ngày',
    parentCategoryId: 'cat-02',
    displayOrder: 1,
    createdAt: '2026-08-02T09:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z',
  },

  // Root Category 3
  {
    id: 'cat-03',
    schoolCode: 'demo',
    name: 'Học phí & Chính sách tài chính',
    note: 'Biểu phí niêm yết, thời hạn hoàn thành học phí và chính sách hoàn phí khi nghỉ',
    parentCategoryId: null,
    displayOrder: 2,
    createdAt: '2026-08-03T08:00:00Z',
    updatedAt: '2026-08-21T15:00:00Z',
  },
  // Sub-categories under cat-03
  {
    id: 'cat-03-01',
    schoolCode: 'demo',
    name: 'Cơ chế hoàn phí khi nghỉ học',
    note: 'Cách tính tiền ăn, tiền bán trú và phí đưa đón được hoàn trả khi học sinh xin nghỉ',
    parentCategoryId: 'cat-03',
    displayOrder: 0,
    createdAt: '2026-08-03T08:30:00Z',
    updatedAt: '2026-08-22T08:00:00Z',
  },
  {
    id: 'cat-03-02',
    schoolCode: 'demo',
    name: 'Học bổng & Miễn giảm học phí',
    note: 'Tiêu chuẩn xét duyệt miễn giảm học phí cho con em diện chính sách hoặc đạt giải',
    parentCategoryId: 'cat-03',
    displayOrder: 1,
    createdAt: '2026-08-03T09:00:00Z',
    updatedAt: '2026-08-22T09:00:00Z',
  },
];

export const INITIAL_HANDBOOK_ARTICLES: HandbookArticle[] = [
  // Articles in cat-01-01 (Thời gian biểu & Đưa đón)
  {
    id: 'art-01',
    schoolCode: 'demo',
    title: 'Quy định đưa đón học sinh và thời gian biểu năm học 2026-2027',
    content: `
      <h3>1. Thời gian mở cổng và đón trả học sinh</h3>
      <p>Cổng trường bắt đầu đón học sinh từ <strong>07h00</strong> các ngày từ Thứ Hai đến Thứ Sáu. Tiết học đầu tiên bắt đầu vào lúc <strong>08h00</strong>. Đề nghị Quý Phụ huynh đưa con đến trường trước 07h50 để các con kịp ổn định nề nếp đầu giờ.</p>
      <ul>
        <li><strong>Giờ tan học buổi chiều:</strong> 16h30 hàng ngày.</li>
        <li><strong>Thời gian trả học sinh tự đón:</strong> Từ 16h30 đến 17h30.</li>
        <li><strong>Sau 17h30:</strong> Học sinh sẽ được bàn giao về phòng quản lý học sinh muộn tại Tầng 1 Nhà A.</li>
      </ul>
      <h3>2. Quy định dành cho xe đưa đón tuyến (School Bus)</h3>
      <p>Học sinh đăng ký xe đưa đón cần có mặt tại điểm đón trước <strong>05 phút</strong> so với lịch hẹn trong hợp đồng. Giám thị xe buýt sẽ gọi điện thông báo trước khi xe đến 03 phút.</p>
    `,
    categoryId: 'cat-01-01',
    status: 'published',
    displayOrder: 0,
    authorName: 'Ban Giám Hiệu',
    createdAt: '2026-08-10T08:00:00Z',
    updatedAt: '2026-08-20T10:30:00Z',
    publishedAt: '2026-08-20T10:30:00Z',
    attachments: [
      {
        id: 'att-01',
        name: 'So_Do_Luong_Giao_Thong_Cong_Truong.pdf',
        url: '#',
        size: '1.8 MB',
        mimeType: 'application/pdf',
      },
    ],
  },
  {
    id: 'art-02',
    schoolCode: 'demo',
    title: 'Thủ tục ủy quyền người thân đón trẻ và cấp thẻ đón bổ sung',
    content: `
      <p>Nhằm đảm bảo an toàn tuyệt đối cho học sinh, Nhà trường chỉ bàn giao học sinh cho người có Thẻ Đón Học Sinh hoặc người được đăng ký chính thức trên hồ sơ điện tử.</p>
      <h3>Trường hợp ủy quyền đột xuất:</h3>
      <p>Nếu phụ huynh bận việc đột xuất và nhờ người khác đón con, phụ huynh phải gửi thông báo qua chức năng <em>"Đón hộ"</em> trong ứng dụng hoặc liên hệ trực tiếp với Giáo viên chủ nhiệm qua số điện thoại hotline trước 16h00.</p>
    `,
    categoryId: 'cat-01-01',
    status: 'published',
    displayOrder: 1,
    authorName: 'Văn Phòng Nhà Trường',
    createdAt: '2026-08-11T09:00:00Z',
    updatedAt: '2026-08-21T11:00:00Z',
    publishedAt: '2026-08-21T11:00:00Z',
  },
  {
    id: 'art-03',
    schoolCode: 'demo',
    title: 'Quy trình xử lý trường hợp đón muộn sau 17h30',
    content: `
      <p>Bản dự thảo quy trình trông giữ trẻ ngoài giờ: Phụ huynh đón con sau 17h30 sẽ áp dụng phí ngoài giờ theo quy chế dịch vụ bán trú bổ sung là 50.000 VNĐ / 30 phút nhằm hỗ trợ giáo viên trực nhật.</p>
    `,
    categoryId: 'cat-01-01',
    status: 'draft',
    displayOrder: 2,
    authorName: 'Phòng Quản Trị Đời Sống',
    createdAt: '2026-08-25T14:00:00Z',
    updatedAt: '2026-08-25T14:00:00Z',
  },

  // Articles in cat-01-02 (Đồng phục & Dụng cụ)
  {
    id: 'art-04',
    schoolCode: 'demo',
    title: 'Hướng dẫn đăng ký và đổi kích cỡ đồng phục năm học mới',
    content: `
      <p>Học sinh mặc đồng phục chính khóa vào các ngày Thứ Hai, Thứ Tư, Thứ Sáu. Thứ Ba và Thứ Năm mặc trang phục thể thao. Phụ huynh có nhu cầu mua bổ sung hoặc đổi size đồng phục vui lòng liên hệ phòng Hành chính trước ngày 15 hàng tháng.</p>
    `,
    categoryId: 'cat-01-02',
    status: 'published',
    displayOrder: 0,
    authorName: 'Phòng Hành Chính',
    createdAt: '2026-08-12T08:00:00Z',
    updatedAt: '2026-08-22T09:00:00Z',
    publishedAt: '2026-08-22T09:00:00Z',
    attachments: [
      {
        id: 'att-02',
        name: 'Bang_Size_Dong_Phuc_Hoc_Sinh_2026.pdf',
        url: '#',
        size: '850 KB',
        mimeType: 'application/pdf',
      },
    ],
  },
  {
    id: 'art-05',
    schoolCode: 'demo',
    title: 'Danh mục đồ dùng cá nhân và thiết bị học tập được phép mang vào trường',
    content: `
      <p>Học sinh không được phép mang điện thoại thông minh, máy chơi game và các vật dụng sắc nhọn, nguy hiểm vào khuôn viên trường học. Trường hợp cần mang điện thoại để liên lạc đưa đón, học sinh phải gửi tại hòm thư của Giáo viên chủ nhiệm đầu giờ và nhận lại lúc tan học.</p>
    `,
    categoryId: 'cat-01-02',
    status: 'published',
    displayOrder: 1,
    authorName: 'Đội Thi Đua Nề Nếp',
    createdAt: '2026-08-13T09:00:00Z',
    updatedAt: '2026-08-23T10:00:00Z',
    publishedAt: '2026-08-23T10:00:00Z',
  },

  // Direct article under root cat-01
  {
    id: 'art-06',
    schoolCode: 'demo',
    title: 'Nội quy văn hóa ứng xử và giao tiếp trong khuôn viên nhà trường',
    content: `
      <p>Nhà trường khuyến khích môi trường giáo dục tôn trọng, văn minh và thân thiện. Quý Phụ huynh khi vào khuôn viên trường vui lòng xuất trình giấy tờ tùy thân tại bốt bảo vệ, tuân thủ hướng dẫn đỗ xe và không hút thuốc lá trong trường.</p>
    `,
    categoryId: 'cat-01',
    status: 'published',
    displayOrder: 2,
    authorName: 'Ban Giám Hiệu',
    createdAt: '2026-08-14T10:00:00Z',
    updatedAt: '2026-08-24T11:00:00Z',
    publishedAt: '2026-08-24T11:00:00Z',
  },

  // Articles in cat-02-01 (Khám sức khỏe & BHYT)
  {
    id: 'art-07',
    schoolCode: 'demo',
    title: 'Kế hoạch kiểm tra sức khỏe tổng quát và nha học đường học kỳ 1',
    content: `
      <p>Phòng Y tế phối hợp với Trung tâm Y tế Quận tổ chức khám sức khỏe toàn diện cho học sinh bao gồm: thị lực, răng hàm mặt, tai mũi họng, tim phổi và chỉ số phát triển chiều cao - cân nặng.</p>
    `,
    categoryId: 'cat-02-01',
    status: 'published',
    displayOrder: 0,
    authorName: 'Phòng Y Tế Học Đường',
    createdAt: '2026-08-15T08:00:00Z',
    updatedAt: '2026-08-25T09:00:00Z',
    publishedAt: '2026-08-25T09:00:00Z',
  },
  {
    id: 'art-08',
    schoolCode: 'demo',
    title: 'Thủ tục kê khai thông tin BHYT và đổi nơi đăng ký khám chữa bệnh',
    content: `
      <p>Bản thảo hướng dẫn phụ huynh cập nhật mã số định danh VNeID của học sinh phục vụ tích hợp thẻ BHYT điện tử theo quy định của Bảo hiểm Xã hội Việt Nam.</p>
    `,
    categoryId: 'cat-02-01',
    status: 'draft',
    displayOrder: 1,
    authorName: 'Phòng Y Tế Học Đường',
    createdAt: '2026-08-26T14:00:00Z',
    updatedAt: '2026-08-26T14:00:00Z',
  },

  // Articles in cat-02-02 (Gửi thuốc & Y tế)
  {
    id: 'art-09',
    schoolCode: 'demo',
    title: 'Quy trình phụ huynh gửi thuốc uống trong ngày cho học sinh',
    content: `
      <p>Phụ huynh có con đang điều trị bệnh cần uống thuốc trong giờ học phải đăng ký qua mẫu đơn gửi thuốc điện tử trên ứng dụng hoặc bàn giao trực tiếp tại Phòng Y tế Tầng 1. Thuốc phải còn nguyên bao bì nhãn mác và có đơn chỉ định của bác sĩ chuyên khoa.</p>
    `,
    categoryId: 'cat-02-02',
    status: 'published',
    displayOrder: 0,
    authorName: 'Phòng Y Tế Học Đường',
    createdAt: '2026-08-16T08:00:00Z',
    updatedAt: '2026-08-27T10:00:00Z',
    publishedAt: '2026-08-27T10:00:00Z',
    attachments: [
      {
        id: 'att-03',
        name: 'Phieu_Uy_Quyen_Gui_Thuoc_Y_Te.docx',
        url: '#',
        size: '120 KB',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    ],
  },

  // Articles in cat-03-01 (Cơ chế hoàn phí)
  {
    id: 'art-10',
    schoolCode: 'demo',
    title: 'Chính sách hoàn tiền tiền ăn và dịch vụ đưa đón khi học sinh nghỉ học',
    content: `
      <h3>1. Điều kiện được tính hoàn tiền:</h3>
      <p>Học sinh có đơn xin nghỉ học hợp lệ gửi trước <strong>08h00</strong> sáng của ngày nghỉ qua ứng dụng (Nghỉ có phép). Các trường hợp nghỉ không phép hoặc báo muộn sau 08h00 sẽ không được hoàn tiền ăn ngày hôm đó do bếp đã chuẩn bị suất ăn.</p>
      <h3>2. Mức hoàn trả:</h3>
      <ul>
        <li><strong>Tiền ăn bán trú:</strong> Hoàn trả 100% định mức bữa ăn/ngày nghỉ có phép (theo hóa đơn tháng kế tiếp).</li>
        <li><strong>Phí xe buýt đưa đón:</strong> Chỉ áp dụng hoàn tiền nếu học sinh nghỉ liên tục từ 10 ngày làm việc trở lên có xác nhận y tế.</li>
      </ul>
    `,
    categoryId: 'cat-03-01',
    status: 'published',
    displayOrder: 0,
    authorName: 'Phòng Tài Chính Kế Toán',
    createdAt: '2026-08-17T08:00:00Z',
    updatedAt: '2026-08-28T09:00:00Z',
    publishedAt: '2026-08-28T09:00:00Z',
  },
  {
    id: 'art-11',
    schoolCode: 'demo',
    title: 'Thời gian đối soát và hoàn tiền học phí cuối học kỳ',
    content: `
      <p>Bản thảo quy trình đối soát học phí thừa thiếu vào ngày 25 của tháng kết thúc học kỳ. Tiền thừa sẽ được tự động cấn trừ vào đợt thu học phí tiếp theo hoặc hoàn trả vào tài khoản ngân hàng của phụ huynh trong vòng 07 ngày làm việc.</p>
    `,
    categoryId: 'cat-03-01',
    status: 'draft',
    displayOrder: 1,
    authorName: 'Phòng Tài Chính Kế Toán',
    createdAt: '2026-08-28T11:00:00Z',
    updatedAt: '2026-08-28T11:00:00Z',
  },

  // Articles in cat-03-02 (Học bổng & Miễn giảm)
  {
    id: 'art-12',
    schoolCode: 'demo',
    title: 'Tiêu chuẩn xét duyệt học bổng tài năng và miễn giảm học phí năm học 2026-2027',
    content: `
      <p>Nhà trường cấp học bổng trị giá từ 20% đến 100% học phí toàn năm dành cho các học sinh đạt giải trong các kỳ thi Học sinh giỏi cấp Tỉnh/Thành phố hoặc Quốc gia, cùng chính sách giảm 10% học phí cho anh chị em ruột học cùng trường.</p>
    `,
    categoryId: 'cat-03-02',
    status: 'published',
    displayOrder: 0,
    authorName: 'Hội Đồng Quản Trị',
    createdAt: '2026-08-18T08:00:00Z',
    updatedAt: '2026-08-29T10:00:00Z',
    publishedAt: '2026-08-29T10:00:00Z',
  },
];
