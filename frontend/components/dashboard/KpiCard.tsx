import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: string
  change?: string
  changePositive?: boolean
  icon: LucideIcon
  iconColor?: string
  description?: string
}

export function KpiCard({
  label,
  value,
  change,
  changePositive,
  icon: Icon,
  iconColor = 'text-primary',
  description,
}: KpiCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground font-numeric">
            {value}
          </p>
          {change && (
            <p
              className={cn(
                'mt-1 text-xs font-medium',
                changePositive === true && 'text-destructive',
                changePositive === false && 'text-success',
                changePositive === undefined && 'text-muted-foreground',
              )}
            >
              {change}
            </p>
          )}
          {description && !change && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg bg-muted', iconColor)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  )
}
