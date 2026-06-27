"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Users, Briefcase, Loader2, Sparkles } from "lucide-react"

type Mentor = {
  id: string
  full_name: string
  role: string
  alumni_profiles: {
    company?: string
    job_title?: string
    industry?: string
    expertise_areas?: string[]
    batch_year?: number
    open_to_mentor?: boolean
  } | null
}

type MentorSession = {
  id: string
  mentor_id: string
  mentee_id: string
  topic: string
  status: string
  mentor?: { id: string; full_name: string } | null
}

export default function MentorsPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [tab, setTab] = useState<"discover" | "my">("discover")
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [sessions, setSessions] = useState<MentorSession[]>([])
  const [loading, setLoading] = useState(true)
  const [requesting, setRequesting] = useState<Record<string, boolean>>({})
  const [requested, setRequested] = useState<Record<string, boolean>>({})
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) setCurrentUserId(user.id)

      const [mentorRes, sessionRes] = await Promise.all([
        supabase
          .from("profiles")
          .select(
            "id, full_name, role, alumni_profiles(company, job_title, industry, expertise_areas, batch_year, open_to_mentor)"
          )
          .eq("role", "alumni"),
        user
          ? supabase
              .from("mentor_sessions")
              .select("id, mentor_id, mentee_id, topic, status, mentor:mentor_id(id, full_name)")
              .eq("mentee_id", user.id)
          : Promise.resolve({ data: [] }),
      ])

      const allAlumni = (mentorRes.data || []) as Mentor[]
      const openMentors = allAlumni.filter((a) => a.alumni_profiles?.open_to_mentor === true)
      setMentors(openMentors)

      const sessionData = (sessionRes.data || []) as unknown as MentorSession[]
      setSessions(sessionData)

      // Build requested map from existing sessions
      if (user) {
        const map: Record<string, boolean> = {}
        for (const s of sessionData) {
          map[s.mentor_id] = true
        }
        setRequested(map)
      }

      setLoading(false)
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleRequestMentor(mentorId: string) {
    if (!currentUserId || requested[mentorId]) return
    setRequesting((prev) => ({ ...prev, [mentorId]: true }))
    try {
      const res = await fetch("/api/mentor-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mentor_id: mentorId, topic: "General mentoring" }),
      })
      if (res.ok) {
        setRequested((prev) => ({ ...prev, [mentorId]: true }))
      }
    } finally {
      setRequesting((prev) => ({ ...prev, [mentorId]: false }))
    }
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  const activeMentorIds = new Set(sessions.filter((s) => s.status === "accepted").map((s) => s.mentor_id))

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar title="Mentors" subtitle="Connect with experienced alumni mentors" />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Metric cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            {
              label: "Available Mentors",
              value: mentors.length,
              icon: GraduationCap,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
            },
            {
              label: "Sessions Requested",
              value: sessions.length,
              icon: Briefcase,
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
            {
              label: "Active Mentors",
              value: activeMentorIds.size,
              icon: Users,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
          ].map((m) => (
            <Card key={m.label}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-10 h-10 ${m.bg} rounded-lg flex items-center justify-center`}>
                  <m.icon className={`w-5 h-5 ${m.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{m.value}</p>
                  <p className="text-xs text-slate-500">{m.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit mb-6">
          {(["discover", "my"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t === "discover" ? "Discover Mentors" : "My Mentors"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : tab === "discover" ? (
          mentors.length === 0 ? (
            <Card>
              <CardContent className="p-16 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-indigo-400" />
                </div>
                <p className="font-semibold text-slate-800 text-lg">No mentors available yet</p>
                <p className="text-sm text-slate-500 mt-2 max-w-sm">
                  Once alumni mark themselves as open to mentoring, they&apos;ll appear here. Check back soon!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {mentors.map((mentor) => {
                const a = mentor.alumni_profiles
                const subtitle = [a?.job_title, a?.company].filter(Boolean).join(" @ ") || "Alumni"
                const tags = a?.expertise_areas || []
                const isRequested = requested[mentor.id]
                const isRequesting = requesting[mentor.id]

                return (
                  <Card key={mentor.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm flex-shrink-0">
                          {getInitials(mentor.full_name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-sm text-slate-900">{mentor.full_name}</p>
                            {a?.batch_year && (
                              <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                                Batch {a.batch_year}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={isRequested ? "outline" : "default"}
                          onClick={() => handleRequestMentor(mentor.id)}
                          disabled={isRequested || isRequesting}
                          className="text-xs flex-shrink-0"
                        >
                          {isRequesting ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : isRequested ? (
                            "Requested"
                          ) : (
                            "Request Mentor"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )
        ) : sessions.length === 0 ? (
          <Card>
            <CardContent className="p-16 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-indigo-400" />
              </div>
              <p className="font-semibold text-slate-800 text-lg">No mentor sessions yet</p>
              <p className="text-sm text-slate-500 mt-2 max-w-sm">
                Browse the Discover tab to find and request your first mentor session.
              </p>
              <Button className="mt-6" onClick={() => setTab("discover")}>
                Discover Mentors
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {sessions.map((session) => {
              const mentorName =
                session.mentor && "full_name" in session.mentor
                  ? (session.mentor as { id: string; full_name: string }).full_name
                  : "Unknown"

              return (
                <Card key={session.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm flex-shrink-0">
                        {getInitials(mentorName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-slate-900">{mentorName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{session.topic}</p>
                        <span
                          className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${
                            session.status === "accepted"
                              ? "bg-emerald-50 text-emerald-700"
                              : session.status === "declined"
                              ? "bg-red-50 text-red-600"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {session.status === "accepted"
                            ? "Active"
                            : session.status === "declined"
                            ? "Declined"
                            : "Pending"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
