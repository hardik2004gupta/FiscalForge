# FiscalForge Lambda IAM Role and Policy
#
# Follows least-privilege. See CLAUDE.md §13 IAM Contract.
# Every permission has a documented reason below.
# AdministratorAccess and PowerUserAccess are NOT used.
# ec2:TerminateInstances is NOT granted — only StopInstances is allowed.

resource "aws_iam_role" "fiscalforge_lambda" {
  name = "fiscalforge-lambda-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_policy" "fiscalforge_lambda" {
  name        = "fiscalforge-lambda-policy-${var.environment}"
  description = "Least-privilege policy for FiscalForge Lambda. See CLAUDE.md §13."

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # Cost Explorer — read spending data.
      # Resource "*" is required: Cost Explorer has no resource-level ARNs.
      {
        Sid      = "CostExplorerRead"
        Effect   = "Allow"
        Action   = ["ce:GetCostAndUsage", "ce:GetCostForecast"]
        Resource = "*"
      },

      # EC2 — describe instances for inventory; stop for the action endpoint.
      # TerminateInstances is intentionally NOT granted (CLAUDE.md §12).
      # Resource "*" required: DescribeInstances does not support resource-level restriction.
      {
        Sid    = "EC2DescribeAndStop"
        Effect = "Allow"
        Action = [
          "ec2:DescribeInstances",
          "ec2:DescribeInstanceStatus",
          "ec2:StopInstances",
        ]
        Resource = "*"
      },

      # RDS — describe database instances for inventory only.
      {
        Sid      = "RDSDescribe"
        Effect   = "Allow"
        Action   = ["rds:DescribeDBInstances"]
        Resource = "*"
      },

      # S3 — list buckets and read bucket metadata.
      # No s3:GetObject, s3:PutObject, s3:DeleteObject — data is never read or modified.
      {
        Sid    = "S3ListMetadata"
        Effect = "Allow"
        Action = [
          "s3:ListAllMyBuckets",
          "s3:GetBucketLocation",
          "s3:GetBucketAcl",
        ]
        Resource = "*"
      },

      # CloudWatch — read EC2 CPU metrics and S3 BucketSizeBytes for optimization rules.
      {
        Sid    = "CloudWatchReadMetrics"
        Effect = "Allow"
        Action = [
          "cloudwatch:GetMetricStatistics",
          "cloudwatch:GetMetricData",
        ]
        Resource = "*"
      },

      # CloudWatch Logs — write Lambda execution logs.
      # Scoped to the fiscalforge log group prefix only.
      {
        Sid    = "CloudWatchLogs"
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ]
        Resource = "arn:aws:logs:${var.aws_region}:*:log-group:/aws/lambda/fiscalforge-*:*"
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "fiscalforge_lambda" {
  role       = aws_iam_role.fiscalforge_lambda.name
  policy_arn = aws_iam_policy.fiscalforge_lambda.arn
}
