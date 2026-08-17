import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      aria-hidden="true"
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-3 shadow-card">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-10 w-36" />
      <Skeleton className="h-3 w-28" />
    </div>
  )
}
