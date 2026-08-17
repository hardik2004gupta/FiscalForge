import Link from 'next/link'
import {
  ArrowRight,
  Zap,
  TrendingDown,
  ShieldCheck,
  BarChart3,
  Server,
  MessageSquare,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react'

// Static representative numbers for marketing homepage — not live API data
const PREVIEW_TOTAL = '$4,281'
const PREVIEW_CHANGE = '+12.4%'
const PREVIEW_SAVINGS = '$842/mo'
const PREVIEW_RECS = '12 opportunities'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 h-14 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary shadow-sm">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground tracking-tight">FiscalForge</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors shadow-sm"
          >
            Open Dashboard
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-8 pt-20 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left — copy */}
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide">
                SERVERLESS AWS FINOPS
              </span>
            </div>

            <h1 className="text-[2.75rem] font-bold tracking-tight text-foreground leading-[1.1] text-balance mb-6">
              Understand your
              <br />
              AWS spend.
              <br />
              <span className="text-primary">Find savings.</span>
            </h1>

            <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-md">
              FiscalForge gives your team real-time visibility into AWS costs, identifies resource
              waste through deterministic rules, and surfaces insights via an AI advisor grounded
              in your actual data.
            </p>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors shadow-sm"
              >
                Open Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/advisor"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                Try AI Advisor
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {[
                'One Lambda function',
                'Terraform-managed',
                'Human-in-the-loop AI',
              ].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                  <span className="text-xs text-muted-foreground">{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — product preview card */}
          <div className="flex-1 max-w-sm w-full">
            <div className="rounded-xl border border-border bg-card shadow-card-hover p-5 relative">
              {/* Mini dashboard header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                    AWS Overview
                  </p>
                  <p className="text-xs font-medium text-foreground mt-0.5">Cost Intelligence</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Operational
                </div>
              </div>

              {/* Total spend */}
              <div className="mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                  Total Spend
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold tracking-tight text-foreground font-numeric">
                    {PREVIEW_TOTAL}
                  </span>
                  <span className="text-xs font-semibold text-destructive bg-destructive/8 px-1.5 py-0.5 rounded">
                    {PREVIEW_CHANGE}
                  </span>
                </div>
              </div>

              {/* Mini sparkline — pure CSS bars representing cost trend */}
              <div className="flex items-end gap-0.5 h-14 mb-4">
                {[45, 52, 48, 61, 58, 72, 68, 75, 70, 82, 78, 85, 92, 88, 95].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${h}%`,
                        backgroundColor:
                          i === 14
                            ? 'hsl(237 76% 54%)'
                            : 'hsl(237 76% 54% / 0.15)',
                      }}
                    />
                  ),
                )}
              </div>

              {/* Savings callout */}
              <div className="rounded-lg border border-success/20 bg-success/5 px-3 py-2.5 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-success/80 mb-0.5">
                    Potential Savings
                  </p>
                  <p className="text-base font-bold text-success font-numeric">{PREVIEW_SAVINGS}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-muted-foreground">{PREVIEW_RECS}</p>
                  <Link
                    href="/resources"
                    className="text-[10px] text-primary flex items-center gap-0.5 justify-end mt-0.5 hover:underline"
                  >
                    View <ArrowUpRight className="h-2.5 w-2.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Architecture flow ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-8 py-12">
        <div className="text-center mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Architecture
          </p>
          <p className="text-lg font-semibold text-foreground">One Lambda. One agent. No clusters.</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-card">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { label: 'Next.js', sub: 'Frontend' },
              null,
              { label: 'API Gateway', sub: 'HTTP API' },
              null,
              { label: 'Lambda', sub: 'Python backend', highlight: true },
              null,
              { label: 'AWS APIs', sub: 'Cost + Resources' },
            ].map((node, i) =>
              node === null ? (
                <div key={i} className="flex items-center">
                  <div className="h-px w-8 bg-border" />
                  <div className="h-1.5 w-1.5 rounded-full bg-border -ml-0.5" />
                </div>
              ) : (
                <div
                  key={node.label}
                  className={`rounded-lg border px-4 py-3 text-center min-w-[100px] ${
                    node.highlight
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-border bg-muted/40'
                  }`}
                >
                  <p
                    className={`text-xs font-semibold ${node.highlight ? 'text-primary' : 'text-foreground'}`}
                  >
                    {node.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{node.sub}</p>
                </div>
              ),
            )}
          </div>

          <div className="flex justify-center gap-3 mt-4">
            {[
              { icon: BarChart3, label: 'Cost Analytics' },
              { icon: Server, label: 'Resource Inventory' },
              { icon: TrendingDown, label: 'Optimization Engine' },
              { icon: MessageSquare, label: 'LangGraph Agent' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="h-3.5 w-3.5 text-primary/60" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature sections ──────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-8 py-12">
        <div className="text-center mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Capabilities
          </p>
          <p className="text-lg font-semibold text-foreground">Four questions. One platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              num: '01',
              icon: BarChart3,
              title: 'See the money',
              desc: 'Real-time AWS cost visibility with period-over-period comparisons, daily trends, and service-level breakdown from Cost Explorer.',
            },
            {
              num: '02',
              icon: TrendingDown,
              title: 'Find the waste',
              desc: 'Deterministic rule engine detects underutilized EC2, oversized RDS, and inefficient S3 storage. Same input always produces the same result.',
            },
            {
              num: '03',
              icon: MessageSquare,
              title: 'Ask the advisor',
              desc: 'Natural-language FinOps advisor powered by LangGraph. Answers are grounded in your actual AWS data with clear labels for measured vs. estimated values.',
            },
            {
              num: '04',
              icon: ShieldCheck,
              title: 'Act safely',
              desc: 'The AI recommends — it never acts. Every cloud change requires explicit user confirmation before Lambda executes the action.',
            },
          ].map(({ num, icon: Icon, title, desc }) => (
            <div
              key={num}
              className="group rounded-lg border border-border bg-card p-6 shadow-card hover:shadow-card-hover transition-shadow duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/8 shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span className="text-[10px] font-semibold text-muted-foreground/60">{num}</span>
                    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-8 py-12">
        <div className="rounded-xl border border-border bg-card p-8 text-center shadow-card">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Get started
          </p>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Ready to optimize your AWS spend?
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Open the dashboard to see your real AWS cost data, or explore the AI advisor to start
            asking questions.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors shadow-sm"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/advisor"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              Talk to the Advisor
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary">
              <Zap className="h-3 w-3 text-white" />
            </div>
            <span className="text-xs font-semibold text-foreground">FiscalForge</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Next.js · Python Lambda · LangGraph · Terraform
          </p>
        </div>
      </footer>
    </div>
  )
}
