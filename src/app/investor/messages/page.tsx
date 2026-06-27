"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Topbar } from "@/components/layout/topbar"
import { Button } from "@/components/ui/button"
import { MessageSquare, Send, Search, Loader2, User } from "lucide-react"

type Partner = { id: string; full_name: string; role: string }
type Conversation = { partner: Partner; lastMessage: string; lastAt: string; unread: number }
type Message = { id: string; sender_id: string; recipient_id: string; content: string; read: boolean; created_at: string }

function formatTime(ts: string) {
  const d = new Date(ts)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (diffDays === 0) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  if (diffDays === 1) return "Yesterday"
  return d.toLocaleDateString([], { month: "short", day: "numeric" })
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedUser, setSelectedUser] = useState<Partner | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [search, setSearch] = useState("")
  const [input, setInput] = useState("")
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [loadingThread, setLoadingThread] = useState(false)
  const [sending, setSending] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    import("@supabase/ssr").then(({ createBrowserClient }) => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) setCurrentUserId(data.user.id)
      })
    })
  }, [])

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/messages")
      if (res.ok) {
        const data = await res.json()
        setConversations(data)
      }
    } catch {
      // silently fail
    } finally {
      setLoadingConvs(false)
    }
  }, [])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  const fetchThread = useCallback(async (userId: string) => {
    setLoadingThread(true)
    try {
      const res = await fetch(`/api/messages?with=${userId}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } catch {
      // silently fail
    } finally {
      setLoadingThread(false)
    }
  }, [])

  useEffect(() => {
    if (!selectedUser) return
    fetchThread(selectedUser.id)
    const id = setInterval(() => fetchThread(selectedUser.id), 5000)
    return () => clearInterval(id)
  }, [selectedUser, fetchThread])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedUser(conv.partner)
    setConversations(prev =>
      prev.map(c => c.partner.id === conv.partner.id ? { ...c, unread: 0 } : c)
    )
  }

  const sendMessage = async () => {
    if (!input.trim() || !selectedUser || sending) return
    setSending(true)
    const content = input.trim()
    setInput("")
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient_id: selectedUser.id, content }),
      })
      if (res.ok) {
        const msg = await res.json()
        setMessages(prev => [...prev, msg])
        fetchConversations()
      }
    } catch {
      setInput(content)
    } finally {
      setSending(false)
    }
  }

  const filtered = conversations.filter(c =>
    c.partner.full_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Topbar title="Messages" subtitle="Your conversations across the network" />
      <main className="flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
        <div className="w-72 border-r border-slate-200 flex flex-col bg-white">
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingConvs ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-2">
                <MessageSquare className="w-8 h-8" />
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              filtered.map(conv => (
                <button
                  key={conv.partner.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 ${
                    selectedUser?.id === conv.partner.id ? "bg-amber-50 border-l-2 border-l-amber-500" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-800 truncate">{conv.partner.full_name}</span>
                      <span className="text-xs text-slate-400 ml-1 flex-shrink-0">{formatTime(conv.lastAt)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                      {conv.unread > 0 && (
                        <span className="ml-1 flex-shrink-0 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-slate-50">
          {!selectedUser ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
              <MessageSquare className="w-12 h-12" />
              <p className="text-base">Select a conversation to start messaging</p>
            </div>
          ) : (
            <>
              <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{selectedUser.full_name}</p>
                  <p className="text-xs text-slate-500 capitalize">{selectedUser.role}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                {loadingThread ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-2">
                    <MessageSquare className="w-8 h-8" />
                    <p className="text-sm">No messages yet. Say hello!</p>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isSent = msg.sender_id === currentUserId
                    return isSent ? (
                      <div key={msg.id} className="flex justify-end mb-2">
                        <div className="max-w-xs bg-amber-600 text-white text-sm px-4 py-2 rounded-2xl rounded-tr-sm">
                          {msg.content}
                          <div className="text-xs text-amber-200 mt-1 text-right">{formatTime(msg.created_at)}</div>
                        </div>
                      </div>
                    ) : (
                      <div key={msg.id} className="flex justify-start mb-2">
                        <div className="max-w-xs bg-white text-slate-800 text-sm px-4 py-2 rounded-2xl rounded-tl-sm shadow-sm">
                          {msg.content}
                          <div className="text-xs text-slate-400 mt-1">{formatTime(msg.created_at)}</div>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={bottomRef} />
              </div>

              <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                  className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-4"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}
