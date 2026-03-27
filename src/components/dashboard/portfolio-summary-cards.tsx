import { Wallet, TrendingUp, CreditCard, Layers } from 'lucide-react'
import { formatShortVND, formatUSD } from '@/lib/format'

interface PortfolioSummaryCardsProps {
  totalAssets: number
  netWorth: number
  totalDebt: number
  channels: number
  usdRate: number
}

interface SummaryCardProps {
  icon: React.ReactNode
  label: string
  value: string
  subtext: string
  bgColor: string
  borderColor: string
  valueColor?: string
}

function SummaryCard({ icon, label, value, subtext, bgColor, borderColor, valueColor }: SummaryCardProps) {
  return (
    <div
      className="rounded-xl shadow-sm overflow-hidden"
      style={{ backgroundColor: bgColor, borderLeft: `4px solid ${borderColor}` }}
    >
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <p className="text-xs font-medium text-[#64748B] uppercase tracking-wide">{label}</p>
          <p
            className="text-2xl font-extrabold font-[family-name:var(--font-nunito)] tracking-tight leading-tight"
            style={{ color: valueColor ?? '#1B2A4A' }}
          >
            {value}
          </p>
          <p className="text-xs text-[#64748B]">{subtext}</p>
        </div>
        <div className="shrink-0 mt-0.5">{icon}</div>
      </div>
    </div>
  )
}

export function PortfolioSummaryCards({
  totalAssets,
  netWorth,
  totalDebt,
  channels,
  usdRate,
}: PortfolioSummaryCardsProps) {
  const totalUsd = usdRate > 0 ? Math.round(totalAssets / usdRate) : 0
  const netWorthPositive = netWorth >= 0

  const cards: SummaryCardProps[] = [
    {
      icon: <Wallet className="h-6 w-6 text-[#1B2A4A]" />,
      label: 'Tổng tài sản',
      value: formatShortVND(totalAssets),
      subtext: `≈ ${formatUSD(totalUsd)}`,
      bgColor: '#EBF0F7',
      borderColor: '#1B2A4A',
    },
    {
      icon: <TrendingUp className={`h-6 w-6 ${netWorthPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`} />,
      label: 'Tài sản ròng',
      value: formatShortVND(netWorth),
      subtext: netWorthPositive ? 'Tài sản > Nợ' : 'Nợ > Tài sản',
      bgColor: netWorthPositive ? '#E0F2EE' : '#FDECEC',
      borderColor: netWorthPositive ? '#22C55E' : '#EF4444',
      valueColor: netWorthPositive ? '#22C55E' : '#EF4444',
    },
    {
      icon: <CreditCard className="h-6 w-6 text-[#EF4444]" />,
      label: 'Nợ phải trả',
      value: formatShortVND(totalDebt),
      subtext: totalDebt > 0 ? 'Tổng dư nợ hiện tại' : 'Không có khoản vay',
      bgColor: '#FDECEC',
      borderColor: '#EF4444',
      valueColor: '#EF4444',
    },
    {
      icon: <Layers className="h-6 w-6 text-[#1B2A4A]" />,
      label: 'Kênh đầu tư',
      value: `${channels}`,
      subtext: 'Vàng, CCQ, Tiết kiệm, USD...',
      bgColor: '#EBF0F7',
      borderColor: '#5BA4A4',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <SummaryCard key={card.label} {...card} />
      ))}
    </div>
  )
}
