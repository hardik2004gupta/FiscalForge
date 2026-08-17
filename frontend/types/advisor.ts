/**
 * AI advisor types — mirrors backend/models.py advisor models.
 * Keep in sync with the backend models and docs/api-contract.md.
 */

export interface AdvisorRequest {
  message: string
}

export interface AdvisorResponse {
  response: string
}

export interface EC2StopRequest {
  instance_id: string
}

export interface EC2StopResponse {
  success: boolean
  instance_id: string
  new_state: string   // "stopping" on success
}

export interface ApiError {
  error: string     // ErrorCode value
  message: string
}
