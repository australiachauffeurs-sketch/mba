"use client";

import { useState, useEffect, useCallback, KeyboardEvent } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus, X, Save, ExternalLink, BookOpen, FlaskConical,
  GraduationCap, Trophy, Link2, BarChart2, ChevronDown, ChevronUp,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Publication {
  id: string;
  title: string;
  journal: string;
  year: string;
  type: "Journal Article" | "Conference Paper" | "Book Chapter" | "Working Paper";
  url: string;
  co_authors: string[];
  abstract: string;
}

interface ResearchProject {
  id: string;
  title: string;
  description: string;
  year: string;
  status: "Active" | "Completed" | "Proposed";
  funding: string;
  collaborators: string[];
}

interface FormState {
  // profiles table
  full_name: string;
  email: string;
  phone: string;
  // faculty_profiles table
  bio: string;
  title: string;
  department: string;
  faculty_id: string;
  designation: string;
  joining_year: string;
  office_location: string;
  headline: string;
  location: string;
  research_areas: string[];
  active_grants: string;
  h_index: string;
  publications_count: string;
  google_scholar_url: string;
  orcid_id: string;
  publications: Publication[];
  research_projects: ResearchProject[];
  courses_taught: string[];
  open_to_collaborate: boolean;
  achievements: string;
  linkedin_url: string;
  website_url: string;
}

const EMPTY_FORM: FormState = {
  full_name: "",
  email: "",
  phone: "",
  bio: "",
  title: "",
  department: "",
  faculty_id: "",
  designation: "",
  joining_year: "",
  office_location: "",
  headline: "",
  location: "",
  research_areas: [],
  active_grants: "",
  h_index: "",
  publications_count: "",
  google_scholar_url: "",
  orcid_id: "",
  publications: [],
  research_projects: [],
  courses_taught: [],
  open_to_collaborate: false,
  achievements: "",
  linkedin_url: "",
  website_url: "",
};

const EMPTY_PUB: Omit<Publication, "id"> = {
  title: "",
  journal: "",
  year: "",
  type: "Journal Article",
  url: "",
  co_authors: [],
  abstract: "",
};

const EMPTY_PROJECT: Omit<ResearchProject, "id"> = {
  title: "",
  description: "",
  year: "",
  status: "Active",
  funding: "",
  collaborators: [],
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Chip Input ───────────────────────────────────────────────────────────────

function ChipInput({
  label,
  chips,
  onChange,
  placeholder,
}: {
  label: string;
  chips: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  function add() {
    const v = input.trim();
    if (v && !chips.includes(v)) onChange([...chips, v]);
    setInput("");
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { e.preventDefault(); add(); }
    if (e.key === "Backspace" && !input && chips.length) {
      onChange(chips.slice(0, -1));
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div className="flex flex-wrap gap-1.5 p-2 border border-slate-300 rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 bg-white">
        {chips.map((c) => (
          <span key={c} className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full">
            {c}
            <button type="button" onClick={() => onChange(chips.filter((x) => x !== c))} className="hover:text-indigo-600">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          onBlur={add}
          placeholder={chips.length === 0 ? (placeholder ?? "Type and press Enter") : ""}
          className="flex-1 min-w-[120px] outline-none text-sm text-slate-800 bg-transparent"
        />
      </div>
    </div>
  );
}

// ─── Field helper ─────────────────────────────────────────────────────────────

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400";
const textareaCls =
  "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y placeholder:text-slate-400";
const selectCls =
  "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white";

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function FacultyProfilePage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Publication inline form
  const [showPubForm, setShowPubForm] = useState(false);
  const [pubDraft, setPubDraft] = useState<Omit<Publication, "id">>(EMPTY_PUB);
  const [expandedPub, setExpandedPub] = useState<string | null>(null);
  const [coAuthorsInput, setCoAuthorsInput] = useState("");

  // Project inline form
  const [showProjForm, setShowProjForm] = useState(false);
  const [projDraft, setProjDraft] = useState<Omit<ResearchProject, "id">>(EMPTY_PROJECT);
  const [collabInput, setCollabInput] = useState("");

  const set = useCallback(<K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: val }));
  }, []);

  // ── Load ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);

      const [{ data: prof }, { data: fac }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("faculty_profiles").select("*").eq("profile_id", user.id).single(),
      ]);

      setForm({
        full_name: prof?.full_name ?? "",
        email: prof?.email ?? user.email ?? "",
        phone: prof?.phone ?? "",
        bio: fac?.bio ?? prof?.bio ?? "",
        title: fac?.title ?? "",
        department: fac?.department ?? "",
        faculty_id: fac?.faculty_id ?? "",
        designation: fac?.designation ?? "",
        joining_year: fac?.joining_year != null ? String(fac.joining_year) : "",
        office_location: fac?.office_location ?? "",
        headline: fac?.headline ?? "",
        location: fac?.location ?? "",
        research_areas: fac?.research_areas ?? [],
        active_grants: fac?.active_grants ?? "",
        h_index: fac?.h_index != null ? String(fac.h_index) : "",
        publications_count: fac?.publications_count != null ? String(fac.publications_count) : "",
        google_scholar_url: fac?.google_scholar_url ?? "",
        orcid_id: fac?.orcid_id ?? "",
        publications: fac?.publications ?? [],
        research_projects: fac?.research_projects ?? [],
        courses_taught: fac?.courses_taught ?? [],
        open_to_collaborate: fac?.open_to_collaborate ?? fac?.open_to_collaboration ?? false,
        achievements: Array.isArray(fac?.achievements)
          ? (fac.achievements as string[]).join("\n")
          : (fac?.achievements ?? ""),
        linkedin_url: fac?.linkedin_url ?? "",
        website_url: fac?.website_url ?? "",
      });

      setLoading(false);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Save ──────────────────────────────────────────────────────────────────

  async function handleSave() {
    if (!userId) return;
    setSaving(true);
    setToast(null);

    const achievementsArr = form.achievements
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from("profiles").upsert({
        id: userId,
        full_name: form.full_name,
        phone: form.phone,
        bio: form.bio,
        linkedin_url: form.linkedin_url,
      }),
      supabase.from("faculty_profiles").upsert({
        profile_id: userId,
        bio: form.bio,
        title: form.title,
        department: form.department,
        faculty_id: form.faculty_id,
        designation: form.designation,
        joining_year: form.joining_year ? parseInt(form.joining_year) : null,
        office_location: form.office_location,
        headline: form.headline,
        location: form.location,
        research_areas: form.research_areas,
        active_grants: form.active_grants,
        h_index: form.h_index ? parseInt(form.h_index) : null,
        publications_count: form.publications_count ? parseInt(form.publications_count) : null,
        google_scholar_url: form.google_scholar_url,
        orcid_id: form.orcid_id,
        publications: form.publications,
        research_projects: form.research_projects,
        courses_taught: form.courses_taught,
        open_to_collaborate: form.open_to_collaborate,
        open_to_collaboration: form.open_to_collaborate,
        achievements: achievementsArr,
        linkedin_url: form.linkedin_url,
        website_url: form.website_url,
        updated_at: new Date().toISOString(),
      }),
    ]);

    if (e1 || e2) {
      setToast({ type: "error", msg: e1?.message ?? e2?.message ?? "Save failed" });
    } else {
      setToast({ type: "success", msg: "Profile saved successfully!" });
      setTimeout(() => setToast(null), 3500);
    }
    setSaving(false);
  }

  // ── Completion ────────────────────────────────────────────────────────────

  const completionFields: boolean[] = [
    !!form.full_name,
    !!form.bio,
    !!form.title,
    !!form.department,
    !!form.designation,
    !!form.headline,
    form.research_areas.length > 0,
    form.courses_taught.length > 0,
    form.publications.length > 0,
    !!form.linkedin_url || !!form.website_url,
  ];
  const completionPct = Math.round(
    (completionFields.filter(Boolean).length / completionFields.length) * 100
  );

  const initials = form.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "FA";

  const activeGrantsCount = form.active_grants
    .split("\n")
    .filter((l) => l.trim()).length;

  // ── Publication handlers ──────────────────────────────────────────────────

  function addPublication() {
    if (!pubDraft.title || !pubDraft.journal || !pubDraft.year) return;
    const parsed: Publication = {
      id: uid(),
      ...pubDraft,
      co_authors: coAuthorsInput.split(",").map((s) => s.trim()).filter(Boolean),
    };
    set("publications", [...form.publications, parsed]);
    setPubDraft(EMPTY_PUB);
    setCoAuthorsInput("");
    setShowPubForm(false);
  }

  function removePub(id: string) {
    set("publications", form.publications.filter((p) => p.id !== id));
  }

  // ── Project handlers ──────────────────────────────────────────────────────

  function addProject() {
    if (!projDraft.title || !projDraft.year) return;
    const parsed: ResearchProject = {
      id: uid(),
      ...projDraft,
      collaborators: collabInput.split(",").map((s) => s.trim()).filter(Boolean),
    };
    set("research_projects", [...form.research_projects, parsed]);
    setProjDraft(EMPTY_PROJECT);
    setCollabInput("");
    setShowProjForm(false);
  }

  function removeProject(id: string) {
    set("research_projects", form.research_projects.filter((p) => p.id !== id));
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Topbar
        title="Faculty Profile"
        subtitle="Share your research and expertise with the network"
      />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 ${
            toast.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {toast.msg}
          <button onClick={() => setToast(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6">
        {/* ── Profile Header ─────────────────────────────────────────────── */}
        <div className="mb-6 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent)]" />
          <div className="relative flex items-start gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-2xl font-bold flex-shrink-0 select-none">
              {initials}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold truncate">{form.full_name || "Your Name"}</h2>
              <p className="text-indigo-200 text-sm truncate mt-0.5">
                {[form.title, form.department].filter(Boolean).join(" · ") || "Faculty Member"}
              </p>
              {form.headline && (
                <p className="text-white/80 text-sm mt-1 truncate">{form.headline}</p>
              )}
              {/* Completion bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-indigo-200 mb-1">
                  <span>Profile completion</span>
                  <span className="font-semibold text-white">{completionPct}%</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
              </div>
            </div>
            {/* Save button */}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-shrink-0 bg-white text-indigo-700 hover:bg-indigo-50 border-0 shadow-md font-semibold"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <Save className="w-4 h-4 mr-1" />
              )}
              {saving ? "Saving…" : "Save Profile"}
            </Button>
          </div>
        </div>

        {/* ── Two-column layout ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT — 2/3 */}
          <div className="lg:col-span-2 space-y-6">

            {/* Personal & Academic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  Personal &amp; Academic Information
                </CardTitle>
                <CardDescription>Basic details shown on your public profile</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" required>
                  <input
                    className={inputCls}
                    value={form.full_name}
                    onChange={(e) => set("full_name", e.target.value)}
                    placeholder="Dr. Priya Sharma"
                  />
                </Field>
                <Field label="Email">
                  <input
                    className={`${inputCls} bg-slate-50 text-slate-500 cursor-not-allowed`}
                    value={form.email}
                    readOnly
                  />
                </Field>
                <Field label="Phone">
                  <input
                    className={inputCls}
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </Field>
                <Field label="Headline">
                  <input
                    className={inputCls}
                    value={form.headline}
                    onChange={(e) => set("headline", e.target.value)}
                    placeholder="Behavioural Economist | IIM-A | Author"
                  />
                </Field>
                <Field label="Title" required>
                  <select
                    className={selectCls}
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                  >
                    <option value="">Select title…</option>
                    {["Professor", "Associate Professor", "Assistant Professor", "Lecturer", "Visiting Faculty"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Department" required>
                  <input
                    className={inputCls}
                    value={form.department}
                    onChange={(e) => set("department", e.target.value)}
                    placeholder="Finance &amp; Accounting"
                  />
                </Field>
                <Field label="Designation">
                  <input
                    className={inputCls}
                    value={form.designation}
                    onChange={(e) => set("designation", e.target.value)}
                    placeholder="Area Chair — Finance"
                  />
                </Field>
                <Field label="Faculty ID">
                  <input
                    className={inputCls}
                    value={form.faculty_id}
                    onChange={(e) => set("faculty_id", e.target.value)}
                    placeholder="FAC-2018-042"
                  />
                </Field>
                <Field label="Joining Year">
                  <input
                    className={inputCls}
                    type="number"
                    min="1950"
                    max="2099"
                    value={form.joining_year}
                    onChange={(e) => set("joining_year", e.target.value)}
                    placeholder="2018"
                  />
                </Field>
                <Field label="Office Location">
                  <input
                    className={inputCls}
                    value={form.office_location}
                    onChange={(e) => set("office_location", e.target.value)}
                    placeholder="Room 204, Faculty Block B"
                  />
                </Field>
                <Field label="Location">
                  <input
                    className={inputCls}
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    placeholder="Ahmedabad, Gujarat"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Bio">
                    <textarea
                      className={textareaCls}
                      rows={4}
                      value={form.bio}
                      onChange={(e) => set("bio", e.target.value)}
                      placeholder="A brief professional biography visible to the entire network…"
                    />
                  </Field>
                </div>
              </CardContent>
            </Card>

            {/* Research */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-indigo-600" />
                  Research
                </CardTitle>
                <CardDescription>Research interests, metrics, and identifiers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ChipInput
                  label="Research Areas"
                  chips={form.research_areas}
                  onChange={(v) => set("research_areas", v)}
                  placeholder="e.g. Behavioural Finance"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="h-index">
                    <input
                      className={inputCls}
                      type="number"
                      min="0"
                      value={form.h_index}
                      onChange={(e) => set("h_index", e.target.value)}
                      placeholder="12"
                    />
                  </Field>
                  <Field label="Total Publications">
                    <input
                      className={inputCls}
                      type="number"
                      min="0"
                      value={form.publications_count}
                      onChange={(e) => set("publications_count", e.target.value)}
                      placeholder="45"
                    />
                  </Field>
                  <Field label="Google Scholar URL">
                    <input
                      className={inputCls}
                      type="url"
                      value={form.google_scholar_url}
                      onChange={(e) => set("google_scholar_url", e.target.value)}
                      placeholder="https://scholar.google.com/citations?user=…"
                    />
                  </Field>
                  <Field label="ORCID ID">
                    <input
                      className={inputCls}
                      value={form.orcid_id}
                      onChange={(e) => set("orcid_id", e.target.value)}
                      placeholder="0000-0002-1234-5678"
                    />
                  </Field>
                </div>
                <Field label="Active Grants">
                  <textarea
                    className={textareaCls}
                    rows={3}
                    value={form.active_grants}
                    onChange={(e) => set("active_grants", e.target.value)}
                    placeholder={"ICSSR ₹15L — Behavioural nudges in rural credit (2023–26)\nDST ₹28L — FinTech adoption study (2022–25)"}
                  />
                </Field>
              </CardContent>
            </Card>

            {/* Publications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  Publications
                </CardTitle>
                <CardDescription>
                  Journal articles, conference papers, book chapters, and working papers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {form.publications.length === 0 && !showPubForm && (
                  <p className="text-sm text-slate-400 italic">No publications added yet.</p>
                )}

                {form.publications
                  .slice()
                  .sort((a, b) => Number(b.year) - Number(a.year))
                  .map((pub) => (
                    <div key={pub.id} className="border border-slate-200 rounded-lg overflow-hidden">
                      <div
                        className="flex items-start gap-3 p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={() => setExpandedPub(expandedPub === pub.id ? null : pub.id)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 leading-snug">{pub.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {pub.journal} · {pub.year}
                            {pub.co_authors.length > 0 && ` · ${pub.co_authors.join(", ")}`}
                          </p>
                          <span className="inline-block mt-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                            {pub.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {pub.url && (
                            <a
                              href={pub.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-indigo-500 hover:text-indigo-700 p-1"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); removePub(pub.id); }}
                            className="text-slate-400 hover:text-red-500 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {expandedPub === pub.id
                            ? <ChevronUp className="w-4 h-4 text-slate-400" />
                            : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </div>
                      {expandedPub === pub.id && pub.abstract && (
                        <div className="px-4 pb-4 text-xs text-slate-600 border-t border-slate-100 pt-3 bg-slate-50">
                          <span className="font-semibold text-slate-700">Abstract: </span>
                          {pub.abstract}
                        </div>
                      )}
                    </div>
                  ))}

                {/* Add Publication form */}
                {showPubForm && (
                  <div className="border border-indigo-200 rounded-xl p-4 bg-indigo-50/40 space-y-3">
                    <p className="text-sm font-semibold text-indigo-800">New Publication</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field label="Title" required>
                        <input
                          className={inputCls}
                          value={pubDraft.title}
                          onChange={(e) => setPubDraft((d) => ({ ...d, title: e.target.value }))}
                          placeholder="Paper title"
                        />
                      </Field>
                      <Field label="Journal / Conference" required>
                        <input
                          className={inputCls}
                          value={pubDraft.journal}
                          onChange={(e) => setPubDraft((d) => ({ ...d, journal: e.target.value }))}
                          placeholder="Journal of Finance"
                        />
                      </Field>
                      <Field label="Year" required>
                        <input
                          className={inputCls}
                          type="number"
                          min="1900"
                          max="2099"
                          value={pubDraft.year}
                          onChange={(e) => setPubDraft((d) => ({ ...d, year: e.target.value }))}
                          placeholder="2023"
                        />
                      </Field>
                      <Field label="Type">
                        <select
                          className={selectCls}
                          value={pubDraft.type}
                          onChange={(e) => setPubDraft((d) => ({ ...d, type: e.target.value as Publication["type"] }))}
                        >
                          {["Journal Article", "Conference Paper", "Book Chapter", "Working Paper"].map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="URL">
                        <input
                          className={inputCls}
                          type="url"
                          value={pubDraft.url}
                          onChange={(e) => setPubDraft((d) => ({ ...d, url: e.target.value }))}
                          placeholder="https://doi.org/…"
                        />
                      </Field>
                      <Field label="Co-authors (comma-separated)">
                        <input
                          className={inputCls}
                          value={coAuthorsInput}
                          onChange={(e) => setCoAuthorsInput(e.target.value)}
                          placeholder="A. Kumar, B. Patel"
                        />
                      </Field>
                    </div>
                    <Field label="Abstract">
                      <textarea
                        className={textareaCls}
                        rows={2}
                        value={pubDraft.abstract}
                        onChange={(e) => setPubDraft((d) => ({ ...d, abstract: e.target.value }))}
                        placeholder="Brief summary…"
                      />
                    </Field>
                    <div className="flex gap-2 pt-1">
                      <Button
                        onClick={addPublication}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
                      >
                        Add Publication
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => { setShowPubForm(false); setPubDraft(EMPTY_PUB); setCoAuthorsInput(""); }}
                        className="text-sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {!showPubForm && (
                  <Button
                    variant="outline"
                    onClick={() => setShowPubForm(true)}
                    className="w-full border-dashed border-indigo-300 text-indigo-700 hover:bg-indigo-50 text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Publication
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Research Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-blue-600" />
                  Research Projects
                </CardTitle>
                <CardDescription>Ongoing, completed, or proposed research endeavours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {form.research_projects.length === 0 && !showProjForm && (
                  <p className="text-sm text-slate-400 italic">No research projects added yet.</p>
                )}

                {form.research_projects.map((proj) => (
                  <div key={proj.id} className="border border-slate-200 rounded-lg p-4 flex gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-900">{proj.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          proj.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : proj.status === "Completed"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {proj.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {proj.year}
                        {proj.funding && ` · ${proj.funding}`}
                        {proj.collaborators.length > 0 && ` · ${proj.collaborators.join(", ")}`}
                      </p>
                      {proj.description && (
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{proj.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeProject(proj.id)}
                      className="text-slate-400 hover:text-red-500 flex-shrink-0 self-start"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {showProjForm && (
                  <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/40 space-y-3">
                    <p className="text-sm font-semibold text-blue-800">New Research Project</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field label="Title" required>
                        <input
                          className={inputCls}
                          value={projDraft.title}
                          onChange={(e) => setProjDraft((d) => ({ ...d, title: e.target.value }))}
                          placeholder="Project title"
                        />
                      </Field>
                      <Field label="Year" required>
                        <input
                          className={inputCls}
                          type="number"
                          min="1900"
                          max="2099"
                          value={projDraft.year}
                          onChange={(e) => setProjDraft((d) => ({ ...d, year: e.target.value }))}
                          placeholder="2024"
                        />
                      </Field>
                      <Field label="Status">
                        <select
                          className={selectCls}
                          value={projDraft.status}
                          onChange={(e) => setProjDraft((d) => ({ ...d, status: e.target.value as ResearchProject["status"] }))}
                        >
                          {["Active", "Completed", "Proposed"].map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </Field>
                      <Field label="Funding">
                        <input
                          className={inputCls}
                          value={projDraft.funding}
                          onChange={(e) => setProjDraft((d) => ({ ...d, funding: e.target.value }))}
                          placeholder="ICSSR ₹15L"
                        />
                      </Field>
                      <div className="sm:col-span-2">
                        <Field label="Collaborators (comma-separated)">
                          <input
                            className={inputCls}
                            value={collabInput}
                            onChange={(e) => setCollabInput(e.target.value)}
                            placeholder="IIT Bombay, MICA Ahmedabad"
                          />
                        </Field>
                      </div>
                      <div className="sm:col-span-2">
                        <Field label="Description">
                          <textarea
                            className={textareaCls}
                            rows={2}
                            value={projDraft.description}
                            onChange={(e) => setProjDraft((d) => ({ ...d, description: e.target.value }))}
                            placeholder="Brief description of the project…"
                          />
                        </Field>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button
                        onClick={addProject}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                      >
                        Add Project
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => { setShowProjForm(false); setProjDraft(EMPTY_PROJECT); setCollabInput(""); }}
                        className="text-sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {!showProjForm && (
                  <Button
                    variant="outline"
                    onClick={() => setShowProjForm(true)}
                    className="w-full border-dashed border-blue-300 text-blue-700 hover:bg-blue-50 text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Research Project
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT — 1/3 */}
          <div className="space-y-6">

            {/* Research Metrics (read-only) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart2 className="w-4 h-4 text-indigo-600" />
                  Research Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {[
                  { label: "h-index", value: form.h_index || "—" },
                  {
                    label: "Publications",
                    value: form.publications_count || (form.publications.length > 0 ? String(form.publications.length) : "—"),
                  },
                  {
                    label: "Active Grants",
                    value: activeGrantsCount > 0 ? String(activeGrantsCount) : "—",
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0"
                  >
                    <span className="text-sm text-slate-600">{label}</span>
                    <span className="text-xl font-bold text-indigo-700">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Teaching */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  Teaching
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ChipInput
                  label="Courses Taught"
                  chips={form.courses_taught}
                  onChange={(v) => set("courses_taught", v)}
                  placeholder="e.g. Corporate Finance"
                />
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Open to Collaboration</p>
                    <p className="text-xs text-slate-500">Student &amp; industry research partnerships</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => set("open_to_collaborate", !form.open_to_collaborate)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      form.open_to_collaborate ? "bg-indigo-600" : "bg-slate-200"
                    }`}
                    aria-label="Toggle open to collaboration"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        form.open_to_collaborate ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  Achievements
                </CardTitle>
                <CardDescription>One achievement per line</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  className={textareaCls}
                  rows={5}
                  value={form.achievements}
                  onChange={(e) => set("achievements", e.target.value)}
                  placeholder={"Best Paper Award, IIMB 2023\nFulbright Scholar 2021\nNASA Research Fellowship 2019"}
                />
                {form.achievements && (
                  <ul className="mt-3 space-y-1.5">
                    {form.achievements
                      .split("\n")
                      .filter((l) => l.trim())
                      .map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                          {a.trim()}
                        </li>
                      ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Social & Academic Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Link2 className="w-4 h-4 text-indigo-600" />
                  Social &amp; Academic Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Field label="LinkedIn URL">
                  <input
                    className={inputCls}
                    type="url"
                    value={form.linkedin_url}
                    onChange={(e) => set("linkedin_url", e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </Field>
                <Field label="Personal / University Website">
                  <input
                    className={inputCls}
                    type="url"
                    value={form.website_url}
                    onChange={(e) => set("website_url", e.target.value)}
                    placeholder="https://yourname.edu"
                  />
                </Field>
                <Field label="Google Scholar URL">
                  <input
                    className={inputCls}
                    type="url"
                    value={form.google_scholar_url}
                    onChange={(e) => set("google_scholar_url", e.target.value)}
                    placeholder="https://scholar.google.com/citations?user=…"
                  />
                </Field>
                {(form.linkedin_url || form.website_url || form.google_scholar_url) && (
                  <div className="pt-1 flex flex-wrap gap-2">
                    {form.linkedin_url && (
                      <a
                        href={form.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-full"
                      >
                        <ExternalLink className="w-3 h-3" /> LinkedIn
                      </a>
                    )}
                    {form.website_url && (
                      <a
                        href={form.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-800 bg-slate-100 px-2.5 py-1 rounded-full"
                      >
                        <ExternalLink className="w-3 h-3" /> Website
                      </a>
                    )}
                    {form.google_scholar_url && (
                      <a
                        href={form.google_scholar_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full"
                      >
                        <ExternalLink className="w-3 h-3" /> Scholar
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mobile save button */}
            <div className="lg:hidden">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saving ? "Saving…" : "Save Profile"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
