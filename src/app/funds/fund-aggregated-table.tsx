"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatNumber, formatShortVND, formatPercent } from '@/lib/format'

const FUND_TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  'Cổ phiếu': { bg: '#EBF0F7', text: '#1B2A4A' },
  'Cân bằng':  { bg: '#E0F2EE', text: '#008080' },
  'Trái phiếu': { bg: '#FDF4E0', text: '#D4A843' },
}

export interface FundAggregate {
  fund_code: string
  fund_type: string
  total_invested: number
  total_qty: number
  avg_nav: number
  current_nav: number
  current_value: number
  pnl: number
  pnl_pct: number
}

interface Props {
  aggregated: FundAggregate[]
}

export function FundAggregatedTable({ aggregated }: Props) {
  const totalInvested = aggregated.reduce((s, a) => s + a.total_invested, 0)
  const totalCurrentValue = aggregated.reduce((s, a) => s + a.current_value, 0)
  const totalPnl = totalCurrentValue - totalInvested

  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#E2E8F0]">
        <h2 className="text-base font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">Tổng hợp theo mã quỹ</h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F5F7FA] hover:bg-[#F5F7FA]">
              {['Mã quỹ', 'Loại', 'Tổng đầu tư', 'Số CCQ', 'NAV TB', 'NAV hiện tại', 'Giá trị HT', 'Lãi/Lỗ', '%'].map((h) => (
                <TableHead key={h} className="text-[#1B2A4A] font-bold font-[family-name:var(--font-nunito)]">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {aggregated.map((a, idx) => {
              const style = FUND_TYPE_STYLES[a.fund_type] ?? { bg: '#EBF0F7', text: '#1B2A4A' }
              return (
                <TableRow key={a.fund_code} className={`hover:bg-[#F5F7FA] ${idx % 2 === 1 ? 'bg-[#FAFBFC]' : 'bg-white'}`}>
                  <TableCell className="font-mono font-bold text-[#1B2A4A]">{a.fund_code}</TableCell>
                  <TableCell><span className="inline-flex rounded px-2 py-0.5 text-xs font-semibold" style={{ backgroundColor: style.bg, color: style.text }}>{a.fund_type}</span></TableCell>
                  <TableCell className="text-right font-bold text-[#1B2A4A]">{formatShortVND(a.total_invested)}</TableCell>
                  <TableCell className="text-right text-[#64748B]">{formatNumber(a.total_qty, 2)}</TableCell>
                  <TableCell className="text-right text-[#64748B]">{formatNumber(a.avg_nav)}</TableCell>
                  <TableCell className="text-right text-[#64748B]">{formatNumber(a.current_nav)}</TableCell>
                  <TableCell className="text-right font-bold text-[#1B2A4A]">{formatShortVND(a.current_value)}</TableCell>
                  <TableCell className={`text-right font-semibold ${a.pnl >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                    {a.pnl >= 0 ? '+' : ''}{formatShortVND(a.pnl)}
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${a.pnl_pct >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                    {a.pnl_pct >= 0 ? '+' : ''}{formatPercent(a.pnl_pct, 1)}
                  </TableCell>
                </TableRow>
              )
            })}
            <TableRow className="bg-[#F5F7FA] font-bold border-t-2 border-[#E2E8F0]">
              <TableCell className="font-bold text-[#1B2A4A]" colSpan={2}>Tổng</TableCell>
              <TableCell className="text-right font-bold text-[#1B2A4A]">{formatShortVND(totalInvested)}</TableCell>
              <TableCell colSpan={3} />
              <TableCell className="text-right font-bold text-[#1B2A4A]">{formatShortVND(totalCurrentValue)}</TableCell>
              <TableCell className={`text-right font-bold ${totalPnl >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {totalPnl >= 0 ? '+' : ''}{formatShortVND(totalPnl)}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
