/**
 * Advisor — AI cost advisor chat interface.
 *
 * Phase 3: implement with:
 *   - Chat message thread (user + assistant messages)
 *   - Input field with send button
 *   - Loading indicator while agent is running
 *   - "Approve and Stop" action buttons when AI recommends an EC2 stop
 *   - Clear conversation button
 *
 * AI Safety: this page ONLY calls queryAdvisor() for conversation.
 * EC2 stop actions use stopEC2Instance() AFTER explicit user confirmation.
 * The AI agent never directly executes AWS actions. See CLAUDE.md §12.
 *
 * Data source: queryAdvisor() from lib/api.ts
 */
export default function AdvisorPage() {
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">AI Cost Advisor</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ask questions about your AWS spending and optimization opportunities
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-8 flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground text-sm">
          Phase 3: AI advisor chat interface coming soon.
        </p>
      </div>
    </main>
  )
}
