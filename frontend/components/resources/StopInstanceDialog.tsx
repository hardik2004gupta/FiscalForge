'use client'

import { useState } from 'react'
import { OctagonX, Server } from 'lucide-react'
import { Dialog, DialogActions } from '@/components/ui/dialog'
import { stopEC2Instance } from '@/lib/api'

interface StopInstanceDialogProps {
  instanceId: string | null
  onClose: () => void
  onSuccess: (instanceId: string) => void
}

export function StopInstanceDialog({ instanceId, onClose, onSuccess }: StopInstanceDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    if (!instanceId) return
    setIsLoading(true)
    setError(null)
    try {
      await stopEC2Instance(instanceId)
      onSuccess(instanceId)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop instance.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={instanceId !== null}
      onClose={onClose}
      title="Stop EC2 Instance"
    >
      <div className="space-y-4">
        {/* Instance summary */}
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted shrink-0">
            <Server className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-0.5">
              Instance ID
            </p>
            <p className="font-mono text-sm font-semibold text-foreground">{instanceId}</p>
          </div>
        </div>

        {/* Warning */}
        <div className="flex gap-3 rounded-lg border border-border bg-muted/20 p-3.5">
          <OctagonX className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-xs font-semibold text-foreground">This action requires explicit confirmation</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Stopping this instance will shut it down. Any data in instance memory will be
              lost. The instance can be restarted at any time.
            </p>
          </div>
        </div>

        {error && (
          <p className="text-xs text-destructive bg-destructive/5 border border-destructive/20 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <DialogActions
          onCancel={onClose}
          onConfirm={handleConfirm}
          confirmLabel="Stop Instance"
          confirmVariant="destructive"
          isLoading={isLoading}
        />
      </div>
    </Dialog>
  )
}
