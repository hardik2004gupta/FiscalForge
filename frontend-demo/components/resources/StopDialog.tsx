'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StopDialogProps {
  instanceId: string
  instanceName: string
  onClose: () => void
  onConfirm: (id: string) => void
}

export function StopDialog({ instanceId, instanceName, onClose, onConfirm }: StopDialogProps) {
  const [phase, setPhase] = useState<'confirm' | 'stopping' | 'done'>('confirm')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && phase === 'confirm') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [phase, onClose])

  function handleConfirm() {
    setPhase('stopping')
    // Simulate Lambda call — no real AWS call
    setTimeout(() => {
      setPhase('done')
      setTimeout(() => {
        onConfirm(instanceId)
        onClose()
      }, 900)
    }, 1800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        aria-hidden="true"
        onClick={phase === 'confirm' ? onClose : undefined}
      />
      <div className="relative z-10 w-full max-w-sm rounded-lg border border-border bg-card shadow-dialog">
        <div className="p-6">
          {phase === 'confirm' && (
            <>
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-4.5 w-4.5 text-destructive" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Stop EC2 Instance</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    This will stop the instance. It can be restarted later.
                  </p>
                </div>
              </div>

              <div className="rounded-md border border-border bg-muted/30 px-3.5 py-2.5 mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Instance</p>
                <p className="text-xs font-semibold text-foreground">{instanceName}</p>
                <p className="text-[10px] text-muted-foreground font-numeric">{instanceId}</p>
              </div>

              <p className="text-[11px] text-muted-foreground mb-5 leading-relaxed">
                This simulates the human-approval step in FiscalForge&apos;s AI safety boundary.
                In production this calls{' '}
                <code className="font-mono text-[10px] bg-muted rounded px-1 py-0.5">POST /api/actions/ec2/stop</code>.
              </p>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
                <Button variant="destructive" size="sm" onClick={handleConfirm}>Stop Instance</Button>
              </div>
            </>
          )}

          {phase === 'stopping' && (
            <div className="flex flex-col items-center py-6 gap-3">
              <Loader2 className="h-7 w-7 text-primary animate-spin" />
              <p className="text-sm font-medium text-foreground">Stopping instance…</p>
              <p className="text-xs text-muted-foreground">
                Calling <code className="font-mono text-[10px]">ec2.stop_instances</code> via Lambda
              </p>
            </div>
          )}

          {phase === 'done' && (
            <div className="flex flex-col items-center py-6 gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                <span className="text-success text-xl font-bold">✓</span>
              </div>
              <p className="text-sm font-semibold text-foreground">Instance stopping</p>
              <p className="text-xs text-muted-foreground font-numeric">{instanceId} → stopping</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
