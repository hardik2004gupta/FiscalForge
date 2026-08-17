variable "aws_region" {
  description = "AWS region for all FiscalForge resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment: dev | staging | prod"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "environment must be one of: dev, staging, prod"
  }
}

variable "lambda_memory_mb" {
  description = "Lambda memory allocation in MB (128–10240). 512 MB is sufficient for the LangGraph agent."
  type        = number
  default     = 512
}

variable "lambda_timeout_seconds" {
  description = "Lambda timeout in seconds. 30s covers normal calls; advisor may use up to 25s."
  type        = number
  default     = 30
}

variable "lambda_zip_path" {
  description = "Path to the Lambda deployment zip built by scripts/build_lambda.sh"
  type        = string
  default     = "../dist/fiscalforge-backend.zip"
}

variable "log_retention_days" {
  description = "CloudWatch log group retention in days. 14 days is appropriate for MVP."
  type        = number
  default     = 14
}

variable "frontend_origin" {
  description = <<-EOT
    Allowed CORS origin for API Gateway.
    Set to your deployed frontend URL for production (e.g. https://fiscalforge.example.com).
    Defaults to "*" which is acceptable for MVP/dev but should be tightened for production.
  EOT
  type        = string
  default     = "*"
}

variable "openai_model" {
  description = "OpenAI model for the LangGraph advisor agent"
  type        = string
  default     = "gpt-4o"
}

variable "mock_aws" {
  description = "Set to 'true' to deploy Lambda in mock-data mode (no real AWS API calls). Always 'false' for production."
  type        = string
  default     = "false"

  validation {
    condition     = contains(["true", "false"], var.mock_aws)
    error_message = "mock_aws must be 'true' or 'false'"
  }
}
