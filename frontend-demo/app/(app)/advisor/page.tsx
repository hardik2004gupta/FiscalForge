import { TopBar } from '@/components/layout/TopBar'
import { AdvisorChat } from '@/components/advisor/AdvisorChat'
import { ContextPanel } from '@/components/advisor/ContextPanel'

export default function AdvisorPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar title="AI Cost Advisor" subtitle="Agentic AI" />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-0 overflow-hidden">
        <div className="lg:col-span-2 p-6 min-h-0">
          <AdvisorChat />
        </div>
        <div className="hidden lg:block border-l border-border p-6 overflow-y-auto">
          <ContextPanel />
        </div>
      </div>
    </div>
  )
}
