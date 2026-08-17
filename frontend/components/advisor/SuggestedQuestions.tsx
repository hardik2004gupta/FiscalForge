import { ArrowUpRight } from 'lucide-react'

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void
}

const QUESTIONS = [
  'Why did my AWS costs increase this month?',
  'Which EC2 instances are underutilized?',
  'What are my top cost optimization opportunities?',
  'How does my RDS spend compare to EC2?',
  'Which services account for the most spend?',
]

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
      <div className="px-4 py-3 border-b border-border">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Suggested Questions
        </p>
      </div>
      <div className="p-2 space-y-0.5">
        {QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="group w-full flex items-start justify-between gap-2 text-left px-3 py-2.5 rounded-md hover:bg-muted/60 transition-colors"
          >
            <span className="text-xs text-muted-foreground group-hover:text-foreground leading-relaxed transition-colors">
              {q}
            </span>
            <ArrowUpRight className="h-3 w-3 text-muted-foreground/40 group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  )
}
