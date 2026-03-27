"use client"

import { useState } from 'react'
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/shared/stat-card'
import { DeleteConfirm } from '@/components/shared/delete-confirm'
import { GoldForm } from './gold-form'
import { useGoldStore } from '@/lib/store/use-store'
import { useSettings } from '@/lib/store/use-settings'
import { formatVND, formatDate, formatPercent, formatShortVND } from '@/lib/format'
import type { GoldHolding } from '@/lib/types'

/** Auto-generate a human-readable name from qty in chỉ */
function goldDisplayName(qty: number): string {
  if (qty >= 10) {
    const cay = Math.floor(qty / 10)
    const chi = qty % 10
    return chi > 0 ? `${cay} cây ${chi} chỉ` : `${cay} cây`
  }
  return `${qty} chỉ`
}

export default function GoldPage() {
  const { items, add, update, remove } = useGoldStore()
  const { settings, updateGoldPrice } = useSettings()
  const pricePerChi = settings.gold_price_per_chi

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<GoldHolding | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Inline price editing state
  const [editingPrice, setEditingPrice] = useState(false)
  const [priceInput, setPriceInput] = useState('')

  const deleteTarget = items.find((h) => h.id === deleteId)

  const totalQty = items.reduce((s, h) => s + h.qty_chi, 0)
  const totalCost = items.reduce((s, h) => s + h.amount_vnd, 0)
  const currentValue = totalQty * pricePerChi
  const profit = currentValue - totalCost
  const profitPct = totalCost > 0 ? (profit / totalCost) * 100 : 0

  function openAdd() { setEditing(null); setFormOpen(true) }
  function openEdit(h: GoldHolding) { setEditing(h); setFormOpen(true) }

  function handleSave(data: Omit<GoldHolding, 'id' | 'created_at'>) {
    if (editing) {
      update(editing.id, data)
      toast.success('Đã cập nhật thành công')
    } else {
      add({ ...data, created_at: new Date().toISOString().slice(0, 10) })
      toast.success('Đã thêm vàng mới')
    }
    setFormOpen(false)
  }

  function handleDelete() {
    if (!deleteId) return
    remove(deleteId)
    toast.success('Đã xóa thành công')
    setDeleteId(null)
  }

  function startPriceEdit() {
    setPriceInput(String(pricePerChi))
    setEditingPrice(true)
  }

  function savePriceEdit() {
    const val = Number(priceInput)
    if (val > 0) {
      updateGoldPrice(val)
      toast.success('Đã cập nhật giá vàng')
    }
    setEditingPrice(false)
  }

  function cancelPriceEdit() {
    setEditingPrice(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">Vàng</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-[#64748B]">Giá hiện tại:</span>
            {editingPrice ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="w-36 text-sm font-semibold text-[#D4A843] border border-[#D4A843] rounded px-2 py-0.5 focus:outline-none"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') savePriceEdit(); if (e.key === 'Escape') cancelPriceEdit() }}
                />
                <button onClick={savePriceEdit} className="p-1 rounded hover:bg-[#E0F2EE] text-teal-600"><Check size={14} /></button>
                <button onClick={cancelPriceEdit} className="p-1 rounded hover:bg-[#FDECEC] text-red-500"><X size={14} /></button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-[#D4A843]">{formatVND(pricePerChi)}/chỉ</span>
                <button onClick={startPriceEdit} title="Chỉnh sửa giá" className="p-1 rounded hover:bg-[#FDF4E0] text-[#D4A843] transition-colors">
                  <Pencil size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
        <Button onClick={openAdd} className="bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]/90 gap-1.5">
          <Plus size={16} /> Thêm mới
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Tổng số lượng" value={`${totalQty} chỉ`} sub={`${totalQty / 10} cây`}
          bgColor="#FDF4E0" borderColor="#D4A843" valueClassName="text-[#1B2A4A]" />
        <StatCard label="Vốn đầu tư" value={formatShortVND(totalCost)} sub={formatVND(totalCost)}
          bgColor="#EBF0F7" borderColor="#1B2A4A" valueClassName="text-[#1B2A4A]" />
        <StatCard label="Giá trị hiện tại" value={formatShortVND(currentValue)} sub={formatVND(currentValue)}
          bgColor="#EBF0F7" borderColor="#1B2A4A" valueClassName="text-[#1B2A4A]" />
        <StatCard
          label="Lãi/Lỗ"
          value={`${profit > 0 ? '+' : ''}${formatShortVND(profit)}`}
          sub={`${profit > 0 ? '+' : ''}${formatPercent(profitPct)}`}
          bgColor={profit >= 0 ? '#E0F2EE' : '#FDECEC'}
          borderColor={profit >= 0 ? '#008080' : '#EF4444'}
          valueClassName={profit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}
        />
      </div>

      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-base font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">Chi tiết mua vàng</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F7FA] hover:bg-[#F5F7FA]">
                {['Tên', 'Ngày mua', 'Số lượng', 'Đơn giá', 'Thành tiền', 'Lãi/Lỗ', 'Nơi mua', ''].map((h) => (
                  <TableHead key={h} className="text-[#1B2A4A] font-bold font-[family-name:var(--font-nunito)]">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((h, idx) => {
                const currentVal = h.qty_chi * pricePerChi
                const pl = currentVal - h.amount_vnd
                const plPct = (pl / h.amount_vnd) * 100
                return (
                  <TableRow key={h.id} className={`hover:bg-[#F5F7FA] ${idx % 2 === 1 ? 'bg-[#FAFBFC]' : 'bg-white'}`}>
                    <TableCell className="font-semibold text-[#1B2A4A]">{goldDisplayName(h.qty_chi)}</TableCell>
                    <TableCell className="text-[#64748B]">{formatDate(h.purchase_date)}</TableCell>
                    <TableCell className="text-right text-[#1B2A4A]">{h.qty_chi} chỉ</TableCell>
                    <TableCell className="text-right font-bold text-[#1B2A4A]">{formatVND(h.unit_price)}</TableCell>
                    <TableCell className="text-right font-bold text-[#1B2A4A]">{formatVND(h.amount_vnd)}</TableCell>
                    <TableCell className={`text-right font-semibold ${pl >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                      {pl >= 0 ? '+' : ''}{formatShortVND(pl)} ({pl >= 0 ? '+' : ''}{formatPercent(plPct, 1)})
                    </TableCell>
                    <TableCell className="text-[#64748B]">{h.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(h)} title="Chỉnh sửa"
                          className="p-1.5 rounded hover:bg-[#E0F2EE] text-teal-600 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteId(h.id)} title="Xóa"
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

      <GoldForm open={formOpen} onOpenChange={setFormOpen} onSave={handleSave} initial={editing} />
      <DeleteConfirm
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        onConfirm={handleDelete}
        label={deleteTarget ? goldDisplayName(deleteTarget.qty_chi) : 'bản ghi này'}
      />
    </div>
  )
}
