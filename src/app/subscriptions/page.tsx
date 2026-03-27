"use client"

import { useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/shared/stat-card'
import { DeleteConfirm } from '@/components/shared/delete-confirm'
import { SubscriptionForm } from './subscription-form'
import { SubscriptionCategoryCards, CATEGORY_STYLES } from './subscription-category-cards'
import { useSubscriptionStore } from '@/lib/store/use-store'
import { useSettings } from '@/lib/store/use-settings'
import { formatUSD, formatVND } from '@/lib/format'
import type { Subscription } from '@/lib/types'

// Returns positive days until renewal, null if no date or already expired
function daysUntilRenewal(endDate: string): number | null {
  if (!endDate) return null
  const diff = Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000)
  return diff > 0 ? diff : null
}

function RenewalBadge({ endDate }: { endDate: string }) {
  if (!endDate) return null
  const days = daysUntilRenewal(endDate)
  if (days === null) {
    return <span className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold bg-[#FDECEC] text-[#EF4444]">Hết hạn</span>
  }
  if (days <= 30) {
    return <span className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold bg-[#FDF4E0] text-[#D4A843]">còn {days} ngày</span>
  }
  return null
}

export default function SubscriptionsPage() {
  const { items, add, update, remove } = useSubscriptionStore()
  const { settings } = useSettings()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Subscription | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const deleteTarget = items.find((s) => s.id === deleteId)

  const ongoingItems = items.filter((s) => s.status === 'Ongoing')
  const totalMonthly = ongoingItems.reduce((s, sub) => s + sub.amount_per_month, 0)
  const totalAnnual = totalMonthly * 12
  const totalAnnualVND = totalAnnual * settings.usd_vnd_rate

  const byCategory = items.reduce<Record<string, { items: Subscription[]; total: number }>>((acc, sub) => {
    if (!acc[sub.category]) acc[sub.category] = { items: [], total: 0 }
    acc[sub.category].items.push(sub)
    acc[sub.category].total += sub.amount_per_month
    return acc
  }, {})

  function openAdd() { setEditing(null); setFormOpen(true) }
  function openEdit(s: Subscription) { setEditing(s); setFormOpen(true) }

  function handleSave(data: Omit<Subscription, 'id'>) {
    if (editing) { update(editing.id, data); toast.success('Đã cập nhật subscription') }
    else { add(data); toast.success('Đã thêm subscription mới') }
    setFormOpen(false)
  }

  function handleDelete() {
    if (!deleteId) return
    remove(deleteId); toast.success('Đã xóa subscription'); setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">Subscriptions</h1>
          <p className="text-sm text-[#64748B] mt-1">Các dịch vụ đăng ký hàng tháng / hàng năm</p>
        </div>
        <Button onClick={openAdd} className="bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]/90 gap-1.5">
          <Plus size={16} /> Thêm mới
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Tổng/tháng" value={formatUSD(totalMonthly)} sub={`${ongoingItems.length} dịch vụ đang dùng`}
          bgColor="#FDF4E0" borderColor="#D4A843" valueClassName="text-[#D4A843]" />
        {/* Annual cost — navy bg, prominent */}
        <div className="rounded-xl shadow-sm p-4 flex flex-col justify-between" style={{ backgroundColor: '#1B2A4A', borderLeft: '4px solid #D4A843' }}>
          <p className="text-sm text-[#94A3B8]">Tổng/năm</p>
          <p className="text-xl font-extrabold text-white font-[family-name:var(--font-nunito)] mt-1">{formatUSD(totalAnnual)}</p>
          <p className="text-xs text-[#94A3B8] mt-0.5">≈ {formatVND(totalAnnualVND)}</p>
        </div>
        <StatCard label="Danh mục" value={`${Object.keys(byCategory).length}`} sub="nhóm khác nhau"
          bgColor="#EBF0F7" borderColor="#1B2A4A" valueClassName="text-[#1B2A4A]" />
        <div className="rounded-xl bg-white shadow-sm overflow-hidden" style={{ borderLeft: '4px solid #D4A843' }}>
          <div className="px-4 pt-4 pb-1"><p className="text-sm text-[#64748B]">Top danh mục</p></div>
          <div className="px-4 pb-4 space-y-1 mt-1">
            {Object.entries(byCategory).sort((a, b) => b[1].total - a[1].total).slice(0, 3).map(([cat, data]) => {
              const style = CATEGORY_STYLES[cat] ?? { bg: '#EBF0F7', text: '#1B2A4A' }
              return (
                <div key={cat} className="flex items-center justify-between text-sm">
                  <span className="inline-block rounded px-2 py-0.5 text-xs font-semibold" style={{ backgroundColor: style.bg, color: style.text }}>{cat}</span>
                  <span className="font-bold text-[#D4A843]">{formatUSD(data.total)}/mo</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <SubscriptionCategoryCards byCategory={byCategory} />

      {/* Table — distributor column hidden */}
      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-base font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">Tất cả subscriptions</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F7FA] hover:bg-[#F5F7FA]">
                {['Dịch vụ', 'Danh mục', 'Chu kỳ', 'Chi phí/tháng', 'Gia hạn', 'Trạng thái', ''].map((h) => (
                  <TableHead key={h} className="text-[#1B2A4A] font-bold font-[family-name:var(--font-nunito)]">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((sub, idx) => {
                const style = CATEGORY_STYLES[sub.category] ?? { bg: '#EBF0F7', text: '#1B2A4A' }
                return (
                  <TableRow key={sub.id} className={`hover:bg-[#F5F7FA] ${idx % 2 === 1 ? 'bg-[#FAFBFC]' : 'bg-white'}`}>
                    <TableCell className="font-semibold text-[#1B2A4A]">{sub.name}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold" style={{ backgroundColor: style.bg, color: style.text }}>{sub.category}</span>
                    </TableCell>
                    <TableCell className="text-[#64748B]">{sub.frequency === 'Monthly' ? 'Hàng tháng' : 'Hàng năm'}</TableCell>
                    <TableCell className="text-right font-bold text-[#D4A843]">{formatUSD(sub.amount_per_month)}</TableCell>
                    <TableCell><RenewalBadge endDate={sub.end_date} /></TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold ${sub.status === 'Ongoing' ? 'bg-[#E0F2EE] text-[#008080]' : 'bg-[#FDECEC] text-[#EF4444]'}`}>
                        {sub.status === 'Ongoing' ? 'Đang dùng' : 'Đã hủy'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(sub)} title="Chỉnh sửa"
                          className="p-1.5 rounded hover:bg-[#E0F2EE] text-teal-600 transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => setDeleteId(sub.id)} title="Xóa"
                          className="p-1.5 rounded hover:bg-[#FDECEC] text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <SubscriptionForm open={formOpen} onOpenChange={setFormOpen} onSave={handleSave} initial={editing} />
      <DeleteConfirm
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        onConfirm={handleDelete}
        label={deleteTarget?.name ?? 'bản ghi này'}
      />
    </div>
  )
}
