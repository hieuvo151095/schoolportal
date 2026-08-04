// Minh hoạ gốc, tự vẽ bằng shape hình học đơn giản — chỉ mô phỏng tinh thần "chuyển đổi số
// giáo dục" (trường học + thiết bị số + kết nối), không sao chép nguyên bản hình ảnh bên thứ 3.
export function EducationIllustration() {
  return (
    <svg viewBox="0 0 400 360" width="100%" height="100%" role="presentation" aria-hidden="true">
      {/* Vòng tròn nền + đường quỹ đạo gợi ý "kết nối số" */}
      <circle cx="200" cy="190" r="150" fill="#ffffff" fillOpacity="0.12" />
      <circle cx="200" cy="190" r="115" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="6 8" />

      {/* Chấm tròn rải rác gợi ý dữ liệu/kết nối */}
      <circle cx="70" cy="90" r="5" fill="#ffffff" fillOpacity="0.6" />
      <circle cx="330" cy="120" r="4" fill="#ffffff" fillOpacity="0.5" />
      <circle cx="80" cy="280" r="4" fill="#ffffff" fillOpacity="0.5" />
      <circle cx="320" cy="270" r="6" fill="#ffffff" fillOpacity="0.6" />

      {/* Toà nhà trường học */}
      <g transform="translate(70,140)">
        <polygon points="60,0 120,40 0,40" fill="#1d4ed8" />
        <rect x="10" y="40" width="100" height="90" fill="#2563eb" />
        <rect x="30" y="60" width="16" height="16" fill="#fde047" />
        <rect x="56" y="60" width="16" height="16" fill="#fde047" />
        <rect x="82" y="60" width="16" height="16" fill="#fde047" />
        <rect x="48" y="90" width="24" height="40" fill="#1e3a8a" />
        {/* Cờ nhỏ trên nóc */}
        <line x1="60" y1="0" x2="60" y2="-26" stroke="#1e3a8a" strokeWidth="2" />
        <polygon points="60,-26 60,-12 82,-19" fill="#facc15" />
      </g>

      {/* Thiết bị số hiển thị "sổ điểm / dữ liệu" */}
      <g transform="translate(215,110)">
        <rect x="0" y="0" width="120" height="170" rx="14" fill="#ffffff" />
        <rect x="10" y="16" width="100" height="120" rx="4" fill="#eff6ff" />
        <rect x="22" y="32" width="76" height="10" rx="2" fill="#93c5fd" />
        <rect x="22" y="52" width="56" height="10" rx="2" fill="#bfdbfe" />
        <rect x="22" y="72" width="66" height="10" rx="2" fill="#bfdbfe" />
        <rect x="22" y="92" width="40" height="10" rx="2" fill="#bfdbfe" />
        <circle cx="60" cy="152" r="7" fill="#2563eb" />
      </g>

      {/* Đường nối gợi ý dữ liệu chạy giữa trường học và thiết bị */}
      <path d="M170 190 C 195 170, 195 170, 215 165" fill="none" stroke="#fde047" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 10" />
    </svg>
  )
}
