terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      project     = "fiscalforge"
      environment = var.environment
    }
  }
}

# ─── Phase 4: Lambda function ─────────────────────────────────────────────────
#
# resource "aws_lambda_function" "fiscalforge_backend" {
#   function_name = "fiscalforge-backend-${var.environment}"
#   filename      = var.lambda_zip_path
#   handler       = "backend.handler.handler"
#   runtime       = "python3.11"
#   role          = aws_iam_role.fiscalforge_lambda.arn
#   memory_size   = var.lambda_memory_mb
#   timeout       = var.lambda_timeout_seconds
#
#   environment {
#     variables = {
#       AWS_REGION           = var.aws_region
#       FISCALFORGE_MOCK_AWS = "false"
#       OPENAI_MODEL         = "gpt-4o"
#       # OPENAI_API_KEY is injected at runtime from SSM Parameter Store
#     }
#   }
# }

# ─── Phase 4: API Gateway HTTP API ───────────────────────────────────────────
#
# resource "aws_apigatewayv2_api" "fiscalforge" {
#   name          = "fiscalforge-api-${var.environment}"
#   protocol_type = "HTTP"
#
#   cors_configuration {
#     allow_origins = ["*"]
#     allow_methods = ["GET", "POST", "OPTIONS"]
#     allow_headers = ["Content-Type"]
#   }
# }
#
# resource "aws_apigatewayv2_integration" "fiscalforge_lambda" {
#   api_id             = aws_apigatewayv2_api.fiscalforge.id
#   integration_type   = "AWS_PROXY"
#   integration_uri    = aws_lambda_function.fiscalforge_backend.invoke_arn
#   payload_format_version = "2.0"
# }
#
# resource "aws_apigatewayv2_route" "fiscalforge_default" {
#   api_id    = aws_apigatewayv2_api.fiscalforge.id
#   route_key = "$default"
#   target    = "integrations/${aws_apigatewayv2_integration.fiscalforge_lambda.id}"
# }
#
# resource "aws_apigatewayv2_stage" "fiscalforge_default" {
#   api_id      = aws_apigatewayv2_api.fiscalforge.id
#   name        = "$default"
#   auto_deploy = true
# }

# ─── Phase 4: CloudWatch log group ───────────────────────────────────────────
#
# resource "aws_cloudwatch_log_group" "fiscalforge_lambda" {
#   name              = "/aws/lambda/fiscalforge-backend-${var.environment}"
#   retention_in_days = var.log_retention_days
# }
