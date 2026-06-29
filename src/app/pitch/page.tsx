import Link from "next/link";
import {
  Sparkles, ArrowRight, TrendingUp, Users, Brain, Zap,
  CheckCircle, Star, Building2, GraduationCap, Network,
  BarChart2, Clock, Globe, Shield, ChevronRight,
} from "lucide-react";

/* ─────────────────────────────────────────── */

const problems = [
  { stat: "73%",  label: "of MBA students say their university network is \"mostly useless\" after graduation" },
  { stat: "6mo",  label: "average time an MBA student spends cold-emailing before getting one meaningful reply" },
  { stat: "40%",  label: "of alumni disengage from their university within 2 years of graduating" },
  { stat: "$0",   label: "return on the average alumni database — paid for but never leveraged" },
];

const outcomes = [
  { value: "5×",     label: "more alumni engagement",      color: "text-indigo-400" },
  { value: "3×",     label: "faster student job placement", color: "text-violet-400" },
  { value: "10×",    label: "more mentor connections",      color: "text-purple-400" },
  { value: "100%",   label: "automated matching — zero admin", color: "text-pink-400" },
];

const features = [
  {
    emoji: "🗺️",
    title: "AI Career GPS",
    desc: "Every student gets a personalised 5-phase career roadmap — naming real alumni in your network at every step. No more generic career advice.",
    wow: "Names your alumni by name. Specific. Personal. Actionable.",
  },
  {
    emoji: "🤖",
    title: "AI Matchmaking Engine",
    desc: "Semantic vector matching across 50+ profile signals. The system knows which alumni to introduce to which student before either of them asks.",
    wow: "Not keyword search. Actual intelligence.",
  },
  {
    emoji: "✉️",
    title: "Auto Introduction Writer",
    desc: "Personalised, two-sided introduction emails written by AI — referencing both profiles, the shared goal, and the best time to connect.",
    wow: "Cold email, solved. Forever.",
  },
  {
    emoji: "⚡",
    title: "Daily Enrichment Cron",
    desc: "Every morning at 9 AM, AI scans new opportunities and adds goal-matched ones to every student's Career GPS. Automatically.",
    wow: "Your career centre, running 24/7.",
  },
  {
    emoji: "📊",
    title: "University Analytics",
    desc: "Real-time engagement scores, hiring outcomes, mentor session counts, and alumni activity — the metrics accreditors actually want to see.",
    wow: "Finally, data that proves your department's value.",
  },
  {
    emoji: "🏆",
    title: "Alumni Reactivation",
    desc: "AI identifies dormant alumni, personalises outreach, and surfaces mentoring, hiring, and investment opportunities that match their profile.",
    wow: "Dead alumni database → active network in 30 days.",
  },
];

const roles = [
  { icon: GraduationCap, label: "Students",      sub: "Career GPS + mentor matching",   color: "bg-indigo-500" },
  { icon: Users,         label: "Alumni",         sub: "Mentoring + hiring + startups", color: "bg-purple-500" },
  { icon: Brain,         label: "Faculty",        sub: "Research + industry partners",  color: "bg-green-500"  },
  { icon: TrendingUp,    label: "Investors",      sub: "Deal flow + founder discovery", color: "bg-amber-500"  },
  { icon: Building2,     label: "Organisations",  sub: "Jobs + events + talent",        color: "bg-teal-500"   },
];

const accreditation = [
  "Real-time alumni engagement rate",
  "Mentor session volume & outcomes",
  "Student placement timelines",
  "Network growth month-over-month",
  "Research collaboration tracking",
  "Industry partnership pipeline",
];

const timeline = [
  { day: "Day 1",   text: "Platform live. All 5 portals activated. AI agents running." },
  { day: "Week 1",  text: "First AI-matched introductions sent. Students get Career GPS roadmaps." },
  { day: "Month 1", text: "Alumni reactivated. Opportunities flowing. Analytics dashboard live." },
  { day: "Month 3", text: "Measurable placement improvement. Accreditation data ready." },
];

/* ─────────────────────────────────────────── */

export default function PitchPage() {
  return (
    <div className="min-h-screen bg-[#080810] text-white overflow-x-hidden">

      {/* ── Tiny nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#080810]/80 backdrop-blur border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm">UniConnect AI</span>
        </div>
        <Link
          href="/auth/signup"
          className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-1.5"
        >
          Request Demo <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </nav>

      {/* ════════════════════════════════════════
          SLIDE 1 — OPENING HOOK
      ════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
        {/* Grid bg */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:60px_60px]" />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]" />

        <div className="relative max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Confidential · For MBA Department Leadership
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
            Your MBA network<br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              is broken.
            </span><br />
            We fixed it.
          </h1>

          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-10">
            UniConnect AI is the first AI operating system built specifically for university ecosystems — turning your dormant alumni database into a living, breathing network that works for every student, every day.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/auth/signup" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl transition flex items-center justify-center gap-2 text-sm">
              Request a Live Demo <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/guide" className="w-full sm:w-auto border border-white/10 text-white/60 hover:text-white hover:border-white/20 font-semibold px-8 py-4 rounded-xl transition flex items-center justify-center gap-2 text-sm">
              <Star className="w-4 h-4" /> Platform Overview
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 text-xs">
          <span>Scroll to see the full story</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* ════════════════════════════════════════
          SLIDE 2 — THE PROBLEM
      ════════════════════════════════════════ */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-3">The Reality Check</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              The data is <span className="text-red-400">painful.</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">Every MBA department is sitting on an untapped goldmine — and doing nothing with it.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {problems.map((p) => (
              <div key={p.stat} className="bg-white/3 border border-white/8 rounded-2xl p-7 hover:border-red-500/30 transition group">
                <div className="text-5xl sm:text-6xl font-black text-red-400 mb-3 group-hover:scale-105 transition-transform">{p.stat}</div>
                <p className="text-white/60 text-sm leading-relaxed">{p.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-red-500/5 border border-red-500/20 rounded-2xl p-6 text-center">
            <p className="text-white/80 text-base sm:text-lg font-medium">
              Your department invested <span className="text-red-400 font-bold">years</span> building alumni relationships.<br />
              Your students need them <span className="text-red-400 font-bold">now.</span><br />
              <span className="text-white/40 text-sm mt-2 block">The gap between them? That&apos;s what we close.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SLIDE 3 — THE SOLUTION
      ════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent relative">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">The Solution</p>
          <h2 className="text-4xl sm:text-5xl font-black mb-6">
            One platform.<br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">7 AI agents. Infinite connections.</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto mb-16 text-base">
            UniConnect AI runs continuously inside your department — learning, matching, introducing, and enriching every profile in your network. Zero extra admin. Zero spreadsheets.
          </p>

          {/* Big quote */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-left mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center gap-2 mb-5 relative">
              <Sparkles className="w-5 h-5 text-white/70" />
              <span className="text-white/60 text-sm font-medium">Example — AI in action inside your department</span>
            </div>
            <blockquote className="text-xl sm:text-2xl font-semibold leading-relaxed relative text-white">
              &ldquo;A second-year student sets a goal: <strong>fintech founder</strong>. Instantly, the AI identifies 3 alumni who built fintech companies, 2 investors in the network who back fintech, and 1 professor researching digital payments. It writes personalised intro emails and sends them — all before the student finishes their morning coffee.&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center gap-2 relative">
              <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span className="text-white/60 text-sm">This is not a search bar. This is an AI advocate for every student.</span>
            </div>
          </div>

          {/* 5 roles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.label} className="bg-white/3 border border-white/8 rounded-2xl p-5 text-center hover:bg-white/5 transition">
                  <div className={`w-10 h-10 ${r.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-white font-bold text-sm">{r.label}</p>
                  <p className="text-white/40 text-xs mt-1 leading-snug">{r.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SLIDE 4 — OUTCOMES
      ════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-green-400 mb-3">What You Get</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white">
              Numbers your Dean<br /><span className="text-green-400">will frame on the wall.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {outcomes.map((o) => (
              <div key={o.label} className="bg-white/3 border border-white/8 rounded-2xl p-6 text-center hover:border-white/15 transition">
                <div className={`text-5xl sm:text-6xl font-black mb-2 ${o.color}`}>{o.value}</div>
                <p className="text-white/50 text-xs sm:text-sm leading-snug">{o.label}</p>
              </div>
            ))}
          </div>

          {/* Accreditation */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-7">
            <div className="flex items-center gap-2 mb-5">
              <BarChart2 className="w-5 h-5 text-indigo-400" />
              <p className="font-bold text-white">Accreditation-Ready Analytics</p>
              <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full ml-auto">Built in</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {accreditation.map((a) => (
                <div key={a} className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-white/60 text-sm">{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SLIDE 5 — 6 KEY FEATURES
      ════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent via-violet-950/15 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">The Features</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Six things your department<br />has never had. Until now.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={f.title} className="group bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{f.emoji}</span>
                  <span className="text-xs text-white/20 font-mono">0{i + 1}</span>
                </div>
                <h3 className="font-bold text-white text-base mb-2">{f.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed mb-4">{f.desc}</p>
                <div className="border-t border-white/5 pt-4">
                  <p className="text-indigo-400 text-xs font-semibold">{f.wow}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SLIDE 6 — IMPLEMENTATION
      ════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-3">Go Live</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              From zero to AI-powered<br /><span className="text-teal-400">in 30 days.</span>
            </h2>
            <p className="text-white/40 max-w-lg mx-auto">No IT project. No 18-month rollout. No procurement nightmare.</p>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-[28px] top-8 bottom-8 w-px bg-gradient-to-b from-indigo-500 via-violet-500 to-teal-500 hidden sm:block" />

            <div className="space-y-5">
              {timeline.map((t, i) => (
                <div key={t.day} className="flex gap-5 items-start">
                  <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 relative z-10">
                    <span className="text-xs font-black text-white/60">{i + 1}</span>
                  </div>
                  <div className="flex-1 bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-white/15 transition">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">{t.day}</span>
                    <p className="text-white/70 text-sm mt-1 leading-relaxed">{t.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What's included */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Globe,   title: "Cloud-hosted",    sub: "No servers. No IT tickets." },
              { icon: Shield,  title: "Secure by design", sub: "RLS, SSR auth, GDPR-ready" },
              { icon: Clock,   title: "Always-on AI",    sub: "7 agents running 24/7" },
            ].map((i) => {
              const Icon = i.icon;
              return (
                <div key={i.title} className="bg-white/3 border border-white/8 rounded-xl p-5 text-center">
                  <Icon className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                  <p className="text-white font-semibold text-sm">{i.title}</p>
                  <p className="text-white/40 text-xs mt-1">{i.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SLIDE 7 — THE ASK
      ════════════════════════════════════════ */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/40 to-[#080810]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-600/15 rounded-full blur-[100px]" />

        <div className="max-w-3xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            The Decision
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Your students are networking<br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              the hard way.
            </span><br />
            Every single day.
          </h2>

          <p className="text-white/40 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Every day without UniConnect AI is another day of cold emails, missed connections, and alumni who drift further away. The cost of waiting is measured in careers.
          </p>

          {/* The ask box */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-10 mb-10">
            <p className="text-white/30 text-xs uppercase tracking-widest mb-4">What we&apos;re asking for</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-6">
              {[
                { value: "30",    unit: "minutes",  label: "for a live demo" },
                { value: "30",    unit: "days",     label: "pilot program" },
                { value: "Zero",  unit: "",         label: "IT resources needed" },
              ].map((a) => (
                <div key={a.label}>
                  <div className="text-4xl font-black text-white">{a.value} <span className="text-indigo-400 text-2xl">{a.unit}</span></div>
                  <p className="text-white/40 text-sm mt-1">{a.label}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-white/5 pt-6">
              <p className="text-white/50 text-sm">
                We&apos;ll set up the full platform for your department. You&apos;ll see real results in 30 days — or we walk away. No contracts until you&apos;re convinced.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black px-10 py-4 rounded-xl transition text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30"
            >
              Book a 30-Minute Demo <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/guide"
              className="w-full sm:w-auto border border-white/10 text-white/60 hover:text-white hover:border-white/20 font-semibold px-8 py-4 rounded-xl transition text-sm flex items-center justify-center gap-2"
            >
              Explore the Platform <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-white/20 text-xs mt-8">
            UniConnect AI · Built for MBA Ecosystems · Powered by Next.js, Supabase & OpenAI
          </p>
        </div>
      </section>

    </div>
  );
}
