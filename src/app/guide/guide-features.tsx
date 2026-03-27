import { LayoutDashboard, Upload, Settings, Pencil, Trash2, Plus } from 'lucide-react'
import { SectionHeader } from './guide-quick-start'

// General features: Dashboard, Import, Settings, CRUD tips
export function GuideFeatures() {
  return (
    <div className="space-y-10">
      <GuideDashboard />
      <GuideImport />
      <GuideSettings />
      <GuideCrudTips />
      <GuideDataNote />
    </div>
  )
}

function GuideDashboard() {
  return (
    <section id="dashboard">
      <SectionHeader title="Dashboard — Tổng quan" accent="#008080" />
      <div className="rounded-xl bg-white shadow-sm overflow-hidden" style={{ borderLeft: '4px solid #008080' }}>
        <div className="px-4 pt-4 pb-2 flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-[#E0F2EE]">
            <LayoutDashboard className="size-4 text-[#008080]" />
          </span>
          <p className="text-sm font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
            Trang chủ (/)
          </p>
        </div>
        <div className="px-4 pb-4 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
          {[
            ['Tổng tài sản', 'Vàng + CCQ + Tiết kiệm + Tiền mặt + USD + Bảo hiểm'],
            ['Tài sản ròng', 'Tổng tài sản − Nợ phải trả (dư nợ khoản vay)'],
            ['Biểu đồ donut', 'Phân bổ % mỗi kênh đầu tư trong tổng tài sản'],
            ['Biểu đồ đường', 'Xu hướng tài sản ròng theo tháng'],
            ['Chi tiết tài sản', '6 thẻ tóm tắt — click qua trang kênh để xem chi tiết'],
            ['Sắp đến hạn', 'Tiết kiệm đáo hạn, bảo hiểm cần đóng phí, subscription hết hạn'],
          ].map(([label, desc]) => (
            <div key={label} className="text-xs">
              <span className="font-semibold text-[#1B2A4A]">{label}: </span>
              <span className="text-[#64748B]">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function GuideImport() {
  return (
    <section id="import">
      <SectionHeader title="Import dữ liệu từ Excel" accent="#1B2A4A" />
      <div className="rounded-xl bg-white shadow-sm overflow-hidden" style={{ borderLeft: '4px solid #1B2A4A' }}>
        <div className="px-4 pt-4 pb-2 flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-[#EBF0F7]">
            <Upload className="size-4 text-[#1B2A4A]" />
          </span>
          <p className="text-sm font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
            Import (/import)
          </p>
        </div>
        <div className="px-4 pb-4 space-y-2">
          {[
            ['Bước 1 — Chọn file', 'Kéo thả hoặc click để upload file .xlsx (PERSONAL FINANCE TRACKER.xlsx)'],
            ['Bước 2 — Phân tích', 'Click "Phân tích file" → app đọc các sheet: GOLD, FUNDS, SAVINGS, USD, INSURANCE, SUBSCRIPTIONS, CASH, LOAN_PAYMENTS'],
            ['Bước 3 — Xem trước', 'Kiểm tra dữ liệu được nhận dạng; bỏ tick sheet không muốn import'],
            ['Chế độ "Thay thế"', 'Xóa toàn bộ dữ liệu cũ và thay bằng dữ liệu mới từ file'],
            ['Chế độ "Thêm vào"', 'Giữ nguyên dữ liệu cũ, chỉ thêm bản ghi mới — tránh trùng lặp'],
            ['Auto backup', 'App tự sao lưu dữ liệu hiện tại vào localStorage trước khi import'],
          ].map(([label, desc]) => (
            <div key={label} className="text-xs">
              <span className="font-semibold text-[#1B2A4A]">{label}: </span>
              <span className="text-[#64748B]">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function GuideSettings() {
  return (
    <section id="settings">
      <SectionHeader title="Cài đặt" accent="#D4A843" />
      <div className="rounded-xl bg-white shadow-sm overflow-hidden" style={{ borderLeft: '4px solid #D4A843' }}>
        <div className="px-4 pt-4 pb-2 flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-[#FDF4E0]">
            <Settings className="size-4 text-[#D4A843]" />
          </span>
          <p className="text-sm font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
            Cài đặt (/settings)
          </p>
        </div>
        <div className="px-4 pb-4 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
          {[
            ['Giá vàng/chỉ', 'Cập nhật giá vàng thị trường (VND) → ảnh hưởng tổng giá trị vàng trong Dashboard'],
            ['Tỉ giá USD/VND', 'Cập nhật tỉ giá → ảnh hưởng giá trị USD và chi phí subscription bằng USD'],
            ['NAV các quỹ', 'Cập nhật NAV hiện tại cho từng mã quỹ → tính lãi/lỗ CCQ chính xác'],
            ['Xuất dữ liệu', 'Download file backup .json — lưu trước khi import hoặc thay đổi lớn'],
            ['Nhập dữ liệu', 'Restore dữ liệu từ file backup .json đã xuất trước đó'],
            ['Xóa tất cả', 'Reset toàn bộ app về mặc định — phải gõ "XÓA" để xác nhận'],
          ].map(([label, desc]) => (
            <div key={label} className="text-xs">
              <span className="font-semibold text-[#1B2A4A]">{label}: </span>
              <span className="text-[#64748B]">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function GuideCrudTips() {
  return (
    <section id="crud">
      <SectionHeader title="Thêm / Sửa / Xóa dữ liệu" accent="#008080" />
      <div className="rounded-xl bg-white shadow-sm overflow-hidden" style={{ borderLeft: '4px solid #008080' }}>
        <div className="px-4 py-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 p-2 rounded-lg bg-[#EBF0F7]">
              <Plus className="size-4 text-[#1B2A4A]" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#1B2A4A] mb-1">Thêm mới</p>
              <p className="text-xs text-[#64748B]">
                Click nút "Thêm mới" góc phải trên mỗi trang → điền form dialog → Save. Các trường có dropdown sẽ gợi ý giá trị phổ biến.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 p-2 rounded-lg bg-[#E0F2EE]">
              <Pencil className="size-4 text-[#008080]" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#1B2A4A] mb-1">Sửa</p>
              <p className="text-xs text-[#64748B]">
                Icon bút chì màu teal trên mỗi dòng → form dialog mở với dữ liệu hiện tại đã điền sẵn → chỉnh sửa → Save.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 p-2 rounded-lg bg-[#FDECEC]">
              <Trash2 className="size-4 text-[#EF4444]" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#1B2A4A] mb-1">Xóa</p>
              <p className="text-xs text-[#64748B]">
                Icon thùng rác màu đỏ → hộp thoại xác nhận hiện ra → click "Xóa" để xác nhận. Không thể hoàn tác.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function GuideDataNote() {
  return (
    <section id="data-note">
      <SectionHeader title="Mẹo & Lưu ý quan trọng" accent="#D4A843" />
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FDF4E0', border: '1px solid #F5DFA0' }}>
        <div className="px-4 py-4 space-y-2">
          {[
            'Cập nhật giá vàng & tỉ giá USD thường xuyên để Dashboard luôn chính xác.',
            'Dùng Import Excel thay vì nhập tay nếu có nhiều dữ liệu — nhanh hơn nhiều.',
            'Luôn backup (Cài đặt → Xuất dữ liệu) trước khi import file mới hoặc xóa dữ liệu.',
            'Dữ liệu lưu trong trình duyệt (localStorage) — sẽ mất nếu xóa cache hoặc dùng trình duyệt khác.',
            'Dùng chế độ "Thêm vào" khi import thêm giao dịch mới, tránh mất dữ liệu đã có.',
            'CCQ: chọn "Chi tiết" để xem lịch sử giao dịch; chọn "Tổng hợp" để xem P&L theo quỹ.',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-[#1B2A4A]">
              <span className="flex-shrink-0 mt-0.5 font-bold text-[#D4A843]">{i + 1}.</span>
              {tip}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
