import Link from "next/link";
import {
  Sparkles, ArrowRight, TrendingUp, Users, Brain, Zap,
  CheckCircle, Star, Building2, GraduationCap, Network,
  BarChart2, Clock, Globe, Shield, ChevronRight,
  Trophy, Lightbulb, Heart, Target, BookOpen, Rocket,
  FlaskConical, MessageSquare, Calendar, MapPin,
} from "lucide-react";

/* ─── Data ─────────────────────────────────── */

const problems = [
  { stat: "73%",  label: "of MBA graduates say their university network became \"irrelevant\" within 3 years of graduation" },
  { stat: "6 mo", label: "average time students spend cold-emailing before landing one meaningful industry connection" },
  { stat: "40%",  label: "of alumni disengage from their university within 2 years — taking their network with them" },
  { stat: "$0",   label: "measurable return on the average alumni database — maintained at cost, but never monetised" },
];

const outcomes = [
  { value: "5×",   label: "more alumni engagement",       color: "indigo" },
  { value: "3×",   label: "faster student job placement", color: "violet" },
  { value: "10×",  label: "more mentor connections",      color: "purple" },
  { value: "100%", label: "automated — zero admin load",  color: "green"  },
];

const features = [
  {
    emoji: "🗺️", title: "AI Career GPS",
    desc: "Every student gets a personalised 5-phase roadmap naming real alumni at every career milestone — not generic advice, but specific, actionable introductions.",
    wow: "Names your alumni by name. Specific. Personal. Actionable.",
    color: "indigo",
  },
  {
    emoji: "🤖", title: "AI Matchmaking Engine",
    desc: "Semantic vector matching across 50+ profile signals surfaces the most relevant alumni, investors, and mentors for each student — before they even ask.",
    wow: "Not keyword search. Actual intelligence.",
    color: "violet",
  },
  {
    emoji: "✉️", title: "Auto Introduction Writer",
    desc: "Personalised, two-sided intro emails written by AI — referencing both profiles, the shared goal, and the right framing for a warm connection.",
    wow: "Cold email, solved forever.",
    color: "purple",
  },
  {
    emoji: "⚡", title: "Daily Enrichment Cron",
    desc: "Every morning at 9 AM, AI scans new jobs, research, and events — automatically adding goal-matched opportunities to every student's Career GPS.",
    wow: "Your career centre, running 24/7 without extra headcount.",
    color: "amber",
  },
  {
    emoji: "📊", title: "Accreditation Analytics",
    desc: "Real-time engagement scores, placement timelines, mentor session counts, and alumni activity — the exact metrics AACSB and EQUIS want to see.",
    wow: "Data that proves your department's value every single term.",
    color: "teal",
  },
  {
    emoji: "🏆", title: "Alumni Reactivation",
    desc: "AI identifies dormant alumni, personalises outreach, and surfaces mentoring, hiring, and investment opportunities matched to their career profile.",
    wow: "Dead alumni database → active network in 30 days.",
    color: "green",
  },
];

const roles = [
  { icon: GraduationCap, label: "Students",      sub: "Career GPS, mentors, co-founders", color: "bg-indigo-600" },
  { icon: Users,         label: "Alumni",         sub: "Mentoring, hiring, startups",      color: "bg-purple-600" },
  { icon: FlaskConical,  label: "Faculty",        sub: "Research, industry partners",      color: "bg-green-600"  },
  { icon: TrendingUp,    label: "Investors",      sub: "Deal flow, founder discovery",     color: "bg-amber-500"  },
  { icon: Building2,     label: "Organisations",  sub: "Jobs, events, MBA talent",         color: "bg-teal-600"   },
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
  { day: "Day 1",   icon: Rocket,    color: "bg-indigo-600", text: "Platform live. All 5 portals activated. AI agents running across student, alumni, faculty, investor, and organisation roles." },
  { day: "Week 1",  icon: Sparkles,  color: "bg-violet-600", text: "First AI-matched introductions sent. Students receive personalised Career GPS roadmaps naming real alumni at every career stage." },
  { day: "Month 1", icon: Network,   color: "bg-purple-600", text: "Alumni reactivated. Opportunities flowing. Analytics dashboard shows measurable engagement growth." },
  { day: "Month 3", icon: BarChart2, color: "bg-green-600",  text: "Measurable placement improvement visible. Accreditation-ready data export available for your next review." },
];

const admissionEdge = [
  {
    icon: Trophy,
    title: "The #1 Reason Students Choose Your MBA",
    body: "Prospective students don't choose an MBA for the curriculum alone — every school teaches DCF, Porter's Five Forces, and leadership. They choose the MBA that will open the right doors. UniConnect makes your doors visible, tangible, and provably open.",
    color: "indigo",
  },
  {
    icon: Target,
    title: "Win Against Every Other Specialisation",
    body: "Engineering students get labs. Medical students get hospitals. Finance students get Bloomberg terminals. MBA students get… a LinkedIn tip? UniConnect gives your MBA the infrastructure that competing specialisations can only dream of.",
    color: "violet",
  },
  {
    icon: Lightbulb,
    title: "The Pitch That Fills Your Intake",
    body: "Imagine telling prospects: \"Our alumni are matched to you by AI before you even enrol. Your mentor is already identified. Your first warm introduction is waiting.\" That's not a brochure claim — it's a live demonstration.",
    color: "purple",
  },
  {
    icon: Heart,
    title: "Students Who Feel Supported Stay & Refer",
    body: "Retention, completion rates, and word-of-mouth referrals all spike when students feel genuinely connected. UniConnect turns every student into a walking testimonial for your department.",
    color: "green",
  },
];

const networkStats = [
  { stat: "85%", desc: "of jobs are filled through personal connections, not job boards" },
  { stat: "70%", desc: "of MBA graduates credit their network — not their degree — for their biggest career leap" },
  { stat: "3×",  desc: "higher starting salary when you join through a warm referral vs. a cold application" },
  { stat: "92%", desc: "of hiring managers say they trust referred candidates significantly more than applicants" },
];

const degreeVsNetwork = [
  { side: "The Degree Alone",  items: ["Teaches theory and frameworks", "Credentials on a CV", "Expires in relevance over time", "Same for every graduate", "Works once at graduation"], bad: true  },
  { side: "Degree + UniConnect", items: ["Theory + real-world connections", "Credentials AND warm introductions", "Network compounds over a lifetime", "Personalised to each student's goal", "Works every day, forever"], bad: false },
];

const colorMap: Record<string, { bg: string; text: string; light: string; border: string }> = {
  indigo: { bg: "bg-indigo-600", text: "text-indigo-600", light: "bg-indigo-50", border: "border-indigo-200" },
  violet: { bg: "bg-violet-600", text: "text-violet-600", light: "bg-violet-50", border: "border-violet-200" },
  purple: { bg: "bg-purple-600", text: "text-purple-600", light: "bg-purple-50", border: "border-purple-200" },
  amber:  { bg: "bg-amber-500",  text: "text-amber-600",  light: "bg-amber-50",  border: "border-amber-200"  },
  teal:   { bg: "bg-teal-600",   text: "text-teal-600",   light: "bg-teal-50",   border: "border-teal-200"   },
  green:  { bg: "bg-green-600",  text: "text-green-600",  light: "bg-green-50",  border: "border-green-200"  },
};

/* ─── Page ──────────────────────────────────── */

export default function PitchPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm">UniConnect <span className="text-indigo-600">AI</span></span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline text-xs text-slate-400 border border-slate-200 px-3 py-1.5 rounded-full">Confidential · For MBA Leadership</span>
            <Link href="/auth/signup" className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-1.5">
              Request Demo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          SLIDE 1 — OPENING HOOK
      ══════════════════════════════════════ */}
      <section className="relative pt-14 min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 overflow-hidden">
        {/* Soft gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-violet-50" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-100/60 rounded-full blur-[100px]" />

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8 shadow-lg shadow-indigo-200">
            <Sparkles className="w-3.5 h-3.5" />
            A message for the ED of MBA Department
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.05] mb-6 tracking-tight text-slate-900">
            Your MBA degree opens<br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              one door.
            </span><br />
            Your network opens<br className="hidden sm:block" />
            <span className="text-slate-900">every door that follows.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10 px-2">
            UniConnect AI is the first AI operating system built specifically for MBA departments — turning your alumni database, faculty network, and student ambitions into a living, compounding ecosystem that works every single day.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/auth/signup" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-indigo-200">
              Book a 30-Minute Demo <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/guide" className="w-full sm:w-auto border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold px-8 py-4 rounded-xl transition flex items-center justify-center gap-2 text-sm">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Platform Overview
            </Link>
          </div>

          {/* Stat bar */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { v: "5 Roles",   l: "On one platform"     },
              { v: "7 Agents",  l: "AI running 24/7"     },
              { v: "30 Days",   l: "To see results"      },
              { v: "Zero",      l: "Extra admin needed"   },
            ].map(s => (
              <div key={s.l} className="bg-white border border-slate-200 rounded-2xl py-4 px-3 text-center shadow-sm">
                <div className="text-xl sm:text-2xl font-black text-indigo-600">{s.v}</div>
                <div className="text-xs text-slate-400 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-300 text-xs">
          <span>Scroll to read the full case</span>
          <div className="w-px h-8 bg-gradient-to-b from-slate-300 to-transparent" />
        </div>
      </section>

      {/* ══════════════════════════════════════
          SLIDE 2 — THE TRUTH ABOUT DEGREES
      ══════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full mb-4">The Uncomfortable Truth</span>
            <h2 className="text-3xl sm:text-5xl font-black mb-4">
              The degree is the <span className="text-indigo-400">ticket.</span><br />
              The network is the <span className="text-violet-400">journey.</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-sm sm:text-base">
              Employers no longer differentiate between MBA programmes on curriculum alone. What they ask is: <em className="text-white/80">"Who does this person know, and who vouches for them?"</em>
            </p>
          </div>

          {/* Network stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {networkStats.map(s => (
              <div key={s.stat} className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 text-center hover:border-indigo-500/40 transition group">
                <div className="text-4xl sm:text-5xl font-black text-indigo-400 mb-2 group-hover:scale-105 transition-transform">{s.stat}</div>
                <p className="text-white/50 text-xs sm:text-sm leading-snug">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Degree vs Network comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {degreeVsNetwork.map(d => (
              <div key={d.side} className={`rounded-2xl p-6 border ${d.bad ? "bg-white/3 border-white/8" : "bg-indigo-600/20 border-indigo-500/30"}`}>
                <div className={`flex items-center gap-2 mb-5`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${d.bad ? "bg-white/10" : "bg-indigo-500"}`}>
                    {d.bad ? <BookOpen className="w-4 h-4 text-white/50" /> : <Sparkles className="w-4 h-4 text-white" />}
                  </div>
                  <h3 className={`font-bold text-sm ${d.bad ? "text-white/50" : "text-white"}`}>{d.side}</h3>
                </div>
                <ul className="space-y-2.5">
                  {d.items.map(item => (
                    <li key={item} className="flex items-start gap-2.5">
                      {d.bad
                        ? <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 mt-0.5"><div className="w-1.5 h-1.5 bg-white/20 rounded-full" /></div>
                        : <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      }
                      <span className={`text-sm leading-snug ${d.bad ? "text-white/40" : "text-white/80"}`}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-6 text-center">
            <p className="text-white/80 text-base sm:text-lg font-medium leading-relaxed">
              <span className="text-indigo-400 font-bold">The master's degree</span> gives students the credential.<br />
              <span className="text-violet-400 font-bold">The connections and network</span> give students the worth that the future actually demands.<br />
              <span className="text-white/40 text-sm mt-2 block">UniConnect AI delivers both — and makes your department the proof.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SLIDE 3 — THE PROBLEM
      ══════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-red-500 bg-red-50 border border-red-100 px-3 py-1 rounded-full mb-4">The Reality Check</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4">
              The data is <span className="text-red-500">uncomfortable.</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">Every MBA department is sitting on an untapped goldmine — and inadvertently doing nothing with it.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {problems.map(p => (
              <div key={p.stat} className="border border-red-100 bg-red-50 rounded-2xl p-7 hover:border-red-200 hover:shadow-md transition group">
                <div className="text-5xl sm:text-6xl font-black text-red-500 mb-3 group-hover:scale-105 transition-transform">{p.stat}</div>
                <p className="text-slate-500 text-sm leading-relaxed">{p.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 text-center">
            <p className="text-base sm:text-lg font-medium leading-relaxed">
              Your department invested <span className="text-indigo-400 font-bold">years</span> building alumni relationships.<br />
              Your students need those relationships <span className="text-violet-400 font-bold">now.</span><br />
              <span className="text-white/40 text-sm mt-2 block">The gap between them? That's exactly what UniConnect AI closes — automatically.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SLIDE 4 — ADMISSION ADVANTAGE
      ══════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-100 border border-indigo-200 px-3 py-1 rounded-full mb-4">Admissions Advantage</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4">
              Why students will choose<br />
              <span className="text-indigo-600">your MBA over every other course.</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              When every specialisation competes for the same top students, the department that offers the most tangible career infrastructure wins — every intake, every year.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            {admissionEdge.map(a => {
              const Icon = a.icon;
              const c = colorMap[a.color];
              return (
                <div key={a.title} className={`bg-white border ${c.border} rounded-2xl p-6 hover:shadow-lg transition-all group`}>
                  <div className={`w-11 h-11 ${c.light} ${c.text} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{a.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{a.body}</p>
                </div>
              );
            })}
          </div>

          {/* The pitch students hear */}
          <div className="bg-indigo-600 text-white rounded-3xl p-7 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
            <div className="flex items-center gap-2 mb-4 relative">
              <Sparkles className="w-5 h-5 text-white/70" />
              <span className="text-white/60 text-sm">What you can tell every prospective student</span>
            </div>
            <blockquote className="text-xl sm:text-2xl font-bold leading-relaxed relative mb-5 text-white">
              &ldquo;Before your first lecture, our AI has already identified which alumni are most aligned with your career goal, which investors in our network back your target industry, and which professor is doing research you could contribute to. Your network is ready on day one.&rdquo;
            </blockquote>
            <div className="flex flex-wrap gap-3 relative">
              {["Day-one network", "Named mentors", "AI-matched investors", "Research connections"].map(tag => (
                <span key={tag} className="text-xs bg-white/15 border border-white/20 px-3 py-1.5 rounded-full font-medium">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SLIDE 5 — THE SOLUTION
      ══════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full mb-4">The Solution</span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4">
            One platform. 5 roles.<br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">7 AI agents. Infinite connections.</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-14 text-sm sm:text-base">
            UniConnect AI learns your department's ecosystem and runs continuously — matching, introducing, enriching, and connecting every stakeholder with zero extra admin.
          </p>

          {/* AI insight example */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-7 sm:p-10 text-left mb-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="flex items-center gap-2 mb-5 relative">
              <Sparkles className="w-5 h-5 text-white/70" />
              <span className="text-white/60 text-sm font-medium">AI in action — inside your department, right now</span>
            </div>
            <blockquote className="text-lg sm:text-2xl font-semibold leading-relaxed relative text-white mb-5">
              &ldquo;A second-year student sets their goal: <strong>fintech founder</strong>. Immediately, the AI identifies 3 alumni who built fintech companies, 2 investors in the network who back fintech startups, and 1 professor researching digital payments — and writes personalised warm introduction emails to all five. Automatically.&rdquo;
            </blockquote>
            <div className="flex items-center gap-2 relative">
              <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span className="text-white/60 text-sm">This is not a search bar. This is a 24/7 advocate for every student in your department.</span>
            </div>
          </div>

          {/* 5 roles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {roles.map(r => {
              const Icon = r.icon;
              return (
                <div key={r.label} className="bg-white border border-slate-200 rounded-2xl p-5 text-center hover:shadow-md hover:-translate-y-1 transition-all group">
                  <div className={`w-10 h-10 ${r.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-slate-900 font-bold text-sm">{r.label}</p>
                  <p className="text-slate-400 text-xs mt-1 leading-snug">{r.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SLIDE 6 — OUTCOMES
      ══════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full mb-4">What You Get</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4">
              Numbers your Dean<br /><span className="text-green-600">will frame on the wall.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {outcomes.map(o => {
              const c = colorMap[o.color];
              return (
                <div key={o.label} className={`bg-white border ${c.border} rounded-2xl p-5 sm:p-6 text-center hover:shadow-md transition group`}>
                  <div className={`text-4xl sm:text-5xl font-black mb-2 ${c.text} group-hover:scale-105 transition-transform`}>{o.value}</div>
                  <p className="text-slate-500 text-xs sm:text-sm leading-snug">{o.label}</p>
                </div>
              );
            })}
          </div>

          {/* Accreditation */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <BarChart2 className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Accreditation-Ready Analytics Dashboard</p>
                <p className="text-slate-400 text-xs">AACSB · EQUIS · AMBA — every metric, live</p>
              </div>
              <span className="ml-auto text-xs bg-green-50 text-green-600 border border-green-200 px-2.5 py-1 rounded-full font-semibold flex-shrink-0">Built in</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {accreditation.map(a => (
                <div key={a} className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-slate-600 text-sm">{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SLIDE 7 — 6 KEY FEATURES
      ══════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full mb-4">The Features</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4">
              Six things your department<br />has never had. Until now.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const c = colorMap[f.color];
              return (
                <div key={f.title} className={`group bg-white border ${c.border} rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all`}>
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{f.emoji}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.light} ${c.text}`}>0{i + 1}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{f.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4">{f.desc}</p>
                  <div className={`border-t ${c.border} pt-3`}>
                    <p className={`${c.text} text-xs font-semibold`}>{f.wow}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SLIDE 8 — IMPLEMENTATION
      ══════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal-600 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full mb-4">Go Live</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4">
              Zero to AI-powered<br /><span className="text-teal-600">in 30 days.</span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base">No IT project. No 18-month rollout. No budget committee.</p>
          </div>

          <div className="space-y-4 mb-10">
            {timeline.map((t, i) => {
              const Icon = t.icon;
              return (
                <div key={t.day} className="flex gap-4 items-start">
                  <div className={`w-12 h-12 ${t.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 hover:border-indigo-200 hover:shadow-sm transition">
                    <span className={`text-xs font-black uppercase tracking-wide ${colorMap[["indigo","violet","purple","green"][i]].text}`}>{t.day}</span>
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed">{t.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Globe,  title: "Cloud-hosted",     sub: "No servers. No IT tickets." },
              { icon: Shield, title: "Secure by design",  sub: "RLS, SSR auth, GDPR-ready"  },
              { icon: Clock,  title: "Always-on AI",     sub: "7 agents running 24/7"       },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white border border-slate-200 rounded-xl p-5 text-center hover:shadow-sm transition">
                  <div className="w-9 h-9 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <p className="text-slate-900 font-semibold text-sm">{item.title}</p>
                  <p className="text-slate-400 text-xs mt-1">{item.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SLIDE 9 — THE ASK
      ══════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />

        <div className="max-w-3xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            The Decision
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Every day without UniConnect<br />
            is a day your students<br />
            <span className="text-yellow-300">network the hard way.</span>
          </h2>

          <p className="text-white/70 text-sm sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Cold emails. LinkedIn requests from strangers. Career fairs with 300 other students. The cost of waiting is measured in careers — and in admissions to competing departments that offer more.
          </p>

          {/* The ask */}
          <div className="bg-white/10 border border-white/15 rounded-3xl p-7 sm:p-10 mb-10 text-left">
            <p className="text-white/50 text-xs uppercase tracking-widest text-center mb-6">What we&apos;re asking for</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-8">
              {[
                { value: "30",   unit: "minutes", label: "for a live demo" },
                { value: "30",   unit: "days",    label: "pilot program"   },
                { value: "Zero", unit: "",         label: "IT resources"   },
              ].map(a => (
                <div key={a.label}>
                  <div className="text-4xl sm:text-5xl font-black text-white">
                    {a.value} <span className="text-yellow-300 text-2xl">{a.unit}</span>
                  </div>
                  <p className="text-white/50 text-sm mt-1">{a.label}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-6 text-center">
              <p className="text-white/60 text-sm leading-relaxed">
                We set up the full platform for your department. You see real results in 30 days — or we walk away. No contracts until you are completely convinced.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup" className="w-full sm:w-auto bg-white text-indigo-700 hover:bg-indigo-50 font-black px-10 py-4 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-xl shadow-black/20">
              Book a 30-Minute Demo <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/guide" className="w-full sm:w-auto border border-white/20 text-white/70 hover:text-white hover:border-white/40 font-semibold px-8 py-4 rounded-xl transition text-sm flex items-center justify-center gap-2">
              Explore the Platform <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-white/30 text-xs mt-10">
            UniConnect AI · Built for MBA Ecosystems · Powered by Next.js, Supabase & OpenAI GPT-4o
          </p>
        </div>
      </section>

    </div>
  );
}
