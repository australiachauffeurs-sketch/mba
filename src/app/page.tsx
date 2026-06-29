import Link from "next/link";
import { Sparkles, Users, TrendingUp, Brain, ArrowRight, Star, Building2 } from "lucide-react";

const roles = [
  { href: "/student", label: "Student Portal", description: "Career GPS, mentor matching, internship discovery", lightColor: "bg-blue-50", textColor: "text-blue-700", icon: "🎓" },
  { href: "/alumni", label: "Alumni Portal", description: "Mentor students, hire talent, discover startups", lightColor: "bg-purple-50", textColor: "text-purple-700", icon: "🏆" },
  { href: "/faculty", label: "Faculty Portal", description: "Research collaborations, student projects", lightColor: "bg-green-50", textColor: "text-green-700", icon: "📚" },
  { href: "/investor", label: "Investor Portal", description: "Startup deal flow, founder discovery", lightColor: "bg-amber-50", textColor: "text-amber-700", icon: "💼" },
  { href: "/admin", label: "University Admin", description: "Engagement analytics, network insights", lightColor: "bg-slate-50", textColor: "text-slate-700", icon: "📊" },
];

const stats = [
  { label: "Active Members", value: "2,847" },
  { label: "Connections Made", value: "1,847" },
  { label: "Mentor Sessions", value: "342" },
  { label: "Startups Funded", value: "14" },
];

const features = [
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description: "Semantic vector matching across 50+ profile signals to surface the most relevant connections — not just keyword overlap.",
  },
  {
    icon: Sparkles,
    title: "Proactive Introductions",
    description: "The AI doesn't wait. It identifies high-value connections and drafts personalized introduction messages automatically.",
  },
  {
    icon: TrendingUp,
    title: "University Analytics",
    description: "Real-time engagement scores, hiring outcomes, funding raised, and alumni activity — metrics that matter to accreditation.",
  },
  {
    icon: Users,
    title: "All Stakeholders, One Platform",
    description: "Students, alumni, faculty, investors, and recruiters — the entire university ecosystem in a single AI-native network.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
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
            <Link href="/guide" className="inline-flex items-center gap-2 border border-indigo-300 text-indigo-700 bg-indigo-50 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-100 transition-colors">
              <Star className="w-4 h-4" /> Platform Guide
            </Link>
            <Link href="/admin" className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
              <Building2 className="w-4 h-4" /> University Demo
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-slate-900">{s.value}</div>
                <div className="text-sm text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role portals */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">One platform, every stakeholder</h2>
          <p className="text-slate-500 text-lg">Each role gets a personalized AI-powered experience</p>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {roles.map((role) => (
            <Link key={role.href} href={role.href} className={`${role.lightColor} border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all hover:-translate-y-1 group`}>
              <div className="text-3xl mb-3">{role.icon}</div>
              <h3 className={`font-semibold ${role.textColor} mb-1`}>{role.label}</h3>
              <p className="text-sm text-slate-500 leading-snug">{role.description}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
                Enter portal <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Built on AI, not spreadsheets</h2>
            <p className="text-slate-500 text-lg">How UniConnect AI thinks and works</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white rounded-2xl p-6 border border-slate-200">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Example insight */}
      <section className="max-w-6xl mx-auto px-6 py-16">
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

      <footer className="border-t border-slate-200 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-slate-900">UniConnect AI</span>
          </div>
          <p className="text-sm text-slate-400">MVP Demo — All data is simulated</p>
        </div>
      </footer>
    </div>
  );
}
