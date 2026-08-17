# ─── Phase 4: Terraform outputs ──────────────────────────────────────────────
#
# Uncomment when Phase 4 resources are created.
# Set NEXT_PUBLIC_API_URL in the frontend environment to the api_gateway_url value.
#
# output "api_gateway_url" {
#   description = "API Gateway invoke URL — set as NEXT_PUBLIC_API_URL in frontend"
#   value       = aws_apigatewayv2_api.fiscalforge.api_endpoint
# }
#
# output "lambda_arn" {
#   description = "ARN of the FiscalForge Lambda function"
#   value       = aws_lambda_function.fiscalforge_backend.arn
# }
#
# output "lambda_log_group" {
#   description = "CloudWatch log group name for Lambda invocations"
#   value       = aws_cloudwatch_log_group.fiscalforge_lambda.name
# }
