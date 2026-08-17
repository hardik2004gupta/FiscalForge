/**
 * Dashboard — primary AWS overview screen.
 *
 * Phase 3: implement with:
 *   - KPI cards: Total Spend, Monthly Change, Potential Savings, Resource Count
 *   - Cost trend line chart (7d / 30d / 90d toggle) using Recharts
 *   - Cost by service bar/pie chart
 *   - Optimization opportunity summary (High / Medium / Low counts)
 *   - System status strip (last sync, error rate, Lambda p95)
 *
 * Data sources (all via lib/api.ts):
 *   getCosts()           → KPI cards and cost charts
 *   getRecommendations() → optimization summary and savings
 */
export default function DashboardPage() {
  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AWS cost overview and optimization opportunities
        </p>
      </div>

      {/* Phase 3: KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
        {['Total Spend', 'Monthly Change', 'Potential Savings', 'Resources'].map((label) => (
          <div key={label} className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
            <p className="mt-2 text-2xl font-bold text-foreground">—</p>
          </div>
        ))}
      </div>

      {/* Phase 3: cost trend chart */}
      <div className="rounded-lg border border-border bg-card p-4 mb-4">
        <p className="text-sm font-medium text-foreground mb-4">Cost Trend</p>
        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
          Phase 3: cost trend chart (Recharts)
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-8">
        Phase 3: full dashboard with live AWS data coming soon.
      </p>
    </main>
  )
}
