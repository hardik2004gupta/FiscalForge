'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getDemoResponse, SUGGESTED_QUESTIONS } from '@/lib/demo-data/advisor'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  ts: number
}

let msgId = 0
function nextId() { return `m${++msgId}` }

const INITIAL: Message[] = [
  {
    id: nextId(),
    role: 'assistant',
    content:
      "Hello! I'm FiscalForge AI, your AWS cost intelligence advisor. I can analyze your spending patterns, explain cost drivers, and recommend optimizations based on your actual AWS data.\n\nWhat would you like to know about your AWS costs?",
    ts: Date.now(),
  },
]

export function AdvisorChat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  function send(text: string) {
    const q = text.trim()
    if (!q || thinking) return

    const userMsg: Message = { id: nextId(), role: 'user', content: q, ts: Date.now() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setThinking(true)

    // Keyword-based response — no network call
    const delay = 900 + Math.floor(getDemoResponse(q).length / 12) * 10
    setTimeout(() => {
      const reply: Message = {
        id: nextId(),
        role: 'assistant',
        content: getDemoResponse(q),
        ts: Date.now(),
      }
      setMessages((prev) => [...prev, reply])
      setThinking(false)
    }, Math.min(delay, 2200))
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <div className="flex flex-col h-full rounded-lg border border-border bg-card shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-3 bg-card/80">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 shrink-0">
          <Bot className="h-3.5 w-3.5 text-primary" />
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">FiscalForge AI</p>
          <p className="text-[10px] text-muted-foreground">Powered by LangGraph · GPT-4o</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] text-success font-medium">Demo mode</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn('flex gap-2.5', m.role === 'user' && 'flex-row-reverse')}
          >
            <div className={cn(
              'flex h-6 w-6 shrink-0 items-center justify-center rounded-full mt-0.5',
              m.role === 'assistant' ? 'bg-primary/10' : 'bg-muted',
            )}>
              {m.role === 'assistant'
                ? <Bot className="h-3 w-3 text-primary" />
                : <User className="h-3 w-3 text-muted-foreground" />
              }
            </div>
            <div
              className={cn(
                'max-w-[78%] rounded-lg px-3.5 py-2.5 text-xs leading-relaxed',
                m.role === 'assistant'
                  ? 'bg-muted/50 text-foreground'
                  : 'bg-primary text-primary-foreground',
              )}
            >
              {m.content.split('\n').map((line, i) => (
                <span key={i}>{line}{i < m.content.split('\n').length - 1 && <br />}</span>
              ))}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex gap-2.5">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
              <Bot className="h-3 w-3 text-primary" />
            </div>
            <div className="rounded-lg px-3.5 py-3 bg-muted/50 flex items-center gap-2">
              <Loader2 className="h-3 w-3 text-muted-foreground animate-spin" />
              <span className="text-xs text-muted-foreground">Analyzing AWS data…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      {messages.length < 3 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {SUGGESTED_QUESTIONS.slice(0, 3).map((q) => (
            <button
              key={q.id}
              onClick={() => send(q.text)}
              className="text-[10px] font-medium rounded-full border border-border px-2.5 py-1 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors truncate max-w-[220px]"
            >
              {q.text}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border px-4 py-3 flex gap-2 items-center">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Ask about your AWS costs…"
          disabled={thinking}
          className="flex-1 rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || thinking}
          className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-colors shrink-0"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
