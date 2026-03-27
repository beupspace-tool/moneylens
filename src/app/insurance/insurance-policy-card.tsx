"use client"

import { Pencil, Trash2 } from 'lucide-react'
import { formatVND, formatShortVND } from '@/lib/format'
import type { InsurancePolicy } from '@/lib/types'
import { INSURANCE_STATUSES } from '@/lib/constants'

export function getNextDueDate(startDate: string): Date {
  const start = new Date(startDate)
  const now = new Date()
  const nextDue = new Date(start)
  nextDue.setFullYear(now.getFullYear())
  if (nextDue < now) nextDue.setFullYear(now.getFullYear() + 1)
  return nextDue
}

function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

function StatusBadge({ status }: { status?: string }) {
  const found = INSURANCE_STATUSES.find(s => s.value === status)
  const label = found?.label ?? 'Đang đóng'
  const styles: Record<string, string> = {
    active: 'bg-[#E0F2EE] text-[#008080]',
    paid_up: 'bg-[#DCFCE7] text-[#16A34A]',
    cancelled: 'bg-[#F1F5F9] text-[#64748B]',
  }
  const cls = styles[status ?? 'active'] ?? styles.active
  return <span className={`text-xs font-semibold rounded px-2 py-0.5 ${cls}`}>{label}</span>
}

interface PolicyCardProps {
  policy: InsurancePolicy
  onEdit: (p: InsurancePolicy) => void
  onDelete: (id: string) => void
}

export function InsurancePolicyCard({ policy: p, onEdit, onDelete }: PolicyCardProps) {
  const nextDue = getNextDueDate(p.start_date)
  const daysLeft = daysUntil(nextDue)
  const isDueSoon = daysLeft >= 0 && daysLeft <= 60
  const isActive = (p.status ?? 'active') === 'active'

  return (
    <div className="rounded-xl bg-white shadow-sm p-5" style={{ borderLeft: '4px solid #008080' }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)] leading-tight">{p.product_name}</p>
          <p className="mt-0.5 text-sm text-[#64748B]">Từ {new Date(p.start_date).getFullYear()}</p>
          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
            <StatusBadge status={p.status} />
            {isDueSoon && isActive && (
              <span className="text-xs font-semibold rounded px-2 py-0.5"
                style={{ backgroundColor: '#FDF4E0', color: '#D4A843' }}>
                Sắp đến hạn ({daysLeft} ngày)
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-extrabold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">{formatShortVND(p.total_paid)}</p>
          <p className="text-xs text-[#64748B]">đã đóng</p>
        </div>
      </div>
      {p.coverage_amount && (
        <div className="mt-2 text-sm">
          <span className="text-[#64748B]">Số tiền bảo hiểm: </span>
          <span className="font-bold text-[#1B2A4A]">{formatShortVND(p.coverage_amount)}</span>
        </div>
      )}
      <div className="mt-3 flex items-center justify-between rounded-lg bg-[#F5F7FA] px-3 py-2">
        <span className="text-sm text-[#64748B]">Phí hàng năm</span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#1B2A4A]">{formatVND(p.annual_premium)}</span>
          <span className="text-xs font-semibold rounded px-2 py-0.5" style={{ backgroundColor: '#E0F2EE', color: '#008080' }}>
            {p.payment_years} lần
          </span>
        </div>
      </div>
      {isActive && (
        <p className="mt-2 text-xs text-[#64748B]">
          Đến hạn tiếp theo:{' '}
          <span className={`font-semibold ${isDueSoon ? 'text-[#D4A843]' : 'text-[#1B2A4A]'}`}>
            {nextDue.toLocaleDateString('vi-VN')}
          </span>
        </p>
      )}
      <div className="mt-2 flex justify-end gap-1">
        <button onClick={() => onEdit(p)} title="Chỉnh sửa"
          className="p-1.5 rounded hover:bg-[#E0F2EE] text-teal-600 transition-colors">
          <Pencil size={14} />
        </button>
        <button onClick={() => onDelete(p.id)} title="Xóa"
          className="p-1.5 rounded hover:bg-[#FDECEC] text-red-500 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
