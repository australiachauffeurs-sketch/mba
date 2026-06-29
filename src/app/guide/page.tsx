import Link from "next/link";
import {
  Sparkles, Users, Brain, TrendingUp, BookOpen, Briefcase, Building2,
  Calendar, MapPin, MessageSquare, ArrowRight, CheckCircle, Zap, Star,
  GraduationCap, DollarSign, Clock, Globe, Shield, BarChart3, Rocket,
  Target, Network, FileText, Award, Search, Bell, Settings,
} from "lucide-react";

// ─── data ────────────────────────────────────────────────────────────────────

const roles = [
  {
    id: "student",
    icon: "🎓",
    label: "Student",
    color: "from-blue-600 to-indigo-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-700",
    description: "Current MBA, EMBA, or PhD students looking to accelerate their career with AI-powered mentorship, job matching, and network building.",
    features: [
      { icon: MapPin, label: "Career GPS", desc: "Set your career goal and get a personalised 5-phase AI roadmap naming real alumni in your network by name. Updates automatically with new opportunities." },
      { icon: Brain, label: "AI Advisor", desc: "AI analyses your profile — skills, goals, interests — and surfaces the most relevant alumni mentors, job opportunities, co-founders, and faculty to connect with." },
      { icon: Users, label: "My Network", desc: "Send connection requests to anyone in the platform. View who has connected back and build your professional network over time." },
      { icon: BookOpen, label: "Mentors", desc: "Browse alumni who have marked themselves available for mentoring. Filter by industry, expertise, and availability to find the right guide." },
      { icon: Briefcase, label: "Opportunities", desc: "Browse all jobs, internships, workshops, and volunteer roles posted by organisations and alumni. Apply directly on the platform." },
      { icon: Calendar, label: "Events & Clubs", desc: "Discover campus events, virtual workshops, networking nights, and hackathons posted by organisations and faculty." },
      { icon: Users, label: "Co-founders", desc: "Find other students and alumni who want to start something together. Filter by skills, industry interest, and commitment level." },
      { icon: MessageSquare, label: "Messages", desc: "Direct messaging with anyone in your network — mentors, recruiters, co-founders, and faculty." },
    ],
    gettingStarted: [
      "Sign up and complete your profile with your program, skills, and career interests",
      "Set your Career Goal — this powers the AI roadmap and all recommendations",
      "Review your AI Advisor suggestions and request introductions",
      "Browse Mentors and book a session with someone aligned to your goal",
      "Apply to Opportunities and register for upcoming Events",
    ],
  },
  {
    id: "alumni",
    icon: "🏆",
    label: "Alumni",
    color: "from-purple-600 to-violet-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    badge: "bg-purple-100 text-purple-700",
    description: "University graduates giving back through mentoring, hiring, and connecting with the next generation of business leaders.",
    features: [
      { icon: Brain, label: "AI Advisor", desc: "AI scans student profiles matching your expertise and surfaces the best candidates to mentor, hire, or advise — personalised to your industry and role." },
      { icon: Users, label: "Students to Mentor", desc: "View students who have requested mentoring in your area. Accept sessions, track your impact, and build your reputation as a mentor." },
      { icon: Briefcase, label: "Hiring Matches", desc: "See MBA students whose profiles match your hiring needs. Post internship and full-time roles visible to the entire student body." },
      { icon: Rocket, label: "Startups", desc: "Discover student and alumni startups looking for advisors, co-founders, early investors, or domain experts." },
      { icon: MessageSquare, label: "Messages", desc: "Direct messaging with students, fellow alumni, faculty, and investors across the platform." },
    ],
    gettingStarted: [
      "Complete your profile with your current role, company, industry, and expertise",
      "Toggle 'Open to Mentoring' and 'Open to Hiring' in your profile",
      "Review AI Advisor to find students to mentor and co-investors to meet",
      "Accept mentoring requests from students in your field",
      "Explore startups and connect with founders who could use your experience",
    ],
  },
  {
    id: "faculty",
    icon: "📚",
    label: "Faculty",
    color: "from-green-600 to-emerald-600",
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    badge: "bg-green-100 text-green-700",
    description: "Professors, researchers, and lecturers connecting their academic work to industry partners, student talent, and collaboration opportunities.",
    features: [
      { icon: Brain, label: "AI Advisor", desc: "AI matches your research areas with students looking for research projects, industry partners doing adjacent work, and investors interested in academic spinouts." },
      { icon: Search, label: "Research Matches", desc: "Find students whose thesis topics and interests align with your current research. Surface collaboration opportunities across disciplines." },
      { icon: Users, label: "Students", desc: "Browse students by program, skills, and interests. Invite high-performers into your research projects or capstone supervisions." },
      { icon: Globe, label: "Collaborations", desc: "Connect with industry partners, fellow faculty, and alumni working on applied problems in your research domain." },
      { icon: MessageSquare, label: "Messages", desc: "Direct communication with students, alumni, and external collaborators." },
    ],
    gettingStarted: [
      "Build your profile with research areas, publications, and projects",
      "Toggle 'Open to Collaboration' to appear in student and industry searches",
      "Use AI Advisor to find students aligned with your current research",
      "Post research opportunities that students can apply for",
      "Connect with industry partners doing applied work in your domain",
    ],
  },
  {
    id: "investor",
    icon: "💰",
    label: "Investor",
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700",
    description: "VCs, angels, and institutional investors accessing thesis-matched MBA founder deal flow, academic spinout opportunities, and warm intros.",
    features: [
      { icon: Brain, label: "AI Advisor", desc: "AI reads your investment thesis, stage focus, and sector preferences and surfaces founder profiles, startups, and research spinouts that match your mandate." },
      { icon: TrendingUp, label: "Deal Flow", desc: "A continuously updated feed of startups founded by students and alumni, filtered by your thesis, geography, and stage preferences." },
      { icon: Rocket, label: "Startups", desc: "Browse all startups on the platform. Filter by industry, stage, traction level, and founder background. Request warm intros through shared connections." },
      { icon: Users, label: "Founders", desc: "Directly access founder profiles — their background, previous experience, co-founders, and pitch materials." },
      { icon: DollarSign, label: "Portfolio", desc: "Track startups you have invested in or are monitoring. Log check sizes, stage, and notes." },
      { icon: MessageSquare, label: "Messages", desc: "Direct messaging with founders, fellow investors for syndication, and faculty working on commercialisable research." },
    ],
    gettingStarted: [
      "Complete your investor profile with thesis, stages, sectors, geography, and check size",
      "Review AI Advisor deal flow — it updates as new founders join",
      "Save startups to your portfolio watchlist",
      "Use AI Introduction Writer to request warm intros through shared alumni connections",
      "Connect with faculty working on deep-tech research in your focus sectors",
    ],
  },
  {
    id: "organisation",
    icon: "🏢",
    label: "Organisation / Club",
    color: "from-teal-600 to-emerald-600",
    bg: "bg-teal-50",
    border: "border-teal-200",
    text: "text-teal-700",
    badge: "bg-teal-100 text-teal-700",
    description: "Companies, university clubs, NGOs, startups, and associations posting opportunities and events directly to MBA students and alumni.",
    features: [
      { icon: Briefcase, label: "Post Opportunities", desc: "Create internships, full-time roles, volunteer positions, research roles, part-time contracts, and workshops. Add skills required, deadline, stipend, and work mode." },
      { icon: Calendar, label: "Manage Events", desc: "Create seminars, networking nights, hackathons, recruitment events, webinars, and workshops. Supports both in-person and virtual events with registration deadlines." },
      { icon: Users, label: "Applications", desc: "Review all student applications to your posted opportunities. Update statuses (Pending → Reviewing → Shortlisted → Accepted/Rejected) with one click." },
      { icon: Building2, label: "Organisation Profile", desc: "Full public profile with description, industry, logo, website, social links, team size, and founding year — visible to all platform members." },
      { icon: MessageSquare, label: "Messages", desc: "Direct communication with applicants, interested students, and platform members." },
    ],
    gettingStarted: [
      "Sign up as Organisation and complete your profile with logo and description",
      "Use 'Post New' to create your first opportunity or event",
      "Review incoming applications from the Applications page",
      "Update application statuses to keep candidates informed",
      "Create recurring events to build brand recognition on campus",
    ],
  },
];

const agents = [
  {
    icon: "🎯",
    name: "Student AI Advisor",
    route: "/api/ai/recommendations",
    trigger: "When a student opens the AI Advisor page",
    model: "GPT-4o mini",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
    what: "Reads the student's career goal, skills, program, work experience, and interests from the database.",
    does: "Scans all alumni, faculty, and investor profiles in the platform. Scores and ranks the most relevant people and opportunities. Returns 5–7 categories of personalised recommendations — alumni to connect with, mentors to book, courses to take, clubs to join, co-founders, internships — with a specific 'why this matters for you' for each item.",
    useCases: [
      "Student sets goal as 'Investment Banking' — AI surfaces MBB alumni at Goldman, suggests consulting club, flags case prep urgency",
      "Student wants to be a founder — AI finds technical co-founder matches, surfaces EIR mentors, recommends Entrepreneurship Club",
      "First-week MBA student — AI gives a 'start here' list based on their undergraduate background",
    ],
    caching: "Results are cached in the database. Only regenerates when the student changes their career goal.",
  },
  {
    icon: "🗺️",
    name: "Career GPS Roadmap",
    route: "/api/ai/career-roadmap",
    trigger: "When a student saves a career goal for the first time (or changes it)",
    model: "GPT-4o mini",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    what: "Pulls real data from the DB: alumni scored by keyword relevance to the goal, currently open opportunities, and upcoming events.",
    does: "Generates a 5-phase career roadmap (Foundation → Exploration → Building → Execution → Launch) with specific milestones, actions, and timelines. Crucially, it names real people — actual alumni from the platform — in the roadmap. E.g. 'Connect with Sarah Chen (BCG, 2019) for a case-prep session.'",
    useCases: [
      "Student sets goal 'Venture Capital' — gets a 12-month plan naming real VC alumni in the network",
      "Student switches goal from Consulting to Fintech — old roadmap is cleared, new one generated with fintech alumni",
      "Student with prior work experience — AI adapts the timeline to skip beginner milestones",
    ],
    caching: "Roadmap cached in student_profiles.career_roadmap. Cleared automatically when the goal changes.",
  },
  {
    icon: "⚡",
    name: "Career GPS Enrichment (Cron)",
    route: "/api/cron/career-gps",
    trigger: "Automatically — every day at 9:00 AM via Vercel Cron",
    model: "No LLM — keyword scoring logic",
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    what: "Loops through every student with a career goal. For each student, finds all new opportunities and events added since their last enrichment timestamp.",
    does: "Scores each new item against the student's specific career goal using a keyword relevance map (e.g. 'investment banking' → finance, goldman, morgan stanley, bulge bracket). Items above the relevance threshold are inserted into career_gps_updates as 'New Additions' that appear below the roadmap. The original AI roadmap is NEVER modified — only appended to.",
    useCases: [
      "A new Goldman Sachs internship is posted — next morning, all students with 'Investment Banking' goal see it added to their Career GPS",
      "An alumni from McKinsey joins — students with 'Consulting' goal get a new 'Network Addition' suggestion",
      "A finance networking event is created — all finance-goal students receive it as a new GPS update",
    ],
    caching: "Each student has an ai_enriched_at timestamp. Only items newer than that timestamp are processed.",
  },
  {
    icon: "🤝",
    name: "Alumni AI Advisor",
    route: "/api/ai/alumni-recommendations",
    trigger: "When an alumni opens their AI Advisor page",
    model: "GPT-4o mini",
    bg: "bg-purple-50",
    border: "border-purple-200",
    badge: "bg-purple-100 text-purple-700",
    what: "Reads the alumni's job title, company, industry, expertise areas, mentoring and hiring preferences.",
    does: "Generates personalised recommendations across 4 categories: students to hire (matched to their company domain), students to mentor (aligned to their career path), startups to advise (in their sector), and faculty research collaborations (relevant to their industry). Every recommendation references their specific role and background.",
    useCases: [
      "VP at a fintech company — AI surfaces MBA students with finance + coding skills as intern candidates",
      "Alumni who ticked 'Open to Mentor' — gets a prioritised list of students on the same career path they took",
      "Serial entrepreneur alumni — AI suggests student founders in adjacent spaces who would benefit from their experience",
    ],
    caching: "Results cached in alumni_profiles.ai_recommendations. Re-runs when profile is updated.",
  },
  {
    icon: "📚",
    name: "Faculty AI Advisor",
    route: "/api/ai/faculty-recommendations",
    trigger: "When a faculty member opens their AI Advisor page",
    model: "GPT-4o mini",
    bg: "bg-green-50",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700",
    what: "Reads the faculty member's department, title, research areas, and collaboration preferences.",
    does: "Returns 4 recommendation categories: students for research (whose thesis topics overlap with their work), grant opportunities in their domain, industry partners doing applied work in the same area, and alumni or investors interested in research commercialisation.",
    useCases: [
      "Professor in behavioural economics — AI finds PhD students writing theses on decision theory",
      "Faculty researching climate tech — AI surfaces cleantech VCs and corporates funding academic research",
      "Open-to-collaboration professor — students looking for dissertation supervisors are surfaced proactively",
    ],
    caching: "Results cached in faculty_profiles.ai_recommendations.",
  },
  {
    icon: "💰",
    name: "Investor AI Advisor",
    route: "/api/ai/investor-recommendations",
    trigger: "When an investor opens their AI Advisor page",
    model: "GPT-4o mini",
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    what: "Reads the investor's firm, sector focus, stage preference, check size, geography, and investment thesis.",
    does: "Returns thesis-matched recommendations: startups in their focus sectors currently raising, founders to meet (alumni + students), co-investors for syndication with overlapping mandates, and faculty research with near-term commercial/IP potential.",
    useCases: [
      "Seed-stage fintech investor — AI surfaces MBA founders building fintech products currently raising pre-seed",
      "Impact investor — finds NGO and social enterprise founders from the alumni network",
      "Deep-tech VC — surfaces faculty research in AI/biotech with commercialisation potential",
    ],
    caching: "Results cached in investor_profiles.ai_recommendations.",
  },
  {
    icon: "✉️",
    name: "AI Introduction Writer",
    route: "/api/ai/introduce",
    trigger: "When any user clicks 'Request Introduction' between two people",
    model: "GPT-4o mini",
    bg: "bg-rose-50",
    border: "border-rose-200",
    badge: "bg-rose-100 text-rose-700",
    what: "Fetches both people's full profiles from the database — name, role, company, expertise, goals.",
    does: "Drafts a warm, specific 3-paragraph introduction email (under 150 words) that references actual details from each person's profile. Paragraph 1: who each person is. Paragraph 2: why they should connect. Paragraph 3: call to action for a brief call. The user can edit and send it.",
    useCases: [
      "Student wants to be introduced to a Goldman Sachs alumni — AI writes a tailored intro citing the student's finance background",
      "Faculty wants to connect a PhD student with an industry partner — AI references the student's thesis and the partner's R&D focus",
      "Investor wants a warm intro to a founder through a shared alumni connection",
    ],
    caching: "No caching — generated fresh each time to reflect current profiles.",
  },
];

const platformCapabilities = [
  { icon: Shield, label: "Role-Based Access", desc: "Every page is protected. Each role sees only their relevant dashboard, data, and features. Auth via Supabase." },
  { icon: Bell, label: "Real-Time Notifications", desc: "Connection requests, messages, mentor session bookings, and application updates trigger instant in-app notifications." },
  { icon: Network, label: "Connection Graph", desc: "Send, accept, and decline connection requests. The platform tracks the entire connection graph across all roles." },
  { icon: MessageSquare, label: "Unified Messaging", desc: "Any platform member can message any other. Full conversation threads with read receipts and unread counts in the sidebar." },
  { icon: Search, label: "Global Search", desc: "Search across all users, opportunities, events, and startups in one place — filterable by role, industry, and type." },
  { icon: BarChart3, label: "Admin Analytics", desc: "University admins see platform-wide engagement: connection rates, mentor sessions, jobs applied, events attended, and AI match scores." },
  { icon: Rocket, label: "Startup Ecosystem", desc: "Students and alumni can list startups with pitch decks, team info, funding stage, and traction. Investors and alumni can invest or advise." },
  { icon: Award, label: "Mentor Sessions", desc: "Students book structured mentor sessions with alumni. Sessions have an agenda, notes, and outcome tracking." },
  { icon: FileText, label: "Rich Profiles", desc: "Every role has a full profile — projects (JSONB), work history, publications, certifications, portfolio companies — all editable inline." },
  { icon: Globe, label: "Vercel + Supabase", desc: "Deployed on Vercel with automatic preview deployments on every push. Supabase handles auth, database, and row-level security." },
  { icon: Zap, label: "Cron Automation", desc: "Vercel Cron Jobs run the Career GPS enrichment agent every morning — fully automated, zero manual intervention." },
  { icon: Settings, label: "Organisation Tools", desc: "Companies and clubs get their own dashboard to post opportunities, manage events, and track applications — like a mini ATS." },
];

const techStack = [
  { label: "Framework", value: "Next.js 16 (App Router)" },
  { label: "Auth & Database", value: "Supabase (PostgreSQL + RLS)" },
  { label: "AI Model", value: "GPT-4o mini (OpenAI)" },
  { label: "Styling", value: "Tailwind CSS" },
  { label: "Deployment", value: "Vercel (with Cron Jobs)" },
  { label: "Language", value: "TypeScript" },
];

// ─── page ─────────────────────────────────────────────────────────────────────

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">UniConnect</span>
            <span className="text-slate-400 text-sm font-normal ml-1">/ Platform Guide</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-slate-600 hover:text-slate-900">Sign In</Link>
            <Link href="/auth/signup" className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            <Sparkles className="w-4 h-4" /> AI-Native University Network Platform
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">UniConnect Platform Guide</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about the platform — roles, AI agents, features, and how to get the most out of the network.
          </p>
          <div className="flex justify-center gap-6 mt-10 flex-wrap">
            {[
              { label: "User Roles", value: "5" },
              { label: "AI Agents", value: "7" },
              { label: "Core Features", value: "12+" },
              { label: "Automated Daily", value: "1 Cron" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold">{s.value}</p>
                <p className="text-white/60 text-sm mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOC */}
      <div className="bg-white border-b border-slate-200 sticky top-14 z-40">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
          <div className="flex gap-6 h-12 items-center text-sm font-medium whitespace-nowrap">
            {[
              ["#roles", "User Roles"],
              ["#agents", "AI Agents"],
              ["#features", "Platform Features"],
              ["#howto", "How to Use"],
              ["#tech", "Tech Stack"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="text-slate-500 hover:text-indigo-600 transition-colors flex-shrink-0">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">

        {/* ── ROLES ── */}
        <section id="roles">
          <SectionHeader
            badge="5 User Roles"
            title="Who is this platform for?"
            subtitle="UniConnect serves every stakeholder in the university ecosystem — each with their own dedicated dashboard, AI advisor, and feature set."
          />
          <div className="space-y-8 mt-10">
            {roles.map(role => (
              <div key={role.id} className={`rounded-2xl border-2 ${role.border} bg-white overflow-hidden`}>
                <div className={`bg-gradient-to-r ${role.color} p-6 text-white`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{role.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold">{role.label}</h3>
                      <p className="text-white/80 text-sm mt-0.5 max-w-2xl">{role.description}</p>
                    </div>
                    <Link href={`/auth/signup/${role.id}`} className="ml-auto flex-shrink-0 bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-lg transition flex items-center gap-1">
                      Sign up as {role.label} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                    {role.features.map(f => {
                      const Icon = f.icon;
                      return (
                        <div key={f.label} className={`${role.bg} rounded-xl p-4`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className={`w-4 h-4 ${role.text}`} />
                            <span className={`text-xs font-bold ${role.text}`}>{f.label}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Getting Started</p>
                    <ol className="space-y-1.5">
                      {role.gettingStarted.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className={`w-5 h-5 rounded-full ${role.badge} text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5`}>{i + 1}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── AI AGENTS ── */}
        <section id="agents">
          <SectionHeader
            badge="7 AI Agents"
            title="The AI brain of UniConnect"
            subtitle="Every AI agent reads real data from the database and generates context-aware, personalised output — not generic templates."
          />
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-start gap-2">
            <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span><strong>Powered by OpenAI GPT-4o mini.</strong> All agents require an <code>OPENAI_API_KEY</code> environment variable set in Vercel. Without it, agents return a high-quality static fallback — the platform never breaks.</span>
          </div>
          <div className="space-y-6 mt-8">
            {agents.map(agent => (
              <div key={agent.name} className={`rounded-2xl border-2 ${agent.border} ${agent.bg} p-6`}>
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{agent.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h3 className="text-lg font-bold text-slate-900">{agent.name}</h3>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${agent.badge}`}>{agent.route}</span>
                      {agent.model.includes("No LLM") ? (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">No LLM — keyword logic</span>
                      ) : (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-medium">{agent.model}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mb-4 flex items-center gap-1"><Clock className="w-3 h-3" /> Triggers: {agent.trigger}</p>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white/70 rounded-xl p-4">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">What it reads</p>
                        <p className="text-sm text-slate-700">{agent.what}</p>
                      </div>
                      <div className="bg-white/70 rounded-xl p-4">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">What it produces</p>
                        <p className="text-sm text-slate-700">{agent.does}</p>
                      </div>
                    </div>

                    <div className="bg-white/70 rounded-xl p-4">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Real-world use cases</p>
                      <ul className="space-y-1.5">
                        {agent.useCases.map((uc, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {uc}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-xs text-slate-400 mt-3 flex items-center gap-1"><Star className="w-3 h-3" /> {agent.caching}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features">
          <SectionHeader
            badge="12+ Platform Capabilities"
            title="What the platform can do"
            subtitle="Beyond the role-specific dashboards, UniConnect has a shared infrastructure layer that powers the entire network."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {platformCapabilities.map(cap => {
              const Icon = cap.icon;
              return (
                <div key={cap.label} className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">{cap.label}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── HOW TO USE ── */}
        <section id="howto">
          <SectionHeader
            badge="Quick Start"
            title="How to get the most out of UniConnect"
            subtitle="Follow these steps depending on your role to activate the AI and unlock the full network."
          />
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><span className="text-xl">🎓</span> Students — activate AI in 3 steps</h3>
              <ol className="space-y-4">
                {[
                  { step: "1", title: "Set your Career Goal", desc: "Go to Career GPS → Select your goal (or write a custom one). This is the single most important action — it powers your roadmap and all AI recommendations." },
                  { step: "2", title: "Complete your profile", desc: "Fill in Skills, Career Interests, and Work Experience in My Profile. The more context you give the AI, the more specific and accurate its recommendations." },
                  { step: "3", title: "Open AI Advisor", desc: "Go to AI Advisor and read the personalised analysis. Request introductions to the recommended alumni. Book a mentor session. Apply to surfaced opportunities." },
                ].map(s => (
                  <li key={s.step} className="flex gap-4">
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{s.step}</div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{s.title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><span className="text-xl">🏢</span> Organisations — post in 2 steps</h3>
              <ol className="space-y-4">
                {[
                  { step: "1", title: "Complete your Organisation Profile", desc: "Add your logo URL, description, industry, type, and social links. A complete profile gets significantly more engagement from students browsing the platform." },
                  { step: "2", title: "Post your first Opportunity or Event", desc: "Go to Post New → Choose Opportunity (for jobs/internships) or Event (for workshops/networking). Fill in details, skills required, deadline, and publish. It's immediately visible to all students." },
                ].map(s => (
                  <li key={s.step} className="flex gap-4">
                    <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{s.step}</div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{s.title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><span className="text-xl">🏆</span> Alumni — give back in 3 steps</h3>
              <ol className="space-y-4">
                {[
                  { step: "1", title: "Build your rich profile", desc: "Add your work history, expertise areas, current company and role. The AI uses this to match you with students on the same career path you walked." },
                  { step: "2", title: "Toggle your preferences", desc: "In My Profile, enable 'Open to Mentoring' and/or 'Open to Hiring'. This makes you discoverable in student searches and activates the AI matching." },
                  { step: "3", title: "Check AI Advisor weekly", desc: "Your AI Advisor surfaces new students to mentor and hire as they join. The more you engage, the better the matches get." },
                ].map(s => (
                  <li key={s.step} className="flex gap-4">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{s.step}</div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{s.title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><span className="text-xl">💡</span> Pro tips for everyone</h3>
              <ul className="space-y-3">
                {[
                  "The AI only knows what's in your profile — the more you fill in, the better every recommendation gets.",
                  "Career GPS is live on Vercel Cron — check it every morning for new opportunities matched to your goal.",
                  "Use the AI Introduction Writer for every cold outreach — a personalised intro converts 3× better than a blank message.",
                  "Organisations: respond to applications quickly — students have multiple offers and move fast.",
                  "Investors: fill in your full thesis description — the AI reads it literally to find matching founders.",
                  "Faculty: add all your research areas as separate tags — each one increases how many students and partners find you.",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <Star className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── TECH STACK ── */}
        <section id="tech">
          <SectionHeader
            badge="Built With"
            title="The technology stack"
            subtitle="UniConnect is built on modern, production-grade infrastructure — fully serverless, globally deployed, and AI-native."
          />
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
            {techStack.map(t => (
              <div key={t.label} className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{t.label}</p>
                <p className="font-bold text-slate-900 mt-1">{t.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-slate-900 text-slate-300 rounded-2xl p-6 text-sm font-mono space-y-2">
            <p className="text-slate-500"># Architecture overview</p>
            <p><span className="text-indigo-400">User request</span> → Next.js App Router → Supabase SSR auth check → Role-specific page</p>
            <p><span className="text-green-400">AI request</span> → /api/ai/* → Supabase DB (read profile) → OpenAI GPT-4o mini → Cache in DB → Return JSON</p>
            <p><span className="text-amber-400">Cron (9AM daily)</span> → /api/cron/career-gps → Loop all students → Score new opps/events → Insert career_gps_updates</p>
            <p><span className="text-purple-400">Auth flow</span> → Supabase auth.signUp → profiles.insert → role_profiles.insert → redirect to /{"{role}"}</p>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-3">Ready to join the network?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">Create your account in under 2 minutes and let the AI start working for you immediately.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            {[
              { href: "/auth/signup/student", label: "Join as Student", bg: "bg-white text-indigo-700" },
              { href: "/auth/signup/alumni", label: "Join as Alumni", bg: "bg-white/20 text-white border border-white/30" },
              { href: "/auth/signup/organisation", label: "Register Organisation", bg: "bg-white/20 text-white border border-white/30" },
            ].map(btn => (
              <Link key={btn.href} href={btn.href} className={`${btn.bg} font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition text-sm`}>
                {btn.label}
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-slate-700">UniConnect</span>
            <span>— AI University Network</span>
          </div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-slate-700">Home</Link>
            <Link href="/auth/login" className="hover:text-slate-700">Sign In</Link>
            <Link href="/auth/signup" className="hover:text-slate-700">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <span className="inline-block text-xs font-bold uppercase tracking-widest bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full mb-3">{badge}</span>
      <h2 className="text-3xl font-bold text-slate-900 mb-3">{title}</h2>
      <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
    </div>
  );
}
