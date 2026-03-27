import { Coins, TrendingUp, PiggyBank } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatShortVND, formatPercent } from '@/lib/format'
import type { GoldHolding, FundTransaction, SavingsDeposit } from '@/lib/types'

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs text-[#64748B]">
      <span>{label}</span>
      <span className="font-semibold text-[#1B2A4A]">{value}</span>
    </div>
  )
}

function PnlRow({ profit, profitPct }: { profit: number; profitPct: number }) {
  const pos = profit >= 0
  return (
    <div className="flex justify-between text-xs">
      <span className="text-[#64748B]">Lãi/lỗ</span>
      <span className={`font-bold ${pos ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
        {pos ? '+' : ''}{formatShortVND(profit)} ({pos ? '+' : ''}{formatPercent(profitPct, 1)})
      </span>
    </div>
  )
}

export function GoldCard({ items, goldPricePerChi }: { items: GoldHolding[]; goldPricePerChi: number }) {
  const cost = items.reduce((s, g) => s + g.amount_vnd, 0)
  const totalChi = items.reduce((s, g) => s + g.qty_chi, 0)
  const current = totalChi * goldPricePerChi
  const profit = current - cost
  const profitPct = cost > 0 ? (profit / cost) * 100 : 0

  return (
    <Card className="shadow-sm border-0 overflow-hidden" style={{ borderLeft: '4px solid #D4A843' }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
          <Coins className="h-4 w-4 text-[#D4A843]" /> Vàng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <DetailRow label="Số lượng" value={`${totalChi} chỉ`} />
        <DetailRow label="Giá vốn" value={formatShortVND(cost)} />
        <DetailRow label="Giá trị hiện tại" value={formatShortVND(current)} />
        <div className="h-px bg-[#E2E8F0]" />
        <PnlRow profit={profit} profitPct={profitPct} />
      </CardContent>
    </Card>
  )
}

export function FundCard({ items, fundNavs }: { items: FundTransaction[]; fundNavs: Record<string, number> }) {
  const byCode: Record<string, { netQty: number; invested: number }> = {}
  for (const f of items) {
    if (!byCode[f.fund_code]) byCode[f.fund_code] = { netQty: 0, invested: 0 }
    const isBuy = (f.transaction_type ?? 'buy') === 'buy'
    byCode[f.fund_code].netQty += isBuy ? (f.qty_units ?? 0) : -(f.qty_units ?? 0)
    byCode[f.fund_code].invested += isBuy ? f.amount_vnd : -f.amount_vnd
  }
  let totalInvested = 0
  let currentValue = 0
  for (const [code, { netQty, invested }] of Object.entries(byCode)) {
    totalInvested += invested
    const nav = fundNavs[code]
    currentValue += nav != null ? netQty * nav : invested
  }
  const profit = currentValue - totalInvested
  const profitPct = totalInvested > 0 ? (profit / totalInvested) * 100 : 0
  const fundCount = Object.keys(byCode).length

  return (
    <Card className="shadow-sm border-0 overflow-hidden" style={{ borderLeft: '4px solid #008080' }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
          <TrendingUp className="h-4 w-4 text-[#008080]" /> CCQ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <DetailRow label="Vốn đầu tư" value={formatShortVND(totalInvested)} />
        <DetailRow label="Giá trị hiện tại" value={formatShortVND(currentValue)} />
        <DetailRow label="Số quỹ" value={`${fundCount} quỹ`} />
        <div className="h-px bg-[#E2E8F0]" />
        <PnlRow profit={profit} profitPct={profitPct} />
      </CardContent>
    </Card>
  )
}

export function SavingsCard({ items }: { items: SavingsDeposit[] }) {
  const active = items.filter((d) => d.status === 'active')
  const totalActive = active.reduce((s, d) => s + d.amount, 0)
  const accruedInterest = active.reduce((s, d) => {
    const start = new Date(d.start_date).getTime()
    const end = new Date(d.end_date).getTime()
    const now = Date.now()
    const elapsed = Math.max(0, Math.min(now - start, end - start))
    const total = end - start
    return s + (total > 0 ? (elapsed / total) * d.expected_interest : 0)
  }, 0)
  const today = new Date().toISOString().slice(0, 10)
  const nearest = active
    .filter((d) => d.end_date > today)
    .sort((a, b) => a.end_date.localeCompare(b.end_date))[0]
  const daysLeft = nearest
    ? Math.ceil((new Date(nearest.end_date).getTime() - Date.now()) / 86400000)
    : null

  return (
    <Card className="shadow-sm border-0 overflow-hidden" style={{ borderLeft: '4px solid #1B2A4A' }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
          <PiggyBank className="h-4 w-4 text-[#1B2A4A]" /> Tiết kiệm
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <DetailRow label="Tổng đang gửi" value={formatShortVND(totalActive)} />
        <DetailRow label="Lãi tích lũy (ước)" value={formatShortVND(Math.round(accruedInterest))} />
        <DetailRow label="Số kỳ hạn" value={`${active.length} khoản`} />
        <div className="h-px bg-[#E2E8F0]" />
        {nearest ? (
          <div className="rounded-md bg-[#E0F2EE] p-2">
            <p className="text-[10px] text-[#008080] font-semibold mb-0.5">Đáo hạn gần nhất</p>
            <p className="text-xs font-bold text-[#1B2A4A]">{nearest.end_date.split('-').reverse().join('/')}</p>
            <p className="text-[10px] text-[#008080]">
              {daysLeft !== null && daysLeft > 0 ? `còn ${daysLeft} ngày` : daysLeft === 0 ? 'hôm nay' : 'đã đáo hạn'}
            </p>
          </div>
        ) : (
          <p className="text-[10px] text-[#64748B]">Không có khoản sắp đáo hạn</p>
        )}
      </CardContent>
    </Card>
  )
}
