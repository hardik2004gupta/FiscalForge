import { TopBar } from '@/components/layout/TopBar'
import { SpendingTrend } from '@/components/costs/SpendingTrend'
import { ServiceTable } from '@/components/costs/ServiceTable'
import { DEMO_COST_SUMMARY } from '@/lib/demo-data/costs'
import { formatCurrency, formatPercent } from '@/lib/utils'

export default function CostsPage() {
  const cs = DEMO_COST_SUMMARY

  return (
    <div>
      <TopBar title="Cost Analytics" subtitle="Spending">
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground">This month</p>
          <p className="text-sm font-bold text-foreground font-numeric">{formatCurrency(cs.total_cost, 0)}</p>
        </div>
      </TopBar>

      <div className="p-6 space-y-6">
        {/* Period comparison */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'This Month', value: cs.total_cost, sub: null },
            { label: 'Last Month', value: cs.previous_cost, sub: null },
            { label: 'Change', value: null, change: cs.change_percent },
          ].map((card) => (
            <div key={card.label} className="rounded-lg border border-border bg-card p-4 shadow-card">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">{card.label}</p>
              {card.value !== null ? (
                <p className="text-2xl font-bold text-foreground font-numeric">{formatCurrency(card.value, 0)}</p>
              ) : (
                <p className={`text-2xl font-bold font-numeric ${(card.change ?? 0) >= 0 ? 'text-destructive' : 'text-success'}`}>
                  {formatPercent(card.change ?? 0)}
                </p>
              )}
            </div>
          ))}
        </div>

        <SpendingTrend />
        <ServiceTable services={cs.services} total={cs.total_cost} />
      </div>
    </div>
  )
}
