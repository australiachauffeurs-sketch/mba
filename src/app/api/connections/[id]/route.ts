import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendEmail, connectionAcceptedEmail } from "@/lib/email"

const PLATFORM_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://uniconnect.ai"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const { status } = await req.json()

  if (!["accepted", "declined"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  // Fetch connection first to get requester_id for email
  const { data: existing } = await supabase
    .from("connections")
    .select("requester_id")
    .eq("id", id)
    .eq("recipient_id", user.id)
    .single()

  const { data, error } = await supabase
    .from("connections")
    .update({ status })
    .eq("id", id)
    .eq("recipient_id", user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Email the requester when their request is accepted
  if (status === "accepted" && existing?.requester_id) {
    const [acceptorRes, requesterRes] = await Promise.all([
      supabase.from("profiles").select("full_name").eq("id", user.id).single(),
      supabase.from("profiles").select("email").eq("id", existing.requester_id).single(),
    ])
    const acceptorName = acceptorRes.data?.full_name ?? "Someone"
    const requesterEmail = requesterRes.data?.email
    if (requesterEmail) {
      const { subject, html } = connectionAcceptedEmail(acceptorName, PLATFORM_URL)
      await sendEmail({ to: requesterEmail, subject, html })
    }
  }

  return NextResponse.json(data)
}
