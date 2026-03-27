"use client"

import { Pencil, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatVND, formatDate, formatNumber } from '@/lib/format'
import type { FundTransaction } from '@/lib/types'

const FUND_TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  'Cổ phiếu': { bg: '#EBF0F7', text: '#1B2A4A' },
  'Cân bằng':  { bg: '#E0F2EE', text: '#008080' },
  'Trái phiếu': { bg: '#FDF4E0', text: '#D4A843' },
}

interface Props {
  items: FundTransaction[]
  totalInvested: number
  onEdit: (t: FundTransaction) => void
  onDelete: (id: string) => void
}

export function FundDetailTable({ items, totalInvested, onEdit, onDelete }: Props) {
  const sorted = [...items].sort((a, b) => b.match_date.localeCompare(a.match_date))

  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#E2E8F0]">
        <h2 className="text-base font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">Chi tiết giao dịch</h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F5F7FA] hover:bg-[#F5F7FA]">
              {['Mã quỹ', 'Loại', 'Loại GD', 'Số tiền', 'Số lượng CCQ', 'NAV', 'Ngày khớp lệnh', 'Quản lý bởi', ''].map((h) => (
                <TableHead key={h} className="text-[#1B2A4A] font-bold font-[family-name:var(--font-nunito)]">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((t, idx) => {
              const style = FUND_TYPE_STYLES[t.fund_type] ?? { bg: '#EBF0F7', text: '#1B2A4A' }
              const isBuy = (t.transaction_type ?? 'buy') === 'buy'
              return (
                <TableRow key={t.id} className={`hover:bg-[#F5F7FA] ${idx % 2 === 1 ? 'bg-[#FAFBFC]' : 'bg-white'}`}>
                  <TableCell className="font-mono font-bold text-[#1B2A4A]">{t.fund_code}</TableCell>
                  <TableCell>
                    <span className="inline-flex rounded px-2 py-0.5 text-xs font-semibold" style={{ backgroundColor: style.bg, color: style.text }}>{t.fund_type}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold ${isBuy ? 'bg-[#E0F2EE] text-[#008080]' : 'bg-[#FDECEC] text-[#EF4444]'}`}>
                      {isBuy ? 'Mua' : 'Bán'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-bold text-[#1B2A4A]">{formatVND(t.amount_vnd)}</TableCell>
                  <TableCell className="text-right text-[#64748B]">{formatNumber(t.qty_units, 2)}</TableCell>
                  <TableCell className="text-right text-[#64748B]">{formatNumber(t.nav)}</TableCell>
                  <TableCell className="text-[#64748B]">{formatDate(t.match_date)}</TableCell>
                  <TableCell className="text-[#64748B]">{t.manager}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button onClick={() => onEdit(t)} title="Chỉnh sửa" className="p-1.5 rounded hover:bg-[#E0F2EE] text-teal-600 transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => onDelete(t.id)} title="Xóa" className="p-1.5 rounded hover:bg-[#FDECEC] text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            <TableRow className="bg-[#F5F7FA] font-bold border-t-2 border-[#E2E8F0]">
              <TableCell className="font-bold text-[#1B2A4A]" colSpan={3}>Tổng</TableCell>
              <TableCell className="text-right font-bold text-[#1B2A4A]">{formatVND(totalInvested)}</TableCell>
              <TableCell colSpan={5} />
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
