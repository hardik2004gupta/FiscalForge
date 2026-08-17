export type RecommendationType =
  | 'EC2_UNDERUTILIZED'
  | 'EC2_RIGHTSIZING'
  | 'S3_STORAGE_OPTIMIZATION'
  | 'NAT_GATEWAY_OPTIMIZATION'

export type RecommendationSeverity = 'high' | 'medium' | 'low'

export interface DemoRecommendation {
  id: string
  resource_id: string
  resource_name: string
  type: RecommendationType
  severity: RecommendationSeverity
  reason: string
  estimated_savings: number
  detail?: string
}

export interface DemoRecommendationSummary {
  recommendations: DemoRecommendation[]
  total_estimated_savings: number
}
