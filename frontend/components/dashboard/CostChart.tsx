'use client'

import { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md text-xs">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p className="font-semibold text-foreground font-numeric">
        {formatCurrency(payload[0].value ?? 0)}
      </p>
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
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Daily Spend Trend</h3>
          <p className="text-xs text-muted-foreground">AWS cost over time</p>
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

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
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
            <Line
              type="monotone"
              dataKey="cost"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(var(--chart-1))', stroke: 'hsl(var(--card))', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
