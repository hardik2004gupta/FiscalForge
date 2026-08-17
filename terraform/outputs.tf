output "api_gateway_url" {
  description = "API Gateway invoke URL. Set as NEXT_PUBLIC_API_URL in the frontend environment."
  value       = aws_apigatewayv2_api.fiscalforge.api_endpoint
}

output "lambda_arn" {
  description = "ARN of the FiscalForge Lambda function"
  value       = aws_lambda_function.fiscalforge_backend.arn
}

output "lambda_name" {
  description = "Name of the FiscalForge Lambda function"
  value       = aws_lambda_function.fiscalforge_backend.function_name
}

output "cloudwatch_log_group" {
  description = "CloudWatch log group for Lambda invocation logs"
  value       = aws_cloudwatch_log_group.fiscalforge_lambda.name
}
