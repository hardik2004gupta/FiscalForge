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
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/costs', label: 'Cost Analytics', icon: TrendingUp },
  { href: '/resources', label: 'Resources', icon: Server },
  { href: '/advisor', label: 'AI Advisor', icon: MessageSquare },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-56 border-r border-border bg-card flex flex-col z-40">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 px-4 border-b border-border">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-foreground">
          FiscalForge
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5" aria-label="Main navigation">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-primary/8 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="rounded-md bg-muted px-3 py-2">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Environment
          </p>
          <p className="text-xs text-foreground mt-0.5">
            {process.env.NEXT_PUBLIC_API_URL ? 'Production' : 'Development'}
          </p>
        </div>
      </div>
    </aside>
  )
}
