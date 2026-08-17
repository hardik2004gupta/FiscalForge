import { cn, formatCurrency } from '@/lib/utils'
import type { DemoRDSInstance } from '@/types/resource'

interface RDSTableProps {
  instances: DemoRDSInstance[]
}

const STATUS_STYLE: Record<string, { dot: string; text: string }> = {
  available:   { dot: 'bg-success',           text: 'text-success' },
  stopped:     { dot: 'bg-muted-foreground',  text: 'text-muted-foreground' },
  'backing-up':{ dot: 'bg-primary',           text: 'text-primary' },
}

export function RDSTable({ instances }: RDSTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card shadow-card overflow-x-auto">
      <table className="w-full text-xs min-w-[640px]">
        <thead>
          <tr className="border-b border-border">
            {['Instance', 'Engine', 'Class', 'Status', 'Multi-AZ', 'Est. Cost'].map((h) => (
              <th
                key={h}
                className={cn(
                  'px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground',
                  h === 'Est. Cost' ? 'text-right' : 'text-left',
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {instances.map((inst) => {
            const s = STATUS_STYLE[inst.status] ?? STATUS_STYLE.stopped
            return (
              <tr key={inst.id} className="border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{inst.id}</p>
                  <p className="text-[10px] text-muted-foreground">{inst.region}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground capitalize">
                  {inst.engine} {inst.engine_version}
                </td>
                <td className="px-4 py-3 text-muted-foreground font-numeric">{inst.instance_class}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', s.dot)} />
                    <span className={cn('font-medium capitalize', s.text)}>{inst.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                    inst.multi_az ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground',
                  )}>
                    {inst.multi_az ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-numeric text-foreground font-medium">
                  {formatCurrency(inst.estimated_cost, 0)}/mo
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
