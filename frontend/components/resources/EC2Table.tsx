'use client'

import { useState } from 'react'
import { Square } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StopInstanceDialog } from './StopInstanceDialog'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { EC2Instance } from '@/types/resource'

interface EC2TableProps {
  instances: EC2Instance[]
}

export function EC2Table({ instances }: EC2TableProps) {
  const [stopTarget, setStopTarget] = useState<string | null>(null)
  const [stoppedIds, setStoppedIds] = useState<Set<string>>(new Set())

  function handleSuccess(id: string) {
    setStoppedIds((prev) => new Set(prev).add(id))
  }

  const displayInstances = instances.map((i) =>
    stoppedIds.has(i.id) ? { ...i, state: 'stopping' as const } : i,
  )

  return (
    <>
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
            EC2 Instances
          </p>
          <p className="text-sm font-medium text-foreground">
            {instances.length} instance{instances.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Instance ID', 'Type', 'State', 'Region', 'CPU Utilization', 'Est. Cost', ''].map(
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
              {displayInstances.map((inst) => (
                <tr key={inst.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold text-foreground">
                    {inst.id}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{inst.type}</td>
                  <td className="px-5 py-3.5">
                    <StateBadge state={inst.state} />
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{inst.region}</td>
                  <td className="px-5 py-3.5">
                    {inst.utilization != null ? (
                      <UtilBar value={inst.utilization} />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-numeric text-xs font-semibold text-foreground">
                    {inst.estimated_cost != null ? formatCurrency(inst.estimated_cost) + '/mo' : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {inst.state === 'running' && !stoppedIds.has(inst.id) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStopTarget(inst.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 px-2 text-[10px] text-destructive border-destructive/30 hover:bg-destructive/8 hover:border-destructive/50"
                      >
                        <Square className="h-2.5 w-2.5 mr-1" />
                        Stop
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <StopInstanceDialog
        instanceId={stopTarget}
        onClose={() => setStopTarget(null)}
        onSuccess={handleSuccess}
      />
    </>
  )
}

function StateBadge({ state }: { state: string }) {
  if (state === 'running') return <Badge variant="success">running</Badge>
  if (state === 'stopped') return <Badge variant="outline">stopped</Badge>
  if (state === 'stopping') return <Badge variant="warning">stopping</Badge>
  return <Badge variant="outline">{state}</Badge>
}

function UtilBar({ value }: { value: number }) {
  const color =
    value < 10
      ? 'bg-destructive'
      : value < 50
        ? 'bg-warning'
        : 'bg-success'
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden shrink-0">
        <div
          className={cn('h-full rounded-full transition-all', color)}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="text-xs font-numeric text-foreground">{value.toFixed(1)}%</span>
    </div>
  )
}
