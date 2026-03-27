import { DollarSign, Shield, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatShortVND, formatUSD } from '@/lib/format'
import type { UsdTransaction, InsurancePolicy, CashSnapshot } from '@/lib/types'

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs text-[#64748B]">
      <span>{label}</span>
      <span className="font-semibold text-[#1B2A4A]">{value}</span>
    </div>
  )
}

export function UsdCard({ items, usdRate }: { items: UsdTransaction[]; usdRate: number }) {
  const holding = items.filter((u) => (u.status ?? 'holding') !== 'converted')
  const totalUsd = holding.reduce((s, u) => s + u.amount_usd, 0)
  const currentVnd = totalUsd * usdRate
  const costVnd = holding.reduce((s, u) => s + u.amount_vnd_at_receipt, 0)
  const fxGain = currentVnd - costVnd
  const fxPos = fxGain >= 0

  return (
    <Card className="shadow-sm border-0 overflow-hidden" style={{ borderLeft: '4px solid #22C55E' }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
          <DollarSign className="h-4 w-4 text-[#22C55E]" /> USD
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <DetailRow label="Đang nắm giữ" value={formatUSD(totalUsd)} />
        <DetailRow label="Quy đổi VND" value={formatShortVND(currentVnd)} />
        <DetailRow label="Tỷ giá" value={`${usdRate.toLocaleString('vi-VN')} ₫`} />
        <div className="h-px bg-[#E2E8F0]" />
        <div className="flex justify-between text-xs">
          <span className="text-[#64748B]">Lãi tỷ giá</span>
          <span className={`font-bold ${fxPos ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
            {fxPos ? '+' : ''}{formatShortVND(fxGain)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export function InsuranceCard({ items }: { items: InsurancePolicy[] }) {
  const active = items.filter((p) => (p.status ?? 'active') === 'active')
  const totalPaid = items.reduce((s, p) => s + (p.total_paid ?? 0), 0)
  const today = new Date()
  const nextDue = active
    .map((p) => {
      const start = new Date(p.start_date)
      const nextAnniv = new Date(start)
      nextAnniv.setFullYear(today.getFullYear())
      if (nextAnniv <= today) nextAnniv.setFullYear(today.getFullYear() + 1)
      return { name: p.product_name, date: nextAnniv.toISOString().slice(0, 10), amount: p.annual_premium }
    })
    .sort((a, b) => a.date.localeCompare(b.date))[0]

  return (
    <Card className="shadow-sm border-0 overflow-hidden" style={{ borderLeft: '4px solid #1B2A4A' }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
          <Shield className="h-4 w-4 text-[#1B2A4A]" /> Bảo hiểm
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <DetailRow label="Tổng phí đã đóng" value={formatShortVND(totalPaid)} />
        <DetailRow label="Đang hoạt động" value={`${active.length} hợp đồng`} />
        <div className="h-px bg-[#E2E8F0]" />
        {nextDue ? (
          <div className="rounded-md bg-[#EBF0F7] p-2">
            <p className="text-[10px] text-[#1B2A4A] font-semibold mb-0.5">Đóng phí tiếp theo</p>
            <p className="text-xs font-bold text-[#1B2A4A] truncate">{nextDue.name}</p>
            <p className="text-[10px] text-[#64748B]">
              {nextDue.date.split('-').reverse().join('/')} · {formatShortVND(nextDue.amount)}
            </p>
          </div>
        ) : (
          <p className="text-[10px] text-[#64748B]">Không có hợp đồng hoạt động</p>
        )}
      </CardContent>
    </Card>
  )
}

export function CashCard({ items }: { items: CashSnapshot[] }) {
  const total = items.reduce((s, c) => s + c.amount, 0)
  const top3 = [...items].sort((a, b) => b.amount - a.amount).slice(0, 3)

  return (
    <Card className="shadow-sm border-0 overflow-hidden" style={{ borderLeft: '4px solid #5BA4A4' }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
          <Wallet className="h-4 w-4 text-[#5BA4A4]" /> Tiền mặt
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <DetailRow label="Tổng tiền mặt" value={formatShortVND(total)} />
        <DetailRow label="Số tài khoản" value={`${items.length} tài khoản`} />
        <div className="h-px bg-[#E2E8F0]" />
        <div className="space-y-1">
          {top3.map((acc) => (
            <div key={acc.id} className="flex justify-between text-[10px]">
              <span className="text-[#64748B] truncate max-w-[100px]">{acc.bank}</span>
              <span className="font-semibold text-[#1B2A4A]">{formatShortVND(acc.amount)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
