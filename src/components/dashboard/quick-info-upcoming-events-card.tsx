import { Bell } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatShortVND, formatDate } from '@/lib/format'
import type { SavingsDeposit, InsurancePolicy } from '@/lib/types'

interface UpcomingEvent {
  label: string
  date: string
  type: 'savings' | 'insurance'
  amount?: number
}

interface UpcomingEventsCardProps {
  savingsItems: SavingsDeposit[]
  insuranceItems: InsurancePolicy[]
}

export function UpcomingEventsCard({ savingsItems, insuranceItems }: UpcomingEventsCardProps) {
  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)
  const cutoff = new Date(today)
  cutoff.setDate(cutoff.getDate() + 60)
  const cutoffStr = cutoff.toISOString().slice(0, 10)

  const events: UpcomingEvent[] = []

  // Savings maturities in next 60 days
  savingsItems
    .filter((d) => d.status === 'active' && d.end_date >= todayStr && d.end_date <= cutoffStr)
    .forEach((d) =>
      events.push({ label: `TK ${d.bank}`, date: d.end_date, type: 'savings', amount: d.amount })
    )

  // Insurance annual dues in next 60 days
  insuranceItems
    .filter((p) => (p.status ?? 'active') === 'active')
    .forEach((p) => {
      const start = new Date(p.start_date)
      const nextAnniv = new Date(start)
      nextAnniv.setFullYear(today.getFullYear())
      if (nextAnniv.toISOString().slice(0, 10) < todayStr) {
        nextAnniv.setFullYear(today.getFullYear() + 1)
      }
      const dateStr = nextAnniv.toISOString().slice(0, 10)
      if (dateStr <= cutoffStr) {
        events.push({ label: p.product_name, date: dateStr, type: 'insurance', amount: p.annual_premium })
      }
    })

  events.sort((a, b) => a.date.localeCompare(b.date))

  return (
    <Card className="shadow-sm border-0 overflow-hidden" style={{ borderLeft: '4px solid #F59E0B' }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
          <Bell className="h-4 w-4 text-[#F59E0B]" /> Sắp đến hạn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {events.length === 0 ? (
          <p className="text-xs text-[#64748B]">Không có sự kiện trong 60 ngày tới</p>
        ) : (
          <div className="space-y-2">
            {events.slice(0, 5).map((ev, i) => {
              const daysLeft = Math.ceil(
                (new Date(ev.date).getTime() - today.getTime()) / 86400000
              )
              return (
                <div key={i} className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#1B2A4A] truncate">{ev.label}</p>
                    <p className="text-[10px] text-[#64748B]">{formatDate(ev.date)}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-0.5">
                    <span className="inline-block rounded-full bg-[#FEF3C7] text-[#D97706] text-[10px] font-bold px-2 py-0.5">
                      {daysLeft === 0 ? 'Hôm nay' : `${daysLeft}d`}
                    </span>
                    {ev.amount != null && (
                      <span className="text-[10px] text-[#64748B]">{formatShortVND(ev.amount)}</span>
                    )}
                  </div>
                </div>
              )
            })}
            {events.length > 5 && (
              <p className="text-[10px] text-[#64748B]">+{events.length - 5} sự kiện khác</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
