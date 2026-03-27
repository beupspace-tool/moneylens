import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  sub?: string
  valueClassName?: string
  // BEUP design tokens
  borderColor?: string   // e.g. '#D4A843'
  bgColor?: string       // e.g. '#FDF4E0'
  icon?: React.ReactNode
  iconColor?: string     // e.g. '#D4A843'
}

export function StatCard({
  label,
  value,
  sub,
  valueClassName,
  borderColor,
  bgColor,
  icon,
}: StatCardProps) {
  return (
    <Card
      className={cn('overflow-hidden shadow-sm border-0')}
      style={{
        backgroundColor: bgColor ?? '#FFFFFF',
        borderLeft: borderColor ? `4px solid ${borderColor}` : undefined,
      }}
    >
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-sm text-[#64748B]">{label}</p>
            <p
              className={cn(
                'text-2xl font-extrabold font-[family-name:var(--font-nunito)] tracking-tight',
                valueClassName
              )}
            >
              {value}
            </p>
            {sub && <p className="text-xs text-[#64748B] mt-0.5">{sub}</p>}
          </div>
          {icon && (
            <div className="shrink-0 mt-0.5">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
