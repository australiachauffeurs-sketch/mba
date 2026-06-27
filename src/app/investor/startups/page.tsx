"use client"

import { useEffect, useState } from "react"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Rocket, Loader2, Link2 } from "lucide-react"

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
}

export default function InvestorStartupsPage() {
  const [startups, setStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)
  const [sectorFilter, setSectorFilter] = useState("")
  const [stageFilter, setStageFilter] = useState("")

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
    postRevenue: startups.filter((s) => ["growth", "series-a", "series-b"].includes(s.stage ?? "")).length,
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar title="Startups" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Startups</h1>
          <p className="text-sm text-slate-500 mt-0.5">Discover investment opportunities in the MBA network</p>
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
                  <div className="mt-3 flex justify-end">
                    <Button size="sm" variant="outline" className="text-xs">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

