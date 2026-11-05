# -*- coding: utf-8 -*-
"""
Confluence Storage Format XHTML Generator for School Operating Portal PRDs.
Strictly implements the comprehensive 8-section standard template:
  Header: Metadata Table + Multi-version Revision History + Automatic TOC
  1. Thông tin tổng quan (1.1 Bối cảnh & Mục tiêu, 1.2 Đối tượng sử dụng, 1.3 Thuật ngữ & Viết tắt)
  2. Tổng quan nghiệp vụ & Kiến trúc dữ liệu (2.1 Mô hình hóa Sequence, 2.2 Các bước nghiệp vụ, 2.3 Quy tắc BR, 2.4 Data Entity Model)
  3. Đặc tả tính năng & Use Cases chi tiết (UC-01, UC-02, ... với Tác nhân, Pre, Happy path, Exception, Post, BR)
  4. Bảng đặc tả chi tiết giao diện & Trải nghiệm (Màn hình từ prototype, Component, Format, Mô tả chi tiết, Ghi chú / BR)
  5. Tiêu chí nghiệm thu (Acceptance Criteria - AC: Bảng chuẩn Given - When - Then)
  6. Yêu cầu phi chức năng & Bảo mật dữ liệu (NFR, NĐ 13/2023/NĐ-CP, WCAG AA)
  7. Quy tắc phối hợp vận hành thực tế
  8. Phụ lục (8.1 Ma trận thông báo, 8.2 Ma trận xử lý ngoại lệ, 8.3 Đề xuất cải tiến chiến lược)
"""

import html
import re

def escape_xml(text):
    if text is None:
        return ""
    return html.escape(str(text))

def format_nfr_items(val):
    if not val:
        return []
    if isinstance(val, list):
        res = []
        for item in val:
            res.extend(format_nfr_items(item))
        return res
    if isinstance(val, str):
        # Split by newline first if multi-line
        lines = [line.strip(" -•*\t") for line in val.split('\n') if line.strip(" -•*\t")]
        if len(lines) > 1:
            return lines
        # Split by semicolon if present
        if ';' in val:
            parts = [p.strip(" -•*\t") for p in val.split(';') if p.strip(" -•*\t")]
            if len(parts) > 1:
                return parts
        return [val.strip()]
    return [str(val)]

ALLOWED_CONFLUENCE_TAGS = {
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'colgroup', 'col',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr', 'blockquote', 'pre',
    'ul', 'ol', 'li',
    'strong', 'em', 'b', 'i', 'u', 'sub', 'sup', 'code', 'span',
    'ac:structured-macro', 'ac:parameter', 'ac:rich-text-body', 'ac:plain-text-body',
    'ac:image', 'ac:link',
    'ri:attachment', 'ri:page', 'ri:url', 'ri:user'
}

def sanitize_xhtml(text):
    if not text:
        return ""
    # 1. Convert markdown code backticks: `code` -> <code>{escape_xml(code)}</code>
    text = re.sub(r'`([^`\n]+)`', lambda m: f"<code>{escape_xml(m.group(1))}</code>", text)
    # 2. Convert markdown bold: **bold** -> <strong>bold</strong>
    text = re.sub(r'\*\*([^*\n]+)\*\*', r"<strong>\1</strong>", text)
    # 3. Fix bare & not part of an XML entity
    text = re.sub(r'&(?!(?:[a-zA-Z]+|#[0-9]+|#x[0-9a-fA-F]+);)', '&amp;', text)
    
    # 4. Save only allowed XML tags; escape any non-confluence tag (e.g. <input>, <select>, <title>, <a>, etc.)
    tags = []
    def save_tag(m):
        full_tag = m.group(0)
        tag_name = m.group(1).lower()
        if tag_name in ALLOWED_CONFLUENCE_TAGS:
            tags.append(full_tag)
            return f'___TAG_{len(tags)-1}___'
        else:
            return escape_xml(full_tag)
        
    tag_pattern = r'</?([a-zA-Z][a-zA-Z0-9:-]*)(?:\s+[^<>]*)?/?>'
    text = re.sub(tag_pattern, save_tag, text)
    
    # 5. Escape remaining < and >
    text = text.replace('<', '&lt;').replace('>', '&gt;')
    
    # 6. Restore valid tags
    for i, t in enumerate(tags):
        text = text.replace(f'___TAG_{i}___', t)
    return text

def render_prd_storage_format(prd):
    code = prd.get("code", "")
    title = prd.get("name", "")
    priority = prd.get("priority", "MUST HAVE")
    status = prd.get("status", "READY FOR REVIEW")
    owner = prd.get("owner", "hieu.vo1@finviet.com.vn")
    created_date = prd.get("created_date", "2026-10-27")
    reviewer = prd.get("reviewer", "hieu.vo1@finviet.com.vn")
    parent_cat = prd.get("parent_category", f"8. Portal QLTH > {prd.get('parent_module', '')}")
    
    prio_color = "rgb(217,119,6)" if "MUST" in priority.upper() else "rgb(2,106,162)"
    status_color = "rgb(10,135,84)" if "READY" in status.upper() else "rgb(2,106,162)"

    parts = []

    # =========================================================================
    # Header: Metadata Table
    # =========================================================================
    parts.append(f'''<table class="wrapped"><colgroup><col style="width: 180px;" /><col /></colgroup><tbody>
<tr><td><strong>Mã phân hệ</strong></td><td><strong>{escape_xml(code)}</strong></td></tr>
<tr><td><strong>Tên tính năng</strong></td><td><strong>{escape_xml(title)}</strong></td></tr>
<tr><td><strong>Priority</strong></td><td><span style="color: {prio_color};"><strong>{escape_xml(priority)}</strong></span></td></tr>
<tr><td><strong>Document Status</strong></td><td><span style="color: {status_color};"><strong>{escape_xml(status)}</strong></span></td></tr>
<tr><td><strong>Document Owner</strong></td><td>{escape_xml(owner)}</td></tr>
<tr><td><strong>Created date</strong></td><td>{escape_xml(created_date)}</td></tr>
<tr><td><strong>Reviewer</strong></td><td>{escape_xml(reviewer)}</td></tr>
<tr><td><strong>Mục lục tính năng cha</strong></td><td><strong>{escape_xml(parent_cat)}</strong></td></tr>
</tbody></table><p><br /></p>''')

    # =========================================================================
    # Header: Lịch sử tài liệu
    # =========================================================================
    history = prd.get("history", [
        {
            "version": "1.0",
            "section": "Khởi tạo",
            "content": f"Khởi tạo đặc tả tính năng {title} chuẩn ECO FINVIET Design System và Architecture QLTH.",
            "date": "2026-10-26",
            "author": owner
        },
        {
            "version": "1.1",
            "section": "Cập nhật Sơ đồ & Prototype",
            "content": "Bổ sung Sequence Diagram mô hình hóa luồng nghiệp vụ trực quan, cập nhật chi tiết form UI và Prototype thực tế.",
            "date": "2026-10-27",
            "author": owner
        },
        {
            "version": "1.2",
            "section": "Bổ sung AC & Ma trận ngoại lệ",
            "content": "Hoàn thiện bảng tiêu chuẩn nghiệm thu Given-When-Then, ma trận thông báo đẩy và xử lý tình huống biên.",
            "date": "2026-10-27",
            "author": owner
        }
    ])
    
    parts.append('<p><strong>Lịch sử tài liệu</strong></p>')
    parts.append('<table class="wrapped"><colgroup><col style="width: 80px;" /><col style="width: 140px;" /><col /><col style="width: 100px;" /><col style="width: 160px;" /></colgroup>')
    parts.append('<thead><tr><th><strong>Phiên bản</strong></th><th><strong>Mục thay đổi</strong></th><th><strong>Nội dung</strong></th><th><strong>Ngày</strong></th><th><strong>Người phụ trách</strong></th></tr></thead><tbody>')
    for h in history:
        parts.append(f'<tr><td>{escape_xml(h.get("version", ""))}</td><td>{escape_xml(h.get("section", ""))}</td><td>{escape_xml(h.get("content", ""))}</td><td>{escape_xml(h.get("date", ""))}</td><td>{escape_xml(h.get("author", ""))}</td></tr>')
    parts.append('</tbody></table><p><br /></p>')

    # =========================================================================
    # Header: TOC
    # =========================================================================
    parts.append('<p><strong>Mục lục</strong></p>')
    parts.append('<p><ac:structured-macro ac:name="toc" ac:schema-version="1" /></p><hr />')

    # =========================================================================
    # 1. Thông tin tổng quan
    # =========================================================================
    overview = prd.get("overview", {})
    parts.append('<h2>1. Thông tin tổng quan</h2>')
    
    # 1.1 Bối cảnh & Mục tiêu
    parts.append('<h3>1.1 Bối cảnh &amp; Mục tiêu tính năng</h3>')
    parts.append(f'<p>{overview.get("context", overview.get("intro", ""))}</p>')
    goals = overview.get("goals_list", [])
    if goals:
        parts.append('<ul>')
        for g in goals:
            parts.append(f'<li>{g}</li>')
        parts.append('</ul>')
    elif overview.get("goals"):
        parts.append(f'<p>{overview.get("goals")}</p>')

    # 1.2 Đối tượng sử dụng
    users = overview.get("target_users", [])
    parts.append('<h3>1.2 Đối tượng sử dụng</h3>')
    if users:
        parts.append('<table class="wrapped"><colgroup><col style="width: 180px;" /><col style="width: 220px;" /><col /></colgroup>')
        parts.append('<thead><tr><th><strong>Nhóm người dùng</strong></th><th><strong>Vai trò trong hệ thống</strong></th><th><strong>Hành vi chính trên tính năng</strong></th></tr></thead><tbody>')
        for u in users:
            parts.append(f'<tr><td><strong>{escape_xml(u.get("group", ""))}</strong></td><td>{escape_xml(u.get("role", ""))}</td><td>{escape_xml(u.get("actions", ""))}</td></tr>')
        parts.append('</tbody></table><p><br /></p>')
    else:
        parts.append('<p>Ban Giám Hiệu, Giáo viên chủ nhiệm / Bộ môn, Kế toán trường học và Phụ huynh học sinh.</p>')

    # 1.3 Thuật ngữ & Quy ước viết tắt
    glossary = overview.get("glossary", [])
    parts.append('<h3>1.3 Thuật ngữ &amp; Quy ước viết tắt</h3>')
    if glossary:
        parts.append('<table class="wrapped"><colgroup><col style="width: 200px;" /><col /></colgroup>')
        parts.append('<thead><tr><th><strong>Thuật ngữ / Viết tắt</strong></th><th><strong>Định nghĩa &amp; Diễn giải</strong></th></tr></thead><tbody>')
        for item in glossary:
            parts.append(f'<tr><td><strong>{escape_xml(item.get("term", ""))}</strong></td><td>{item.get("definition", "")}</td></tr>')
        parts.append('</tbody></table>')
    else:
        parts.append('<p>QLTH (Quản lý trường học), BGH (Ban Giám Hiệu), GVCN (Giáo viên chủ nhiệm), PH (Phụ huynh), HS (Học sinh), BE (Backend API), UI (Giao diện người dùng).</p>')

    parts.append('<hr />')

    # =========================================================================
    # 2. Tổng quan nghiệp vụ & Kiến trúc dữ liệu
    # =========================================================================
    biz = prd.get("business", {})
    parts.append('<h2>2. Tổng quan nghiệp vụ &amp; Kiến trúc dữ liệu</h2>')
    
    # 2.1 Mô hình hóa nghiệp vụ
    parts.append('<h3>2.1 Mô hình hóa nghiệp vụ (Sequence Diagrams)</h3>')
    seq_desc = biz.get("flow_desc", "Mô hình hóa toàn bộ các luồng tương tác nghiệp vụ giữa Người dùng, Web Portal / App, Hệ thống Backend (BE) và Cơ quan / Nhà trường.")
    parts.append(f'<p>{escape_xml(seq_desc)}</p>')
    
    flow_steps = biz.get("flow_steps", [])
    if flow_steps:
        parts.append('<table class="wrapped"><colgroup><col style="width: 70px;" /><col style="width: 140px;" /><col style="width: 180px;" /><col /></colgroup>')
        parts.append('<thead><tr><th><strong>Giai đoạn</strong></th><th><strong>Chủ thể</strong></th><th><strong>Hành động tương tác</strong></th><th><strong>Hệ thống BE / Module xử lý</strong></th></tr></thead><tbody>')
        for idx, step in enumerate(flow_steps, 1):
            parts.append(f'<tr><td><strong>GĐ {idx}</strong></td><td><strong>{escape_xml(step.get("actor", ""))}</strong></td><td>{escape_xml(step.get("action", ""))}</td><td>{escape_xml(step.get("desc", ""))}</td></tr>')
        parts.append('</tbody></table><p><br /></p>')

    # 2.2 Mô tả chi tiết các bước nghiệp vụ
    narratives = biz.get("steps_narrative", [])
    parts.append('<h3>2.2 Mô tả chi tiết các bước nghiệp vụ</h3>')
    if narratives:
        parts.append('<ol>')
        for step_text in narratives:
            parts.append(f'<li>{step_text}</li>')
        parts.append('</ol>')

    # 2.3 Quy tắc nghiệp vụ (Business Rules - BR)
    rules = biz.get("rules", [])
    parts.append('<h3>2.3 Quy tắc nghiệp vụ (Business Rules - BR)</h3>')
    if rules:
        parts.append('<table class="wrapped"><colgroup><col style="width: 100px;" /><col style="width: 220px;" /><col /></colgroup>')
        parts.append('<thead><tr><th><strong>Mã BR</strong></th><th><strong>Quy tắc nghiệp vụ</strong></th><th><strong>Chi tiết diễn giải &amp; Xử lý hệ thống</strong></th></tr></thead><tbody>')
        for r in rules:
            parts.append(f'<tr><td><span style="color: rgb(2,106,162);"><strong>{escape_xml(r.get("id", ""))}</strong></span></td><td><strong>{escape_xml(r.get("title", ""))}</strong></td><td>{r.get("desc", "")}</td></tr>')
        parts.append('</tbody></table><p><br /></p>')

    # 2.4 Cấu trúc thực thể dữ liệu (Data Entity Model)
    entities = biz.get("data_entities", [])
    parts.append('<h3>2.4 Cấu trúc thực thể dữ liệu (Data Entity Model)</h3>')
    if entities:
        parts.append('<table class="wrapped"><colgroup><col style="width: 180px;" /><col style="width: 120px;" /><col style="width: 90px;" /><col /></colgroup>')
        parts.append('<thead><tr><th><strong>Thuộc tính (Field)</strong></th><th><strong>Kiểu dữ liệu</strong></th><th><strong>Bắt buộc</strong></th><th><strong>Mô tả &amp; Quy tắc ràng buộc</strong></th></tr></thead><tbody>')
        for ent in entities:
            req_str = "Có" if ent.get("required", False) else "Không"
            req_badge = f'<span style="color: rgb(217,119,6);"><strong>{req_str}</strong></span>' if ent.get("required") else req_str
            parts.append(f'<tr><td><code>{escape_xml(ent.get("field", ""))}</code></td><td>{escape_xml(ent.get("type", ""))}</td><td>{req_badge}</td><td>{ent.get("desc", "")}</td></tr>')
        parts.append('</tbody></table>')

    parts.append('<hr />')

    # =========================================================================
    # 3. Đặc tả tính năng & Use Cases chi tiết
    # =========================================================================
    features = prd.get("features", {})
    parts.append('<h2>3. Đặc tả tính năng &amp; Use Cases chi tiết</h2>')
    
    # 3.1 Phân rã chức năng
    breakdown = features.get("breakdown", [])
    if breakdown:
        parts.append('<h3>3.1 Phân rã chức năng (Functional Decomposition)</h3>')
        parts.append('<table class="wrapped"><colgroup><col style="width: 160px;" /><col style="width: 180px;" /><col style="width: 80px;" /><col style="width: 90px;" /><col /><col style="width: 100px;" /></colgroup>')
        parts.append('<thead><tr><th><strong>Epic</strong></th><th><strong>Feature</strong></th><th><strong>Platform</strong></th><th><strong>Priority</strong></th><th><strong>User Story</strong></th><th><strong>Jira ID</strong></th></tr></thead><tbody>')
        for b in breakdown:
            parts.append(f'<tr><td>{escape_xml(b.get("epic", ""))}</td><td><strong>{escape_xml(b.get("feature", ""))}</strong></td><td>{escape_xml(b.get("platform", ""))}</td><td><span style="color: rgb(217,119,6);"><strong>{escape_xml(b.get("priority", ""))}</strong></span></td><td>{escape_xml(b.get("story", ""))}</td><td><code>{escape_xml(b.get("jira", ""))}</code></td></tr>')
        parts.append('</tbody></table><p><br /></p>')

    # 3.2 Use Cases chi tiết
    use_cases = features.get("use_cases", [])
    parts.append('<h3>3.2 Use Cases chi tiết</h3>')
    for uc in use_cases:
        uc_id = uc.get("id", "")
        uc_name = uc.get("name", "")
        parts.append(f'<h4>{escape_xml(uc_id)}: {escape_xml(uc_name)}</h4>')
        parts.append('<table class="wrapped"><colgroup><col style="width: 160px;" /><col /></colgroup><tbody>')
        parts.append(f'<tr><td><strong>Tác nhân (Actor)</strong></td><td><strong>{escape_xml(uc.get("actor", ""))}</strong></td></tr>')
        parts.append(f'<tr><td><strong>Điều kiện tiên quyết</strong></td><td>{escape_xml(uc.get("pre", ""))}</td></tr>')
        
        # Happy path
        hp_list = uc.get("happy_path", [])
        hp_html = "<ol>" + "".join(f"<li>{item}</li>" for item in hp_list) + "</ol>" if hp_list else ""
        parts.append(f'<tr><td><strong>Luồng sự kiện chính</strong></td><td>{hp_html}</td></tr>')
        
        # Exception
        ex_list = uc.get("exceptions", uc.get("exception", []))
        ex_html = "<ol>" + "".join(f"<li>{item}</li>" for item in ex_list) + "</ol>" if ex_list else "<em>Không có</em>"
        parts.append(f'<tr><td><strong>Xử lý ngoại lệ / Rẽ nhánh</strong></td><td>{ex_html}</td></tr>')
        
        parts.append(f'<tr><td><strong>Hậu điều kiện</strong></td><td>{escape_xml(uc.get("post", ""))}</td></tr>')
        parts.append(f'<tr><td><strong>Quy tắc liên quan</strong></td><td><span style="color: rgb(2,106,162);"><strong>{escape_xml(uc.get("rules", ""))}</strong></span></td></tr>')
        parts.append('</tbody></table><p><br /></p>')

    parts.append('<hr />')

    # =========================================================================
    # 4. Bảng đặc tả chi tiết giao diện & Trải nghiệm
    # =========================================================================
    ui = prd.get("ui", {})
    parts.append('<h2>4. Bảng đặc tả chi tiết giao diện &amp; Trải nghiệm</h2>')
    parts.append(f'<h3>4.1 Entry point &amp; Điều hướng</h3><p>{ui.get("entry_point", "")}</p>')

    # Bảng chi tiết toàn bộ các màn hình và thành phần giao diện
    screens_table = ui.get("screens_table", [])
    if screens_table:
        parts.append('<h3>4.2 Bảng đặc tả chi tiết các màn hình &amp; Thành phần Prototype</h3>')
        parts.append('<p>Dưới đây là bảng đặc tả chi tiết toàn bộ các màn hình, thành phần giao diện và hình ảnh chụp thực tế từ Prototype trong hệ sinh thái FINVIET ECO Design System:</p>')
        parts.append('<table class="wrapped"><colgroup><col style="width: 280px;" /><col style="width: 160px;" /><col style="width: 140px;" /><col /><col style="width: 160px;" /></colgroup>')
        parts.append('<thead><tr><th><strong>Màn hình &amp; Hình ảnh Prototype</strong></th><th><strong>Field / Component</strong></th><th><strong>Format</strong></th><th><strong>Mô tả chi tiết &amp; Hành vi tương tác</strong></th><th><strong>Ghi chú / Quy tắc BR</strong></th></tr></thead><tbody>')
        for sc in screens_table:
            screen_name = escape_xml(sc.get("screen", ""))
            img_name = sc.get("image", "")
            img_html = ""
            if img_name:
                img_html = f'<p><ac:image ac:width="260" ac:align="center"><ri:attachment ri:filename="{escape_xml(img_name)}" /></ac:image></p>'
            parts.append(f'<tr><td><p><strong>{screen_name}</strong></p>{img_html}</td><td><strong>{escape_xml(sc.get("component", sc.get("field", "")))}</strong></td><td>{escape_xml(sc.get("format", sc.get("type", "")))}</td><td>{sc.get("desc", "")}</td><td>{escape_xml(sc.get("note", ""))}</td></tr>')
        parts.append('</tbody></table><p><br /></p>')
    else:
        # Fallback to overview_screen / form_screen if screens_table not explicitly present
        ov = ui.get("overview_screen", [])
        fm = ui.get("form_screen", [])
        if ov or fm:
            parts.append('<h3>4.2 Màn hình Danh sách / Tổng quan &amp; Form chi tiết</h3>')
            parts.append('<table class="wrapped"><colgroup><col style="width: 280px;" /><col style="width: 160px;" /><col style="width: 140px;" /><col /><col style="width: 160px;" /></colgroup>')
            parts.append('<thead><tr><th><strong>Màn hình &amp; Hình ảnh</strong></th><th><strong>Field / Component</strong></th><th><strong>Format</strong></th><th><strong>Mô tả chi tiết &amp; Hành vi</strong></th><th><strong>Ghi chú / BR</strong></th></tr></thead><tbody>')
            for item in ov:
                parts.append(f'<tr><td>Màn hình Danh sách / Tổng quan</td><td><strong>{escape_xml(item.get("component", ""))}</strong></td><td>{escape_xml(item.get("format", ""))}</td><td>{item.get("desc", "")}</td><td>{escape_xml(item.get("note", ""))}</td></tr>')
            for item in fm:
                parts.append(f'<tr><td>Màn hình Tạo mới / Chỉnh sửa</td><td><strong>{escape_xml(item.get("field", ""))}</strong></td><td>{escape_xml(item.get("type", ""))}</td><td>{item.get("validation", "")}</td><td>{escape_xml(item.get("note", ""))}</td></tr>')
            parts.append('</tbody></table><p><br /></p>')

    parts.append('<hr />')

    # =========================================================================
    # 5. Tiêu chí nghiệm thu (Acceptance Criteria - AC)
    # =========================================================================
    parts.append('<h2>5. Tiêu chí nghiệm thu (Acceptance Criteria - AC)</h2>')
    parts.append('<p>Các tiêu chí nghiệm thu được cấu trúc theo định dạng tiêu chuẩn <strong>Given - When - Then</strong> đảm bảo kiểm thử tự động và xác minh nghiệp vụ chính xác:</p>')
    
    ac_list = prd.get("acceptance_criteria", [])
    if ac_list:
        parts.append('<table class="wrapped"><colgroup><col style="width: 90px;" /><col style="width: 220px;" /><col /></colgroup>')
        parts.append('<thead><tr><th><strong>Mã AC</strong></th><th><strong>Tình huống kiểm thử</strong></th><th><strong>Kỳ vọng kết quả (Given - When - Then)</strong></th></tr></thead><tbody>')
        for ac in ac_list:
            ac_code = ac.get("id", ac.get("code", "AC"))
            ac_title = ac.get("title", "")
            ac_scenario = ac.get("scenario", ac.get("desc", ""))
            
            # Format Given-When-Then with bold keywords if present
            formatted_scenario = ac_scenario
            if "Given" in formatted_scenario or "When" in formatted_scenario or "Then" in formatted_scenario:
                formatted_scenario = re.sub(r'\b(Given)\b', '<strong>Given</strong>', formatted_scenario)
                formatted_scenario = re.sub(r'\b(When)\b', '<br /><strong>When</strong>', formatted_scenario)
                formatted_scenario = re.sub(r'\b(Then)\b', '<br /><strong>Then</strong>', formatted_scenario)
            
            parts.append(f'<tr><td><span style="color: rgb(10,135,84);"><strong>{escape_xml(ac_code)}</strong></span></td><td><strong>{escape_xml(ac_title)}</strong></td><td>{formatted_scenario}</td></tr>')
        parts.append('</tbody></table><p><br /></p>')

    # =========================================================================
    # 6. Yêu cầu phi chức năng & Bảo mật dữ liệu (NFR)
    # =========================================================================
    nfr = prd.get("nfr", {})
    if nfr:
        parts.append('<hr />')
        parts.append('<h2>6. Yêu cầu phi chức năng &amp; Bảo mật dữ liệu</h2>')
        perf_items = format_nfr_items(nfr.get("performance"))
        if perf_items:
            parts.append('<p><strong>Hiệu năng (Performance):</strong></p><ul>')
            for p in perf_items:
                parts.append(f'<li>{escape_xml(p)}</li>')
            parts.append('</ul>')
        sec_items = format_nfr_items(nfr.get("security"))
        if sec_items:
            parts.append('<p><strong>Bảo vệ dữ liệu cá nhân &amp; An toàn thông tin (Nghị định 13/2023/NĐ-CP):</strong></p><ul>')
            for s in sec_items:
                parts.append(f'<li>{escape_xml(s)}</li>')
            parts.append('</ul>')
        acc_items = format_nfr_items(nfr.get("accessibility") or nfr.get("ux") or nfr.get("compliance"))
        if acc_items:
            parts.append('<p><strong>Tương thích thiết bị &amp; Khả năng tiếp cận (Accessibility / UX):</strong></p><ul>')
            for a in acc_items:
                parts.append(f'<li>{escape_xml(a)}</li>')
            parts.append('</ul>')

    # =========================================================================
    # 7. Quy tắc phối hợp vận hành thực tế
    # =========================================================================
    ops = prd.get("operations_rules", [])
    if ops:
        parts.append('<hr />')
        parts.append('<h2>7. Quy tắc phối hợp vận hành thực tế</h2>')
        parts.append('<p>Để đảm bảo tính năng vận hành thông suốt giữa Ban Giám Hiệu, Giáo viên, Kế toán và Phụ huynh, các quy tắc phối hợp được chuẩn hóa như sau:</p>')
        parts.append('<table class="wrapped"><colgroup><col style="width: 220px;" /><col style="width: 260px;" /><col /></colgroup>')
        parts.append('<thead><tr><th><strong>Tình huống thực tế</strong></th><th><strong>Hành động của Nhân sự / Giáo viên</strong></th><th><strong>Biện pháp xử lý phía hệ thống</strong></th></tr></thead><tbody>')
        for op in ops:
            parts.append(f'<tr><td><strong>{escape_xml(op.get("situation", ""))}</strong></td><td>{escape_xml(op.get("action", ""))}</td><td>{escape_xml(op.get("system", ""))}</td></tr>')
        parts.append('</tbody></table><p><br /></p>')

    # =========================================================================
    # 8. Phụ lục: Danh mục thông báo, Xử lý ngoại lệ & Đề xuất chiến lược
    # =========================================================================
    appendix = prd.get("appendix", {})
    if appendix:
        parts.append('<hr />')
        parts.append('<h2>8. Phụ lục: Danh mục thông báo, Xử lý ngoại lệ &amp; Đề xuất cải tiến chiến lược</h2>')
        
        # 8.1 Push Notification Matrix
        notif_matrix = appendix.get("notifications", [])
        if notif_matrix:
            parts.append('<h3>8.1 Danh mục thông báo đẩy (Push / In-app Notification Matrix)</h3>')
            parts.append('<table class="wrapped"><colgroup><col style="width: 90px;" /><col style="width: 180px;" /><col style="width: 150px;" /><col /><col style="width: 160px;" /></colgroup>')
            parts.append('<thead><tr><th><strong>Mã Noti</strong></th><th><strong>Sự kiện kích hoạt</strong></th><th><strong>Người nhận</strong></th><th><strong>Nội dung thông báo</strong></th><th><strong>Hành vi khi chạm (On-click)</strong></th></tr></thead><tbody>')
            for nm in notif_matrix:
                parts.append(f'<tr><td><code>{escape_xml(nm.get("id", ""))}</code></td><td><strong>{escape_xml(nm.get("event", ""))}</strong></td><td>{escape_xml(nm.get("recipient", ""))}</td><td>{escape_xml(nm.get("body", ""))}</td><td>{escape_xml(nm.get("onclick", ""))}</td></tr>')
            parts.append('</tbody></table><p><br /></p>')

        # 8.2 Exception & Edge Cases Matrix
        edge_cases = appendix.get("edge_cases", [])
        if edge_cases:
            parts.append('<h3>8.2 Ma trận xử lý ngoại lệ &amp; Tình huống biên (Exception &amp; Edge Cases Matrix)</h3>')
            parts.append('<table class="wrapped"><colgroup><col style="width: 220px;" /><col style="width: 220px;" /><col /></colgroup>')
            parts.append('<thead><tr><th><strong>Tình huống ngoại lệ</strong></th><th><strong>Nguy cơ / Rủi ro</strong></th><th><strong>Biện pháp xử lý hệ thống</strong></th></tr></thead><tbody>')
            for ec in edge_cases:
                parts.append(f'<tr><td><strong>{escape_xml(ec.get("case", ""))}</strong></td><td>{escape_xml(ec.get("risk", ""))}</td><td>{escape_xml(ec.get("solution", ""))}</td></tr>')
            parts.append('</tbody></table><p><br /></p>')

        # 8.3 Strategic Recommendations
        strat = appendix.get("strategic_recommendations", [])
        if strat:
            parts.append('<h3>8.3 Đề xuất cải tiến chiến lược dựa trên các tính năng hiện có</h3>')
            parts.append('<ol>')
            for s in strat:
                parts.append(f'<li><strong>{escape_xml(s.get("title", ""))}</strong>: {s.get("desc", "")}</li>')
            parts.append('</ol>')

    # Footer note
    parts.append('<hr /><p style="color: rgb(107,114,128); font-size: 12px;"><em>Tài liệu được biên soạn và cập nhật theo chuẩn Marcus Fleet &amp; ECO FINVIET Design System.</em></p>')

    raw_html = "\n".join(parts)
    return sanitize_xhtml(raw_html)
