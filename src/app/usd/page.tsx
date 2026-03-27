"use client"

import { useState } from 'react'
import { Pencil, Trash2, Plus, Settings } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/shared/stat-card'
import { DeleteConfirm } from '@/components/shared/delete-confirm'
import { UsdForm } from './usd-form'
import { useUsdStore } from '@/lib/store/use-store'
import { useSettings } from '@/lib/store/use-settings'
import { formatVND, formatUSD, formatDate, formatNumber, formatShortVND } from '@/lib/format'
import type { UsdTransaction } from '@/lib/types'

function StatusBadge({ status }: { status?: string }) {
  if (status === 'converted') {
    return <span className="text-xs font-semibold rounded px-2 py-0.5 bg-[#F1F5F9] text-[#64748B]">Đã đổi sang VND</span>
  }
  return <span className="text-xs font-semibold rounded px-2 py-0.5 bg-[#E0F2EE] text-[#008080]">Đang giữ</span>
}

export default function UsdPage() {
  const { items, add, update, remove } = useUsdStore()
  const { settings } = useSettings()
  const currentRate = settings.usd_vnd_rate

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<UsdTransaction | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const deleteTarget = items.find((t) => t.id === deleteId)

  const holdingItems = items.filter((t) => (t.status ?? 'holding') === 'holding')
  const convertedItems = items.filter((t) => t.status === 'converted')

  const totalHoldingUsd = holdingItems.reduce((s, t) => s + t.amount_usd, 0)
  const totalConvertedUsd = convertedItems.reduce((s, t) => s + t.amount_usd, 0)
  const totalVndAtReceipt = holdingItems.reduce((s, t) => s + t.amount_vnd_at_receipt, 0)
  const totalCurrentVnd = totalHoldingUsd * currentRate
  const totalGainLoss = totalCurrentVnd - totalVndAtReceipt

  // Weighted average exchange rate for holding positions
  const weightedAvgRate = totalHoldingUsd > 0
    ? Math.round(holdingItems.reduce((s, t) => s + t.amount_usd * t.exchange_rate_at_receipt, 0) / totalHoldingUsd)
    : 0

  const withGainLoss = items.map((t) => ({
    ...t,
    gain_loss: (t.status ?? 'holding') === 'holding'
      ? t.amount_usd * currentRate - t.amount_vnd_at_receipt
      : 0,
  }))

  function openAdd() { setEditing(null); setFormOpen(true) }
  function openEdit(t: UsdTransaction) { setEditing(t); setFormOpen(true) }

  function handleSave(data: Omit<UsdTransaction, 'id'>) {
    if (editing) {
      update(editing.id, data)
      toast.success('Đã cập nhật giao dịch')
    } else {
      add(data)
      toast.success('Đã thêm giao dịch USD mới')
    }
    setFormOpen(false)
  }

  function handleDelete() {
    if (!deleteId) return
    remove(deleteId)
    toast.success('Đã xóa giao dịch')
    setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">Thu nhập USD</h1>
          <p className="text-sm text-[#64748B] mt-1 flex items-center gap-1">
            Tỉ giá hiện tại:{' '}
            <span className="font-semibold text-[#D4A843]">{formatNumber(currentRate)} đ/USD</span>
            <Link href="/settings" className="ml-1 text-[#008080] hover:underline inline-flex items-center gap-0.5 text-xs">
              <Settings size={11} /> Cập nhật
            </Link>
          </p>
        </div>
        <Button onClick={openAdd} className="bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]/90 gap-1.5">
          <Plus size={16} /> Thêm mới
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Đang giữ" value={formatUSD(totalHoldingUsd)} sub={`${holdingItems.length} giao dịch`}
          bgColor="#EBF0F7" borderColor="#1B2A4A" valueClassName="text-[#1B2A4A]" />
        <StatCard label="Đã đổi sang VND" value={formatUSD(totalConvertedUsd)} sub={`${convertedItems.length} giao dịch`}
          bgColor="#F1F5F9" borderColor="#94A3B8" valueClassName="text-[#64748B]" />
        <StatCard label="Giá trị đang giữ" value={formatShortVND(totalCurrentVnd)}
          sub={`tỉ giá TB: ${formatNumber(weightedAvgRate)}`}
          bgColor="#FDF4E0" borderColor="#D4A843" valueClassName="text-[#1B2A4A]" />
        <StatCard
          label="Lãi/Lỗ tỉ giá"
          value={`${totalGainLoss >= 0 ? '+' : ''}${formatShortVND(totalGainLoss)}`}
          sub={`${totalGainLoss >= 0 ? '+' : ''}${totalVndAtReceipt > 0 ? ((totalGainLoss / totalVndAtReceipt) * 100).toFixed(2) : '0.00'}%`}
          bgColor={totalGainLoss >= 0 ? '#E0F2EE' : '#FDECEC'}
          borderColor={totalGainLoss >= 0 ? '#008080' : '#EF4444'}
          valueClassName={totalGainLoss >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}
        />
      </div>

      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-base font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">Lịch sử nhận USD</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F7FA] hover:bg-[#F5F7FA]">
                {['Ngày', 'Nguồn', 'Số tiền (USD)', 'Tỉ giá lúc nhận', 'Giá trị VND', 'Gain/Loss', 'Trạng thái', ''].map((h) => (
                  <TableHead key={h} className="text-[#1B2A4A] font-bold font-[family-name:var(--font-nunito)]">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {withGainLoss.map((t, idx) => (
                <TableRow key={t.id} className={`hover:bg-[#F5F7FA] ${idx % 2 === 1 ? 'bg-[#FAFBFC]' : 'bg-white'}`}>
                  <TableCell className="text-[#64748B]">{formatDate(t.date)}</TableCell>
                  <TableCell className="text-[#64748B] text-sm">{t.source ?? '—'}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-[#1B2A4A]">{formatUSD(t.amount_usd)}</TableCell>
                  <TableCell className="text-right font-semibold text-[#D4A843]">{formatNumber(t.exchange_rate_at_receipt)}</TableCell>
                  <TableCell className="text-right font-bold text-[#1B2A4A]">{formatVND(t.amount_vnd_at_receipt)}</TableCell>
                  <TableCell className={`text-right font-semibold ${(t.status ?? 'holding') === 'holding' ? ((t.gain_loss ?? 0) >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]') : 'text-[#94A3B8]'}`}>
                    {(t.status ?? 'holding') === 'converted' ? '—' : `${(t.gain_loss ?? 0) >= 0 ? '+' : ''}${formatVND(t.gain_loss ?? 0)}`}
                  </TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(t)} title="Chỉnh sửa"
                        className="p-1.5 rounded hover:bg-[#E0F2EE] text-teal-600 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteId(t.id)} title="Xóa"
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

      <UsdForm open={formOpen} onOpenChange={setFormOpen} onSave={handleSave} initial={editing} />
      <DeleteConfirm
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        onConfirm={handleDelete}
        label={deleteTarget ? formatUSD(deleteTarget.amount_usd) : 'bản ghi này'}
      />
    </div>
  )
}
