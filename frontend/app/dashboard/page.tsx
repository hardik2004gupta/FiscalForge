'use client'

import { useState, useEffect, useCallback } from 'react'
import { DollarSign, TrendingUp, TrendingDown, Server, Lightbulb } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { TopBar } from '@/components/layout/TopBar'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { CostChart } from '@/components/dashboard/CostChart'
import { ServiceBreakdown } from '@/components/dashboard/ServiceBreakdown'
import { OptimizationSummary } from '@/components/dashboard/OptimizationSummary'
import { SkeletonCard } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/ui/error-state'
import { getCosts, getRecommendations } from '@/lib/api'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import type { CostSummary } from '@/types/cost'
import type { RecommendationSummary } from '@/types/recommendation'

export default function DashboardPage() {
  const [costs, setCosts] = useState<CostSummary | null>(null)
  const [recs, setRecs] = useState<RecommendationSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else { setLoading(true); setError(null) }
    try {
      const [costData, recData] = await Promise.all([getCosts(), getRecommendations()])
      setCosts(costData)
      setRecs(recData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const isIncrease = (costs?.change_percent ?? 0) > 0

  return (
    <AppShell>
      <TopBar
        title="Dashboard"
        subtitle="AWS cost overview"
        onRefresh={() => void load(true)}
        isRefreshing={refreshing}
      />

      <main className="flex-1 p-6 space-y-6">
        {loading ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </>
        ) : error ? (
          <ErrorState message={error} onRetry={() => void load()} />
        ) : costs && recs ? (
          <>
            {/* KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard
                label="Total Spend"
                value={formatCurrency(costs.total_cost)}
                change={`${formatPercentage(costs.change_percent)} vs last period`}
                changePositive={isIncrease}
                icon={DollarSign}
              />
              <KpiCard
                label="Monthly Change"
                value={formatPercentage(costs.change_percent)}
                change={`From ${formatCurrency(costs.previous_cost)}`}
                changePositive={isIncrease}
                icon={isIncrease ? TrendingUp : TrendingDown}
                iconColor={isIncrease ? 'text-destructive' : 'text-success'}
              />
              <KpiCard
                label="Potential Savings"
                value={formatCurrency(recs.total_estimated_savings)}
                description="Monthly optimization opportunity"
                icon={Lightbulb}
                iconColor="text-success"
              />
              <KpiCard
                label="Recommendations"
                value={String(recs.recommendations.length)}
                description={`${recs.recommendations.filter((r) => r.severity === 'high').length} high severity`}
                icon={Server}
              />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CostChart dailyCosts={costs.daily_costs} />
              <ServiceBreakdown services={costs.services} />
            </div>

            {/* Optimization */}
            <OptimizationSummary
              recommendations={recs.recommendations}
              totalSavings={recs.total_estimated_savings}
            />
          </>
        ) : null}
      </main>
    </AppShell>
  )
}
