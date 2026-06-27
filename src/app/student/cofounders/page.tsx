"use client"
import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Loader2, Plus, X, Handshake } from "lucide-react"

type StudentProfile = {
  program?: string
  specialization?: string
  career_goal?: string
  skills?: string[]
  bio?: string
}

type Profile = {
  id: string
  full_name: string
  student_profiles: StudentProfile | null
}

type IdeaPost = {
  title: string
  description: string
  skills: string
  author: string
}

export default function CofoundersPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<Record<string, boolean>>({})
  const [connected, setConnected] = useState<Record<string, boolean>>({})
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [currentName, setCurrentName] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [ideas, setIdeas] = useState<IdeaPost[]>(() => {
    if (typeof window !== "undefined") {
      try { return JSON.parse(localStorage.getItem("cofounder_ideas") || "[]") } catch { return [] }
    }
    return []
  })
  const [ideaForm, setIdeaForm] = useState({ title: "", description: "", skills: "" })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentUserId(user.id)
        const { data: p } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()
        if (p) setCurrentName(p.full_name)
      }

      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, student_profiles(program, specialization, career_goal, skills, bio)")
        .eq("role", "student")

      const founderProfiles = ((data || []) as Profile[]).filter(p => {
        const goal = p.student_profiles?.career_goal?.toLowerCase() || ""
        return goal.includes("founder") || goal.includes("startup") || goal.includes("entrepreneur") || goal.includes("venture")
      })
      setProfiles(founderProfiles)
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleConnect(recipientId: string) {
    if (connecting[recipientId] || connected[recipientId]) return
    setConnecting(prev => ({ ...prev, [recipientId]: true }))
    await fetch("/api/connections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipient_id: recipientId })
    })
    setConnected(prev => ({ ...prev, [recipientId]: true }))
    setConnecting(prev => ({ ...prev, [recipientId]: false }))
  }

  function postIdea() {
    if (!ideaForm.title.trim()) return
    const newIdea: IdeaPost = { ...ideaForm, author: currentName || "Anonymous" }
    const updated = [newIdea, ...ideas]
    setIdeas(updated)
    if (typeof window !== "undefined") localStorage.setItem("cofounder_ideas", JSON.stringify(updated))
    setIdeaForm({ title: "", description: "", skills: "" })
    setShowModal(false)
  }

  function getInitials(name: string) {
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
  }

  return (
    <>
      <Topbar title="Find Your Co-founder" subtitle="Connect with fellow MBAs who want to build something" />
      <main className="flex-1 p-6 space-y-6 max-w-5xl">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Aspiring Founders", value: profiles.length, color: "text-indigo-600" },
            { label: "Ideas Posted", value: ideas.length, color: "text-emerald-600" },
            { label: "Connections Made", value: Object.values(connected).filter(Boolean).length, color: "text-amber-600" },
          ].map(m => (
            <Card key={m.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <Handshake className={`w-5 h-5 ${m.color}`} />
                <div>
                  <p className="text-xl font-bold text-slate-900">{m.value}</p>
                  <p className="text-xs text-slate-500">{m.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Founders Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" /> Aspiring Founders
            </h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            </div>
          ) : profiles.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Handshake className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="font-semibold text-slate-700">No co-founders yet</p>
                <p className="text-sm text-slate-500 mt-1">Students who set a founder/startup career goal will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {profiles.map(person => {
                if (person.id === currentUserId) return null
                const sp = person.student_profiles
                const skills = sp?.skills || []
                return (
                  <Card key={person.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                          {getInitials(person.full_name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-slate-900">{person.full_name}</p>
                          <p className="text-xs text-slate-500">{sp?.program || "MBA"}{sp?.specialization ? ` · ${sp.specialization}` : ""}</p>
                          {sp?.career_goal && (
                            <p className="text-xs text-indigo-600 mt-1">Goal: {sp.career_goal}</p>
                          )}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {skills.slice(0, 4).map(s => (
                              <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s}</span>
                            ))}
                          </div>
                          {sp?.bio && <p className="text-xs text-slate-600 mt-2 line-clamp-2">{sp.bio}</p>}
                        </div>
                        <Button
                          size="sm"
                          variant={connected[person.id] ? "outline" : "default"}
                          disabled={connected[person.id] || connecting[person.id]}
                          onClick={() => handleConnect(person.id)}
                          className="flex-shrink-0 text-xs"
                        >
                          {connecting[person.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : connected[person.id] ? "Pending" : "Connect"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Ideas Board */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-900">💡 Startup Ideas Board</h2>
            <Button size="sm" onClick={() => setShowModal(true)} className="gap-1 text-xs">
              <Plus className="w-3 h-3" /> Post Idea
            </Button>
          </div>
          {ideas.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-sm text-slate-500">No ideas posted yet. Be the first to share your startup concept!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {ideas.map((idea, i) => (
                <Card key={i}>
                  <CardContent className="p-4 space-y-2">
                    <p className="font-semibold text-sm text-slate-900">{idea.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-3">{idea.description}</p>
                    {idea.skills && (
                      <p className="text-xs text-indigo-600">Looking for: {idea.skills}</p>
                    )}
                    <p className="text-xs text-slate-400">— {idea.author}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Post a Startup Idea</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl leading-none"><X /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Idea Title *</label>
                <input
                  value={ideaForm.title}
                  onChange={e => setIdeaForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. AI-powered campus food delivery"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Description</label>
                <textarea
                  value={ideaForm.description}
                  onChange={e => setIdeaForm(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  placeholder="What problem are you solving? What's the vision?"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Skills Looking For</label>
                <input
                  value={ideaForm.skills}
                  onChange={e => setIdeaForm(p => ({ ...p, skills: e.target.value }))}
                  placeholder="e.g. Technical co-founder, UI/UX designer"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <Button className="w-full" onClick={postIdea} disabled={!ideaForm.title.trim()}>Post Idea</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
