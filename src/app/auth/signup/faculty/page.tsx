"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, AlertCircle, Eye, EyeOff, BookOpen } from "lucide-react";

const STEPS = ["Account Setup", "Personal Info", "Academic Position", "Research Profile", "Review & Submit"];

const DEPARTMENTS = [
  { value: "Finance", label: "Finance" }, { value: "Marketing", label: "Marketing" },
  { value: "Strategy", label: "Strategy & General Management" }, { value: "OB", label: "Organizational Behavior" },
  { value: "Operations", label: "Operations & Technology" }, { value: "Economics", label: "Economics" },
  { value: "Accounting", label: "Accounting" }, { value: "Entrepreneurship", label: "Entrepreneurship" },
  { value: "Law", label: "Business Law" }, { value: "Analytics", label: "Business Analytics" },
];

const DESIGNATIONS = [
  { value: "Professor", label: "Professor" }, { value: "Associate_Professor", label: "Associate Professor" },
  { value: "Assistant_Professor", label: "Assistant Professor" }, { value: "Lecturer", label: "Lecturer" },
  { value: "Senior_Lecturer", label: "Senior Lecturer" }, { value: "Research_Fellow", label: "Research Fellow" },
  { value: "Post_Doc", label: "Post-Doctoral Researcher" }, { value: "Visiting_Professor", label: "Visiting Professor" },
];

const RESEARCH_AREAS = [
  "Corporate Finance", "FinTech & Digital Banking", "CBDC & Digital Currencies",
  "Behavioral Finance", "ESG & Sustainable Finance", "Mergers & Acquisitions",
  "Entrepreneurship & Innovation", "Corporate Governance", "Supply Chain Management",
  "Consumer Behavior", "Digital Marketing", "AI & Machine Learning in Business",
  "International Business", "Gender & Diversity", "Development Economics",
];

function toggle(arr: string[], val: string) { return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]; }

function MultiSelect({ label, options, selected, onChange }: { label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o} type="button" onClick={() => onChange(toggle(selected, o))}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selected.includes(o) ? "bg-green-600 text-white border-green-600" : "bg-white text-slate-600 border-slate-200 hover:border-green-300"}`}>{o}</button>
        ))}
      </div>
    </div>
  );
}

interface Form {
  email: string; password: string; confirmPassword: string;
  fullName: string; phone: string; gender: string; nationality: string;
  facultyId: string; department: string; designation: string; joiningYear: string; officeLocation: string;
  googleScholarUrl: string; orcidId: string; publicationsCount: string; hIndex: string;
  researchAreas: string[]; activeGrants: string; bio: string; openToCollaborate: boolean;
}

const INIT: Form = {
  email: "", password: "", confirmPassword: "",
  fullName: "", phone: "", gender: "", nationality: "",
  facultyId: "", department: "", designation: "", joiningYear: "", officeLocation: "",
  googleScholarUrl: "", orcidId: "", publicationsCount: "", hIndex: "",
  researchAreas: [], activeGrants: "", bio: "", openToCollaborate: true,
};

export default function FacultySignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(INIT);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const set = (key: keyof Form, val: unknown) => setForm((p) => ({ ...p, [key]: val }));

  function validateStep(): string {
    if (step === 0) {
      if (!form.email || !form.password || !form.confirmPassword) return "All fields are required.";
      if (form.password.length < 8) return "Password must be at least 8 characters.";
      if (form.password !== form.confirmPassword) return "Passwords do not match.";
    }
    if (step === 1 && (!form.fullName || !form.phone)) return "Full name and phone are required.";
    if (step === 2 && (!form.facultyId || !form.department || !form.designation || !form.joiningYear)) return "Faculty ID, department, designation, and joining year are required.";
    if (step === 3 && form.researchAreas.length === 0) return "Please select at least one research area.";
    return "";
  }

  function next() { const err = validateStep(); if (err) { setError(err); return; } setError(""); setStep((s) => s + 1); }

  async function submit() {
    const err = validateStep(); if (err) { setError(err); return; }
    setError(""); setLoading(true);
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: form.email, password: form.password,
        options: { data: { full_name: form.fullName, role: "faculty" } },
      });
      if (signUpError) throw new Error(signUpError.message);
      if (!authData.user) throw new Error("Signup failed.");
      const uid = authData.user.id;
      await supabase.from("profiles").upsert({
        id: uid, role: "faculty", full_name: form.fullName, email: form.email, bio: form.bio,
        phone: form.phone, nationality: form.nationality, gender: form.gender, is_profile_complete: true,
      });
      await supabase.from("faculty_profiles").upsert({
        profile_id: uid, department: form.department, designation: form.designation,
        joining_year: parseInt(form.joiningYear), faculty_id: form.facultyId,
        google_scholar_url: form.googleScholarUrl, orcid_id: form.orcidId,
        publications_count: form.publicationsCount ? parseInt(form.publicationsCount) : 0,
        h_index: form.hIndex ? parseInt(form.hIndex) : 0,
        research_areas: form.researchAreas, active_grants: form.activeGrants,
        open_to_collaborate: form.openToCollaborate,
      });
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally { setLoading(false); }
  }

  if (done) return (
    <div className="bg-white/95 rounded-3xl shadow-2xl p-10 text-center border border-white/20">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5"><CheckCircle className="w-8 h-8 text-green-600" /></div>
      <h2 className="text-2xl font-bold text-slate-900">Profile created!</h2>
      <p className="text-slate-500 mt-2 text-sm">Verify your email then sign in to access your faculty dashboard.</p>
      <Button className="mt-6 w-full" size="lg" onClick={() => router.push("/auth/login")}>Go to Login</Button>
    </div>
  );

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 px-8 pt-7 pb-5">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/auth/signup" className="text-green-200 hover:text-white"><ArrowLeft className="w-4 h-4" /></Link>
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center ml-1"><BookOpen className="w-4 h-4 text-white" /></div>
          <div><p className="text-white font-semibold text-sm">Faculty Registration</p><p className="text-green-200 text-xs">Step {step + 1} of {STEPS.length}</p></div>
        </div>
        <div className="flex gap-1">{STEPS.map((_, i) => <div key={i} className={`h-1.5 rounded-full flex-1 ${i <= step ? "bg-white" : "bg-white/25"}`} />)}</div>
        <p className="text-white font-semibold mt-3">{STEPS[step]}</p>
      </div>

      <div className="p-7 space-y-5">
        {error && <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700"><AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}</div>}

        {step === 0 && (
          <div className="space-y-4">
            <Input label="University Email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="your.name@university.edu" required hint="Must be your official institutional email" />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Password<span className="text-red-500 ml-0.5">*</span></label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Min 8 characters"
                  className="w-full px-4 py-2.5 pr-11 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Input label="Confirm Password" type="password" value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} placeholder="Re-enter password" required />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Input label="Full Name (with title)" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="e.g. Prof. David Kumar" required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 (555) 000-0000" required />
              <Select label="Gender" value={form.gender} onChange={(e) => set("gender", e.target.value)} placeholder="Select" options={[
                { value: "male", label: "Male" }, { value: "female", label: "Female" },
                { value: "non-binary", label: "Non-binary" }, { value: "prefer-not", label: "Prefer not to say" },
              ]} />
            </div>
            <Input label="Nationality" value={form.nationality} onChange={(e) => set("nationality", e.target.value)} placeholder="e.g. Indian, British" />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Faculty / Employee ID" value={form.facultyId} onChange={(e) => set("facultyId", e.target.value)} placeholder="e.g. FAC-2018-042" required hint="Your university employee ID" />
              <Input label="Joining Year" type="number" value={form.joiningYear} onChange={(e) => set("joiningYear", e.target.value)} placeholder="e.g. 2018" required min="1960" max="2026" />
            </div>
            <Select label="Department" value={form.department} onChange={(e) => set("department", e.target.value)} required placeholder="Select department" options={DEPARTMENTS} />
            <Select label="Designation / Title" value={form.designation} onChange={(e) => set("designation", e.target.value)} required placeholder="Select designation" options={DESIGNATIONS} />
            <Input label="Office Location / Building" value={form.officeLocation} onChange={(e) => set("officeLocation", e.target.value)} placeholder="e.g. Faculty Building, Room 305" />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <MultiSelect label="Research Areas (select all that apply)" options={RESEARCH_AREAS} selected={form.researchAreas} onChange={(v) => set("researchAreas", v)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Total Publications" type="number" value={form.publicationsCount} onChange={(e) => set("publicationsCount", e.target.value)} placeholder="e.g. 24" min="0" />
              <Input label="h-Index" type="number" value={form.hIndex} onChange={(e) => set("hIndex", e.target.value)} placeholder="e.g. 12" min="0" />
            </div>
            <Input label="Google Scholar URL" type="url" value={form.googleScholarUrl} onChange={(e) => set("googleScholarUrl", e.target.value)} placeholder="scholar.google.com/citations?user=…" />
            <Input label="ORCID ID" value={form.orcidId} onChange={(e) => set("orcidId", e.target.value)} placeholder="0000-0000-0000-0000" hint="Your ORCID researcher identifier" />
            <Textarea label="Active Grants / Funding" value={form.activeGrants} onChange={(e) => set("activeGrants", e.target.value)} rows={2} placeholder="e.g. NSF Grant #12345 – $85K – CBDC Adoption Study (2025–2027)" />
            <Textarea label="Research Bio" value={form.bio} onChange={(e) => set("bio", e.target.value)} rows={3} placeholder="Your research focus, current projects, and what kind of collaboration you're seeking…" />
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.openToCollaborate} onChange={(e) => set("openToCollaborate", e.target.checked)} className="w-4 h-4 accent-green-600" />
              <span className="text-sm text-slate-700">Open to research collaborations with students and alumni</span>
            </label>
          </div>
        )}

        {step === 4 && (
          <div className="bg-slate-50 rounded-2xl p-5 space-y-3 text-sm">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-lg">
                {form.fullName.split(" ").filter(n => !["Prof.", "Dr.", "Mr.", "Ms."].includes(n)).map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div><p className="font-bold text-slate-900">{form.fullName || "—"}</p><p className="text-slate-500 text-xs">{form.email}</p></div>
            </div>
            {[
              ["Role", "Faculty"], ["Faculty ID", form.facultyId || "—"], ["Department", form.department || "—"],
              ["Designation", form.designation || "—"], ["Joining Year", form.joiningYear || "—"],
              ["Publications", form.publicationsCount || "0"], ["h-Index", form.hIndex || "0"],
              ["Research Areas", form.researchAreas.join(", ") || "—"],
              ["Open to Collaborate", form.openToCollaborate ? "Yes" : "No"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2">
                <span className="text-slate-400 font-medium flex-shrink-0">{k}</span>
                <span className="text-slate-700 text-right">{v}</span>
              </div>
            ))}
            <p className="text-xs text-center text-slate-400 pt-2">By creating an account you agree to our <Link href="#" className="text-indigo-600 hover:underline">Terms</Link> and <Link href="#" className="text-indigo-600 hover:underline">Privacy Policy</Link>.</p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {step > 0 && <Button variant="outline" onClick={() => { setError(""); setStep((s) => s - 1); }} className="flex-1"><ArrowLeft className="w-4 h-4" /> Back</Button>}
          {step < STEPS.length - 1 ? (
            <Button onClick={next} className="flex-1 bg-green-600 hover:bg-green-700">Continue <ArrowRight className="w-4 h-4" /></Button>
          ) : (
            <Button onClick={submit} className="flex-1 bg-green-700 hover:bg-green-800" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Profile…</> : <><CheckCircle className="w-4 h-4" /> Create Profile</>}
            </Button>
          )}
        </div>
        <p className="text-xs text-center text-slate-400">Already have an account? <Link href="/auth/login" className="text-indigo-600 hover:underline">Sign in</Link></p>
      </div>
    </div>
  );
}
