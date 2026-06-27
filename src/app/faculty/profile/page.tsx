"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";
import {
  User, BookOpen, Save, CheckCircle,
  Loader2, AlertCircle, Link2, Building2,
} from "lucide-react";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-slate-800">
          <Icon className="w-4 h-4 text-indigo-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400";

export default function FacultyProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");

  // Personal
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");

  // Academic position
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [officeLocation, setOfficeLocation] = useState("");

  // Research profile
  const [researchAreas, setResearchAreas] = useState<string[]>([]);
  const [researchInput, setResearchInput] = useState("");
  const [publicationsCount, setPublicationsCount] = useState("");
  const [hIndex, setHIndex] = useState("");
  const [googleScholarUrl, setGoogleScholarUrl] = useState("");

  // Collaboration
  const [collaboration, setCollaboration] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (p) {
        setFullName(p.full_name || "");
        setBio(p.bio || "");
      }

      const { data: fp } = await supabase.from("faculty_profiles").select("*").eq("id", user.id).single();
      if (fp) {
        setDepartment(fp.department || "");
        setDesignation(fp.designation || "");
        setOfficeLocation(fp.office_location || "");
        setResearchAreas(fp.research_areas || []);
        setPublicationsCount(fp.publications_count?.toString() || "");
        setHIndex(fp.h_index?.toString() || "");
        setGoogleScholarUrl(fp.google_scholar_url || "");
        setCollaboration(fp.collaboration || false);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);

    const { error: e1 } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: fullName,
      bio,
      updated_at: new Date().toISOString(),
    });

    const { error: e2 } = await supabase.from("faculty_profiles").upsert({
      id: userId,
      department,
      designation,
      office_location: officeLocation,
      research_areas: researchAreas,
      publications_count: publicationsCount ? parseInt(publicationsCount) : null,
      h_index: hIndex ? parseInt(hIndex) : null,
      google_scholar_url: googleScholarUrl,
      collaboration,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);
    if (e1 || e2) {
      setError(e1?.message || e2?.message || "Failed to save. Please try again.");
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  // Profile completion
  const fields = [fullName, bio, department, designation, officeLocation, researchAreas.length > 0 ? "filled" : "", publicationsCount, hIndex, googleScholarUrl];
  const filled = fields.filter(Boolean).length;
  const completion = Math.round((filled / fields.length) * 100);

  if (loading) {
    return (
      <>
        <Topbar title="My Profile" subtitle="Manage your faculty profile" />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
        </main>
      </>
    );
  }

  return (
    <>
      <Topbar title="My Profile" subtitle="Keep your profile current for student and collaboration visibility" />
      <main className="flex-1 p-6 space-y-6 max-w-4xl">

        {/* Completion banner */}
        <Card className={completion === 100 ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-800">Profile Completion</p>
              <span className={`text-sm font-bold ${completion === 100 ? "text-green-600" : "text-amber-600"}`}>{completion}%</span>
            </div>
            <div className="w-full bg-white/60 rounded-full h-2">
              <div className="h-2 rounded-full transition-all duration-500"
                style={{ width: `${completion}%`, backgroundColor: completion === 100 ? "#16a34a" : "#d97706" }} />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              {completion === 100 ? "Your profile is complete!" : "Complete your profile to increase visibility with students and collaborators."}
            </p>
          </CardContent>
        </Card>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
          </div>
        )}

        {/* Personal */}
        <SectionCard title="Personal Information" icon={User}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name" required>
              <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Dr. Anita Rao" className={inputCls} />
            </Field>
          </div>
          <Field label="Bio">
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
              placeholder="Describe your academic background, teaching philosophy, and areas of expertise..."
              className={inputCls} />
          </Field>
        </SectionCard>

        {/* Academic Position */}
        <SectionCard title="Academic Position" icon={Building2}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Department" required>
              <select value={department} onChange={e => setDepartment(e.target.value)} className={inputCls}>
                <option value="">Select department</option>
                <option>Finance</option>
                <option>Marketing</option>
                <option>Operations & Supply Chain</option>
                <option>Strategy & Entrepreneurship</option>
                <option>Human Resources & OB</option>
                <option>Information Systems</option>
                <option>Economics</option>
                <option>Accounting</option>
                <option>Healthcare Management</option>
                <option>International Business</option>
                <option>General Management</option>
              </select>
            </Field>
            <Field label="Designation" required>
              <select value={designation} onChange={e => setDesignation(e.target.value)} className={inputCls}>
                <option value="">Select designation</option>
                <option>Assistant Professor</option>
                <option>Associate Professor</option>
                <option>Professor</option>
                <option>Professor of Practice</option>
                <option>Adjunct Professor</option>
                <option>Visiting Faculty</option>
                <option>Dean</option>
                <option>Associate Dean</option>
                <option>Director</option>
              </select>
            </Field>
            <Field label="Office Location">
              <input value={officeLocation} onChange={e => setOfficeLocation(e.target.value)} placeholder="e.g. Block A, Room 204" className={inputCls} />
            </Field>
          </div>
        </SectionCard>

        {/* Research Profile */}
        <SectionCard title="Research Profile" icon={BookOpen}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Number of Publications">
              <input type="number" value={publicationsCount} onChange={e => setPublicationsCount(e.target.value)}
                placeholder="e.g. 24" min="0" className={inputCls} />
            </Field>
            <Field label="H-Index">
              <input type="number" value={hIndex} onChange={e => setHIndex(e.target.value)}
                placeholder="e.g. 8" min="0" className={inputCls} />
            </Field>
            <Field label="Google Scholar URL" required={false}>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={googleScholarUrl} onChange={e => setGoogleScholarUrl(e.target.value)}
                  placeholder="scholar.google.com/citations?user=..." className={`${inputCls} pl-9`} />
              </div>
            </Field>
          </div>

          <Field label="Research Areas">
            <div className="flex flex-wrap gap-2 mb-2">
              {researchAreas.map(chip => (
                <span key={chip} className="flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full">
                  {chip}
                  <button onClick={() => setResearchAreas(researchAreas.filter(c => c !== chip))} className="hover:text-red-500">×</button>
                </span>
              ))}
            </div>
            <input
              value={researchInput}
              onChange={e => setResearchInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && researchInput.trim()) {
                  setResearchAreas([...researchAreas, researchInput.trim()]);
                  setResearchInput("");
                  e.preventDefault();
                }
              }}
              placeholder="Type a research area and press Enter (e.g. Behavioral Finance)"
              className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 w-full"
            />
          </Field>
        </SectionCard>

        {/* Collaboration */}
        <SectionCard title="Collaboration" icon={BookOpen}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCollaboration(!collaboration)}
              className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 ${collaboration ? "bg-indigo-600" : "bg-slate-200"}`}
              style={{ position: "relative" }}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${collaboration ? "left-6" : "left-1"}`} />
            </button>
            <span className="text-sm text-slate-700">Open to research collaboration</span>
          </div>
        </SectionCard>

        {/* Save */}
        <div className="flex items-center gap-3 pb-8">
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving…</> : <><Save className="w-4 h-4 mr-2" />Save Profile</>}
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
              <CheckCircle className="w-4 h-4" /> Profile saved successfully!
            </span>
          )}
        </div>
      </main>
    </>
  );
}
