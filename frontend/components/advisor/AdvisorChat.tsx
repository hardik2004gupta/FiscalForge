'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, AlertCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { queryAdvisor, ApiError } from '@/lib/api'
import { cn } from '@/lib/utils'

const ADVISOR_UNAVAILABLE =
  'The AI advisor is temporarily unavailable. Your AWS cost and resource data are still available in the Dashboard, Costs, and Resources sections.'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const WELCOME: Message = {
  role: 'assistant',
  content:
    "Hello! I'm FiscalForge's AI advisor. I can analyze your AWS spending patterns, explain cost changes, and surface optimization opportunities. My answers are grounded in your actual AWS data — I'll always distinguish between measured values and estimates.",
  timestamp: new Date(),
}

interface AdvisorChatProps {
  pendingMessage?: string
  onPendingMessageConsumed?: () => void
}

export function AdvisorChat({ pendingMessage, onPendingMessageConsumed }: AdvisorChatProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (pendingMessage) {
      setInput(pendingMessage)
      onPendingMessageConsumed?.()
      inputRef.current?.focus()
    }
  }, [pendingMessage, onPendingMessageConsumed])

  async function handleSend() {
    const text = input.trim()
    if (!text || isLoading) return

    const userMsg: Message = { role: 'user', content: text, timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const res = await queryAdvisor({ message: text })
      const assistantMsg: Message = {
        role: 'assistant',
        content: res.response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
      const isAdvisorDown =
        err instanceof ApiError && (err.statusCode === 503 || err.code === 'AGENT_ERROR')
      setError(
        isAdvisorDown
          ? ADVISOR_UNAVAILABLE
          : err instanceof Error
            ? err.message
            : 'Failed to get response.',
      )
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full rounded-lg border border-border bg-card overflow-hidden shadow-card">
      {/* Advisor header strip */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border bg-muted/20">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 shrink-0">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground leading-none">FiscalForge Advisor</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Grounded in your AWS data</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          <span className="text-[10px] text-muted-foreground">Ready</span>
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 shrink-0">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="flex gap-1 items-center py-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2.5 rounded-lg border border-warning/20 bg-warning/5 px-4 py-3">
            <AlertCircle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
            <p className="text-xs text-foreground leading-relaxed">{error}</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border p-4 bg-muted/10">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your AWS costs, resources, or savings opportunities…"
            rows={1}
            className={cn(
              'flex-1 resize-none rounded-lg border border-border bg-card px-3.5 py-2.5',
              'text-sm text-foreground placeholder:text-muted-foreground/60',
              'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50',
              'min-h-[40px] max-h-32 overflow-y-auto transition-colors',
            )}
            style={{ fieldSizing: 'content' } as React.CSSProperties}
            disabled={isLoading}
            aria-label="Message input"
          />
          <Button
            onClick={() => void handleSend()}
            disabled={!input.trim() || isLoading}
            size="sm"
            className="shrink-0 h-10 w-10 p-0"
            aria-label="Send message"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
        <p className="mt-1.5 text-[10px] text-muted-foreground/60">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex items-start gap-3', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-full shrink-0',
          isUser ? 'bg-foreground' : 'bg-primary/10',
        )}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5 text-background" />
        ) : (
          <Bot className="h-3.5 w-3.5 text-primary" />
        )}
      </div>

      <div
        className={cn(
          'max-w-[80%] rounded-xl px-4 py-3 text-sm',
          isUser
            ? 'bg-foreground text-background rounded-tr-sm'
            : 'bg-muted text-foreground rounded-tl-sm',
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        <p
          className={cn(
            'mt-1.5 text-[10px]',
            isUser ? 'text-background/50' : 'text-muted-foreground',
          )}
        >
          {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}
