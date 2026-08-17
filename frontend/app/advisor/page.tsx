'use client'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { TopBar } from '@/components/layout/TopBar'
import { AdvisorChat } from '@/components/advisor/AdvisorChat'
import { SuggestedQuestions } from '@/components/advisor/SuggestedQuestions'
import { ShieldCheck, CheckCircle2 } from 'lucide-react'

const DATA_SOURCES = [
  'AWS Cost Explorer',
  'EC2 CloudWatch metrics',
  'RDS inventory',
  'S3 metadata',
  'Optimization engine',
]

export default function AdvisorPage() {
  const [pendingMessage, setPendingMessage] = useState<string | undefined>()

  return (
    <AppShell>
      <TopBar title="AI Advisor" subtitle="FinOps Investigation" />

      <main className="flex-1 p-6 flex gap-5 min-h-0" style={{ height: 'calc(100vh - 3.75rem)' }}>
        {/* Chat — primary content */}
        <div className="flex-1 min-h-0 min-w-0 flex flex-col">
          <AdvisorChat
            pendingMessage={pendingMessage}
            onPendingMessageConsumed={() => setPendingMessage(undefined)}
          />
        </div>

        {/* Context sidebar */}
        <div className="w-60 shrink-0 space-y-3 overflow-y-auto pb-1">
          <SuggestedQuestions onSelect={(q) => setPendingMessage(q)} />

          {/* Safety notice */}
          <div className="rounded-lg border border-border bg-card p-4 shadow-card">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-success mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground leading-none mb-1.5">
                  Human-in-the-Loop
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  The advisor recommends actions — it never executes them. All AWS changes require
                  explicit confirmation in the Resources panel.
                </p>
              </div>
            </div>
          </div>

          {/* Data sources */}
          <div className="rounded-lg border border-border bg-card p-4 shadow-card">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Data Sources
            </p>
            <ul className="space-y-2">
              {DATA_SOURCES.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                  <span className="text-xs text-muted-foreground">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </AppShell>
  )
}
