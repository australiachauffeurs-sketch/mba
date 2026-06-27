"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Plus, Loader2, X, CheckCircle, Users } from "lucide-react"

type Opportunity = {
  id: string
  title: string
  company: string
  type: string
  description: string
  location: string
  salary_range: string | null
  deadline: string | null
  active: boolean
  created_at: string
}

type Applicant = {
  id: string
  status: string
  cover_note: string | null
  created_at: string
  applicant: {
    id: string
    full_name: string
    role: string
    student_profiles: {
      program?: string
      specialization?: string
      career_goal?: string
      skills?: string[]
      gpa?: number
    } | null
  } | null
}

const statusColor: Record<string, string> = {
  applied: "bg-blue-50 text-blue-700",
  reviewed: "bg-amber-50 text-amber-700",
  shortlisted: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
  offered: "bg-emerald-50 text-emerald-700",
}

export default function HiringPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [postings, setPostings] = useState<Opportunity[]>([])
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [selectedOpp, setSelectedOpp] = useState<string | null>(null)
  const [loadingApps, setLoadingApps] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("postings")
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: "", company: "", type: "fulltime",
    description: "", location: "", salary_range: "", deadline: "",
  })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from("opportunities")
        .select("*")
        .eq("posted_by", user.id)
        .order("created_at", { ascending: false })
      setPostings(data ?? [])
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadApplicants(oppId: string) {
    setSelectedOpp(oppId)
    setLoadingApps(true)
    const res = await fetch(`/api/applications?opportunity_id=${oppId}`)
    const data = await res.json()
    setApplicants(Array.isArray(data) ? data : [])
    setLoadingApps(false)
  }

  async function updateStatus(appId: string, status: string) {
    setUpdatingStatus(appId)
    await fetch("/api/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: appId, status }),
    })
    setApplicants(prev => prev.map(a => a.id === appId ? { ...a, status } : a))
    setUpdatingStatus(null)
  }

  async function handleSubmit() {
    setSubmitting(true)
    const res = await fetch("/api/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, active: true }),
    })
    const data = await res.json()
    if (!data.error) {
      setPostings(prev => [data, ...prev])
      setShowModal(false)
      setForm({ title: "", company: "", type: "fulltime", description: "", location: "", salary_range: "", deadline: "" })
    }
    setSubmitting(false)
  }

  async function handleClose(id: string) {
    await supabase.from("opportunities").update({ active: false }).eq("id", id)
    setPostings(prev => prev.map(p => p.id === id ? { ...p, active: false } : p))
  }

  const selectedPosting = postings.find(p => p.id === selectedOpp)

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar title="Hiring" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Hiring</h1>
            <p className="text-sm text-slate-500 mt-0.5">Post and manage your job opportunities</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Post a Job
          </Button>
        </div>

        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-5 w-fit">
          {[{ key: "postings", label: "My Postings" }, { key: "applicants", label: "Applicants" }].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === t.key ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
              }`}>{t.label}</button>
          ))}
        </div>

        {activeTab === "applicants" ? (
          <div className="space-y-4">
            {/* Opportunity selector */}
            {postings.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>Post a job first to see applicants.</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Select a posting to view applicants</label>
                  <select
                    value={selectedOpp ?? ""}
                    onChange={e => { if (e.target.value) loadApplicants(e.target.value) }}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white min-w-[280px]"
                  >
                    <option value="">— Choose a posting —</option>
                    {postings.map(p => <option key={p.id} value={p.id}>{p.title} @ {p.company}</option>)}
                  </select>
                </div>

                {selectedPosting && (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-sm text-indigo-800 font-medium">
                    Showing applicants for: {selectedPosting.title}
                  </div>
                )}

                {loadingApps ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
                ) : selectedOpp && applicants.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p>No applicants yet for this posting.</p>
                  </div>
                ) : applicants.length > 0 ? (
                  <div className="space-y-3">
                    {applicants.map(app => {
                      const sp = app.applicant?.student_profiles
                      return (
                        <Card key={app.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                                {(app.applicant?.full_name ?? "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-semibold text-sm text-slate-900">{app.applicant?.full_name ?? "Unknown"}</p>
                                  {sp?.program && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{sp.program}</span>}
                                  {sp?.gpa && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">GPA {sp.gpa}</span>}
                                </div>
                                {sp?.career_goal && <p className="text-xs text-slate-500 mt-0.5">Goal: {sp.career_goal}</p>}
                                {sp?.skills && sp.skills.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {sp.skills.slice(0, 4).map(s => (
                                      <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s}</span>
                                    ))}
                                  </div>
                                )}
                                {app.cover_note && <p className="text-xs text-slate-600 mt-2 line-clamp-2 italic">&quot;{app.cover_note}&quot;</p>}
                                <p className="text-xs text-slate-400 mt-1">Applied {new Date(app.created_at).toLocaleDateString()}</p>
                              </div>
                              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColor[app.status] ?? "bg-slate-100 text-slate-600"}`}>
                                  {app.status}
                                </span>
                                <select
                                  value={app.status}
                                  disabled={updatingStatus === app.id}
                                  onChange={e => updateStatus(app.id, e.target.value)}
                                  className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                                >
                                  <option value="applied">Applied</option>
                                  <option value="reviewed">Reviewed</option>
                                  <option value="shortlisted">Shortlisted</option>
                                  <option value="rejected">Rejected</option>
                                  <option value="offered">Offered</option>
                                </select>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : null}
              </>
            )}
          </div>
        ) : loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
        ) : postings.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No postings yet. Post your first job!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {postings.map(p => (
              <Card key={p.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-semibold text-sm text-slate-900">{p.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          p.type === "internship" ? "bg-blue-50 text-blue-700" :
                          p.type === "fulltime" ? "bg-green-50 text-green-700" :
                          p.type === "research" ? "bg-purple-50 text-purple-700" : "bg-slate-100 text-slate-600"
                        }`}>{p.type}</span>
                        {p.active
                          ? <span className="flex items-center gap-1 text-xs text-green-600 font-medium"><CheckCircle className="w-3 h-3" /> Active</span>
                          : <span className="text-xs text-slate-400 font-medium">Closed</span>}
                      </div>
                      <p className="text-xs text-slate-500">{p.company} · {p.location}</p>
                      <p className="text-xs text-slate-400 mt-1">Posted {new Date(p.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button size="sm" variant="outline" className="text-xs" onClick={() => { setActiveTab("applicants"); loadApplicants(p.id) }}>
                        <Users className="w-3 h-3 mr-1" /> Applicants
                      </Button>
                      {p.active && (
                        <Button size="sm" variant="outline" className="text-xs text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleClose(p.id)}>
                          Close
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Post a Job</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Job Title", key: "title", type: "text" },
                { label: "Company", key: "company", type: "text" },
                { label: "Location", key: "location", type: "text" },
                { label: "Salary Range", key: "salary_range", type: "text" },
                { label: "Application Deadline", key: "deadline", type: "date" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-slate-700 mb-1">{label}</label>
                  <input type={type} value={(form as Record<string, string>)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300">
                  <option value="fulltime">Full-time</option>
                  <option value="internship">Internship</option>
                  <option value="research">Research</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleSubmit} disabled={submitting} className="flex-1">{submitting ? "Posting..." : "Post"}</Button>
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
