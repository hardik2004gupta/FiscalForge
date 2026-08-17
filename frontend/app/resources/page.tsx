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
import { cn } from '@/lib/utils'
import type { ResourceInventory } from '@/types/resource'
import type { RecommendationSummary } from '@/types/recommendation'
import { Server, Database, HardDrive, Zap } from 'lucide-react'

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
    else {
      setLoading(true)
      setError(null)
    }
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

  useEffect(() => {
    void load()
  }, [load])

  const TAB_ICONS = {
    EC2: Server,
    RDS: Database,
    S3: HardDrive,
    Recommendations: Zap,
  }

  return (
    <AppShell>
      <TopBar
        title="Resource Inventory"
        subtitle="Resources"
        onRefresh={() => void load(true)}
        isRefreshing={refreshing}
      />

      <main className="flex-1 p-6 space-y-5">
        {/* Resource summary strip */}
        {!loading && !error && resources && recs && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: 'EC2 Instances',
                count: resources.ec2.length,
                icon: Server,
                sub: `${resources.ec2.filter((i) => i.state === 'running').length} running`,
              },
              {
                label: 'RDS Databases',
                count: resources.rds.length,
                icon: Database,
                sub: `${resources.rds.filter((d) => d.status === 'available').length} available`,
              },
              {
                label: 'S3 Buckets',
                count: resources.s3.length,
                icon: HardDrive,
                sub: 'all regions',
              },
              {
                label: 'Savings Found',
                count: null,
                value: formatCurrency(recs.total_estimated_savings) + '/mo',
                icon: Zap,
                sub: `${recs.recommendations.length} recommendations`,
                highlight: recs.total_estimated_savings > 0,
              },
            ].map(({ label, count, value, icon: Icon, sub, highlight }) => (
              <div
                key={label}
                className={cn(
                  'rounded-lg border border-border bg-card px-4 py-3 shadow-card',
                  highlight && 'border-success/20 bg-success/[0.03]',
                )}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon
                    className={cn('h-3.5 w-3.5 shrink-0', highlight ? 'text-success' : 'text-muted-foreground')}
                  />
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {label}
                  </p>
                </div>
                <p
                  className={cn(
                    'text-xl font-semibold leading-none font-numeric',
                    highlight ? 'text-success' : 'text-foreground',
                  )}
                >
                  {value ?? count}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">{sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab bar */}
        <div className="flex border-b border-border">
          {TABS.map((tab) => {
            const Icon = TAB_ICONS[tab]
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2.5 text-sm border-b-2 transition-colors -mb-px',
                  activeTab === tab
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab}
                {tab === 'Recommendations' && recs && recs.recommendations.length > 0 && (
                  <span className="rounded-full bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-semibold">
                    {recs.recommendations.length}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {loading ? (
          <SkeletonTable rows={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => void load()} />
        ) : resources && recs ? (
          <>
            {activeTab === 'EC2' &&
              (resources.ec2.length > 0 ? (
                <EC2Table instances={resources.ec2} />
              ) : (
                <EmptyState
                  icon={Server}
                  title="No EC2 instances"
                  description="No running or stopped EC2 instances found in your account."
                />
              ))}
            {activeTab === 'RDS' &&
              (resources.rds.length > 0 ? (
                <RDSTable instances={resources.rds} />
              ) : (
                <EmptyState
                  icon={Database}
                  title="No RDS databases"
                  description="No RDS database instances found in your account."
                />
              ))}
            {activeTab === 'S3' &&
              (resources.s3.length > 0 ? (
                <S3Table buckets={resources.s3} />
              ) : (
                <EmptyState
                  icon={HardDrive}
                  title="No S3 buckets"
                  description="No S3 buckets found in your account."
                />
              ))}
            {activeTab === 'Recommendations' &&
              (recs.recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recs.recommendations.map((r) => (
                    <RecommendationCard key={r.id} recommendation={r} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Zap}
                  title="No optimization opportunities"
                  description="Your current AWS environment has no detected recommendations."
                />
              ))}
          </>
        ) : null}
      </main>
    </AppShell>
  )
}
