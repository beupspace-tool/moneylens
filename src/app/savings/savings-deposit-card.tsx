"use client"

import { Pencil, Trash2, RefreshCw } from 'lucide-react'
import { formatVND, formatDate, formatPercent } from '@/lib/format'
import type { SavingsDeposit } from '@/lib/types'

function calcProgress(start: string, end: string): number {
  const s = new Date(start).getTime()
  const e = new Date(end).getTime()
  const now = Date.now()
  return Math.round(Math.min(100, Math.max(0, ((now - s) / (e - s)) * 100)))
}

function calcAccruedInterest(s: SavingsDeposit): number {
  const daysElapsed = Math.max(0, Math.floor((Date.now() - new Date(s.start_date).getTime()) / 86400000))
  return Math.round(s.amount * (s.interest_rate / 100) * (daysElapsed / 365))
}

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

interface DepositCardProps {
  deposit: SavingsDeposit
  onEdit: (d: SavingsDeposit) => void
  onDelete: (id: string) => void
  onRenew?: (d: SavingsDeposit) => void
}

export function SavingsDepositCard({ deposit: d, onEdit, onDelete, onRenew }: DepositCardProps) {
  const isMatured = d.status === 'matured' || daysUntil(d.end_date) <= 0
  const progress = calcProgress(d.start_date, d.end_date)
  const days = daysUntil(d.end_date)
  const accrued = calcAccruedInterest(d)

  return (
    <div className="rounded-xl bg-white shadow-sm p-5 relative" style={{ borderLeft: `4px solid ${isMatured ? '#94A3B8' : '#1B2A4A'}` }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">{d.bank}</p>
          <p className="text-sm text-[#64748B] mt-0.5">{formatVND(d.amount)} · {d.period_months} tháng</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-right mr-2">
            <span className="text-lg font-extrabold text-[#D4A843] font-[family-name:var(--font-nunito)]">
              {formatPercent(d.interest_rate)}
            </span>
            <p className="text-xs text-[#64748B]">lãi suất</p>
          </div>
          {isMatured && onRenew && (
            <button onClick={() => onRenew(d)} title="Tái tục"
              className="flex items-center gap-1 px-2 py-1 rounded border border-[#008080] text-[#008080] text-xs font-semibold hover:bg-[#E0F2EE] transition-colors mr-1">
              <RefreshCw size={12} /> Tái tục
            </button>
          )}
          <button onClick={() => onEdit(d)} title="Chỉnh sửa"
            className="p-1.5 rounded hover:bg-[#E0F2EE] text-teal-600 transition-colors">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(d.id)} title="Xóa"
            className="p-1.5 rounded hover:bg-[#FDECEC] text-red-500 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div className="mt-4 space-y-1.5">
        <div className="flex justify-between text-xs text-[#64748B]">
          <span>{formatDate(d.start_date)}</span>
          <span className="font-semibold text-[#008080]">{progress}%</span>
          <span>{formatDate(d.end_date)}</span>
        </div>
        <div className="h-2 rounded-full bg-[#E2E8F0]">
          <div className="h-2 rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: isMatured ? '#94A3B8' : '#008080' }} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#64748B]">
            Lãi: {formatVND(d.expected_interest)}
            {!isMatured && accrued > 0 && (
              <span className="ml-1 font-semibold text-[#008080]">(tích lũy: {formatVND(accrued)})</span>
            )}
          </span>
          {isMatured ? (
            <span className="text-xs font-semibold rounded px-2 py-0.5 bg-[#F1F5F9] text-[#64748B]">Đã đáo hạn</span>
          ) : (
            <span className="text-xs text-[#64748B]">Còn {days} ngày</span>
          )}
        </div>
      </div>
    </div>
  )
}
