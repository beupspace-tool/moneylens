import { CreditCard, Repeat } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatShortVND, formatUSD } from '@/lib/format'
import type { Loan, Subscription, SavingsDeposit, InsurancePolicy, UsdTransaction } from '@/lib/types'
import { UpcomingEventsCard } from './quick-info-upcoming-events-card'

interface QuickInfoCardsProps {
  loans: Loan[]
  subItems: Subscription[]
  savingsItems: SavingsDeposit[]
  insuranceItems: InsurancePolicy[]
  usdItems: UsdTransaction[]
  totalUsdHolding: number
  usdRate: number
}

function LoanCard({ loans }: { loans: Loan[] }) {
  const totalDebt = loans.reduce((s, l) => s + (l.remaining_balance ?? 0), 0)
  const totalOriginal = loans.reduce((s, l) => s + (l.original_principal ?? 0), 0)
  const totalPaid = loans.reduce((s, l) => s + (l.total_principal_paid ?? 0), 0)
  const progress = totalOriginal > 0 ? (totalPaid / totalOriginal) * 100 : 0

  const monthlyEst = loans.reduce((s, l) => {
    if (!l.remaining_balance || !l.interest_rate || !l.term_years) return s
    const r = l.interest_rate / 100 / 12
    const n = l.term_years * 12
    if (r === 0) return s + l.remaining_balance / n
    return s + (l.remaining_balance * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  }, 0)

  return (
    <Card className="shadow-sm border-0 overflow-hidden" style={{ borderLeft: '4px solid #EF4444' }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
          <CreditCard className="h-4 w-4 text-[#EF4444]" /> Khoản vay
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-xs text-[#64748B]">
          <span>Dư nợ còn lại</span>
          <span className="font-bold text-[#EF4444]">{formatShortVND(totalDebt)}</span>
        </div>
        <div className="flex justify-between text-xs text-[#64748B]">
          <span>Trả gốc / tháng (ước)</span>
          <span className="font-semibold text-[#1B2A4A]">{formatShortVND(Math.round(monthlyEst))}</span>
        </div>
        <div className="flex justify-between text-xs text-[#64748B]">
          <span>Số khoản vay</span>
          <span className="font-semibold text-[#1B2A4A]">{loans.length} khoản</span>
        </div>
        <div className="h-px bg-[#E2E8F0]" />
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-[#64748B]">
            <span>Tiến độ trả nợ</span>
            <span className="font-semibold text-[#1B2A4A]">{progress.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#EBF0F7]">
            <div className="h-full rounded-full bg-[#EF4444]" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SubscriptionsCard({ items, usdRate }: { items: Subscription[]; usdRate: number }) {
  const ongoing = items.filter((s) => s.status === 'Ongoing')
  const monthlyUsd = ongoing.reduce((s, sub) => s + (sub.amount_per_month ?? 0), 0)
  const annualVnd = monthlyUsd * 12 * usdRate
  const today = new Date().toISOString().slice(0, 10)
  const nextSub = ongoing
    .filter((s) => s.end_date && s.end_date > today)
    .sort((a, b) => a.end_date.localeCompare(b.end_date))[0]

  return (
    <Card className="shadow-sm border-0 overflow-hidden" style={{ borderLeft: '4px solid #D4A843' }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
          <Repeat className="h-4 w-4 text-[#D4A843]" /> Subscriptions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-xs text-[#64748B]">
          <span>Chi phí / tháng</span>
          <span className="font-bold text-[#D4A843]">{formatUSD(monthlyUsd)}</span>
        </div>
        <div className="flex justify-between text-xs text-[#64748B]">
          <span>Ước tính / năm (VND)</span>
          <span className="font-semibold text-[#1B2A4A]">{formatShortVND(Math.round(annualVnd))}</span>
        </div>
        <div className="flex justify-between text-xs text-[#64748B]">
          <span>Đang sử dụng</span>
          <span className="font-semibold text-[#1B2A4A]">{ongoing.length} dịch vụ</span>
        </div>
        <div className="h-px bg-[#E2E8F0]" />
        {nextSub ? (
          <div className="rounded-md bg-[#FDF4E0] p-2">
            <p className="text-[10px] text-[#D4A843] font-semibold mb-0.5">Gia hạn tiếp theo</p>
            <p className="text-xs font-bold text-[#1B2A4A] truncate">{nextSub.name}</p>
            <p className="text-[10px] text-[#64748B]">{nextSub.end_date.split('-').reverse().join('/')}</p>
          </div>
        ) : (
          <p className="text-[10px] text-[#64748B]">Không có lịch gia hạn sắp tới</p>
        )}
      </CardContent>
    </Card>
  )
}

export function QuickInfoCards({
  loans,
  subItems,
  savingsItems,
  insuranceItems,
  usdRate,
}: QuickInfoCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <LoanCard loans={loans} />
      <SubscriptionsCard items={subItems} usdRate={usdRate} />
      <UpcomingEventsCard savingsItems={savingsItems} insuranceItems={insuranceItems} />
    </div>
  )
}
