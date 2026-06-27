"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Rocket, Plus, Loader2, X, Link2 } from "lucide-react"

type Startup = {
  id: string
  name: string
  tagline: string
  description: string
  sector: string | null
  stage: string | null
  website: string | null
  raising: boolean
  hiring: boolean
  team_size: number | null
  founded_year: number | null
  created_at: string
}

export default function AlumniStartupsPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [startups, setStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)
  const [sectorFilter, setSectorFilter] = useState("")
  const [stageFilter, setStageFilter] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: "",
    tagline: "",
    description: "",
    sector: "",
    stage: "pre-seed",
    website: "",
    raising: false,
    hiring: false,
    team_size: "",
    founded_year: "",
  })

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/startups")
      const data = await res.json()
      setStartups(Array.isArray(data) ? data : [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = startups.filter((s) => {
    if (sectorFilter && s.sector !== sectorFilter) return false
    if (stageFilter && s.stage !== stageFilter) return false
    return true
  })

  const sectors = Array.from(new Set(startups.map((s) => s.sector).filter(Boolean))) as string[]
  const stages = Array.from(new Set(startups.map((s) => s.stage).filter(Boolean))) as string[]

  const metrics = {
    total: startups.length,
    raising: startups.filter((s) => s.raising).length,
    hiring: startups.filter((s) => s.hiring).length,
    postRevenue: startups.filter((s) => s.stage === "growth" || s.stage === "series-a" || s.stage === "series-b").length,
  }

  async function handleSubmit() {
    setSubmitting(true)
    const res = await fetch("/api/startups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        team_size: form.team_size ? parseInt(form.team_size) : null,
        founded_year: form.founded_year ? parseInt(form.founded_year) : null,
      }),
    })
    const data = await res.json()
    if (!data.error) {
      setStartups((prev) => [data, ...prev])
      setShowModal(false)
      setForm({ name: "", tagline: "", description: "", sector: "", stage: "pre-seed", website: "", raising: false, hiring: false, team_size: "", founded_year: "" })
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar title="Startups" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Startups</h1>
            <p className="text-sm text-slate-500 mt-0.5">Explore the alumni startup ecosystem</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Your Startup
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Startups", count: metrics.total, color: "text-slate-700" },
            { label: "Raising", count: metrics.raising, color: "text-green-700" },
            { label: "Hiring", count: metrics.hiring, color: "text-blue-700" },
            { label: "Post-Revenue", count: metrics.postRevenue, color: "text-purple-700" },
          ].map((m) => (
            <Card key={m.label}>
              <CardContent className="p-4 text-center">
                <p className={`text-2xl font-bold ${m.color}`}>{m.count}</p>
                <p className="text-xs text-slate-500 mt-0.5">{m.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-5 flex-wrap">
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="">All Sectors</option>
            {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="">All Stages</option>
            {stages.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Rocket className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No startups found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((s) => (
              <Card key={s.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">{s.name}</p>
                        {s.website && (
                          <a href={s.website} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600">
                            <Link2 className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{s.tagline}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {s.sector && (
                          <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">{s.sector}</span>
                        )}
                        {s.stage && (
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s.stage}</span>
                        )}
                        {s.raising && (
                          <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">Raising</span>
                        )}
                        {s.hiring && (
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Hiring</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-xs text-slate-400 ml-4 flex-shrink-0">
                      {s.team_size != null && <>{s.team_size} people<br /></>}
                      {s.founded_year}
                    </div>
                  </div>
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
              <h2 className="text-lg font-semibold">Add Your Startup</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Startup Name", key: "name", type: "text" },
                { label: "Tagline", key: "tagline", type: "text" },
                { label: "Sector", key: "sector", type: "text" },
                { label: "Website", key: "website", type: "url" },
                { label: "Team Size", key: "team_size", type: "number" },
                { label: "Founded Year", key: "founded_year", type: "number" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-slate-700 mb-1">{label}</label>
                  <input
                    type={type}
                    value={(form as Record<string, string | boolean>)[key] as string}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Stage</label>
                <select
                  value={form.stage}
                  onChange={(e) => setForm((f) => ({ ...f, stage: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  <option value="idea">Idea</option>
                  <option value="pre-seed">Pre-Seed</option>
                  <option value="seed">Seed</option>
                  <option value="series-a">Series A</option>
                  <option value="series-b">Series B</option>
                  <option value="growth">Growth</option>
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
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.raising}
                    onChange={(e) => setForm((f) => ({ ...f, raising: e.target.checked }))}
                    className="rounded"
                  />
                  Currently Raising
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.hiring}
                    onChange={(e) => setForm((f) => ({ ...f, hiring: e.target.checked }))}
                    className="rounded"
                  />
                  Hiring
                </label>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleSubmit} disabled={submitting} className="flex-1">
                {submitting ? "Submitting..." : "Add Startup"}
              </Button>
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

