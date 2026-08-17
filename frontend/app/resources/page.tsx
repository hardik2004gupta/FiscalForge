/**
 * Resources — AWS resource inventory page.
 *
 * Phase 3: implement with:
 *   - Tab navigation: EC2 | RDS | S3
 *   - EC2 table: ID, type, state badge, region, launch date, cost, CPU utilization bar
 *   - RDS table: identifier, engine, class, status badge, region, cost
 *   - S3 table: bucket name, region, size, object count, estimated cost
 *   - "Stop Instance" button on EC2 rows (requires confirmation dialog)
 *
 * Data source: getResources() from lib/api.ts
 * Action: stopEC2Instance() from lib/api.ts — requires user confirmation dialog first
 */
export default function ResourcesPage() {
  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Resource Inventory</h1>
        <p className="text-sm text-muted-foreground mt-1">
          EC2, RDS, and S3 resources with utilization and estimated costs
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-8 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">
          Phase 3: EC2, RDS, and S3 inventory tables coming soon.
        </p>
      </div>
    </main>
  )
}
