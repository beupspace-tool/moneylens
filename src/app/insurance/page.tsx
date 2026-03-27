"use client"

import { useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/shared/stat-card'
import { DeleteConfirm } from '@/components/shared/delete-confirm'
import { InsuranceForm } from './insurance-form'
import { InsurancePolicyCard, getNextDueDate } from './insurance-policy-card'
import { useInsuranceStore } from '@/lib/store/use-store'
import { formatVND, formatShortVND } from '@/lib/format'
import { INSURANCE_STATUSES } from '@/lib/constants'
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

export default function InsurancePage() {
  const { items, add, update, remove } = useInsuranceStore()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<InsurancePolicy | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const deleteTarget = items.find((p) => p.id === deleteId)

  const grandTotal = items.reduce((s, p) => s + p.total_paid, 0)
  const totalAnnual = items.reduce((s, p) => s + p.annual_premium, 0)
  const totalCoverage = items.reduce((s, p) => s + (p.coverage_amount ?? 0), 0)
  const activeCount = items.filter(p => (p.status ?? 'active') === 'active').length

  function openAdd() { setEditing(null); setFormOpen(true) }
  function openEdit(p: InsurancePolicy) { setEditing(p); setFormOpen(true) }

  function handleSave(data: Omit<InsurancePolicy, 'id'>) {
    if (editing) {
      update(editing.id, data)
      toast.success('Đã cập nhật hợp đồng')
    } else {
      add(data)
      toast.success('Đã thêm hợp đồng mới')
    }
    setFormOpen(false)
  }

  function handleDelete() {
    if (!deleteId) return
    remove(deleteId)
    toast.success('Đã xóa hợp đồng')
    setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">Bảo hiểm nhân thọ</h1>
          <p className="text-sm text-[#64748B] mt-1">Các hợp đồng bảo hiểm đang duy trì</p>
        </div>
        <Button onClick={openAdd} className="bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]/90 gap-1.5">
          <Plus size={16} /> Thêm mới
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Tổng đã đóng" value={formatShortVND(grandTotal)} sub={formatVND(grandTotal)}
          bgColor="#EBF0F7" borderColor="#1B2A4A" valueClassName="text-[#1B2A4A]" />
        <StatCard label="Phí hàng năm" value={formatShortVND(totalAnnual)} sub={`${activeCount} hợp đồng đang đóng`}
          bgColor="#E0F2EE" borderColor="#008080" valueClassName="text-[#1B2A4A]" />
        <StatCard label="Phí hàng tháng TB" value={formatShortVND(totalAnnual / 12)} sub="bình quân/tháng"
          bgColor="#E0F2EE" borderColor="#008080" valueClassName="text-[#1B2A4A]" />
        <StatCard label="Tổng bảo hiểm" value={formatShortVND(totalCoverage)} sub="tổng giá trị được bảo vệ"
          bgColor="#FDF4E0" borderColor="#D4A843" valueClassName="text-[#1B2A4A]" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((p) => (
          <InsurancePolicyCard key={p.id} policy={p} onEdit={openEdit} onDelete={setDeleteId} />
        ))}
      </div>

      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-base font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">Tổng hợp hợp đồng</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F7FA] hover:bg-[#F5F7FA]">
                {['Tên sản phẩm', 'Trạng thái', 'Phí/năm', 'Số TM bảo hiểm', 'Tổng đã đóng', 'Đến hạn tiếp theo', ''].map((h) => (
                  <TableHead key={h} className="text-[#1B2A4A] font-bold font-[family-name:var(--font-nunito)]">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((p, idx) => {
                const nextDue = getNextDueDate(p.start_date)
                const daysLeft = Math.ceil((nextDue.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                const isDueSoon = daysLeft >= 0 && daysLeft <= 60 && (p.status ?? 'active') === 'active'
                return (
                  <TableRow key={p.id} className={`hover:bg-[#F5F7FA] ${idx % 2 === 1 ? 'bg-[#FAFBFC]' : 'bg-white'}`}>
                    <TableCell className="font-semibold text-[#1B2A4A]">{p.product_name}</TableCell>
                    <TableCell><StatusBadge status={p.status} /></TableCell>
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
                        <button onClick={() => openEdit(p)} title="Chỉnh sửa"
                          className="p-1.5 rounded hover:bg-[#E0F2EE] text-teal-600 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteId(p.id)} title="Xóa"
                          className="p-1.5 rounded hover:bg-[#FDECEC] text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              <TableRow className="bg-[#EBF0F7] font-semibold">
                <TableCell colSpan={2} className="font-bold text-[#1B2A4A]">Tổng cộng</TableCell>
                <TableCell className="text-right font-bold text-[#1B2A4A]">{formatVND(totalAnnual)}</TableCell>
                <TableCell className="text-right font-bold text-[#1B2A4A]">{formatShortVND(totalCoverage)}</TableCell>
                <TableCell className="text-right font-bold text-[#1B2A4A]">{formatVND(grandTotal)}</TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <InsuranceForm open={formOpen} onOpenChange={setFormOpen} onSave={handleSave} initial={editing} />
      <DeleteConfirm
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        onConfirm={handleDelete}
        label={deleteTarget?.product_name ?? 'bản ghi này'}
      />
    </div>
  )
}
