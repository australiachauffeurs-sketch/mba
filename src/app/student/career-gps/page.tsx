"use client";

import { useState, useEffect } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";
import {
  Sparkles, Target, Route, TrendingUp, CheckCircle,
  Loader2, Save, PenLine, Pencil, ArrowRight,
} from "lucide-react";

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

const ROADMAPS: Record<string, { phase: string; label: string; actions: string[] }[]> = {
  founder: [
    { phase: "Month 1–2", label: "Build Your Network", actions: ["Connect with 3 alumni founders", "Join Entrepreneurship Club", "Attend startup pitch events"] },
    { phase: "Month 3–4", label: "Validate Your Idea", actions: ["Define the problem you're solving", "Interview 20 potential customers", "Build a simple MVP or prototype"] },
    { phase: "Month 5–6", label: "Find Co-founders & Team", actions: ["Meet technical co-founder candidates", "Join hackathons to find teammates", "Get faculty advisor for your domain"] },
    { phase: "Month 7–9", label: "Fundraise & Launch", actions: ["Apply to incubators (YC, Antler, etc.)", "Pitch to angel investors through alumni network", "Launch publicly and get first customers"] },
    { phase: "Month 10–12", label: "Scale", actions: ["Raise seed round or bootstrap growth", "Hire your first employees", "Expand to new markets or verticals"] },
  ],
  consultant: [
    { phase: "Month 1–2", label: "Prep & Network", actions: ["Connect with alumni at MBB firms", "Join case prep groups", "Attend consulting firm info sessions"] },
    { phase: "Month 3–4", label: "Case Interview Practice", actions: ["Practice 3 cases per week", "Join consulting club mock interviews", "Read business press daily (FT, HBR)"] },
    { phase: "Month 5–6", label: "Apply for Internships", actions: ["Apply to summer associate roles", "Get referrals through alumni connections", "Prepare personal experience stories"] },
    { phase: "Month 7–9", label: "Intern & Convert", actions: ["Ace your summer internship", "Deliver one standout project", "Build relationships with your team"] },
    { phase: "Month 10–12", label: "Full-time Offer", actions: ["Convert internship to full-time offer", "Choose your practice area / office", "Prepare for Day 1 as a consultant"] },
  ],
  investment_banker: [
    { phase: "Month 1–2", label: "Foundation", actions: ["Master financial modeling basics", "Connect with alumni in IB", "Join Finance Club"] },
    { phase: "Month 3–4", label: "Technical Prep", actions: ["Practice DCF, LBO, M&A modeling", "Learn valuation multiples by industry", "Read deal news (WSJ, Bloomberg)"] },
    { phase: "Month 5–6", label: "Recruiting", actions: ["Apply to bulge bracket summer associate programs", "Prepare pitch books and deal analysis", "Get warm intros through alumni network"] },
    { phase: "Month 7–9", label: "Internship", actions: ["Secure summer associate role", "Work on live M&A or capital markets deal", "Build analyst / MD relationships"] },
    { phase: "Month 10–12", label: "Convert & Close", actions: ["Get full-time return offer", "Choose group (M&A, TMT, Healthcare, etc.)", "Start networking in your target group"] },
  ],
  vc: [
    { phase: "Month 1–2", label: "Learn the Ecosystem", actions: ["Read 'Venture Deals' and 'Zero to One'", "Connect with investor alumni", "Follow 50 VCs and founders on LinkedIn"] },
    { phase: "Month 3–4", label: "Source & Analyse", actions: ["Shadow a VC through alumni connection", "Analyse 10 startups using VC framework", "Write investment memos on 3 companies"] },
    { phase: "Month 5–6", label: "Get Experience", actions: ["Apply for VC internship roles", "Join your school's student investment fund", "Attend Demo Days (YC, Antler, etc.)"] },
    { phase: "Month 7–9", label: "Build Thesis", actions: ["Pick a sector you want to invest in", "Build a deal pipeline spreadsheet", "Refer 1 deal to a VC firm through your network"] },
    { phase: "Month 10–12", label: "Land a Role", actions: ["Apply for Analyst / Associate roles at VC firms", "Get intro through your investor alumni connections", "Showcase your deal pipeline and investment thesis"] },
  ],
  product_manager: [
    { phase: "Month 1–2", label: "Learn PM Fundamentals", actions: ["Read 'Inspired' by Marty Cagan", "Connect with alumni PMs at top tech companies", "Take a free product management course"] },
    { phase: "Month 3–4", label: "Build Skills", actions: ["Learn SQL and basic data analysis", "Do product teardowns of 5 apps you use", "Create a product case study portfolio"] },
    { phase: "Month 5–6", label: "APM Programs", actions: ["Apply to Google APM, Meta RPM, Microsoft PM programs", "Prepare product sense and execution case interviews", "Get referrals from alumni at target companies"] },
    { phase: "Month 7–9", label: "Internship", actions: ["Secure PM internship at tech company", "Ship a feature end-to-end", "Work closely with engineers and designers"] },
    { phase: "Month 10–12", label: "Full-time Role", actions: ["Convert internship or apply broadly", "Choose your domain (consumer, B2B, infra)", "Negotiate offer and start date"] },
  ],
  corporate_strategy: [
    { phase: "Month 1–2", label: "Internal Networking", actions: ["Connect with alumni in strategy roles at Fortune 500", "Research target companies and industries", "Join Strategy & Operations club"] },
    { phase: "Month 3–4", label: "Develop Industry Expertise", actions: ["Pick 2-3 industries to specialize in", "Read 10-Ks and earnings calls of target firms", "Build financial analysis projects"] },
    { phase: "Month 5–6", label: "Apply & Interview", actions: ["Apply to Corporate Strategy / Strategy & Ops roles", "Prepare for case-style interviews", "Get referrals through alumni at target companies"] },
    { phase: "Month 7–9", label: "Internship / Project", actions: ["Complete strategy rotation or internship", "Present analysis to senior leadership", "Work on market entry or M&A project"] },
    { phase: "Month 10–12", label: "Build Career Capital", actions: ["Convert to full-time strategy role", "Work towards VP Strategy or Chief of Staff", "Build network inside your company"] },
  ],
  private_equity: [
    { phase: "Month 1–2", label: "Foundation", actions: ["Master LBO modeling", "Connect with alumni in PE", "Study 5 recent PE deals in depth"] },
    { phase: "Month 3–4", label: "Technical Mastery", actions: ["Build full LBO models from scratch", "Learn deal sourcing and due diligence process", "Practice PE case studies weekly"] },
    { phase: "Month 5–6", label: "Recruiting (Off-cycle)", actions: ["PE recruiting starts early — network aggressively", "Prepare deal experience and investment thesis", "Get warm intros through banking or alumni network"] },
    { phase: "Month 7–9", label: "Process & Interviews", actions: ["Go through PE interview processes", "Prepare 'deal I worked on' stories", "Model a take-home LBO in 3 hours"] },
    { phase: "Month 10–12", label: "Secure Offer", actions: ["Receive PE Associate offer", "Choose between buyout, growth, or credit", "Build relationships with the deal team before Day 1"] },
  ],
  social_impact: [
    { phase: "Month 1–2", label: "Clarify Your Cause", actions: ["Pick the social problem you want to solve", "Connect with alumni in NGOs and impact orgs", "Attend Net Impact club events"] },
    { phase: "Month 3–4", label: "Build Domain Knowledge", actions: ["Research 10 organizations in your cause area", "Learn impact measurement frameworks", "Read SSIR and Stanford Social Innovation Review"] },
    { phase: "Month 5–6", label: "Get Hands-On", actions: ["Apply for social impact internship or fellowship", "Join a Consulting for Good project", "Connect with faculty researching your area"] },
    { phase: "Month 7–9", label: "Build Your Model", actions: ["Define your theory of change", "Explore social enterprise vs. non-profit vs. corporate CSR", "Build financial model for your org or initiative"] },
    { phase: "Month 10–12", label: "Launch or Join", actions: ["Launch your initiative or join a leading impact org", "Apply for Acumen, Echoing Green, or Ashoka fellowships", "Measure and report your early impact"] },
  ],
};

const SKILL_GAPS: Record<string, { skill: string; priority: "High" | "Medium" | "Low" }[]> = {
  founder: [{ skill: "Fundraising & Pitching", priority: "High" }, { skill: "Product Development", priority: "High" }, { skill: "Go-to-Market Strategy", priority: "High" }, { skill: "Financial Modeling", priority: "Medium" }, { skill: "Team Building", priority: "Medium" }],
  consultant: [{ skill: "Case Interview Skills", priority: "High" }, { skill: "Structured Problem Solving", priority: "High" }, { skill: "Slide Deck & Storytelling", priority: "High" }, { skill: "Excel / Data Analysis", priority: "Medium" }, { skill: "Industry Knowledge", priority: "Medium" }],
  investment_banker: [{ skill: "Financial Modeling (DCF/LBO)", priority: "High" }, { skill: "Valuation", priority: "High" }, { skill: "Deal Execution", priority: "High" }, { skill: "Client Management", priority: "Medium" }, { skill: "Bloomberg / CapIQ", priority: "Medium" }],
  vc: [{ skill: "Startup Evaluation", priority: "High" }, { skill: "Investment Thesis Writing", priority: "High" }, { skill: "Deal Sourcing", priority: "High" }, { skill: "Term Sheet Negotiation", priority: "Medium" }, { skill: "Portfolio Management", priority: "Low" }],
  product_manager: [{ skill: "Product Sense", priority: "High" }, { skill: "SQL / Analytics", priority: "High" }, { skill: "User Research", priority: "High" }, { skill: "Technical Communication", priority: "Medium" }, { skill: "Roadmap Prioritization", priority: "Medium" }],
  corporate_strategy: [{ skill: "Strategic Analysis", priority: "High" }, { skill: "Financial Modeling", priority: "High" }, { skill: "Executive Communication", priority: "High" }, { skill: "Industry Research", priority: "Medium" }, { skill: "Project Management", priority: "Low" }],
  private_equity: [{ skill: "LBO Modeling", priority: "High" }, { skill: "Due Diligence", priority: "High" }, { skill: "Deal Sourcing", priority: "High" }, { skill: "Portfolio Operations", priority: "Medium" }, { skill: "Debt Structuring", priority: "Medium" }],
  social_impact: [{ skill: "Impact Measurement", priority: "High" }, { skill: "Grant Writing", priority: "High" }, { skill: "Theory of Change", priority: "High" }, { skill: "Stakeholder Management", priority: "Medium" }, { skill: "Social Enterprise Finance", priority: "Medium" }],
};

const priorityColor = { High: "bg-red-100 text-red-700", Medium: "bg-amber-100 text-amber-700", Low: "bg-green-100 text-green-700" };

export default function CareerGPSPage() {
  const [step, setStep] = useState<"select" | "roadmap">("select");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [customGoal, setCustomGoal] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: sp } = await supabase.from("student_profiles").select("career_goal, custom_career_goal").eq("id", user.id).single();
      if (sp?.career_goal) {
        setSelectedGoal(sp.career_goal);
        if (sp.career_goal === "custom") setShowCustom(true);
        setStep("roadmap"); // already has a goal → skip to roadmap
      }
      if (sp?.custom_career_goal) {
        setCustomGoal(sp.custom_career_goal);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("student_profiles").upsert({
      id: user.id,
      career_goal: selectedGoal,
      custom_career_goal: selectedGoal === "custom" ? customGoal : null,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    setStep("roadmap");
  }

  const roadmap = ROADMAPS[selectedGoal] || [];
  const skillGaps = SKILL_GAPS[selectedGoal] || [];
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
          {/* Step indicator */}
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
                What's your career goal after MBA?
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">Choose one — AI will build your personalized 12-month action plan.</p>
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
                      {selectedGoal === goal.id && (
                        <CheckCircle className="w-4 h-4 text-indigo-500 ml-auto flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                  </button>
                ))}

                {/* Custom goal */}
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
                    {selectedGoal === "custom" && (
                      <CheckCircle className="w-4 h-4 text-indigo-500 ml-auto flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                </button>
              </div>

              {/* Custom text input */}
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

              {/* CTA */}
              <div className="pt-2">
                <Button
                  size="lg"
                  onClick={handleSave}
                  disabled={!selectedGoal || saving || (selectedGoal === "custom" && !customGoal.trim())}
                  className="gap-2"
                >
                  {saving
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating roadmap…</>
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
          </div>
          <Button variant="outline" size="sm" onClick={() => setStep("select")} className="gap-1.5">
            <Pencil className="w-3.5 h-3.5" /> Change Goal
          </Button>
        </div>

        {/* Roadmap banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">{goalEmoji}</div>
            <div>
              <h2 className="text-xl font-bold mb-1">Your 12-Month Roadmap</h2>
              <p className="opacity-80 text-sm leading-relaxed max-w-2xl">
                {selectedGoal === "custom"
                  ? `Customized plan for: "${goalLabel}". Use this as a framework and adapt each step to your specific path.`
                  : `AI has mapped every step of your MBA journey toward becoming a ${goalLabel} — mentors, skills, internships, and key milestones.`}
              </p>
              <div className="flex gap-3 mt-4">
                <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                  <div className="text-2xl font-bold">{roadmap.length || 5}</div>
                  <div className="text-xs opacity-80">Phases</div>
                </div>
                <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                  <div className="text-2xl font-bold">{skillGaps.filter(s => s.priority === "High").length || 3}</div>
                  <div className="text-xs opacity-80">Priority skills</div>
                </div>
                <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-xs opacity-80">Month plan</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Roadmap phases */}
          <div className="col-span-2 space-y-3">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Route className="w-4 h-4 text-indigo-500" /> Action Plan
            </h2>
            {roadmap.length > 0 ? roadmap.map((phase, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${i === 0 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">{phase.phase}</span>
                        <span className="font-semibold text-slate-900">{phase.label}</span>
                        {i === 0 && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">Start here</span>}
                      </div>
                      <ul className="space-y-1.5">
                        {phase.actions.map(action => (
                          <li key={action} className="text-sm text-slate-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0" />
                            {action}
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
                  <p className="text-sm font-medium text-slate-700">Custom roadmap</p>
                  <p className="text-sm text-slate-500 mt-1">Your personalized steps will appear here as AI matches you with the right mentors and opportunities.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Skill gaps */}
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
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${priorityColor[s.priority]}`}>
                      {s.priority}
                    </span>
                  </div>
                )) : (
                  <p className="text-sm text-slate-500">Skill analysis will populate as your profile grows.</p>
                )}
              </CardContent>
            </Card>

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
      </main>
    </>
  );
}
