"use client"

import { useState, useEffect } from "react"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, Loader2, CheckCheck, Users, MessageSquare, BookOpen, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"

type Notification = {
  id: string
  type: string
  title: string
  body: string | null
  link: string | null
  read: boolean
  created_at: string
}

const typeIcon: Record<string, React.ReactNode> = {
  connection_request: <Users className="w-4 h-4 text-indigo-500" />,
  connection_accepted: <Users className="w-4 h-4 text-green-500" />,
  new_message: <MessageSquare className="w-4 h-4 text-blue-500" />,
  mentor_request: <BookOpen className="w-4 h-4 text-amber-500" />,
  application: <Briefcase className="w-4 h-4 text-purple-500" />,
}

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [markingAll, setMarkingAll] = useState(false)

  useEffect(() => {
    fetch("/api/notifications")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setNotifications(data) })
      .finally(() => setLoading(false))
  }, [])

  async function markAllRead() {
    setMarkingAll(true)
    await fetch("/api/notifications", { method: "PATCH" })
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setMarkingAll(false)
  }

  const unread = notifications.filter(n => !n.read).length

  return (
    <>
      <Topbar title="Notifications" subtitle="Stay up to date with your network activity" />
      <main className="flex-1 p-6 max-w-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">
              {unread > 0 ? `${unread} unread` : "All caught up"}
            </p>
          </div>
          {unread > 0 && (
            <Button size="sm" variant="outline" onClick={markAllRead} disabled={markingAll} className="gap-2 text-xs">
              <CheckCheck className="w-3 h-3" />
              {markingAll ? "Marking..." : "Mark all read"}
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="p-16 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-slate-300" />
              </div>
              <p className="font-semibold text-slate-700">No notifications yet</p>
              <p className="text-sm text-slate-500 mt-1">
                You&apos;ll be notified when someone connects with you, sends a message, or requests mentoring.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {notifications.map(n => (
              <div
                key={n.id}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
                  n.read ? "bg-white border-slate-100" : "bg-indigo-50 border-indigo-100"
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  n.read ? "bg-slate-100" : "bg-white shadow-sm"
                }`}>
                  {typeIcon[n.type] ?? <Bell className="w-4 h-4 text-slate-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${n.read ? "text-slate-700" : "text-slate-900"}`}>
                    {n.title}
                  </p>
                  {n.body && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.body}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">{timeAgo(n.created_at)}</p>
                </div>
                {!n.read && (
                  <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5" />
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
