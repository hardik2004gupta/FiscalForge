import type { DemoSuggestedQuestion } from '@/types/advisor'

export const SUGGESTED_QUESTIONS: DemoSuggestedQuestion[] = [
  { id: 'q1', text: 'Why did my AWS cost increase this month?' },
  { id: 'q2', text: 'What are my biggest savings opportunities?' },
  { id: 'q3', text: 'Which EC2 instances are underutilized?' },
  { id: 'q4', text: 'What is costing us the most?' },
  { id: 'q5', text: 'How much could we save this month?' },
  { id: 'q6', text: 'What should I investigate first?' },
]

const WELCOME = `Hello! I'm FiscalForge's AI advisor — connected to your AWS cost, resource, and optimization data.

This environment shows $18,426.72 in current spend with 17 optimization opportunities totaling $3,284/month in potential savings.

I can explain cost trends, walk through optimization findings, and help you decide what to act on. My answers are grounded in your actual AWS data.`

const COST_INCREASE = `Your AWS spend increased **8.7%** this month, reaching **$18,426.72** — up from $16,952.41 in the previous period, an increase of $1,474.31.

**Primary drivers:**

• **Amazon EC2 — $7,842.30** (42.6% of total spend)
  EC2 is the largest driver, up approximately 14% from last month. The July 27 scale-up event added approximately $280 in additional monthly capacity.

• **Amazon RDS — $4,231.80** (23.0% of total spend)
  RDS workload increased on August 5, contributing approximately $320 to the monthly increase.

• **Data Transfer — $2,113.90** (11.5% of total spend)
  A data transfer spike on July 18 added roughly $96 above baseline. Worth investigating the source — this is above typical for your environment size.

**Good news:** I've identified 17 optimization opportunities totaling $3,284/month — which would more than offset the current increase and reduce your bill by ~17.8%.

Would you like to review the top recommendations?`

const SAVINGS = `I've identified **17 optimization opportunities** totaling **$3,284/month** ($39,408 annualized) across your environment.

**By category:**
| Category | Count | Monthly Savings |
|---|---|---|
| EC2 Underutilization | 8 instances | $1,576 |
| EC2 Rightsizing | 4 instances | $1,048 |
| S3 Storage Optimization | 3 buckets | $508 |
| NAT Gateway | 2 gateways | $152 |

**Top 5 by impact:**

1. **EC2 Rightsizing** — prod-analytics-01 (m5.4xlarge → m5.2xlarge) · **$412/month** · High
2. **EC2 Underutilized** — ml-experiment-01 (m5.2xlarge, CPU 2.3%, 47 days) · **$312/month** · High
3. **EC2 Rightsizing** — prod-analytics-02 (m5.2xlarge → m5.xlarge) · **$290/month** · Medium
4. **EC2 Underutilized** — batch-worker-07 (m5.xlarge, CPU 4.8%, 63 days) · **$286/month** · High
5. **EC2 Underutilized** — dev-worker-01 (m5.large, CPU 6.1%, 54 days) · **$244/month** · High

All findings are deterministic — based on 14-day CloudWatch CPU metrics and On-Demand pricing in us-east-1.`

const UNDERUTILIZED = `I found **8 EC2 instances** with average CPU utilization below 10% over the past 14 days.

**High confidence — likely idle:**
• **ml-experiment-01** (m5.2xlarge) — 2.3% CPU, 47 days running · $312/month savings
• **dev-api-01** (t3.large) — 3.2% CPU, 89 days running · $198/month savings
• **batch-worker-07** (m5.xlarge) — 4.8% CPU, 63 days running · $286/month savings
• **sandbox-01** (t3.large) — 5.5% CPU, 71 days running · $174/month savings

**Review before stopping:**
• **dev-worker-01** (m5.large) — 6.1% CPU, 54 days running · $244/month savings
• **test-runner-01** (c5.large) — 7.8% CPU, 38 days running · $148/month savings
• **legacy-service-01** (m5.xlarge) — 8.9% CPU, 112 days running · $152/month savings
• **zookeeper-01** (t3.medium) — 8.4% CPU, 94 days running · $62/month savings

**Combined potential savings: $1,576/month** from underutilized instances alone.

Note: I recommend verifying zookeeper-01 and legacy-service-01 — they may serve coordination roles despite low CPU.`

const BIGGEST_COST = `Your top cost centers for the current period (**$18,426.72 total**):

| Service | Monthly Cost | Share |
|---|---|---|
| Amazon EC2 | $7,842.30 | 42.6% |
| Amazon RDS | $4,231.80 | 23.0% |
| Data Transfer | $2,113.90 | 11.5% |
| Amazon S3 | $1,463.20 | 7.9% |
| AWS Lambda | $841.60 | 4.6% |
| Amazon CloudWatch | $521.40 | 2.8% |
| Other | $1,412.52 | 7.7% |

EC2 + RDS together account for **65.6% of your spend** — and that's also where the highest optimization potential exists. I've identified $2,012/month in EC2 savings and $508/month in S3 savings.

Data transfer costs ($2,113.90) are worth a closer look — 11.5% of your bill, which is elevated for your environment size. The July 18 spike correlates with increased outbound transfer.`

const HOW_MUCH = `Based on current resource utilization, I've identified **$3,284/month** in optimization opportunities:

**By category:**
• EC2 Underutilization (8 instances) — **$1,576/month**
• EC2 Rightsizing (4 instances) — **$1,048/month**
• S3 Storage Optimization (3 buckets) — **$508/month**
• NAT Gateway Optimization (2 gateways) — **$152/month**

**If all opportunities were implemented:**
• Current bill: $18,426.72/month
• Optimized bill: ~$15,142.72/month
• Reduction: **−17.8%**
• Annual savings: **$39,408**

All figures are estimates based on measured CloudWatch data and On-Demand pricing in us-east-1. Actual savings may vary based on usage changes.

**Recommended starting point:** The 4 EC2 rightsizing opportunities can be evaluated with minimal risk and represent $1,048/month in savings — a good first target.`

const INVESTIGATE_FIRST = `Based on confidence level, impact, and risk, here's the recommended investigation order:

**Start here — high confidence, low risk:**

1. **ml-experiment-01** — 47 days at 2.3% CPU on m5.2xlarge. Almost certainly idle compute. Safe to stop. **$312/month.**

2. **sandbox-01** — 71 days at 5.5% CPU. Likely a forgotten sandbox. Verify it's not serving a shared environment. **$174/month.**

**High impact, moderate assessment required:**

3. **prod-analytics-01 rightsizing** — m5.4xlarge at 18.4% CPU for 30+ days. Consistently low. Downsize to m5.2xlarge saves **$412/month.** Test during off-peak hours.

4. **prod-analytics-02 rightsizing** — m5.2xlarge at 21.3%. Downsize to m5.xlarge saves **$290/month.**

**Investigate before acting:**

5. **Data transfer costs ($2,113.90)** — 11.5% of your bill is above typical. Audit outbound transfer from EC2 to internet or cross-AZ traffic.

6. **legacy-service-01** — 112 days running at 8.9% CPU. Old services can have hidden dependencies. Check before stopping.

**Total addressable with low risk (items 1–4): $1,188/month.**`

const DEFAULT_RESPONSE = `I can analyze your AWS environment based on cost data, resource inventory, and optimization findings.

**Current environment summary:**
• Total spend: **$18,426.72** this period (↑8.7%)
• **147 resources** — EC2: 42 · RDS: 8 · S3: 97
• **17 optimization opportunities** identified
• **$3,284/month** in potential savings

I can help you understand:
• Cost trends and what's driving them
• Specific resource utilization
• Optimization recommendations and prioritization
• EC2 rightsizing and underutilization analysis

What would you like to explore?`

type ResponseKey = 'welcome' | 'costIncrease' | 'savings' | 'underutilized' | 'biggest' | 'howMuch' | 'first' | 'default'

const RESPONSES: Record<ResponseKey, string> = {
  welcome: WELCOME,
  costIncrease: COST_INCREASE,
  savings: SAVINGS,
  underutilized: UNDERUTILIZED,
  biggest: BIGGEST_COST,
  howMuch: HOW_MUCH,
  first: INVESTIGATE_FIRST,
  default: DEFAULT_RESPONSE,
}

export function getDemoResponse(question: string): string {
  const q = question.toLowerCase()

  if (q.includes('increase') || q.includes('went up') || q.includes('higher') || q.includes('more') || q.includes('why did'))
    return RESPONSES.costIncrease

  if ((q.includes('save') || q.includes('saving') || q.includes('savings')) && !q.includes('first'))
    return RESPONSES.savings

  if (q.includes('underutil') || q.includes('idle') || q.includes('unused') || q.includes('low cpu'))
    return RESPONSES.underutilized

  if (q.includes('biggest') || q.includes('most') || q.includes('expensive') || q.includes('costing'))
    return RESPONSES.biggest

  if (q.includes('how much') || q.includes('total saving') || q.includes('how many'))
    return RESPONSES.howMuch

  if (q.includes('first') || q.includes('start') || q.includes('investigate') || q.includes('priorit') || q.includes('begin'))
    return RESPONSES.first

  return RESPONSES.default
}
