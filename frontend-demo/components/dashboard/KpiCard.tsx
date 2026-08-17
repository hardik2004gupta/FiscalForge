import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface KpiCardProps {
  label: string
  value: string
  sub?: string
  badge?: string
  badgeVariant?: 'up' | 'down' | 'neutral' | 'savings'
  icon?: ReactNode
}

export function KpiCard({ label, value, sub, badge, badgeVariant = 'neutral', icon }: KpiCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-card hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
        {icon && <div className="text-muted-foreground/50">{icon}</div>}
      </div>
      <p className="text-[2.25rem] font-semibold tracking-tight text-foreground font-numeric leading-none mb-2">
        {value}
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        {badge && (
          <span className={cn(
            'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold',
            badgeVariant === 'up' && 'bg-destructive/10 text-destructive',
            badgeVariant === 'down' && 'bg-success/10 text-success',
            badgeVariant === 'savings' && 'bg-success/10 text-success',
            badgeVariant === 'neutral' && 'bg-muted text-muted-foreground',
          )}>
            {badge}
          </span>
        )}
        {sub && <span className="text-[11px] text-muted-foreground">{sub}</span>}
      </div>
    </div>
  )
}
