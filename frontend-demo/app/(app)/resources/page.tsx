'use client'

import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { EC2Table } from '@/components/resources/EC2Table'
import { RDSTable } from '@/components/resources/RDSTable'
import { S3Table } from '@/components/resources/S3Table'
import { RecommendationList } from '@/components/resources/RecommendationList'
import { DEMO_RESOURCES } from '@/lib/demo-data/resources'
import { DEMO_RECOMMENDATION_SUMMARY } from '@/lib/demo-data/recommendations'
import { cn } from '@/lib/utils'

const TABS = ['EC2', 'RDS', 'S3', 'Recommendations'] as const
type Tab = typeof TABS[number]

export default function ResourcesPage() {
  const [tab, setTab] = useState<Tab>('EC2')
  const r = DEMO_RESOURCES
  const rec = DEMO_RECOMMENDATION_SUMMARY

  const COUNTS: Record<Tab, number> = {
    EC2: r.ec2.length,
    RDS: r.rds.length,
    S3: r.s3.length,
    Recommendations: rec.recommendations.length,
  }

  return (
    <div>
      <TopBar title="Resource Inventory" subtitle="AWS Resources">
        <p className="text-xs text-muted-foreground">
          {r.ec2.length} EC2 · {r.rds.length} RDS · {r.s3.length} S3
        </p>
      </TopBar>

      <div className="p-6">
        {/* Tabs */}
        <div className="flex gap-0.5 border-b border-border mb-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-4 py-2.5 text-xs font-semibold transition-colors border-b-2 -mb-px',
                tab === t
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {t}
              <span className={cn(
                'ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                tab === t ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
              )}>
                {COUNTS[t]}
              </span>
            </button>
          ))}
        </div>

        {tab === 'EC2' && <EC2Table instances={r.ec2} />}
        {tab === 'RDS' && <RDSTable instances={r.rds} />}
        {tab === 'S3' && <S3Table buckets={r.s3} />}
        {tab === 'Recommendations' && (
          <RecommendationList
            recommendations={rec.recommendations}
            totalSavings={rec.total_estimated_savings}
          />
        )}
      </div>
    </div>
  )
}
