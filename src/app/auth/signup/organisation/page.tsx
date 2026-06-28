"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, ArrowRight, CheckCircle, Loader2, AlertCircle,
  Eye, EyeOff, Building2,
} from "lucide-react";

const STEPS = ["Account Setup", "Organisation Info", "Details & Focus", "Review & Submit"];

const ORG_TYPES = [
  { value: "club", label: "Student / University Club" },
  { value: "company", label: "Company" },
  { value: "ngo", label: "NGO / Non-Profit" },
  { value: "startup", label: "Startup" },
  { value: "association", label: "Professional Association" },
  { value: "institute", label: "Institute / Academy" },
  { value: "government", label: "Government Body" },
  { value: "other", label: "Other" },
];

const INDUSTRIES = [
  { value: "Technology", label: "Technology" },
  { value: "Finance", label: "Finance & Banking" },
  { value: "Consulting", label: "Consulting" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Education", label: "Education" },
  { value: "Media", label: "Media & Entertainment" },
  { value: "Retail", label: "Retail & FMCG" },
  { value: "Manufacturing", label: "Manufacturing" },
  { value: "Real Estate", label: "Real Estate" },
  { value: "Government", label: "Government" },
  { value: "Non-profit", label: "Non-Profit" },
  { value: "Legal", label: "Legal" },
  { value: "Other", label: "Other" },
];

const ORG_SIZES = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "500+", label: "500+ employees" },
];

interface Form {
  email: string;
  password: string;
  confirmPassword: string;
  orgName: string;
  contactName: string;
  phone: string;
  headline: string;
  description: string;
  orgType: string;
  industry: string;
  orgSize: string;
  foundedYear: string;
  location: string;
  website: string;
  linkedinUrl: string;
}

const INIT: Form = {
  email: "", password: "", confirmPassword: "",
  orgName: "", contactName: "", phone: "",
  headline: "", description: "", orgType: "", industry: "",
  orgSize: "", foundedYear: "", location: "", website: "", linkedinUrl: "",
};

export default function OrganisationSignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(INIT);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const set = (key: keyof Form, val: string) => setForm(p => ({ ...p, [key]: val }));

  function validateStep(): string {
    if (step === 0) {
      if (!form.email || !form.password || !form.confirmPassword) return "All fields are required.";
      if (form.password.length < 8) return "Password must be at least 8 characters.";
      if (form.password !== form.confirmPassword) return "Passwords do not match.";
    }
    if (step === 1) {
      if (!form.orgName) return "Organisation name is required.";
      if (!form.contactName) return "Contact person name is required.";
    }
    if (step === 2) {
      if (!form.orgType) return "Please select an organisation type.";
    }
    return "";
  }

  function next() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep(s => s + 1);
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
        options: { data: { full_name: form.orgName, role: "organisation" } },
      });
      if (signUpError) throw new Error(signUpError.message);
      if (!authData.user) throw new Error("Signup failed.");
      const uid = authData.user.id;

      await supabase.from("profiles").upsert({
        id: uid,
        role: "organisation",
        full_name: form.orgName,
        email: form.email,
        phone: form.phone,
        is_profile_complete: true,
      });

      await supabase.from("organisation_profiles").upsert({
        profile_id: uid,
        headline: form.headline,
        description: form.description,
        org_type: form.orgType || null,
        industry: form.industry,
        org_size: form.orgSize || null,
        founded_year: form.foundedYear ? parseInt(form.foundedYear) : null,
        location: form.location,
        website: form.website,
        linkedin_url: form.linkedinUrl,
      });

      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (done) return (
    <div className="bg-white/95 rounded-3xl shadow-2xl p-10 text-center border border-white/20">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900">Welcome to UniConnect!</h2>
      <p className="text-slate-500 mt-2 text-sm">Verify your email then sign in to start posting events and opportunities.</p>
      <Button className="mt-6 w-full" size="lg" onClick={() => router.push("/auth/login")}>Go to Login</Button>
    </div>
  );

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-8 pt-7 pb-5">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/auth/signup" className="text-teal-200 hover:text-white"><ArrowLeft className="w-4 h-4" /></Link>
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center ml-1">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Organisation Registration</p>
            <p className="text-teal-200 text-xs">Step {step + 1} of {STEPS.length}</p>
          </div>
        </div>
        <div className="flex gap-1">
          {STEPS.map((_, i) => <div key={i} className={`h-1.5 rounded-full flex-1 transition-all ${i <= step ? "bg-white" : "bg-white/25"}`} />)}
        </div>
        <p className="text-white font-semibold mt-3">{STEPS[step]}</p>
      </div>

      <div className="p-7 space-y-5">
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}
          </div>
        )}

        {step === 0 && (
          <div className="space-y-4">
            <Input label="Email" type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="contact@yourorg.com" required />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Password<span className="text-red-500 ml-0.5">*</span></label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={e => set("password", e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full px-4 py-2.5 pr-11 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-200"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Input label="Confirm Password" type="password" value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} placeholder="Re-enter password" required />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Input label="Organisation Name" value={form.orgName} onChange={e => set("orgName", e.target.value)} placeholder="e.g. Finance & Investment Club" required />
            <Input label="Contact Person Name" value={form.contactName} onChange={e => set("contactName", e.target.value)} placeholder="Your name" required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Phone" type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+61 2 1234 5678" />
              <Input label="Location" value={form.location} onChange={e => set("location", e.target.value)} placeholder="Sydney, Australia" />
            </div>
            <Input label="Tagline" value={form.headline} onChange={e => set("headline", e.target.value)} placeholder="Empowering the next generation of finance leaders" />
            <Textarea label="Description" value={form.description} onChange={e => set("description", e.target.value)} rows={3} placeholder="Tell students about your organisation, mission, and what opportunities you offer..." />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Select label="Organisation Type" value={form.orgType} onChange={e => set("orgType", e.target.value)} required placeholder="Select type" options={ORG_TYPES} />
            <Select label="Industry" value={form.industry} onChange={e => set("industry", e.target.value)} placeholder="Select industry" options={INDUSTRIES} />
            <div className="grid grid-cols-2 gap-4">
              <Select label="Organisation Size" value={form.orgSize} onChange={e => set("orgSize", e.target.value)} placeholder="Select size" options={ORG_SIZES} />
              <Input label="Founded Year" type="number" value={form.foundedYear} onChange={e => set("foundedYear", e.target.value)} placeholder="2010" min="1900" max={String(new Date().getFullYear())} />
            </div>
            <Input label="Website" type="url" value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://yourorg.com" />
            <Input label="LinkedIn" type="url" value={form.linkedinUrl} onChange={e => set("linkedinUrl", e.target.value)} placeholder="https://linkedin.com/company/..." />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-2xl p-5 space-y-3 text-sm">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-lg">
                  {form.orgName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "ORG"}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{form.orgName || "—"}</p>
                  <p className="text-slate-500 text-xs">{form.email}</p>
                </div>
              </div>
              {[
                ["Role", "Organisation"],
                ["Type", form.orgType || "—"],
                ["Industry", form.industry || "—"],
                ["Size", form.orgSize || "—"],
                ["Founded", form.foundedYear || "—"],
                ["Location", form.location || "—"],
                ["Website", form.website || "—"],
                ["Contact", form.contactName || "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2">
                  <span className="text-slate-400 font-medium flex-shrink-0">{k}</span>
                  <span className="text-slate-700 text-right">{v}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-slate-400">
              By creating an account you agree to our{" "}
              <Link href="#" className="text-teal-600 hover:underline">Terms</Link> and{" "}
              <Link href="#" className="text-teal-600 hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {step > 0 && (
            <Button variant="outline" onClick={() => { setError(""); setStep(s => s - 1); }} className="flex-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button onClick={next} className="flex-1 bg-teal-600 hover:bg-teal-700">
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
          <Link href="/auth/login" className="text-teal-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
