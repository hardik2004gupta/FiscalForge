import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from './button'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-5 w-5 text-destructive" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">Unable to load data</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="mr-1.5 h-3 w-3" />
          Retry
        </Button>
      )}
    </div>
  )
}
