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

const STATIC_ROADMAPS: Record<string, { duration: string; title: string; actions: string[] }[]> = {
  founder: [
    { duration: "Month 1–2", title: "Build Your Network", actions: ["Connect with 3 alumni founders in your sector", "Join the Entrepreneurship & Innovation Club", "Attend startup pitch events and demo days"] },
    { duration: "Month 3–4", title: "Validate Your Idea", actions: ["Define the problem you're solving clearly", "Interview 20 potential customers", "Build a simple MVP or prototype"] },
    { duration: "Month 5–6", title: "Find Co-founders & Advisors", actions: ["Meet technical co-founder candidates at hackathons", "Engage a faculty advisor in your domain", "Join the Co-founders platform on UniConnect"] },
    { duration: "Month 7–9", title: "Fundraise & Launch", actions: ["Apply to incubators (YC, Antler, local programs)", "Pitch angel investors via alumni network intros", "Launch publicly and acquire your first customers"] },
    { duration: "Month 10–12", title: "Scale", actions: ["Raise seed round or bootstrap growth", "Hire your first employees with alumni referrals", "Expand to new markets or verticals"] },
  ],
  consultant: [
    { duration: "Month 1–2", title: "Prep & Network", actions: ["Connect with alumni at MBB and Big 4 Strategy firms", "Join the Consulting Club", "Attend firm info sessions and case nights"] },
    { duration: "Month 3–4", title: "Case Interview Practice", actions: ["Practice 3 structured cases per week", "Book mock interviews with alumni at target firms", "Read FT, HBR, and The Economist daily"] },
    { duration: "Month 5–6", title: "Apply for Internships", actions: ["Apply to summer associate roles at MBB / boutique firms", "Get referrals through your alumni connections", "Prepare personal experience and leadership stories"] },
    { duration: "Month 7–9", title: "Intern & Convert", actions: ["Ace your summer internship", "Deliver one standout client project", "Build relationships with your team and managers"] },
    { duration: "Month 10–12", title: "Full-time Offer", actions: ["Convert internship to full-time offer", "Choose your practice area and office location", "Prepare for Day 1 as a consultant"] },
  ],
  investment_banker: [
    { duration: "Month 1–2", title: "Foundation", actions: ["Master financial modeling basics (DCF, comps)", "Connect with alumni in investment banking", "Join the Finance Club"] },
    { duration: "Month 3–4", title: "Technical Prep", actions: ["Practice DCF, LBO, and M&A modeling", "Learn valuation multiples by industry", "Read deal news on WSJ, Bloomberg, and Dealbook"] },
    { duration: "Month 5–6", title: "Recruiting", actions: ["Apply to bulge bracket summer associate programs", "Prepare pitch books and deal analysis samples", "Get warm intros to bankers via alumni network"] },
    { duration: "Month 7–9", title: "Internship", actions: ["Secure summer associate role at target bank", "Work on a live M&A or capital markets deal", "Build analyst and MD relationships on your team"] },
    { duration: "Month 10–12", title: "Convert & Close", actions: ["Get full-time return offer", "Choose your group (M&A, TMT, Healthcare, etc.)", "Network inside your chosen group before Day 1"] },
  ],
  vc: [
    { duration: "Month 1–2", title: "Learn the Ecosystem", actions: ["Read 'Venture Deals' and 'Zero to One'", "Connect with investor alumni in the network", "Follow 50 VCs and founders on LinkedIn"] },
    { duration: "Month 3–4", title: "Source & Analyse", actions: ["Shadow a VC through an alumni connection", "Analyse 10 startups using a VC evaluation framework", "Write investment memos on 3 companies"] },
    { duration: "Month 5–6", title: "Get Experience", actions: ["Apply for VC internship or venture fellow roles", "Join your school's student investment fund", "Attend Demo Days (YC, Antler, local programs)"] },
    { duration: "Month 7–9", title: "Build Your Thesis", actions: ["Pick a sector you want to focus on investing in", "Build a deal pipeline tracking spreadsheet", "Refer one deal to a VC firm through your network"] },
    { duration: "Month 10–12", title: "Land a Role", actions: ["Apply for Analyst / Associate roles at VC firms", "Get warm intros through investor alumni connections", "Showcase your deal pipeline and investment thesis"] },
  ],
  product_manager: [
    { duration: "Month 1–2", title: "Learn PM Fundamentals", actions: ["Read 'Inspired' by Marty Cagan", "Connect with alumni PMs at top tech companies", "Take a free product management course"] },
    { duration: "Month 3–4", title: "Build Skills", actions: ["Learn SQL and basic data analysis", "Do product teardowns of 5 apps you use daily", "Create a product case study portfolio"] },
    { duration: "Month 5–6", title: "APM Programs", actions: ["Apply to Google APM, Meta RPM, Microsoft PM programs", "Prepare product sense and execution case interviews", "Get referrals from alumni at target tech companies"] },
    { duration: "Month 7–9", title: "Internship", actions: ["Secure PM internship at a tech company", "Ship a feature end-to-end with real users", "Work closely with engineers and designers"] },
    { duration: "Month 10–12", title: "Full-time Role", actions: ["Convert internship or apply broadly to PM roles", "Choose your domain (consumer, B2B, platform)", "Negotiate offer and alignment with your career goal"] },
  ],
  corporate_strategy: [
    { duration: "Month 1–2", title: "Internal Networking", actions: ["Connect with alumni in strategy roles at Fortune 500 firms", "Research target companies and industries deeply", "Join Strategy & Operations Club"] },
    { duration: "Month 3–4", title: "Develop Industry Expertise", actions: ["Pick 2–3 industries to specialise in", "Read 10-Ks and earnings calls of target firms", "Build financial analysis and market sizing projects"] },
    { duration: "Month 5–6", title: "Apply & Interview", actions: ["Apply to Corporate Strategy and Strategy & Ops roles", "Prepare for case-style and behavioural interviews", "Get referrals through alumni at target companies"] },
    { duration: "Month 7–9", title: "Internship / Rotation", actions: ["Complete a strategy rotation or summer internship", "Present analysis to senior leadership", "Work on a market entry or M&A project"] },
    { duration: "Month 10–12", title: "Build Career Capital", actions: ["Convert to a full-time strategy role", "Work towards VP Strategy or Chief of Staff", "Build your internal network and visibility"] },
  ],
  private_equity: [
    { duration: "Month 1–2", title: "Foundation", actions: ["Master LBO modeling from scratch", "Connect with alumni in private equity", "Study 5 recent PE deals in depth"] },
    { duration: "Month 3–4", title: "Technical Mastery", actions: ["Build full LBO models with real deal assumptions", "Learn deal sourcing and due diligence process", "Practice PE case studies every week"] },
    { duration: "Month 5–6", title: "Recruiting (Off-cycle)", actions: ["PE recruiting starts early — network aggressively now", "Prepare deal experience and investment thesis", "Get warm intros through banking and alumni network"] },
    { duration: "Month 7–9", title: "Process & Interviews", actions: ["Go through PE interview processes at target funds", "Prepare 'deal I worked on' stories with clear metrics", "Model a take-home LBO in under 3 hours"] },
    { duration: "Month 10–12", title: "Secure Offer", actions: ["Receive PE Associate offer at target fund", "Choose between buyout, growth equity, or credit", "Build relationships with the deal team before Day 1"] },
  ],
  social_impact: [
    { duration: "Month 1–2", title: "Clarify Your Cause", actions: ["Pick the social problem you want to solve", "Connect with alumni in NGOs and impact organisations", "Attend Net Impact and Social Enterprise club events"] },
    { duration: "Month 3–4", title: "Build Domain Knowledge", actions: ["Research 10 organisations in your cause area", "Learn impact measurement frameworks (SROI, theory of change)", "Read Stanford Social Innovation Review"] },
    { duration: "Month 5–6", title: "Get Hands-On", actions: ["Apply for a social impact internship or fellowship", "Join a Consulting for Good or pro-bono project", "Connect with faculty researching your area"] },
    { duration: "Month 7–9", title: "Build Your Model", actions: ["Define your theory of change", "Explore social enterprise vs. non-profit vs. corporate CSR", "Build a financial model for your org or initiative"] },
    { duration: "Month 10–12", title: "Launch or Join", actions: ["Launch your initiative or join a leading impact org", "Apply for Acumen, Echoing Green, or Ashoka fellowships", "Measure and communicate your early impact"] },
  ],
};

const STATIC_SKILL_GAPS: Record<string, Array<{ skill: string; priority: "High" | "Medium" | "Low" }>> = {
  founder: [{ skill: "Fundraising & Pitching", priority: "High" }, { skill: "Product Development", priority: "High" }, { skill: "Go-to-Market Strategy", priority: "High" }, { skill: "Financial Modeling", priority: "Medium" }, { skill: "Team Building", priority: "Medium" }],
  consultant: [{ skill: "Case Interview Skills", priority: "High" }, { skill: "Structured Problem Solving", priority: "High" }, { skill: "Slide Deck & Storytelling", priority: "High" }, { skill: "Excel / Data Analysis", priority: "Medium" }, { skill: "Industry Knowledge", priority: "Medium" }],
  investment_banker: [{ skill: "Financial Modeling (DCF/LBO)", priority: "High" }, { skill: "Valuation", priority: "High" }, { skill: "Deal Execution", priority: "High" }, { skill: "Client Management", priority: "Medium" }, { skill: "Bloomberg / CapIQ", priority: "Medium" }],
  vc: [{ skill: "Startup Evaluation", priority: "High" }, { skill: "Investment Thesis Writing", priority: "High" }, { skill: "Deal Sourcing", priority: "High" }, { skill: "Term Sheet Negotiation", priority: "Medium" }, { skill: "Portfolio Management", priority: "Low" }],
  product_manager: [{ skill: "Product Sense", priority: "High" }, { skill: "SQL / Analytics", priority: "High" }, { skill: "User Research", priority: "High" }, { skill: "Technical Communication", priority: "Medium" }, { skill: "Roadmap Prioritisation", priority: "Medium" }],
  corporate_strategy: [{ skill: "Strategic Analysis", priority: "High" }, { skill: "Financial Modeling", priority: "High" }, { skill: "Executive Communication", priority: "High" }, { skill: "Industry Research", priority: "Medium" }, { skill: "Project Management", priority: "Low" }],
  private_equity: [{ skill: "LBO Modeling", priority: "High" }, { skill: "Due Diligence", priority: "High" }, { skill: "Deal Sourcing", priority: "High" }, { skill: "Portfolio Operations", priority: "Medium" }, { skill: "Debt Structuring", priority: "Medium" }],
  social_impact: [{ skill: "Impact Measurement", priority: "High" }, { skill: "Grant Writing", priority: "High" }, { skill: "Theory of Change", priority: "High" }, { skill: "Stakeholder Management", priority: "Medium" }, { skill: "Social Enterprise Finance", priority: "Medium" }],
};

function buildClientFallback(goal: string): CareerRoadmap {
  const phases = STATIC_ROADMAPS[goal] || STATIC_ROADMAPS["founder"];
  const gaps = STATIC_SKILL_GAPS[goal] || STATIC_SKILL_GAPS["founder"];
  return {
    phases: phases.map((p, i) => ({
      phase: i + 1,
      title: p.title,
      duration: p.duration,
      description: "",
      actions: p.actions.map(a => ({ title: a, description: "", type: "skill" as const })),
    })),
    skill_gaps: gaps,
    insight: "",
    recommended_connections: [],
    network_context: { alumni_referenced: 0, opportunities_available: 0, events_upcoming: 0 },
    isAIGenerated: false,
    generatedAt: new Date().toISOString(),
  };
}

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
  const [roadmapAttempted, setRoadmapAttempted] = useState(false);
  const [updates, setUpdates] = useState<CareerGpsUpdate[]>([]);

  const generateRoadmap = useCallback(async (goal: string) => {
    setRoadmapLoading(true);
    setRoadmapAttempted(true);
    try {
      const res = await fetch("/api/ai/career-roadmap");
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error && data.phases) {
          setRoadmap(data as CareerRoadmap);
          return;
        }
      }
    } catch {
      // fall through to static
    } finally {
      setRoadmapLoading(false);
    }
    // Client-side static fallback so the page never stays blank
    setRoadmap(buildClientFallback(goal));
  }, []);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const [spRes, updRes] = await Promise.all([
        supabase.from("student_profiles")
          .select("career_goal, custom_career_goal, career_roadmap")
          .eq("profile_id", user.id).single(),
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

  // Trigger AI generation when entering roadmap without a cached roadmap (only once)
  useEffect(() => {
    if (step === "roadmap" && !roadmap && !roadmapLoading && !roadmapAttempted) {
      generateRoadmap(selectedGoal);
    }
  }, [step, roadmap, roadmapLoading, roadmapAttempted, selectedGoal, generateRoadmap]);

  async function handleSave() {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("student_profiles").upsert(
        {
          profile_id: user.id,
          career_goal: selectedGoal,
          custom_career_goal: selectedGoal === "custom" ? customGoal : null,
          ai_recommendations: null,
          ai_recommendations_at: null,
          career_roadmap: null,
          career_roadmap_at: null,
        },
        { onConflict: "profile_id" }
      );

      if (error) {
        console.error("Career GPS save error:", error);
        return;
      }

      setRoadmap(null);
      setRoadmapAttempted(false);
      setStep("roadmap");
    } finally {
      setSaving(false);
    }
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
