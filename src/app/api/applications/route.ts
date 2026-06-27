import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const opportunityId = searchParams.get("opportunity_id")

  if (opportunityId) {
    const { data, error } = await supabase
      .from("applications")
      .select(`
        *,
        applicant:applicant_id(full_name, role),
        student_profile:applicant_id(program, specialization, career_goal, skills, gpa)
      `)
      .eq("opportunity_id", opportunityId)
      .order("created_at", { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data || [])
  }

  const { data, error } = await supabase
    .from("applications")
    .select(`
      *,
      opportunity:opportunity_id(title, company, type)
    `)
    .eq("applicant_id", user.id)
    .order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data || [])
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { data, error } = await supabase
    .from("applications")
    .insert({ ...body, applicant_id: user.id, status: "applied" })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function PATCH(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id, status } = await req.json()
  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
