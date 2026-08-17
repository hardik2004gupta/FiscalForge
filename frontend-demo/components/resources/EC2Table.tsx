'use client'

import { useState, useMemo } from 'react'
import { Search, Square, AlertCircle } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { StopDialog } from './StopDialog'
import type { DemoEC2Instance } from '@/types/resource'

interface EC2TableProps {
  instances: DemoEC2Instance[]
}

const STATE_STYLE: Record<string, { dot: string; text: string; label: string }> = {
  running:  { dot: 'bg-success',     text: 'text-success',           label: 'Running' },
  stopped:  { dot: 'bg-muted-foreground', text: 'text-muted-foreground', label: 'Stopped' },
  stopping: { dot: 'bg-warning',     text: 'text-warning',           label: 'Stopping' },
  pending:  { dot: 'bg-primary',     text: 'text-primary',           label: 'Pending' },
}

export function EC2Table({ instances: initial }: EC2TableProps) {
  const [instances, setInstances] = useState<DemoEC2Instance[]>(initial)
  const [query, setQuery] = useState('')
  const [stopTarget, setStopTarget] = useState<DemoEC2Instance | null>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return instances
    const q = query.toLowerCase()
    return instances.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q) ||
        i.type.toLowerCase().includes(q) ||
        i.region.toLowerCase().includes(q),
    )
  }, [instances, query])

  function handleStopConfirm(id: string) {
    setInstances((prev) =>
      prev.map((i) => (i.id === id ? { ...i, state: 'stopping' as const, utilization: null } : i)),
    )
  }

  return (
    <>
      <div className="mb-3">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search instances..."
            className="w-full rounded-md border border-border bg-card pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-card overflow-x-auto">
        <table className="w-full text-xs min-w-[700px]">
          <thead>
            <tr className="border-b border-border">
              {['Instance', 'Type', 'State', 'Region', 'CPU Util.', 'Est. Cost', ''].map((h) => (
                <th
                  key={h}
                  className={cn(
                    'px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground',
                    h === '' ? 'w-24' : 'text-left',
                    (h === 'CPU Util.' || h === 'Est. Cost') && 'text-right',
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((inst) => {
              const s = STATE_STYLE[inst.state] ?? STATE_STYLE.stopped
              const canStop = inst.state === 'running'
              const util = inst.utilization
              return (
                <tr key={inst.id} className="border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground truncate max-w-[160px]">{inst.name}</span>
                      {inst.has_recommendation && (
                        <AlertCircle className="h-3 w-3 text-warning shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-numeric">{inst.id}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-numeric">{inst.type}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', s.dot)} />
                      <span className={cn('font-medium', s.text)}>{s.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{inst.region}</td>
                  <td className="px-4 py-3 text-right">
                    {util !== null ? (
                      <span className={cn('font-numeric font-medium', util < 10 ? 'text-warning' : 'text-foreground')}>
                        {util.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-numeric text-foreground font-medium">
                    {formatCurrency(inst.estimated_cost, 0)}/mo
                  </td>
                  <td className="px-4 py-3 text-center">
                    {canStop && (
                      <button
                        onClick={() => setStopTarget(inst)}
                        className="flex items-center gap-1 text-[10px] font-semibold text-destructive/80 hover:text-destructive transition-colors mx-auto border border-destructive/20 hover:border-destructive/50 rounded px-2 py-1"
                      >
                        <Square className="h-3 w-3" />
                        Stop
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-xs">
                  No instances match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-muted-foreground mt-2">
        Showing {filtered.length} of {instances.length} instances
        {filtered.some((i) => i.has_recommendation) && (
          <> · <AlertCircle className="h-3 w-3 text-warning inline mx-0.5" /> indicates optimization recommendation</>
        )}
      </p>

      {stopTarget && (
        <StopDialog
          instanceId={stopTarget.id}
          instanceName={stopTarget.name}
          onClose={() => setStopTarget(null)}
          onConfirm={handleStopConfirm}
        />
      )}
    </>
  )
}
