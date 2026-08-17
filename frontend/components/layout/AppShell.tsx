'use client'

import { Sidebar } from './Sidebar'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-56 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  )
}
