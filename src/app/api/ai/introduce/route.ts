import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import OpenAI from "openai"

type ProfileRow = {
  full_name: string | null
  role: string | null
  bio: string | null
  alumni_profiles: { company?: string | null; job_title?: string | null; expertise_areas?: string[] | null } | null
  student_profiles: { program?: string | null; career_goal?: string | null; skills?: string[] | null } | null
  faculty_profiles: { department?: string | null; research_areas?: string[] | null } | null
  investor_profiles: { firm_name?: string | null; sectors?: string[] | null } | null
}

function buildProfile(p: ProfileRow | null): string {
  if (!p) return "Unknown"
  const parts: string[] = [p.full_name ?? "Unknown", `(${p.role ?? "unknown role"})`]
  if (p.alumni_profiles) {
    parts.push(`at ${p.alumni_profiles.company || "a company"} as ${p.alumni_profiles.job_title || "professional"}`)
    if (p.alumni_profiles.expertise_areas?.length) {
      parts.push(`expertise: ${p.alumni_profiles.expertise_areas.join(", ")}`)
    }
  }
  if (p.student_profiles) {
    parts.push(`MBA student, ${p.student_profiles.program || ""}, career goal: ${p.student_profiles.career_goal || "TBD"}`)
    if (p.student_profiles.skills?.length) {
      parts.push(`skills: ${p.student_profiles.skills.join(", ")}`)
    }
  }
  if (p.faculty_profiles) {
    parts.push(`${p.faculty_profiles.department || ""} faculty`)
    if (p.faculty_profiles.research_areas?.length) {
      parts.push(`researches: ${p.faculty_profiles.research_areas.join(", ")}`)
    }
  }
  if (p.investor_profiles) {
    parts.push(`investor at ${p.investor_profiles.firm_name || "firm"}`)
    if (p.investor_profiles.sectors?.length) {
      parts.push(`focuses on: ${p.investor_profiles.sectors.join(", ")}`)
    }
  }
  return parts.join(" ")
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { person_a_id, person_b_id, context } = await req.json()

  const profileSelect = "full_name, role, bio, alumni_profiles(company, job_title, expertise_areas), student_profiles(program, career_goal, skills), faculty_profiles(department, research_areas), investor_profiles(firm_name, sectors)"

  const [aRes, bRes, myRes] = await Promise.all([
    supabase.from("profiles").select(profileSelect).eq("id", person_a_id).single(),
    supabase.from("profiles").select(profileSelect).eq("id", person_b_id).single(),
    supabase.from("profiles").select("full_name, role").eq("id", user.id).single(),
  ])

  const personA = aRes.data as ProfileRow | null
  const personB = bRes.data as ProfileRow | null
  const introducer = myRes.data as { full_name: string | null; role: string | null } | null

  const apiKey = process.env.OPENAI_API_KEY
  const hasKey = apiKey && apiKey.length > 10 && !apiKey.startsWith("sk-placeholder")

  if (!hasKey || !personA || !personB) {
    return NextResponse.json({
      draft: `Hi ${personA?.full_name?.split(" ")[0] || "there"},\n\nI wanted to introduce you to ${personB?.full_name}, who I think you should connect with through UniConnect.\n\n${context ? `Context: ${context}\n\n` : ""}I think you'd both find value in connecting. Would you be open to a 20-minute call?\n\nBest,\n${introducer?.full_name || "A mutual connection"}`,
      isAIGenerated: false,
    })
  }

  const openai = new OpenAI({ apiKey })
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a professional networking assistant. Write a warm, specific, 3-paragraph introduction email connecting two people. Be concise (under 150 words). Reference specific details from their profiles. First paragraph: who each person is. Second: why you think they should connect. Third: call to action for a brief call.",
      },
      {
        role: "user",
        content: `Introduce:\nPerson A: ${buildProfile(personA)}\nPerson B: ${buildProfile(personB)}\nIntroduced by: ${introducer?.full_name}\nContext: ${context || "General networking"}`,
      },
    ],
    max_tokens: 300,
  })

  return NextResponse.json({
    draft: completion.choices[0].message.content || "",
    isAIGenerated: true,
  })
}
