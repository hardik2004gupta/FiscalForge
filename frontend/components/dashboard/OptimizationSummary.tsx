import Link from 'next/link'
import { AlertTriangle, AlertCircle, Info, ChevronRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Recommendation } from '@/types/recommendation'

interface OptimizationSummaryProps {
  recommendations: Recommendation[]
  totalSavings: number
}

export function OptimizationSummary({ recommendations, totalSavings }: OptimizationSummaryProps) {
  const high = recommendations.filter((r) => r.severity === 'high').length
  const medium = recommendations.filter((r) => r.severity === 'medium').length
  const low = recommendations.filter((r) => r.severity === 'low').length

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Optimization Opportunities</h3>
          <p className="text-xs text-muted-foreground">
            Potential savings: <span className="text-success font-semibold font-numeric">{formatCurrency(totalSavings)}/mo</span>
          </p>
        </div>
        <Link
          href="/resources"
          className="flex items-center text-xs text-primary hover:underline"
        >
          View all <ChevronRight className="h-3 w-3 ml-0.5" />
        </Link>
      </div>

      <div className="space-y-2">
        <SeverityRow
          icon={AlertTriangle}
          label="High severity"
          count={high}
          colorClass="text-destructive"
          bgClass="bg-destructive/8"
        />
        <SeverityRow
          icon={AlertCircle}
          label="Medium severity"
          count={medium}
          colorClass="text-warning"
          bgClass="bg-warning/8"
        />
        <SeverityRow
          icon={Info}
          label="Low severity"
          count={low}
          colorClass="text-primary"
          bgClass="bg-primary/8"
        />
      </div>

      {recommendations.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">
          No optimization opportunities found.
        </p>
      )}
    </div>
  )
}

function SeverityRow({
  icon: Icon,
  label,
  count,
  colorClass,
  bgClass,
}: {
  icon: React.ElementType
  label: string
  count: number
  colorClass: string
  bgClass: string
}) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50">
      <div className="flex items-center gap-2">
        <div className={`flex h-6 w-6 items-center justify-center rounded-md ${bgClass}`}>
          <Icon className={`h-3.5 w-3.5 ${colorClass}`} />
        </div>
        <span className="text-xs text-foreground">{label}</span>
      </div>
      <span className={`text-sm font-semibold font-numeric ${colorClass}`}>{count}</span>
    </div>
  )
}
