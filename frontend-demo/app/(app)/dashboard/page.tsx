import { DollarSign, TrendingUp, Lightbulb, Server } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { CostChart } from '@/components/dashboard/CostChart'
import { ServiceBreakdown } from '@/components/dashboard/ServiceBreakdown'
import { OptimizationSummary } from '@/components/dashboard/OptimizationSummary'
import { DEMO_OVERVIEW } from '@/lib/demo-data/overview'
import { DEMO_COST_SUMMARY } from '@/lib/demo-data/costs'
import { DEMO_RECOMMENDATION_SUMMARY } from '@/lib/demo-data/recommendations'
import { formatCurrency, formatPercent } from '@/lib/utils'

export default function DashboardPage() {
  const ov = DEMO_OVERVIEW
  const rec = DEMO_RECOMMENDATION_SUMMARY

  return (
    <div>
      <TopBar title="Dashboard" subtitle="AWS Overview">
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground border border-border/60 rounded-full px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          {ov.status} · Synced {ov.last_sync}
        </div>
      </TopBar>

      <div className="p-6 space-y-6">
        {/* KPI grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Total Spend"
            value={formatCurrency(ov.total_cost, 0)}
            badge={`+${ov.change_percent}%`}
            badgeVariant="up"
            sub="vs last month"
            icon={<DollarSign className="h-4 w-4" />}
          />
          <KpiCard
            label="Monthly Change"
            value={formatPercent(ov.change_percent)}
            badge="↑ Up"
            badgeVariant="up"
            sub="month over month"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <KpiCard
            label="Potential Savings"
            value={formatCurrency(ov.potential_savings, 0)}
            badge={`${ov.savings_count} findings`}
            badgeVariant="savings"
            sub="per month"
            icon={<Lightbulb className="h-4 w-4" />}
          />
          <KpiCard
            label="Total Resources"
            value={String(ov.resources.total)}
            sub={`EC2 ${ov.resources.ec2} · RDS ${ov.resources.rds} · S3 ${ov.resources.s3}`}
            icon={<Server className="h-4 w-4" />}
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <CostChart />
          </div>
          <ServiceBreakdown services={DEMO_COST_SUMMARY.services} />
        </div>

        {/* Optimization summary */}
        <OptimizationSummary
          recommendations={rec.recommendations}
          totalSavings={rec.total_estimated_savings}
        />

        {/* System status */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-card">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">System Status</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'System Status',   value: ov.status,                             color: 'text-success' },
              { label: 'Last AWS Sync',   value: ov.last_sync,                          color: 'text-foreground' },
              { label: 'API Error Rate',  value: `${ov.api_error_rate}%`,               color: 'text-foreground' },
              { label: 'Lambda p95',      value: `${ov.lambda_p95_ms} ms`,              color: 'text-foreground' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[10px] text-muted-foreground mb-1">{s.label}</p>
                <p className={`text-xs font-semibold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
