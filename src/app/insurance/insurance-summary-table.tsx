"use client"

import { Pencil, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatVND, formatShortVND } from '@/lib/format'
import { INSURANCE_STATUSES } from '@/lib/constants'
import { getNextDueDate } from './insurance-policy-card'
import type { InsurancePolicy } from '@/lib/types'

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

interface Props {
  items: InsurancePolicy[]
  onEdit: (p: InsurancePolicy) => void
  onDelete: (id: string) => void
}

export function InsuranceSummaryTable({ items, onEdit, onDelete }: Props) {
  const totalAnnual = items.reduce((s, p) => s + p.annual_premium, 0)
  const totalCoverage = items.reduce((s, p) => s + (p.coverage_amount ?? 0), 0)
  const grandTotal = items.reduce((s, p) => s + p.total_paid, 0)

  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#E2E8F0]">
        <h2 className="text-base font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
          Tổng hợp hợp đồng
        </h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F5F7FA] hover:bg-[#F5F7FA]">
              {['Tên sản phẩm', 'Trạng thái', 'Người được BH', 'Phí/năm', 'Số tiền BH', 'Tổng đã đóng', 'Đến hạn', ''].map((h) => (
                <TableHead key={h} className="text-[#1B2A4A] font-bold font-[family-name:var(--font-nunito)]">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((p, idx) => {
              const nextDue = getNextDueDate(p.start_date)
              const daysLeft = Math.ceil((nextDue.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              const isDueSoon = daysLeft >= 0 && daysLeft <= 60 && (p.status ?? 'active') === 'active'
              const persons = p.insured_persons?.map(ip => ip.name.split(' ').pop()).join(', ')
              return (
                <TableRow key={p.id} className={`hover:bg-[#F5F7FA] ${idx % 2 === 1 ? 'bg-[#FAFBFC]' : 'bg-white'}`}>
                  <TableCell className="font-semibold text-[#1B2A4A]">{p.product_name}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell className="text-[#64748B] text-sm">{persons ?? '—'}</TableCell>
                  <TableCell className="text-right font-bold text-[#1B2A4A]">{formatVND(p.annual_premium)}</TableCell>
                  <TableCell className="text-right font-bold text-[#1B2A4A]">
                    {p.coverage_amount ? formatShortVND(p.coverage_amount) : '—'}
                  </TableCell>
                  <TableCell className="text-right font-bold text-[#1B2A4A]">{formatVND(p.total_paid)}</TableCell>
                  <TableCell>
                    {(p.status ?? 'active') === 'active' ? (
                      <span className={`text-sm ${isDueSoon ? 'font-semibold' : ''}`}
                        style={{ color: isDueSoon ? '#D4A843' : '#64748B' }}>
                        {nextDue.toLocaleDateString('vi-VN')}
                        {isDueSoon && <span className="ml-1 text-xs">({daysLeft}d)</span>}
                      </span>
                    ) : <span className="text-[#94A3B8]">—</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button onClick={() => onEdit(p)} title="Chỉnh sửa"
                        className="p-1.5 rounded hover:bg-[#E0F2EE] text-teal-600 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => onDelete(p.id)} title="Xóa"
                        className="p-1.5 rounded hover:bg-[#FDECEC] text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            <TableRow className="bg-[#EBF0F7] font-semibold">
              <TableCell colSpan={3} className="font-bold text-[#1B2A4A]">Tổng cộng</TableCell>
              <TableCell className="text-right font-bold text-[#1B2A4A]">{formatVND(totalAnnual)}</TableCell>
              <TableCell className="text-right font-bold text-[#1B2A4A]">{formatShortVND(totalCoverage)}</TableCell>
              <TableCell className="text-right font-bold text-[#1B2A4A]">{formatVND(grandTotal)}</TableCell>
              <TableCell colSpan={2} />
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
