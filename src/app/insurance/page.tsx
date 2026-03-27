"use client"

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/shared/stat-card'
import { DeleteConfirm } from '@/components/shared/delete-confirm'
import { InsuranceForm } from './insurance-form'
import { InsurancePolicyCard } from './insurance-policy-card'
import { CoverageByPerson } from './coverage-by-person'
import { PremiumCalendar } from './premium-calendar'
import { InsuranceSummaryTable } from './insurance-summary-table'
import { useInsuranceStore } from '@/lib/store/use-store'
import { formatShortVND } from '@/lib/format'
import { migrateInsuranceData } from '@/lib/store/insurance-migration'
import type { InsurancePolicy } from '@/lib/types'

type TabKey = 'all' | 'active' | 'calendar'
const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'active', label: 'Đang đóng' },
  { key: 'calendar', label: 'Lịch đóng phí' },
]

export default function InsurancePage() {
  // Auto-migrate old localStorage data on first visit
  useEffect(() => { migrateInsuranceData() }, [])

  const { items, add, update, remove } = useInsuranceStore()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<InsurancePolicy | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [tab, setTab] = useState<TabKey>('all')
  const deleteTarget = items.find((p) => p.id === deleteId)

  const grandTotal = items.reduce((s, p) => s + p.total_paid, 0)
  const totalAnnual = items.reduce((s, p) => s + p.annual_premium, 0)
  const totalCoverage = items.reduce((s, p) => s + (p.coverage_amount ?? 0), 0)
  const activeCount = items.filter(p => (p.status ?? 'active') === 'active').length
  const personCount = new Set(items.flatMap(p => (p.insured_persons ?? []).map(ip => ip.name))).size

  const filteredItems = tab === 'active'
    ? items.filter(p => (p.status ?? 'active') === 'active')
    : items

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
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
            Bảo hiểm nhân thọ
          </h1>
          <p className="text-sm text-[#64748B] mt-1">Tổng quan danh mục bảo hiểm</p>
        </div>
        <Button onClick={openAdd} className="bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]/90 gap-1.5">
          <Plus size={16} /> Thêm mới
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <StatCard label="Tổng đã đóng" value={formatShortVND(grandTotal)}
          bgColor="#EBF0F7" borderColor="#1B2A4A" valueClassName="text-[#1B2A4A]" />
        <StatCard label="Phí hàng năm" value={formatShortVND(totalAnnual)} sub={`~${formatShortVND(totalAnnual / 12)}/tháng`}
          bgColor="#E0F2EE" borderColor="#008080" valueClassName="text-[#1B2A4A]" />
        <StatCard label="Tổng bảo hiểm" value={formatShortVND(totalCoverage)}
          bgColor="#FDF4E0" borderColor="#D4A843" valueClassName="text-[#1B2A4A]" />
        <StatCard label="Hợp đồng" value={`${activeCount}/${items.length}`} sub="đang đóng"
          bgColor="#E0F2EE" borderColor="#008080" valueClassName="text-[#1B2A4A]" />
        <StatCard label="Người được BH" value={String(personCount || items.length)} sub="người"
          bgColor="#EBF0F7" borderColor="#1B2A4A" valueClassName="text-[#1B2A4A]" />
      </div>

      {/* Coverage by Person */}
      <CoverageByPerson policies={items} />

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-[#E2E8F0]">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              tab === t.key
                ? 'border-[#008080] text-[#008080]'
                : 'border-transparent text-[#64748B] hover:text-[#1B2A4A]'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'calendar' ? (
        <PremiumCalendar policies={items} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filteredItems.map((p) => (
              <InsurancePolicyCard key={p.id} policy={p} onEdit={openEdit} onDelete={setDeleteId} />
            ))}
          </div>
          <InsuranceSummaryTable items={filteredItems} onEdit={openEdit} onDelete={setDeleteId} />
        </>
      )}

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
