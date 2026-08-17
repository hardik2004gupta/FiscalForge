import { formatCurrency } from '@/lib/utils'
import type { DemoServiceCost } from '@/types/cost'

interface ServiceBreakdownProps {
  services: DemoServiceCost[]
}

export function ServiceBreakdown({ services }: ServiceBreakdownProps) {
  const sorted = [...services].sort((a, b) => b.cost - a.cost)
  const total = sorted.reduce((sum, s) => sum + s.cost, 0)

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-card h-full">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Service Breakdown</p>
      <p className="text-sm font-medium text-foreground mb-5">Cost by AWS service</p>
      <div className="space-y-3.5">
        {sorted.map((s) => {
          const pct = total > 0 ? (s.cost / total) * 100 : 0
          return (
            <div key={s.name}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-xs font-medium text-foreground truncate max-w-[130px]">{s.name}</span>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <span className="text-[10px] text-muted-foreground">{pct.toFixed(1)}%</span>
                  <span className="text-xs font-semibold text-foreground font-numeric">{formatCurrency(s.cost, 0)}</span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: s.color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
