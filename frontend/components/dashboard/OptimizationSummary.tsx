import Link from 'next/link'
import { ArrowRight, Server, HardDrive, Database, Wifi } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Recommendation } from '@/types/recommendation'

interface OptimizationSummaryProps {
  recommendations: Recommendation[]
  totalSavings: number
}

const TYPE_ICON: Record<string, React.ElementType> = {
  EC2_UNDERUTILIZED: Server,
  EC2_RIGHTSIZING: Server,
  S3_STORAGE: HardDrive,
  NAT_GATEWAY: Wifi,
  RDS: Database,
}

const SEVERITY_STYLES = {
  high: {
    dot: 'bg-destructive',
    text: 'text-destructive',
    label: 'HIGH',
  },
  medium: {
    dot: 'bg-warning',
    text: 'text-warning',
    label: 'MEDIUM',
  },
  low: {
    dot: 'bg-primary',
    text: 'text-primary',
    label: 'LOW',
  },
}

export function OptimizationSummary({ recommendations, totalSavings }: OptimizationSummaryProps) {
  const high = recommendations.filter((r) => r.severity === 'high').length
  const medium = recommendations.filter((r) => r.severity === 'medium').length
  const low = recommendations.filter((r) => r.severity === 'low').length
  const top = recommendations.slice(0, 3)

  return (
    <div className="rounded-lg border border-border bg-card shadow-card">
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-border">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            Optimization Opportunities
          </p>
          {totalSavings > 0 ? (
            <p className="text-2xl font-semibold text-foreground font-numeric leading-none">
              {formatCurrency(totalSavings)}
              <span className="text-sm font-medium text-muted-foreground ml-1">/mo</span>
            </p>
          ) : (
            <p className="text-sm font-medium text-muted-foreground">No opportunities found</p>
          )}
          {totalSavings > 0 && (
            <p className="text-xs text-success font-medium mt-1">potential monthly savings</p>
          )}
        </div>

        {/* Severity pills */}
        {recommendations.length > 0 && (
          <div className="flex items-center gap-2">
            {[
              { count: high, key: 'high' },
              { count: medium, key: 'medium' },
              { count: low, key: 'low' },
            ]
              .filter((s) => s.count > 0)
              .map(({ count, key }) => {
                const style = SEVERITY_STYLES[key as keyof typeof SEVERITY_STYLES]
                return (
                  <div
                    key={key}
                    className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1"
                  >
                    <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} />
                    <span className={cn('text-[10px] font-semibold', style.text)}>
                      {count} {style.label}
                    </span>
                  </div>
                )
              })}
          </div>
        )}
      </div>

      {/* Top recommendations */}
      {top.length > 0 && (
        <div className="divide-y divide-border">
          {top.map((rec) => {
            const Icon = TYPE_ICON[rec.type] ?? Server
            const sev = SEVERITY_STYLES[rec.severity as keyof typeof SEVERITY_STYLES] ?? SEVERITY_STYLES.low

            return (
              <div
                key={rec.id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted shrink-0">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={cn('text-[10px] font-semibold uppercase tracking-wide', sev.text)}>
                      {rec.severity}
                    </span>
                    <span className="text-[10px] text-muted-foreground">·</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      {rec.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-foreground truncate">{rec.resource_id}</p>
                </div>
                {rec.estimated_savings > 0 && (
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-success font-numeric">
                      {formatCurrency(rec.estimated_savings)}/mo
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Footer link */}
      {recommendations.length > 0 && (
        <div className="px-5 py-3 border-t border-border">
          <Link
            href="/resources"
            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors w-fit"
          >
            View all {recommendations.length} recommendation{recommendations.length !== 1 ? 's' : ''}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {recommendations.length === 0 && (
        <div className="px-5 py-8 text-center">
          <p className="text-xs text-muted-foreground">No optimization opportunities detected.</p>
        </div>
      )}
    </div>
  )
}
