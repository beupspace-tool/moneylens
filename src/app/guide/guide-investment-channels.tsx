import { Coins, TrendingUp, PiggyBank, DollarSign } from 'lucide-react'
import { SectionHeader, ChannelCard } from './guide-quick-start'

// Investment channels: Vàng, CCQ, Tiết kiệm, USD
export function GuideInvestmentChannels() {
  return (
    <section id="investment-channels">
      <SectionHeader title="Các kênh đầu tư" accent="#D4A843" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <ChannelCard
          id="gold"
          icon={<Coins className="size-4" style={{ color: '#D4A843' }} />}
          title="Vàng (/gold)"
          accent="#D4A843"
          bg="#FDF4E0"
          items={[
            { label: 'Xem danh sách', desc: 'Tất cả lần mua vàng, tên tự sinh từ số chỉ (vd: 2 chỉ, 1 cây 2 chỉ)' },
            { label: 'Thêm mới', desc: 'Click "Thêm mới" → nhập số chỉ, đơn giá → thành tiền tự tính (hoặc ngược lại)' },
            { label: 'Cập nhật giá', desc: 'Click icon bút chì cạnh "Giá hiện tại" → nhập giá mới → Enter để lưu' },
            { label: 'Lãi/Lỗ', desc: 'So sánh giá mua với giá hiện tại; màu xanh = lãi, đỏ = lỗ' },
            { label: 'Sửa/Xóa', desc: 'Icon bút chì (teal) = sửa; icon thùng rác (đỏ) = xóa có xác nhận' },
            { label: 'Nơi mua', desc: 'Dropdown: Rồng Vàng, DOJI, PNJ, SJC, Phú Quý, Bảo Tín Minh Châu...' },
          ]}
        />

        <ChannelCard
          id="funds"
          icon={<TrendingUp className="size-4" style={{ color: '#008080' }} />}
          title="Chứng chỉ quỹ (/funds)"
          accent="#008080"
          bg="#E0F2EE"
          items={[
            { label: '2 chế độ xem', desc: '"Tổng hợp" = gom theo mã quỹ, tính lãi/lỗ; "Chi tiết" = từng giao dịch riêng lẻ' },
            { label: 'Tổng hợp', desc: 'Hiển thị tổng CCQ, NAV trung bình, giá trị hiện tại và % lãi/lỗ mỗi quỹ' },
            { label: 'Thêm giao dịch', desc: 'Chọn Mã quỹ, Loại (Mua/Bán), số tiền VND, số CCQ, NAV và ngày giao dịch' },
            { label: 'NAV hiện tại', desc: 'Lấy từ Cài đặt → Giá thị trường; cập nhật ở đó để tính lãi/lỗ chính xác' },
            { label: 'Quỹ hỗ trợ', desc: 'DCDS, DCDE, DCBF (Dragon Capital); VCBF-TBF, VCBF-BCF, VCBF-FIF (Vietcombank); TCFIN; VEOF' },
            { label: 'Loại quỹ', desc: 'Màu phân biệt: Cổ phiếu (xanh navy), Cân bằng (teal), Trái phiếu (vàng)' },
          ]}
        />

        <ChannelCard
          id="savings"
          icon={<PiggyBank className="size-4" style={{ color: '#1B2A4A' }} />}
          title="Tiết kiệm (/savings)"
          accent="#1B2A4A"
          bg="#EBF0F7"
          items={[
            { label: '2 trạng thái', desc: '"Đang gửi" = chưa đáo hạn (thẻ xanh); "Đã đáo hạn" = quá hạn (thẻ xám)' },
            { label: 'Thêm mới', desc: 'Nhập ngân hàng, số tiền, kỳ hạn (tháng), lãi suất → ngày đáo hạn tự tính' },
            { label: 'Thanh tiến độ', desc: 'Hiển thị % thời gian đã gửi trên tổng kỳ hạn' },
            { label: 'Lãi tích lũy', desc: 'Tính theo số ngày đã gửi thực tế; lãi dự kiến = vốn × lãi/100 × (tháng/12)' },
            { label: 'Tái tục', desc: 'Click "Tái tục" trên sổ đáo hạn → form điền sẵn cùng thông tin, ngày gửi = hôm nay' },
            { label: 'Ngân hàng', desc: 'Dropdown: Vietcombank, Techcombank, BIDV, VPBank, MB Bank, ACB...' },
          ]}
        />

        <ChannelCard
          id="usd"
          icon={<DollarSign className="size-4" style={{ color: '#22C55E' }} />}
          title="USD (/usd)"
          accent="#22C55E"
          bg="#DCFCE7"
          items={[
            { label: 'Mục đích', desc: 'Theo dõi thu nhập ngoại tệ (Upwork, Freelance, Chuyển khoản...)' },
            { label: '2 trạng thái', desc: '"Đang giữ" = tính vào tài sản theo tỉ giá hiện tại; "Đã đổi sang VND" = ẩn khỏi tổng tài sản' },
            { label: 'Tỉ giá', desc: 'Lấy từ Cài đặt → Tỉ giá USD/VND; cập nhật ở đó để thấy lãi/lỗ tỉ giá' },
            { label: 'Lãi/Lỗ tỉ giá', desc: 'Tính = số USD × (tỉ giá hiện tại − tỉ giá lúc nhận); màu xanh = lãi, đỏ = lỗ' },
            { label: 'Tỉ giá TB', desc: 'Tự động tính theo trọng số các giao dịch đang giữ' },
            { label: 'Nguồn', desc: 'Dropdown: Upwork, Freelance, Chuyển khoản, Khác' },
          ]}
        />

      </div>
    </section>
  )
}
