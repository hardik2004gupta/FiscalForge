import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { formatCurrency, cn } from '@/lib/utils'
import type { DemoRecommendation } from '@/types/recommendation'

interface OptimizationSummaryProps {
  recommendations: DemoRecommendation[]
  totalSavings: number
}

const SEV_STYLE = {
  high:   { dot: 'bg-destructive', text: 'text-destructive', label: 'High' },
  medium: { dot: 'bg-warning',     text: 'text-warning',     label: 'Medium' },
  low:    { dot: 'bg-success',     text: 'text-success',     label: 'Low' },
}

export function OptimizationSummary({ recommendations, totalSavings }: OptimizationSummaryProps) {
  const high   = recommendations.filter((r) => r.severity === 'high').length
  const medium = recommendations.filter((r) => r.severity === 'medium').length
  const low    = recommendations.filter((r) => r.severity === 'low').length
  const top    = recommendations.slice(0, 3)

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Optimization</p>
          <p className="text-sm font-medium text-foreground">{recommendations.length} opportunities found</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Potential savings</p>
          <p className="text-lg font-bold text-success font-numeric">
            {formatCurrency(totalSavings, 0)}
            <span className="text-xs font-medium text-muted-foreground">/mo</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {([['high', high], ['medium', medium], ['low', low]] as const).filter(([, c]) => c > 0).map(([sev, count]) => {
          const style = SEV_STYLE[sev]
          return (
            <div key={sev} className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
              <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} />
              <span className={cn('text-[10px] font-semibold', style.text)}>{count} {style.label}</span>
            </div>
          )
        })}
      </div>

      <div className="space-y-2 mb-4">
        {top.map((rec) => (
          <div key={rec.id} className="flex items-center justify-between py-1.5 border-b border-border/60 last:border-0">
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{rec.resource_name}</p>
              <p className="text-[10px] text-muted-foreground">{rec.type.replace(/_/g, ' ')}</p>
            </div>
            <span className="text-xs font-semibold text-success font-numeric ml-3 shrink-0">
              {formatCurrency(rec.estimated_savings, 0)}/mo
            </span>
          </div>
        ))}
      </div>

      <Link href="/resources" className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
        View all recommendations
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
