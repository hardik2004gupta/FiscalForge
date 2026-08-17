/**
 * Centralized API client for the FiscalForge backend.
 *
 * All frontend components must call these functions.
 * Direct fetch() calls inside components are prohibited.
 * See CLAUDE.md §7 Frontend Contract.
 *
 * Phase 3: implement HTTP calls to the API Gateway endpoint.
 */

import { config } from './config'
import type { CostSummary } from '../types/cost'
import type { ResourceInventory } from '../types/resource'
import type { RecommendationSummary } from '../types/recommendation'
import type { AdvisorRequest, AdvisorResponse, EC2StopResponse } from '../types/advisor'

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Core fetch wrapper — adds base URL, handles error responses.
 * Phase 3: implement with error parsing and retry logic.
 */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Phase 3: implement
  //   const url = `${config.apiUrl}${path}`
  //   const res = await fetch(url, { ...options })
  //   if (!res.ok) { ... throw ApiError ... }
  //   return res.json() as T
  throw new ApiError('NOT_IMPLEMENTED', `API client not yet implemented: ${path}`, 501)
}

export async function getCosts(): Promise<CostSummary> {
  return request<CostSummary>('/api/costs')
}

export async function getResources(): Promise<ResourceInventory> {
  return request<ResourceInventory>('/api/resources')
}

export async function getRecommendations(): Promise<RecommendationSummary> {
  return request<RecommendationSummary>('/api/recommendations')
}

export async function queryAdvisor(req: AdvisorRequest): Promise<AdvisorResponse> {
  return request<AdvisorResponse>('/api/advisor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
}

/**
 * Stop an EC2 instance. Only called after explicit user confirmation in the UI.
 * The AI agent never triggers this function. See CLAUDE.md §12 AI Safety Contract.
 */
export async function stopEC2Instance(instanceId: string): Promise<EC2StopResponse> {
  return request<EC2StopResponse>('/api/actions/ec2/stop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ instance_id: instanceId }),
  })
}
