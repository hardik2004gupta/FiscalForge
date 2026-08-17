'use client'

import { RefreshCw, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TopBarProps {
  title: string
  subtitle?: string
  onRefresh?: () => void
  isRefreshing?: boolean
}

export function TopBar({ title, subtitle, onRefresh, isRefreshing }: TopBarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <div>
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Activity className="h-3 w-3 text-success" />
          <span className="text-xs text-muted-foreground">Operational</span>
        </div>

        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-1.5 h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>
    </header>
  )
}
