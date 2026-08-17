import { formatCurrency } from '@/lib/utils'
import type { DemoServiceCost } from '@/types/cost'

interface ServiceTableProps {
  services: DemoServiceCost[]
  total: number
}

export function ServiceTable({ services, total }: ServiceTableProps) {
  const sorted = [...services].sort((a, b) => b.cost - a.cost)

  return (
    <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Service Detail</p>
        <p className="text-sm font-medium text-foreground">Cost breakdown by AWS service</p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Service</th>
            <th className="text-right px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Cost</th>
            <th className="text-right px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">% of Total</th>
            <th className="px-5 py-3 w-40" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((s, i) => {
            const pct = total > 0 ? (s.cost / total) * 100 : 0
            return (
              <tr
                key={s.name}
                className="border-b border-border/60 last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-xs font-medium text-foreground">{s.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className="text-xs font-semibold text-foreground font-numeric">{formatCurrency(s.cost, 0)}</span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className="text-xs text-muted-foreground font-numeric">{pct.toFixed(1)}%</span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: s.color }}
                    />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-border bg-muted/20">
            <td className="px-5 py-3.5">
              <span className="text-xs font-semibold text-foreground">Total</span>
            </td>
            <td className="px-5 py-3.5 text-right">
              <span className="text-xs font-bold text-foreground font-numeric">{formatCurrency(total, 0)}</span>
            </td>
            <td className="px-5 py-3.5 text-right">
              <span className="text-xs font-semibold text-muted-foreground">100%</span>
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
