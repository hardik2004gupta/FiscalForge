'use client'

import { useState } from 'react'
import { Square } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StopInstanceDialog } from './StopInstanceDialog'
import { formatCurrency } from '@/lib/utils'
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
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">EC2 Instances</h3>
          <p className="text-xs text-muted-foreground">{instances.length} instance{instances.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {['Instance ID', 'Type', 'State', 'Region', 'CPU Util.', 'Est. Cost', ''].map((h) => (
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
              {displayInstances.map((inst) => (
                <tr key={inst.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-foreground">{inst.id}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{inst.type}</td>
                  <td className="px-5 py-3">
                    <StateBadge state={inst.state} />
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{inst.region}</td>
                  <td className="px-5 py-3 font-numeric text-xs text-foreground">
                    {inst.utilization != null ? (
                      <UtilBar value={inst.utilization} />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 font-numeric text-xs text-foreground">
                    {inst.estimated_cost != null ? formatCurrency(inst.estimated_cost) + '/mo' : '—'}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {inst.state === 'running' && !stoppedIds.has(inst.id) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStopTarget(inst.id)}
                        className="text-destructive border-destructive/30 hover:bg-destructive/8"
                      >
                        <Square className="h-3 w-3 mr-1" />
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
  const color = value < 10 ? 'bg-destructive' : value < 50 ? 'bg-warning' : 'bg-success'
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
      <span>{value.toFixed(1)}%</span>
    </div>
  )
}
