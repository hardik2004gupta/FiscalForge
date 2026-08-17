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

const PERIODS = ['7D', '30D'] as const
type Period = (typeof PERIODS)[number]

interface SpendingTrendProps {
  dailyCosts: DailyCost[]
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md text-xs">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p className="font-semibold text-foreground font-numeric">
        {formatCurrency(payload[0].value ?? 0)}
      </p>
    </div>
  )
}

export function SpendingTrend({ dailyCosts }: SpendingTrendProps) {
  const [period, setPeriod] = useState<Period>('30D')

  const data = useMemo(() => {
    const sliced = period === '7D' ? dailyCosts.slice(-7) : dailyCosts
    return sliced.map((d) => ({ date: formatDate(d.date), cost: d.cost }))
  }, [dailyCosts, period])

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Daily Spend</h3>
          <p className="text-xs text-muted-foreground">AWS cost per day</p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-3 py-1.5 transition-colors',
                period === p
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'bg-card text-muted-foreground hover:bg-muted',
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.15} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              interval={period === '7D' ? 0 : 'preserveStartEnd'}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--border))' }} />
            <Area
              type="monotone"
              dataKey="cost"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              fill="url(#costGradient)"
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(var(--chart-1))', stroke: 'hsl(var(--card))', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
