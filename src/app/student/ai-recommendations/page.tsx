"use client";

import { useState, useEffect } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Sparkles, Loader2, RefreshCw, AlertCircle, ArrowRight,
  Users, BookOpen, Lightbulb, Building2, FlaskConical, Briefcase, Handshake, Zap,
} from "lucide-react";
import type { AIRecommendationsResponse, RecommendationCategory } from "@/app/api/ai/recommendations/route";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  alumni: Users,
  mentor: Lightbulb,
  course: BookOpen,
  club: Building2,
  research: FlaskConical,
  internship: Briefcase,
  cofounder: Handshake,
};

const CATEGORY_COLORS: Record<string, string> = {
  alumni: "bg-indigo-50 border-indigo-100 text-indigo-600",
  mentor: "bg-purple-50 border-purple-100 text-purple-600",
  course: "bg-blue-50 border-blue-100 text-blue-600",
  club: "bg-green-50 border-green-100 text-green-600",
  research: "bg-amber-50 border-amber-100 text-amber-600",
  internship: "bg-rose-50 border-rose-100 text-rose-600",
  cofounder: "bg-teal-50 border-teal-100 text-teal-600",
};

function CategorySection({ cat }: { cat: RecommendationCategory }) {
  const Icon = CATEGORY_ICONS[cat.type] || Sparkles;
  const colorClass = CATEGORY_COLORS[cat.type] || "bg-slate-50 border-slate-100 text-slate-600";

  return (
    <div className="space-y-3">
      <h2 className="font-semibold text-slate-900 flex items-center gap-2 text-base">
        <span className="text-xl">{cat.emoji}</span>
        {cat.label}
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {cat.items.map((item, i) => (
          <Card key={i} className={`relative ${item.urgent ? "ring-2 ring-indigo-300" : ""}`}>
            {item.urgent && (
              <div className="absolute -top-2 right-3 flex items-center gap-1 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                <Zap className="w-3 h-3" /> Act now
              </div>
            )}
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900 leading-snug">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">{item.description}</p>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2">
                <p className="text-xs text-indigo-800 leading-snug">
                  <span className="font-semibold">Why you: </span>{item.why}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {item.tags.map(tag => (
                  <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>

              <Button size="sm" variant="outline" className="w-full text-xs gap-1.5 h-8">
                {item.action} <ArrowRight className="w-3 h-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function AIRecommendationsPage() {
  const [data, setData] = useState<AIRecommendationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"no_goal" | "failed" | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchRecs(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const url = isRefresh ? "/api/ai/recommendations?refresh=true" : "/api/ai/recommendations";
      const res = await fetch(url);
      const json = await res.json();
      if (json.error === "no_goal") { setError("no_goal"); return; }
      if (json.error) { setError("failed"); return; }
      setData(json);
    } catch {
      setError("failed");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { fetchRecs(); }, []);

  if (loading) return (
    <>
      <Topbar title="AI Advisor" subtitle="Personalized recommendations powered by AI" />
      <main className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium">AI is analysing your profile…</p>
        <p className="text-xs text-slate-400">Scanning alumni, mentors, courses & opportunities</p>
      </main>
    </>
  );

  if (error === "no_goal") return (
    <>
      <Topbar title="AI Advisor" subtitle="Personalized recommendations powered by AI" />
      <main className="flex-1 p-6 max-w-lg">
        <Card>
          <CardContent className="p-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-indigo-400" />
            </div>
            <p className="font-semibold text-slate-900 text-lg">Set your career goal first</p>
            <p className="text-sm text-slate-500 mt-2 max-w-xs">
              AI needs to know where you're headed before it can recommend the right alumni, mentors, and opportunities.
            </p>
            <Link href="/student/career-gps" className="mt-6">
              <Button className="gap-2">
                <Sparkles className="w-4 h-4" /> Go to Career GPS
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </>
  );

  if (error === "failed" || !data) return (
    <>
      <Topbar title="AI Advisor" subtitle="Personalized recommendations powered by AI" />
      <main className="flex-1 p-6 max-w-lg">
        <Card>
          <CardContent className="p-10 flex flex-col items-center text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
            <p className="font-medium text-slate-800">Couldn't generate recommendations</p>
            <p className="text-sm text-slate-500 mt-1">Something went wrong. Try refreshing.</p>
            <Button variant="outline" className="mt-4 gap-2" onClick={() => fetchRecs()}>
              <RefreshCw className="w-4 h-4" /> Try Again
            </Button>
          </CardContent>
        </Card>
      </main>
    </>
  );

  return (
    <>
      <Topbar title="AI Advisor" subtitle="Personalized recommendations powered by AI" />
      <main className="flex-1 p-6 space-y-8 max-w-5xl">

        {/* AI Insight banner */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-10 translate-x-10" />
          <div className="absolute bottom-0 left-20 w-24 h-24 bg-white/5 rounded-full translate-y-8" />
          <div className="relative flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-medium">
                  {data.isAIGenerated ? "✦ AI-Generated • Just for you" : "✦ Smart Recommendations • Just for you"}
                </span>
              </div>
              <p className="text-base font-medium leading-relaxed">{data.insight}</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{data.categories.reduce((n, c) => n + c.items.length, 0)}</div>
                  <div className="text-xs text-white/70">Recommendations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{data.categories.length}</div>
                  <div className="text-xs text-white/70">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{data.categories.reduce((n, c) => n + c.items.filter(i => i.urgent).length, 0)}</div>
                  <div className="text-xs text-white/70">Urgent actions</div>
                </div>
                <button onClick={() => fetchRecs(true)} disabled={refreshing}
                  className="ml-auto flex items-center gap-1.5 text-white/70 hover:text-white text-xs transition-colors">
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                  {refreshing ? "Refreshing…" : "Refresh"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Goal context */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Recommendations for:</span>
          <span className="font-semibold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full">{data.goalLabel}</span>
          <Link href="/student/career-gps" className="text-indigo-600 hover:underline ml-1">Change goal →</Link>
        </div>

        {/* Categories */}
        {data.categories.map((cat) => (
          <CategorySection key={cat.type} cat={cat} />
        ))}

        <p className="text-xs text-slate-400 text-center pb-4">
          Recommendations are personalized to your profile and career goal · Last updated {new Date(data.generatedAt).toLocaleString()}
        </p>
      </main>
    </>
  );
}
