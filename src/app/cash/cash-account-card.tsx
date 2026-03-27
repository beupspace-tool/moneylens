"use client"

import { Zap, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatVND, formatShortVND, formatDate } from '@/lib/format'
import type { CashSnapshot } from '@/lib/types'

type Trend = 'up' | 'down' | 'flat'

export function getTrend(items: CashSnapshot[], bank: string): Trend {
  const sorted = items.filter((s) => s.bank === bank).sort((a, b) => b.snapshot_date.localeCompare(a.snapshot_date))
  const latest = sorted[0]?.amount ?? 0
  const previous = sorted[1]?.amount ?? 0
  if (latest > previous) return 'up'
  if (latest < previous) return 'down'
  return 'flat'
}

export function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
}

function TrendIcon({ trend }: { trend: Trend }) {
  if (trend === 'up') return <TrendingUp size={14} className="text-[#22C55E]" />
  if (trend === 'down') return <TrendingDown size={14} className="text-[#EF4444]" />
  return <Minus size={14} className="text-[#94A3B8]" />
}

interface CashAccountCardProps {
  acc: CashSnapshot
  allItems: CashSnapshot[]
  totalCash: number
  onQuickUpdate: (bank: string) => void
}

export function CashAccountCard({ acc, allItems, totalCash, onQuickUpdate }: CashAccountCardProps) {
  const days = daysSince(acc.snapshot_date)
  const stale = days > 30
  const trend = getTrend(allItems, acc.bank)

  return (
    <div className="rounded-xl bg-white shadow-sm p-5" style={{ borderLeft: '4px solid #1B2A4A' }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[#64748B]">{acc.bank}</p>
          <p className="mt-1 text-2xl font-extrabold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
            {formatShortVND(acc.amount)}
          </p>
          <p className="mt-0.5 text-xs text-[#64748B]">{formatVND(acc.amount)}</p>
        </div>
        <TrendIcon trend={trend} />
      </div>

      {/* Staleness */}
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        <span className="text-xs text-[#64748B]">
          Cập nhật {days === 0 ? 'hôm nay' : `${days} ngày trước`}
          {acc.snapshot_date ? ` (${formatDate(acc.snapshot_date)})` : ''}
        </span>
        {stale && (
          <span className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold bg-[#FDF4E0] text-[#D4A843]">
            Chưa cập nhật
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 rounded-full bg-[#E2E8F0]">
        <div className="h-1.5 rounded-full transition-all"
          style={{ width: `${totalCash > 0 ? (acc.amount / totalCash) * 100 : 0}%`, backgroundColor: '#008080' }} />
      </div>
      <div className="mt-1 flex items-center justify-between">
        <p className="text-xs font-semibold text-[#008080]">
          {totalCash > 0 ? ((acc.amount / totalCash) * 100).toFixed(1) : '0.0'}%
        </p>
        <button
          onClick={() => onQuickUpdate(acc.bank)}
          className="flex items-center gap-1 text-xs text-[#1B2A4A] hover:text-[#008080] font-semibold transition-colors"
          title="Cập nhật nhanh">
          <Zap size={11} /> Cập nhật nhanh
        </button>
      </div>
    </div>
  )
}
