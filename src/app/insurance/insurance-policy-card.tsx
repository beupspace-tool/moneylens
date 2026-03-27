"use client"

import { useState } from 'react'
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { formatVND, formatShortVND } from '@/lib/format'
import { INSURANCE_STATUSES, INSURANCE_RELATIONSHIPS } from '@/lib/constants'
import { PolicyBenefitsSection } from './policy-benefits-section'
import type { InsurancePolicy } from '@/lib/types'

export function getNextDueDate(startDate: string): Date {
  const start = new Date(startDate)
  const now = new Date()
  const nextDue = new Date(start)
  nextDue.setFullYear(now.getFullYear())
  if (nextDue < now) nextDue.setFullYear(now.getFullYear() + 1)
  return nextDue
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

function getRelLabel(rel: string) {
  return INSURANCE_RELATIONSHIPS.find(r => r.value === rel)?.label ?? rel
}

interface Props {
  policy: InsurancePolicy
  onEdit: (p: InsurancePolicy) => void
  onDelete: (id: string) => void
}

export function InsurancePolicyCard({ policy: p, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false)
  const nextDue = getNextDueDate(p.start_date)
  const daysLeft = Math.ceil((nextDue.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const isDueSoon = daysLeft >= 0 && daysLeft <= 60
  const isActive = (p.status ?? 'active') === 'active'
  const hasDetails = (p.benefits?.length ?? 0) > 0 || (p.riders?.length ?? 0) > 0 || p.product_type

  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden" style={{ borderLeft: '4px solid #008080' }}>
      {/* Header - always visible */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)] leading-tight">
              {p.product_name}
            </p>
            <div className="mt-1 flex items-center gap-2 flex-wrap text-xs text-[#64748B]">
              {p.provider && <span>{p.provider}</span>}
              {p.provider && <span>·</span>}
              <span>Từ {new Date(p.start_date).getFullYear()}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2 flex-wrap">
              <StatusBadge status={p.status} />
              {isDueSoon && isActive && (
                <span className="text-xs font-semibold rounded px-2 py-0.5"
                  style={{ backgroundColor: '#FDF4E0', color: '#D4A843' }}>
                  Sắp đến hạn ({daysLeft} ngày)
                </span>
              )}
              {p.insured_persons && p.insured_persons.length > 0 && (
                <span className="text-xs text-[#64748B]">
                  {p.insured_persons.map(ip => getRelLabel(ip.relationship)).join(', ')}
                </span>
              )}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-extrabold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
              {formatShortVND(p.coverage_amount ?? 0)}
            </p>
            <p className="text-xs text-[#64748B]">số tiền BH</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-3 flex items-center justify-between rounded-lg bg-[#F5F7FA] px-3 py-2">
          <span className="text-sm text-[#64748B]">Phí/năm</span>
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#1B2A4A]">{formatVND(p.annual_premium)}</span>
            <span className="text-xs font-semibold rounded px-2 py-0.5 bg-[#E0F2EE] text-[#008080]">
              {p.payment_years} lần
            </span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-[#64748B]">Tổng đã đóng: <span className="font-bold text-[#1B2A4A]">{formatShortVND(p.total_paid)}</span></span>
          {isActive && (
            <span className={`text-xs ${isDueSoon ? 'font-semibold text-[#D4A843]' : 'text-[#64748B]'}`}>
              Đến hạn: {nextDue.toLocaleDateString('vi-VN')}
            </span>
          )}
        </div>
      </div>

      {/* Expand/Collapse toggle */}
      {hasDetails && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-1 py-2 text-xs font-semibold text-[#008080] bg-[#F5F7FA] hover:bg-[#E0F2EE] transition-colors border-t border-[#E2E8F0]"
          >
            {expanded ? 'Thu gọn' : 'Xem chi tiết quyền lợi'}
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {expanded && (
            <div className="px-5 pb-4 border-t border-[#E2E8F0]">
              <PolicyBenefitsSection
                benefits={p.benefits}
                riders={p.riders}
                insuredPersons={p.insured_persons}
                productType={p.product_type}
                policyNumber={p.policy_number}
                maturityDate={p.maturity_date}
                basePremium={p.base_premium}
                riderPremium={p.rider_premium}
              />
            </div>
          )}
        </>
      )}

      {/* Action buttons */}
      <div className="flex justify-end gap-1 px-5 pb-3">
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
