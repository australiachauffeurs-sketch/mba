import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data } = await supabase
    .from("connections")
    .select(
      "*, requester:requester_id(id, full_name, role), recipient:recipient_id(id, full_name, role)"
    )
    .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)

  return NextResponse.json(data || [])
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { recipient_id, message } = await req.json()
  const { data, error } = await supabase
    .from("connections")
    .insert({ requester_id: user.id, recipient_id, message })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
