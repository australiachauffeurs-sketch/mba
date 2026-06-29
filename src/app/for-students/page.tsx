import Link from "next/link";
import {
  Sparkles, ArrowRight, CheckCircle, XCircle, AlertTriangle,
  MapPin, Users, Briefcase, Brain, MessageSquare, Calendar,
  TrendingUp, Target, Clock, Star, Zap, Shield, BookOpen,
  Network, Rocket, ChevronRight,
} from "lucide-react";

const problems = [
  {
    id: 1,
    emoji: "😰",
    problem: "No idea what career to pursue",
    context: "You're in your first semester of MBA, surrounded by people who seem to have their entire careers mapped out. Meanwhile, you're drowning in options — consulting, banking, PE, startups, product — with no clear signal of which path fits you.",
    painPoints: [
      "Generic career counselling that gives the same advice to everyone",
      "No personalised roadmap based on your specific background and skills",
      "Overwhelming choice with no framework to decide",
      "Advice from friends who are just as lost as you",
    ],
    solution: "Career GPS — Your AI-Powered Career Roadmap",
    solutionDesc: "Tell UniConnect your career goal and instantly receive a personalised 5-phase roadmap built from your actual profile — your skills, work experience, program, and interests. The AI doesn't give generic advice. It names real alumni from your university network who are already doing what you want to do and tells you exactly how to reach them.",
    solutionPoints: [
      "5-phase roadmap: Foundation → Exploration → Building → Execution → Launch",
      "Real alumni named in your plan — not fictional examples",
      "Milestones with timelines adapted to your background",
      "Updates every morning with new opportunities matching your goal",
      "Switch goals anytime — new roadmap generated instantly",
    ],
    color: "blue",
    icon: MapPin,
  },
  {
    id: 2,
    emoji: "🤝",
    problem: "Can't get to the right people",
    context: "Everyone tells you 'it's all about who you know.' But cold LinkedIn messages get ignored, career fairs feel transactional, and you have no idea which alumni are actually willing to help. The network exists — you just can't reach it.",
    painPoints: [
      "Cold outreach on LinkedIn has under 5% response rates",
      "No way to know which alumni are genuinely open to talking",
      "Career fairs are crowded and conversations are 60 seconds long",
      "No context for why you're reaching out — emails feel generic",
    ],
    solution: "AI Matchmaking + Introduction Writer",
    solutionDesc: "UniConnect's AI scans every alumni, faculty, and investor profile and surfaces the most relevant people for your exact goal — not just anyone in your industry, but the specific person whose career path mirrors what you want to achieve. When you find someone worth reaching out to, the AI writes a personalised introduction email referencing both your backgrounds — so you never send a generic cold message again.",
    solutionPoints: [
      "AI ranks alumni, mentors, and investors specifically for your goal",
      "See who is 'Open to Mentoring' before reaching out",
      "AI Introduction Writer drafts personalised emails citing real profile details",
      "Connect button sends a formal request — no awkward cold email needed",
      "Build a real network, not just a contact list",
    ],
    color: "purple",
    icon: Users,
  },
  {
    id: 3,
    emoji: "📭",
    problem: "Missing jobs and internships you never even knew existed",
    context: "The best opportunities don't always end up on LinkedIn or your university job board. Alumni who could hire you don't post on public boards. Startups that would be perfect for you don't have recruiting budgets. You find out about opportunities after applications close.",
    painPoints: [
      "Job boards are generic — no filtering for MBA-relevant roles",
      "Alumni hiring opportunities shared only through closed networks",
      "Startup roles never reach university job boards",
      "Deadlines pass before you even hear about the opportunity",
    ],
    solution: "Opportunity Feed + Daily AI Cron Enrichment",
    solutionDesc: "Every opportunity posted by alumni, companies, and organisations on UniConnect is visible to you in one place. More importantly, the Career GPS Enrichment Agent runs every single morning at 9 AM — it scans all new opportunities added since yesterday, scores them against your specific career goal, and automatically adds the relevant ones to your Career GPS as 'New Additions.' You wake up to a personalised feed, not a generic list.",
    solutionPoints: [
      "Internships, full-time roles, research, volunteering, and workshops in one feed",
      "Opportunities posted by your own alumni network — warm, not cold",
      "Daily AI cron adds goal-matched new postings to your Career GPS every morning",
      "Apply directly on the platform — no external redirect",
      "Filter by type, industry, location, and work mode",
    ],
    color: "green",
    icon: Briefcase,
  },
  {
    id: 4,
    emoji: "🧭",
    problem: "No mentor — or the wrong mentor",
    context: "Everyone says get a mentor. But finding someone who has actually walked the path you want to walk — not just a senior person who's willing to talk — is nearly impossible. Coffee chats with random alumni give you generic advice that doesn't apply to your situation.",
    painPoints: [
      "Mentors assigned randomly through university programs — no alignment",
      "No way to filter by specific career path, not just industry",
      "Hard to know what to even ask a mentor without a framework",
      "One coffee chat, then silence — no structure or follow-through",
    ],
    solution: "AI-Matched Mentors + Structured Sessions",
    solutionDesc: "UniConnect's AI matches you with mentors who specifically walked the career path you want — not just people in your target industry. You can see their full profile: their MBA batch year, what they did in their first job, how they transitioned, what they now do. Book a structured session with a clear agenda. Alumni who have toggled 'Open to Mentoring' are actively waiting to help.",
    solutionPoints: [
      "Mentors filtered by career path, not just job title",
      "See full work history before booking — know exactly why they're relevant",
      "Book a session directly on the platform with agenda setting",
      "Alumni who marked 'Open to Mentoring' respond — they want to be here",
      "AI explains specifically why each mentor match is relevant to your goal",
    ],
    color: "amber",
    icon: BookOpen,
  },
  {
    id: 5,
    emoji: "🚀",
    problem: "Want to start a company but can't find co-founders",
    context: "You have a business idea and the drive to build it. But finding a technical co-founder — someone who can build what you're designing — feels impossible inside a business school full of other MBAs. Engineers and MBAs rarely meet at the right moment.",
    painPoints: [
      "MBA programs attract business people, not engineers",
      "No structured way to meet potential co-founders",
      "Uncomfortable asking classmates — feels awkward if it doesn't work out",
      "Startup competition teams form randomly, not by skill fit",
    ],
    solution: "Co-founder Matching + Startup Ecosystem",
    solutionDesc: "UniConnect has a dedicated co-founder matching system where students and alumni explicitly signal they're looking to build something. Filter by skills (technical/non-technical), industry interest, time commitment, and idea stage. Once you find someone, you can see their full background and reach out directly. Alumni startups are also listed — you can join an existing venture as an early team member.",
    solutionPoints: [
      "Co-founder matching page with skill, industry, and commitment filters",
      "Both students and alumni signal co-founder interest openly",
      "Full profiles visible before connecting — assess fit before the awkward conversation",
      "Browse alumni startups looking for early-stage MBA hires",
      "Investors on the platform can discover and fund your startup directly",
    ],
    color: "rose",
    icon: Rocket,
  },
  {
    id: 6,
    emoji: "📅",
    problem: "Missing events, workshops, and networking nights",
    context: "There's always something happening — a finance networking night, a founder panel, a case competition prep session. But they're announced on five different channels, buried in email threads, and you find out on the day or the day after.",
    painPoints: [
      "Events spread across email, WhatsApp, LinkedIn, and notice boards",
      "No centralised calendar for all university and alumni events",
      "Miss registration deadlines because you didn't see the announcement",
      "No way to know which events are worth your time",
    ],
    solution: "Unified Events Feed from Organisations & Alumni",
    solutionDesc: "Every event posted by organisations, clubs, companies, and faculty on UniConnect appears in a single, filterable feed. You can see the event type (networking, workshop, hackathon, recruitment), the host, the date, whether it's virtual or in-person, and the registration deadline — all before deciding to attend.",
    solutionPoints: [
      "Single feed for all events — no more checking five places",
      "Filter by type: networking, workshop, hackathon, seminar, recruitment",
      "See registration deadlines, location, max attendees, and host profile",
      "Events posted by the actual organisations you want to work for",
      "Career GPS auto-adds relevant events as 'New Additions' each morning",
    ],
    color: "teal",
    icon: Calendar,
  },
  {
    id: 7,
    emoji: "💸",
    problem: "Investors are impossible to reach",
    context: "You have a startup idea or an early company. Every VC article says 'warm intros only.' But you're a student — your network doesn't include VCs. The investors who back first-time founders are invisible to you, even though some of them are alumni of your own university.",
    painPoints: [
      "VCs publicly say 'warm intros only' but you don't know anyone who knows them",
      "Pitch competitions are competitive and one-time opportunities",
      "Alumni investors aren't listed anywhere accessible",
      "No context for why a VC might be interested in your specific startup",
    ],
    solution: "Investor Profiles + AI-Matched Warm Intros",
    solutionDesc: "UniConnect has investor profiles with full investment thesis, sector focus, stage preference, and check size. The AI reads your startup details and matches you to investors whose thesis aligns with what you're building. You can then request a warm introduction through a shared alumni connection — with an AI-written intro that explains exactly why the match makes sense.",
    solutionPoints: [
      "Browse investor profiles with thesis, sectors, stage, and check size visible",
      "AI matches your startup to thesis-aligned investors in the network",
      "Request warm intros through shared connections — never cold email a VC again",
      "AI writes the introduction email citing your startup and their specific thesis",
      "Alumni angels and micro-VCs who specifically back student founders",
    ],
    color: "violet",
    icon: TrendingUp,
  },
  {
    id: 8,
    emoji: "📊",
    problem: "Generic AI tools that don't know your university network",
    context: "You've tried using ChatGPT to plan your career. It gives you the same advice it gives everyone. It doesn't know which alumni from your university are at Goldman Sachs, which professor is connected to a VC, or which startup in your city just raised a Series A and is hiring MBAs.",
    painPoints: [
      "Generic AI doesn't know who is in your actual university network",
      "ChatGPT can't introduce you to real people",
      "Career advice is based on what's true on average, not what's true for you",
      "No connection between AI output and real actionable steps in your network",
    ],
    solution: "Context-Aware AI Built on Your Real Network Data",
    solutionDesc: "UniConnect's AI is not a generic chatbot. Every recommendation it makes is grounded in real data from your platform — actual alumni profiles, real open opportunities, live events, and your specific profile details. When the AI says 'Connect with Sarah Chen,' Sarah is a real person in your network who has agreed to be contacted. The gap between AI advice and real action is zero.",
    solutionPoints: [
      "AI reads your real profile — not a generic MBA template",
      "Recommendations reference real people, real companies, real opportunities",
      "Career roadmap names actual alumni from your university by name",
      "Every 'urgent' flag is based on real recruiting timelines, not generic advice",
      "Caching means the AI learns your context once and improves over time",
    ],
    color: "indigo",
    icon: Brain,
  },
];

const improvements = [
  { metric: "5-phase roadmap", label: "vs. zero structured plan before", icon: MapPin },
  { metric: "Named alumni", label: "in your personalised career plan", icon: Users },
  { metric: "Daily updates", label: "to your Career GPS via AI cron", icon: Clock },
  { metric: "7 AI agents", label: "working for you around the clock", icon: Zap },
  { metric: "1 platform", label: "for mentors, jobs, events, co-founders, investors", icon: Network },
  { metric: "0 cold emails", label: "with AI-written warm introductions", icon: MessageSquare },
];

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string; pill: string; light: string; btnBg: string; gradient: string }> = {
  blue:   { bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-700",   badge: "bg-blue-100 text-blue-700",   pill: "bg-blue-600",   light: "bg-blue-50",   btnBg: "bg-blue-600 hover:bg-blue-700",   gradient: "from-blue-600 to-indigo-600" },
  purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", badge: "bg-purple-100 text-purple-700", pill: "bg-purple-600", light: "bg-purple-50", btnBg: "bg-purple-600 hover:bg-purple-700", gradient: "from-purple-600 to-violet-600" },
  green:  { bg: "bg-green-50",  border: "border-green-200",  text: "text-green-700",  badge: "bg-green-100 text-green-700",  pill: "bg-green-600",  light: "bg-green-50",  btnBg: "bg-green-600 hover:bg-green-700",  gradient: "from-green-600 to-emerald-600" },
  amber:  { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  badge: "bg-amber-100 text-amber-700",  pill: "bg-amber-500",  light: "bg-amber-50",  btnBg: "bg-amber-500 hover:bg-amber-600",  gradient: "from-amber-500 to-orange-500" },
  rose:   { bg: "bg-rose-50",   border: "border-rose-200",   text: "text-rose-700",   badge: "bg-rose-100 text-rose-700",   pill: "bg-rose-600",   light: "bg-rose-50",   btnBg: "bg-rose-600 hover:bg-rose-700",   gradient: "from-rose-600 to-pink-600" },
  teal:   { bg: "bg-teal-50",   border: "border-teal-200",   text: "text-teal-700",   badge: "bg-teal-100 text-teal-700",   pill: "bg-teal-600",   light: "bg-teal-50",   btnBg: "bg-teal-600 hover:bg-teal-700",   gradient: "from-teal-600 to-emerald-600" },
  violet: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", badge: "bg-violet-100 text-violet-700", pill: "bg-violet-600", light: "bg-violet-50", btnBg: "bg-violet-600 hover:bg-violet-700", gradient: "from-violet-600 to-purple-600" },
  indigo: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", badge: "bg-indigo-100 text-indigo-700", pill: "bg-indigo-600", light: "bg-indigo-50", btnBg: "bg-indigo-600 hover:bg-indigo-700", gradient: "from-indigo-600 to-blue-600" },
};

export default function ForStudentsPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">UniConnect</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/guide" className="text-sm text-slate-500 hover:text-slate-800">Platform Guide</Link>
            <Link href="/auth/login" className="text-sm text-slate-500 hover:text-slate-800">Sign In</Link>
            <Link href="/auth/signup/student" className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition font-medium">
              Join Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-600/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 text-white/80">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            8 problems every MBA student faces — solved
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
            MBA is hard enough.<br />
            <span className="text-indigo-400">Your network shouldn't be.</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
            UniConnect identifies every real obstacle MBA students hit — from finding the right mentor to getting in front of investors — and gives you AI-powered tools to break through each one.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/auth/signup/student" className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-7 py-3.5 rounded-xl font-semibold transition text-sm">
              Start for free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="#problems" className="inline-flex items-center gap-2 border border-white/20 text-white/80 hover:text-white px-7 py-3.5 rounded-xl font-semibold transition text-sm">
              See all 8 problems <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Improvement metrics */}
      <section className="bg-indigo-600 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-white text-center">
            {improvements.map(imp => {
              const Icon = imp.icon;
              return (
                <div key={imp.metric}>
                  <Icon className="w-5 h-5 mx-auto mb-2 text-indigo-200" />
                  <p className="text-xl font-bold">{imp.metric}</p>
                  <p className="text-indigo-200 text-xs mt-0.5 leading-tight">{imp.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Before / After teaser */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest bg-slate-100 text-slate-600 px-3 py-1 rounded-full mb-3">The Difference</span>
          <h2 className="text-3xl font-bold text-slate-900">MBA life before and after UniConnect</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <XCircle className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-red-800">Without UniConnect</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Scrolling LinkedIn hoping the right person notices you",
                "Generic career advice that applies to everyone and no one",
                "Finding out about the perfect internship 3 days after it closed",
                "Coffee chats with alumni who give the same advice as Google",
                "Cold emailing VCs and hearing nothing back",
                "Searching for a technical co-founder at a business school",
                "Missing the networking event that was on 4 different WhatsApp groups",
                "Asking ChatGPT for advice — it doesn't know your network",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-red-800">
                  <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-green-800">With UniConnect</h3>
            </div>
            <ul className="space-y-3">
              {[
                "AI surfaces the right alumni for your goal — with a warm intro drafted",
                "Personalised 5-phase career roadmap naming real people from your network",
                "New matched opportunities added to your Career GPS every morning at 9 AM",
                "Mentors who specifically walked the career path you want to walk",
                "Warm intro to a thesis-matched investor through a shared alumni connection",
                "Co-founder matching page where technical and business profiles meet",
                "One unified events feed — filterable, with deadlines and host details",
                "AI built on your real network data, not generic internet training data",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-green-800">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Problems & Solutions */}
      <section id="problems" className="max-w-6xl mx-auto px-6 pb-24 space-y-10">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full mb-3">8 Problems, 8 Solutions</span>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Every obstacle — with a direct answer</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Each section names the real problem, shows why it exists, and explains exactly how UniConnect fixes it.</p>
        </div>

        {problems.map((p) => {
          const c = colorMap[p.color];
          const Icon = p.icon;
          return (
            <div key={p.id} className={`rounded-3xl border-2 ${c.border} overflow-hidden`}>
              {/* Problem header */}
              <div className={`bg-gradient-to-r ${c.gradient} p-6 text-white`}>
                <div className="flex items-start gap-4">
                  <span className="text-4xl flex-shrink-0">{p.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wide">Problem {p.id}</span>
                    </div>
                    <h3 className="text-2xl font-bold">{p.problem}</h3>
                    <p className="text-white/80 text-sm mt-2 max-w-3xl leading-relaxed">{p.context}</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-0">
                {/* Pain points */}
                <div className="p-6 border-r border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-4 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Why it happens
                  </p>
                  <ul className="space-y-3">
                    {p.painPoints.map((pain, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        {pain}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Solution */}
                <div className={`p-6 ${c.bg}`}>
                  <p className={`text-xs font-bold uppercase tracking-widest ${c.text} mb-1 flex items-center gap-1.5`}>
                    <Icon className="w-3.5 h-3.5" /> UniConnect Solution
                  </p>
                  <h4 className="font-bold text-slate-900 text-base mb-2">{p.solution}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{p.solutionDesc}</p>
                  <ul className="space-y-2">
                    {p.solutionPoints.map((sp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${c.text}`} />
                        {sp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* How it works in 3 steps */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest bg-white/10 text-white/60 px-3 py-1 rounded-full mb-3">Quick Start</span>
            <h2 className="text-3xl font-bold mb-3">Up and running in 5 minutes</h2>
            <p className="text-slate-400">Three steps to activate every AI agent for your career.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Create your profile",
                desc: "Sign up as a Student. Fill in your program, skills, career interests, and work experience. The more context you give, the sharper the AI gets.",
                color: "text-blue-400",
              },
              {
                step: "02",
                title: "Set your Career Goal",
                desc: "Go to Career GPS and select your goal — or write your own. This single action activates your personalised roadmap, AI Advisor, and daily cron enrichment.",
                color: "text-indigo-400",
              },
              {
                step: "03",
                title: "Let AI work for you",
                desc: "Open AI Advisor for your match list. Check Career GPS every morning for new additions. Request introductions. Book mentor sessions. Apply to opportunities.",
                color: "text-violet-400",
              },
            ].map(s => (
              <div key={s.step} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className={`text-4xl font-black mb-4 ${s.color}`}>{s.step}</p>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial-style quotes (placeholder) */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900">What changes for students</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "I set my goal as VC and within seconds had a roadmap naming three alumni at Sequoia, Accel, and a local fund — with specific steps to reach them.",
                role: "MBA Student, Finance Background",
                icon: "🎯",
              },
              {
                quote: "Every morning my Career GPS has new additions. It found a fintech internship that wasn't on any public board — posted by an alumni who joined the platform.",
                role: "EMBA Student, Fintech Focus",
                icon: "⚡",
              },
              {
                quote: "The AI intro email was better than anything I would have written. It referenced my thesis and the investor's portfolio in the same paragraph. Got a reply same day.",
                role: "MBA Student, Building a Startup",
                icon: "✉️",
              },
            ].map((t, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6">
                <span className="text-3xl block mb-4">{t.icon}</span>
                <p className="text-slate-700 text-sm leading-relaxed italic mb-4">"{t.quote}"</p>
                <p className="text-xs text-slate-400 font-medium">— {t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600 py-20 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">Stop navigating MBA alone.</h2>
          <p className="text-indigo-200 text-lg mb-8 leading-relaxed">
            Every problem on this page has a solution waiting for you inside UniConnect. Set your career goal today and your AI roadmap will be ready in seconds.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/auth/signup/student" className="bg-white text-indigo-700 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition text-sm flex items-center gap-2">
              Create my free account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/guide" className="border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition text-sm flex items-center gap-2">
              <Star className="w-4 h-4" /> Read the Platform Guide
            </Link>
          </div>
          <p className="text-indigo-300 text-xs mt-6">Free to join · No credit card required · Works from day one</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-slate-400 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-slate-700">UniConnect</span>
            <span>— Built for MBA Students</span>
          </div>
          <div className="flex gap-6 flex-wrap">
            <Link href="/" className="hover:text-slate-700">Home</Link>
            <Link href="/guide" className="hover:text-slate-700">Platform Guide</Link>
            <Link href="/auth/signup/student" className="hover:text-slate-700">Sign Up</Link>
            <Link href="/auth/login" className="hover:text-slate-700">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
