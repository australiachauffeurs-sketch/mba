"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Plus, Loader2, X } from "lucide-react"

type Opportunity = {
  id: string
  title: string
  company: string
  type: string
  description: string
  location: string
  salary_range: string | null
  deadline: string | null
  active: boolean
  created_at: string
}

export default function OpportunitiesPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [userRole, setUserRole] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: "",
    company: "",
    type: "internship",
    description: "",
    location: "",
    salary_range: "",
    deadline: "",
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
      const res = await fetch("/api/opportunities")
      const data = await res.json()
      setOpportunities(Array.isArray(data) ? data : [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = activeTab === "all"
    ? opportunities
    : opportunities.filter((o) => o.type === activeTab)

  const counts = {
    all: opportunities.length,
    internship: opportunities.filter((o) => o.type === "internship").length,
    fulltime: opportunities.filter((o) => o.type === "fulltime").length,
    research: opportunities.filter((o) => o.type === "research").length,
  }

  const canPost = ["alumni", "faculty", "admin"].includes(userRole ?? "")

  async function handleSubmit() {
    setSubmitting(true)
    const res = await fetch("/api/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, active: true }),
    })
    const data = await res.json()
    if (!data.error) {
      setOpportunities((prev) => [data, ...prev])
      setShowModal(false)
      setForm({ title: "", company: "", type: "internship", description: "", location: "", salary_range: "", deadline: "" })
    }
    setSubmitting(false)
  }

  const tabs = [
    { key: "all", label: "All" },
    { key: "internship", label: "Internship" },
    { key: "fulltime", label: "Full-time" },
    { key: "research", label: "Research" },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar title="Opportunities" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Opportunities</h1>
            <p className="text-sm text-slate-500 mt-0.5">Browse internships, jobs, and research positions</p>
          </div>
          {canPost && (
            <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Post Opportunity
            </Button>
          )}
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "All Opportunities", count: counts.all, color: "text-slate-700" },
            { label: "Internships", count: counts.internship, color: "text-blue-700" },
            { label: "Full-time", count: counts.fulltime, color: "text-green-700" },
            { label: "Research", count: counts.research, color: "text-purple-700" },
          ].map((m) => (
            <Card key={m.label}>
              <CardContent className="p-4 text-center">
                <p className={`text-2xl font-bold ${m.color}`}>{m.count}</p>
                <p className="text-xs text-slate-500 mt-0.5">{m.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-5 w-fit">
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
            <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No opportunities found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((opp) => (
              <Card key={opp.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm text-slate-900">{opp.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          opp.type === "internship" ? "bg-blue-50 text-blue-700" :
                          opp.type === "fulltime" ? "bg-green-50 text-green-700" :
                          opp.type === "research" ? "bg-purple-50 text-purple-700" : "bg-slate-100 text-slate-600"
                        }`}>{opp.type}</span>
                      </div>
                      <p className="text-xs text-slate-500">{opp.company} â€¢ {opp.location}</p>
                      {opp.salary_range && (
                        <p className="text-xs text-green-600 font-medium mt-0.5">{opp.salary_range}</p>
                      )}
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2">{opp.description}</p>
                    </div>
                    <Button size="sm" variant="outline" className="flex-shrink-0 text-xs">Apply</Button>
                  </div>
                  {opp.deadline && (
                    <p className="text-xs text-slate-400 mt-2">
                      Deadline: {new Date(opp.deadline).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Post Opportunity</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Title", key: "title", type: "text" },
                { label: "Company", key: "company", type: "text" },
                { label: "Location", key: "location", type: "text" },
                { label: "Salary Range", key: "salary_range", type: "text" },
                { label: "Deadline", key: "deadline", type: "date" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-slate-700 mb-1">{label}</label>
                  <input
                    type={type}
                    value={(form as Record<string, string>)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  <option value="internship">Internship</option>
                  <option value="fulltime">Full-time</option>
                  <option value="research">Research</option>
                  <option value="contract">Contract</option>
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
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleSubmit} disabled={submitting} className="flex-1">
                {submitting ? "Posting..." : "Post"}
              </Button>
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

