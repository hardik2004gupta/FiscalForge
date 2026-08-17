import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FiscalForge — AWS FinOps Platform',
  description: 'Understand your AWS spend. Find savings. Act with confidence.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
