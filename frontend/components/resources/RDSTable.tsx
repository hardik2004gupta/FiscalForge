import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import type { RDSInstance } from '@/types/resource'

interface RDSTableProps {
  instances: RDSInstance[]
}

export function RDSTable({ instances }: RDSTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
      <div className="px-5 py-4 border-b border-border">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
          RDS Databases
        </p>
        <p className="text-sm font-medium text-foreground">
          {instances.length} database{instances.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['Identifier', 'Engine', 'Instance Class', 'Status', 'Region', 'Est. Cost/mo'].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest whitespace-nowrap"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {instances.map((db) => (
              <tr key={db.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{db.id}</td>
                <td className="px-5 py-3.5 text-xs text-muted-foreground capitalize">{db.engine}</td>
                <td className="px-5 py-3.5 font-mono text-xs text-foreground">{db.instance_class}</td>
                <td className="px-5 py-3.5">
                  <Badge variant={db.status === 'available' ? 'success' : 'warning'}>
                    {db.status}
                  </Badge>
                </td>
                <td className="px-5 py-3.5 text-xs text-muted-foreground">{db.region}</td>
                <td className="px-5 py-3.5 font-numeric text-xs font-semibold text-foreground">
                  {db.estimated_cost != null ? formatCurrency(db.estimated_cost) + '/mo' : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
