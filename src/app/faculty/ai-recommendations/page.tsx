"use client"
import { useState, useEffect } from "react"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, AlertCircle, ArrowRight, Zap } from "lucide-react"
import type { AIRecommendationsResult } from "@/app/api/ai/faculty-recommendations/route"

export default function FacultyAIAdvisorPage() {
  const [data, setData] = useState<AIRecommendationsResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch("/api/ai/faculty-recommendations")
      .then(r => r.json())
      .then(json => { if (json.error) setError(true); else setData(json) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <>
      <Topbar title="AI Advisor" subtitle="Personalised recommendations just for you" />
      <main className="flex-1 flex flex-col items-center justify-center gap-3 min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        <p className="text-sm text-slate-500">AI is analysing your research profile…</p>
      </main>
    </>
  )

  if (error || !data) return (
    <>
      <Topbar title="AI Advisor" subtitle="Personalised recommendations just for you" />
      <main className="flex-1 p-6">
        <Card>
          <CardContent className="p-10 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Could not load recommendations. Please try again.</p>
          </CardContent>
        </Card>
      </main>
    </>
  )

  return (
    <>
      <Topbar title="AI Advisor" subtitle="Personalised recommendations just for you" />
      <main className="flex-1 p-6 space-y-6 max-w-5xl">
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">
                {data.isAIGenerated ? "✦ AI-Generated" : "✦ Smart Recommendations"} • Just for you
              </span>
              <p className="mt-2 text-base font-medium leading-relaxed">{data.insight}</p>
              <div className="flex gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{data.categories.reduce((n, c) => n + c.items.length, 0)}</div>
                  <div className="text-xs opacity-70">Recommendations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{data.categories.length}</div>
                  <div className="text-xs opacity-70">Categories</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {data.categories.map(cat => (
          <div key={cat.type} className="space-y-3">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="text-xl">{cat.emoji}</span>{cat.label}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {cat.items.map((item, i) => (
                <Card key={i} className={item.urgent ? "ring-2 ring-green-300" : ""}>
                  <CardContent className="p-4 space-y-3">
                    {item.urgent && (
                      <span className="flex items-center gap-1 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full w-fit">
                        <Zap className="w-3 h-3" />Act now
                      </span>
                    )}
                    <p className="font-semibold text-sm text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.description}</p>
                    <div className="bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                      <p className="text-xs text-green-800"><span className="font-semibold">Why you: </span>{item.why}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map(t => (
                        <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                    <Button size="sm" variant="outline" className="w-full text-xs gap-1">
                      <span>{item.action}</span><ArrowRight className="w-3 h-3" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
        <p className="text-xs text-slate-400 text-center pb-4">
          Last updated {new Date(data.generatedAt).toLocaleString()}
        </p>
      </main>
    </>
  )
}
