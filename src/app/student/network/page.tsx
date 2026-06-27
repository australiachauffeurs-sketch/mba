"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  GraduationCap,
  Briefcase,
  Building2,
  Search,
  UserPlus,
  Loader2,
} from "lucide-react"

type AlumniProfile = {
  company?: string
  job_title?: string
  industry?: string
  expertise_areas?: string[]
  open_to_mentor?: boolean
}

type FacultyProfile = {
  department?: string
  designation?: string
  research_areas?: string[]
  collaboration?: boolean
}

type InvestorProfile = {
  firm_name?: string
  investor_type?: string
  sectors?: string[]
  stage_focus?: string[]
}

type Profile = {
  id: string
  full_name: string
  role: string
  alumni_profiles?: AlumniProfile | null
  faculty_profiles?: FacultyProfile | null
  investor_profiles?: InvestorProfile | null
}

type ConnectionStatus = "none" | "pending" | "accepted" | "declined"

type ConnectionRow = {
  id: string
  requester_id: string
  recipient_id: string
  status: string
}

export default function NetworkPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [activeTab, setActiveTab] = useState<"all" | "alumni" | "faculty" | "investors">("all")
  const [search, setSearch] = useState("")
  const [alumni, setAlumni] = useState<Profile[]>([])
  const [faculty, setFaculty] = useState<Profile[]>([])
  const [investors, setInvestors] = useState<Profile[]>([])
  const [connectionMap, setConnectionMap] = useState<Record<string, ConnectionStatus>>({})
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<Record<string, boolean>>({})
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) setCurrentUserId(user.id)

      const [alumniRes, facultyRes, investorRes, connRes] = await Promise.all([
        supabase
          .from("profiles")
          .select(
            "id, full_name, role, alumni_profiles(company, job_title, industry, expertise_areas, open_to_mentor)"
          )
          .eq("role", "alumni"),
        supabase
          .from("profiles")
          .select(
            "id, full_name, role, faculty_profiles(department, designation, research_areas, collaboration)"
          )
          .eq("role", "faculty"),
        supabase
          .from("profiles")
          .select(
            "id, full_name, role, investor_profiles(firm_name, investor_type, sectors, stage_focus)"
          )
          .eq("role", "investor"),
        fetch("/api/connections"),
      ])

      setAlumni((alumniRes.data as Profile[]) || [])
      setFaculty((facultyRes.data as Profile[]) || [])
      setInvestors((investorRes.data as Profile[]) || [])

      if (connRes.ok) {
        const connections: ConnectionRow[] = await connRes.json()
        const map: Record<string, ConnectionStatus> = {}
        if (user) {
          for (const c of connections) {
            const otherId =
              c.requester_id === user.id ? c.recipient_id : c.requester_id
            map[otherId] = c.status as ConnectionStatus
          }
        }
        setConnectionMap(map)
      }

      setLoading(false)
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleConnect(recipientId: string) {
    const status = connectionMap[recipientId] || "none"
    if (status !== "none") return
    setConnecting((prev) => ({ ...prev, [recipientId]: true }))
    try {
      const res = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient_id: recipientId }),
      })
      if (res.ok) {
        setConnectionMap((prev) => ({ ...prev, [recipientId]: "pending" }))
      }
    } finally {
      setConnecting((prev) => ({ ...prev, [recipientId]: false }))
    }
  }

  function getSubtitle(person: Profile): string {
    if (person.alumni_profiles) {
      const a = person.alumni_profiles
      return [a.job_title, a.company].filter(Boolean).join(" @ ") || "Alumni"
    }
    if (person.faculty_profiles) {
      const f = person.faculty_profiles
      return [f.designation, f.department].filter(Boolean).join(", ") || "Faculty"
    }
    if (person.investor_profiles) {
      const i = person.investor_profiles
      return [i.investor_type, i.firm_name].filter(Boolean).join(" @ ") || "Investor"
    }
    return person.role
  }

  function getTags(person: Profile): string[] {
    if (person.alumni_profiles?.expertise_areas?.length) return person.alumni_profiles.expertise_areas
    if (person.faculty_profiles?.research_areas?.length) return person.faculty_profiles.research_areas
    if (person.investor_profiles?.sectors?.length) return person.investor_profiles.sectors
    return []
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  const allPeople = [...alumni, ...faculty, ...investors]

  const source =
    activeTab === "all"
      ? allPeople
      : activeTab === "alumni"
      ? alumni
      : activeTab === "faculty"
      ? faculty
      : investors

  const displayed = source.filter((p) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      p.full_name.toLowerCase().includes(q) ||
      getSubtitle(p).toLowerCase().includes(q)
    )
  })

  const roleLabel: Record<string, string> = {
    alumni: "Alumni",
    faculty: "Faculty",
    investor: "Investor",
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar title="Network" subtitle="Connect with alumni, faculty, and investors" />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Metric cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total People", value: allPeople.length, icon: Users, color: "text-indigo-600" },
            { label: "Alumni", value: alumni.length, icon: GraduationCap, color: "text-emerald-600" },
            { label: "Faculty", value: faculty.length, icon: Briefcase, color: "text-blue-600" },
            { label: "Investors", value: investors.length, icon: Building2, color: "text-purple-600" },
          ].map((m) => (
            <Card key={m.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <m.icon className={`w-5 h-5 ${m.color}`} />
                <div>
                  <p className="text-xl font-bold text-slate-900">{m.value}</p>
                  <p className="text-xs text-slate-500">{m.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search + Tabs */}
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            />
          </div>
          <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
            {(["all", "alumni", "faculty", "investors"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : displayed.length === 0 ? (
          <Card>
            <CardContent className="p-16 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-indigo-400" />
              </div>
              <p className="font-semibold text-slate-800 text-lg">
                {search ? "No people found" : "The network is growing"}
              </p>
              <p className="text-sm text-slate-500 mt-2 max-w-sm">
                {search
                  ? "Try a different search term or browse all members."
                  : "As alumni, faculty, and investors join UniConnect AI, they'll appear here. Check back soon!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {displayed.map((person) => {
              const status: ConnectionStatus = connectionMap[person.id] || "none"
              const tags = getTags(person)
              const subtitle = getSubtitle(person)
              const initials = getInitials(person.full_name)
              const isSelf = person.id === currentUserId

              return (
                <Card key={person.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm flex-shrink-0">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm text-slate-900">{person.full_name}</p>
                          <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                            {roleLabel[person.role] || person.role}
                          </span>
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
                      <div className="flex flex-col gap-1.5 flex-shrink-0">
                        {!isSelf && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConnect(person.id)}
                            disabled={status !== "none" || connecting[person.id]}
                            className="text-xs"
                          >
                            {connecting[person.id] ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : status === "accepted" ? (
                              "Connected"
                            ) : status === "pending" ? (
                              "Pending"
                            ) : (
                              "Connect"
                            )}
                          </Button>
                        )}
                        <a href="/student/messages" className="text-xs text-indigo-600 hover:text-indigo-700 px-2 py-1 rounded hover:bg-slate-50">Message</a>
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
