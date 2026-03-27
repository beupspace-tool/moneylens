import { Upload, Settings, LayoutDashboard } from 'lucide-react'

// Quick start section — 3 onboarding steps
export function GuideQuickStart() {
  const steps = [
    {
      num: '1',
      icon: Upload,
      title: 'Import dữ liệu từ Excel',
      color: '#1B2A4A',
      bg: '#EBF0F7',
      steps: [
        'Vào mục Import (thanh bên trái)',
        'Kéo thả hoặc click chọn file .xlsx (PERSONAL FINANCE TRACKER)',
        'Click "Phân tích file" → xem trước dữ liệu',
        'Chọn chế độ "Thay thế" hoặc "Thêm vào"',
        'Click "Import tất cả" để xác nhận',
      ],
    },
    {
      num: '2',
      icon: Settings,
      title: 'Cập nhật giá thị trường',
      color: '#D4A843',
      bg: '#FDF4E0',
      steps: [
        'Vào mục Cài đặt (góc dưới thanh bên)',
        'Cập nhật giá vàng/chỉ (VND)',
        'Cập nhật tỉ giá USD/VND',
        'Cập nhật NAV hiện tại của các quỹ CCQ',
        'Lưu — Dashboard tự cập nhật ngay lập tức',
      ],
    },
    {
      num: '3',
      icon: LayoutDashboard,
      title: 'Xem tổng quan Dashboard',
      color: '#008080',
      bg: '#E0F2EE',
      steps: [
        'Tổng tài sản = tổng 6 kênh đầu tư',
        'Tài sản ròng = Tổng tài sản − Nợ phải trả',
        'Biểu đồ donut: phân bổ theo kênh',
        'Biểu đồ đường: xu hướng tài sản ròng',
        'Sắp đến hạn: tiết kiệm & bảo hiểm cần chú ý',
      ],
    },
  ]

  return (
    <section id="quick-start">
      <SectionHeader title="Bắt đầu nhanh" accent="#D4A843" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {steps.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.num}
              className="rounded-xl bg-white shadow-sm overflow-hidden"
              style={{ borderLeft: `4px solid ${s.color}` }}
            >
              <div className="px-4 pt-4 pb-2 flex items-center gap-3">
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-extrabold"
                  style={{ backgroundColor: s.bg, color: s.color }}
                >
                  {s.num}
                </span>
                <Icon className="size-4 shrink-0" style={{ color: s.color }} />
                <p className="text-sm font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
                  {s.title}
                </p>
              </div>
              <ul className="px-4 pb-4 space-y-1.5">
                {s.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#64748B]">
                    <span className="mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#CBD5E1]" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// Shared section header used across guide sub-components
export function SectionHeader({ title, accent = '#008080' }: { title: string; accent?: string }) {
  return (
    <div className="mb-4">
      <h2
        className="text-lg font-extrabold text-[#1B2A4A] font-[family-name:var(--font-nunito)]"
      >
        {title}
      </h2>
      <div className="mt-1 h-0.5 w-10 rounded-full" style={{ backgroundColor: accent }} />
    </div>
  )
}

// Shared channel card used across guide sub-components
export function ChannelCard({
  id,
  icon,
  title,
  accent,
  bg,
  items,
}: {
  id: string
  icon: React.ReactNode
  title: string
  accent: string
  bg: string
  items: { label: string; desc: string }[]
}) {
  return (
    <div
      id={id}
      className="rounded-xl bg-white shadow-sm overflow-hidden"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <div className="px-4 pt-4 pb-2 flex items-center gap-2.5">
        <span
          className="flex-shrink-0 p-1.5 rounded-lg"
          style={{ backgroundColor: bg }}
        >
          {icon}
        </span>
        <h3
          className="text-sm font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]"
        >
          {title}
        </h3>
      </div>
      <ul className="px-4 pb-4 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-xs">
            <span className="font-semibold text-[#1B2A4A]">{item.label}: </span>
            <span className="text-[#64748B]">{item.desc}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
