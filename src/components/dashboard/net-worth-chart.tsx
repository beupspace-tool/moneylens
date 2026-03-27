'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatShortVND } from '@/lib/format'

// Historical mock data — will be replaced when timestamp storage is added
const HISTORICAL_DATA = [
  { month: 'T10/24', value: 1_850_000_000 },
  { month: 'T11/24', value: 1_940_000_000 },
  { month: 'T12/24', value: 2_050_000_000 },
  { month: 'T1/25', value: 2_160_000_000 },
  { month: 'T2/25', value: 2_280_000_000 },
]

interface NetWorthChartProps {
  liveNetWorth: number
}

interface TooltipPayloadItem {
  value: number
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-medium text-[#64748B]">{label}</p>
      <p className="font-extrabold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
        {formatShortVND(payload[0].value)}
      </p>
    </div>
  )
}

export function NetWorthChart({ liveNetWorth }: NetWorthChartProps) {
  // Replace latest data point with live net worth value
  const data = [
    ...HISTORICAL_DATA,
    { month: 'T3/25', value: liveNetWorth > 0 ? liveNetWorth : 2_391_418_975 },
  ]

  return (
    <Card className="flex flex-col shadow-sm border border-[#E2E8F0]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
          Tăng trưởng tài sản ròng
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#008080" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#5BA4A4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#1B2A4A' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(v: number) => formatShortVND(v)}
                tick={{ fontSize: 10, fill: '#1B2A4A' }}
                tickLine={false}
                axisLine={false}
                width={68}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#008080"
                strokeWidth={2.5}
                fill="url(#netWorthGradient)"
                dot={{ r: 4, fill: '#D4A843', stroke: '#008080', strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: '#D4A843', stroke: '#008080', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
