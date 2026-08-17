'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { queryAdvisor } from '@/lib/api'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const WELCOME: Message = {
  role: 'assistant',
  content:
    "Hello! I'm FiscalForge's AI advisor. I can analyze your AWS spending patterns, explain cost changes, and suggest optimization opportunities. My answers are grounded in your actual AWS data — I'll always distinguish between measured values and estimates. What would you like to know?",
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
  }, [messages])

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
      setError(err instanceof Error ? err.message : 'Failed to get response.')
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
    <div className="flex flex-col h-full rounded-lg border border-border bg-card overflow-hidden">
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
                  className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-destructive/8 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your AWS costs…"
            rows={1}
            className={cn(
              'flex-1 resize-none rounded-md border border-border bg-background px-3 py-2',
              'text-sm text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0',
              'min-h-[38px] max-h-32 overflow-y-auto',
            )}
            style={{ fieldSizing: 'content' } as React.CSSProperties}
            disabled={isLoading}
            aria-label="Message input"
          />
          <Button
            onClick={() => void handleSend()}
            disabled={!input.trim() || isLoading}
            size="sm"
            className="shrink-0"
            aria-label="Send message"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
        <p className="mt-1.5 text-[10px] text-muted-foreground">
          Press Enter to send · Shift+Enter for new line
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
          isUser ? 'bg-primary' : 'bg-primary/10',
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-primary" />
        )}
      </div>

      <div
        className={cn(
          'max-w-[78%] rounded-lg px-3.5 py-2.5 text-sm',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-muted text-foreground rounded-tl-sm',
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        <p
          className={cn(
            'mt-1 text-[10px]',
            isUser ? 'text-primary-foreground/60' : 'text-muted-foreground',
          )}
        >
          {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}
