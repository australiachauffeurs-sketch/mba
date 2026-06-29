import Link from "next/link";
import {
  Sparkles, Users, TrendingUp, Brain, ArrowRight, Star,
  MapPin, Briefcase, MessageSquare, Calendar, BookOpen,
  Zap, Shield, Network, ChevronRight, CheckCircle, Building2,
  GraduationCap, FlaskConical, Rocket, Clock, Menu,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────── */

const stats = [
  { label: "Active Members",   value: "2,847" },
  { label: "Connections Made", value: "1,847" },
  { label: "Mentor Sessions",  value: "342"   },
  { label: "Startups Funded",  value: "14"    },
];

const roles = [
  {
    href: "/auth/signup/student", portal: "/student",
    label: "Student", headline: "Launch your MBA career with AI",
    description: "Get a personalised 5-phase Career GPS, AI mentor matching, daily opportunity feed, and warm introductions to the exact alumni and investors you need.",
    features: ["Career GPS Roadmap", "AI Advisor & Matchmaker", "Co-founder Search", "Investor Warm Intros"],
    bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700",
    badge: "bg-indigo-600", pill: "bg-indigo-100 text-indigo-700", emoji: "🎓", icon: GraduationCap,
  },
  {
    href: "/auth/signup/alumni", portal: "/alumni",
    label: "Alumni", headline: "Give back. Hire smart. Discover startups.",
    description: "Mentor students who match your career path, discover hiring leads, and get AI recommendations for student founders in your investment thesis.",
    features: ["Mentor Request Inbox", "AI Hiring Recommendations", "Startup Deal Flow", "Introduction Writer"],
    bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700",
    badge: "bg-purple-600", pill: "bg-purple-100 text-purple-700", emoji: "🏆", icon: Users,
  },
  {
    href: "/auth/signup/faculty", portal: "/faculty",
    label: "Faculty", headline: "Grow your research impact",
    description: "AI surfaces students aligned with your research, industry partners for co-funded projects, and grant opportunities tailored to your domain.",
    features: ["Research-Matched Students", "Grant Opportunity Feed", "Industry Partner AI", "Alumni Collaborators"],
    bg: "bg-green-50", border: "border-green-200", text: "text-green-700",
    badge: "bg-green-600", pill: "bg-green-100 text-green-700", emoji: "📚", icon: FlaskConical,
  },
  {
    href: "/auth/signup/investor", portal: "/investor",
    label: "Investor", headline: "Thesis-matched deal flow, warm",
    description: "Discover student and alumni-founded startups matching your investment thesis. Get warm intros through shared connections — no cold email.",
    features: ["Thesis-Matched Startups", "Founder Profiles", "AI Co-investor Finder", "Research Commercialisation"],
    bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700",
    badge: "bg-amber-500", pill: "bg-amber-100 text-amber-700", emoji: "💼", icon: TrendingUp,
  },
  {
    href: "/auth/signup/organisation", portal: "/organisation",
    label: "Organisation", headline: "Reach MBA talent at scale",
    description: "Post jobs, internships, and workshops. Review applications from MBA students. Host events that put your brand in front of the right people.",
    features: ["Job & Internship Postings", "Event Management", "Application Review", "Brand Visibility"],
    bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700",
    badge: "bg-teal-600", pill: "bg-teal-100 text-teal-700", emoji: "🏢", icon: Building2,
  },
];

const agents = [
  { name: "Career GPS",          emoji: "🗺️", role: "Student",   color: "indigo", what: "Generates a personalised 5-phase career roadmap naming real alumni in your network.",                                              trigger: "On demand + daily cron" },
  { name: "AI Advisor",          emoji: "🤖", role: "Student",   color: "blue",   what: "Scores every alumni, mentor, and investor in the network and ranks them for your specific goal.",                                   trigger: "On demand" },
  { name: "Introduction Writer", emoji: "✉️", role: "All Roles", color: "violet", what: "Writes a personalised outreach email referencing both profiles — no generic cold messages.",                                        trigger: "On request" },
  { name: "Alumni Advisor",      emoji: "🏆", role: "Alumni",    color: "purple", what: "Surfaces mentorship requests, hiring leads, and startup deal flow matched to alumni's background.",                                 trigger: "Cached + refresh" },
  { name: "Faculty Advisor",     emoji: "🔬", role: "Faculty",   color: "green",  what: "Recommends research-aligned students, grant opportunities, and industry partners.",                                                 trigger: "Cached + refresh" },
  { name: "Investor Advisor",    emoji: "💸", role: "Investor",  color: "amber",  what: "Finds thesis-matched startups, co-investors, and research with commercial potential.",                                              trigger: "Cached + refresh" },
  { name: "GPS Enrichment Cron", emoji: "⚡", role: "System",    color: "rose",   what: "Runs every morning at 9 AM — scans new opportunities and adds goal-matched ones to every student's Career GPS.",                   trigger: "Daily 9 AM" },
];

const platformCapabilities = [
  { icon: MapPin,        title: "Career GPS Roadmap",     desc: "5-phase AI roadmap naming real alumni at each step",          color: "indigo" },
  { icon: Brain,         title: "AI Matchmaking",         desc: "Ranks people by relevance to your exact career goal",         color: "violet" },
  { icon: MessageSquare, title: "Warm Intro Writer",      desc: "Personalised outreach emails, not generic cold messages",     color: "blue"   },
  { icon: Briefcase,     title: "Opportunity Feed",       desc: "Jobs, internships, research roles posted by the network",    color: "green"  },
  { icon: Calendar,      title: "Events Hub",             desc: "All networking nights, workshops, and hackathons in one",    color: "teal"   },
  { icon: Users,         title: "Mentor Matching",        desc: "Find mentors who walked exactly the path you want",          color: "purple" },
  { icon: Rocket,        title: "Co-founder Search",      desc: "Match technical and business profiles for founding teams",   color: "rose"   },
  { icon: TrendingUp,    title: "Investor Discovery",     desc: "Browse investors with thesis, stage, and check size",        color: "amber"  },
  { icon: BookOpen,      title: "Research Collaboration", desc: "Faculty and students discover mutual research interests",    color: "green"  },
  { icon: Network,       title: "Alumni Network",         desc: "Full searchable directory with open-to-mentor flag",         color: "slate"  },
  { icon: Zap,           title: "Daily AI Cron",          desc: "New matched opportunities added to Career GPS every morning", color: "yellow" },
  { icon: Shield,        title: "Secure & Private",       desc: "RLS policies on every table, SSR auth, no data leaks",      color: "slate"  },
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm sm:text-base">UniConnect</span>
            <span className="hidden sm:inline text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium ml-1">AI</span>
          </div>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 lg:gap-3">
            <Link href="/for-students" className="text-sm text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition">For Students</Link>
            <Link href="/guide"        className="text-sm text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition">Platform Guide</Link>
            <Link href="/auth/login"   className="text-sm text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition">Sign In</Link>
            <Link href="/auth/signup"  className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition font-medium">Join Free</Link>
          </div>
          {/* Mobile nav */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/auth/login"  className="text-xs text-slate-500 px-2.5 py-1.5">Sign In</Link>
            <Link href="/auth/signup" className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-medium">Join Free</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-indigo-700 font-medium mb-5 sm:mb-6">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            AI Operating System for Universities
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-4 sm:mb-6">
            The smartest network<br />
            <span className="text-indigo-600">your university never had</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-500 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
            UniConnect AI continuously learns your university ecosystem and proactively creates connections that accelerate careers, fund startups, and drive research.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link href="/auth/signup"  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-sm sm:text-base">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/for-students" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-indigo-300 text-indigo-700 bg-indigo-50 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-100 transition-colors text-sm sm:text-base">
              <Users className="w-4 h-4" /> For Students
            </Link>
            <Link href="/guide"        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors text-sm sm:text-base">
              <Star className="w-4 h-4" /> Platform Guide
            </Link>
          </div>
          {/* Stats */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">{s.value}</div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5 Role Cards ── */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-3">5 Roles</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">One platform. Every stakeholder.</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base px-2">Each role gets its own AI-powered dashboard, agent, and experience — tailored from day one.</p>
          </div>
          {/* Mobile: 1 col, sm: 2 col, lg: 5 col */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {roles.map((r) => (
              <div key={r.label} className={`group ${r.bg} border ${r.border} rounded-2xl p-5 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col`}>
                <div className="mb-3 flex items-center justify-between lg:block">
                  <span className="text-2xl">{r.emoji}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full lg:hidden ${r.pill}`}>{r.label}</span>
                </div>
                <span className={`hidden lg:inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-3 self-start ${r.pill}`}>{r.label}</span>
                <h3 className={`font-semibold ${r.text} text-sm mb-2 leading-snug`}>{r.headline}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4 flex-1">{r.description}</p>
                <ul className="space-y-1.5 mb-5">
                  {r.features.map(f => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-slate-600">
                      <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 mt-auto">
                  <Link href={r.href}   className={`flex-1 text-center text-xs font-semibold py-2 rounded-lg ${r.badge} text-white hover:opacity-90 transition`}>Sign Up</Link>
                  <Link href={r.portal} className={`px-3 py-2 rounded-lg border ${r.border} ${r.text} text-xs hover:opacity-80 transition`}><ChevronRight className="w-3 h-3" /></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Example AI Insight ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium opacity-80">Example AI Insight</span>
            </div>
            <blockquote className="text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed mb-4 sm:mb-6">
              &ldquo;You want to become a fintech founder. <strong>Three alumni</strong> built fintech companies, <strong>two investors</strong> in the network invest in fintech, and <strong>one professor</strong> is researching digital payments. The system has automatically introduced all five.&rdquo;
            </blockquote>
            <div className="flex items-start sm:items-center gap-2 sm:gap-3">
              <Star className="w-4 h-4 text-yellow-300 fill-yellow-300 flex-shrink-0 mt-0.5 sm:mt-0" />
              <span className="text-xs sm:text-sm opacity-90">Proactive AI — not a search bar, but an intelligent advocate for every student.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI Agents ── */}
      <section className="py-14 sm:py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-3">7 AI Agents</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">AI that works while you sleep</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base px-2">Seven specialised agents run continuously — matching, enriching, recommending, and introducing across the entire network.</p>
          </div>
          {/* 1 col mobile, 2 col sm, 3 col lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {agents.slice(0, 6).map((a) => (
              <div key={a.name} className={`rounded-2xl border p-4 sm:p-5 ${colorToken(a.color)}`}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xl sm:text-2xl">{a.emoji}</span>
                  <span className="text-xs bg-white/60 border border-current/10 px-2 py-0.5 rounded-full font-medium opacity-70">{a.role}</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-1.5 text-sm sm:text-base">{a.name}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">{a.what}</p>
                <div className="flex items-center gap-1.5 text-xs opacity-70">
                  <Clock className="w-3 h-3 flex-shrink-0" />{a.trigger}
                </div>
              </div>
            ))}
          </div>
          {/* Cron agent */}
          <div className="mt-4 sm:mt-5 bg-gradient-to-r from-rose-600 to-orange-500 rounded-2xl p-5 sm:p-6 text-white flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <span className="text-3xl sm:text-4xl flex-shrink-0">{agents[6].emoji}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-bold text-base sm:text-lg">{agents[6].name}</h3>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">System</span>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">{agents[6].what}</p>
            </div>
            <div className="flex-shrink-0 sm:text-right">
              <div className="text-xl sm:text-2xl font-black">9 AM</div>
              <div className="text-white/70 text-xs">Every morning</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Platform Capabilities Grid ── */}
      <section className="py-14 sm:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-200 px-3 py-1 rounded-full mb-3">What&apos;s Inside</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">12 capabilities. Zero spreadsheets.</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base px-2">Everything the university ecosystem needs — built, connected, and AI-powered from the ground up.</p>
          </div>
          {/* 2 col mobile, 3 col md, 4 col lg */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {platformCapabilities.map((cap) => {
              const Icon = cap.icon;
              const token = colorToken(cap.color);
              return (
                <div key={cap.title} className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:shadow-md transition-shadow">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center border mb-2 sm:mb-3 ${token}`}>
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-xs sm:text-sm mb-1">{cap.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed hidden sm:block">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── For Students CTA strip ── */}
      <section className="bg-indigo-600 py-10 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1">MBA student? This platform was built for you.</h3>
            <p className="text-indigo-200 text-sm">See the 8 problems every MBA student faces — and how UniConnect solves each one.</p>
          </div>
          <Link href="/for-students" className="w-full sm:w-auto flex-shrink-0 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition text-sm flex items-center justify-center gap-2">
            See Student Benefits <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-14 sm:py-20 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full mb-3">Quick Start</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Live in 5 minutes</h2>
            <p className="text-slate-500 text-sm sm:text-base">Three steps to activate every AI agent for your role.</p>
          </div>
          {/* Stack on mobile, 3-col on md */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { step: "01", title: "Pick your role",        desc: "Choose Student, Alumni, Faculty, Investor, or Organisation and complete your profile in under 3 minutes.", icon: Users,  color: "indigo" },
              { step: "02", title: "Set your goal",         desc: "Students set a career goal to activate Career GPS. Alumni toggle open-to-mentor. Investors input their thesis.", icon: MapPin, color: "violet" },
              { step: "03", title: "Let the AI work",       desc: "Check your AI Advisor for matches. Wake up to new Career GPS additions each morning. Request intros. Apply. Connect.", icon: Zap,   color: "rose"   },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="bg-white border-2 border-slate-100 rounded-2xl p-5 sm:p-6 relative hover:border-indigo-200 hover:shadow-lg transition-all">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 ${colorToken(s.color)}`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-3xl font-black text-slate-100 absolute top-4 right-5 sm:top-5 sm:right-6">{s.step}</span>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-2">{s.title}</h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 py-16 sm:py-24 text-white text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6">
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
            Your university network,<br className="hidden sm:block" /> finally working for you.
          </h2>
          <p className="text-indigo-200 text-sm sm:text-base lg:text-lg mb-8 sm:mb-10 leading-relaxed">
            Join thousands of students, alumni, faculty, and investors on the only AI-native platform built for university ecosystems.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link href="/auth/signup" className="w-full sm:w-auto bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl transition text-sm flex items-center justify-center gap-2">
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/guide" className="w-full sm:w-auto border border-white/30 text-white font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl hover:bg-white/10 transition text-sm flex items-center justify-center gap-2">
              <Star className="w-4 h-4" /> Read the Platform Guide
            </Link>
          </div>
          <p className="text-indigo-300/70 text-xs mt-5 sm:mt-6">Free to join · No credit card · All 7 AI agents activated from day one</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          {/* 1 col mobile, 2 col sm, 4 col md */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div className="col-span-2 sm:col-span-2 md:col-span-1">
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
                <li><Link href="/for-students"        className="hover:text-slate-800 transition">Why UniConnect?</Link></li>
                <li><Link href="/auth/signup/student"  className="hover:text-slate-800 transition">Create Account</Link></li>
                <li><Link href="/student"              className="hover:text-slate-800 transition">Student Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm mb-3">Other Roles</p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link href="/alumni"       className="hover:text-slate-800 transition">Alumni Portal</Link></li>
                <li><Link href="/faculty"      className="hover:text-slate-800 transition">Faculty Portal</Link></li>
                <li><Link href="/investor"     className="hover:text-slate-800 transition">Investor Portal</Link></li>
                <li><Link href="/organisation" className="hover:text-slate-800 transition">Organisation Portal</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm mb-3">Resources</p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link href="/guide"        className="hover:text-slate-800 transition">Platform Guide</Link></li>
                <li><Link href="/auth/login"   className="hover:text-slate-800 transition">Sign In</Link></li>
                <li><Link href="/auth/signup"  className="hover:text-slate-800 transition">Join Free</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 text-center sm:text-left">
            <span>© 2026 UniConnect AI. Built for MBA Ecosystems.</span>
            <span>Powered by Next.js · Supabase · OpenAI GPT-4o mini</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
