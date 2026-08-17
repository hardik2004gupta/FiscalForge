export interface DemoCostPoint {
  date: string
  cost: number
}

export interface DemoServiceCost {
  name: string
  cost: number
  color: string
}

export interface DemoCostSummary {
  total_cost: number
  previous_cost: number
  change_percent: number
  daily_costs: DemoCostPoint[]
  services: DemoServiceCost[]
}
