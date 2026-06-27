import { createClient } from "@/lib/supabase/server"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BarChart3, Briefcase, Rocket, TrendingUp } from "lucide-react"

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: students },
    { count: alumni },
    { count: faculty },
    { count: investors },
    { count: connections },
    { count: pending },
    { count: opportunities },
    { count: startups },
    { count: mentorSessions },
    { data: recent },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "alumni"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "faculty"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "investor"),
    supabase.from("connections").select("*", { count: "exact", head: true }).eq("status", "accepted"),
    supabase.from("connections").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("opportunities").select("*", { count: "exact", head: true }).eq("active", true),
    supabase.from("startups").select("*", { count: "exact", head: true }),
    supabase.from("mentor_sessions").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("full_name, role, created_at").order("created_at", { ascending: false }).limit(8),
  ])

  const total = totalUsers ?? 0

  const roleBadgeColor: Record<string, string> = {
    student: "bg-blue-50 text-blue-700",
    alumni: "bg-green-50 text-green-700",
    faculty: "bg-purple-50 text-purple-700",
    investor: "bg-amber-50 text-amber-700",
    admin: "bg-slate-100 text-slate-700",
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar title="Analytics" />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-500 mt-0.5">Platform-wide metrics and activity</p>
        </div>

        {/* Top metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Users", value: totalUsers ?? 0, icon: Users, color: "text-slate-700" },
            { label: "Active Connections", value: connections ?? 0, icon: TrendingUp, color: "text-green-700" },
            { label: "Opportunities Posted", value: opportunities ?? 0, icon: Briefcase, color: "text-blue-700" },
            { label: "Startups in Network", value: startups ?? 0, icon: Rocket, color: "text-purple-700" },
          ].map((m) => (
            <Card key={m.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-slate-500">{m.label}</p>
                  <m.icon className={`w-4 h-4 ${m.color}`} />
                </div>
                <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {/* Role breakdown */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-slate-500" />
                  Role Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Students", count: students ?? 0, color: "bg-blue-500" },
                    { label: "Alumni", count: alumni ?? 0, color: "bg-green-500" },
                    { label: "Faculty", count: faculty ?? 0, color: "bg-purple-500" },
                    { label: "Investors", count: investors ?? 0, color: "bg-amber-500" },
                  ].map((r) => {
                    const pct = total > 0 ? Math.round((r.count / total) * 100) : 0
                    return (
                      <div key={r.label} className="bg-slate-50 rounded-xl p-4">
                        <p className="text-xs text-slate-500 mb-1">{r.label}</p>
                        <p className="text-xl font-bold text-slate-900">{r.count}</p>
                        <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full ${r.color} rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{pct}% of users</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Network activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Network Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Accepted Connections", value: connections ?? 0, color: "text-green-700" },
                { label: "Pending Connections", value: pending ?? 0, color: "text-amber-600" },
                { label: "Mentor Sessions", value: mentorSessions ?? 0, color: "text-blue-700" },
              ].map((a) => (
                <div key={a.label} className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">{a.label}</p>
                  <p className={`text-lg font-bold ${a.color}`}>{a.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent signups */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Signups</CardTitle>
          </CardHeader>
          <CardContent>
            {!recent || recent.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No recent signups</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {recent.map((u, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                        {u.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                      </div>
                      <p className="text-sm font-medium text-slate-900">{u.full_name ?? "â€”"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadgeColor[u.role] ?? "bg-slate-100 text-slate-600"}`}>
                        {u.role}
                      </span>
                      <p className="text-xs text-slate-400">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : "â€”"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

