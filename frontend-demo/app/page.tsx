import Link from 'next/link'
import { ArrowRight, Zap, Shield, TrendingDown, Bot, BarChart3, Server } from 'lucide-react'

const FLOW = [
  { label: 'Next.js', sub: 'Frontend' },
  { label: 'API Gateway', sub: 'HTTP API' },
  { label: 'Lambda', sub: 'Python 3.11' },
  { label: 'AWS APIs', sub: 'Cost Explorer · EC2 · RDS · S3' },
  { label: 'Optimization', sub: 'Deterministic rules' },
  { label: 'AI Agent', sub: 'LangGraph · GPT-4o' },
]

const FEATURES = [
  { icon: BarChart3, title: 'Cost Intelligence', desc: 'Daily spending trends, service breakdown, and period-over-period comparison from AWS Cost Explorer.' },
  { icon: Server, title: 'Resource Inventory', desc: 'EC2, RDS, and S3 inventory with utilization metrics pulled from CloudWatch.' },
  { icon: TrendingDown, title: 'Optimization Engine', desc: 'Deterministic rule-based engine surfaces rightsizing and underutilization opportunities.' },
  { icon: Bot, title: 'Agentic AI Advisor', desc: 'LangGraph agent answers cost questions in natural language, grounded in your actual AWS data.' },
  { icon: Shield, title: 'Human-Approval Safety', desc: 'AI recommends; humans approve. EC2 actions require an explicit confirmation step before Lambda executes.' },
  { icon: Zap, title: 'Serverless Architecture', desc: 'One Lambda, one API Gateway, one AI agent. Simple, deployable, and fully explainable.' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">FF</span>
            <span className="text-sm font-semibold text-foreground">FiscalForge</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Open Dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-medium text-primary mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Standalone Demo — No backend required
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-foreground mb-5">
            Understand your AWS spend.<br />
            <span className="text-primary">Find savings. Act with confidence.</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            FiscalForge is a production-style serverless FinOps platform — one Lambda, one AI agent, four questions answered. Built to demonstrate clean architecture over unnecessary complexity.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/advisor"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
            >
              <Bot className="h-4 w-4 text-primary" />
              Try AI Advisor
            </Link>
          </div>
        </div>
      </section>

      {/* Architecture flow */}
      <section className="py-12 px-6 border-y border-border/50 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-6">Architecture</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {FLOW.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className="rounded-lg border border-border bg-card px-4 py-3 text-center shadow-card min-w-[110px]">
                  <p className="text-xs font-semibold text-foreground">{step.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{step.sub}</p>
                </div>
                {i < FLOW.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-[10px] text-muted-foreground mt-5">
            1 frontend · 1 API boundary · 1 Lambda · 1 optimization engine · 1 AI agent
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Capabilities</p>
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Four questions. Every answer.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-lg border border-border bg-card p-5 shadow-card hover:shadow-card-hover transition-shadow">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 mb-3">
                  <f.icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-6 border-t border-border/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-bold text-foreground mb-3">Ready to explore?</h2>
          <p className="text-sm text-muted-foreground mb-6">All data is simulated. No AWS account. No environment variables. Just open the dashboard.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Open Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/50 px-6 py-5">
        <p className="text-center text-[11px] text-muted-foreground">
          FiscalForge — Demo mode · All data is simulated · No real AWS resources are accessed
        </p>
      </footer>
    </div>
  )
}
