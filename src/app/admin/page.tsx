import { createClient } from "@/lib/supabase/server"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Users, TrendingUp, Link2, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: connections },
    { count: mentorSessions },
    { count: applications },
    { data: recentUsers },
    { data: recentConnections },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("connections").select("*", { count: "exact", head: true }).eq("status", "accepted"),
    supabase.from("mentor_sessions").select("*", { count: "exact", head: true }),
    supabase.from("applications").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("id, full_name, role, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("connections")
      .select("id, status, created_at, requester:requester_id(full_name), recipient:recipient_id(full_name)")
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  const roleBadge: Record<string, string> = {
    student: "bg-blue-50 text-blue-700",
    alumni: "bg-green-50 text-green-700",
    faculty: "bg-purple-50 text-purple-700",
    investor: "bg-amber-50 text-amber-700",
    admin: "bg-slate-100 text-slate-600",
  }

  type RecentUser = { id: string; full_name: string; role: string; created_at: string }
  type RecentConn = { id: string; status: string; created_at: string; requester: { full_name: string } | { full_name: string }[] | null; recipient: { full_name: string } | { full_name: string }[] | null }

  return (
    <>
      <Topbar title="Admin Dashboard" subtitle="Platform overview and management" />
      <main className="flex-1 p-6 space-y-6">
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-lg">Platform is live and growing</p>
              <p className="text-white/70 text-sm mt-1">
                {totalUsers ?? 0} members on UniConnect AI. Keep inviting students, alumni, faculty, and investors to grow the network.
              </p>
              <div className="mt-4 flex gap-3">
                <Link href="/admin/users" className="text-sm bg-white/20 hover:bg-white/30 transition px-4 py-2 rounded-lg font-medium">Manage Users</Link>
                <Link href="/admin/settings" className="text-sm bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-lg">Settings</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: totalUsers ?? 0, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Connections Made", value: connections ?? 0, icon: Link2, color: "text-green-600", bg: "bg-green-50" },
            { label: "Mentor Sessions", value: mentorSessions ?? 0, icon: Sparkles, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Job Applications", value: applications ?? 0, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Recent Users</h3>
                <Link href="/admin/users" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
              </div>
              {(recentUsers ?? []).length === 0 ? (
                <p className="text-sm text-slate-500">No users yet.</p>
              ) : (
                <div className="space-y-2">
                  {((recentUsers ?? []) as RecentUser[]).map(u => (
                    <div key={u.id} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                        {u.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{u.full_name}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${roleBadge[u.role] ?? "bg-slate-100 text-slate-600"}`}>{u.role}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Recent Connections</h3>
                <Link href="/admin/connections" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
              </div>
              {(recentConnections ?? []).length === 0 ? (
                <p className="text-sm text-slate-500">No connections yet. As users join and connect, activity will appear here.</p>
              ) : (
                <div className="space-y-2">
                  {((recentConnections ?? []) as RecentConn[]).map(c => (
                    <div key={c.id} className="flex items-center gap-2 text-xs">
                      <span className="font-medium text-slate-900 truncate max-w-[100px]">{Array.isArray(c.requester) ? c.requester[0]?.full_name : (c.requester as { full_name: string } | null)?.full_name ?? "?"}</span>
                      <span className="text-slate-400">→</span>
                      <span className="font-medium text-slate-900 truncate max-w-[100px]">{Array.isArray(c.recipient) ? c.recipient[0]?.full_name : (c.recipient as { full_name: string } | null)?.full_name ?? "?"}</span>
                      <span className={`ml-auto px-1.5 py-0.5 rounded-full capitalize flex-shrink-0 ${
                        c.status === "accepted" ? "bg-green-50 text-green-700" :
                        c.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600"
                      }`}>{c.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
