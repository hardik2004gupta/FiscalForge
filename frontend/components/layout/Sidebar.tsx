'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  TrendingUp,
  Server,
  MessageSquare,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/costs', label: 'Cost Analytics', icon: TrendingUp },
  { href: '/resources', label: 'Resources', icon: Server },
  { href: '/advisor', label: 'AI Advisor', icon: MessageSquare },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-card shadow-sidebar flex flex-col z-40">
      {/* Logotype */}
      <div className="flex h-14 items-center gap-3 px-5 border-b border-border">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary shadow-sm shrink-0">
          <Zap className="h-3.5 w-3.5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight text-foreground leading-none">
            FiscalForge
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5 leading-none">
            FinOps Intelligence
          </p>
        </div>
      </div>

      {/* Section label */}
      <div className="px-5 pt-5 pb-1.5">
        <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          Platform
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 pb-2 space-y-0.5" aria-label="Main navigation">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-all duration-150',
                active
                  ? 'bg-primary/[0.07] text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
              )}
              aria-current={active ? 'page' : undefined}
            >
              {/* Active left indicator */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
              )}
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0 transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground/70 group-hover:text-foreground',
                )}
              />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* AWS Connection status */}
      <div className="mx-3 mb-3 rounded-md border border-border bg-muted/40 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          <p className="text-[11px] font-medium text-foreground">
            {process.env.NEXT_PUBLIC_API_URL ? 'AWS Connected' : 'Mock Mode'}
          </p>
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5 pl-4">
          {process.env.NEXT_PUBLIC_API_URL ? 'Live data' : 'Development data'}
        </p>
      </div>
    </aside>
  )
}
