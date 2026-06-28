import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import OpenAI from "openai"

export interface RoadmapAction {
  title: string
  description: string
  type: "connection" | "opportunity" | "skill" | "event" | "research"
  reference_name?: string
  reference_id?: string
}

export interface RoadmapPhase {
  phase: number
  title: string
  duration: string
  description: string
  actions: RoadmapAction[]
}

export interface CareerRoadmap {
  phases: RoadmapPhase[]
  skill_gaps: Array<{ skill: string; priority: "High" | "Medium" | "Low" }>
  insight: string
  recommended_connections: string[]
  network_context: {
    alumni_referenced: number
    opportunities_available: number
    events_upcoming: number
  }
  isAIGenerated: boolean
  generatedAt: string
}

// Goal → relevant industry keywords for filtering DB data
const GOAL_KEYWORDS: Record<string, string[]> = {
  founder: ["startup", "tech", "fintech", "saas", "entrepreneur", "venture", "product"],
  consultant: ["consulting", "strategy", "management", "advisory", "mckinsey", "bcg", "bain"],
  investment_banker: ["finance", "banking", "investment", "capital", "markets", "m&a"],
  vc: ["venture", "investment", "startup", "technology", "finance", "private equity"],
  product_manager: ["technology", "product", "software", "consumer", "tech", "engineering"],
  corporate_strategy: ["strategy", "corporate", "business", "operations", "management"],
  private_equity: ["private equity", "finance", "investment", "buyout", "portfolio"],
  social_impact: ["social", "impact", "non-profit", "sustainability", "education", "health"],
}

const STATIC_PHASES: Record<string, Array<{ duration: string; title: string; actions: string[] }>> = {
  founder: [
    { duration: "Month 1–2", title: "Build Your Network", actions: ["Connect with 3 alumni founders in your sector", "Join the Entrepreneurship Club", "Attend startup pitch events"] },
    { duration: "Month 3–4", title: "Validate Your Idea", actions: ["Define the problem you're solving", "Interview 20 potential customers", "Build a simple MVP or prototype"] },
    { duration: "Month 5–6", title: "Find Co-founders & Advisors", actions: ["Meet technical co-founder candidates", "Join hackathons to find teammates", "Get a faculty advisor for your domain"] },
    { duration: "Month 7–9", title: "Fundraise & Launch", actions: ["Apply to incubators (YC, Antler)", "Pitch angel investors via alumni network", "Launch and acquire first customers"] },
    { duration: "Month 10–12", title: "Scale", actions: ["Raise seed round or bootstrap growth", "Hire your first employees", "Expand to new markets or verticals"] },
  ],
  consultant: [
    { duration: "Month 1–2", title: "Prep & Network", actions: ["Connect with alumni at MBB firms", "Join case prep groups", "Attend consulting firm info sessions"] },
    { duration: "Month 3–4", title: "Case Interview Practice", actions: ["Practice 3 cases per week", "Join Consulting Club mock interviews", "Read FT and HBR daily"] },
    { duration: "Month 5–6", title: "Apply for Internships", actions: ["Apply to summer associate roles", "Get referrals through alumni", "Prepare personal experience stories"] },
    { duration: "Month 7–9", title: "Intern & Convert", actions: ["Ace your summer internship", "Deliver one standout project", "Build relationships with your team"] },
    { duration: "Month 10–12", title: "Full-time Offer", actions: ["Convert internship to full-time offer", "Choose practice area and office", "Prepare for Day 1 as a consultant"] },
  ],
}

function buildStaticRoadmap(goal: string): CareerRoadmap {
  const phases = STATIC_PHASES[goal] || STATIC_PHASES["founder"]
  return {
    phases: phases.map((p, i) => ({
      phase: i + 1,
      title: p.title,
      duration: p.duration,
      description: "",
      actions: p.actions.map(a => ({ title: a, description: "", type: "skill" as const })),
    })),
    skill_gaps: [
      { skill: "Networking", priority: "High" },
      { skill: "Industry Knowledge", priority: "High" },
      { skill: "Executive Communication", priority: "Medium" },
      { skill: "Financial Modeling", priority: "Medium" },
      { skill: "Strategic Thinking", priority: "Low" },
    ],
    insight: `Your roadmap is ready. Connect with alumni, join relevant clubs, and build your skills step by step over the next 12 months.`,
    recommended_connections: [],
    network_context: { alumni_referenced: 0, opportunities_available: 0, events_upcoming: 0 },
    isAIGenerated: false,
    generatedAt: new Date().toISOString(),
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Fetch student profile including cached roadmap
    const [{ data: profile }, { data: sp }] = await Promise.all([
      supabase.from("profiles").select("full_name, bio").eq("id", user.id).single(),
      supabase.from("student_profiles")
        .select("program, specialization, career_goal, custom_career_goal, skills, career_interests, interests, work_experience, gpa, batch_year, career_roadmap, career_roadmap_at")
        .eq("profile_id", user.id).single(),
    ])

    if (!sp?.career_goal) {
      return NextResponse.json({ error: "no_goal" }, { status: 200 })
    }

    // Return cached roadmap if it exists
    if (sp.career_roadmap) {
      return NextResponse.json(sp.career_roadmap as CareerRoadmap)
    }

    const goal = sp.career_goal
    const customGoal = sp.custom_career_goal || ""
    const goalLabel = goal === "custom"
      ? customGoal || "Custom Career Goal"
      : goal.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())

    // Fetch real network data from DB to feed into AI context
    const keywords = GOAL_KEYWORDS[goal] || []

    const [alumniRes, oppsRes, eventsRes, facultyRes] = await Promise.all([
      supabase.from("profiles")
        .select("id, full_name, alumni_profiles(company, job_title, industry, expertise_areas, batch_year)")
        .eq("role", "alumni")
        .limit(20),
      supabase.from("opportunities")
        .select("id, title, company, type, description")
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase.from("events")
        .select("id, title, type, description, event_date")
        .eq("active", true)
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true })
        .limit(10),
      supabase.from("profiles")
        .select("id, full_name, faculty_profiles(department, research_areas, title)")
        .eq("role", "faculty")
        .limit(10),
    ])

    // Score and filter alumni by relevance to career goal
    type AlumniRow = {
      id: string
      full_name: string
      alumni_profiles: {
        company?: string; job_title?: string; industry?: string
        expertise_areas?: string[]; batch_year?: number
      } | null
    }
    const allAlumni = (alumniRes.data || []) as AlumniRow[]
    const scoredAlumni = allAlumni.map(a => {
      const text = [
        a.alumni_profiles?.industry || "",
        a.alumni_profiles?.job_title || "",
        ...(a.alumni_profiles?.expertise_areas || []),
      ].join(" ").toLowerCase()
      const score = keywords.filter(k => text.includes(k)).length
      return { ...a, score }
    }).sort((a, b) => b.score - a.score).slice(0, 5)

    // Format context strings for the prompt
    const alumniContext = scoredAlumni.map((a, i) => {
      const ap = a.alumni_profiles
      const expertise = (ap?.expertise_areas || []).slice(0, 3).join(", ") || "General"
      return `${i + 1}. ${a.full_name} (ID: ${a.id}) — ${ap?.job_title || "Alumni"} at ${ap?.company || "Unknown"} | Industry: ${ap?.industry || "N/A"} | Expertise: ${expertise}${ap?.batch_year ? ` | Batch ${ap.batch_year}` : ""}`
    }).join("\n")

    type OppRow = { id: string; title: string; company?: string; type?: string; description?: string }
    const opps = (oppsRes.data || []).slice(0, 5) as OppRow[]
    const oppsContext = opps.map((o, i) =>
      `${i + 1}. "${o.title}" at ${o.company || "Company"} (${o.type || "opportunity"}) — ${(o.description || "").slice(0, 100)}`
    ).join("\n")

    type EventRow = { id: string; title: string; type?: string; description?: string; event_date?: string }
    const events = (eventsRes.data || []).slice(0, 5) as EventRow[]
    const eventsContext = events.map((e, i) => {
      const dateStr = e.event_date ? new Date(e.event_date).toLocaleDateString("en-AU", { month: "short", day: "numeric" }) : "TBA"
      return `${i + 1}. "${e.title}" (${e.type || "event"}) on ${dateStr} — ${(e.description || "").slice(0, 80)}`
    }).join("\n")

    type FacultyRow = { id: string; full_name: string; faculty_profiles: { department?: string; research_areas?: string[]; title?: string } | null }
    const faculty = (facultyRes.data || []).slice(0, 3) as FacultyRow[]
    const facultyContext = faculty.map((f, i) => {
      const fp = f.faculty_profiles
      return `${i + 1}. ${f.full_name} — ${fp?.title || "Professor"}, ${fp?.department || "Business"} | Research: ${(fp?.research_areas || []).join(", ") || "N/A"}`
    }).join("\n")

    const apiKey = process.env.OPENAI_API_KEY
    const hasValidKey = apiKey && apiKey.length > 10 && !apiKey.startsWith("sk-placeholder")

    if (!hasValidKey) {
      const fallback = buildStaticRoadmap(goal)
      await supabase.from("student_profiles").update({
        career_roadmap: fallback,
        career_roadmap_at: fallback.generatedAt,
      }).eq("profile_id", user.id)
      return NextResponse.json(fallback)
    }

    const openai = new OpenAI({ apiKey })

    const studentContext = [
      `Name: ${profile?.full_name || "Student"}`,
      `Program: ${sp.program || "MBA"}${sp.specialization ? ` — ${sp.specialization}` : ""}`,
      `Career Goal: ${goalLabel}`,
      `Skills: ${(sp.skills || []).join(", ") || "Not specified"}`,
      `Interests: ${(sp.career_interests || []).join(", ") || "Not specified"}`,
      `Work Experience: ${sp.work_experience || "Not specified"}`,
    ].join("\n")

    const systemPrompt = `You are UniConnect AI generating a personalized 12-month MBA career roadmap. You have access to REAL people and opportunities in the university network. Reference them by name in your roadmap to make it feel personal and actionable.

Return JSON with this exact structure:
{
  "phases": [
    {
      "phase": 1,
      "title": "string (e.g. 'Build Your Foundation')",
      "duration": "string (e.g. 'Month 1–2')",
      "description": "1 sentence describing this phase",
      "actions": [
        {
          "title": "Concrete action — ideally referencing a real person or opportunity from context",
          "description": "1-2 sentences. If referencing a real person/opportunity, name them.",
          "type": "connection" | "opportunity" | "skill" | "event" | "research",
          "reference_name": "optional — name of real person or opportunity from context"
        }
      ]
    }
  ],
  "skill_gaps": [
    { "skill": "string", "priority": "High" | "Medium" | "Low" }
  ],
  "insight": "2-3 sentence personalized insight. Reference specific people or opportunities from the context. Sound like a career advisor who knows them personally.",
  "recommended_connections": ["Name1", "Name2", "Name3"],
  "network_context": { "alumni_referenced": number, "opportunities_available": number, "events_upcoming": number },
  "isAIGenerated": true,
  "generatedAt": "${new Date().toISOString()}"
}

Rules:
- 5 phases covering 12 months (2-3 months per phase)
- 3 actions per phase, each specific and actionable
- Reference at least 2-3 REAL people from the alumni/faculty list by their actual names
- Reference at least 1-2 REAL opportunities or events if they're relevant
- Skill gaps: 5 items ordered High→Medium→Low priority
- The insight must feel written specifically for this person, not generic`

    const userMessage = `Generate a personalized career roadmap for this MBA student:

STUDENT PROFILE:
${studentContext}

REAL ALUMNI IN THE NETWORK (reference these by name where relevant):
${alumniContext || "No alumni data available"}

REAL OPEN OPPORTUNITIES (on the platform right now):
${oppsContext || "No opportunities currently listed"}

UPCOMING EVENTS & CLUBS:
${eventsContext || "No upcoming events"}

FACULTY MENTORS:
${facultyContext || "No faculty data available"}`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 3000,
    })

    const roadmap = JSON.parse(completion.choices[0].message.content || "{}") as CareerRoadmap
    roadmap.isAIGenerated = true
    roadmap.generatedAt = new Date().toISOString()
    roadmap.network_context = {
      alumni_referenced: scoredAlumni.length,
      opportunities_available: opps.length,
      events_upcoming: events.length,
    }

    // Persist roadmap to DB
    await supabase.from("student_profiles").update({
      career_roadmap: roadmap,
      career_roadmap_at: roadmap.generatedAt,
    }).eq("profile_id", user.id)

    return NextResponse.json(roadmap)
  } catch (err) {
    console.error("Career roadmap error:", err)
    return NextResponse.json({ error: "generation_failed" }, { status: 500 })
  }
}

// Clear cached roadmap (called when goal changes)
export async function DELETE() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await supabase.from("student_profiles").update({
      career_roadmap: null,
      career_roadmap_at: null,
      ai_enriched_at: null,
    }).eq("profile_id", user.id)

    return NextResponse.json({ cleared: true })
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 })
  }
}
