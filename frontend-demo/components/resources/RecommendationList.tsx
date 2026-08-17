import { cn, formatCurrency } from '@/lib/utils'
import type { DemoRecommendation } from '@/types/recommendation'

interface RecommendationListProps {
  recommendations: DemoRecommendation[]
  totalSavings: number
}

const SEV: Record<string, { dot: string; badge: string; badgeText: string }> = {
  high:   { dot: 'bg-destructive', badge: 'bg-destructive/10', badgeText: 'text-destructive' },
  medium: { dot: 'bg-warning',     badge: 'bg-warning/10',     badgeText: 'text-warning' },
  low:    { dot: 'bg-success',     badge: 'bg-success/10',     badgeText: 'text-success' },
}

const TYPE_LABEL: Record<string, string> = {
  EC2_RIGHTSIZING:          'EC2 Rightsizing',
  EC2_UNDERUTILIZED:        'EC2 Underutilized',
  S3_STORAGE_OPTIMIZATION:  'S3 Storage',
  NAT_GATEWAY_OPTIMIZATION: 'NAT Gateway',
}

export function RecommendationList({ recommendations, totalSavings }: RecommendationListProps) {
  return (
    <div>
      <div className="rounded-lg border border-border bg-card p-4 mb-4 shadow-card flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">Total Potential Savings</p>
          <p className="text-2xl font-bold text-success font-numeric">
            {formatCurrency(totalSavings, 0)}
            <span className="text-sm font-medium text-muted-foreground ml-1">/month</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">Opportunities</p>
          <p className="text-2xl font-bold text-foreground font-numeric">{recommendations.length}</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {recommendations.map((rec) => {
          const sev = SEV[rec.severity] ?? SEV.low
          return (
            <div key={rec.id} className="rounded-lg border border-border bg-card p-4 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className={cn('h-2 w-2 rounded-full shrink-0 mt-1', sev.dot)} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{rec.resource_name}</p>
                    <p className="text-[10px] text-muted-foreground font-numeric">{rec.resource_id}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-bold text-success font-numeric">
                    {formatCurrency(rec.estimated_savings, 0)}/mo
                  </p>
                  <div className="flex items-center gap-1.5 justify-end mt-1">
                    <span className={cn(
                      'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold capitalize',
                      sev.badge, sev.badgeText,
                    )}>
                      {rec.severity}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{TYPE_LABEL[rec.type] ?? rec.type}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground ml-4.5">{rec.reason}</p>
              {rec.detail && (
                <p className="text-[10px] text-muted-foreground/70 ml-4.5 mt-1">{rec.detail}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
