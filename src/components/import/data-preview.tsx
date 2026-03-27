'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatVND, formatDate } from '@/lib/format'
import type { ParsedData } from '@/lib/import/excel-parser'

interface DataPreviewProps {
  data: ParsedData
  selected: Set<keyof ParsedData>
  onToggle: (key: keyof ParsedData) => void
}

const PREVIEW_LIMIT = 10

const TAB_LABELS: Record<keyof ParsedData, string> = {
  gold: 'Vàng',
  funds: 'Chứng chỉ quỹ',
  savings: 'Tiết kiệm',
  usd: 'USD',
  insurance: 'Bảo hiểm',
  subscriptions: 'Subscriptions',
  cash: 'Tiền mặt',
  loan_payments: 'Trả nợ',
}

const TAB_KEYS = Object.keys(TAB_LABELS) as (keyof ParsedData)[]

export function DataPreview({ data, selected, onToggle }: DataPreviewProps) {
  const [tab, setTab] = useState<string>('gold')

  return (
    <div className="space-y-4">
      {/* Selection toggles */}
      <div className="flex flex-wrap gap-2 rounded-xl border border-[#E2E8F0] bg-[#F5F7FA] p-4">
        <p className="w-full text-xs font-semibold text-[#64748B] mb-1">
          Chọn loại dữ liệu cần import:
        </p>
        {TAB_KEYS.map((key) => {
          const count = data[key].length
          const isSelected = selected.has(key)
          return (
            <button
              key={key}
              type="button"
              onClick={() => onToggle(key)}
              disabled={count === 0}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors
                ${isSelected
                  ? 'border-[#008080] bg-[#E0F2EE] text-[#008080]'
                  : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#008080]/50'
                }
                disabled:pointer-events-none disabled:opacity-40`}
            >
              <span
                className={`size-3.5 shrink-0 rounded-sm border flex items-center justify-center
                  ${isSelected ? 'border-[#008080] bg-[#008080]' : 'border-[#64748B]'}`}
              >
                {isSelected && (
                  <svg viewBox="0 0 10 10" className="size-2.5 fill-none stroke-white stroke-2">
                    <polyline points="1.5,5 4,7.5 8.5,2.5" />
                  </svg>
                )}
              </span>
              {TAB_LABELS[key]}
              <span className="opacity-60">({count})</span>
            </button>
          )
        })}
      </div>

      {/* Tabs preview with teal active state */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap h-auto gap-1 bg-[#F5F7FA] p-1 rounded-lg">
          {TAB_KEYS.map((key) => (
            <TabsTrigger
              key={key}
              value={key}
              className="text-xs data-[state=active]:bg-[#008080] data-[state=active]:text-white data-[state=active]:shadow-none rounded"
            >
              {TAB_LABELS[key]}
              <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-black/10 px-1.5 py-0.5 text-[10px] font-semibold">
                {data[key].length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="gold">
          <PreviewTable
            rows={data.gold.slice(0, PREVIEW_LIMIT)}
            columns={['name', 'purchase_date', 'qty_chi', 'unit_price', 'amount_vnd', 'location']}
            headers={['Tên', 'Ngày mua', 'Số lượng', 'Đơn giá', 'Thành tiền', 'Nơi mua']}
            formatters={{ purchase_date: (v) => formatDate(String(v)), unit_price: (v) => formatVND(Number(v)), amount_vnd: (v) => formatVND(Number(v)) }}
          />
        </TabsContent>

        <TabsContent value="funds">
          <PreviewTable
            rows={data.funds.slice(0, PREVIEW_LIMIT)}
            columns={['fund_code', 'fund_type', 'amount_vnd', 'qty_units', 'nav', 'order_date', 'manager']}
            headers={['Mã quỹ', 'Loại', 'Số tiền', 'Số CCQ', 'NAV', 'Ngày đặt', 'Quản lý']}
            formatters={{ amount_vnd: (v) => formatVND(Number(v)), order_date: (v) => formatDate(String(v)) }}
          />
        </TabsContent>

        <TabsContent value="savings">
          <PreviewTable
            rows={data.savings.slice(0, PREVIEW_LIMIT)}
            columns={['bank', 'amount', 'period_months', 'interest_rate', 'start_date', 'end_date', 'status']}
            headers={['Ngân hàng', 'Số tiền', 'Kỳ hạn (tháng)', 'Lãi suất', 'Từ ngày', 'Đến ngày', 'Trạng thái']}
            formatters={{ amount: (v) => formatVND(Number(v)), start_date: (v) => formatDate(String(v)), end_date: (v) => formatDate(String(v)) }}
          />
        </TabsContent>

        <TabsContent value="usd">
          <PreviewTable
            rows={data.usd.slice(0, PREVIEW_LIMIT)}
            columns={['date', 'amount_usd', 'exchange_rate_at_receipt', 'amount_vnd_at_receipt']}
            headers={['Ngày', 'Số USD', 'Tỷ giá', 'Thành VND']}
            formatters={{ date: (v) => formatDate(String(v)), amount_vnd_at_receipt: (v) => formatVND(Number(v)) }}
          />
        </TabsContent>

        <TabsContent value="insurance">
          <PreviewTable
            rows={data.insurance.slice(0, PREVIEW_LIMIT)}
            columns={['product_name', 'payment_date', 'amount']}
            headers={['Sản phẩm', 'Ngày đóng', 'Giá trị']}
            formatters={{ payment_date: (v) => formatDate(String(v)), amount: (v) => formatVND(Number(v)) }}
          />
        </TabsContent>

        <TabsContent value="subscriptions">
          <PreviewTable
            rows={data.subscriptions.slice(0, PREVIEW_LIMIT)}
            columns={['name', 'category', 'frequency', 'amount_usd', 'status', 'start_date']}
            headers={['Tên', 'Danh mục', 'Tần suất', 'Giá (USD)', 'Trạng thái', 'Từ ngày']}
            formatters={{ start_date: (v) => formatDate(String(v)) }}
          />
        </TabsContent>

        <TabsContent value="cash">
          <PreviewTable
            rows={data.cash.slice(0, PREVIEW_LIMIT)}
            columns={['bank', 'amount', 'snapshot_date']}
            headers={['Ngân hàng', 'Số dư', 'Ngày']}
            formatters={{ amount: (v) => formatVND(Number(v)), snapshot_date: (v) => formatDate(String(v)) }}
          />
        </TabsContent>

        <TabsContent value="loan_payments">
          <PreviewTable
            rows={data.loan_payments.slice(0, PREVIEW_LIMIT)}
            columns={['date', 'principal_paid', 'interest_paid', 'balance_after']}
            headers={['Ngày', 'Trả gốc', 'Trả lãi', 'Dư nợ còn lại']}
            formatters={{
              date: (v) => formatDate(String(v)),
              principal_paid: (v) => formatVND(Number(v)),
              interest_paid: (v) => formatVND(Number(v)),
              balance_after: (v) => formatVND(Number(v)),
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface PreviewTableProps {
  rows: unknown[]
  columns: string[]
  headers: string[]
  formatters?: Record<string, (v: unknown) => string>
}

function PreviewTable({ rows, columns, headers, formatters = {} }: PreviewTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-[#E2E8F0] p-8 text-center text-sm text-[#64748B]">
        Không có dữ liệu
      </div>
    )
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F5F7FA] hover:bg-[#F5F7FA]">
            {headers.map((h) => (
              <TableHead
                key={h}
                className="whitespace-nowrap text-xs font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]"
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i} className={`hover:bg-[#F5F7FA] ${i % 2 === 1 ? 'bg-[#FAFBFC]' : 'bg-white'}`}>
              {columns.map((col) => {
                const rec = row as Record<string, unknown>
                const raw = rec[col]
                const fmt = formatters[col]
                const display = fmt ? fmt(raw) : String(raw ?? '')
                return (
                  <TableCell key={String(col)} className="whitespace-nowrap text-xs text-[#1B2A4A]">
                    {display}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
