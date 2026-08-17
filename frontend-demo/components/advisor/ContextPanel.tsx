import { formatCurrency } from '@/lib/utils'
import { DEMO_OVERVIEW } from '@/lib/demo-data/overview'
import { DEMO_RECOMMENDATION_SUMMARY } from '@/lib/demo-data/recommendations'

export function ContextPanel() {
  const ov = DEMO_OVERVIEW
  const rec = DEMO_RECOMMENDATION_SUMMARY

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-4 shadow-card">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">AI Context</p>
        <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
          The AI advisor has access to these data sources. All responses are grounded in actual demo data — no fabricated metrics.
        </p>
        <div className="space-y-2">
          {[
            { label: 'get_cost_summary()', note: 'Spending + trends' },
            { label: 'get_resources()', note: 'EC2 / RDS / S3' },
            { label: 'get_recommendations()', note: 'Optimization findings' },
          ].map((t) => (
            <div key={t.label} className="flex items-center justify-between">
              <code className="text-[10px] font-mono text-primary bg-primary/8 rounded px-1.5 py-0.5">{t.label}</code>
              <span className="text-[10px] text-muted-foreground">{t.note}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 shadow-card">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Current Context</p>
        <div className="space-y-2.5">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-muted-foreground">This month</span>
            <span className="text-xs font-semibold text-foreground font-numeric">{formatCurrency(ov.total_cost, 0)}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-muted-foreground">vs last month</span>
            <span className="text-xs font-semibold text-destructive">+{ov.change_percent}%</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-muted-foreground">Resources</span>
            <span className="text-xs font-semibold text-foreground font-numeric">{ov.resources.total}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-muted-foreground">Recommendations</span>
            <span className="text-xs font-semibold text-foreground font-numeric">{rec.recommendations.length}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-muted-foreground">Potential savings</span>
            <span className="text-xs font-semibold text-success font-numeric">{formatCurrency(rec.total_estimated_savings, 0)}/mo</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-muted/20 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Safety boundary</p>
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          The AI <strong className="text-foreground">recommends only</strong>. Actions require explicit human approval before Lambda calls AWS. This is an architectural invariant of FiscalForge.
        </p>
      </div>
    </div>
  )
}
