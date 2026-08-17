/**
 * Cost data types — mirrors backend/models.py CostSummary and related models.
 * Keep in sync with the backend models and docs/api-contract.md.
 */

export interface DailyCost {
  date: string   // ISO date: "2024-01-15"
  cost: number
}

export interface ServiceCost {
  name: string   // AWS service display name, e.g. "Amazon EC2"
  cost: number
}

export interface CostSummary {
  total_cost: number
  previous_cost: number
  change_percent: number
  daily_costs: DailyCost[]
  services: ServiceCost[]
}
