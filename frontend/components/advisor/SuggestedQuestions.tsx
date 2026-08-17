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
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
        Suggested Questions
      </h3>
      <div className="space-y-1.5">
        {QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="w-full text-left text-sm text-foreground hover:text-primary hover:bg-muted px-3 py-2 rounded-md transition-colors"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}
