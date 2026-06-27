"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";
import {
  User, Briefcase, GraduationCap, Save, CheckCircle,
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

export default function AlumniProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");

  // Personal
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");

  // Professional
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  // Academic
  const [program, setProgram] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [graduationYear, setGraduationYear] = useState("");

  // Network preferences
  const [openToMentor, setOpenToMentor] = useState(false);
  const [openToHire, setOpenToHire] = useState(false);
  const [openToInvest, setOpenToInvest] = useState(false);
  const [expertiseAreas, setExpertiseAreas] = useState<string[]>([]);
  const [expertiseInput, setExpertiseInput] = useState("");

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

      const { data: ap } = await supabase.from("alumni_profiles").select("*").eq("id", user.id).single();
      if (ap) {
        setCompany(ap.company || "");
        setJobTitle(ap.job_title || "");
        setIndustry(ap.industry || "");
        setYearsOfExperience(ap.years_of_experience?.toString() || "");
        setLinkedinUrl(ap.linkedin_url || "");
        setProgram(ap.program || "");
        setSpecialization(ap.specialization || "");
        setBatchYear(ap.batch_year?.toString() || "");
        setGraduationYear(ap.graduation_year?.toString() || "");
        setOpenToMentor(ap.open_to_mentor || false);
        setOpenToHire(ap.open_to_hire || false);
        setOpenToInvest(ap.open_to_invest || false);
        setExpertiseAreas(ap.expertise_areas || []);
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

    const { error: e2 } = await supabase.from("alumni_profiles").upsert({
      id: userId,
      company,
      job_title: jobTitle,
      industry,
      years_of_experience: yearsOfExperience ? parseInt(yearsOfExperience) : null,
      linkedin_url: linkedinUrl,
      program,
      specialization,
      batch_year: batchYear ? parseInt(batchYear) : null,
      graduation_year: graduationYear ? parseInt(graduationYear) : null,
      open_to_mentor: openToMentor,
      open_to_hire: openToHire,
      open_to_invest: openToInvest,
      expertise_areas: expertiseAreas,
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
  const fields = [fullName, bio, company, jobTitle, industry, yearsOfExperience, linkedinUrl, program, specialization, batchYear, graduationYear, expertiseAreas.length > 0 ? "filled" : ""];
  const filled = fields.filter(Boolean).length;
  const completion = Math.round((filled / fields.length) * 100);

  if (loading) {
    return (
      <>
        <Topbar title="My Profile" subtitle="Manage your alumni profile" />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
        </main>
      </>
    );
  }

  return (
    <>
      <Topbar title="My Profile" subtitle="Keep your profile up-to-date to connect with the network" />
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
              {completion === 100 ? "Your profile is complete!" : "Complete your profile to improve your visibility in the network."}
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
              <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Priya Sharma" className={inputCls} />
            </Field>
          </div>
          <Field label="Bio">
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
              placeholder="Share your story, career highlights, and what you bring to the MBA community..."
              className={inputCls} />
          </Field>
        </SectionCard>

        {/* Professional */}
        <SectionCard title="Professional Details" icon={Building2}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Current Company">
              <input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. McKinsey & Company" className={inputCls} />
            </Field>
            <Field label="Job Title">
              <input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Senior Consultant" className={inputCls} />
            </Field>
            <Field label="Industry">
              <select value={industry} onChange={e => setIndustry(e.target.value)} className={inputCls}>
                <option value="">Select industry</option>
                <option>Consulting</option>
                <option>Investment Banking</option>
                <option>Venture Capital / Private Equity</option>
                <option>Technology</option>
                <option>Healthcare</option>
                <option>Consumer Goods</option>
                <option>Financial Services</option>
                <option>Real Estate</option>
                <option>Manufacturing</option>
                <option>Media & Entertainment</option>
                <option>Education</option>
                <option>Non-profit / Social Impact</option>
                <option>Government / Public Sector</option>
                <option>Other</option>
              </select>
            </Field>
            <Field label="Years of Experience">
              <select value={yearsOfExperience} onChange={e => setYearsOfExperience(e.target.value)} className={inputCls}>
                <option value="">Select range</option>
                <option value="1">1–3 years</option>
                <option value="4">4–6 years</option>
                <option value="7">7–10 years</option>
                <option value="11">11–15 years</option>
                <option value="16">15+ years</option>
              </select>
            </Field>
            <Field label="LinkedIn URL">
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)}
                  placeholder="linkedin.com/in/yourname" className={`${inputCls} pl-9`} />
              </div>
            </Field>
          </div>
        </SectionCard>

        {/* Academic Background */}
        <SectionCard title="Academic Background" icon={GraduationCap}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Program">
              <select value={program} onChange={e => setProgram(e.target.value)} className={inputCls}>
                <option value="">Select program</option>
                <option>MBA</option>
                <option>Executive MBA</option>
                <option>MBA (Full-time)</option>
                <option>MBA (Part-time)</option>
                <option>PGDM</option>
                <option>MMS</option>
              </select>
            </Field>
            <Field label="Specialization">
              <select value={specialization} onChange={e => setSpecialization(e.target.value)} className={inputCls}>
                <option value="">Select specialization</option>
                <option>Finance</option>
                <option>Marketing</option>
                <option>Operations</option>
                <option>Strategy</option>
                <option>Entrepreneurship</option>
                <option>Human Resources</option>
                <option>Information Technology</option>
                <option>Healthcare Management</option>
                <option>International Business</option>
              </select>
            </Field>
            <Field label="Batch Year">
              <input value={batchYear} onChange={e => setBatchYear(e.target.value)} placeholder="e.g. 2018" className={inputCls} />
            </Field>
            <Field label="Graduation Year">
              <input value={graduationYear} onChange={e => setGraduationYear(e.target.value)} placeholder="e.g. 2020" className={inputCls} />
            </Field>
          </div>
        </SectionCard>

        {/* Network Preferences */}
        <SectionCard title="Network Preferences" icon={Briefcase}>
          <div className="space-y-4">
            {/* Toggles */}
            <div className="space-y-3">
              {[
                { label: "Open to mentoring students", value: openToMentor, setter: setOpenToMentor },
                { label: "Open to hiring MBA students / alumni", value: openToHire, setter: setOpenToHire },
                { label: "Open to investing in student startups", value: openToInvest, setter: setOpenToInvest },
              ].map(({ label, value, setter }) => (
                <div key={label} className="flex items-center gap-3">
                  <button
                    onClick={() => setter(!value)}
                    className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 ${value ? "bg-indigo-600" : "bg-slate-200"}`}
                    style={{ position: "relative" }}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${value ? "left-6" : "left-1"}`} />
                  </button>
                  <span className="text-sm text-slate-700">{label}</span>
                </div>
              ))}
            </div>

            {/* Expertise areas chip input */}
            <Field label="Expertise Areas">
              <div className="flex flex-wrap gap-2 mb-2">
                {expertiseAreas.map(chip => (
                  <span key={chip} className="flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full">
                    {chip}
                    <button onClick={() => setExpertiseAreas(expertiseAreas.filter(c => c !== chip))} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
              <input
                value={expertiseInput}
                onChange={e => setExpertiseInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && expertiseInput.trim()) {
                    setExpertiseAreas([...expertiseAreas, expertiseInput.trim()]);
                    setExpertiseInput("");
                    e.preventDefault();
                  }
                }}
                placeholder="Type an area and press Enter (e.g. Finance, Strategy)"
                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 w-full"
              />
            </Field>
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
