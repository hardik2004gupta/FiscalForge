'use client'

import { useState } from 'react'
import { OctagonX } from 'lucide-react'
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
      description={`This will send a stop request to ${instanceId ?? '…'}.`}
    >
      <div className="space-y-4">
        <div className="flex gap-3 rounded-md bg-destructive/8 p-3">
          <OctagonX className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
          <div className="text-xs text-foreground space-y-1">
            <p className="font-medium">Confirm action</p>
            <p className="text-muted-foreground">
              The instance will be stopped. Any unsaved data in instance memory will be lost.
              You can start it again later.
            </p>
          </div>
        </div>

        <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs font-mono text-foreground">
          {instanceId}
        </div>

        {error && (
          <p className="text-xs text-destructive">{error}</p>
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
