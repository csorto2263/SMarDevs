'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { X, Send, Loader2, MessageSquare, RotateCcw } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface LeadData {
  type: 'company' | 'candidate' | null
  full_name: string | null
  email: string | null
  company_name: string | null
  company_website: string | null
  role_needed: string | null
  positions: string | null
  seniority: string | null
  timeline: string | null
  role_interest: string | null
  phone: string | null
}

// ── Constants ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'smarty_messages'
const SESSION_KEY = 'smarty_session_id'
const SESSION_START_KEY = 'smarty_session_start'
const LEAD_KEY = 'smarty_lead_data'
const INACTIVITY_MS = 15 * 60 * 1000

const GREETING_EN = "Hi, I'm SMarty — your SMarDevs assistant. I'm here to help you find the right information quickly.\n\nTo get started, which best describes you?"
const GREETING_ES = "Hola, soy SMarty — tu asistente de SMarDevs. Estoy aquí para ayudarte a encontrar la información correcta rápidamente.\n\nPara comenzar, ¿cuál te describe mejor?"

const SPEECH_EN = "Hey! I can help you"
const SPEECH_ES = "Hey! Te puedo ayudar"

// ── Helpers ────────────────────────────────────────────────────────────────────
function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function getOrCreateSession() {
  if (typeof window === 'undefined') return { id: '', startedAt: '' }
  let id = sessionStorage.getItem(SESSION_KEY)
  let startedAt = sessionStorage.getItem(SESSION_START_KEY)
  if (!id) {
    id = generateId()
    startedAt = new Date().toISOString()
    sessionStorage.setItem(SESSION_KEY, id)
    sessionStorage.setItem(SESSION_START_KEY, startedAt)
  }
  return { id, startedAt: startedAt || new Date().toISOString() }
}

function detectLang(): 'en' | 'es' {
  return 'en' // default English — LLM switches based on user's language
}

function extractLeadData(messages: Message[]): LeadData {
  const userText = messages.filter(m => m.role === 'user').map(m => m.content).join('\n')

  // Determine type from quick-reply or conversation
  let type: 'company' | 'candidate' | null = null
  const hiringSignals = /\b(hiring|hire|looking to hire|need (a |an )?(developer|engineer|designer|qa|devops|pm|ba|team)|staff augmentation|i('m| am) hiring|contratar|necesit(o|amos)|talent for my company|talento para mi empresa)\b/i
  const candidateSignals = /\b(looking for (a )?job|job seeker|open (positions|roles)|want to apply|apply|career|candidate|busco (empleo|trabajo)|quiero aplicar|oportunidad|exploring career|career opportunities)\b/i

  if (hiringSignals.test(userText)) type = 'company'
  else if (candidateSignals.test(userText)) type = 'candidate'

  // Extract email
  const emailMatch = userText.match(/[\w.+-]+@[\w-]+\.[\w.]+/)
  const email = emailMatch ? emailMatch[0] : null

  // Extract phone number
  const phoneMatch = userText.match(/\+?[\d\s()-]{7,15}/)
  const phone = phoneMatch ? phoneMatch[0].trim() : null

  // Extract website
  const websiteMatch = userText.match(/(?:https?:\/\/)?(?:www\.)?[\w-]+\.[\w.]{2,}(?:\/\S*)?/i)
  // Don't confuse email domains or linkedin as websites
  const website = websiteMatch && !websiteMatch[0].includes('@') && !websiteMatch[0].includes('linkedin.com')
    ? websiteMatch[0] : null

  return {
    type,
    full_name: null, // extracted server-side from conversation context
    email,
    company_name: null,
    company_website: website,
    role_needed: null,
    positions: null,
    seniority: null,
    timeline: null,
    role_interest: null,
    phone,
  }
}

// ── Markdown renderer ──────────────────────────────────────────────────────────
// Supports: [links](url), **bold**, *italic*, `code`, - bullet lists, newlines
function RenderContent({ text }: { text: string }) {
  // Split by markdown links first to preserve them
  const linkParts = text.split(/(\[.*?\]\(.*?\))/)

  return (
    <>
      {linkParts.map((part, i) => {
        // Handle markdown links
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/)
        if (linkMatch) {
          const [, label, href] = linkMatch
          const isExternal = href.startsWith('http')
          if (isExternal) {
            return (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                className="text-brand-600 hover:text-brand-700 underline underline-offset-2 font-medium">
                {label}
              </a>
            )
          }
          return (
            <Link key={i} href={href}
              className="text-brand-600 hover:text-brand-700 underline underline-offset-2 font-medium">
              {label}
            </Link>
          )
        }

        // Handle inline formatting: **bold**, *italic*, `code`, newlines, bullet lists
        return <InlineFormat key={i} text={part} />
      })}
    </>
  )
}

function InlineFormat({ text }: { text: string }) {
  // Split into lines for bullet list and newline handling
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, li) => {
        // Bullet list items: "- text" or "• text"
        const bulletMatch = line.match(/^\s*[-•]\s+(.+)$/)
        if (bulletMatch) {
          return (
            <span key={li} className="flex gap-1.5 items-start mt-0.5">
              <span className="text-brand-500 shrink-0 mt-px">•</span>
              <span><FormatInline text={bulletMatch[1]} /></span>
            </span>
          )
        }

        return (
          <span key={li}>
            <FormatInline text={line} />
            {li < lines.length - 1 && <br />}
          </span>
        )
      })}
    </>
  )
}

function FormatInline({ text }: { text: string }) {
  // Match **bold**, *italic*, `code` — in order of specificity
  const tokens = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/)
  return (
    <>
      {tokens.map((token, i) => {
        if (token.startsWith('**') && token.endsWith('**')) {
          return <strong key={i} className="font-semibold">{token.slice(2, -2)}</strong>
        }
        if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
          return <em key={i}>{token.slice(1, -1)}</em>
        }
        if (token.startsWith('`') && token.endsWith('`')) {
          return <code key={i} className="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">{token.slice(1, -1)}</code>
        }
        return <span key={i}>{token}</span>
      })}
    </>
  )
}

// ── Quick Reply Buttons ────────────────────────────────────────────────────────
function QuickReplies({ onSelect }: { onSelect: (text: string) => void }) {
  const lang = detectLang()
  const options = lang === 'es'
    ? [
        { label: '🏢 Quiero contratar talento', value: 'Estoy buscando contratar talento para mi empresa' },
        { label: '💼 Busco oportunidades', value: 'Estoy buscando oportunidades de trabajo' },
        { label: '❓ Tengo una pregunta', value: 'Tengo una pregunta general sobre SMarDevs' },
      ]
    : [
        { label: "🏢 I'm looking to hire", value: "I'm looking to hire talent for my company" },
        { label: '💼 Exploring careers', value: "I'm exploring career opportunities" },
        { label: '❓ I have a question', value: 'I have a general question about SMarDevs' },
      ]

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => onSelect(opt.value)}
          className="px-3.5 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-medium rounded-xl border border-brand-200 hover:border-brand-300 transition-all hover:shadow-sm"
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ── Widget ──────────────────────────────────────────────────────────────────────
export default function SMartyWidget() {
  const pathname = usePathname()
  const [open, setOpen]           = useState(false)
  const [messages, setMessages]   = useState<Message[]>([])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [transcriptSent, setTranscriptSent] = useState(false)
  const [showSpeech, setShowSpeech]         = useState(false)
  const [speechDismissed, setSpeechDismissed] = useState(false)
  const [bubbleReady, setBubbleReady]       = useState(false)
  const [bubbleBouncing, setBubbleBouncing] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef       = useRef<HTMLTextAreaElement>(null)
  const inactivityRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reminderRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const sessionRef     = useRef({ id: '', startedAt: '' })

  // Don't render on admin pages
  if (pathname?.startsWith('/admin')) return null

  // ── Lifecycle ──

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    sessionRef.current = getOrCreateSession()
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setMessages(parsed)
        // If only greeting exists, show quick replies
        if (parsed.length === 1 && parsed[0].role === 'assistant') {
          setShowQuickReplies(true)
        }
      } catch { /* ignore */ }
    }

    // Bubble entrance — delayed 500ms after page load
    const entranceTimer = setTimeout(() => setBubbleReady(true), 500)

    // First speech bubble + bounce — 3s after page load
    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => {
      setBubbleBouncing(true)
      setShowSpeech(true)
    }, 3000))
    timers.push(setTimeout(() => setBubbleBouncing(false), 4200))
    timers.push(setTimeout(() => setShowSpeech(false), 9000))

    // Repeat every 60s if user hasn't opened the chat
    reminderRef.current = setInterval(() => {
      setOpen(prev => {
        if (prev) return prev // chat is open, skip
        setBubbleBouncing(true)
        setShowSpeech(true)
        setSpeechDismissed(false)
        setTimeout(() => setBubbleBouncing(false), 1200)
        setTimeout(() => setShowSpeech(false), 6000)
        return prev
      })
    }, 60000)

    return () => {
      clearTimeout(entranceTimer)
      timers.forEach(clearTimeout)
      if (reminderRef.current) clearInterval(reminderRef.current)
    }
  }, [])

  // Persist messages
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
      setTranscriptSent(false)
    }
  }, [messages])

  // Auto-scroll
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  // Focus input after loading/streaming finishes
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (open && !loading && !streaming) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open, loading, streaming])

  // ── Transcript ──

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const sendTranscript = useCallback(() => {
    if (transcriptSent) return
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return
    try {
      const msgs: Message[] = JSON.parse(saved)
      if (msgs.length < 2) return
      const { id, startedAt } = sessionRef.current
      const leadData = extractLeadData(msgs)
      const payload = JSON.stringify({
        sessionId: id,
        messages: msgs,
        startedAt,
        pageUrl: window.location.href,
        language: detectLang(),
        leadData,
      })
      navigator.sendBeacon('/api/chat/transcript', new Blob([payload], { type: 'application/json' }))
      setTranscriptSent(true)
    } catch { /* ignore */ }
  }, [transcriptSent])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const resetInactivity = useCallback(() => {
    if (inactivityRef.current) clearTimeout(inactivityRef.current)
    inactivityRef.current = setTimeout(sendTranscript, INACTIVITY_MS)
  }, [sendTranscript])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const handler = () => sendTranscript()
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [sendTranscript])

  // ── Actions ──

  const showGreeting = () => {
    const lang = detectLang()
    const greeting: Message = {
      role: 'assistant',
      content: lang === 'es' ? GREETING_ES : GREETING_EN,
      timestamp: new Date().toISOString(),
    }
    setMessages([greeting])
    setShowQuickReplies(true)
  }

  const handleOpen = () => {
    setOpen(true)
    setShowSpeech(false)
    setSpeechDismissed(true)
    setBubbleBouncing(false)
    // Stop repeating reminders once user has opened the chat
    if (reminderRef.current) { clearInterval(reminderRef.current); reminderRef.current = null }
    if (messages.length === 0) showGreeting()
    resetInactivity()
  }

  const handleClose = () => {
    setOpen(false)
    sendTranscript()
  }

  const handleClear = () => {
    sendTranscript()
    setMessages([])
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_START_KEY)
    sessionRef.current = getOrCreateSession()
    setTranscriptSent(false)
    setShowQuickReplies(false)
    setTimeout(showGreeting, 100)
  }

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText || input).trim()
    if (!text || loading || streaming) return

    setShowQuickReplies(false)
    const userMsg: Message = { role: 'user', content: text, timestamp: new Date().toISOString() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    if (!overrideText) setInput('')
    setLoading(true)
    resetInactivity()

    if (inputRef.current) inputRef.current.style.height = 'auto'

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) throw new Error('API error')

      setLoading(false)
      setStreaming(true)

      const assistantMsg: Message = { role: 'assistant', content: '', timestamp: new Date().toISOString() }
      setMessages(prev => [...prev, assistantMsg])

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        fullContent += chunk
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { ...updated[updated.length - 1], content: fullContent }
          return updated
        })
      }

      setStreaming(false)
    } catch {
      setLoading(false)
      setStreaming(false)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date().toISOString(),
      }])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const lang = detectLang()

  // ── Render ──

  return (
    <>
      {/* Chat Panel */}
      {open && (
        <div
          className="fixed bottom-24 right-5 z-50 w-[380px] max-w-[calc(100vw-2.5rem)] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-smarty-panel-in"
          style={{ height: 'min(560px, calc(100vh - 120px))' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-brand-600 to-brand-500 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-base">S</div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">SMarty</p>
                <p className="text-white/70 text-xs">SMarDevs Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={handleClear} title="New conversation"
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button onClick={handleClose}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white font-bold text-xs shrink-0 mt-0.5 mr-2">S</div>
                )}
                <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-sm'
                    : 'bg-white text-navy-950 border border-gray-100 shadow-sm rounded-tl-sm'
                }`}>
                  {msg.role === 'assistant' ? <RenderContent text={msg.content} /> : msg.content}
                  {msg.role === 'assistant' && streaming && i === messages.length - 1 && (
                    <span className="inline-block w-1.5 h-4 bg-brand-400 ml-0.5 animate-pulse rounded-sm" />
                  )}
                </div>
              </div>
            ))}

            {/* Quick reply buttons — shown after greeting */}
            {showQuickReplies && !loading && !streaming && (
              <QuickReplies onSelect={(text) => handleSend(text)} />
            )}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white font-bold text-xs shrink-0 mt-0.5 mr-2">S</div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 bg-white border-t border-gray-100 shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={lang === 'es' ? 'Escribe un mensaje…' : 'Type a message…'}
                rows={1}
                disabled={loading || streaming}
                className="flex-1 resize-none px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-navy-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all disabled:opacity-50 max-h-24 overflow-y-auto"
                style={{ lineHeight: '1.5' }}
                onInput={e => {
                  const el = e.currentTarget
                  el.style.height = 'auto'
                  el.style.height = Math.min(el.scrollHeight, 96) + 'px'
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading || streaming}
                className="p-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              {lang === 'es'
                ? 'Esta conversación puede ser revisada para mejorar nuestro servicio.'
                : 'This conversation may be reviewed to improve our service.'}
            </p>
          </div>
        </div>
      )}

      {/* Speech Bubble — "Hey! I can help you" */}
      {showSpeech && !open && !speechDismissed && (
        <div className="fixed bottom-[84px] right-5 z-50 animate-smarty-speech-in">
          <div
            className="relative bg-gradient-to-r from-brand-600 to-brand-500 rounded-2xl shadow-lg px-4 py-2.5 pr-9 cursor-pointer"
            onClick={handleOpen}
          >
            <p className="text-sm text-white font-semibold whitespace-nowrap">
              {lang === 'es' ? SPEECH_ES : SPEECH_EN} 👋
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); setShowSpeech(false); setSpeechDismissed(true) }}
              className="absolute top-1.5 right-1.5 p-0.5 rounded text-white/60 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            {/* Arrow pointing down toward bubble */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-brand-500 rotate-45" />
          </div>
        </div>
      )}

      {/* Floating Bubble */}
      {bubbleReady && (
        <button
          onClick={open ? handleClose : handleOpen}
          className={`fixed bottom-5 right-5 z-50 w-14 h-14 bg-gradient-to-br from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white rounded-2xl shadow-lg shadow-brand-600/30 hover:shadow-xl hover:shadow-brand-600/40 transition-all duration-200 hover:scale-105 flex items-center justify-center animate-smarty-entrance ${bubbleBouncing ? 'animate-smarty-bounce' : ''}`}
          aria-label="Chat with SMarty"
        >
          {open ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>
      )}
    </>
  )
}
