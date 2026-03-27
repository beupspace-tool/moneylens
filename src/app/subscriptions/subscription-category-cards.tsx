"use client"

import { formatUSD } from '@/lib/format'
import type { Subscription } from '@/lib/types'

const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  AI:            { bg: '#EBF0F7', text: '#1B2A4A' },
  Career:        { bg: '#E0F2EE', text: '#008080' },
  Education:     { bg: '#FDF4E0', text: '#D4A843' },
  Design:        { bg: '#E0F2EE', text: '#008080' },
  Entertainment: { bg: '#FDECEC', text: '#EF4444' },
  Office:        { bg: '#EBF0F7', text: '#1B2A4A' },
  Utility:       { bg: '#EBF0F7', text: '#64748B' },
}

interface Props {
  byCategory: Record<string, { items: Subscription[]; total: number }>
}

export function SubscriptionCategoryCards({ byCategory }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(byCategory).map(([category, data]) => {
        const style = CATEGORY_STYLES[category] ?? { bg: '#EBF0F7', text: '#1B2A4A' }
        return (
          <div key={category} className="rounded-xl bg-white shadow-sm overflow-hidden" style={{ borderLeft: '4px solid #D4A843' }}>
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
              <span className="inline-block rounded px-2 py-0.5 text-xs font-semibold" style={{ backgroundColor: style.bg, color: style.text }}>
                {category}
              </span>
              <span className="text-sm font-bold text-[#D4A843]">{formatUSD(data.total)}/mo</span>
            </div>
            <div className="px-4 pb-4 space-y-1">
              {data.items.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between text-sm">
                  <span className="text-[#1B2A4A]">{sub.name}</span>
                  <span className="text-[#64748B]">{formatUSD(sub.amount_per_month)}/mo</span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { CATEGORY_STYLES }
