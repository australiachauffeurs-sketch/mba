import Link from "next/link";
import {
  Sparkles, Users, TrendingUp, Brain, ArrowRight, Star,
  MapPin, Briefcase, MessageSquare, Calendar, BookOpen,
  Zap, Shield, Network, ChevronRight, CheckCircle, Building2,
  GraduationCap, FlaskConical, Rocket, Clock,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────── */

const stats = [
  { label: "Active Members", value: "2,847" },
  { label: "Connections Made", value: "1,847" },
  { label: "Mentor Sessions", value: "342" },
  { label: "Startups Funded", value: "14" },
];

const roles = [
  {
    href: "/auth/signup/student",
    portal: "/student",
    label: "Student",
    headline: "Launch your MBA career with AI",
    description: "Get a personalised 5-phase Career GPS, AI mentor matching, daily opportunity feed, and warm introductions to the exact alumni and investors you need.",
    features: ["Career GPS Roadmap", "AI Advisor & Matchmaker", "Co-founder Search", "Investor Warm Intros"],
    color: "indigo",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    badge: "bg-indigo-600",
    pill: "bg-indigo-100 text-indigo-700",
    icon: GraduationCap,
    emoji: "🎓",
  },
  {
    href: "/auth/signup/alumni",
    portal: "/alumni",
    label: "Alumni",
    headline: "Give back. Hire smart. Discover startups.",
    description: "Mentor students who match your career path, discover hiring leads, and get AI recommendations for student founders in your investment thesis.",
    features: ["Mentor Request Inbox", "AI Hiring Recommendations", "Startup Deal Flow", "Introduction Writer"],
    color: "purple",
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    badge: "bg-purple-600",
    pill: "bg-purple-100 text-purple-700",
    icon: Users,
    emoji: "🏆",
  },
  {
    href: "/auth/signup/faculty",
    portal: "/faculty",
    label: "Faculty",
    headline: "Grow your research impact",
    description: "AI surfaces students aligned with your research, industry partners for co-funded projects, and grant opportunities tailored to your domain.",
    features: ["Research-Matched Students", "Grant Opportunity Feed", "Industry Partner AI", "Alumni Collaborators"],
    color: "green",
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    badge: "bg-green-600",
    pill: "bg-green-100 text-green-700",
    icon: FlaskConical,
    emoji: "📚",
  },
  {
    href: "/auth/signup/investor",
    portal: "/investor",
    label: "Investor",
    headline: "Thesis-matched deal flow, warm",
    description: "Discover student and alumni-founded startups matching your investment thesis. Get warm intros through shared connections — no cold email.",
    features: ["Thesis-Matched Startups", "Founder Profiles", "AI Co-investor Finder", "Research Commercialisation"],
    color: "amber",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-500",
    pill: "bg-amber-100 text-amber-700",
    icon: TrendingUp,
    emoji: "💼",
  },
  {
    href: "/auth/signup/organisation",
    portal: "/organisation",
    label: "Organisation",
    headline: "Reach MBA talent at scale",
    description: "Post jobs, internships, and workshops. Review applications from MBA students. Host events that put your brand in front of the right people.",
    features: ["Job & Internship Postings", "Event Management", "Application Review", "Brand Visibility"],
    color: "teal",
    bg: "bg-teal-50",
    border: "border-teal-200",
    text: "text-teal-700",
    badge: "bg-teal-600",
    pill: "bg-teal-100 text-teal-700",
    icon: Building2,
    emoji: "🏢",
  },
];

const agents = [
  {
    name: "Career GPS",
    emoji: "🗺️",
    role: "Student",
    what: "Generates a personalised 5-phase career roadmap naming real alumni in your network.",
    trigger: "On demand + daily cron",
    color: "indigo",
  },
  {
    name: "AI Advisor",
    emoji: "🤖",
    role: "Student",
    what: "Scores every alumni, mentor, and investor in the network and ranks them for your specific goal.",
    trigger: "On demand",
    color: "blue",
  },
  {
    name: "Introduction Writer",
    emoji: "✉️",
    role: "All Roles",
    what: "Writes a personalised outreach email referencing both profiles — no generic cold messages.",
    trigger: "On request",
    color: "violet",
  },
  {
    name: "Alumni Advisor",
    emoji: "🏆",
    role: "Alumni",
    what: "Surfaces mentorship requests, hiring leads, and startup deal flow matched to alumni's background.",
    trigger: "Cached + refresh",
    color: "purple",
  },
  {
    name: "Faculty Advisor",
    emoji: "🔬",
    role: "Faculty",
    what: "Recommends research-aligned students, grant opportunities, and industry partners.",
    trigger: "Cached + refresh",
    color: "green",
  },
  {
    name: "Investor Advisor",
    emoji: "💸",
    role: "Investor",
    what: "Finds thesis-matched startups, co-investors, and research with commercial potential.",
    trigger: "Cached + refresh",
    color: "amber",
  },
  {
    name: "GPS Enrichment Cron",
    emoji: "⚡",
    role: "System",
    what: "Runs every morning at 9 AM — scans new opportunities and adds goal-matched ones to every student's Career GPS.",
    trigger: "Daily 9 AM",
    color: "rose",
  },
];

const platformCapabilities = [
  { icon: MapPin,        title: "Career GPS Roadmap",       desc: "5-phase AI roadmap naming real alumni at each step",        color: "indigo" },
  { icon: Brain,         title: "AI Matchmaking",           desc: "Ranks people by relevance to your exact career goal",       color: "violet" },
  { icon: MessageSquare, title: "Warm Intro Writer",        desc: "Personalised outreach emails, not generic cold messages",   color: "blue" },
  { icon: Briefcase,     title: "Opportunity Feed",         desc: "Jobs, internships, research roles posted by the network",  color: "green" },
  { icon: Calendar,      title: "Events Hub",               desc: "All networking nights, workshops, and hackathons in one place", color: "teal" },
  { icon: Users,         title: "Mentor Matching",          desc: "Find mentors who walked exactly the path you want to walk", color: "purple" },
  { icon: Rocket,        title: "Co-founder Search",        desc: "Match technical and business profiles for founding teams", color: "rose" },
  { icon: TrendingUp,    title: "Investor Discovery",       desc: "Browse investors with thesis, stage, and check size visible", color: "amber" },
  { icon: BookOpen,      title: "Research Collaboration",   desc: "Faculty and students discover mutual research interests",   color: "green" },
  { icon: Network,       title: "Alumni Network",           desc: "Full searchable alumni directory with open-to-mentor flag", color: "slate" },
  { icon: Zap,           title: "Daily AI Cron",            desc: "New matched opportunities added to Career GPS every morning", color: "yellow" },
  { icon: Shield,        title: "Secure & Private",         desc: "RLS policies on every table, SSR auth, no data leaks",    color: "slate" },
];

const colorToken = (c: string) => ({
  indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
  violet: "bg-violet-50 text-violet-600 border-violet-100",
  blue:   "bg-blue-50 text-blue-600 border-blue-100",
  purple: "bg-purple-50 text-purple-600 border-purple-100",
  green:  "bg-green-50 text-green-600 border-green-100",
  teal:   "bg-teal-50 text-teal-600 border-teal-100",
  amber:  "bg-amber-50 text-amber-600 border-amber-100",
  rose:   "bg-rose-50 text-rose-600 border-rose-100",
  slate:  "bg-slate-50 text-slate-600 border-slate-100",
  yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
})[c] ?? "bg-slate-50 text-slate-600 border-slate-100";

/* ─── Page ──────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Sticky Nav ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">UniConnect</span>
            <span className="hidden sm:inline text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium ml-1">AI</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            <Link href="/for-students" className="text-sm text-slate-500 hover:text-slate-800 px-3 py-1.5 hidden sm:block">For Students</Link>
            <Link href="/guide" className="text-sm text-slate-500 hover:text-slate-800 px-3 py-1.5 hidden sm:block">Platform Guide</Link>
            <Link href="/auth/login" className="text-sm text-slate-500 hover:text-slate-800 px-3 py-1.5">Sign In</Link>
            <Link href="/auth/signup" className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition font-medium">
              Join Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero (unchanged) ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 text-sm text-indigo-700 font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI Operating System for Universities
          </div>
          <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
            The smartest network<br />
            <span className="text-indigo-600">your university never had</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            UniConnect AI continuously learns your university ecosystem and proactively creates connections that accelerate careers, fund startups, and drive research.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/for-students" className="inline-flex items-center gap-2 border border-indigo-300 text-indigo-700 bg-indigo-50 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-100 transition-colors">
              <Users className="w-4 h-4" /> For Students
            </Link>
            <Link href="/guide" className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
              <Star className="w-4 h-4" /> Platform Guide
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-slate-900">{s.value}</div>
                <div className="text-sm text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5 Role Cards ── */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-3">5 Roles</span>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">One platform. Every stakeholder.</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Each role gets its own AI-powered dashboard, agent, and experience — tailored from day one.</p>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.label} className={`group ${r.bg} border ${r.border} rounded-2xl p-5 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col`}>
                  <div className="mb-3">
                    <span className="text-2xl">{r.emoji}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full mb-3 self-start ${r.pill}`}>{r.label}</span>
                  <h3 className={`font-semibold ${r.text} text-sm mb-2 leading-snug`}>{r.headline}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4 flex-1">{r.description}</p>
                  <ul className="space-y-1.5 mb-5">
                    {r.features.map(f => (
                      <li key={f} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2 mt-auto">
                    <Link href={r.href} className={`flex-1 text-center text-xs font-semibold py-2 rounded-lg ${r.badge} text-white hover:opacity-90 transition`}>
                      Sign Up
                    </Link>
                    <Link href={r.portal} className={`px-3 py-2 rounded-lg border ${r.border} ${r.text} text-xs hover:opacity-80 transition`}>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── AI Agents ── */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-3">7 AI Agents</span>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">AI that works while you sleep</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Seven specialised agents run continuously — matching, enriching, recommending, and introducing across the entire network.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {agents.slice(0, 6).map((a) => (
              <div key={a.name} className={`rounded-2xl border p-5 ${colorToken(a.color)}`}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{a.emoji}</span>
                  <span className="text-xs bg-white/60 border border-current/10 px-2 py-0.5 rounded-full font-medium opacity-70">{a.role}</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-1.5">{a.name}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">{a.what}</p>
                <div className="flex items-center gap-1.5 text-xs opacity-70">
                  <Clock className="w-3 h-3" />
                  {a.trigger}
                </div>
              </div>
            ))}
          </div>
          {/* Cron agent — full width highlight */}
          <div className="mt-5 bg-gradient-to-r from-rose-600 to-orange-500 rounded-2xl p-6 text-white flex items-center gap-6">
            <span className="text-4xl flex-shrink-0">{agents[6].emoji}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg">{agents[6].name}</h3>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">System</span>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">{agents[6].what}</p>
            </div>
            <div className="flex-shrink-0 text-right hidden sm:block">
              <div className="text-2xl font-black">9 AM</div>
              <div className="text-white/70 text-xs">Every morning</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Platform Capabilities Grid ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-200 px-3 py-1 rounded-full mb-3">What's Inside</span>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">12 capabilities. Zero spreadsheets.</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Everything the university ecosystem needs — built, connected, and AI-powered from the ground up.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {platformCapabilities.map((cap) => {
              const Icon = cap.icon;
              const token = colorToken(cap.color);
              return (
                <div key={cap.title} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border mb-3 ${token}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">{cap.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── For Students CTA strip ── */}
      <section className="bg-indigo-600 py-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">MBA student? This platform was built for you.</h3>
            <p className="text-indigo-200 text-sm">See the 8 problems every MBA student faces — and how UniConnect solves each one.</p>
          </div>
          <Link href="/for-students" className="flex-shrink-0 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition text-sm flex items-center gap-2 whitespace-nowrap">
            See Student Benefits <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Example AI Insight (unchanged) ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 text-white">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium opacity-80">Example AI Insight</span>
            </div>
            <blockquote className="text-2xl font-medium leading-relaxed mb-6">
              &ldquo;You want to become a fintech founder. <strong>Three alumni</strong> built fintech companies, <strong>two investors</strong> in the network invest in fintech, and <strong>one professor</strong> is researching digital payments. The system has automatically introduced all five.&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span className="text-sm opacity-90">Proactive AI — not a search bar, but an intelligent advocate for every student.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full mb-3">Quick Start</span>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Live in 5 minutes</h2>
            <p className="text-slate-500">Three steps to activate every AI agent for your role.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 relative">
            {[
              { step: "01", title: "Pick your role", desc: "Choose Student, Alumni, Faculty, Investor, or Organisation and complete your profile in under 3 minutes.", icon: Users, color: "indigo" },
              { step: "02", title: "Set your goal or focus", desc: "Students set a career goal to activate Career GPS. Alumni toggle open-to-mentor. Investors input their thesis. Everyone's AI activates.", icon: MapPin, color: "violet" },
              { step: "03", title: "Let the AI work", desc: "Check your AI Advisor for matches. Wake up to new Career GPS additions each morning. Request intros. Apply. Connect.", icon: Zap, color: "rose" },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="relative">
                  {i < 2 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-slate-200 to-transparent z-0" style={{ width: "calc(100% - 2rem)", left: "calc(100% - 1rem)" }} />
                  )}
                  <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 relative z-10 hover:border-indigo-200 hover:shadow-lg transition-all">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorToken(s.color)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-3xl font-black text-slate-100 absolute top-5 right-6">{s.step}</span>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">{s.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 py-24 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">Your university network,<br />finally working for you.</h2>
          <p className="text-slate-300 text-lg mb-10 leading-relaxed">
            Join thousands of students, alumni, faculty, and investors on the only AI-native platform built for university ecosystems.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth/signup" className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-8 py-4 rounded-xl transition text-sm flex items-center justify-center gap-2">
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/guide" className="border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition text-sm flex items-center justify-center gap-2">
              <Star className="w-4 h-4" /> Read the Platform Guide
            </Link>
          </div>
          <p className="text-slate-500 text-xs mt-6">Free to join · No credit card · All 7 AI agents activated from day one</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-slate-900">UniConnect</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">AI Operating System for university ecosystems. 5 roles, 7 agents, 12 capabilities.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm mb-3">For Students</p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link href="/for-students" className="hover:text-slate-800">Why UniConnect?</Link></li>
                <li><Link href="/auth/signup/student" className="hover:text-slate-800">Create Student Account</Link></li>
                <li><Link href="/student" className="hover:text-slate-800">Student Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm mb-3">Other Roles</p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link href="/alumni" className="hover:text-slate-800">Alumni Portal</Link></li>
                <li><Link href="/faculty" className="hover:text-slate-800">Faculty Portal</Link></li>
                <li><Link href="/investor" className="hover:text-slate-800">Investor Portal</Link></li>
                <li><Link href="/organisation" className="hover:text-slate-800">Organisation Portal</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm mb-3">Resources</p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link href="/guide" className="hover:text-slate-800">Platform Guide</Link></li>
                <li><Link href="/auth/login" className="hover:text-slate-800">Sign In</Link></li>
                <li><Link href="/auth/signup" className="hover:text-slate-800">Join Free</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <span>© 2026 UniConnect AI. Built for MBA Ecosystems.</span>
            <span>Powered by Next.js · Supabase · OpenAI GPT-4o mini</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
