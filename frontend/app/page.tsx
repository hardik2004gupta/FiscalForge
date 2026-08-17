/**
 * Homepage — FiscalForge marketing page.
 *
 * Phase 3: implement full landing page with:
 *   - Hero section with tagline and CTA buttons ("Open Dashboard", "View Architecture")
 *   - Architecture data-flow diagram
 *   - Feature highlights (Cost Analytics, Optimization Engine, AI Advisor)
 *   - Technology stack display
 */
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-bold tracking-tight text-foreground">
        FiscalForge
      </h1>
      <p className="mt-4 text-xl text-primary font-medium">
        Serverless AWS FinOps Platform with Agentic AI
      </p>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Understand your AWS spend. Find savings. Act with confidence.
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          href="/dashboard"
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Open Dashboard
        </Link>
        <Link
          href="/advisor"
          className="rounded-md border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
        >
          AI Advisor
        </Link>
      </div>

      <p className="mt-16 text-xs text-muted-foreground">
        Phase 3: full homepage with architecture diagram coming soon.
      </p>
    </main>
  )
}
