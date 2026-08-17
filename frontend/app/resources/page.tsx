'use client'

import { useState, useEffect, useCallback } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { TopBar } from '@/components/layout/TopBar'
import { EC2Table } from '@/components/resources/EC2Table'
import { RDSTable } from '@/components/resources/RDSTable'
import { S3Table } from '@/components/resources/S3Table'
import { RecommendationCard } from '@/components/resources/RecommendationCard'
import { SkeletonTable } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/ui/error-state'
import { EmptyState } from '@/components/ui/empty-state'
import { getResources, getRecommendations } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import type { ResourceInventory } from '@/types/resource'
import type { RecommendationSummary } from '@/types/recommendation'
import { Server, Lightbulb } from 'lucide-react'

const TABS = ['EC2', 'RDS', 'S3', 'Recommendations'] as const
type Tab = (typeof TABS)[number]

export default function ResourcesPage() {
  const [resources, setResources] = useState<ResourceInventory | null>(null)
  const [recs, setRecs] = useState<RecommendationSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('EC2')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else { setLoading(true); setError(null) }
    try {
      const [resData, recData] = await Promise.all([getResources(), getRecommendations()])
      setResources(resData)
      setRecs(recData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resource data.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  return (
    <AppShell>
      <TopBar
        title="Resources"
        subtitle="AWS resource inventory"
        onRefresh={() => void load(true)}
        isRefreshing={refreshing}
      />

      <main className="flex-1 p-6 space-y-6">
        {/* Summary strip */}
        {recs && recs.total_estimated_savings > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 px-4 py-3">
            <Lightbulb className="h-4 w-4 text-success shrink-0" />
            <p className="text-sm text-foreground">
              <span className="font-semibold text-success font-numeric">
                {formatCurrency(recs.total_estimated_savings)}/mo
              </span>
              {' '}potential savings identified across {recs.recommendations.length} recommendation{recs.recommendations.length !== 1 ? 's' : ''}.
            </p>
          </div>
        )}

        {/* Tab bar */}
        <div className="flex border-b border-border gap-0">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm border-b-2 transition-colors -mb-px ${
                activeTab === tab
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
              {tab === 'Recommendations' && recs && recs.recommendations.length > 0 && (
                <span className="ml-1.5 rounded-full bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-medium">
                  {recs.recommendations.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <SkeletonTable rows={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => void load()} />
        ) : resources && recs ? (
          <>
            {activeTab === 'EC2' && (
              resources.ec2.length > 0
                ? <EC2Table instances={resources.ec2} />
                : <EmptyState icon={Server} title="No EC2 instances" description="No running or stopped EC2 instances found." />
            )}
            {activeTab === 'RDS' && (
              resources.rds.length > 0
                ? <RDSTable instances={resources.rds} />
                : <EmptyState icon={Server} title="No RDS instances" description="No RDS database instances found." />
            )}
            {activeTab === 'S3' && (
              resources.s3.length > 0
                ? <S3Table buckets={resources.s3} />
                : <EmptyState icon={Server} title="No S3 buckets" description="No S3 buckets found." />
            )}
            {activeTab === 'Recommendations' && (
              recs.recommendations.length > 0
                ? (
                  <div className="space-y-3">
                    {recs.recommendations.map((r) => (
                      <RecommendationCard key={r.id} recommendation={r} />
                    ))}
                  </div>
                )
                : <EmptyState icon={Lightbulb} title="No recommendations" description="No optimization opportunities found." />
            )}
          </>
        ) : null}
      </main>
    </AppShell>
  )
}
