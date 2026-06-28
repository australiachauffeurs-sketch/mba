import { NextResponse } from "next/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Goal → keywords used to score relevance of new opportunities/events
const GOAL_KEYWORDS: Record<string, string[]> = {
  founder: ["startup", "founder", "entrepreneur", "product", "venture", "tech", "innovation", "launch", "saas", "growth"],
  consultant: ["consulting", "strategy", "advisory", "mckinsey", "bcg", "bain", "management", "analysis", "strategy"],
  investment_banker: ["finance", "banking", "investment", "capital", "m&a", "mergers", "acquisitions", "deals", "equity"],
  vc: ["venture", "investment", "startup", "fund", "portfolio", "angel", "seed", "series", "investor"],
  product_manager: ["product", "pm", "roadmap", "agile", "tech", "software", "ux", "data", "customer", "engineering"],
  corporate_strategy: ["strategy", "corporate", "business development", "operations", "transformation", "planning"],
  private_equity: ["private equity", "buyout", "lbo", "portfolio", "fund", "finance", "investment", "acquisition"],
  social_impact: ["social", "impact", "ngo", "non-profit", "sustainability", "csr", "community", "education", "health"],
}

// Opportunity type → career goals it's relevant for
const TYPE_GOAL_MAP: Record<string, string[]> = {
  internship: ["consultant", "investment_banker", "vc", "product_manager", "private_equity", "social_impact", "founder"],
  fulltime: ["consultant", "investment_banker", "product_manager", "corporate_strategy", "private_equity", "social_impact"],
  research: ["social_impact", "corporate_strategy", "founder"],
  contract: ["founder", "consultant", "product_manager"],
}

// Event type → career goals it's relevant for
const EVENT_GOAL_MAP: Record<string, string[]> = {
  event: ["founder", "consultant", "investment_banker", "vc", "product_manager", "corporate_strategy", "private_equity", "social_impact"],
  club: ["founder", "consultant", "investment_banker", "vc", "product_manager", "social_impact"],
  competition: ["founder", "consultant", "investment_banker", "vc", "product_manager"],
  conference: ["consultant", "investment_banker", "vc", "corporate_strategy", "social_impact"],
  scholarship: ["social_impact", "founder", "product_manager"],
  workshop: ["founder", "product_manager", "consultant", "investment_banker"],
}

function scoreRelevance(text: string, keywords: string[]): number {
  const lower = text.toLowerCase()
  const matches = keywords.filter(k => lower.includes(k.toLowerCase()))
  return keywords.length > 0 ? matches.length / keywords.length : 0
}

export async function POST(req: Request) {
  // Verify this is called by Vercel cron or internal
  const authHeader = req.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // Fetch all students who have set a career goal
    const { data: students, error: studentsError } = await supabase
      .from("student_profiles")
      .select("id, career_goal, custom_career_goal, skills, career_interests, ai_enriched_at")
      .not("career_goal", "is", null)

    if (studentsError || !students?.length) {
      return NextResponse.json({ enriched: 0, message: "No students with goals" })
    }

    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    let totalInserted = 0

    // Fetch new opportunities and events added since last global enrichment window
    const [oppsRes, eventsRes] = await Promise.all([
      supabase.from("opportunities")
        .select("id, title, company, type, description, created_at")
        .eq("active", true)
        .gte("created_at", sevenDaysAgo.toISOString()),
      supabase.from("events")
        .select("id, title, type, description, event_date, created_at")
        .eq("active", true)
        .gte("event_date", now.toISOString())
        .order("event_date", { ascending: true })
        .limit(50),
    ])

    const newOpps = oppsRes.data || []
    const upcomingEvents = eventsRes.data || []

    for (const student of students) {
      const goal = student.career_goal as string
      const lastEnriched = student.ai_enriched_at ? new Date(student.ai_enriched_at) : sevenDaysAgo
      const goalKeywords = GOAL_KEYWORDS[goal] || []

      // Only look at items added since last enrichment for this student
      const freshOpps = newOpps.filter(o => new Date(o.created_at) > lastEnriched)
      const freshEvents = upcomingEvents  // all upcoming events are relevant to check

      const inserts: Array<{
        student_id: string
        type: string
        title: string
        description: string
        why_relevant: string
        reference_id: string
        reference_type: string
      }> = []

      // Score and filter opportunities
      for (const opp of freshOpps) {
        const oppText = [opp.title, opp.company || "", opp.description || ""].join(" ")
        const keywordScore = scoreRelevance(oppText, goalKeywords)
        const typeMatch = TYPE_GOAL_MAP[opp.type || ""]?.includes(goal)

        if (keywordScore >= 0.1 || typeMatch) {
          // Check if we already have this opportunity for this student
          const { count } = await supabase
            .from("career_gps_updates")
            .select("*", { count: "exact", head: true })
            .eq("student_id", student.id)
            .eq("reference_id", opp.id)
            .eq("reference_type", "opportunity")

          if ((count ?? 0) === 0) {
            inserts.push({
              student_id: student.id,
              type: "opportunity",
              title: opp.title,
              description: `${opp.type || "Opportunity"} at ${opp.company || "Company"}. ${(opp.description || "").slice(0, 150)}`,
              why_relevant: `This ${opp.type || "opportunity"} aligns with your ${goal.replace(/_/g, " ")} career path${keywordScore > 0.2 ? " and matches your target skills" : ""}.`,
              reference_id: opp.id,
              reference_type: "opportunity",
            })
          }
        }
      }

      // Score and filter events
      for (const event of freshEvents) {
        const eventText = [event.title, event.description || "", event.type || ""].join(" ")
        const keywordScore = scoreRelevance(eventText, goalKeywords)
        const typeMatch = EVENT_GOAL_MAP[event.type || "event"]?.includes(goal)

        if (keywordScore >= 0.15 || typeMatch) {
          const { count } = await supabase
            .from("career_gps_updates")
            .select("*", { count: "exact", head: true })
            .eq("student_id", student.id)
            .eq("reference_id", event.id)
            .eq("reference_type", "event")

          if ((count ?? 0) === 0) {
            const dateStr = event.event_date
              ? new Date(event.event_date).toLocaleDateString("en-AU", { weekday: "short", month: "short", day: "numeric" })
              : "TBA"
            inserts.push({
              student_id: student.id,
              type: "event",
              title: event.title,
              description: `${event.type === "club" ? "Club" : "Event"} on ${dateStr}. ${(event.description || "").slice(0, 150)}`,
              why_relevant: `This ${event.type || "event"} is relevant to your ${goal.replace(/_/g, " ")} goal and can help you build your network and skills.`,
              reference_id: event.id,
              reference_type: "event",
            })
          }
        }
      }

      if (inserts.length > 0) {
        const { error } = await supabase.from("career_gps_updates").insert(inserts)
        if (!error) totalInserted += inserts.length
      }

      // Update ai_enriched_at for this student
      await supabase.from("student_profiles")
        .update({ ai_enriched_at: now.toISOString() })
        .eq("id", student.id)
    }

    return NextResponse.json({
      success: true,
      students_processed: students.length,
      updates_added: totalInserted,
      timestamp: now.toISOString(),
    })
  } catch (err) {
    console.error("Career GPS cron error:", err)
    return NextResponse.json({ error: "cron_failed" }, { status: 500 })
  }
}
