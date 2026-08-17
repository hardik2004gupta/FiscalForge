import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline'
  className?: string
  children: React.ReactNode
}

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-primary/10 text-primary',
        variant === 'success' && 'bg-success/10 text-success',
        variant === 'warning' && 'bg-warning/10 text-warning',
        variant === 'destructive' && 'bg-destructive/10 text-destructive',
        variant === 'outline' && 'border border-border bg-transparent text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}
