import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const otherUserId = searchParams.get("with")
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // ── Thread view ──────────────────────────────────────────────────────────
  if (otherUserId) {
    const { data } = await supabase
      .from("messages")
      .select("id, sender_id, recipient_id, content, read, created_at")
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user.id})`)
      .order("created_at", { ascending: true })

    // Mark received messages as read
    await supabase
      .from("messages")
      .update({ read: true })
      .eq("recipient_id", user.id)
      .eq("sender_id", otherUserId)
      .eq("read", false)

    return NextResponse.json(data ?? [])
  }

  // ── Conversation list ─────────────────────────────────────────────────────
  // Fetch all messages involving this user (both sent and received)
  const { data: allMessages } = await supabase
    .from("messages")
    .select("id, sender_id, recipient_id, content, read, created_at, sender:sender_id(id, full_name, role), recipient:recipient_id(id, full_name, role)")
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order("created_at", { ascending: false })

  type Profile = { id: string; full_name: string; role: string }
  type ConvEntry = { partner: Profile; lastMessage: string; lastAt: string; unread: number }

  const map = new Map<string, ConvEntry>()

  for (const m of (allMessages ?? [])) {
    const isSent = m.sender_id === user.id
    const partner = isSent
      ? (Array.isArray(m.recipient) ? m.recipient[0] : m.recipient) as Profile | null
      : (Array.isArray(m.sender) ? m.sender[0] : m.sender) as Profile | null

    if (!partner) continue

    if (!map.has(partner.id)) {
      // First (most recent) message for this partner — set as preview
      map.set(partner.id, {
        partner,
        lastMessage: m.content,
        lastAt: m.created_at,
        unread: !isSent && !m.read ? 1 : 0,
      })
    } else {
      // Older messages — only accumulate unread count
      if (!isSent && !m.read) {
        map.get(partner.id)!.unread++
      }
    }
  }

  const conversations = Array.from(map.values())
    .sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime())

  return NextResponse.json(conversations)
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { recipient_id, content } = await req.json()
  if (!recipient_id || !content?.trim()) {
    return NextResponse.json({ error: "recipient_id and content are required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({ sender_id: user.id, recipient_id, content: content.trim() })
    .select("id, sender_id, recipient_id, content, read, created_at")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
