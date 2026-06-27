import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendEmail, mentorRequestEmail } from "@/lib/email"

const PLATFORM_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://uniconnect.ai"

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { mentor_id, topic } = await req.json()

  const { data, error } = await supabase
    .from("mentor_sessions")
    .insert({ mentor_id, mentee_id: user.id, topic: topic || "General mentoring" })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Send email to mentor
  const [menteeRes, mentorRes] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).single(),
    supabase.from("profiles").select("email").eq("id", mentor_id).single(),
  ])
  const menteeName = menteeRes.data?.full_name ?? "A student"
  const mentorEmail = mentorRes.data?.email
  if (mentorEmail) {
    const { subject, html } = mentorRequestEmail(menteeName, topic || "General mentoring", PLATFORM_URL)
    await sendEmail({ to: mentorEmail, subject, html })
  }

  return NextResponse.json(data)
}
