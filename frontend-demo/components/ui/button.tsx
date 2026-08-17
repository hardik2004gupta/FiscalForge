import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
        size === 'md' && 'px-4 py-2 text-sm',
        size === 'sm' && 'px-2.5 py-1.5 text-xs',
        variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow',
        variant === 'outline' && 'border border-border bg-card text-foreground hover:bg-muted',
        variant === 'ghost' && 'text-muted-foreground hover:bg-muted hover:text-foreground',
        variant === 'destructive' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
        className,
      )}
      {...props}
    />
  ),
)
Button.displayName = 'Button'
