"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Send, Search, Loader2, MessageSquare, User, CheckCheck } from "lucide-react"
import { Topbar } from "@/components/layout/topbar"

/* ── Types ── */
type Profile  = { id: string; full_name: string; role: string }
type Conv     = { partner: Profile; lastMessage: string; lastAt: string; unread: number }
type Message  = { id: string; sender_id: string; recipient_id: string; content: string; read: boolean; created_at: string }

function formatTime(ts: string) {
  const d    = new Date(ts)
  const now  = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (diff === 0) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  if (diff === 1) return "Yesterday"
  return d.toLocaleDateString([], { month: "short", day: "numeric" })
}

function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
}

const roleColors: Record<string, string> = {
  student:      "bg-indigo-100 text-indigo-700",
  alumni:       "bg-purple-100 text-purple-700",
  faculty:      "bg-green-100 text-green-700",
  investor:     "bg-amber-100 text-amber-700",
  organisation: "bg-teal-100 text-teal-700",
  admin:        "bg-slate-100 text-slate-600",
}

/* ── Supabase browser client (singleton) ── */
let _supabase: ReturnType<typeof createBrowserClient> | null = null
function getSupabase() {
  if (!_supabase) {
    _supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _supabase
}

/* ── Component ── */
export function MessagesUI() {
  const [me, setMe]                     = useState<string | null>(null)
  const [convs, setConvs]               = useState<Conv[]>([])
  const [selected, setSelected]         = useState<Profile | null>(null)
  const [messages, setMessages]         = useState<Message[]>([])
  const [search, setSearch]             = useState("")
  const [input, setInput]               = useState("")
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [loadingThread, setLoadingThread] = useState(false)
  const [sending, setSending]           = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  /* ── Boot: get current user ── */
  useEffect(() => {
    void getSupabase().auth.getUser().then((res: Awaited<ReturnType<ReturnType<typeof getSupabase>["auth"]["getUser"]>>) => {
      if (res.data.user) setMe(res.data.user.id)
    })
  }, [])

  /* ── Fetch conversation list ── */
  const fetchConvs = useCallback(async () => {
    try {
      const res = await fetch("/api/messages")
      if (res.ok) setConvs(await res.json())
    } finally {
      setLoadingConvs(false)
    }
  }, [])

  useEffect(() => { fetchConvs() }, [fetchConvs])

  /* ── Fetch thread ── */
  const fetchThread = useCallback(async (partnerId: string) => {
    setLoadingThread(true)
    try {
      const res = await fetch(`/api/messages?with=${partnerId}`)
      if (res.ok) setMessages(await res.json())
    } finally {
      setLoadingThread(false)
    }
  }, [])

  /* ── Supabase Realtime subscription ── */
  useEffect(() => {
    if (!me) return

    const supabase = getSupabase()

    // Subscribe to all messages where I am recipient OR sender
    const channel = supabase
      .channel(`messages:${me}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${me}`,
        },
        (payload: { new: Message }) => {
          const msg = payload.new

          // If this is in the active thread, append it
          setSelected(sel => {
            if (sel && msg.sender_id === sel.id) {
              setMessages(prev => {
                if (prev.find(m => m.id === msg.id)) return prev
                return [...prev, msg]
              })
              // Mark as read via API
              fetch(`/api/messages?with=${msg.sender_id}`)
            }
            return sel
          })

          // Refresh conversation list
          fetchConvs()
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [me, fetchConvs])

  /* ── Auto-scroll ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  /* ── Select conversation ── */
  function selectConv(conv: Conv) {
    setSelected(conv.partner)
    setConvs(prev => prev.map(c => c.partner.id === conv.partner.id ? { ...c, unread: 0 } : c))
    fetchThread(conv.partner.id)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  /* ── Send message ── */
  async function sendMessage() {
    if (!input.trim() || !selected || sending) return
    const content = input.trim()
    setInput("")
    setSending(true)

    // Optimistic append
    const optimistic: Message = {
      id: `opt-${Date.now()}`,
      sender_id: me!,
      recipient_id: selected.id,
      content,
      read: false,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, optimistic])

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient_id: selected.id, content }),
      })
      if (res.ok) {
        const real = await res.json() as Message
        // Replace optimistic with real
        setMessages(prev => prev.map(m => m.id === optimistic.id ? real : m))
        fetchConvs()
      } else {
        // Roll back
        setMessages(prev => prev.filter(m => m.id !== optimistic.id))
        setInput(content)
      }
    } catch {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id))
      setInput(content)
    } finally {
      setSending(false)
    }
  }

  const filtered = convs.filter(c =>
    c.partner.full_name.toLowerCase().includes(search.toLowerCase())
  )

  /* ── Render ── */
  return (
    <>
      <Topbar title="Messages" subtitle="Real-time conversations across the network" />

      <main className="flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>

        {/* ── Sidebar ── */}
        <div className="w-72 border-r border-slate-200 flex flex-col bg-white flex-shrink-0">
          {/* Search */}
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loadingConvs ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-2 px-4 text-center">
                <MessageSquare className="w-8 h-8" />
                <p className="text-sm font-medium">No conversations yet</p>
                <p className="text-xs text-slate-300">Messages you send or receive will appear here</p>
              </div>
            ) : (
              filtered.map(conv => {
                const active = selected?.id === conv.partner.id
                const color  = roleColors[conv.partner.role] ?? roleColors.admin
                return (
                  <button
                    key={conv.partner.id}
                    onClick={() => selectConv(conv)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 ${
                      active ? "bg-indigo-50 border-l-[3px] border-l-indigo-500" : ""
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${color}`}>
                      {initials(conv.partner.full_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-semibold text-slate-800 truncate">{conv.partner.full_name}</span>
                        <span className="text-xs text-slate-400 flex-shrink-0">{formatTime(conv.lastAt)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-1 mt-0.5">
                        <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                        {conv.unread > 0 && (
                          <span className="flex-shrink-0 bg-indigo-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-semibold">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* ── Thread pane ── */}
        <div className="flex-1 flex flex-col bg-slate-50 min-w-0">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-base font-medium text-slate-500">Select a conversation</p>
              <p className="text-sm text-slate-400">Messages are delivered in real time</p>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${roleColors[selected.role] ?? roleColors.admin}`}>
                  {initials(selected.full_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{selected.full_name}</p>
                  <p className="text-xs text-slate-500 capitalize">{selected.role}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full font-medium">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Live
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
                {loadingThread ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-2">
                    <MessageSquare className="w-7 h-7" />
                    <p className="text-sm">No messages yet — say hello!</p>
                  </div>
                ) : (
                  messages.map(msg => {
                    const sent      = msg.sender_id === me
                    const optimistic = msg.id.startsWith("opt-")
                    return (
                      <div key={msg.id} className={`flex ${sent ? "justify-end" : "justify-start"}`}>
                        {!sent && (
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mr-2 self-end ${roleColors[selected.role] ?? roleColors.admin}`}>
                            {initials(selected.full_name)}
                          </div>
                        )}
                        <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          sent
                            ? "bg-indigo-600 text-white rounded-tr-sm"
                            : "bg-white text-slate-800 rounded-tl-sm shadow-sm border border-slate-100"
                        } ${optimistic ? "opacity-70" : ""}`}>
                          <p>{msg.content}</p>
                          <div className={`flex items-center gap-1 mt-1 text-xs ${sent ? "text-indigo-200 justify-end" : "text-slate-400"}`}>
                            {formatTime(msg.created_at)}
                            {sent && !optimistic && <CheckCheck className="w-3 h-3" />}
                            {sent && optimistic && <Loader2 className="w-3 h-3 animate-spin" />}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input bar */}
              <div className="px-5 py-3.5 bg-white border-t border-slate-200 flex items-center gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={`Message ${selected.full_name}…`}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                  className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  className="w-9 h-9 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full transition flex-shrink-0"
                >
                  {sending
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Send className="w-4 h-4" />
                  }
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}
