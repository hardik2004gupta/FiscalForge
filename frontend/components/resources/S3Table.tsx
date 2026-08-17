import { formatCurrency, formatBytes, formatNumber } from '@/lib/utils'
import type { S3Bucket } from '@/types/resource'

interface S3TableProps {
  buckets: S3Bucket[]
}

export function S3Table({ buckets }: S3TableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
      <div className="px-5 py-4 border-b border-border">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
          S3 Buckets
        </p>
        <p className="text-sm font-medium text-foreground">
          {buckets.length} bucket{buckets.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['Bucket Name', 'Region', 'Size', 'Objects', 'Est. Cost'].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {buckets.map((b) => (
              <tr key={b.name} className="hover:bg-muted/20 transition-colors">
                <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{b.name}</td>
                <td className="px-5 py-3.5 text-xs text-muted-foreground">{b.region}</td>
                <td className="px-5 py-3.5 font-numeric text-xs font-semibold text-foreground">
                  {formatBytes(b.size_gb)}
                </td>
                <td className="px-5 py-3.5 font-numeric text-xs text-muted-foreground">
                  {formatNumber(b.object_count)}
                </td>
                <td className="px-5 py-3.5 font-numeric text-xs font-semibold text-foreground">
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
