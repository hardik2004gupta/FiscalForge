import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FiscalForge — AWS FinOps Platform',
  description: 'Understand your AWS spend. Find savings. Act with confidence.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
