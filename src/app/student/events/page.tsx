"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Trophy, GraduationCap, Users, Loader2, Plus, X } from "lucide-react"

type Event = {
  id: string
  title: string
  description: string | null
  event_date: string | null
  location: string | null
  type: "event" | "club" | "competition" | "conference" | "scholarship" | "workshop"
  organizer_id: string
  link: string | null
  active: boolean
  created_at: string
  organizer?: { full_name: string; role: string } | null
}

const typeEmoji: Record<string, string> = {
  event: "📅",
  club: "🏛",
  competition: "🏆",
  conference: "🎤",
  scholarship: "🎓",
  workshop: "🔧",
}

const typeColor: Record<string, string> = {
  event: "bg-blue-100",
  club: "bg-green-100",
  competition: "bg-amber-100",
  conference: "bg-purple-100",
  scholarship: "bg-rose-100",
  workshop: "bg-slate-100",
}

const typeBadge: Record<string, string> = {
  event: "bg-blue-50 text-blue-700",
  club: "bg-green-50 text-green-700",
  competition: "bg-amber-50 text-amber-700",
  conference: "bg-purple-50 text-purple-700",
  scholarship: "bg-rose-50 text-rose-700",
  workshop: "bg-slate-100 text-slate-600",
}

function formatDate(ts: string | null) {
  if (!ts) return "TBD"
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function EventsPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [userRole, setUserRole] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: "",
    type: "event",
    description: "",
    event_date: "",
    location: "",
    link: "",
  })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()
        setUserRole(profile?.role ?? null)
      }
      const res = await fetch("/api/events")
      const data = await res.json()
      setEvents(Array.isArray(data) ? data : [])
      setLoading(false)
    }
    load()
  }, [])

  const canPost = ["faculty", "alumni", "admin"].includes(userRole ?? "")

  const tabs = [
    { key: "all", label: "All" },
    { key: "event", label: "Events" },
    { key: "club", label: "Clubs" },
    { key: "competition", label: "Competitions" },
    { key: "scholarship", label: "Scholarships" },
    { key: "workshop", label: "Workshops" },
  ]

  const filtered = activeTab === "all" ? events : events.filter((e) => e.type === activeTab)

  const counts = {
    event: events.filter((e) => e.type === "event").length,
    club: events.filter((e) => e.type === "club").length,
    competition: events.filter((e) => e.type === "competition").length,
    scholarship: events.filter((e) => e.type === "scholarship").length,
  }

  async function handleSubmit() {
    setSubmitting(true)
    const payload = {
      ...form,
      active: true,
      event_date: form.event_date ? new Date(form.event_date).toISOString() : null,
    }
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!data.error) {
      setEvents((prev) => [data, ...prev])
      setShowModal(false)
      setForm({ title: "", type: "event", description: "", event_date: "", location: "", link: "" })
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar title="Events & Clubs" subtitle="Discover events, clubs, competitions and scholarships" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Events & Clubs</h1>
            <p className="text-sm text-slate-500 mt-0.5">Discover opportunities beyond the classroom</p>
          </div>
          {canPost && (
            <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Event
            </Button>
          )}
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Upcoming Events", count: counts.event, icon: Calendar, color: "text-blue-700" },
            { label: "Clubs", count: counts.club, icon: Users, color: "text-green-700" },
            { label: "Competitions", count: counts.competition, icon: Trophy, color: "text-amber-700" },
            { label: "Scholarships", count: counts.scholarship, icon: GraduationCap, color: "text-rose-700" },
          ].map((m) => {
            const Icon = m.icon
            return (
              <Card key={m.label}>
                <CardContent className="p-4 text-center">
                  <Icon className={`w-5 h-5 mx-auto mb-1 ${m.color}`} />
                  <p className={`text-2xl font-bold ${m.color}`}>{m.count}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{m.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-5 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === t.key
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No events yet — check back soon or post one to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${typeColor[event.type]}`}>
                      {typeEmoji[event.type]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-slate-900">{event.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${typeBadge[event.type]}`}>{event.type}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {event.location || "Online"} • {formatDate(event.event_date)}
                      </p>
                      {event.description && (
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{event.description}</p>
                      )}
                    </div>
                    {event.link && (
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:underline flex-shrink-0"
                      >
                        Details →
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Add Event</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">
                ×
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  <option value="event">Event</option>
                  <option value="club">Club</option>
                  <option value="competition">Competition</option>
                  <option value="conference">Conference</option>
                  <option value="scholarship">Scholarship</option>
                  <option value="workshop">Workshop</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={form.event_date}
                  onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Link (optional)</label>
                <input
                  type="text"
                  value={form.link}
                  onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleSubmit} disabled={submitting} className="flex-1">
                {submitting ? "Posting..." : "Add Event"}
              </Button>
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
