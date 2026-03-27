"use client"

import { useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/shared/stat-card'
import { DeleteConfirm } from '@/components/shared/delete-confirm'
import { SavingsForm } from './savings-form'
import { SavingsDepositCard } from './savings-deposit-card'
import { useSavingsStore } from '@/lib/store/use-store'
import { formatVND, formatDate, formatPercent, formatShortVND } from '@/lib/format'
import type { SavingsDeposit } from '@/lib/types'

export default function SavingsPage() {
  const { items, add, update, remove } = useSavingsStore()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<SavingsDeposit | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const deleteTarget = items.find((d) => d.id === deleteId)

  const today = new Date().toISOString().slice(0, 10)
  const activeDeposits = items.filter((d) => d.status === 'active' && d.end_date > today)
  const maturedDeposits = items.filter((d) => d.status === 'matured' || d.end_date <= today)

  const activeTotal = activeDeposits.reduce((s, d) => s + d.amount, 0)
  const maturedTotal = maturedDeposits.reduce((s, d) => s + d.amount, 0)
  const totalInterest = activeDeposits.reduce((s, d) => s + d.expected_interest, 0)
  const avgRate = activeDeposits.length > 0
    ? activeDeposits.reduce((s, d) => s + d.interest_rate, 0) / activeDeposits.length
    : 0

  function openAdd() { setEditing(null); setFormOpen(true) }
  function openEdit(d: SavingsDeposit) { setEditing(d); setFormOpen(true) }

  function openRenew(d: SavingsDeposit) {
    // Pre-fill with same data but new start_date = today
    setEditing({
      ...d,
      id: '',  // will be ignored (new record)
      start_date: today,
      status: 'active',
    } as SavingsDeposit)
    setFormOpen(true)
  }

  function handleSave(data: Omit<SavingsDeposit, 'id'>) {
    if (editing && editing.id) {
      update(editing.id, data)
      toast.success('Đã cập nhật thành công')
    } else {
      add(data)
      toast.success('Đã thêm tiết kiệm mới')
    }
    setFormOpen(false)
  }

  function handleDelete() {
    if (!deleteId) return
    remove(deleteId)
    toast.success('Đã xóa thành công')
    setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">Tiết kiệm</h1>
          <p className="text-sm text-[#64748B] mt-1">Các khoản tiết kiệm có kỳ hạn</p>
        </div>
        <Button onClick={openAdd} className="bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]/90 gap-1.5">
          <Plus size={16} /> Thêm mới
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Đang gửi" value={formatShortVND(activeTotal)} sub={`${activeDeposits.length} khoản`}
          bgColor="#EBF0F7" borderColor="#1B2A4A" valueClassName="text-[#1B2A4A]" />
        <StatCard label="Đã đáo hạn" value={formatShortVND(maturedTotal)} sub={`${maturedDeposits.length} khoản`}
          bgColor="#F1F5F9" borderColor="#94A3B8" valueClassName="text-[#64748B]" />
        <StatCard label="Lãi dự kiến" value={formatShortVND(totalInterest)} sub="khoản đang gửi"
          bgColor="#E0F2EE" borderColor="#008080" valueClassName="text-[#1B2A4A]" />
        <StatCard label="Lãi suất TB" value={formatPercent(avgRate)} sub="bình quân đang gửi"
          bgColor="#FDF4E0" borderColor="#D4A843" valueClassName="text-[#D4A843]" />
      </div>

      {/* Active deposits section */}
      <div>
        <h2 className="text-base font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)] mb-3 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#008080]" />
          Đang gửi ({activeDeposits.length})
        </h2>
        {activeDeposits.length === 0 ? (
          <p className="text-sm text-[#64748B]">Không có khoản nào đang gửi.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {activeDeposits.map((d) => (
              <SavingsDepositCard key={d.id} deposit={d}
                onEdit={openEdit} onDelete={setDeleteId} />
            ))}
          </div>
        )}
      </div>

      {/* Matured deposits section */}
      {maturedDeposits.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-[#64748B] font-[family-name:var(--font-nunito)] mb-3 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#94A3B8]" />
            Đã đáo hạn ({maturedDeposits.length})
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {maturedDeposits.map((d) => (
              <SavingsDepositCard key={d.id} deposit={d}
                onEdit={openEdit} onDelete={setDeleteId} onRenew={openRenew} />
            ))}
          </div>
        </div>
      )}

      {/* Detail table */}
      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-base font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">Chi tiết các khoản tiết kiệm</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F7FA] hover:bg-[#F5F7FA]">
                {['Ngân hàng', 'Số tiền', 'Kỳ hạn', 'Lãi suất', 'Ngày gửi', 'Đáo hạn', 'Lãi dự kiến', 'Trạng thái', ''].map((h) => (
                  <TableHead key={h} className="text-[#1B2A4A] font-bold font-[family-name:var(--font-nunito)]">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((d, idx) => {
                const isMatured = d.status === 'matured' || d.end_date <= today
                return (
                  <TableRow key={d.id} className={`hover:bg-[#F5F7FA] ${idx % 2 === 1 ? 'bg-[#FAFBFC]' : 'bg-white'}`}>
                    <TableCell className="font-semibold text-[#1B2A4A]">{d.bank}</TableCell>
                    <TableCell className="text-right font-bold text-[#1B2A4A]">{formatVND(d.amount)}</TableCell>
                    <TableCell className="text-right text-[#64748B]">{d.period_months} tháng</TableCell>
                    <TableCell className="text-right font-bold text-[#D4A843]">{formatPercent(d.interest_rate)}</TableCell>
                    <TableCell className="text-[#64748B]">{formatDate(d.start_date)}</TableCell>
                    <TableCell className="text-[#64748B]">{formatDate(d.end_date)}</TableCell>
                    <TableCell className="text-right text-[#22C55E] font-semibold">{formatVND(d.expected_interest)}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-semibold rounded px-2 py-0.5 ${isMatured ? 'bg-[#F1F5F9] text-[#64748B]' : 'bg-[#E0F2EE] text-[#008080]'}`}>
                        {isMatured ? 'Đã đáo hạn' : 'Đang gửi'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(d)} title="Chỉnh sửa"
                          className="p-1.5 rounded hover:bg-[#E0F2EE] text-teal-600 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteId(d.id)} title="Xóa"
                          className="p-1.5 rounded hover:bg-[#FDECEC] text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <SavingsForm open={formOpen} onOpenChange={setFormOpen} onSave={handleSave} initial={editing} />
      <DeleteConfirm
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        onConfirm={handleDelete}
        label={deleteTarget?.bank ?? 'bản ghi này'}
      />
    </div>
  )
}
