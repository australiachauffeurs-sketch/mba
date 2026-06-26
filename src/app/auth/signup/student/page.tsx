"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, AlertCircle, Eye, EyeOff, GraduationCap } from "lucide-react";

const STEPS = [
  "Account Setup",
  "Personal Info",
  "Academic Details",
  "Professional Background",
  "Interests & Goals",
  "Review & Submit",
];

const PROGRAMS = [
  { value: "MBA", label: "MBA – Master of Business Administration" },
  { value: "EMBA", label: "EMBA – Executive MBA" },
  { value: "MiM", label: "MiM – Master in Management" },
  { value: "MFin", label: "MFin – Master of Finance" },
  { value: "MPA", label: "MPA – Master of Public Administration" },
  { value: "PhD", label: "PhD – Doctor of Philosophy" },
  { value: "DBA", label: "DBA – Doctor of Business Administration" },
];

const SPECIALIZATIONS = [
  { value: "Finance", label: "Finance & Investment" },
  { value: "Strategy", label: "Strategy & Consulting" },
  { value: "Marketing", label: "Marketing & Brand Management" },
  { value: "Entrepreneurship", label: "Entrepreneurship & Innovation" },
  { value: "Operations", label: "Operations & Supply Chain" },
  { value: "Tech_Management", label: "Technology Management" },
  { value: "Fintech", label: "Fintech & Digital Finance" },
  { value: "Healthcare", label: "Healthcare Management" },
  { value: "Social_Impact", label: "Social Impact & Sustainability" },
];

const CAREER_INTERESTS = [
  "Venture Capital / Private Equity", "Investment Banking", "Management Consulting",
  "Entrepreneurship / Startups", "Corporate Strategy", "Fintech", "Social Impact",
  "Real Estate", "Asset Management", "Technology", "Healthcare", "Sustainability / ESG",
];

const SKILLS = [
  "Financial Modeling", "Data Analysis", "Python", "SQL", "Excel / VBA",
  "Market Research", "Project Management", "Leadership", "Public Speaking",
  "Negotiation", "Strategic Planning", "Product Management",
];

const LOOKING_FOR = [
  "Mentors", "Internships", "Full-time Jobs", "Co-founders", "Research Opportunities",
  "Investors", "Industry Connections", "Career Advice",
];

interface Form {
  // Step 1
  email: string; password: string; confirmPassword: string;
  // Step 2
  fullName: string; phone: string; dateOfBirth: string; gender: string; nationality: string;
  // Step 3
  rollNumber: string; batchNumber: string; batchYear: string; program: string;
  specialization: string; gpa: string; expectedGraduation: string; universityId: string;
  // Step 4
  linkedinUrl: string; githubUrl: string; workExperienceYears: string;
  previousCompany: string; previousRole: string;
  // Step 5
  careerInterests: string[]; skills: string[]; lookingFor: string[];
  bio: string; openToMentor: boolean;
}

const INIT: Form = {
  email: "", password: "", confirmPassword: "",
  fullName: "", phone: "", dateOfBirth: "", gender: "", nationality: "",
  rollNumber: "", batchNumber: "", batchYear: "", program: "", specialization: "",
  gpa: "", expectedGraduation: "", universityId: "",
  linkedinUrl: "", githubUrl: "", workExperienceYears: "", previousCompany: "", previousRole: "",
  careerInterests: [], skills: [], lookingFor: [], bio: "", openToMentor: false,
};

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
              selected.includes(o)
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
            }`}>{o}</button>
        ))}
      </div>
    </div>
  );
}

export default function StudentSignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(INIT);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const set = (key: keyof Form, val: unknown) =>
    setForm((p) => ({ ...p, [key]: val }));

  function validateStep(): string {
    if (step === 0) {
      if (!form.email || !form.password || !form.confirmPassword) return "All fields are required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email address.";
      if (form.password.length < 8) return "Password must be at least 8 characters.";
      if (form.password !== form.confirmPassword) return "Passwords do not match.";
    }
    if (step === 1) {
      if (!form.fullName || !form.phone || !form.dateOfBirth || !form.gender || !form.nationality)
        return "Please fill in all personal information fields.";
    }
    if (step === 2) {
      if (!form.rollNumber || !form.batchYear || !form.program || !form.expectedGraduation)
        return "Roll number, batch year, program, and expected graduation are required.";
    }
    if (step === 5) {
      if (form.careerInterests.length === 0) return "Select at least one career interest.";
    }
    return "";
  }

  function next() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep((s) => s + 1);
  }

  async function submit() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.fullName, role: "student" } },
      });

      if (signUpError) throw new Error(signUpError.message);
      if (!authData.user) throw new Error("Signup failed. Please try again.");

      const uid = authData.user.id;

      await supabase.from("profiles").upsert({
        id: uid,
        role: "student",
        full_name: form.fullName,
        email: form.email,
        bio: form.bio,
        phone: form.phone,
        nationality: form.nationality,
        date_of_birth: form.dateOfBirth,
        gender: form.gender,
        linkedin_url: form.linkedinUrl,
        is_profile_complete: true,
      });

      await supabase.from("student_profiles").upsert({
        profile_id: uid,
        program: form.program,
        specialization: form.specialization,
        graduation_year: parseInt(form.expectedGraduation),
        gpa: form.gpa ? parseFloat(form.gpa) : null,
        skills: form.skills,
        interests: form.careerInterests,
        roll_number: form.rollNumber,
        batch_number: form.batchNumber,
        batch_year: parseInt(form.batchYear),
        university_id: form.universityId,
        github_url: form.githubUrl,
        work_experience_years: form.workExperienceYears ? parseInt(form.workExperienceYears) : 0,
        previous_company: form.previousCompany,
        previous_role: form.previousRole,
        looking_for: form.lookingFor,
        open_to_mentor: form.openToMentor,
      });

      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="bg-white/95 rounded-3xl shadow-2xl p-10 text-center border border-white/20">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Profile created!</h2>
        <p className="text-slate-500 mt-2 text-sm">Check your email to verify your account, then sign in.</p>
        <Button className="mt-6 w-full" size="lg" onClick={() => router.push("/auth/login")}>
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      {/* Progress header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 pt-7 pb-5">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/auth/signup" className="text-blue-200 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center ml-1">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Student Registration</p>
            <p className="text-blue-200 text-xs">Step {step + 1} of {STEPS.length}</p>
          </div>
        </div>
        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full flex-1 transition-all ${i <= step ? "bg-white" : "bg-white/25"}`} />
          ))}
        </div>
        <p className="text-white font-semibold mt-3">{STEPS[step]}</p>
      </div>

      <div className="p-7 space-y-5">
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}
          </div>
        )}

        {/* Step 0: Account */}
        {step === 0 && (
          <div className="space-y-4">
            <Input label="University Email" type="email" value={form.email}
              onChange={(e) => set("email", e.target.value)} placeholder="rollno@university.edu" required />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Password<span className="text-red-500 ml-0.5">*</span></label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={form.password}
                  onChange={(e) => set("password", e.target.value)} placeholder="Minimum 8 characters"
                  className="w-full px-4 py-2.5 pr-11 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="flex gap-1 mt-1">
                  {[form.password.length >= 8, /[A-Z]/.test(form.password), /[0-9]/.test(form.password), /[^A-Za-z0-9]/.test(form.password)].map((ok, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full ${ok ? "bg-green-500" : "bg-slate-200"}`} />
                  ))}
                </div>
              )}
              <p className="text-xs text-slate-400">Use uppercase, numbers & symbols for a strong password</p>
            </div>
            <Input label="Confirm Password" type="password" value={form.confirmPassword}
              onChange={(e) => set("confirmPassword", e.target.value)} placeholder="Re-enter your password" required />
          </div>
        )}

        {/* Step 1: Personal */}
        {step === 1 && (
          <div className="space-y-4">
            <Input label="Full Name" value={form.fullName} onChange={(e) => set("fullName", e.target.value)}
              placeholder="As per official records" required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Phone Number" type="tel" value={form.phone}
                onChange={(e) => set("phone", e.target.value)} placeholder="+1 (555) 000-0000" required />
              <Input label="Date of Birth" type="date" value={form.dateOfBirth}
                onChange={(e) => set("dateOfBirth", e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Gender" value={form.gender} onChange={(e) => set("gender", e.target.value)}
                required placeholder="Select gender"
                options={[
                  { value: "male", label: "Male" }, { value: "female", label: "Female" },
                  { value: "non-binary", label: "Non-binary" }, { value: "prefer-not", label: "Prefer not to say" },
                ]} />
              <Input label="Nationality" value={form.nationality} onChange={(e) => set("nationality", e.target.value)}
                placeholder="e.g. Indian, American" required />
            </div>
          </div>
        )}

        {/* Step 2: Academic */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Roll Number" value={form.rollNumber}
                onChange={(e) => set("rollNumber", e.target.value)} placeholder="e.g. MBA2026001" required
                hint="Your official university roll number" />
              <Input label="University ID / Student ID" value={form.universityId}
                onChange={(e) => set("universityId", e.target.value)} placeholder="e.g. U20260001" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Batch Number" value={form.batchNumber}
                onChange={(e) => set("batchNumber", e.target.value)} placeholder="e.g. Batch 47" />
              <Input label="Batch Year" type="number" value={form.batchYear}
                onChange={(e) => set("batchYear", e.target.value)} placeholder="e.g. 2024" required
                min="2015" max="2030" />
            </div>
            <Select label="Program" value={form.program} onChange={(e) => set("program", e.target.value)}
              required placeholder="Select your program" options={PROGRAMS} />
            <Select label="Specialization / Major" value={form.specialization}
              onChange={(e) => set("specialization", e.target.value)}
              placeholder="Select specialization" options={SPECIALIZATIONS} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="CGPA / GPA" type="number" value={form.gpa}
                onChange={(e) => set("gpa", e.target.value)} placeholder="e.g. 3.8"
                min="0" max="4" step="0.01" hint="On a 4.0 scale" />
              <Input label="Expected Graduation Year" type="number" value={form.expectedGraduation}
                onChange={(e) => set("expectedGraduation", e.target.value)}
                placeholder="e.g. 2026" required min="2024" max="2035" />
            </div>
          </div>
        )}

        {/* Step 3: Professional */}
        {step === 3 && (
          <div className="space-y-4">
            <Input label="LinkedIn URL" type="url" value={form.linkedinUrl}
              onChange={(e) => set("linkedinUrl", e.target.value)}
              placeholder="linkedin.com/in/yourname"
              hint="Helps alumni and investors verify your profile" />
            <Input label="GitHub / Portfolio URL" type="url" value={form.githubUrl}
              onChange={(e) => set("githubUrl", e.target.value)}
              placeholder="github.com/yourname or yourportfolio.com" />
            <Select label="Years of Work Experience" value={form.workExperienceYears}
              onChange={(e) => set("workExperienceYears", e.target.value)}
              placeholder="Select experience"
              options={[
                { value: "0", label: "Fresh graduate / No experience" },
                { value: "1", label: "Less than 1 year" },
                { value: "2", label: "1–2 years" },
                { value: "4", label: "3–5 years" },
                { value: "7", label: "5–10 years" },
                { value: "10", label: "10+ years" },
              ]} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Previous Company" value={form.previousCompany}
                onChange={(e) => set("previousCompany", e.target.value)} placeholder="e.g. Goldman Sachs" />
              <Input label="Previous Role / Title" value={form.previousRole}
                onChange={(e) => set("previousRole", e.target.value)} placeholder="e.g. Analyst" />
            </div>
          </div>
        )}

        {/* Step 4: Interests */}
        {step === 4 && (
          <div className="space-y-5">
            <MultiSelect label="Career Interests (select all that apply)"
              options={CAREER_INTERESTS} selected={form.careerInterests}
              onChange={(v) => set("careerInterests", v)} />
            <MultiSelect label="Skills" options={SKILLS} selected={form.skills}
              onChange={(v) => set("skills", v)} />
            <MultiSelect label="I'm looking for…" options={LOOKING_FOR} selected={form.lookingFor}
              onChange={(v) => set("lookingFor", v)} />
            <Textarea label="Bio / About Me" value={form.bio}
              onChange={(e) => set("bio", e.target.value)} rows={3}
              placeholder="Tell the network who you are, what you're passionate about, and what you're working on…"
              hint="150–300 words helps with better AI matching" />
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.openToMentor}
                onChange={(e) => set("openToMentor", e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded" />
              <span className="text-sm text-slate-700">I'm open to mentoring other students in the future</span>
            </label>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-2xl p-5 space-y-4 text-sm">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {form.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-base">{form.fullName || "—"}</p>
                  <p className="text-slate-500">{form.email}</p>
                </div>
              </div>
              {[
                ["Role", "Student"],
                ["Program", `${form.program}${form.specialization ? ` · ${form.specialization}` : ""}`],
                ["Roll Number", form.rollNumber || "—"],
                ["Batch", `Batch ${form.batchNumber || "—"} · ${form.batchYear}`],
                ["GPA", form.gpa ? `${form.gpa} / 4.0` : "Not provided"],
                ["Expected Graduation", form.expectedGraduation || "—"],
                ["Phone", form.phone || "—"],
                ["Nationality", form.nationality || "—"],
                ["Experience", form.workExperienceYears ? `${form.workExperienceYears} yrs` : "Not provided"],
                ["Career Interests", form.careerInterests.join(", ") || "None selected"],
                ["Skills", form.skills.join(", ") || "None selected"],
                ["Looking For", form.lookingFor.join(", ") || "Nothing selected"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2">
                  <span className="text-slate-400 font-medium flex-shrink-0">{k}</span>
                  <span className="text-slate-700 text-right">{v}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 text-center">
              By creating an account you agree to our{" "}
              <Link href="#" className="text-indigo-600 hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="#" className="text-indigo-600 hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          {step > 0 && (
            <Button variant="outline" onClick={() => { setError(""); setStep((s) => s - 1); }} className="flex-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button onClick={next} className="flex-1">
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={submit} className="flex-1 bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Profile…</> : <><CheckCircle className="w-4 h-4" /> Create Profile</>}
            </Button>
          )}
        </div>

        <p className="text-xs text-center text-slate-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-indigo-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
