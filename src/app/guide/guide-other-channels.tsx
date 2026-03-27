import { Shield, Repeat, Wallet, CreditCard } from 'lucide-react'
import { SectionHeader, ChannelCard } from './guide-quick-start'

// Non-investment channels: Bảo hiểm, Subscriptions, Tiền mặt, Khoản vay
export function GuideOtherChannels() {
  return (
    <section id="other-channels">
      <SectionHeader title="Quản lý tài chính" accent="#1B2A4A" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <ChannelCard
          id="insurance"
          icon={<Shield className="size-4" style={{ color: '#1B2A4A' }} />}
          title="Bảo hiểm nhân thọ (/insurance)"
          accent="#1B2A4A"
          bg="#EBF0F7"
          items={[
            { label: 'Thêm hợp đồng', desc: 'Nhập tên sản phẩm, phí hàng năm, số tiền bảo hiểm, ngày bắt đầu, số năm đóng' },
            { label: 'Cảnh báo sắp hạn', desc: 'Badge màu vàng khi đến kỳ đóng phí trong vòng 60 ngày' },
            { label: 'Trạng thái', desc: '"Đang đóng" (xanh teal), "Đã đóng đủ" (xanh lá), "Đã hủy" (xám)' },
            { label: 'Tổng bảo hiểm', desc: 'Stat card hiển thị tổng giá trị được bảo vệ của tất cả hợp đồng' },
            { label: 'Tổng đã đóng', desc: 'Tính = phí năm × số năm đã đóng; đưa vào tài sản trong Dashboard' },
            { label: 'Sản phẩm', desc: 'Dropdown danh sách sản phẩm có sẵn hoặc tự nhập tên tùy chỉnh' },
          ]}
        />

        <ChannelCard
          id="subscriptions"
          icon={<Repeat className="size-4" style={{ color: '#D4A843' }} />}
          title="Dịch vụ đăng ký (/subscriptions)"
          accent="#D4A843"
          bg="#FDF4E0"
          items={[
            { label: 'Danh mục', desc: 'AI, Career, Education, Design, Entertainment, Office, Utility — hiển thị theo nhóm' },
            { label: 'Chi phí', desc: 'Hiển thị chi phí tháng và năm (quy đổi VND theo tỉ giá từ Cài đặt)' },
            { label: 'Countdown', desc: 'Badge "Còn X ngày" → màu vàng khi ≤30 ngày; màu xám khi còn nhiều' },
            { label: 'Thêm mới', desc: 'Nhập tên dịch vụ, danh mục, số tiền/tháng, đơn vị tiền (VND/USD), ngày gia hạn tiếp' },
            { label: 'Tần suất', desc: 'Monthly hoặc Yearly — ảnh hưởng đến cách tính chi phí năm' },
            { label: 'Nhà cung cấp', desc: 'Dropdown gợi ý: OpenAI, Google, Coursera, LinkedIn, Udemy...' },
          ]}
        />

        <ChannelCard
          id="cash"
          icon={<Wallet className="size-4" style={{ color: '#5BA4A4' }} />}
          title="Tiền mặt (/cash)"
          accent="#5BA4A4"
          bg="#E0F2EE"
          items={[
            { label: 'Snapshot', desc: 'Ghi nhận số dư tài khoản ngân hàng tại một thời điểm — không tự động cập nhật' },
            { label: 'Cập nhật nhanh', desc: 'Click "Cập nhật" trên thẻ ngân hàng → nhập số dư mới, ngày = hôm nay' },
            { label: 'Cảnh báo cũ', desc: 'Badge "Chưa cập nhật" màu vàng nếu snapshot cuối cùng >30 ngày trước' },
            { label: 'Xu hướng', desc: 'Mũi tên ↑ (xanh) hoặc ↓ (đỏ) so sánh snapshot mới nhất với tháng trước' },
            { label: 'Tài khoản', desc: 'Dropdown: TCB Business, Techcombank, VPBank, MB Bank, Sacombank...' },
            { label: 'Lịch sử', desc: 'Mỗi lần cập nhật tạo snapshot mới; giữ toàn bộ lịch sử để thấy xu hướng' },
          ]}
        />

        <ChannelCard
          id="loan"
          icon={<CreditCard className="size-4" style={{ color: '#EF4444' }} />}
          title="Khoản vay (/loan)"
          accent="#EF4444"
          bg="#FDECEC"
          items={[
            { label: 'Nhiều khoản vay', desc: 'Quản lý từng khoản vay riêng biệt với tiến độ trả nợ độc lập' },
            { label: 'Thêm khoản vay', desc: 'Nhập tên, số tiền gốc ban đầu, lãi suất (%/năm), số năm, ngày bắt đầu' },
            { label: 'Thêm thanh toán', desc: 'Click "Thêm thanh toán" → app ước tính lãi tháng = dư nợ × (lãi/12)' },
            { label: 'Tiến độ', desc: 'Thanh tiến độ = % gốc đã trả / gốc ban đầu; hiển thị số dư nợ còn lại' },
            { label: 'Tổng hợp', desc: 'Stat cards: tổng dư nợ, tổng gốc đã trả, tổng lãi đã trả' },
            { label: 'Dashboard', desc: 'Tổng dư nợ được trừ vào Tài sản ròng để tính Net Worth chính xác' },
          ]}
        />

      </div>
    </section>
  )
}
