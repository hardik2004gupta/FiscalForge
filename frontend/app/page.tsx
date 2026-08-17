import Link from 'next/link'
import { ArrowRight, Zap, TrendingDown, ShieldCheck, BarChart3, Server, MessageSquare } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 h-16 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground">FiscalForge</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Open Dashboard
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-8 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 mb-6">
          <Zap className="h-3 w-3 text-primary" />
          <span className="text-xs font-medium text-primary">AWS FinOps Platform</span>
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-foreground leading-tight">
          Understand your AWS spend.
          <br />
          <span className="text-primary">Find savings. Act with confidence.</span>
        </h1>

        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          FiscalForge gives your team real-time visibility into AWS costs, intelligently identifies
          waste, and surfaces optimization opportunities — with an AI advisor grounded in your
          actual data.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Open Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/advisor"
            className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            Try AI Advisor
          </Link>
        </div>
      </section>

      {/* Data Flow Visual */}
      <section className="max-w-4xl mx-auto px-8 py-8">
        <div className="rounded-xl border border-border bg-card p-8">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {['AWS Cost Explorer', 'EC2 Inventory', 'RDS & S3'].map((src, i) => (
              <div key={src} className="flex items-center gap-4">
                <div className="rounded-lg border border-border bg-muted px-4 py-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Source</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{src}</p>
                </div>
                {i < 2 && <div className="h-px w-8 bg-border hidden sm:block" />}
              </div>
            ))}
          </div>

          <div className="flex justify-center my-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-px h-8 bg-border" />
              <div className="rounded-md bg-primary/10 border border-primary/20 px-4 py-2 text-center">
                <p className="text-xs font-medium text-primary">Lambda Backend</p>
                <p className="text-[10px] text-muted-foreground">Deterministic Optimization Engine</p>
              </div>
              <div className="w-px h-8 bg-border" />
            </div>
          </div>

          <div className="flex items-stretch justify-center gap-3 flex-wrap">
            {[
              { icon: BarChart3, label: 'Cost Analytics' },
              { icon: Server, label: 'Resource Inventory' },
              { icon: TrendingDown, label: 'Optimization' },
              { icon: MessageSquare, label: 'AI Advisor' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-lg border border-border bg-muted px-4 py-3"
              >
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: BarChart3,
              title: 'Real-time Cost Visibility',
              desc: 'See exactly where your AWS budget goes — by service, by day, with period-over-period comparisons.',
            },
            {
              icon: TrendingDown,
              title: 'Deterministic Optimization',
              desc: 'Rule-based detection of underutilized EC2, oversized RDS, and inefficient S3 storage. Same input, same result — always.',
            },
            {
              icon: MessageSquare,
              title: 'AI Advisor',
              desc: 'Ask questions in natural language. Get answers grounded in your actual AWS data, with clear labels for measured vs estimated values.',
            },
            {
              icon: ShieldCheck,
              title: 'Human-in-the-Loop Safety',
              desc: 'The AI advisor never executes actions. Every cloud change requires explicit user confirmation before Lambda acts.',
            },
            {
              icon: Server,
              title: 'Resource Inventory',
              desc: 'Complete EC2, RDS, and S3 inventory with utilization metrics and estimated monthly costs per resource.',
            },
            {
              icon: Zap,
              title: 'Serverless Architecture',
              desc: 'One Lambda. One API Gateway. Terraform-managed. No clusters, no databases, no operational overhead.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-lg border border-border bg-card p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center">
        <p className="text-xs text-muted-foreground">
          FiscalForge — AWS FinOps Platform · Built with Next.js, Python Lambda, and LangGraph
        </p>
      </footer>
    </div>
  )
}
