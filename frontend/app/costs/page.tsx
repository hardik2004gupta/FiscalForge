/**
 * Costs — detailed cost analytics page.
 *
 * Phase 3: implement with:
 *   - Date range filter (7d / 30d / 90d)
 *   - Metric cards: Current Period, Previous Period, Change %, Daily Average, Projected Monthly
 *   - Chart 1: Daily AWS spending (line chart)
 *   - Chart 2: Cost by service (bar chart)
 *   - Chart 3: Cost change by service vs. previous period (horizontal bar)
 *
 * Data source: getCosts() from lib/api.ts
 */
export default function CostsPage() {
  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Cost Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Detailed spending breakdown and period comparison
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-8 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">
          Phase 3: cost analytics with charts coming soon.
        </p>
      </div>
    </main>
  )
}
