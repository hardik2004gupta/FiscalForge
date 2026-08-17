'use client'

import { useState, useMemo } from 'react'
import { Search, AlertCircle } from 'lucide-react'
import { cn, formatCurrency, formatGB } from '@/lib/utils'
import type { DemoS3Bucket } from '@/types/resource'

interface S3TableProps {
  buckets: DemoS3Bucket[]
}

export function S3Table({ buckets }: S3TableProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return buckets
    const q = query.toLowerCase()
    return buckets.filter(
      (b) => b.name.toLowerCase().includes(q) || b.region.toLowerCase().includes(q),
    )
  }, [buckets, query])

  return (
    <>
      <div className="mb-3">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search buckets..."
            className="w-full rounded-md border border-border bg-card pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-card overflow-x-auto">
        <table className="w-full text-xs min-w-[580px]">
          <thead>
            <tr className="border-b border-border">
              {['Bucket', 'Region', 'Size', 'Objects', 'Est. Cost'].map((h) => (
                <th
                  key={h}
                  className={cn(
                    'px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground',
                    (h === 'Size' || h === 'Objects' || h === 'Est. Cost') ? 'text-right' : 'text-left',
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.name} className="border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-foreground truncate max-w-[220px]">{b.name}</span>
                    {b.has_recommendation && (
                      <AlertCircle className="h-3 w-3 text-warning shrink-0" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{b.region}</td>
                <td className="px-4 py-3 text-right text-foreground font-numeric">{formatGB(b.size_gb)}</td>
                <td className="px-4 py-3 text-right text-muted-foreground font-numeric">
                  {b.object_count.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-numeric text-foreground font-medium">
                  {formatCurrency(b.estimated_cost, 2)}/mo
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No buckets match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-muted-foreground mt-2">
        Showing {filtered.length} of {buckets.length} buckets
      </p>
    </>
  )
}
