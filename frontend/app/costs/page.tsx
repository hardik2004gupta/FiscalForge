'use client'

import { useState, useEffect, useCallback } from 'react'
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { TopBar } from '@/components/layout/TopBar'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { SpendingTrend } from '@/components/costs/SpendingTrend'
import { CostTable } from '@/components/costs/CostTable'
import { SkeletonCard, SkeletonTable } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/ui/error-state'
import { getCosts } from '@/lib/api'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import type { CostSummary } from '@/types/cost'

export default function CostsPage() {
  const [data, setData] = useState<CostSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else {
      setLoading(true)
      setError(null)
    }
    try {
      setData(await getCosts())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cost data.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const isIncrease = (data?.change_percent ?? 0) > 0

  return (
    <AppShell>
      <TopBar
        title="Cost Intelligence"
        subtitle="Cost Analytics"
        onRefresh={() => void load(true)}
        isRefreshing={refreshing}
      />

      <main className="flex-1 p-6 space-y-5">
        {loading ? (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <SkeletonTable rows={8} />
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={() => void load()} />
        ) : data ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <KpiCard
                label="Current Period"
                value={formatCurrency(data.total_cost)}
                change={`${formatPercentage(data.change_percent)} vs previous period`}
                changePositive={isIncrease}
                icon={DollarSign}
              />
              <KpiCard
                label="Previous Period"
                value={formatCurrency(data.previous_cost)}
                change={`Δ ${formatCurrency(Math.abs(data.total_cost - data.previous_cost))}`}
                changePositive={!isIncrease}
                icon={isIncrease ? TrendingUp : TrendingDown}
                iconColor={isIncrease ? 'text-destructive' : 'text-success'}
              />
            </div>

            <SpendingTrend dailyCosts={data.daily_costs} />
            <CostTable services={data.services} totalCost={data.total_cost} />
          </>
        ) : null}
      </main>
    </AppShell>
  )
}
