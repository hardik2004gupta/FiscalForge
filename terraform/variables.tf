variable "aws_region" {
  description = "AWS region for FiscalForge deployment"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "environment must be one of: dev, staging, prod"
  }
}

variable "lambda_memory_mb" {
  description = "Lambda function memory allocation in MB (128–10240)"
  type        = number
  default     = 512
}

variable "lambda_timeout_seconds" {
  description = "Lambda function timeout in seconds (max 900)"
  type        = number
  default     = 30
}

variable "lambda_zip_path" {
  description = "Path to the Lambda deployment zip artifact (built in CI)"
  type        = string
  default     = "../dist/fiscalforge-backend.zip"
}

variable "log_retention_days" {
  description = "CloudWatch log group retention period in days"
  type        = number
  default     = 14
}
