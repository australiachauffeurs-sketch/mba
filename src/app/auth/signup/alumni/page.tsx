"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, AlertCircle, Eye, EyeOff, Briefcase } from "lucide-react";

const STEPS = ["Account Setup", "Personal Info", "Educational Background", "Professional Info", "Network Preferences", "Review & Submit"];

const INDUSTRIES = [
  { value: "Finance", label: "Finance & Banking" },
  { value: "Consulting", label: "Management Consulting" },
  { value: "Tech", label: "Technology" },
  { value: "Fintech", label: "Fintech" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "PE_VC", label: "Private Equity / VC" },
  { value: "Entrepreneurship", label: "Entrepreneurship" },
  { value: "Real_Estate", label: "Real Estate" },
  { value: "Government", label: "Government / Public Sector" },
  { value: "Non_Profit", label: "Non-Profit / NGO" },
  { value: "Media", label: "Media & Entertainment" },
];

const PROGRAMS = [
  { value: "MBA", label: "MBA" }, { value: "EMBA", label: "EMBA" },
  { value: "MiM", label: "MiM" }, { value: "MFin", label: "MFin" },
  { value: "PhD", label: "PhD" }, { value: "BBA", label: "BBA" },
];

const EXPERTISE_OPTIONS = [
  "Fundraising", "Product Development", "Sales & BD", "Financial Modeling",
  "Go-to-Market Strategy", "Operations", "People & Culture", "Legal & Compliance",
  "International Expansion", "Board Governance", "Data & Analytics", "M&A",
];

function toggle(arr: string[], val: string) {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

function MultiSelect({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o} type="button" onClick={() => onChange(toggle(selected, o))}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              selected.includes(o) ? "bg-purple-600 text-white border-purple-600" : "bg-white text-slate-600 border-slate-200 hover:border-purple-300"
            }`}>{o}</button>
        ))}
      </div>
    </div>
  );
}

interface Form {
  email: string; password: string; confirmPassword: string;
  fullName: string; phone: string; dateOfBirth: string; gender: string; nationality: string;
  rollNumber: string; batchYear: string; graduationYear: string; program: string; specialization: string;
  company: string; jobTitle: string; industry: string; yearsOfExperience: string; linkedinUrl: string;
  openToMentor: boolean; openToHire: boolean; openToInvest: boolean;
  areasOfExpertise: string[]; bio: string;
}

const INIT: Form = {
  email: "", password: "", confirmPassword: "",
  fullName: "", phone: "", dateOfBirth: "", gender: "", nationality: "",
  rollNumber: "", batchYear: "", graduationYear: "", program: "", specialization: "",
  company: "", jobTitle: "", industry: "", yearsOfExperience: "", linkedinUrl: "",
  openToMentor: false, openToHire: false, openToInvest: false,
  areasOfExpertise: [], bio: "",
};

export default function AlumniSignupPage() {
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
    if (step === 1 && (!form.fullName || !form.phone || !form.nationality)) return "Please fill in all required fields.";
    if (step === 2 && (!form.rollNumber || !form.batchYear || !form.graduationYear || !form.program)) return "Roll number, batch year, graduation year, and program are required.";
    if (step === 3 && (!form.company || !form.jobTitle || !form.industry)) return "Current company, role, and industry are required.";
    return "";
  }

  function next() { const err = validateStep(); if (err) { setError(err); return; } setError(""); setStep((s) => s + 1); }

  async function submit() {
    const err = validateStep(); if (err) { setError(err); return; }
    setError(""); setLoading(true);
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: form.email, password: form.password,
        options: { data: { full_name: form.fullName, role: "alumni" } },
      });
      if (signUpError) throw new Error(signUpError.message);
      if (!authData.user) throw new Error("Signup failed.");
      const uid = authData.user.id;
      await supabase.from("profiles").upsert({
        id: uid, role: "alumni", full_name: form.fullName, email: form.email, bio: form.bio,
        phone: form.phone, nationality: form.nationality, date_of_birth: form.dateOfBirth,
        gender: form.gender, linkedin_url: form.linkedinUrl, is_profile_complete: true,
      });
      await supabase.from("alumni_profiles").upsert({
        profile_id: uid, program: form.program, specialization: form.specialization,
        graduation_year: parseInt(form.graduationYear), batch_year: parseInt(form.batchYear),
        roll_number: form.rollNumber, company: form.company, job_title: form.jobTitle,
        industry: form.industry, years_of_experience: parseInt(form.yearsOfExperience) || 0,
        open_to_mentor: form.openToMentor, open_to_hire: form.openToHire,
        areas_of_expertise: form.areasOfExpertise,
      });
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally { setLoading(false); }
  }

  if (done) return (
    <div className="bg-white/95 rounded-3xl shadow-2xl p-10 text-center border border-white/20">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5"><CheckCircle className="w-8 h-8 text-green-600" /></div>
      <h2 className="text-2xl font-bold text-slate-900">Welcome to UniConnect!</h2>
      <p className="text-slate-500 mt-2 text-sm">Verify your email then sign in to explore your alumni dashboard.</p>
      <Button className="mt-6 w-full" size="lg" onClick={() => router.push("/auth/login")}>Go to Login</Button>
    </div>
  );

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 pt-7 pb-5">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/auth/signup" className="text-purple-200 hover:text-white"><ArrowLeft className="w-4 h-4" /></Link>
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center ml-1"><Briefcase className="w-4 h-4 text-white" /></div>
          <div><p className="text-white font-semibold text-sm">Alumni Registration</p><p className="text-purple-200 text-xs">Step {step + 1} of {STEPS.length}</p></div>
        </div>
        <div className="flex gap-1">{STEPS.map((_, i) => <div key={i} className={`h-1.5 rounded-full flex-1 transition-all ${i <= step ? "bg-white" : "bg-white/25"}`} />)}</div>
        <p className="text-white font-semibold mt-3">{STEPS[step]}</p>
      </div>

      <div className="p-7 space-y-5">
        {error && <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700"><AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}</div>}

        {step === 0 && (
          <div className="space-y-4">
            <Input label="Email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@company.com" required />
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
            <Input label="Full Name" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="As per official records" required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 (555) 000-0000" required />
              <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Gender" value={form.gender} onChange={(e) => set("gender", e.target.value)} placeholder="Select" options={[
                { value: "male", label: "Male" }, { value: "female", label: "Female" },
                { value: "non-binary", label: "Non-binary" }, { value: "prefer-not", label: "Prefer not to say" },
              ]} />
              <Input label="Nationality" value={form.nationality} onChange={(e) => set("nationality", e.target.value)} placeholder="e.g. American" required />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Alumni Roll Number" value={form.rollNumber} onChange={(e) => set("rollNumber", e.target.value)} placeholder="e.g. MBA2018042" required hint="Your student roll number" />
              <Input label="Batch Year" type="number" value={form.batchYear} onChange={(e) => set("batchYear", e.target.value)} placeholder="e.g. 2016" required min="1980" max="2025" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Graduation Year" type="number" value={form.graduationYear} onChange={(e) => set("graduationYear", e.target.value)} placeholder="e.g. 2018" required min="1980" max="2025" />
              <Select label="Program" value={form.program} onChange={(e) => set("program", e.target.value)} required placeholder="Select" options={PROGRAMS} />
            </div>
            <Input label="Specialization / Major" value={form.specialization} onChange={(e) => set("specialization", e.target.value)} placeholder="e.g. Finance, Entrepreneurship" />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Input label="Current Company / Organization" value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="e.g. Goldman Sachs, McKinsey" required />
            <Input label="Job Title / Role" value={form.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} placeholder="e.g. Vice President, Partner" required />
            <div className="grid grid-cols-2 gap-4">
              <Select label="Industry" value={form.industry} onChange={(e) => set("industry", e.target.value)} required placeholder="Select industry" options={INDUSTRIES} />
              <Select label="Years of Experience" value={form.yearsOfExperience} onChange={(e) => set("yearsOfExperience", e.target.value)} placeholder="Select" options={[
                { value: "1", label: "0–2 years" }, { value: "4", label: "3–5 years" },
                { value: "7", label: "6–10 years" }, { value: "12", label: "10–15 years" }, { value: "16", label: "15+ years" },
              ]} />
            </div>
            <Input label="LinkedIn URL" type="url" value={form.linkedinUrl} onChange={(e) => set("linkedinUrl", e.target.value)} placeholder="linkedin.com/in/yourname" hint="Required for profile verification" />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">Tell the network how you can contribute. These preferences shape who UniConnect AI matches you with.</p>
            <div className="space-y-3">
              {[
                { key: "openToMentor" as const, label: "I'm open to mentoring current students", desc: "Career guidance, skill development, mock interviews" },
                { key: "openToHire" as const, label: "I'm open to hiring MBA talent", desc: "Internships, full-time roles, contract work at my organization" },
                { key: "openToInvest" as const, label: "I'm open to investing in student/alumni startups", desc: "Angel investing, advising, or connecting to investors" },
              ].map((opt) => (
                <label key={opt.key} className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-purple-300 transition-colors">
                  <input type="checkbox" checked={form[opt.key]} onChange={(e) => set(opt.key, e.target.checked)} className="mt-1 w-4 h-4 accent-purple-600" />
                  <div><p className="text-sm font-medium text-slate-900">{opt.label}</p><p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p></div>
                </label>
              ))}
            </div>
            <MultiSelect label="Areas of Expertise" options={EXPERTISE_OPTIONS} selected={form.areasOfExpertise} onChange={(v) => set("areasOfExpertise", v)} />
            <Textarea label="Bio / Professional Summary" value={form.bio} onChange={(e) => set("bio", e.target.value)} rows={3} placeholder="Your career journey, what you're passionate about, and how you'd like to give back to the community…" />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-2xl p-5 space-y-3 text-sm">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {form.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div><p className="font-bold text-slate-900">{form.fullName || "—"}</p><p className="text-slate-500 text-xs">{form.email}</p></div>
              </div>
              {[
                ["Role", "Alumni"], ["Program", `${form.program} · ${form.batchYear} Batch`],
                ["Roll Number", form.rollNumber || "—"], ["Graduation", form.graduationYear],
                ["Current Role", `${form.jobTitle || "—"} at ${form.company || "—"}`],
                ["Industry", form.industry || "—"], ["Experience", `${form.yearsOfExperience || "—"} years`],
                ["Nationality", form.nationality || "—"],
                ["Open to Mentor", form.openToMentor ? "Yes" : "No"],
                ["Open to Hire", form.openToHire ? "Yes" : "No"],
                ["Expertise", form.areasOfExpertise.join(", ") || "None selected"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2">
                  <span className="text-slate-400 font-medium flex-shrink-0">{k}</span>
                  <span className="text-slate-700 text-right">{v}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-slate-400">By creating an account you agree to our <Link href="#" className="text-indigo-600 hover:underline">Terms</Link> and <Link href="#" className="text-indigo-600 hover:underline">Privacy Policy</Link>.</p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {step > 0 && <Button variant="outline" onClick={() => { setError(""); setStep((s) => s - 1); }} className="flex-1"><ArrowLeft className="w-4 h-4" /> Back</Button>}
          {step < STEPS.length - 1 ? (
            <Button onClick={next} className="flex-1 bg-purple-600 hover:bg-purple-700">Continue <ArrowRight className="w-4 h-4" /></Button>
          ) : (
            <Button onClick={submit} className="flex-1 bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Profile…</> : <><CheckCircle className="w-4 h-4" /> Create Profile</>}
            </Button>
          )}
        </div>
        <p className="text-xs text-center text-slate-400">Already have an account? <Link href="/auth/login" className="text-indigo-600 hover:underline">Sign in</Link></p>
      </div>
    </div>
  );
}
