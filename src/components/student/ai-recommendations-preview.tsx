"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Sparkles, Loader2, ArrowRight, UserPlus, Zap } from "lucide-react";
import type { AIRecommendationsResponse } from "@/app/api/ai/recommendations/route";

export function AIRecommendationsPreview({ hasGoal }: { hasGoal: boolean }) {
  const [data, setData] = useState<AIRecommendationsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasGoal) return;
    setLoading(true);
    fetch("/api/ai/recommendations")
      .then(r => r.json())
      .then(json => { if (!json.error) setData(json); })
      .finally(() => setLoading(false));
  }, [hasGoal]);

  if (!hasGoal) {
    return (
      <Card>
        <CardContent className="p-10 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
            <UserPlus className="w-7 h-7 text-indigo-400" />
          </div>
          <p className="font-medium text-slate-800">Set a goal to unlock AI matching</p>
          <p className="text-sm text-slate-500 mt-1 max-w-xs">
            Once you set your career goal in Career GPS, AI will surface the right alumni, mentors, and opportunities for you.
          </p>
          <Link href="/student/career-gps" className="mt-4 text-sm text-indigo-600 hover:underline flex items-center gap-1">
            Go to Career GPS <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-10 flex flex-col items-center text-center">
          <Loader2 className="w-7 h-7 text-indigo-400 animate-spin mb-3" />
          <p className="text-sm font-medium text-slate-700">AI is building your recommendations…</p>
          <p className="text-xs text-slate-400 mt-1">Scanning alumni, mentors & opportunities</p>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-sm text-slate-500">Could not load recommendations.</p>
          <Link href="/student/ai-recommendations" className="text-sm text-indigo-600 hover:underline mt-2 block">
            Try opening AI Advisor →
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Show first 3 top recommendations across all categories
  const topItems = data.categories
    .flatMap(cat => cat.items.map(item => ({ ...item, catLabel: cat.label, catEmoji: cat.emoji })))
    .sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0))
    .slice(0, 3);

  return (
    <div className="space-y-3">
      {/* Insight strip */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-indigo-800 leading-snug">{data.insight}</p>
      </div>

      {topItems.map((item, i) => (
        <Card key={i} className={item.urgent ? "ring-1 ring-indigo-300" : ""}>
          <CardContent className="p-4 flex items-start gap-3">
            <div className="w-9 h-9 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 text-base">
              {item.catEmoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm text-slate-900">{item.title}</p>
                {item.urgent && (
                  <span className="flex items-center gap-0.5 text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                    <Zap className="w-2.5 h-2.5" /> Act now
                  </span>
                )}
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{item.catLabel}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug line-clamp-2">{item.why}</p>
            </div>
            <Link href="/student/ai-recommendations"
              className="flex-shrink-0 text-xs text-indigo-600 hover:text-indigo-700 font-medium whitespace-nowrap">
              {item.action} →
            </Link>
          </CardContent>
        </Card>
      ))}

      <Link href="/student/ai-recommendations"
        className="flex items-center justify-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium py-2">
        See all {data.categories.reduce((n, c) => n + c.items.length, 0)} recommendations
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
