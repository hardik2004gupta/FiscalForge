import { AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import type { Recommendation } from '@/types/recommendation'

interface RecommendationCardProps {
  recommendation: Recommendation
}

const SEVERITY_CONFIG = {
  high: {
    icon: AlertTriangle,
    badgeVariant: 'destructive' as const,
    borderClass: 'border-l-destructive/50',
  },
  medium: {
    icon: AlertCircle,
    badgeVariant: 'warning' as const,
    borderClass: 'border-l-warning/50',
  },
  low: {
    icon: Info,
    badgeVariant: 'default' as const,
    borderClass: 'border-l-primary/50',
  },
}

export function RecommendationCard({ recommendation: rec }: RecommendationCardProps) {
  const config = SEVERITY_CONFIG[rec.severity as keyof typeof SEVERITY_CONFIG] ?? SEVERITY_CONFIG.low
  const Icon = config.icon

  return (
    <div
      className={`rounded-lg border border-border bg-card border-l-[3px] ${config.borderClass} p-4`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <Icon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-muted-foreground">{rec.resource_id}</span>
              <Badge variant={config.badgeVariant}>{rec.severity}</Badge>
              <Badge variant="outline">{rec.type.replace(/_/g, ' ')}</Badge>
            </div>
            <p className="mt-1 text-sm text-foreground">{rec.reason}</p>
          </div>
        </div>
        {rec.estimated_savings > 0 && (
          <div className="shrink-0 text-right">
            <p className="text-xs text-muted-foreground">Est. savings</p>
            <p className="text-sm font-semibold text-success font-numeric">
              {formatCurrency(rec.estimated_savings)}/mo
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
