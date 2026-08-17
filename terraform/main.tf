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

# ─── CloudWatch log group ─────────────────────────────────────────────────────
# Created before the Lambda so the group exists with the correct retention setting
# before Lambda auto-creates one with infinite retention.

resource "aws_cloudwatch_log_group" "fiscalforge_lambda" {
  name              = "/aws/lambda/fiscalforge-backend-${var.environment}"
  retention_in_days = var.log_retention_days
}

# ─── Lambda function ──────────────────────────────────────────────────────────
# ONE Lambda. See CLAUDE.md §3 Core Architectural Invariant.
# Handler: backend.handler.handler
# The zip is built by scripts/build_lambda.sh.

resource "aws_lambda_function" "fiscalforge_backend" {
  function_name = "fiscalforge-backend-${var.environment}"
  filename      = var.lambda_zip_path
  handler       = "backend.handler.handler"
  runtime       = "python3.11"
  role          = aws_iam_role.fiscalforge_lambda.arn
  memory_size   = var.lambda_memory_mb
  timeout       = var.lambda_timeout_seconds

  # source_code_hash ensures Terraform re-deploys when the zip changes.
  source_code_hash = filebase64sha256(var.lambda_zip_path)

  environment {
    variables = {
      # AWS_REGION is set automatically by the Lambda runtime — do not override it.
      FISCALFORGE_MOCK_AWS = var.mock_aws
      OPENAI_MODEL         = var.openai_model
      # OPENAI_API_KEY is intentionally absent from Terraform.
      # Inject it after deployment to avoid committing secrets to source control:
      #   aws lambda update-function-configuration \
      #     --function-name fiscalforge-backend-${var.environment} \
      #     --environment "Variables={FISCALFORGE_MOCK_AWS=false,OPENAI_MODEL=gpt-4o,OPENAI_API_KEY=sk-...}"
      # See README.md "AWS Deployment" for the full procedure.
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.fiscalforge_lambda,
    aws_iam_role_policy_attachment.fiscalforge_lambda,
  ]
}

# ─── API Gateway HTTP API ─────────────────────────────────────────────────────
# HTTP API (v2) is simpler and cheaper than REST API (v1) for Lambda proxy use.

resource "aws_apigatewayv2_api" "fiscalforge" {
  name          = "fiscalforge-api-${var.environment}"
  protocol_type = "HTTP"

  cors_configuration {
    # Set var.frontend_origin to your frontend URL in production.
    # Defaults to "*" for MVP/dev only — tighten before production.
    allow_origins = [var.frontend_origin]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["content-type"]
    max_age       = 300
  }
}

resource "aws_apigatewayv2_integration" "fiscalforge_lambda" {
  api_id                 = aws_apigatewayv2_api.fiscalforge.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.fiscalforge_backend.invoke_arn
  payload_format_version = "2.0"
}

# Single $default route — the Lambda handler performs its own path-based routing.
resource "aws_apigatewayv2_route" "fiscalforge_default" {
  api_id    = aws_apigatewayv2_api.fiscalforge.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.fiscalforge_lambda.id}"
}

resource "aws_apigatewayv2_stage" "fiscalforge_default" {
  api_id      = aws_apigatewayv2_api.fiscalforge.id
  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.fiscalforge_lambda.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      routeKey       = "$context.routeKey"
      status         = "$context.status"
      responseLength = "$context.responseLength"
      durationMs     = "$context.responseLatency"
      sourceIp       = "$context.identity.sourceIp"
      errorMessage   = "$context.error.message"
    })
  }
}

# ─── Lambda permission for API Gateway ───────────────────────────────────────
# Grants API Gateway permission to invoke the Lambda function.

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.fiscalforge_backend.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.fiscalforge.execution_arn}/*/*"
}
