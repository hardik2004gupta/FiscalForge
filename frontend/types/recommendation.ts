/**
 * Recommendation types — mirrors backend/models.py Recommendation model.
 * Keep in sync with the backend models and docs/api-contract.md.
 */

export type RecommendationType =
  | 'EC2_UNDERUTILIZED'
  | 'EC2_RIGHTSIZING'
  | 'S3_STORAGE_OPTIMIZATION'
  | 'NAT_GATEWAY_OPTIMIZATION'

export type SeverityLevel = 'high' | 'medium' | 'low'

export interface Recommendation {
  id: string
  resource_id: string
  type: RecommendationType
  severity: SeverityLevel
  reason: string            // Human-readable; shown in UI
  estimated_savings: number  // Monthly USD
}

export interface RecommendationSummary {
  recommendations: Recommendation[]
  total_estimated_savings: number
}
