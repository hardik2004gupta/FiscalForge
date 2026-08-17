# ─── Phase 4: IAM role and policy for FiscalForge Lambda ─────────────────────
#
# Follows least-privilege principles. See CLAUDE.md §13 IAM Contract.
# Every permission listed here has a documented reason.
#
# resource "aws_iam_role" "fiscalforge_lambda" {
#   name = "fiscalforge-lambda-${var.environment}"
#
#   assume_role_policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [{
#       Effect    = "Allow"
#       Principal = { Service = "lambda.amazonaws.com" }
#       Action    = "sts:AssumeRole"
#     }]
#   })
# }
#
# resource "aws_iam_policy" "fiscalforge_lambda" {
#   name        = "fiscalforge-lambda-policy-${var.environment}"
#   description = "Least-privilege policy for FiscalForge Lambda"
#
#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       # Cost Explorer — read-only; no write or budget operations
#       {
#         Sid      = "CostExplorerRead"
#         Effect   = "Allow"
#         Action   = ["ce:GetCostAndUsage", "ce:GetCostForecast"]
#         Resource = "*"   # Cost Explorer has no resource-level ARNs
#       },
#       # EC2 — describe + stop only; ec2:TerminateInstances is NOT granted
#       {
#         Sid      = "EC2DescribeAndStop"
#         Effect   = "Allow"
#         Action   = [
#           "ec2:DescribeInstances",
#           "ec2:DescribeInstanceStatus",
#           "ec2:StopInstances"
#         ]
#         Resource = "*"
#       },
#       # RDS — describe only; no modify or delete
#       {
#         Sid      = "RDSDescribe"
#         Effect   = "Allow"
#         Action   = ["rds:DescribeDBInstances"]
#         Resource = "*"
#       },
#       # S3 — list and metadata only; no object read, write, or delete
#       {
#         Sid      = "S3ListMetadata"
#         Effect   = "Allow"
#         Action   = ["s3:ListAllMyBuckets", "s3:GetBucketLocation", "s3:GetBucketAcl"]
#         Resource = "*"
#       },
#       # CloudWatch — read metrics for EC2 CPU utilization and S3 bucket sizes
#       {
#         Sid      = "CloudWatchReadMetrics"
#         Effect   = "Allow"
#         Action   = ["cloudwatch:GetMetricStatistics", "cloudwatch:GetMetricData"]
#         Resource = "*"
#       },
#       # CloudWatch Logs — write Lambda execution logs only
#       {
#         Sid      = "CloudWatchLogs"
#         Effect   = "Allow"
#         Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
#         Resource = "arn:aws:logs:*:*:log-group:/aws/lambda/fiscalforge-*"
#       }
#     ]
#   })
# }
#
# resource "aws_iam_role_policy_attachment" "fiscalforge_lambda" {
#   role       = aws_iam_role.fiscalforge_lambda.name
#   policy_arn = aws_iam_policy.fiscalforge_lambda.arn
# }
