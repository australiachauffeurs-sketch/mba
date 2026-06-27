import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const otherUserId = searchParams.get("with")
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (otherUserId) {
    // Get thread between two users
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user.id})`)
      .order("created_at", { ascending: true })
    // Mark as read
    await supabase.from("messages").update({ read: true }).eq("recipient_id", user.id).eq("sender_id", otherUserId)
    return NextResponse.json(data || [])
  }

  // Get all conversations (latest message per conversation partner)
  const { data: sent } = await supabase
    .from("messages")
    .select("*, recipient:recipient_id(id, full_name, role)")
    .eq("sender_id", user.id)
    .order("created_at", { ascending: false })
  const { data: received } = await supabase
    .from("messages")
    .select("*, sender:sender_id(id, full_name, role)")
    .eq("recipient_id", user.id)
    .order("created_at", { ascending: false })

  type Partner = { id: string; full_name: string; role: string }
  type ConvEntry = { partner: Partner; lastMessage: string; lastAt: string; unread: number }

  const map = new Map<string, ConvEntry>()

  for (const m of (sent || [])) {
    const r = m.recipient as Partner
    if (r && !map.has(r.id)) {
      map.set(r.id, { partner: r, lastMessage: m.content, lastAt: m.created_at, unread: 0 })
    }
  }
  for (const m of (received || [])) {
    const s = m.sender as Partner
    if (s && !map.has(s.id)) {
      map.set(s.id, { partner: s, lastMessage: m.content, lastAt: m.created_at, unread: m.read ? 0 : 1 })
    } else if (s) {
      const existing = map.get(s.id)!
      if (!m.read) existing.unread++
    }
  }

  return NextResponse.json(
    Array.from(map.values()).sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime())
  )
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { recipient_id, content } = await req.json()
  const { data, error } = await supabase
    .from("messages")
    .insert({ sender_id: user.id, recipient_id, content })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
