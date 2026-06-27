import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")?.trim()
  if (!q || q.length < 2) return NextResponse.json({ people: [], opportunities: [], startups: [] })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const [peopleRes, oppsRes, startupsRes] = await Promise.all([
    supabase.from("profiles")
      .select("id, full_name, role, alumni_profiles(company, job_title), faculty_profiles(department, designation), student_profiles(program, specialization), investor_profiles(firm_name, investor_type)")
      .ilike("full_name", `%${q}%`)
      .neq("id", user.id)
      .limit(8),
    supabase.from("opportunities")
      .select("id, title, company, type, location")
      .or(`title.ilike.%${q}%,company.ilike.%${q}%,description.ilike.%${q}%`)
      .eq("active", true)
      .limit(5),
    supabase.from("startups")
      .select("id, name, tagline, sector, stage")
      .or(`name.ilike.%${q}%,tagline.ilike.%${q}%,sector.ilike.%${q}%`)
      .limit(5),
  ])

  return NextResponse.json({
    people: peopleRes.data || [],
    opportunities: oppsRes.data || [],
    startups: startupsRes.data || [],
  })
}
