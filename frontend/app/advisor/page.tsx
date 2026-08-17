'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { TopBar } from '@/components/layout/TopBar'
import { AdvisorChat } from '@/components/advisor/AdvisorChat'
import { SuggestedQuestions } from '@/components/advisor/SuggestedQuestions'
import { ShieldCheck } from 'lucide-react'

export default function AdvisorPage() {
  const [pendingMessage, setPendingMessage] = useState<string | undefined>()

  return (
    <AppShell>
      <TopBar
        title="AI Advisor"
        subtitle="FinOps investigation console"
      />

      <main className="flex-1 p-6 flex gap-6 min-h-0">
        {/* Chat — takes most of the space */}
        <div className="flex-1 min-h-0 flex flex-col" style={{ height: 'calc(100vh - 9.5rem)' }}>
          <AdvisorChat
            pendingMessage={pendingMessage}
            onPendingMessageConsumed={() => setPendingMessage(undefined)}
          />
        </div>

        {/* Sidebar */}
        <div className="w-64 shrink-0 space-y-4">
          <SuggestedQuestions onSelect={(q) => setPendingMessage(q)} />

          {/* Safety notice */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-success mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-foreground">Human-in-the-Loop</p>
                <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                  The AI advisor recommends actions — it never executes them. All cloud changes
                  require explicit confirmation in the Resources panel.
                </p>
              </div>
            </div>
          </div>

          {/* Data disclaimer */}
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Data Sources
            </p>
            <ul className="space-y-1">
              {['AWS Cost Explorer', 'EC2 CloudWatch', 'RDS Inventory', 'S3 Metadata'].map((s) => (
                <li key={s} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-success shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </AppShell>
  )
}
