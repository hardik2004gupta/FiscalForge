import { Server, HardDrive, Wifi, Database } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Recommendation } from '@/types/recommendation'

interface RecommendationCardProps {
  recommendation: Recommendation
}

const TYPE_ICON: Record<string, React.ElementType> = {
  EC2_UNDERUTILIZED: Server,
  EC2_RIGHTSIZING: Server,
  S3_STORAGE: HardDrive,
  NAT_GATEWAY: Wifi,
  RDS: Database,
}

const SEVERITY_CONFIG = {
  high: {
    pill: 'bg-destructive/10 text-destructive border-destructive/20',
    accent: 'bg-destructive',
    label: 'HIGH',
  },
  medium: {
    pill: 'bg-warning/10 text-warning border-warning/20',
    accent: 'bg-warning',
    label: 'MEDIUM',
  },
  low: {
    pill: 'bg-primary/10 text-primary border-primary/20',
    accent: 'bg-primary',
    label: 'LOW',
  },
}

export function RecommendationCard({ recommendation: rec }: RecommendationCardProps) {
  const config = SEVERITY_CONFIG[rec.severity as keyof typeof SEVERITY_CONFIG] ?? SEVERITY_CONFIG.low
  const Icon = TYPE_ICON[rec.type] ?? Server

  return (
    <div className="group flex gap-4 rounded-lg border border-border bg-card p-4 shadow-card hover:shadow-card-hover transition-shadow duration-200">
      {/* Severity accent */}
      <div
        className={cn('w-0.5 rounded-full shrink-0 self-stretch', config.accent)}
        aria-hidden="true"
      />

      {/* Icon */}
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={cn(
                  'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                  config.pill,
                )}
              >
                {config.label}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                {rec.type.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="font-mono text-xs text-foreground font-semibold">{rec.resource_id}</p>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{rec.reason}</p>
          </div>

          {rec.estimated_savings > 0 && (
            <div className="shrink-0 text-right">
              <p className="text-[10px] text-muted-foreground mb-0.5">Est. savings</p>
              <p className="text-base font-semibold text-success font-numeric leading-none">
                {formatCurrency(rec.estimated_savings)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">/month</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
