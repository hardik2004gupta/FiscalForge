import { formatCurrency, formatBytes, formatNumber } from '@/lib/utils'
import type { S3Bucket } from '@/types/resource'

interface S3TableProps {
  buckets: S3Bucket[]
}

export function S3Table({ buckets }: S3TableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">S3 Buckets</h3>
        <p className="text-xs text-muted-foreground">{buckets.length} bucket{buckets.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {['Bucket Name', 'Region', 'Size', 'Objects', 'Est. Cost'].map((h) => (
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
            {buckets.map((b) => (
              <tr key={b.name} className="hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 text-sm text-foreground font-medium">{b.name}</td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{b.region}</td>
                <td className="px-5 py-3 font-numeric text-xs text-foreground">
                  {formatBytes(b.size_gb)}
                </td>
                <td className="px-5 py-3 font-numeric text-xs text-muted-foreground">
                  {formatNumber(b.object_count)}
                </td>
                <td className="px-5 py-3 font-numeric text-xs text-foreground">
                  {b.estimated_cost != null ? formatCurrency(b.estimated_cost) + '/mo' : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
