"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Users, Network, Briefcase, BookOpen, Loader2, CheckCircle } from "lucide-react"

function downloadCSV(filename: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return
  const headers = Object.keys(rows[0])
  const csv = [
    headers.join(","),
    ...rows.map(row =>
      headers.map(h => {
        const val = row[h]
        const str = val == null ? "" : String(val)
        return str.includes(",") || str.includes('"') || str.includes("\n")
          ? `"${str.replace(/"/g, '""')}"` : str
      }).join(",")
    ),
  ].join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

type ProfileRow = { id: string; full_name: string; role: string; created_at: string }
type ConnRow = { id: string; status: string; created_at: string; requester: { full_name: string; role: string } | null; recipient: { full_name: string; role: string } | null }
type AppRow = { id: string; status: string; created_at: string; applicant: { full_name: string; student_profiles: { program?: string } | null } | null; opportunity: { title: string; company: string; type: string } | null }
type SessionRow = { id: string; status: string; topic: string | null; created_at: string; mentor: { full_name: string; alumni_profiles: { company?: string } | null } | null; mentee: { full_name: string; student_profiles: { program?: string } | null } | null }

export default function AdminReportsPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [profiles, setProfiles] = useState<ProfileRow[]>([])
  const [connections, setConnections] = useState<ConnRow[]>([])
  const [applications, setApplications] = useState<AppRow[]>([])
  const [sessions, setSessions] = useState<SessionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [exported, setExported] = useState<Record<string, string>>({})

  useEffect(() => {
    async function load() {
      const [pRes, cRes, aRes, sRes] = await Promise.all([
        supabase.from("profiles").select("id, full_name, role, created_at").order("created_at", { ascending: false }),
        supabase.from("connections").select("id, status, created_at, requester:requester_id(full_name, role), recipient:recipient_id(full_name, role)").order("created_at", { ascending: false }),
        supabase.from("applications").select("id, status, created_at, applicant:applicant_id(full_name, student_profiles(program)), opportunity:opportunity_id(title, company, type)").order("created_at", { ascending: false }),
        supabase.from("mentor_sessions").select("id, status, topic, created_at, mentor:mentor_id(full_name, alumni_profiles(company)), mentee:mentee_id(full_name, student_profiles(program))").order("created_at", { ascending: false }),
      ])
      setProfiles((pRes.data ?? []) as unknown as ProfileRow[])
      setConnections((cRes.data ?? []) as unknown as ConnRow[])
      setApplications((aRes.data ?? []) as unknown as AppRow[])
      setSessions((sRes.data ?? []) as unknown as SessionRow[])
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function markExported(key: string) {
    setExported(prev => ({ ...prev, [key]: new Date().toLocaleTimeString() }))
  }

  function exportMembers() {
    downloadCSV("members.csv", profiles.map(p => ({ id: p.id, full_name: p.full_name, role: p.role, joined: p.created_at })))
    markExported("members")
  }

  function exportConnections() {
    downloadCSV("connections.csv", connections.map(c => ({
      requester: c.requester?.full_name ?? "", requester_role: c.requester?.role ?? "",
      recipient: c.recipient?.full_name ?? "", recipient_role: c.recipient?.role ?? "",
      status: c.status, date: c.created_at,
    })))
    markExported("connections")
  }

  function exportApplications() {
    downloadCSV("applications.csv", applications.map(a => ({
      applicant: a.applicant?.full_name ?? "", program: a.applicant?.student_profiles?.program ?? "",
      opportunity: a.opportunity?.title ?? "", company: a.opportunity?.company ?? "",
      type: a.opportunity?.type ?? "", status: a.status, applied_at: a.created_at,
    })))
    markExported("applications")
  }

  function exportSessions() {
    downloadCSV("mentor-sessions.csv", sessions.map(s => ({
      mentor: s.mentor?.full_name ?? "", company: s.mentor?.alumni_profiles?.company ?? "",
      mentee: s.mentee?.full_name ?? "", program: s.mentee?.student_profiles?.program ?? "",
      topic: s.topic ?? "", status: s.status, date: s.created_at,
    })))
    markExported("sessions")
  }

  const roleCounts = profiles.reduce<Record<string, number>>((acc, p) => {
    acc[p.role] = (acc[p.role] ?? 0) + 1
    return acc
  }, {})

  const connAccepted = connections.filter(c => c.status === "accepted").length
  const connPending = connections.filter(c => c.status === "pending").length
  const appShortlisted = applications.filter(a => a.status === "shortlisted").length
  const appOffered = applications.filter(a => a.status === "offered").length
  const sessCompleted = sessions.filter(s => s.status === "completed").length
  const sessAccepted = sessions.filter(s => s.status === "accepted").length

  if (loading) return (
    <>
      <Topbar title="Reports" subtitle="Export platform data and insights" />
      <main className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </main>
    </>
  )

  return (
    <>
      <Topbar title="Reports" subtitle="Export platform data and insights" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">

          {/* Members */}
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="w-4 h-4 text-indigo-500" /> Member Growth Report</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-slate-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-slate-900">{profiles.length}</p><p className="text-xs text-slate-500">Total</p></div>
                <div className="bg-blue-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-blue-700">{roleCounts.student ?? 0}</p><p className="text-xs text-slate-500">Students</p></div>
                <div className="bg-green-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-green-700">{roleCounts.alumni ?? 0}</p><p className="text-xs text-slate-500">Alumni</p></div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-purple-50 rounded-lg p-2 text-center"><p className="text-lg font-bold text-purple-700">{roleCounts.faculty ?? 0}</p><p className="text-xs text-slate-500">Faculty</p></div>
                <div className="bg-amber-50 rounded-lg p-2 text-center"><p className="text-lg font-bold text-amber-700">{roleCounts.investor ?? 0}</p><p className="text-xs text-slate-500">Investors</p></div>
              </div>
              {exported.members && <p className="text-xs text-green-600 flex items-center gap-1 mb-2"><CheckCircle className="w-3 h-3" /> Exported at {exported.members}</p>}
              <Button onClick={exportMembers} variant="outline" className="w-full gap-2 text-xs" disabled={profiles.length === 0}>
                <Download className="w-4 h-4" /> Export Members CSV
              </Button>
            </CardContent>
          </Card>

          {/* Connections */}
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Network className="w-4 h-4 text-green-500" /> Network Connections Report</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-slate-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-slate-900">{connections.length}</p><p className="text-xs text-slate-500">Total</p></div>
                <div className="bg-green-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-green-700">{connAccepted}</p><p className="text-xs text-slate-500">Accepted</p></div>
                <div className="bg-amber-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-amber-700">{connPending}</p><p className="text-xs text-slate-500">Pending</p></div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-2 text-center mb-4">
                <p className="text-lg font-bold text-indigo-700">{connections.length > 0 ? Math.round((connAccepted / connections.length) * 100) : 0}%</p>
                <p className="text-xs text-slate-500">Acceptance Rate</p>
              </div>
              {exported.connections && <p className="text-xs text-green-600 flex items-center gap-1 mb-2"><CheckCircle className="w-3 h-3" /> Exported at {exported.connections}</p>}
              <Button onClick={exportConnections} variant="outline" className="w-full gap-2 text-xs" disabled={connections.length === 0}>
                <Download className="w-4 h-4" /> Export Connections CSV
              </Button>
            </CardContent>
          </Card>

          {/* Applications */}
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Briefcase className="w-4 h-4 text-purple-500" /> Outcomes Report</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-slate-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-slate-900">{applications.length}</p><p className="text-xs text-slate-500">Applied</p></div>
                <div className="bg-green-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-green-700">{appShortlisted}</p><p className="text-xs text-slate-500">Shortlisted</p></div>
                <div className="bg-emerald-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-emerald-700">{appOffered}</p><p className="text-xs text-slate-500">Offered</p></div>
              </div>
              {exported.applications && <p className="text-xs text-green-600 flex items-center gap-1 mb-2"><CheckCircle className="w-3 h-3" /> Exported at {exported.applications}</p>}
              <Button onClick={exportApplications} variant="outline" className="w-full gap-2 text-xs" disabled={applications.length === 0}>
                <Download className="w-4 h-4" /> Export Applications CSV
              </Button>
            </CardContent>
          </Card>

          {/* Mentor sessions */}
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><BookOpen className="w-4 h-4 text-amber-500" /> Mentoring Report</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-slate-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-slate-900">{sessions.length}</p><p className="text-xs text-slate-500">Requested</p></div>
                <div className="bg-blue-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-blue-700">{sessAccepted}</p><p className="text-xs text-slate-500">Active</p></div>
                <div className="bg-green-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-green-700">{sessCompleted}</p><p className="text-xs text-slate-500">Completed</p></div>
              </div>
              {exported.sessions && <p className="text-xs text-green-600 flex items-center gap-1 mb-2"><CheckCircle className="w-3 h-3" /> Exported at {exported.sessions}</p>}
              <Button onClick={exportSessions} variant="outline" className="w-full gap-2 text-xs" disabled={sessions.length === 0}>
                <Download className="w-4 h-4" /> Export Sessions CSV
              </Button>
            </CardContent>
          </Card>

        </div>
      </main>
    </>
  )
}
