"use client"

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/shared/stat-card'
import { DeleteConfirm } from '@/components/shared/delete-confirm'
import { FundForm } from './fund-form'
import { FundAggregatedTable, type FundAggregate } from './fund-aggregated-table'
import { FundDetailTable } from './fund-detail-table'
import { useFundStore } from '@/lib/store/use-store'
import { useSettings } from '@/lib/store/use-settings'
import { formatVND, formatShortVND } from '@/lib/format'
import type { FundTransaction } from '@/lib/types'

const FUND_TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  'Cổ phiếu': { bg: '#EBF0F7', text: '#1B2A4A' },
  'Cân bằng':  { bg: '#E0F2EE', text: '#008080' },
  'Trái phiếu': { bg: '#FDF4E0', text: '#D4A843' },
}

type ViewMode = 'aggregate' | 'detail'

function buildAggregates(items: FundTransaction[], fundNavs: Record<string, number>): FundAggregate[] {
  const map: Record<string, { type: string; invested: number; qty: number }> = {}
  for (const t of items) {
    const isBuy = (t.transaction_type ?? 'buy') === 'buy'
    if (!map[t.fund_code]) map[t.fund_code] = { type: t.fund_type, invested: 0, qty: 0 }
    map[t.fund_code].invested += isBuy ? t.amount_vnd : -t.amount_vnd
    map[t.fund_code].qty += isBuy ? t.qty_units : -t.qty_units
  }
  return Object.entries(map).map(([code, v]) => {
    const avg_nav = v.qty > 0 ? v.invested / v.qty : 0
    const current_nav = fundNavs[code] ?? avg_nav
    const current_value = v.qty * current_nav
    const pnl = current_value - v.invested
    const pnl_pct = v.invested > 0 ? (pnl / v.invested) * 100 : 0
    return { fund_code: code, fund_type: v.type, total_invested: v.invested, total_qty: v.qty, avg_nav, current_nav, current_value, pnl, pnl_pct }
  })
}

export default function FundsPage() {
  const { items, add, update, remove } = useFundStore()
  const { settings } = useSettings()
  const [view, setView] = useState<ViewMode>('aggregate')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<FundTransaction | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const deleteTarget = items.find((t) => t.id === deleteId)

  const totalInvested = items
    .filter(t => (t.transaction_type ?? 'buy') === 'buy')
    .reduce((s, t) => s + t.amount_vnd, 0)

  const aggregated = buildAggregates(items, settings.fund_navs)

  const byType: Record<string, number> = {}
  const byManager: Record<string, number> = {}
  items.forEach((t) => {
    byType[t.fund_type] = (byType[t.fund_type] ?? 0) + t.amount_vnd
    byManager[t.manager] = (byManager[t.manager] ?? 0) + t.amount_vnd
  })

  function openAdd() { setEditing(null); setFormOpen(true) }
  function openEdit(t: FundTransaction) { setEditing(t); setFormOpen(true) }

  function handleSave(data: Omit<FundTransaction, 'id'>) {
    if (editing) { update(editing.id, data); toast.success('Đã cập nhật thành công') }
    else { add(data); toast.success('Đã thêm giao dịch mới') }
    setFormOpen(false)
  }

  function handleDelete() {
    if (!deleteId) return
    remove(deleteId); toast.success('Đã xóa thành công'); setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">Chứng chỉ quỹ</h1>
          <p className="text-sm text-[#64748B] mt-1">Danh mục CCQ (Mutual Funds)</p>
        </div>
        <Button onClick={openAdd} className="bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]/90 gap-1.5">
          <Plus size={16} /> Thêm mới
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Tổng đầu tư" value={formatShortVND(totalInvested)} sub={formatVND(totalInvested)}
          bgColor="#E0F2EE" borderColor="#008080" valueClassName="text-[#1B2A4A]" />
        <div className="rounded-xl bg-white shadow-sm overflow-hidden" style={{ borderLeft: '4px solid #008080' }}>
          <div className="px-4 pt-4 pb-1"><p className="text-sm text-[#64748B]">Theo loại quỹ</p></div>
          <div className="px-4 pb-4 space-y-2 mt-1">
            {Object.entries(byType).map(([type, amt]) => {
              const style = FUND_TYPE_STYLES[type] ?? { bg: '#EBF0F7', text: '#1B2A4A' }
              return (
                <div key={type} className="flex items-center justify-between text-sm">
                  <span className="inline-block rounded px-2 py-0.5 text-xs font-semibold" style={{ backgroundColor: style.bg, color: style.text }}>{type}</span>
                  <span className="font-bold text-[#1B2A4A]">{formatShortVND(amt)}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="rounded-xl bg-white shadow-sm overflow-hidden" style={{ borderLeft: '4px solid #008080' }}>
          <div className="px-4 pt-4 pb-1"><p className="text-sm text-[#64748B]">Theo quỹ quản lý</p></div>
          <div className="px-4 pb-4 space-y-2 mt-1">
            {Object.entries(byManager).map(([mgr, amt]) => (
              <div key={mgr} className="space-y-0.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B] truncate">{mgr}</span>
                  <span className="font-bold text-[#1B2A4A] ml-2">{formatShortVND(amt)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#E2E8F0]">
                  <div className="h-1.5 rounded-full" style={{ width: `${totalInvested > 0 ? (amt / totalInvested) * 100 : 0}%`, backgroundColor: '#008080' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-2">
        {(['aggregate', 'detail'] as ViewMode[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${view === v ? 'bg-[#008080] text-white' : 'bg-[#E2E8F0] text-[#64748B] hover:bg-[#D1D5DB]'}`}
          >
            {v === 'aggregate' ? 'Tổng hợp' : 'Chi tiết'}
          </button>
        ))}
      </div>

      {view === 'aggregate' && <FundAggregatedTable aggregated={aggregated} />}
      {view === 'detail' && (
        <FundDetailTable
          items={items}
          totalInvested={totalInvested}
          onEdit={openEdit}
          onDelete={setDeleteId}
        />
      )}

      <FundForm open={formOpen} onOpenChange={setFormOpen} onSave={handleSave} initial={editing} />
      <DeleteConfirm
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        onConfirm={handleDelete}
        label={deleteTarget?.fund_code ?? 'bản ghi này'}
      />
    </div>
  )
}
