import {
  LayoutDashboard, Coins, TrendingUp, PiggyBank, DollarSign,
  Shield, Repeat, Wallet, CreditCard, Upload, Settings, BookOpen,
} from 'lucide-react'
import { GuideQuickStart } from './guide-quick-start'
import { GuideInvestmentChannels } from './guide-investment-channels'
import { GuideOtherChannels } from './guide-other-channels'
import { GuideFeatures } from './guide-features'

// Table of contents entries for anchor navigation
const TOC = [
  { href: '#quick-start', label: 'Bắt đầu nhanh', icon: LayoutDashboard, color: '#D4A843' },
  { href: '#investment-channels', label: 'Kênh đầu tư', icon: TrendingUp, color: '#008080' },
  { href: '#gold', label: '↳ Vàng', icon: Coins, color: '#D4A843' },
  { href: '#funds', label: '↳ Chứng chỉ quỹ', icon: TrendingUp, color: '#008080' },
  { href: '#savings', label: '↳ Tiết kiệm', icon: PiggyBank, color: '#1B2A4A' },
  { href: '#usd', label: '↳ USD', icon: DollarSign, color: '#22C55E' },
  { href: '#other-channels', label: 'Quản lý tài chính', icon: Wallet, color: '#1B2A4A' },
  { href: '#insurance', label: '↳ Bảo hiểm', icon: Shield, color: '#1B2A4A' },
  { href: '#subscriptions', label: '↳ Subscriptions', icon: Repeat, color: '#D4A843' },
  { href: '#cash', label: '↳ Tiền mặt', icon: Wallet, color: '#5BA4A4' },
  { href: '#loan', label: '↳ Khoản vay', icon: CreditCard, color: '#EF4444' },
  { href: '#dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#008080' },
  { href: '#import', label: 'Import Excel', icon: Upload, color: '#1B2A4A' },
  { href: '#settings', label: 'Cài đặt', icon: Settings, color: '#D4A843' },
  { href: '#crud', label: 'Thêm / Sửa / Xóa', icon: BookOpen, color: '#008080' },
  { href: '#data-note', label: 'Mẹo & Lưu ý', icon: BookOpen, color: '#D4A843' },
]

export default function GuidePage() {
  return (
    <div className="space-y-10">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-[#EBF0F7]">
            <BookOpen className="size-5 text-[#1B2A4A]" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-[#1B2A4A] font-[family-name:var(--font-nunito)] tracking-tight">
              Hướng dẫn sử dụng
            </h1>
            <p className="text-sm text-[#64748B] mt-0.5">
              Hướng dẫn đầy đủ tất cả tính năng MoneyLens
            </p>
          </div>
        </div>
      </div>

      {/* Table of contents */}
      <div className="rounded-xl bg-white shadow-sm overflow-hidden" style={{ borderLeft: '4px solid #D4A843' }}>
        <div className="px-4 pt-4 pb-2">
          <p className="text-sm font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
            Mục lục
          </p>
        </div>
        <div className="px-4 pb-4 flex flex-wrap gap-2">
          {TOC.map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors hover:opacity-80"
                style={{
                  backgroundColor: `${item.color}18`,
                  color: item.color,
                  border: `1px solid ${item.color}30`,
                }}
              >
                <Icon className="size-3" />
                {item.label}
              </a>
            )
          })}
        </div>
      </div>

      {/* Content sections */}
      <GuideQuickStart />
      <GuideInvestmentChannels />
      <GuideOtherChannels />
      <GuideFeatures />
    </div>
  )
}
