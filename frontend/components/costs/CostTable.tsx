import { formatCurrency } from '@/lib/utils'
import type { ServiceCost } from '@/types/cost'

const CHART_COLORS = [
  'hsl(237 76% 54%)',
  'hsl(200 98% 44%)',
  'hsl(170 76% 34%)',
  'hsl(38 90% 50%)',
  'hsl(142 68% 40%)',
  'hsl(0 68% 51%)',
]

interface CostTableProps {
  services: ServiceCost[]
  totalCost: number
}

export function CostTable({ services, totalCost }: CostTableProps) {
  const sorted = [...services].sort((a, b) => b.cost - a.cost)

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
      <div className="px-5 py-4 border-b border-border">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
          Service Breakdown
        </p>
        <p className="text-sm font-medium text-foreground">Cost allocation by AWS service</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Service
              </th>
              <th className="text-right px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Cost
              </th>
              <th className="text-right px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Share
              </th>
              <th className="px-5 py-3 w-36" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map((svc, idx) => {
              const pct = totalCost > 0 ? (svc.cost / totalCost) * 100 : 0
              const color = CHART_COLORS[idx % CHART_COLORS.length]
              return (
                <tr key={svc.name} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm font-medium text-foreground">{svc.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right font-numeric text-sm font-semibold text-foreground">
                    {formatCurrency(svc.cost)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-xs font-medium text-muted-foreground font-numeric">
                      {pct.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-muted/20">
              <td className="px-5 py-3.5 text-xs font-semibold text-foreground">Total</td>
              <td className="px-5 py-3.5 text-right font-numeric text-sm font-bold text-foreground">
                {formatCurrency(totalCost)}
              </td>
              <td className="px-5 py-3.5 text-right text-xs text-muted-foreground font-numeric">
                100%
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
