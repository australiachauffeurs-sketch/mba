import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendEmail, connectionRequestEmail } from "@/lib/email"

const PLATFORM_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://uniconnect.ai"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data } = await supabase
    .from("connections")
    .select("*, requester:requester_id(id, full_name, role), recipient:recipient_id(id, full_name, role)")
    .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)

  return NextResponse.json(data || [])
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { recipient_id, message } = await req.json()
  const { data, error } = await supabase
    .from("connections")
    .insert({ requester_id: user.id, recipient_id, message })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Send email notification (non-blocking)
  const [senderRes, recipientRes] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).single(),
    supabase.from("profiles").select("email").eq("id", recipient_id).single(),
  ])
  const senderName = senderRes.data?.full_name ?? "Someone"
  const recipientEmail = recipientRes.data?.email
  if (recipientEmail) {
    const { subject, html } = connectionRequestEmail(senderName, PLATFORM_URL)
    await sendEmail({ to: recipientEmail, subject, html })
  }

  return NextResponse.json(data)
}
