"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Loader2, Users } from "lucide-react"

type Profile = {
  id: string
  full_name: string | null
  role: string
  created_at: string
}

const roleBadgeColor: Record<string, string> = {
  student: "bg-blue-50 text-blue-700",
  alumni: "bg-green-50 text-green-700",
  faculty: "bg-purple-50 text-purple-700",
  investor: "bg-amber-50 text-amber-700",
  admin: "bg-slate-100 text-slate-700",
}

export default function AdminUsersPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, role, created_at")
        .order("created_at", { ascending: false })
      setProfiles(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = profiles.filter((p) => {
    const matchRole = roleFilter === "all" || p.role === roleFilter
    const matchSearch = !search || (p.full_name ?? "").toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  const tabs = [
    { key: "all", label: "All" },
    { key: "student", label: "Students" },
    { key: "alumni", label: "Alumni" },
    { key: "faculty", label: "Faculty" },
    { key: "investor", label: "Investors" },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar title="User Management" />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage all platform users</p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        {/* Role tabs */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-5 w-fit overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setRoleFilter(t.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                roleFilter === t.key ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
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
            <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No users found</p>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs text-slate-500">
                      <th className="text-left px-4 py-3 font-medium">Name</th>
                      <th className="text-left px-4 py-3 font-medium">Role</th>
                      <th className="text-left px-4 py-3 font-medium">Joined</th>
                      <th className="text-left px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600 flex-shrink-0">
                              {p.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                            </div>
                            <span className="font-medium text-slate-900">{p.full_name ?? "â€”"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadgeColor[p.role] ?? "bg-slate-100 text-slate-600"}`}>
                            {p.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs">
                          {p.created_at ? new Date(p.created_at).toLocaleDateString() : "â€”"}
                        </td>
                        <td className="px-4 py-3">
                          <a
                            href={`/${p.role}/profile`}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            View Profile
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

