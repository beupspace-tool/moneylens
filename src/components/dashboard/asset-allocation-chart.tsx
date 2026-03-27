'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ASSET_COLORS } from '@/lib/constants'
import { formatShortVND } from '@/lib/format'

interface AssetAllocationChartProps {
  data: { name: string; key: string; value: number }[]
  total: number
  totalDebt?: number
}

const LABELS: Record<string, string> = {
  gold: 'Vàng',
  funds: 'CCQ',
  savings: 'Tiết kiệm',
  usd: 'USD',
  insurance: 'Bảo hiểm',
  cash: 'Tiền mặt',
}

interface TooltipPayloadItem {
  name: string
  value: number
  payload: { key: string }
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
}) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-[#1B2A4A]">{LABELS[item.payload.key] ?? item.name}</p>
      <p className="text-[#64748B] mt-0.5">{formatShortVND(item.value)}</p>
    </div>
  )
}

export function AssetAllocationChart({ data, total, totalDebt }: AssetAllocationChartProps) {
  return (
    <Card className="flex flex-col shadow-sm border border-[#E2E8F0]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
          Phân bổ tài sản
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="relative h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="52%"
                outerRadius="78%"
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.key}
                    fill={ASSET_COLORS[entry.key] ?? '#94a3b8'}
                    stroke="white"
                    strokeWidth={1.5}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value: string, entry: { payload?: { key?: string } }) => {
                  const key = entry?.payload?.key ?? value
                  const item = data.find((d) => d.key === key)
                  const pct = item && total > 0 ? ((item.value / total) * 100).toFixed(1) : '0'
                  return (
                    <span className="text-xs text-[#1B2A4A]">
                      {LABELS[key] ?? value}{' '}
                      <span className="text-[#64748B]">{pct}%</span>
                    </span>
                  )
                }}
                iconSize={10}
                wrapperStyle={{ fontSize: '11px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[11px] text-[#64748B]">Tổng tài sản</p>
            <p className="text-sm font-extrabold text-[#D4A843] font-[family-name:var(--font-nunito)]">
              {formatShortVND(total)}
            </p>
          </div>
        </div>
        {totalDebt != null && totalDebt > 0 && (
          <div className="mt-2 flex items-center justify-between rounded-md bg-[#FDECEC] px-3 py-1.5">
            <span className="text-[11px] text-[#64748B]">Nợ phải trả (không tính trong biểu đồ)</span>
            <span className="text-[11px] font-bold text-[#EF4444]">{formatShortVND(totalDebt)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
