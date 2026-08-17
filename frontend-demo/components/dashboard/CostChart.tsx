'use client'

import { useState, useMemo } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, type TooltipProps,
} from 'recharts'
import { cn, formatCurrency, formatDate, formatCurrencyCompact } from '@/lib/utils'
import { ALL_DAILY_COSTS, CURRENT_30D } from '@/lib/demo-data/costs'

const PERIODS = ['30D', '90D'] as const
type Period = typeof PERIODS[number]

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-3.5 py-2.5 shadow-card-hover text-xs min-w-[130px]">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1.5">{label}</p>
      <p className="text-sm font-semibold text-foreground font-numeric">{formatCurrency(payload[0].value ?? 0)}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">Daily AWS spend</p>
    </div>
  )
}

export function CostChart() {
  const [period, setPeriod] = useState<Period>('30D')

  const data = useMemo(() => {
    const source = period === '30D' ? CURRENT_30D : ALL_DAILY_COSTS
    return source.map((d) => ({ date: formatDate(d.date), cost: d.cost }))
  }, [period])

  const max = Math.max(...data.map((d) => d.cost), 0)
  const avg = data.length > 0 ? data.reduce((s, d) => s + d.cost, 0) / data.length : 0

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-card h-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Cost Trend</p>
          <p className="text-sm font-medium text-foreground">Daily AWS spend</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Avg {formatCurrency(avg)}/day · Peak {formatCurrency(max)}
          </p>
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
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="demoCostGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(237 76% 54%)" stopOpacity={0.18} />
                <stop offset="100%" stopColor="hsl(237 76% 54%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 16% 90%)" vertical={false} opacity={0.7} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'hsl(220 11% 46%)', fontFamily: 'inherit' }}
              tickLine={false} axisLine={false}
              interval={period === '30D' ? 4 : 14}
              dy={4}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'hsl(220 11% 46%)', fontFamily: 'inherit' }}
              tickLine={false} axisLine={false}
              tickFormatter={(v: number) => formatCurrencyCompact(v)}
              width={44}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: 'hsl(237 76% 54%)', strokeWidth: 1, strokeDasharray: '4 2', strokeOpacity: 0.5 }}
            />
            <Area
              type="monotone" dataKey="cost"
              stroke="hsl(237 76% 54%)" strokeWidth={2}
              fill="url(#demoCostGrad)" dot={false}
              activeDot={{ r: 4, fill: 'hsl(237 76% 54%)', stroke: 'hsl(0 0% 100%)', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
