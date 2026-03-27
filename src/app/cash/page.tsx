"use client"

import { useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/shared/stat-card'
import { DeleteConfirm } from '@/components/shared/delete-confirm'
import { CashForm } from './cash-form'
import { CashAccountCard } from './cash-account-card'
import { useCashStore } from '@/lib/store/use-store'
import { formatVND, formatDate } from '@/lib/format'
import type { CashSnapshot } from '@/lib/types'

export default function CashPage() {
  const { items, add, update, remove } = useCashStore()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<CashSnapshot | null>(null)
  const [quickPrefill, setQuickPrefill] = useState<{ bank: string; snapshot_date: string } | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const deleteTarget = items.find((s) => s.id === deleteId)

  // Latest snapshot per bank
  const latestByBank = items.reduce<Record<string, CashSnapshot>>((acc, s) => {
    if (!acc[s.bank] || s.snapshot_date > acc[s.bank].snapshot_date) acc[s.bank] = s
    return acc
  }, {})
  const latestSnapshots = Object.values(latestByBank)
  const totalCash = latestSnapshots.reduce((sum, s) => sum + s.amount, 0)
  const sortedItems = [...items].sort((a, b) => b.snapshot_date.localeCompare(a.snapshot_date))

  function openAdd() { setEditing(null); setQuickPrefill(null); setFormOpen(true) }
  function openEdit(s: CashSnapshot) { setEditing(s); setQuickPrefill(null); setFormOpen(true) }

  function openQuickUpdate(bank: string) {
    setEditing(null)
    setQuickPrefill({ bank, snapshot_date: new Date().toISOString().slice(0, 10) })
    setFormOpen(true)
  }

  function handleSave(data: Omit<CashSnapshot, 'id'>) {
    if (editing) { update(editing.id, data); toast.success('Đã cập nhật snapshot') }
    else { add(data); toast.success('Đã thêm snapshot mới') }
    setFormOpen(false); setQuickPrefill(null)
  }

  function handleDelete() {
    if (!deleteId) return
    remove(deleteId); toast.success('Đã xóa snapshot'); setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">Tiền mặt lưu động</h1>
          <p className="text-sm text-[#64748B] mt-1">Số dư tài khoản thanh toán</p>
        </div>
        <Button onClick={openAdd} className="bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]/90 gap-1.5">
          <Plus size={16} /> Thêm mới
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Tổng tiền mặt" value={`${(totalCash / 1_000_000).toFixed(0)} triệu`} sub={formatVND(totalCash)}
          bgColor="#EBF0F7" borderColor="#1B2A4A" valueClassName="text-[#1B2A4A]" />
        <StatCard label="Số tài khoản" value={`${latestSnapshots.length}`} sub="tài khoản hoạt động"
          bgColor="#EBF0F7" borderColor="#1B2A4A" valueClassName="text-[#1B2A4A]" />
      </div>

      {/* Account cards with staleness & trend */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {latestSnapshots.map((acc) => (
          <CashAccountCard
            key={acc.bank}
            acc={acc}
            allItems={items}
            totalCash={totalCash}
            onQuickUpdate={openQuickUpdate}
          />
        ))}
      </div>

      {/* History table */}
      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-base font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">Lịch sử số dư</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F7FA] hover:bg-[#F5F7FA]">
                {['Ngân hàng', 'Ngày', 'Số dư', ''].map((h) => (
                  <TableHead key={h} className="text-[#1B2A4A] font-bold font-[family-name:var(--font-nunito)]">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((s, idx) => (
                <TableRow key={s.id} className={`hover:bg-[#F5F7FA] ${idx % 2 === 1 ? 'bg-[#FAFBFC]' : 'bg-white'}`}>
                  <TableCell className="font-semibold text-[#1B2A4A]">{s.bank}</TableCell>
                  <TableCell className="text-[#64748B]">{formatDate(s.snapshot_date)}</TableCell>
                  <TableCell className="text-right font-bold text-[#1B2A4A]">{formatVND(s.amount)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(s)} title="Chỉnh sửa"
                        className="p-1.5 rounded hover:bg-[#E0F2EE] text-teal-600 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteId(s.id)} title="Xóa"
                        className="p-1.5 rounded hover:bg-[#FDECEC] text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <CashForm
        open={formOpen}
        onOpenChange={(o) => { setFormOpen(o); if (!o) setQuickPrefill(null) }}
        onSave={handleSave}
        initial={editing}
        prefill={quickPrefill}
      />
      <DeleteConfirm
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        onConfirm={handleDelete}
        label={deleteTarget ? `${deleteTarget.bank} – ${formatDate(deleteTarget.snapshot_date)}` : 'bản ghi này'}
      />
    </div>
  )
}
