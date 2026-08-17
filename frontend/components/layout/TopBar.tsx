'use client'

import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TopBarProps {
  title: string
  subtitle?: string
  onRefresh?: () => void
  isRefreshing?: boolean
  actions?: React.ReactNode
}

export function TopBar({ title, subtitle, onRefresh, isRefreshing, actions }: TopBarProps) {
  return (
    <header className="flex h-[3.75rem] items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-6 shrink-0">
      <div>
        {subtitle && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 leading-none mb-1">
            {subtitle}
          </p>
        )}
        <h1 className="text-[15px] font-semibold text-foreground leading-none">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {actions}

        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-7 px-2.5 text-xs gap-1.5"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Syncing' : 'Refresh'}
          </Button>
        )}
      </div>
    </header>
  )
}
