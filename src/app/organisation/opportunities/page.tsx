"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2, Plus, Trash2, Edit2, Briefcase, X,
  CheckCircle, AlertCircle, Users, DollarSign, Calendar,
} from "lucide-react";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const OPP_TYPES = ["internship", "full-time", "part-time", "contract", "volunteer", "research", "workshop", "other"];
const INDUSTRIES = [
  "Technology", "Finance", "Consulting", "Healthcare", "Education", "Media", "Retail",
  "Manufacturing", "Real Estate", "Government", "Non-profit", "Legal", "Other",
];
const WORK_MODES = ["on-site", "hybrid", "remote"];

interface Opp {
  id: string;
  title: string;
  description: string;
  type: string;
  industry: string;
  location: string;
  work_mode: string;
  stipend: string;
  salary_range: string;
  deadline: string;
  start_date: string;
  skills_required: string[];
  requirements: string;
  benefits: string;
  open: boolean;
  created_at: string;
}

function blank(): Partial<Opp> {
  return {
    title: "", description: "", type: "internship", industry: "", location: "",
    work_mode: "hybrid", stipend: "", salary_range: "", deadline: "",
    start_date: "", skills_required: [], requirements: "", benefits: "", open: true,
  };
}

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white ${className}`} {...props} />;
}

function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white resize-none ${className}`} {...props} />;
}

function Select({ children, className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return <select className={`w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white ${className}`} {...props}>{children}</select>;
}

export default function OrganisationOpportunitiesPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [opps, setOpps] = useState<Opp[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<Opp>>(blank());
  const [editId, setEditId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [skillInput, setSkillInput] = useState("");

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  const load = useCallback(async (uid: string) => {
    const { data } = await supabase.from("opportunities").select("*").eq("posted_by", uid).order("created_at", { ascending: false });
    setOpps(data || []);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      load(user.id).finally(() => setLoading(false));
    });
  }, [load]);

  function openCreate() { setEditing(blank()); setEditId(null); setSkillInput(""); setShowForm(true); }
  function openEdit(o: Opp) { setEditing({ ...o }); setEditId(o.id); setSkillInput(""); setShowForm(true); }

  function addSkill() {
    const s = skillInput.trim();
    if (s && !editing.skills_required?.includes(s)) setEditing(p => ({ ...p, skills_required: [...(p.skills_required || []), s] }));
    setSkillInput("");
  }

  async function saveOpp() {
    if (!userId || !editing.title) { showToast("error", "Title is required"); return; }
    setSaving(true);
    try {
      const payload = {
        posted_by: userId,
        title: editing.title,
        description: editing.description || "",
        type: editing.type || "other",
        industry: editing.industry || "",
        location: editing.location || "",
        work_mode: editing.work_mode || "hybrid",
        stipend: editing.stipend || "",
        salary_range: editing.salary_range || "",
        deadline: editing.deadline || null,
        start_date: editing.start_date || null,
        skills_required: editing.skills_required || [],
        requirements: editing.requirements || "",
        benefits: editing.benefits || "",
        open: editing.open !== false,
      };

      if (editId) {
        const { error } = await supabase.from("opportunities").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("opportunities").insert(payload);
        if (error) throw error;
      }

      showToast("success", editId ? "Opportunity updated!" : "Opportunity posted!");
      setShowForm(false);
      await load(userId);
    } catch (e: any) {
      showToast("error", e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function deleteOpp(id: string) {
    if (!userId) return;
    await supabase.from("opportunities").delete().eq("id", id).eq("posted_by", userId);
    setOpps(prev => prev.filter(o => o.id !== id));
    showToast("success", "Opportunity deleted");
  }

  async function toggleOpen(o: Opp) {
    await supabase.from("opportunities").update({ open: !o.open }).eq("id", o.id);
    setOpps(prev => prev.map(p => p.id === o.id ? { ...p, open: !p.open } : p));
  }

  if (loading) return <div className="flex items-center justify-center h-full p-12"><Loader2 className="w-6 h-6 animate-spin text-emerald-600" /></div>;

  const open = opps.filter(o => o.open);
  const closed = opps.filter(o => !o.open);

  return (
    <>
      <Topbar title="Opportunities" subtitle="Post jobs, internships, and workshops" />
      <main className="flex-1 p-6 space-y-6">
        {toast && (
          <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${toast.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
            {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-40 flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 className="font-semibold text-lg text-slate-900">{editId ? "Edit Opportunity" : "Post New Opportunity"}</h2>
                <button onClick={() => setShowForm(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
              </div>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
                  <Input value={editing.title} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))} placeholder="Finance Internship – Summer 2025" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <Textarea value={editing.description} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))} rows={4} placeholder="What will the applicant be doing?" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                    <Select value={editing.type} onChange={e => setEditing(p => ({ ...p, type: e.target.value }))}>
                      {OPP_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                    <Select value={editing.industry} onChange={e => setEditing(p => ({ ...p, industry: e.target.value }))}>
                      <option value="">Select…</option>
                      {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <Input value={editing.location} onChange={e => setEditing(p => ({ ...p, location: e.target.value }))} placeholder="Sydney, NSW" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Work Mode</label>
                    <Select value={editing.work_mode} onChange={e => setEditing(p => ({ ...p, work_mode: e.target.value }))}>
                      {WORK_MODES.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Stipend / Pay</label>
                    <Input value={editing.stipend} onChange={e => setEditing(p => ({ ...p, stipend: e.target.value }))} placeholder="$2,500/month" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Salary Range</label>
                    <Input value={editing.salary_range} onChange={e => setEditing(p => ({ ...p, salary_range: e.target.value }))} placeholder="$80k–$100k" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Application Deadline</label>
                    <Input type="date" value={editing.deadline?.split("T")[0]} onChange={e => setEditing(p => ({ ...p, deadline: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                    <Input type="date" value={editing.start_date?.split("T")[0]} onChange={e => setEditing(p => ({ ...p, start_date: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Skills Required</label>
                  <div className="flex gap-1 flex-wrap mb-2">
                    {(editing.skills_required || []).map(s => (
                      <span key={s} className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                        {s}<button onClick={() => setEditing(p => ({ ...p, skills_required: (p.skills_required || []).filter(x => x !== s) }))}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input value={skillInput} onChange={e => setSkillInput(e.target.value)} placeholder="e.g. Excel, Python" onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} />
                    <Button type="button" variant="outline" onClick={addSkill} className="flex-shrink-0">Add</Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Requirements</label>
                  <Textarea value={editing.requirements} onChange={e => setEditing(p => ({ ...p, requirements: e.target.value }))} rows={3} placeholder="Currently enrolled MBA student, min GPA 3.0…" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Benefits</label>
                  <Textarea value={editing.benefits} onChange={e => setEditing(p => ({ ...p, benefits: e.target.value }))} rows={2} placeholder="Health insurance, flexible hours, mentorship…" />
                </div>
              </div>
              <div className="flex gap-3 justify-end p-6 border-t border-slate-100">
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button onClick={saveOpp} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editId ? "Update" : "Post Opportunity"}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">{open.length} open · {closed.length} closed</p>
          <Button onClick={openCreate} className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" /> Post Opportunity
          </Button>
        </div>

        {opps.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-medium text-slate-600">No opportunities posted yet</p>
              <p className="text-sm text-slate-400 mt-1">Post jobs, internships, or workshops for students</p>
              <Button onClick={openCreate} className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">Post Opportunity</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {open.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Open</h3>
                <div className="space-y-3">
                  {open.map(o => <OppCard key={o.id} opp={o} onEdit={openEdit} onDelete={deleteOpp} onToggle={toggleOpen} />)}
                </div>
              </div>
            )}
            {closed.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">Closed</h3>
                <div className="space-y-3 opacity-70">
                  {closed.map(o => <OppCard key={o.id} opp={o} onEdit={openEdit} onDelete={deleteOpp} onToggle={toggleOpen} />)}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

function OppCard({ opp, onEdit, onDelete, onToggle }: { opp: Opp; onEdit: (o: Opp) => void; onDelete: (id: string) => void; onToggle: (o: Opp) => void }) {
  return (
    <Card>
      <CardContent className="p-5 flex items-start gap-4">
        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
          <Briefcase className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-slate-900">{opp.title}</p>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{opp.type}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${opp.open ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
              {opp.open ? "Open" : "Closed"}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1.5 flex-wrap">
            {opp.industry && <span className="text-xs text-slate-400">{opp.industry}</span>}
            {opp.location && <span className="text-xs text-slate-400 flex items-center gap-1"><span>📍</span>{opp.location}</span>}
            {opp.work_mode && <span className="text-xs text-slate-400">{opp.work_mode}</span>}
            {opp.stipend && <span className="text-xs text-emerald-600 flex items-center gap-1"><DollarSign className="w-3 h-3" />{opp.stipend}</span>}
            {opp.deadline && <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" />Deadline: {new Date(opp.deadline).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}</span>}
          </div>
          {opp.skills_required?.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {opp.skills_required.slice(0, 5).map(s => <span key={s} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{s}</span>)}
              {opp.skills_required.length > 5 && <span className="text-xs text-slate-400">+{opp.skills_required.length - 5}</span>}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => onToggle(opp)} className={`text-xs px-3 py-1 rounded-lg border transition ${opp.open ? "border-slate-200 text-slate-600 hover:bg-slate-50" : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"}`}>
            {opp.open ? "Close" : "Reopen"}
          </button>
          <button onClick={() => onEdit(opp)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition"><Edit2 className="w-4 h-4" /></button>
          <button onClick={() => onDelete(opp.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4" /></button>
        </div>
      </CardContent>
    </Card>
  );
}
