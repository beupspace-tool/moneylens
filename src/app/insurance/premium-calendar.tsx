"use client"

import { formatVND } from '@/lib/format'
import type { InsurancePolicy } from '@/lib/types'
import { getNextDueDate } from './insurance-policy-card'

interface CalendarEntry {
  month: number
  monthName: string
  policies: { name: string; dueDate: Date; amount: number; daysLeft: number }[]
  total: number
}

const MONTH_NAMES = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12']

function buildCalendar(policies: InsurancePolicy[]): CalendarEntry[] {
  const active = policies.filter(p => (p.status ?? 'active') === 'active')
  const entries: CalendarEntry[] = MONTH_NAMES.map((name, i) => ({
    month: i,
    monthName: name,
    policies: [],
    total: 0,
  }))

  for (const p of active) {
    const nextDue = getNextDueDate(p.start_date)
    const month = nextDue.getMonth()
    const daysLeft = Math.ceil((nextDue.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    entries[month].policies.push({
      name: p.product_name,
      dueDate: nextDue,
      amount: p.annual_premium,
      daysLeft,
    })
    entries[month].total += p.annual_premium
  }

  return entries.filter(e => e.policies.length > 0)
}

interface Props {
  policies: InsurancePolicy[]
}

export function PremiumCalendar({ policies }: Props) {
  const calendar = buildCalendar(policies)
  if (calendar.length === 0) return null

  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#E2E8F0]">
        <h2 className="text-base font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
          Lịch đóng phí
        </h2>
      </div>
      <div className="p-5">
        <div className="space-y-3">
          {calendar.map((entry) => {
            const isUpcoming = entry.policies.some(p => p.daysLeft >= 0 && p.daysLeft <= 60)
            return (
              <div key={entry.month} className="flex items-start gap-4">
                {/* Month label */}
                <div className="w-10 shrink-0 text-center">
                  <span className={`text-sm font-bold ${isUpcoming ? 'text-[#D4A843]' : 'text-[#1B2A4A]'}`}>
                    {entry.monthName}
                  </span>
                </div>

                {/* Timeline dot + line */}
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-3 h-3 rounded-full mt-1 ${isUpcoming ? 'bg-[#D4A843]' : 'bg-[#008080]'}`} />
                  <div className="w-0.5 flex-1 bg-[#E2E8F0] mt-1" />
                </div>

                {/* Policy details */}
                <div className="flex-1 pb-3">
                  {entry.policies.map((p, i) => (
                    <div key={i} className="flex justify-between items-baseline text-sm mb-1">
                      <div>
                        <span className="text-[#1B2A4A]">{p.name}</span>
                        <span className="text-xs text-[#94A3B8] ml-2">
                          {p.dueDate.toLocaleDateString('vi-VN')}
                        </span>
                        {p.daysLeft >= 0 && p.daysLeft <= 60 && (
                          <span className="text-xs font-semibold text-[#D4A843] ml-1">
                            ({p.daysLeft}d)
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-[#1B2A4A] shrink-0 ml-2">
                        {formatVND(p.amount)}
                      </span>
                    </div>
                  ))}
                  {entry.policies.length > 1 && (
                    <div className="flex justify-between text-xs text-[#64748B] border-t border-[#F1F5F9] pt-1 mt-1">
                      <span>Tổng tháng</span>
                      <span className="font-semibold">{formatVND(entry.total)}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
