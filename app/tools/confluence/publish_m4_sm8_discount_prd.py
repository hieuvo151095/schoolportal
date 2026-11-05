# -*- coding: utf-8 -*-
"""
Publish Module M4 - SM8 - Miễn giảm PRD on Confluence
Space: EDUS
Parent: M4 - Tài chính (ID: 107850392)
Title: M4 - SM8 - Miễn giảm
Author: hieu.vo1@finviet.com.vn
Date: 2026-11-03
"""

import os
import sys
import json

sys.path.insert(0, os.path.dirname(__file__))

from confluence_client import ConfluenceClient
from prd_template import render_prd_storage_format

BASE_URL = 'https://kb.finviet.com.vn'
TOKEN = os.environ.get("CONFLUENCE_TOKEN", "")
SPACE = 'EDUS'
PARENT_ID = 107850392  # M4 - Tài chính
PAGE_TITLE = 'M4 - SM8 - Miễn giảm'

SCREENSHOTS = [
    {
        "source": "scratch/m4_sm8_discount_list.png",
        "target": "m4_sm8_discount_list.png",
        "title": "Bảng quản lý chính sách miễn giảm học phí & 4 thẻ chỉ số KPI"
    },
    {
        "source": "scratch/m4_sm8_student_discount.png",
        "target": "m4_sm8_student_discount.png",
        "title": "Khối chính sách miễn giảm và biểu phí trong Hồ sơ học sinh"
    },
    {
        "source": "scratch/verify_discount.png",
        "target": "m4_sm8_verify_discount.png",
        "title": "Giao diện vận hành phân hệ Miễn giảm trên School Operating Portal"
    }
]

m4_sm8_prd_data = {
    "code": "M4/SM8",
    "name": "M4 - SM8 - Miễn giảm",
    "priority": "MUST HAVE",
    "status": "APPROVED FOR BUILD",
    "owner": "hieu.vo1@finviet.com.vn",
    "reviewer": "hieu.vo1@finviet.com.vn",
    "created_date": "2026-11-03",
    "parent_module": "M4 - Tài chính",
    "parent_category": "8. Portal QLTH > M4 - Tài chính > M4 - SM8 - Miễn giảm",
    "history": [
        {
            "version": "1.0",
            "section": "Khởi tạo đặc tả tính năng",
            "content": "Khởi tạo đặc tả phân hệ Miễn giảm (Tuition Exemption & Fee Discount Policy Management) theo chuẩn ECO FINVIET Design System v1.1.0.",
            "date": "2026-09-22",
            "author": "hieu.vo1@finviet.com.vn"
        },
        {
            "version": "1.1",
            "section": "Cập nhật Kiến trúc Nghiệp vụ & Động cơ Tính toán",
            "content": "Bổ sung ADR-012, Resolution K016 (Đơn chính sách trên mỗi khoản phí & Phạm vi ưu tiên), Resolution K017 (Vòng đời hiệu lực niên khóa/tháng), Resolution K018 (Phép giao toán học khoản phí khi chọn nhiều lớp/học sinh), và cơ chế tự động loại trừ khỏi chính sách lớp khi gán chính sách cá nhân.",
            "date": "2026-10-29",
            "author": "hieu.vo1@finviet.com.vn"
        },
        {
            "version": "1.2",
            "section": "Tích hợp Hồ sơ học sinh & Đồng bộ Hóa đơn tự động",
            "content": "Hoàn thiện liên thông 2 chiều giữa phân hệ Miễn giảm với Hồ sơ học sinh (Tab Hồ sơ học sinh & Tab Học phí), tích hợp xuất báo cáo Excel UTF-8 BOM và hoàn thiện bộ tiêu chí nghiệm thu Given-When-Then.",
            "date": "2026-11-03",
            "author": "hieu.vo1@finviet.com.vn"
        }
    ],

    # 1. Thông tin tổng quan
    "overview": {
        "context": (
            "Phân hệ <strong>Quản lý Chính Sách Miễn Giảm Học Phí &amp; Khoản Thu (Tuition Exemption &amp; Fee Discount Policy Management)</strong> "
            "thuộc nhóm <strong>M4: Tài chính</strong> (truy cập tại đường dẫn <code>/[schoolCode]/school/discount</code>) là phân hệ cốt lõi "
            "quản trị các chính sách ưu đãi tài chính, học bổng khuyến học và miễn giảm theo quy định an sinh giáo dục của Nhà nước (Nghị định 81/2021/NĐ-CP).<br /><br />"
            "Trong mô hình vận hành trường học hiện đại, việc quản lý miễn giảm học phí thường gặp phải các thách thức lớn:<br />"
            "1. <strong>Đa dạng chính sách:</strong> Áp dụng theo tỷ lệ phần trăm (10% - 100%) hoặc số tiền cố định (VND) cho từng loại khoản phí khác nhau (Học phí, Tiền ăn, Ngoại khóa, Học liệu...).<br />"
            "2. <strong>Phức tạp về phạm vi:</strong> Có chính sách áp dụng cho toàn thể một hoặc nhiều lớp học (ví dụ: ưu đãi 20% cho khối lớp mới thành lập), có chính sách đặc thù theo từng học sinh cụ thể (con em giáo viên, học bổng tài năng, hộ nghèo).<br />"
            "3. <strong>Nguy cơ trùng lặp / Xung đột chính sách:</strong> Khi một học sinh vừa thuộc lớp được giảm học phí, vừa được cấp học bổng cá nhân, hệ thống cần cơ chế phân giải xung đột thông minh (Resolution K016) bảo vệ quyền lợi tối đa cho học sinh mà không tính trừ trùng lặp.<br />"
            "4. <strong>Tự động hóa khấu trừ:</strong> Đồng bộ tức thời vào công thức sinh hóa đơn học phí định kỳ (<code>M4/SM1</code>), hiển thị minh bạch trong Hồ sơ học sinh và báo cáo tài chính."
        ),
        "goals_list": [
            "Cung cấp giao diện quản lý trực quan chuẩn Design System ECO FINVIET với 4 thẻ chỉ số KPI tổng quan (Tổng chính sách, Đang áp dụng, Lớp thụ hưởng, Học sinh chỉ định).",
            "Hỗ trợ thiết lập linh hoạt mức miễn giảm theo 2 hình thức: Phần trăm (%) từ 1% đến 100% hoặc Số tiền cố định (đ/tháng, đ/năm, đ/lần) với cơ chế chặn âm đảm bảo số tiền khấu trừ không vượt quá nguyên giá khoản phí.",
            "Cho phép áp dụng chính sách theo 2 cấp độ phạm vi (Scope): Theo Lớp học (Class-level) hoặc Theo từng Học sinh cụ thể (Student-level) thông qua các cửa sổ chọn đối tượng chuyên dụng.",
            "Tự động tính toán ma trận giao thoa khoản phí (Fee Item Mathematical Intersection - Resolution K018): Khi chọn nhiều lớp/học sinh, chỉ các khoản phí đồng thời tồn tại ở tất cả đối tượng mới được phép liên kết.",
            "Tự động phát hiện và giải quyết xung đột chính sách (Resolution K016): Tự động ưu tiên chính sách mang lại mức giảm cao nhất cho học sinh, đồng thời hỗ trợ cơ chế loại trừ tự động (Auto-exclusion) khi phụ huynh/kế toán xác nhận thay thế.",
            "Quản lý thời hạn hiệu lực linh hoạt theo Năm học hoặc Khoảng tháng chỉ định, tự động chuyển trạng thái hết hạn theo thời gian thực (Resolution K017).",
            "Tích hợp xuất dữ liệu bảng kê chính sách ra tệp Excel/CSV mã hóa UTF-8 BOM chuẩn phục vụ công tác thanh tra, quyết toán học đường."
        ],
        "target_users": [
            {
                "group": "Kế toán trường học (School Accountant)",
                "role": "Thiết lập & Điều hành chính sách miễn giảm",
                "actions": "Tạo mới, chỉnh sửa, tạm dừng hoặc xóa chính sách miễn giảm; kiểm tra đối tượng thụ hưởng; đối soát số tiền giảm trừ trên hóa đơn học sinh; xuất báo cáo Excel."
            },
            {
                "group": "Ban Giám Hiệu (School Board / Admins)",
                "role": "Phê duyệt & Giám sát ngân sách học bổng",
                "actions": "Xem tổng quan KPI chính sách miễn giảm toàn trường; rà soát các trường hợp học bổng đặc biệt và tỷ lệ ngân sách an sinh giáo dục được phân bổ."
            },
            {
                "group": "Giáo viên chủ nhiệm (Homeroom Teachers)",
                "role": "Tiếp nhận hồ sơ & Tra cứu thông tin",
                "actions": "Xem thông tin chính sách miễn giảm được áp dụng cho từng học sinh trong lớp phụ trách ngay trên màn hình Chi tiết học sinh."
            },
            {
                "group": "Phụ huynh học sinh (Parents)",
                "role": "Người thụ hưởng & Đối soát hóa đơn",
                "actions": "Theo dõi các khoản tiền được miễn giảm minh bạch trên từng dòng hóa đơn học phí định kỳ gửi qua ứng dụng di động Edui App."
            }
        ],
        "glossary": [
            {"term": "Chính sách miễn giảm (Discount Policy)", "definition": "Quy định giảm trừ tài chính áp dụng cho một khoản phí cụ thể theo tỷ lệ % hoặc số tiền cố định trong một khoảng thời gian xác định."},
            {"term": "Phạm vi áp dụng (Discount Scope)", "definition": "Cấp độ đối tượng thụ hưởng, gồm: Cấp lớp học (Class-level - áp dụng cho toàn bộ học sinh trong lớp) hoặc Cấp học sinh (Student-level - chỉ định từng cá nhân cụ thể)."},
            {"term": "Khoản phí áp dụng (Fee Item)", "definition": "Khoản mục thu trong danh mục biểu phí của nhà trường (ví dụ: Học phí chính khóa, Tiền ăn, Ngoại khóa) được liên kết với chính sách miễn giảm."},
            {"term": "Giao thoa khoản phí (Fee Intersection)", "definition": "Tập hợp các khoản phí cùng xuất hiện trong biểu phí của tất cả các lớp hoặc học sinh được chọn vào chính sách (Resolution K018)."},
            {"term": "Xung đột chính sách (Discount Conflict)", "definition": "Tình huống một học sinh cùng lúc thuộc đối tượng của 2 chính sách miễn giảm trở lên trên cùng một khoản phí (Resolution K016)."},
            {"term": "Loại trừ khỏi chính sách lớp (Excluded Student)", "definition": "Cơ chế đánh dấu học sinh không nhận ưu đãi từ chính sách của lớp do đã được áp dụng chính sách cá nhân thay thế."},
            {"term": "Chặn âm (Non-negative Clamping)", "definition": "Thuật toán đảm bảo số tiền khấu trừ tối đa chỉ bằng nguyên giá của khoản phí, không làm cho thành tiền của khoản thu bị âm."},
            {"term": "UTF-8 BOM CSV", "definition": "Định dạng tệp dữ liệu bảng tính chứa Byte Order Mark giúp Microsoft Excel hiển thị tiếng Việt có dấu hoàn hảo không bị lỗi font."}
        ]
    },

    # 2. Tổng quan nghiệp vụ & Kiến trúc dữ liệu
    "business": {
        "flow_desc": "Mô hình hóa toàn diện quy trình thiết lập chính sách miễn giảm, tính toán giao thoa khoản phí, phân giải xung đột quyền lợi và tự động khấu trừ vào hóa đơn học phí định kỳ.",
        "flow_steps": [
            {"actor": "Kế toán", "action": "Truy cập Tài chính > Miễn giảm", "desc": "Gửi GET /api/1.0/discount-policies. Hệ thống nạp danh sách chính sách và tính toán 4 thẻ KPI tổng quan."},
            {"actor": "Kế toán", "action": "Bấm 'Thêm chính sách miễn giảm'", "desc": "Mở Modal tạo chính sách CreateDiscountPolicyModal với các giá trị mặc định chuẩn."},
            {"actor": "Kế toán", "action": "Chọn phạm vi (Lớp / Học sinh) & Đối tượng", "desc": "Chọn qua ClassPickerModal hoặc StudentPickerModal. Hệ thống tính toán tập giao các khoản phí áp dụng (Resolution K018)."},
            {"actor": "Kế toán", "action": "Thiết lập mức giảm, thời hạn & lý do", "desc": "Chọn loại giảm (% hoặc tiền), nhập giá trị, chọn Năm học hoặc Khoảng tháng, chọn/nhập lý do miễn giảm."},
            {"actor": "Hệ thống UI", "action": "Kiểm tra xung đột chính sách tự động", "desc": "Gọi findStudentDiscountConflicts(). Nếu có học sinh đã hưởng chính sách khác trên khoản phí này, hiển thị banner cảnh báo và nút xác nhận thay thế."},
            {"actor": "Kế toán", "action": "Xác nhận & Lưu chính sách", "desc": "Gửi POST /api/1.0/discount-policies. Hệ thống lưu chính sách, cập nhật danh sách excludedStudentIds cho chính sách cũ nếu có thay thế."},
            {"actor": "Động cơ Học phí", "action": "Khấu trừ tự động vào Hóa đơn (M4/SM1)", "desc": "Khi sinh hóa đơn định kỳ, gọi resolveStudentDiscounts() để tự động trừ tiền minh bạch trên từng dòng khoản thu."}
        ],
        "steps_narrative": [
            "Bước 1: Kế toán điều hướng vào menu Tài chính > Miễn giảm (<code>/[schoolCode]/school/discount</code>). Giao diện hiển thị 4 StatCard thống kê (Tổng chính sách, Đang áp dụng, Lớp thụ hưởng, Học sinh chỉ định), thanh công cụ lọc và bảng dữ liệu chính sách.",
            "Bước 2: Kế toán bấm nút '+ Thêm chính sách miễn giảm'. Cửa sổ tạo chính sách hiện ra.",
            "Bước 3: Chọn Phạm vi áp dụng: 'Theo lớp học' (mở cây danh sách lớp theo khối) hoặc 'Theo học sinh' (mở bộ lọc học sinh kèm mã HS và lớp).",
            "Bước 4: Hệ thống tự động tính toán tập giao các khoản phí (getApplicableFeeItemsForTargets). Dropdown 'Khoản phí áp dụng' chỉ hiển thị các khoản phí mà toàn bộ đối tượng đã chọn đều có trong biểu phí.",
            "Bước 5: Kế toán cấu hình Loại miễn giảm: Giảm theo % (nhập từ 1 đến 100) hoặc Giảm theo số tiền cố định (nhập số tiền VND).",
            "Bước 6: Chọn Thời hạn áp dụng: 'Theo năm học' (áp dụng toàn bộ các kỳ thu trong năm học) hoặc 'Theo khoảng tháng' (chọn từ tháng YYYY-MM đến tháng YYYY-MM).",
            "Bước 7: Kế toán chọn hoặc nhập Lý do miễn giảm (e.g. Con thương binh liệt sĩ, Hộ nghèo, Anh em ruột, Học bổng tuyển sinh).",
            "Bước 8: Nếu phát hiện học sinh đã có chính sách khác trên khoản phí này, hệ thống hiển thị khối cảnh báo so sánh (Chính sách hiện tại vs Chính sách mới). Kế toán tích chọn 'Tôi xác nhận thay thế chính sách cũ' để kích hoạt cơ chế loại trừ tự động (Resolution K016).",
            "Bước 9: Bấm 'Lưu chính sách'. Dữ liệu được ghi nhận vào hệ thống và phát thông báo thành công.",
            "Bước 10: Khi Kế toán tạo đợt thu học phí định kỳ tại phân hệ Học phí (M4/SM1), động cơ resolveStudentDiscounts() tự động tính số tiền giảm, hiển thị dòng chiết khấu trên hóa đơn và trừ vào tổng tiền phải nộp của phụ huynh."
        ],
        "rules": [
            {
                "id": "BR-DISC-01",
                "title": "Giới hạn biên mức giảm & Chặn số dư âm (Non-negative Clamping)",
                "desc": "Mức giảm phần trăm (<code>percent</code>) bắt buộc nằm trong khoảng từ <strong>1% đến 100%</strong>. Mức giảm số tiền cố định (<code>fixed_amount</code>) phải là số nguyên dương. Trong mọi trường hợp tính toán khấu trừ, số tiền giảm tối đa <strong>không được vượt quá nguyên giá của khoản phí</strong> (<code>deduction = Math.min(deduction, feeItemGross)</code>), tuyệt đối không để xảy ra số tiền âm trên dòng hóa đơn."
            },
            {
                "id": "BR-DISC-02",
                "title": "Ma trận giao thoa khoản phí áp dụng (Resolution K018)",
                "desc": "Khi chính sách chọn nhiều lớp học hoặc nhiều học sinh, danh mục khoản phí trong dropdown bắt buộc phải là <strong>phép giao (Intersection)</strong> của các khoản phí có hiệu lực trên toàn bộ các đối tượng đó. Nếu lớp A có khoản phí X nhưng lớp B không có, khoản phí X sẽ bị ẩn khỏi dropdown để ngăn chặn việc áp dụng chính sách vào đối tượng không có khoản thu tương ứng."
            },
            {
                "id": "BR-DISC-03",
                "title": "Nguyên tắc Đơn chính sách trên mỗi khoản phí (Single Policy Rule - Resolution K016)",
                "desc": "Một học sinh chỉ được hưởng <strong>tối đa 1 chính sách miễn giảm trên cùng một khoản phí</strong> trong một kỳ thu nhất định. Hệ thống hoàn toàn cho phép một học sinh được hưởng nhiều chính sách trên các khoản phí độc lập khác nhau (ví dụ: vừa giảm 50% Học phí, vừa giảm 100% Tiền ăn bán trú)."
            },
            {
                "id": "BR-DISC-04",
                "title": "Cơ chế ưu tiên mức giảm cao nhất (Highest Benefit Priority)",
                "desc": "Khi xảy ra trường hợp học sinh vừa thuộc diện chính sách chung của lớp (Chính sách X), vừa được gán chính sách cá nhân (Chính sách Y): Hệ thống tự động tính toán quy đổi ra số tiền thực tế và <strong>ưu tiên áp dụng chính sách mang lại số tiền giảm cao hơn</strong> để bảo vệ tối đa quyền lợi cho người học. Nếu hai chính sách có giá trị giảm bằng nhau, hệ thống ưu tiên áp dụng chính sách cá nhân của học sinh."
            },
            {
                "id": "BR-DISC-05",
                "title": "Cảnh báo xung đột & Loại trừ tự động (Conflict Detection & Auto-Exclusion)",
                "desc": "Khi Kế toán tạo chính sách cá nhân cho học sinh đang hưởng chính sách lớp, màn hình lập tức hiển thị bảng đối chiếu mức giảm cũ và mới. Khi Kế toán xác nhận thay thế, mã học sinh đó tự động được bổ sung vào mảng <code>excludedStudentIds</code> của chính sách lớp cũ. Khi sinh hóa đơn, học sinh này chỉ nhận chính sách cá nhân mới mà không bị cộng dồn ưu đãi của lớp."
            },
            {
                "id": "BR-DISC-06",
                "title": "Quản lý vòng đời & Trạng thái hiệu lực (Resolution K017)",
                "desc": "Chính sách miễn giảm có 3 trạng thái rõ ràng: <code>active</code> (Đang hoạt động - được tính vào hóa đơn), <code>paused</code> (Ngừng áp dụng - tạm dừng tính khấu trừ do Kế toán chủ động đổi trạng thái), và <code>expired</code> (Hết hạn - hệ thống tự động đánh dấu khi ngày hiện tại vượt quá tháng kết thúc <code>toMonth</code>). Kế toán có thể chuyển đổi giữa <code>active</code> và <code>paused</code> chỉ bằng 1 thao tác click tại menu thao tác."
            },
            {
                "id": "BR-DISC-07",
                "title": "Khấu trừ tự động vào đợt thu học phí (Invoice Integration)",
                "desc": "Tại phân hệ Học phí (M4/SM1), khi Kế toán bấm 'Tạo đợt thu' hoặc xem chi tiết học phí của học sinh, hệ thống tự động kiểm tra các chính sách đang hoạt động hợp lệ với tháng thu đó, sinh các dòng chiết khấu (<code>InvoiceDiscountLine</code>) với đầy đủ thông tin: Mã chính sách, Tên chính sách, Mức giảm, và Số tiền giảm thực tế."
            },
            {
                "id": "BR-DISC-08",
                "title": "Đồng bộ hiển thị 2 chiều với Hồ sơ học sinh (Student Detail Integration)",
                "desc": "Tại màn hình Chi tiết học sinh (<code>/[schoolCode]/school/kid/detail/[id]</code>), tab 'Hồ sơ học sinh' và tab 'Học phí' tự động hiển thị bảng 'Chương trình miễn giảm' đang áp dụng cho học sinh đó kèm nút chỉnh sửa nhanh, liên kết trực tiếp với dữ liệu tài chính toàn trường."
            },
            {
                "id": "BR-DISC-09",
                "title": "Xuất tệp báo cáo Excel chuẩn UTF-8 BOM",
                "desc": "Nút 'Xuất Excel' trên thanh công cụ cho phép tải về toàn bộ danh sách chính sách miễn giảm theo bộ lọc hiện tại dưới dạng tệp CSV có gắn Byte Order Mark (BOM: <code>\\uFEFF</code>), đảm bảo tương thích 100% với Microsoft Excel tiếng Việt trên cả Windows và macOS."
            }
        ],
        "data_entities": [
            {"field": "id", "type": "String (UUID/PK)", "required": True, "desc": "Mã định danh duy nhất của chính sách miễn giảm trong hệ thống"},
            {"field": "schoolCode", "type": "String", "required": True, "desc": "Mã trường học quản lý (Tenant code cách ly dữ liệu)"},
            {"field": "code", "type": "String (Unique)", "required": True, "desc": "Mã nghiệp vụ chính sách theo định dạng chuẩn (e.g. MG-2026-001)"},
            {"field": "name", "type": "String", "required": True, "desc": "Tên gọi chính sách (e.g. Học bổng tài năng, Ưu đãi con em thương binh)"},
            {"field": "discountType", "type": "Enum ('percent' | 'fixed_amount')", "required": True, "desc": "Phương thức tính: Giảm theo tỷ lệ phần trăm hoặc Giảm theo số tiền cố định"},
            {"field": "discountValue", "type": "Number", "required": True, "desc": "Giá trị giảm (từ 1 đến 100 nếu là percent, hoặc số tiền VND nếu là fixed_amount)"},
            {"field": "feeItemId", "type": "String (FK)", "required": True, "desc": "Khoản phí áp dụng (liên kết với danh mục khoản phí master schoolFeeSlice)"},
            {"field": "feeItemName", "type": "String", "required": True, "desc": "Tên khoản phí áp dụng hiển thị trên hóa đơn"},
            {"field": "scopeType", "type": "Enum ('class' | 'student')", "required": True, "desc": "Phạm vi áp dụng: Theo lớp học hoặc Theo từng học sinh cụ thể"},
            {"field": "validityType", "type": "Enum ('academic_year' | 'month_range')", "required": True, "desc": "Loại thời hạn hiệu lực: Cả năm học hoặc Theo khoảng tháng"},
            {"field": "academicYearId", "type": "String", "required": False, "desc": "Mã năm học áp dụng nếu validityType là academic_year (e.g. ay-2026-2027)"},
            {"field": "fromMonth", "type": "String (YYYY-MM)", "required": False, "desc": "Tháng bắt đầu có hiệu lực nếu validityType là month_range"},
            {"field": "toMonth", "type": "String (YYYY-MM)", "required": False, "desc": "Tháng kết thúc hiệu lực nếu validityType là month_range"},
            {"field": "reason", "type": "String", "required": True, "desc": "Căn cứ / Lý do miễn giảm theo quyết định của nhà trường"},
            {"field": "status", "type": "Enum ('active' | 'paused' | 'expired')", "required": True, "desc": "Trạng thái hiệu lực: Đang hoạt động, Ngừng áp dụng hoặc Đã hết hạn"},
            {"field": "targets", "type": "Array<DiscountTarget>", "required": True, "desc": "Danh sách các đối tượng thụ hưởng (targetType, targetId, targetName, targetClass)"},
            {"field": "excludedStudentIds", "type": "Array<String>", "required": False, "desc": "Danh sách mã học sinh bị loại trừ khỏi chính sách lớp do có chính sách cá nhân thay thế"},
            {"field": "createdAt", "type": "DateTime", "required": True, "desc": "Thời điểm khởi tạo chính sách"},
            {"field": "updatedAt", "type": "DateTime", "required": True, "desc": "Thời điểm cập nhật chính sách gần nhất"}
        ]
    },

    # 3. Đặc tả tính năng & Use Cases chi tiết
    "features": {
        "breakdown": [
            {
                "epic": "E-004-FINANCE",
                "feature": "Quản trị Danh sách Chính sách Miễn giảm",
                "platform": "Web Portal",
                "priority": "MUST HAVE",
                "story": "Kế toán tra cứu, lọc và xem tổng quan các chính sách miễn giảm toàn trường",
                "jira": "EDUS-FIN-0801"
            },
            {
                "epic": "E-004-FINANCE",
                "feature": "Thiết lập Chính sách & Phép giao Khoản phí",
                "platform": "Web Portal",
                "priority": "MUST HAVE",
                "story": "Kế toán tạo chính sách mới theo Lớp hoặc Học sinh với danh mục phí giao thoa",
                "jira": "EDUS-FIN-0802"
            },
            {
                "epic": "E-004-FINANCE",
                "feature": "Phát hiện Xung đột & Thay thế Tự động",
                "platform": "Web Portal",
                "priority": "MUST HAVE",
                "story": "Hệ thống tự động so sánh mức giảm và loại trừ học sinh khỏi chính sách lớp khi có chỉ định cá nhân",
                "jira": "EDUS-FIN-0803"
            },
            {
                "epic": "E-004-FINANCE",
                "feature": "Xem Danh sách Thụ hưởng & Xuất Excel",
                "platform": "Web Portal",
                "priority": "MUST HAVE",
                "story": "Kế toán kiểm tra chi tiết danh sách học sinh thụ hưởng và xuất báo cáo bảng kê UTF-8",
                "jira": "EDUS-FIN-0804"
            },
            {
                "epic": "E-004-FINANCE",
                "feature": "Tự động Khấu trừ vào Hóa đơn & Hồ sơ",
                "platform": "Web Portal",
                "priority": "MUST HAVE",
                "story": "Hệ thống tự động trừ tiền chiết khấu khi sinh hóa đơn học sinh và đồng bộ vào hồ sơ học sinh",
                "jira": "EDUS-FIN-0805"
            }
        ],
        "use_cases": [
            {
                "id": "UC-DISC-01",
                "name": "Xem danh sách và lọc chính sách miễn giảm",
                "actor": "Kế toán trường học, Ban Giám Hiệu",
                "pre": "Người dùng đã đăng nhập hệ thống với quyền Kế toán hoặc Quản trị viên trường học.",
                "happy_path": [
                    "1. Người dùng bấm chọn 'Tài chính' > 'Miễn giảm' trên thanh menu bên trái.",
                    "2. Hệ thống tải dữ liệu và hiển thị 4 StatCard KPI: Tổng chính sách, Đang áp dụng, Lớp thụ hưởng, Học sinh chỉ định.",
                    "3. Hệ thống hiển thị bảng danh sách các chính sách kèm các cột: Tên chính sách (kèm mã định danh), Khoản phí áp dụng, Mức miễn giảm (badge % hoặc VND), Đối tượng áp dụng (badge số lượng có thể click), Thời hạn, Trạng thái (badge màu) và Cột thao tác.",
                    "4. Người dùng nhập từ khóa tìm kiếm (theo tên chính sách, mã MG, hoặc tên đối tượng) hoặc chọn lọc theo Trạng thái (Tất cả / Đang hoạt động / Ngừng áp dụng / Hết hạn).",
                    "5. Bảng danh sách cập nhật ngay lập tức theo thời gian thực."
                ],
                "exceptions": [
                    "Nếu không có kết quả phù hợp với điều kiện tìm kiếm, hiển thị trạng thái rỗng (Empty State) với thông báo 'Không tìm thấy chính sách miễn giảm nào phù hợp'."
                ],
                "post": "Kế toán nắm bắt đầy đủ thông tin các chính sách miễn giảm đang có hiệu lực tại trường.",
                "rules": "BR-DISC-01, BR-DISC-06"
            },
            {
                "id": "UC-DISC-02",
                "name": "Tạo mới chính sách miễn giảm theo Lớp hoặc Học sinh",
                "actor": "Kế toán trường học",
                "pre": "Đang ở màn hình danh sách chính sách miễn giảm.",
                "happy_path": [
                    "1. Kế toán bấm nút '+ Thêm chính sách miễn giảm' trên tiêu đề trang.",
                    "2. Hệ thống hiển thị Modal CreateDiscountPolicyModal.",
                    "3. Kế toán nhập Tên chính sách (bắt buộc).",
                    "4. Chọn Phạm vi áp dụng: 'Theo lớp học' hoặc 'Theo học sinh'.",
                    "5. Bấm 'Chọn lớp' hoặc 'Chọn học sinh' để mở modal chọn đối tượng tương ứng. Tích chọn các lớp/học sinh mong muốn và bấm 'Xác nhận'.",
                    "6. Hệ thống tự động tính toán tập giao các khoản phí (Resolution K018) và hiển thị danh sách các khoản phí khả dụng trong dropdown.",
                    "7. Chọn Khoản phí áp dụng từ danh mục.",
                    "8. Chọn Loại miễn giảm (% hoặc Số tiền cố định) và nhập giá trị giảm.",
                    "9. Chọn Thời hạn: Theo năm học hoặc Theo khoảng tháng (chọn từ tháng - đến tháng).",
                    "10. Chọn hoặc nhập Lý do miễn giảm.",
                    "11. Nếu không có xung đột, bấm 'Lưu chính sách'. Hệ thống lưu dữ liệu, đóng modal và phát thông báo thành công."
                ],
                "exceptions": [
                    "Nếu Kế toán để trống các trường bắt buộc (Tên, Đối tượng, Khoản phí, Giá trị), hệ thống hiển thị thông báo lỗi đỏ dưới từng trường và chặn lưu.",
                    "Nếu nhập giá trị % ngoài khoảng 1-100%, hệ thống hiển thị lỗi 'Mức giảm phần trăm phải từ 1% đến 100%'.",
                    "Nếu chọn khoảng tháng mà tháng kết thúc nhỏ hơn tháng bắt đầu, hiển thị lỗi 'Tháng kết thúc phải sau hoặc bằng tháng bắt đầu'."
                ],
                "post": "Chính sách mới được thêm vào hệ thống với mã định danh tự sinh dạng MG-YYYY-NNN và sẵn sàng áp dụng vào đợt thu học phí.",
                "rules": "BR-DISC-01, BR-DISC-02, BR-DISC-03, BR-DISC-06"
            },
            {
                "id": "UC-DISC-03",
                "name": "Phát hiện và xử lý xung đột khi gán chính sách cá nhân",
                "actor": "Kế toán trường học",
                "pre": "Kế toán đang tạo chính sách cá nhân cho học sinh mà lớp của học sinh đó đã có chính sách giảm giá trên cùng khoản phí.",
                "happy_path": [
                    "1. Kế toán chọn học sinh A (thuộc lớp 10A1 đang được hưởng chính sách lớp giảm 20% Học phí).",
                    "2. Kế toán chọn khoản phí 'Học phí chính khóa' và nhập mức giảm cá nhân 50%.",
                    "3. Hệ thống phát hiện xung đột và lập tức hiển thị Khối cảnh báo xung đột (Conflict Banner màu vàng/xanh) ngay trên form:",
                    "   - Tên học sinh: Nguyễn Gia Huy (Lớp 10A1).",
                    "   - Chính sách cũ: MG-2026-002 (Giảm 20%).",
                    "   - Chính sách mới đề xuất: 50% (Cao hơn chính sách cũ).",
                    "   - Diễn giải: Mức giảm mới mang lại quyền lợi cao hơn, chính sách lớp cũ sẽ tự động ngừng áp dụng cho học sinh này.",
                    "4. Hệ thống hiển thị checkbox: '[v] Tôi xác nhận thay thế chính sách cũ cho các học sinh này'.",
                    "5. Kế toán tích chọn xác nhận và bấm 'Lưu chính sách'.",
                    "6. Hệ thống lưu chính sách cá nhân mới, đồng thời tự động ghi nhận mã học sinh A vào danh sách excludedStudentIds của chính sách lớp 10A1."
                ],
                "exceptions": [
                    "Nếu chính sách mới có mức giảm THẤP HƠN chính sách cũ của lớp: Hệ thống cảnh báo rõ ràng rằng chính sách mới thấp hơn chính sách hiện tại, và theo quy tắc bảo vệ quyền lợi học sinh, mức giảm cao hơn sẽ được giữ lại khi tính hóa đơn trừ khi có quyết định hủy bỏ chính sách cũ."
                ],
                "post": "Học sinh được hưởng đúng mức giảm 50% cá nhân mà không bị tính trùng lặp thêm 20% của lớp.",
                "rules": "BR-DISC-03, BR-DISC-04, BR-DISC-05"
            },
            {
                "id": "UC-DISC-04",
                "name": "Xem danh sách đối tượng thụ hưởng và Tạm dừng / Kích hoạt lại chính sách",
                "actor": "Kế toán trường học, Ban Giám Hiệu",
                "pre": "Đang ở màn hình danh sách chính sách miễn giảm.",
                "happy_path": [
                    "1. Tại cột 'Đối tượng áp dụng', Kế toán bấm vào nút badge hiển thị số lượng đối tượng (ví dụ: '3 Lớp' hoặc '5 Học sinh').",
                    "2. Modal BeneficiaryModal mở ra, hiển thị danh sách đầy đủ tên các lớp hoặc tên từng học sinh (kèm mã HS, lớp học và avatar). Hỗ trợ ô tìm kiếm nhanh đối tượng.",
                    "3. Kế toán kiểm tra xong và đóng modal.",
                    "4. Tại cột 'Thao tác' (biểu tượng 3 dấu chấm), Kế toán chọn 'Ngừng áp dụng'.",
                    "5. Hệ thống lập tức cập nhật trạng thái chính sách sang paused (badge cam 'Ngừng áp dụng') và phát toast thông báo.",
                    "6. Khi muốn áp dụng lại, Kế toán chọn 'Kích hoạt lại' từ menu 3 chấm, trạng thái chuyển về active (badge xanh lá 'Đang hoạt động')."
                ],
                "exceptions": [
                    "Nếu chính sách đã hết hạn (expired), nút chuyển trạng thái hiển thị thông báo chính sách đã hết thời hạn hiệu lực của niên khóa."
                ],
                "post": "Trạng thái chính sách được cập nhật tức thì vào hệ thống quản lý.",
                "rules": "BR-DISC-06"
            },
            {
                "id": "UC-DISC-05",
                "name": "Xuất báo cáo danh sách chính sách miễn giảm ra Excel",
                "actor": "Kế toán trường học",
                "pre": "Đang ở màn hình danh sách chính sách miễn giảm.",
                "happy_path": [
                    "1. Kế toán tùy chọn lọc theo từ khóa hoặc trạng thái nếu cần.",
                    "2. Bấm nút 'Xuất Excel' trên thanh công cụ DiscountToolbar.",
                    "3. Hệ thống kích hoạt module discountExport.ts, tạo tệp CSV chứa Byte Order Mark (UTF-8 BOM).",
                    "4. Trình duyệt tự động tải xuống tệp danh_sach_chinh_sach_mien_giam.csv.",
                    "5. Kế toán mở tệp trực tiếp trong Microsoft Excel: Toàn bộ tiêu đề cột, tên chính sách, đối tượng và lý do hiển thị tiếng Việt chuẩn xác không bị lỗi font."
                ],
                "exceptions": [
                    "Nếu danh sách đang lọc không có dữ liệu, nút xuất dữ liệu sẽ thông báo 'Không có dữ liệu để xuất'."
                ],
                "post": "Tệp bảng kê sẵn sàng phục vụ báo cáo tài chính nội bộ hoặc thanh tra giáo dục.",
                "rules": "BR-DISC-09"
            }
        ]
    },

    # 4. Bảng đặc tả chi tiết giao diện & Trải nghiệm
    "ui": {
        "entry_point": (
            "Người dùng truy cập phân hệ Miễn giảm thông qua menu điều hướng bên trái: <strong>Tài chính &gt; Miễn giảm</strong> "
            "(đường dẫn canonical: <code>/[schoolCode]/school/discount</code>). Ngoài ra, người dùng có thể truy cập danh sách chính sách "
            "áp dụng cho từng học sinh cụ thể từ mục 'Chương trình miễn giảm' trên màn hình Hồ sơ học sinh (<code>/[schoolCode]/school/kid/detail/[id]</code>)."
        ),
        "screens_table": [
            {
                "screen": "SCR-DISC-01: Danh sách chính sách miễn giảm & KPI tổng quan",
                "image": "m4_sm8_discount_list.png",
                "component": "4 StatCard KPI + Unified Table Card",
                "format": "Data Table + StatCards + Search Toolbar",
                "desc": (
                    "Hiển thị 4 thẻ chỉ số KPI ở đầu trang: Tổng chính sách (tone neutral), Đang áp dụng (tone success), "
                    "Lớp thụ hưởng (tone info), Học sinh chỉ định (tone purple). Bảng chính gồm các cột: Tên chính sách kèm mã MG, "
                    "Khoản phí áp dụng, Mức miễn giảm (% hoặc số tiền VND), Đối tượng áp dụng (badge click mở modal thụ hưởng), "
                    "Thời hạn hiệu lực, Trạng thái (badge có icon) và Cột thao tác menu 3 chấm (Chỉnh sửa, Ngừng áp dụng / Kích hoạt lại, Xóa)."
                ),
                "note": "Tuân thủ Design System v1.1.0, hỗ trợ tìm kiếm không dấu thời gian thực."
            },
            {
                "screen": "SCR-DISC-02: Modal thiết lập chính sách miễn giảm",
                "image": "m4_sm8_verify_discount.png",
                "component": "CreateDiscountPolicyModal",
                "format": "Dialog Modal (Form nhập liệu + Picker Modals)",
                "desc": (
                    "Form gồm: Tên chính sách; Chọn phạm vi (Lớp / Học sinh); Nút mở ClassPickerModal / StudentPickerModal; "
                    "Dropdown Khoản phí áp dụng (tính theo phép giao toán học); Chọn phương thức giảm (% hoặc Cố định); "
                    "Ô nhập giá trị; Chọn thời hạn (Năm học hoặc Khoảng tháng YYYY-MM); Ô nhập lý do kèm 6 gợi ý lý do phổ biến; "
                    "Banner cảnh báo xung đột chính sách tự động và checkbox xác nhận thay thế."
                ),
                "note": "Tự động kiểm tra tính hợp lệ dữ liệu và cảnh báo xung đột theo Resolution K016 & K018."
            },
            {
                "screen": "SCR-DISC-03: Tích hợp chính sách miễn giảm trong Hồ sơ học sinh",
                "image": "m4_sm8_student_discount.png",
                "component": "StudentDetailHub (Tab Hồ sơ & Tab Học phí)",
                "format": "Integrated Section Table + Invoice Ledger",
                "desc": (
                    "Tại màn hình Chi tiết học sinh, khối 'Miễn giảm' hiển thị danh sách toàn bộ các chính sách đang có hiệu lực "
                    "đối với học sinh này (gồm cả chính sách theo lớp và chính sách cá nhân), kèm mức giảm, khoản phí áp dụng và nút chỉnh sửa nhanh. "
                    "Đồng thời, tab Học phí hiển thị rõ ràng số tiền chiết khấu được trừ trên từng kỳ hóa đơn thực tế."
                ),
                "note": "Đồng bộ dữ liệu hai chiều tức thời với discountSlice và invoiceSlice."
            }
        ]
    },

    # 5. Tiêu chí nghiệm thu (Acceptance Criteria - AC)
    "acceptance_criteria": [
        {
            "id": "AC-DISC-01",
            "title": "Tính toán khấu trừ theo tỷ lệ phần trăm chính xác",
            "scenario": (
                "Given học sinh A có khoản phí 'Học phí chính khóa' là 2.500.000 đ và chính sách miễn giảm 50% "
                "When hệ thống tính toán số tiền giảm trừ "
                "Then số tiền giảm trừ bằng đúng 1.250.000 đ và số tiền phải đóng sau giảm trừ là 1.250.000 đ."
            )
        },
        {
            "id": "AC-DISC-02",
            "title": "Khấu trừ số tiền cố định và cơ chế chặn số dư âm",
            "scenario": (
                "Given học sinh B có khoản phí 'Học liệu' là 300.000 đ và chính sách miễn giảm cố định 500.000 đ "
                "When hệ thống tính toán số tiền giảm trừ "
                "Then số tiền khấu trừ tự động được chặn trên (clamp) ở mức 300.000 đ, số tiền phải nộp là 0 đ và tuyệt đối không xuất hiện số âm."
            )
        },
        {
            "id": "AC-DISC-03",
            "title": "Xử lý xung đột: Ưu tiên chính sách có giá trị giảm cao hơn (Resolution K016)",
            "scenario": (
                "Given học sinh C thuộc lớp 10A1 có chính sách lớp giảm 20% Học phí (tương đương 500.000 đ) và học sinh C được gán thêm chính sách cá nhân giảm 50% Học phí (tương đương 1.250.000 đ) "
                "When hệ thống phân giải chính sách áp dụng khi sinh hóa đơn "
                "Then hệ thống tự động áp dụng chính sách cá nhân 50% (1.250.000 đ) vì mang lại mức giảm cao hơn cho học sinh."
            )
        },
        {
            "id": "AC-DISC-04",
            "title": "Cảnh báo xung đột và tự động loại trừ khi xác nhận thay thế",
            "scenario": (
                "Given học sinh D đang hưởng chính sách lớp X và Kế toán tạo chính sách cá nhân Y cho học sinh D trên cùng khoản phí "
                "When form nhập liệu phát hiện xung đột và Kế toán tích chọn 'Tôi xác nhận thay thế chính sách cũ' rồi bấm Lưu "
                "Then hệ thống tự động thêm mã học sinh D vào danh sách excludedStudentIds của chính sách lớp X, và các đợt thu sau học sinh D chỉ hưởng chính sách Y."
            )
        },
        {
            "id": "AC-DISC-05",
            "title": "Phép giao toán học danh mục khoản phí (Resolution K018)",
            "scenario": (
                "Given Lớp 10A1 có các khoản phí [1, 2, 5, 6, 7] và Lớp 11A1 có các khoản phí [1, 2, 10, 11, 15] "
                "When Kế toán tạo chính sách chọn đồng thời cả 2 lớp 10A1 và 11A1 "
                "Then dropdown 'Khoản phí áp dụng' chỉ hiển thị duy nhất 2 khoản phí [1, 2] (Học phí chính khóa và Tiền ăn bán trú), các khoản phí riêng lẻ khác bị ẩn hoàn toàn."
            )
        },
        {
            "id": "AC-DISC-06",
            "title": "Chuyển đổi trạng thái Tạm ngưng và Kích hoạt lại tức thì",
            "scenario": (
                "Given chính sách MG-2026-001 đang ở trạng thái 'Đang hoạt động' (active) "
                "When Kế toán bấm menu thao tác 3 chấm và chọn 'Ngừng áp dụng' "
                "Then trạng thái chính sách chuyển sang 'Ngừng áp dụng' (paused), badge màu chuyển sang cam, và các đợt hóa đơn sinh ra trong thời gian này sẽ không tính khoản giảm trừ của chính sách này."
            )
        },
        {
            "id": "AC-DISC-07",
            "title": "Xuất tệp báo cáo Excel chuẩn UTF-8 BOM",
            "scenario": (
                "Given danh sách chính sách miễn giảm đang hiển thị trên bảng dữ liệu "
                "When Kế toán bấm nút 'Xuất Excel' trên thanh công cụ "
                "Then trình duyệt tải về tệp danh_sach_chinh_sach_mien_giam.csv có gắn Byte Order Mark UTF-8, khi mở bằng Microsoft Excel hiển thị đầy đủ dấu tiếng Việt chuẩn xác 100%."
            )
        }
    ],

    # 6. Yêu cầu phi chức năng & Bảo mật dữ liệu (NFR)
    "nfr": {
        "performance": [
            "Thời gian phản hồi tìm kiếm và lọc dữ liệu chính sách miễn giảm trên client dưới 50ms cho danh mục 500 chính sách.",
            "Thời gian tính toán khấu trừ tự động (resolveStudentDiscounts) cho toàn bộ sĩ số một lớp (50 học sinh) dưới 10ms khi sinh đợt hóa đơn.",
            "Thời gian sinh và tải tệp CSV xuất báo cáo dưới 300ms."
        ],
        "security": [
            "Tuân thủ nghiêm ngặt Luật An toàn thông tin mạng và Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân học sinh.",
            "Thông tin lý do miễn giảm nhạy cảm (như gia đình hộ nghèo, học sinh khuyết tật, hoàn cảnh đặc biệt) được kiểm soát truy cập nghiêm ngặt theo nguyên tắc Need-to-know: chỉ Kế toán và Ban Giám Hiệu được quyền xem chi tiết.",
            "Cách ly dữ liệu tuyệt đối theo schoolCode: trường A tuyệt đối không xem được danh mục chính sách miễn giảm của trường B."
        ],
        "accessibility": [
            "Giao diện tuân thủ tiêu chuẩn tiếp cận Web Content Accessibility Guidelines (WCAG 2.1 AA) về độ tương phản màu sắc chữ và nền.",
            "Hỗ trợ đầy đủ điều hướng bằng bàn phím (Tab, Enter, Escape, Arrow Up/Down) trên các modal chọn lớp và chọn học sinh.",
            "Hỗ trợ phản hồi tương thích trên mọi kích thước màn hình từ Desktop (1440px) đến máy tính bảng (768px)."
        ]
    },

    # 7. Quy tắc phối hợp vận hành thực tế
    "operations_rules": [
        {
            "situation": "Đầu năm học mới (Tháng 8 - Tháng 9)",
            "action": "Ban Giám Hiệu ban hành khung chính sách học bổng và mức miễn giảm cho niên khóa mới. Kế toán nhập liệu toàn bộ danh mục chính sách theo lớp và cá nhân vào hệ thống.",
            "system": "Hệ thống kiểm tra tính hợp lệ của niên khóa, đối soát danh mục khoản phí của từng lớp và kích hoạt trạng thái active cho các chính sách hợp lệ."
        },
        {
            "situation": "Học sinh chuyển lớp giữa niên khóa",
            "action": "Giáo viên chủ nhiệm thực hiện thủ tục chuyển lớp trên hệ thống. Kế toán rà soát lại chính sách miễn giảm của học sinh tại lớp mới.",
            "system": "Nếu học sinh có chính sách cá nhân, chính sách tự động được bảo lưu sang lớp mới. Nếu học sinh chỉ hưởng chính sách theo lớp cũ, hệ thống tự động gỡ chính sách lớp cũ và áp dụng chính sách của lớp mới (nếu có)."
        },
        {
            "situation": "Phát sinh học sinh được duyệt học bổng đột xuất trong năm học",
            "action": "Kế toán tạo chính sách cá nhân mới cho học sinh với thời hạn từ tháng được duyệt đến hết năm học.",
            "system": "Hệ thống tự động phát hiện xung đột với chính sách lớp hiện tại, kích hoạt loại trừ tự động (Auto-exclusion) và áp dụng mức giảm mới từ kỳ thu kế tiếp."
        },
        {
            "situation": "Học sinh tạm dừng học hoặc bảo lưu kết quả",
            "action": "Quản trị viên chuyển trạng thái học sinh sang 'Tạm nghỉ' trong danh sách học sinh.",
            "system": "Hệ thống tự động bỏ qua học sinh này khi sinh đợt thu học phí và không tính trừ ngân sách miễn giảm trong các kỳ tạm nghỉ."
        }
    ],

    # 8. Phụ lục: Danh mục thông báo, Xử lý ngoại lệ & Đề xuất cải tiến chiến lược
    "appendix": {
        "notifications": [
            {
                "id": "NOTI-DISC-01",
                "event": "Tạo mới hoặc sửa chính sách miễn giảm thành công",
                "recipient": "Kế toán thực hiện",
                "body": "Đã lưu chính sách miễn giảm '[Tên chính sách]' thành công.",
                "onclick": "Đóng modal và làm mới bảng dữ liệu danh sách"
            },
            {
                "id": "NOTI-DISC-02",
                "event": "Phát hiện xung đột chính sách khi nhập liệu",
                "recipient": "Kế toán thực hiện",
                "body": "Phát hiện [N] học sinh đang hưởng chính sách khác trên khoản phí này. Vui lòng xác nhận thay thế.",
                "onclick": "Hiển thị chi tiết khối đối chiếu mức giảm trên form"
            },
            {
                "id": "NOTI-DISC-03",
                "event": "Chính sách miễn giảm chuyển trạng thái Ngừng áp dụng",
                "recipient": "Kế toán thực hiện",
                "body": "Đã tạm dừng chính sách '[Tên chính sách]'. Các đợt thu tiếp theo sẽ không tính giảm trừ.",
                "onclick": "Cập nhật badge trạng thái sang màu cam"
            },
            {
                "id": "NOTI-DISC-04",
                "event": "Hóa đơn học sinh có áp dụng khoản miễn giảm được phát hành",
                "recipient": "Phụ huynh học sinh (qua Edui App)",
                "body": "Thông báo học phí tháng [T] đã được áp dụng miễn giảm [Số tiền] đ theo chính sách '[Tên chính sách]'.",
                "onclick": "Mở màn hình chi tiết hóa đơn học phí trên ứng dụng phụ huynh"
            }
        ],
        "edge_cases": [
            {
                "case": "Số tiền giảm cố định lớn hơn số tiền học phí phát sinh thực tế trong tháng",
                "risk": "Nguy cơ tính toán ra số tiền âm trên hóa đơn hoặc phát sinh công nợ ngược cho nhà trường.",
                "solution": "Áp dụng thuật toán chặn âm (Non-negative Clamping): số tiền khấu trừ tối đa bằng đúng nguyên giá khoản phí, số tiền phải thu về 0 đ."
            },
            {
                "case": "Học sinh được chọn vào chính sách nhưng lớp chưa cấu hình khoản phí đó trong biểu phí",
                "risk": "Sinh dòng chiết khấu ảo trên khoản phí không tồn tại trong đợt thu.",
                "solution": "Áp dụng thuật toán giao thoa toán học (Resolution K018): chỉ các khoản phí đồng thời tồn tại ở tất cả các đối tượng đã chọn mới được phép liên kết."
            },
            {
                "case": "Học sinh vừa có chính sách lớp vừa có chính sách cá nhân nhưng mức giảm cá nhân thấp hơn chính sách lớp",
                "risk": "Thiệt thòi quyền lợi của học sinh nếu áp dụng cứng nhắc quy tắc cá nhân ghi đè lớp.",
                "solution": "Áp dụng cơ chế Highest Benefit Priority: hệ thống luôn chọn chính sách mang lại số tiền giảm cao hơn cho học sinh."
            },
            {
                "case": "Hai chính sách có cùng mức tiền giảm (ví dụ: lớp giảm 20% = 500.000 đ và cá nhân giảm cố định 500.000 đ)",
                "risk": "Không xác định được chính sách ưu tiên gây nhập nhằng trong hạch toán kế toán.",
                "solution": "Áp dụng quy tắc Tie-breaker: ưu tiên áp dụng chính sách cá nhân của học sinh để ghi nhận đúng đối tượng được thụ hưởng đặc thù."
            }
        ],
        "strategic_recommendations": [
            {
                "title": "Tích hợp Đề xuất Học bổng Tự động từ Sổ điểm (AI Merit Scholarship Suggestion)",
                "desc": "Kết nối phân hệ Điểm & Đánh giá (M3/SM3) với phân hệ Miễn giảm: Cuối mỗi học kỳ, hệ thống tự động gợi ý danh sách học sinh đạt danh hiệu Xuất sắc/Thủ khoa khối để Ban Giám Hiệu phê duyệt cấp học bổng một chạm mà không cần lọc thủ công."
            },
            {
                "title": "Liên thông CSDL Đối tượng Chính sách Sở Lao động - Thương binh & Xã hội",
                "desc": "Tích hợp cổng liên thông kiểm tra số CCCD của phụ huynh/học sinh với cơ sở dữ liệu quốc gia về hộ nghèo, gia đình chính sách người có công để tự động xác thực đối tượng miễn giảm theo Nghị định 81/2021/NĐ-CP, giảm thiểu thủ tục nộp giấy tờ photo công chứng."
            },
            {
                "title": "Báo cáo Phân tích Tác động Ngân sách An sinh (Scholarship Budget Analytics)",
                "desc": "Bổ sung biểu đồ trực quan trong Báo cáo Học phí (M4/SM6) hiển thị tỷ trọng ngân sách miễn giảm so với tổng doanh thu học phí toàn trường, giúp Ban Giám Hiệu chủ động cân đối quỹ học bổng theo từng quý."
            }
        ]
    }
}

def main():
    print("=" * 70)
    print("XUẤT BẢN ĐẶC TẢ PRD: M4 - SM8 - Miễn giảm LÊN CONFLUENCE")
    print(f"Server: {BASE_URL} | Space: {SPACE} | Parent ID: {PARENT_ID}")
    print("=" * 70)

    client = ConfluenceClient(BASE_URL, TOKEN, SPACE)

    # 1. Render XHTML Storage Format
    print("\n[1/3] Đang tạo nội dung Confluence Storage Format XHTML...")
    html_content = render_prd_storage_format(m4_sm8_prd_data)
    print(f"-> Tạo thành công nội dung XHTML: {len(html_content):,} bytes")

    # 2. Create or Update Confluence Page
    print(f"\n[2/3] Đang đẩy trang '{PAGE_TITLE}' lên Confluence...")
    result = client.create_or_update_page(PAGE_TITLE, PARENT_ID, html_content)
    page_id = result['id']
    version = result['version']
    action = result['action']
    webui_url = f"{BASE_URL}/pages/viewpage.action?pageId={page_id}"
    print(f"-> Thành công! Action: {action.upper()} | Page ID: {page_id} | Version: {version}")
    print(f"-> URL: {webui_url}")

    # 3. Upload Attachments
    print("\n[3/3] Đang tải các hình ảnh chụp thực tế màn hình lên trang Confluence...")
    for sc in SCREENSHOTS:
        source_path = os.path.abspath(sc["source"])
        target_name = sc["target"]
        title = sc["title"]
        if os.path.exists(source_path):
            try:
                client.upload_attachment(page_id, source_path, target_name)
                print(f"  [OK] Đã đính kèm: {target_name} ({title})")
            except Exception as e:
                print(f"  [WARN] Lỗi khi đính kèm {target_name}: {e}")
        else:
            print(f"  [SKIP] Không tìm thấy tệp ảnh cục bộ: {source_path}")

    # 4. Update manifest
    manifest_path = os.path.join(os.path.dirname(__file__), 'published_prds_manifest.json')
    try:
        manifest = []
        if os.path.exists(manifest_path):
            with open(manifest_path, 'r', encoding='utf-8') as f:
                manifest = json.load(f)
        
        # Check if already in manifest
        existing_idx = None
        for i, entry in enumerate(manifest):
            if entry.get('code') == 'M4/SM8' or entry.get('page_id') == str(page_id):
                existing_idx = i
                break
        
        manifest_entry = {
            "milestone": "Milestone 1",
            "code": "M4/SM8",
            "name": PAGE_TITLE,
            "parent_module": "M4",
            "parent_id": PARENT_ID,
            "page_id": str(page_id),
            "version": version,
            "action": action,
            "url": webui_url,
            "webui": webui_url
        }

        if existing_idx is not None:
            manifest[existing_idx] = manifest_entry
        else:
            manifest.append(manifest_entry)

        with open(manifest_path, 'w', encoding='utf-8') as f:
            json.dump(manifest, f, ensure_ascii=False, indent=2)
        print(f"\n-> Đã cập nhật published_prds_manifest.json thành công!")
    except Exception as e:
        print(f"\n-> Lỗi khi cập nhật manifest: {e}")

    print("\n" + "=" * 70)
    print("HOÀN TẤT XUẤT BẢN PRD LÊN CONFLUENCE THÀNH CÔNG!")
    print(f"Trang PRD: {PAGE_TITLE}")
    print(f"Liên kết: {webui_url}")
    print("=" * 70)

if __name__ == '__main__':
    main()
