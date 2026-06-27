import { createClient } from "@/lib/supabase/server"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link2, TrendingUp, Clock, CheckCircle } from "lucide-react"

type ConnectionRow = {
  id: string
  status: string
  created_at: string
  requester: { full_name: string; role: string } | null
  recipient: { full_name: string; role: string } | null
}

const roleBadge: Record<string, string> = {
  student: "bg-blue-50 text-blue-700",
  alumni: "bg-green-50 text-green-700",
  faculty: "bg-purple-50 text-purple-700",
  investor: "bg-amber-50 text-amber-700",
  admin: "bg-slate-100 text-slate-600",
}

const statusBadge: Record<string, string> = {
  accepted: "bg-green-50 text-green-700",
  pending: "bg-amber-50 text-amber-700",
  declined: "bg-red-50 text-red-700",
}

export default async function AdminConnectionsPage() {
  const supabase = await createClient()

  const [
    { count: total },
    { count: accepted },
    { count: pending },
    { count: declined },
    { data: recent },
  ] = await Promise.all([
    supabase.from("connections").select("*", { count: "exact", head: true }),
    supabase.from("connections").select("*", { count: "exact", head: true }).eq("status", "accepted"),
    supabase.from("connections").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("connections").select("*", { count: "exact", head: true }).eq("status", "declined"),
    supabase
      .from("connections")
      .select("id, status, created_at, requester:requester_id(full_name, role), recipient:recipient_id(full_name, role)")
      .order("created_at", { ascending: false })
      .limit(25),
  ])

  const acceptanceRate = total && total > 0 ? Math.round(((accepted ?? 0) / total) * 100) : 0

  const rows = (recent ?? []) as unknown as ConnectionRow[]

  return (
    <>
      <Topbar title="Connections" subtitle="Network activity across the platform" />
      <main className="flex-1 p-6 space-y-6">
        {/* Metric cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Requests", value: total ?? 0, icon: Link2, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Accepted", value: accepted ?? 0, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
            { label: "Pending", value: pending ?? 0, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Acceptance Rate", value: `${acceptanceRate}%`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
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

        {/* Activity table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Connection Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {rows.length === 0 ? (
              <div className="p-12 flex flex-col items-center text-center">
                <Link2 className="w-8 h-8 text-slate-300 mb-3" />
                <p className="font-medium text-slate-700">No connections yet</p>
                <p className="text-sm text-slate-500 mt-1">Activity will appear here as users start connecting.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">From</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">To</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {rows.map(row => (
                      <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                              {(row.requester?.full_name ?? "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 text-xs">{row.requester?.full_name ?? "Unknown"}</p>
                              <span className={`text-xs px-1.5 py-0.5 rounded-full capitalize ${roleBadge[row.requester?.role ?? ""] ?? "bg-slate-100 text-slate-600"}`}>
                                {row.requester?.role}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                              {(row.recipient?.full_name ?? "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 text-xs">{row.recipient?.full_name ?? "Unknown"}</p>
                              <span className={`text-xs px-1.5 py-0.5 rounded-full capitalize ${roleBadge[row.recipient?.role ?? ""] ?? "bg-slate-100 text-slate-600"}`}>
                                {row.recipient?.role}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusBadge[row.status] ?? "bg-slate-100 text-slate-600"}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-xs text-slate-500">
                          {new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}
