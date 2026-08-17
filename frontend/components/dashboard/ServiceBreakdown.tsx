import { formatCurrency } from '@/lib/utils'
import type { ServiceCost } from '@/types/cost'

// Ordered color palette — restrained, not rainbow
const BAR_COLORS = [
  'hsl(237 76% 54%)',   // indigo (primary)
  'hsl(200 98% 44%)',   // sky
  'hsl(170 76% 34%)',   // teal
  'hsl(38 90% 50%)',    // amber
  'hsl(142 68% 40%)',   // green
  'hsl(0 68% 51%)',     // red
]

interface ServiceBreakdownProps {
  services: ServiceCost[]
}

export function ServiceBreakdown({ services }: ServiceBreakdownProps) {
  const sorted = [...services].sort((a, b) => b.cost - a.cost).slice(0, 7)
  const total = sorted.reduce((sum, s) => sum + s.cost, 0)

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-card">
      <div className="mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Cost by Service
        </p>
        <p className="text-sm font-medium text-foreground">Top AWS services by spend</p>
      </div>

      <div className="space-y-3">
        {sorted.map((svc, idx) => {
          const pct = total > 0 ? (svc.cost / total) * 100 : 0
          const color = BAR_COLORS[idx % BAR_COLORS.length]

          return (
            <div key={svc.name} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="inline-block h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-medium text-foreground truncate max-w-[120px]">
                    {svc.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-semibold text-foreground font-numeric">
                    {formatCurrency(svc.cost)}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-numeric w-9 text-right">
                    {pct.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
