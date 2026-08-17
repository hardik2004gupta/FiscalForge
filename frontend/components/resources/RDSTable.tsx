import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import type { RDSInstance } from '@/types/resource'

interface RDSTableProps {
  instances: RDSInstance[]
}

export function RDSTable({ instances }: RDSTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">RDS Databases</h3>
        <p className="text-xs text-muted-foreground">{instances.length} database{instances.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {['Identifier', 'Engine', 'Instance Class', 'Status', 'Region', 'Est. Cost/mo'].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {instances.map((db) => (
              <tr key={db.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 text-sm text-foreground font-medium">{db.id}</td>
                <td className="px-5 py-3 text-xs text-muted-foreground capitalize">{db.engine}</td>
                <td className="px-5 py-3 font-mono text-xs text-foreground">{db.instance_class}</td>
                <td className="px-5 py-3">
                  <Badge variant={db.status === 'available' ? 'success' : 'warning'}>
                    {db.status}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{db.region}</td>
                <td className="px-5 py-3 font-numeric text-xs text-foreground">
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
