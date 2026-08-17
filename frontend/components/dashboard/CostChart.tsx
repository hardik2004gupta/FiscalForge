'use client'

import { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  type TooltipProps,
} from 'recharts'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import type { DailyCost } from '@/types/cost'

const PERIODS = ['7D', '30D', '90D'] as const
type Period = (typeof PERIODS)[number]

interface CostChartProps {
  dailyCosts: DailyCost[]
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-3.5 py-2.5 shadow-card-hover text-xs min-w-[120px]">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
        {label}
      </p>
      <p className="text-sm font-semibold text-foreground font-numeric">
        {formatCurrency(payload[0].value ?? 0)}
      </p>
      <p className="text-[10px] text-muted-foreground mt-0.5">AWS Spend</p>
    </div>
  )
}

export function CostChart({ dailyCosts }: CostChartProps) {
  const [period, setPeriod] = useState<Period>('30D')

  const data = useMemo(() => {
    const sliced = period === '7D' ? dailyCosts.slice(-7) : dailyCosts
    return sliced.map((d) => ({ date: formatDate(d.date), cost: d.cost }))
  }, [dailyCosts, period])

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            Daily Spend Trend
          </p>
          <p className="text-sm font-medium text-foreground">AWS cost over time</p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-3 py-1.5 transition-colors font-medium',
                period === p
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="dashboardCostGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.18} />
                <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
              opacity={0.7}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontFamily: 'inherit' }}
              tickLine={false}
              axisLine={false}
              interval={period === '7D' ? 0 : 'preserveStartEnd'}
              dy={4}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontFamily: 'inherit' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              width={38}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: 'hsl(var(--primary))',
                strokeWidth: 1,
                strokeDasharray: '4 2',
                strokeOpacity: 0.5,
              }}
            />
            <Area
              type="monotone"
              dataKey="cost"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              fill="url(#dashboardCostGradient)"
              dot={false}
              activeDot={{
                r: 4,
                fill: 'hsl(var(--chart-1))',
                stroke: 'hsl(var(--card))',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
