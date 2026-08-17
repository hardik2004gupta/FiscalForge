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
    <div className="rounded-lg border border-border bg-card p-5 shadow-card hover:shadow-card-hover transition-shadow duration-200 group">
      {/* Label row */}
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <div
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-md bg-muted/60 shrink-0',
            iconColor,
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Primary value — visually dominant */}
      <p className="text-[2.25rem] font-semibold tracking-tight text-foreground font-numeric leading-none">
        {value}
      </p>

      {/* Context */}
      <div className="mt-2.5">
        {change && (
          <p
            className={cn(
              'text-xs font-medium',
              changePositive === true && 'text-destructive',
              changePositive === false && 'text-success',
              changePositive === undefined && 'text-muted-foreground',
            )}
          >
            {change}
          </p>
        )}
        {description && !change && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
}
