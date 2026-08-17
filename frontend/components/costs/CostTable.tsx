import { formatCurrency } from '@/lib/utils'
import type { ServiceCost } from '@/types/cost'

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-6))',
]

interface CostTableProps {
  services: ServiceCost[]
  totalCost: number
}

export function CostTable({ services, totalCost }: CostTableProps) {
  const sorted = [...services].sort((a, b) => b.cost - a.cost)

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Service Breakdown</h3>
        <p className="text-xs text-muted-foreground">Cost allocation by AWS service</p>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Service
            </th>
            <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Cost
            </th>
            <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              % of Total
            </th>
            <th className="px-5 py-3 w-32" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sorted.map((svc, idx) => {
            const pct = totalCost > 0 ? (svc.cost / totalCost) * 100 : 0
            return (
              <tr key={svc.name} className="hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                    />
                    <span className="text-sm text-foreground">{svc.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-right font-numeric text-sm text-foreground">
                  {formatCurrency(svc.cost)}
                </td>
                <td className="px-5 py-3 text-right text-xs text-muted-foreground font-numeric">
                  {pct.toFixed(1)}%
                </td>
                <td className="px-5 py-3">
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: CHART_COLORS[idx % CHART_COLORS.length],
                      }}
                    />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-border bg-muted/40">
            <td className="px-5 py-3 text-xs font-semibold text-foreground">Total</td>
            <td className="px-5 py-3 text-right font-numeric text-sm font-semibold text-foreground">
              {formatCurrency(totalCost)}
            </td>
            <td className="px-5 py-3 text-right text-xs text-muted-foreground font-numeric">
              100%
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
