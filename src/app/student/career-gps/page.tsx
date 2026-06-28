"use client";

import { useState, useEffect, useCallback } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";
import {
  Sparkles, Target, Route, TrendingUp, CheckCircle,
  Loader2, PenLine, Pencil, ArrowRight, Briefcase,
  Calendar, Users, Zap,
} from "lucide-react";
import type { CareerRoadmap } from "@/app/api/ai/career-roadmap/route";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CAREER_GOALS = [
  { id: "founder", label: "Startup Founder", emoji: "🚀", desc: "Build and launch your own company" },
  { id: "consultant", label: "Strategy Consultant", emoji: "💼", desc: "Join McKinsey, BCG, Bain or boutique firms" },
  { id: "investment_banker", label: "Investment Banker", emoji: "🏦", desc: "M&A, capital markets, or corporate finance" },
  { id: "vc", label: "Venture Capitalist", emoji: "💡", desc: "Source deals and invest in startups" },
  { id: "product_manager", label: "Product Manager", emoji: "🎯", desc: "Lead product at a tech company" },
  { id: "corporate_strategy", label: "Corporate Strategy", emoji: "📊", desc: "Drive strategy at a large enterprise" },
  { id: "private_equity", label: "Private Equity", emoji: "📈", desc: "Buyouts, LBOs, and portfolio management" },
  { id: "social_impact", label: "Social Impact / NGO", emoji: "🌍", desc: "Drive change in non-profit or social enterprise" },
];

type UpdateType = "opportunity" | "event" | "connection" | "mentor" | "research";

interface CareerGpsUpdate {
  id: string;
  student_id: string;
  type: UpdateType;
  title: string;
  description: string | null;
  why_relevant: string | null;
  reference_id: string | null;
  reference_type: string | null;
  created_at: string;
}

const UPDATE_ICONS: Record<UpdateType, React.ElementType> = {
  opportunity: Briefcase,
  event: Calendar,
  connection: Users,
  mentor: Users,
  research: Sparkles,
};

const UPDATE_COLORS: Record<UpdateType, string> = {
  opportunity: "bg-indigo-50 text-indigo-600 border-indigo-100",
  event: "bg-purple-50 text-purple-600 border-purple-100",
  connection: "bg-emerald-50 text-emerald-600 border-emerald-100",
  mentor: "bg-amber-50 text-amber-700 border-amber-100",
  research: "bg-blue-50 text-blue-600 border-blue-100",
};

const priorityColor: Record<string, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-green-100 text-green-700",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-AU", { month: "short", day: "numeric" });
}

export default function CareerGPSPage() {
  const [step, setStep] = useState<"select" | "roadmap">("select");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [customGoal, setCustomGoal] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [updates, setUpdates] = useState<CareerGpsUpdate[]>([]);

  const generateRoadmap = useCallback(async () => {
    setRoadmapLoading(true);
    try {
      const res = await fetch("/api/ai/career-roadmap");
      if (res.ok) {
        const data = await res.json();
        if (!data.error) setRoadmap(data as CareerRoadmap);
      }
    } finally {
      setRoadmapLoading(false);
    }
  }, []);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const [spRes, updRes] = await Promise.all([
        supabase.from("student_profiles")
          .select("career_goal, custom_career_goal, career_roadmap")
          .eq("id", user.id).single(),
        supabase.from("career_gps_updates")
          .select("*")
          .eq("student_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      const sp = spRes.data;
      if (sp?.career_goal) {
        setSelectedGoal(sp.career_goal);
        if (sp.career_goal === "custom") setShowCustom(true);
        if (sp.custom_career_goal) setCustomGoal(sp.custom_career_goal);
        setStep("roadmap");
        if (sp.career_roadmap) setRoadmap(sp.career_roadmap as CareerRoadmap);
      }

      setUpdates((updRes.data || []) as CareerGpsUpdate[]);
      setLoading(false);
    }
    load();
  }, []);

  // Trigger AI generation when entering roadmap without a cached roadmap
  useEffect(() => {
    if (step === "roadmap" && !roadmap && !roadmapLoading) {
      generateRoadmap();
    }
  }, [step, roadmap, roadmapLoading, generateRoadmap]);

  async function handleSave() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("student_profiles").upsert({
      id: user.id,
      career_goal: selectedGoal,
      custom_career_goal: selectedGoal === "custom" ? customGoal : null,
      ai_recommendations: null,
      ai_recommendations_at: null,
      career_roadmap: null,
      career_roadmap_at: null,
      updated_at: new Date().toISOString(),
    });

    setRoadmap(null);
    setSaving(false);
    setStep("roadmap");
  }

  const goalMeta = CAREER_GOALS.find(g => g.id === selectedGoal);
  const goalLabel = selectedGoal === "custom" ? (customGoal || "My Custom Goal") : (goalMeta?.label || "");
  const goalEmoji = selectedGoal === "custom" ? "✏️" : (goalMeta?.emoji || "🎯");

  if (loading) {
    return (
      <>
        <Topbar title="Career GPS" subtitle="Your personalized AI-powered degree navigator" />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
        </main>
      </>
    );
  }

  // ── STEP 1: Goal Selection ──────────────────────────────────────────────────
  if (step === "select") {
    return (
      <>
        <Topbar title="Career GPS" subtitle="Your personalized AI-powered degree navigator" />
        <main className="flex-1 p-6 max-w-5xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">1</div>
              <span className="text-sm font-semibold text-indigo-700">Set Your Goal</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 text-xs font-bold flex items-center justify-center">2</div>
              <span className="text-sm text-slate-400">View Roadmap</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-500" />
                What&apos;s your career goal after MBA?
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">Choose one — AI will check the real network and build your personalized 12-month action plan.</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                {CAREER_GOALS.map(goal => (
                  <button key={goal.id}
                    onClick={() => { setSelectedGoal(goal.id); setShowCustom(false); }}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      selectedGoal === goal.id
                        ? "border-indigo-500 bg-indigo-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50"
                    }`}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">{goal.emoji}</span>
                      <div>
                        <p className={`text-sm font-semibold ${selectedGoal === goal.id ? "text-indigo-700" : "text-slate-800"}`}>{goal.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-snug">{goal.desc}</p>
                      </div>
                      {selectedGoal === goal.id && <CheckCircle className="w-4 h-4 text-indigo-500 ml-auto flex-shrink-0 mt-0.5" />}
                    </div>
                  </button>
                ))}

                <button onClick={() => { setSelectedGoal("custom"); setShowCustom(true); }}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    selectedGoal === "custom"
                      ? "border-indigo-500 bg-indigo-50 shadow-sm"
                      : "border-dashed border-slate-300 bg-white hover:border-indigo-300 hover:bg-slate-50"
                  }`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">✏️</span>
                    <div>
                      <p className={`text-sm font-semibold ${selectedGoal === "custom" ? "text-indigo-700" : "text-slate-800"}`}>Something else</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-snug">Define your own custom career path</p>
                    </div>
                    {selectedGoal === "custom" && <CheckCircle className="w-4 h-4 text-indigo-500 ml-auto flex-shrink-0 mt-0.5" />}
                  </div>
                </button>
              </div>

              {showCustom && (
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-indigo-800">
                    <PenLine className="w-4 h-4" /> Describe your goal
                  </label>
                  <input
                    value={customGoal}
                    onChange={e => setCustomGoal(e.target.value)}
                    placeholder="e.g. CMO at a Fortune 500, Healthcare entrepreneur, ESG analyst…"
                    className="w-full px-3 py-2 text-sm border border-indigo-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    autoFocus
                  />
                  <p className="text-xs text-indigo-600">Be specific — AI uses this to tailor your roadmap and surface the right connections.</p>
                </div>
              )}

              <div className="pt-2">
                <Button
                  size="lg"
                  onClick={handleSave}
                  disabled={!selectedGoal || saving || (selectedGoal === "custom" && !customGoal.trim())}
                  className="gap-2"
                >
                  {saving
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                    : <><Sparkles className="w-4 h-4" /> Generate My Roadmap <ArrowRight className="w-4 h-4" /></>
                  }
                </Button>
                {!selectedGoal && <p className="text-xs text-slate-400 mt-2">Select a goal above to continue</p>}
              </div>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  // ── STEP 2: Roadmap View ────────────────────────────────────────────────────
  const phases = roadmap?.phases || [];
  const skillGaps = roadmap?.skill_gaps || [];
  const netCtx = roadmap?.network_context;

  return (
    <>
      <Topbar title="Career GPS" subtitle="Your personalized AI-powered degree navigator" />
      <main className="flex-1 p-6 space-y-6">

        {/* Goal summary bar */}
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-5 py-3.5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-xl">{goalEmoji}</div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Your Career Goal</p>
              <p className="text-base font-bold text-slate-900">{goalLabel}</p>
            </div>
            <span className="ml-2 flex items-center gap-1 text-xs text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> Goal set
            </span>
            {roadmap?.isAIGenerated && (
              <span className="flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full font-medium">
                <Sparkles className="w-3.5 h-3.5" /> AI Personalised
              </span>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={() => setStep("select")} className="gap-1.5">
            <Pencil className="w-3.5 h-3.5" /> Change Goal
          </Button>
        </div>

        {/* Roadmap banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">{goalEmoji}</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">Your 12-Month Roadmap</h2>
              {roadmap?.insight ? (
                <p className="opacity-90 text-sm leading-relaxed max-w-2xl">{roadmap.insight}</p>
              ) : (
                <p className="opacity-80 text-sm leading-relaxed max-w-2xl">
                  {roadmapLoading
                    ? "AI is scanning your network and generating a personalized plan…"
                    : `AI has mapped your MBA journey toward becoming a ${goalLabel}.`}
                </p>
              )}
              <div className="flex gap-3 mt-4">
                <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                  <div className="text-2xl font-bold">{phases.length || "5"}</div>
                  <div className="text-xs opacity-80">Phases</div>
                </div>
                <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                  <div className="text-2xl font-bold">{skillGaps.filter(s => s.priority === "High").length || "–"}</div>
                  <div className="text-xs opacity-80">Priority skills</div>
                </div>
                <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-xs opacity-80">Month plan</div>
                </div>
                {netCtx && netCtx.alumni_referenced > 0 && (
                  <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                    <div className="text-2xl font-bold">{netCtx.alumni_referenced}</div>
                    <div className="text-xs opacity-80">Real alumni</div>
                  </div>
                )}
                {updates.length > 0 && (
                  <div className="bg-amber-400/30 border border-amber-300/40 rounded-xl px-4 py-2 text-center">
                    <div className="text-2xl font-bold">{updates.length}</div>
                    <div className="text-xs opacity-80">New updates</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap phases or loading state */}
        {roadmapLoading ? (
          <Card>
            <CardContent className="p-12 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7 text-indigo-400 animate-pulse" />
              </div>
              <p className="font-semibold text-slate-800">AI is building your personalised roadmap…</p>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">
                Scanning alumni network, open opportunities, and upcoming events to create a roadmap that references real people in your network.
              </p>
              <div className="flex items-center gap-2 mt-4">
                <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                <span className="text-xs text-indigo-600">This takes about 10 seconds…</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {/* Roadmap phases */}
            <div className="col-span-2 space-y-3">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <Route className="w-4 h-4 text-indigo-500" /> Action Plan
              </h2>
              {phases.length > 0 ? phases.map((phase, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${i === 0 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                        {phase.phase}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">{phase.duration}</span>
                          <span className="font-semibold text-slate-900">{phase.title}</span>
                          {i === 0 && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">Start here</span>}
                        </div>
                        {phase.description && (
                          <p className="text-xs text-slate-500 mb-2">{phase.description}</p>
                        )}
                        <ul className="space-y-2">
                          {phase.actions.map((action, j) => (
                            <li key={j} className="text-sm text-slate-600">
                              <div className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0 mt-1.5" />
                                <div>
                                  <span className="font-medium text-slate-700">{action.title}</span>
                                  {action.description && (
                                    <p className="text-xs text-slate-500 mt-0.5">{action.description}</p>
                                  )}
                                  {action.reference_name && (
                                    <span className="inline-flex items-center gap-1 mt-1 text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                      <Users className="w-2.5 h-2.5" /> {action.reference_name}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Sparkles className="w-8 h-8 text-indigo-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-700">Roadmap will appear here</p>
                    <p className="text-sm text-slate-500 mt-1">Your personalized steps will be generated based on your goal and the real network.</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Skill gaps + recommended connections */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-500" /> Skill Gaps to Close
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {skillGaps.length > 0 ? skillGaps.map(s => (
                    <div key={s.skill} className="flex items-center justify-between gap-2">
                      <p className="text-sm text-slate-700">{s.skill}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${priorityColor[s.priority] || priorityColor.Low}`}>
                        {s.priority}
                      </span>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-500">Skill analysis will populate once the roadmap generates.</p>
                  )}
                </CardContent>
              </Card>

              {roadmap?.recommended_connections && roadmap.recommended_connections.length > 0 && (
                <Card className="border-emerald-100 bg-emerald-50/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-emerald-800">
                      <Users className="w-3.5 h-3.5" /> People to Connect With
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    {roadmap.recommended_connections.slice(0, 4).map((name, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-emerald-700">
                        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-bold text-emerald-600">
                          {name.charAt(0)}
                        </div>
                        {name}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              <Card className="border-indigo-100 bg-indigo-50/50">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-indigo-800 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5" /> Not the right goal?
                  </p>
                  <p className="text-xs text-indigo-700 mb-3">You can update your career goal anytime.</p>
                  <Button variant="outline" size="sm" className="w-full gap-1.5 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                    onClick={() => setStep("select")}>
                    <Pencil className="w-3.5 h-3.5" /> Edit My Goal
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Enrichment Updates — appended by cron, never touching the roadmap above */}
        {updates.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <h2 className="font-semibold text-slate-900">New Additions to Your Career GPS</h2>
              </div>
              <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                {updates.length} new
              </span>
              <p className="text-xs text-slate-400">Automatically added as new opportunities and events match your goal</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {updates.map(update => {
                const Icon = UPDATE_ICONS[update.type] || Sparkles;
                const colorClass = UPDATE_COLORS[update.type] || UPDATE_COLORS.opportunity;
                return (
                  <Card key={update.id} className="border-slate-200 hover:border-indigo-200 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-slate-400 capitalize">{update.type}</span>
                            <span className="text-xs text-slate-300">·</span>
                            <span className="text-xs text-slate-400">{timeAgo(update.created_at)}</span>
                          </div>
                          <p className="text-sm font-semibold text-slate-800 leading-snug">{update.title}</p>
                          {update.description && (
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{update.description}</p>
                          )}
                          {update.why_relevant && (
                            <p className="text-xs text-indigo-600 mt-1.5 flex items-start gap-1">
                              <Sparkles className="w-3 h-3 flex-shrink-0 mt-0.5" />
                              {update.why_relevant}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
