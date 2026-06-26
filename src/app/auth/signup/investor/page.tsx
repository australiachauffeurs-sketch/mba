"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, AlertCircle, Eye, EyeOff, TrendingUp } from "lucide-react";

const STEPS = ["Account Setup", "Personal Info", "Firm Details", "Investment Thesis", "Portfolio & Background", "Review & Submit"];

const FIRM_TYPES = [
  { value: "VC", label: "Venture Capital Firm" }, { value: "PE", label: "Private Equity" },
  { value: "Angel", label: "Angel Investor (Individual)" }, { value: "Family_Office", label: "Family Office" },
  { value: "CVC", label: "Corporate Venture Capital" }, { value: "Accelerator", label: "Accelerator / Incubator" },
  { value: "Sovereign", label: "Sovereign Wealth Fund" }, { value: "Impact", label: "Impact Investment Fund" },
];

const AUM_RANGES = [
  { value: "<1M", label: "< $1M (Angel)" }, { value: "1M-10M", label: "$1M – $10M" },
  { value: "10M-50M", label: "$10M – $50M" }, { value: "50M-250M", label: "$50M – $250M" },
  { value: "250M-1B", label: "$250M – $1B" }, { value: ">1B", label: "> $1B" },
];

const STAGE_OPTIONS = ["Pre-seed", "Seed", "Series A", "Series B", "Series C+", "Growth", "Late Stage", "Pre-IPO"];
const SECTOR_OPTIONS = [
  "Fintech", "SaaS / B2B Software", "Consumer Tech", "HealthTech", "EdTech",
  "CleanTech / Sustainability", "AI / ML", "Payments & Remittances", "InsurTech",
  "RegTech", "PropTech", "Logistics & Supply Chain", "Developer Tools", "Web3 / Crypto",
];
const GEO_OPTIONS = ["North America", "Europe", "South & Southeast Asia", "Sub-Saharan Africa", "MENA", "Latin America", "East Asia", "Global Agnostic"];

function toggle(arr: string[], val: string) { return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]; }

function MultiSelect({ label, options, selected, onChange, color = "amber" }: {
  label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void; color?: string;
}) {
  const active = color === "amber" ? "bg-amber-500 text-white border-amber-500" : "bg-indigo-600 text-white border-indigo-600";
  const inactive = color === "amber" ? "bg-white text-slate-600 border-slate-200 hover:border-amber-300" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300";
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o} type="button" onClick={() => onChange(toggle(selected, o))}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selected.includes(o) ? active : inactive}`}>{o}</button>
        ))}
      </div>
    </div>
  );
}

interface Form {
  email: string; password: string; confirmPassword: string;
  fullName: string; phone: string; nationality: string; dateOfBirth: string; gender: string;
  firmName: string; firmType: string; firmWebsite: string; aum: string; firmLocation: string;
  stageFocus: string[]; sectors: string[]; geographies: string[];
  checkSizeMin: string; checkSizeMax: string; thesisDescription: string;
  notableInvestments: string; portfolioCount: string; linkedinUrl: string; twitterUrl: string;
  bio: string; alumniConnection: string;
}

const INIT: Form = {
  email: "", password: "", confirmPassword: "",
  fullName: "", phone: "", nationality: "", dateOfBirth: "", gender: "",
  firmName: "", firmType: "", firmWebsite: "", aum: "", firmLocation: "",
  stageFocus: [], sectors: [], geographies: [],
  checkSizeMin: "", checkSizeMax: "", thesisDescription: "",
  notableInvestments: "", portfolioCount: "", linkedinUrl: "", twitterUrl: "",
  bio: "", alumniConnection: "",
};

export default function InvestorSignupPage() {
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
    if (step === 1 && (!form.fullName || !form.phone || !form.nationality)) return "Full name, phone, and nationality are required.";
    if (step === 2 && (!form.firmType || !form.aum)) return "Firm type and AUM range are required.";
    if (step === 3 && (form.stageFocus.length === 0 || form.sectors.length === 0)) return "Select at least one stage and one sector.";
    return "";
  }

  function next() { const err = validateStep(); if (err) { setError(err); return; } setError(""); setStep((s) => s + 1); }

  async function submit() {
    const err = validateStep(); if (err) { setError(err); return; }
    setError(""); setLoading(true);
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: form.email, password: form.password,
        options: { data: { full_name: form.fullName, role: "investor" } },
      });
      if (signUpError) throw new Error(signUpError.message);
      if (!authData.user) throw new Error("Signup failed.");
      const uid = authData.user.id;
      await supabase.from("profiles").upsert({
        id: uid, role: "investor", full_name: form.fullName, email: form.email, bio: form.bio,
        phone: form.phone, nationality: form.nationality, date_of_birth: form.dateOfBirth,
        gender: form.gender, linkedin_url: form.linkedinUrl, is_profile_complete: true,
      });
      await supabase.from("investor_profiles").upsert({
        profile_id: uid, firm_name: form.firmName, firm_type: form.firmType,
        firm_website: form.firmWebsite, aum_range: form.aum, firm_location: form.firmLocation,
        stage_focus: form.stageFocus, sectors: form.sectors, geographies: form.geographies,
        check_size_min: form.checkSizeMin ? parseFloat(form.checkSizeMin) : null,
        check_size_max: form.checkSizeMax ? parseFloat(form.checkSizeMax) : null,
        thesis_description: form.thesisDescription, notable_investments: form.notableInvestments,
        portfolio_count: form.portfolioCount ? parseInt(form.portfolioCount) : 0,
        twitter_url: form.twitterUrl, alumni_connection: form.alumniConnection,
      });
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally { setLoading(false); }
  }

  if (done) return (
    <div className="bg-white/95 rounded-3xl shadow-2xl p-10 text-center border border-white/20">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5"><CheckCircle className="w-8 h-8 text-green-600" /></div>
      <h2 className="text-2xl font-bold text-slate-900">Application submitted!</h2>
      <p className="text-slate-500 mt-2 text-sm">Investor accounts are verified within 24 hours. Check your email for next steps.</p>
      <Button className="mt-6 w-full" size="lg" onClick={() => router.push("/auth/login")}>Go to Login</Button>
    </div>
  );

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 pt-7 pb-5">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/auth/signup" className="text-amber-100 hover:text-white"><ArrowLeft className="w-4 h-4" /></Link>
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center ml-1"><TrendingUp className="w-4 h-4 text-white" /></div>
          <div><p className="text-white font-semibold text-sm">Investor Registration</p><p className="text-amber-100 text-xs">Step {step + 1} of {STEPS.length}</p></div>
        </div>
        <div className="flex gap-1">{STEPS.map((_, i) => <div key={i} className={`h-1.5 rounded-full flex-1 ${i <= step ? "bg-white" : "bg-white/30"}`} />)}</div>
        <p className="text-white font-semibold mt-3">{STEPS[step]}</p>
      </div>

      <div className="p-7 space-y-5">
        {error && <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700"><AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}</div>}

        {step === 0 && (
          <div className="space-y-4">
            <Input label="Email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@yourfirm.com" required />
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
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              ⚡ Investor accounts are verified by our team within 24 hours before gaining full access to deal flow and founder profiles.
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Input label="Full Name" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="As it appears on official documents" required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 (555) 000-0000" required />
              <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Gender" value={form.gender} onChange={(e) => set("gender", e.target.value)} placeholder="Select" options={[
                { value: "male", label: "Male" }, { value: "female", label: "Female" },
                { value: "non-binary", label: "Non-binary" }, { value: "prefer-not", label: "Prefer not to say" },
              ]} />
              <Input label="Nationality" value={form.nationality} onChange={(e) => set("nationality", e.target.value)} placeholder="e.g. Japanese" required />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Select label="Investor Type" value={form.firmType} onChange={(e) => set("firmType", e.target.value)} required placeholder="Select type" options={FIRM_TYPES} />
            <Input label="Firm / Fund Name" value={form.firmName} onChange={(e) => set("firmName", e.target.value)} placeholder="e.g. Asia Capital Partners" hint="Leave blank if angel investor" />
            <div className="grid grid-cols-2 gap-4">
              <Select label="AUM / Fund Size" value={form.aum} onChange={(e) => set("aum", e.target.value)} required placeholder="Select range" options={AUM_RANGES} />
              <Input label="Firm HQ / Location" value={form.firmLocation} onChange={(e) => set("firmLocation", e.target.value)} placeholder="e.g. Tokyo, Japan" />
            </div>
            <Input label="Firm Website" type="url" value={form.firmWebsite} onChange={(e) => set("firmWebsite", e.target.value)} placeholder="https://yourfirm.com" />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <MultiSelect label="Stage Focus" options={STAGE_OPTIONS} selected={form.stageFocus} onChange={(v) => set("stageFocus", v)} />
            <MultiSelect label="Sectors of Interest" options={SECTOR_OPTIONS} selected={form.sectors} onChange={(v) => set("sectors", v)} />
            <MultiSelect label="Geographies" options={GEO_OPTIONS} selected={form.geographies} onChange={(v) => set("geographies", v)} color="indigo" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Min Check Size (USD)" type="number" value={form.checkSizeMin} onChange={(e) => set("checkSizeMin", e.target.value)} placeholder="e.g. 50000" />
              <Input label="Max Check Size (USD)" type="number" value={form.checkSizeMax} onChange={(e) => set("checkSizeMax", e.target.value)} placeholder="e.g. 500000" />
            </div>
            <Textarea label="Investment Thesis" value={form.thesisDescription} onChange={(e) => set("thesisDescription", e.target.value)} rows={3} placeholder="Describe your investment philosophy, what you look for in founders and companies, and what differentiates your thesis…" hint="This is used by the AI matching engine to find relevant deals" />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Portfolio Companies (count)" type="number" value={form.portfolioCount} onChange={(e) => set("portfolioCount", e.target.value)} placeholder="e.g. 12" min="0" />
              <Input label="LinkedIn URL" type="url" value={form.linkedinUrl} onChange={(e) => set("linkedinUrl", e.target.value)} placeholder="linkedin.com/in/yourname" hint="Required for verification" />
            </div>
            <Textarea label="Notable Investments" value={form.notableInvestments} onChange={(e) => set("notableInvestments", e.target.value)} rows={2} placeholder="e.g. Series A in XYZ (2023), Seed in ABC (2022)…" />
            <Input label="Twitter / X Profile" type="url" value={form.twitterUrl} onChange={(e) => set("twitterUrl", e.target.value)} placeholder="twitter.com/yourhandle" />
            <Input label="Alumni Connection" value={form.alumniConnection} onChange={(e) => set("alumniConnection", e.target.value)} placeholder="e.g. MBA '12, Harvard Business School" hint="Any connection to this university's alumni network?" />
            <Textarea label="Investor Bio" value={form.bio} onChange={(e) => set("bio", e.target.value)} rows={3} placeholder="Brief background on your investment career and what you offer beyond capital to portfolio founders…" />
          </div>
        )}

        {step === 5 && (
          <div className="bg-slate-50 rounded-2xl p-5 space-y-3 text-sm">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-lg">
                {form.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div><p className="font-bold text-slate-900">{form.fullName || "—"}</p><p className="text-slate-500 text-xs">{form.email}</p></div>
            </div>
            {[
              ["Role", "Investor"], ["Type", form.firmType || "—"],
              ["Firm", form.firmName || "Individual Angel"], ["AUM", form.aum || "—"],
              ["Stage Focus", form.stageFocus.join(", ") || "—"],
              ["Sectors", form.sectors.join(", ") || "—"],
              ["Geographies", form.geographies.join(", ") || "—"],
              ["Check Size", form.checkSizeMin && form.checkSizeMax ? `$${Number(form.checkSizeMin).toLocaleString()} – $${Number(form.checkSizeMax).toLocaleString()}` : "Not specified"],
              ["Portfolio", `${form.portfolioCount || "0"} companies`],
              ["Nationality", form.nationality || "—"],
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
            <Button onClick={next} className="flex-1 bg-amber-500 hover:bg-amber-600">Continue <ArrowRight className="w-4 h-4" /></Button>
          ) : (
            <Button onClick={submit} className="flex-1 bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <><CheckCircle className="w-4 h-4" /> Submit Application</>}
            </Button>
          )}
        </div>
        <p className="text-xs text-center text-slate-400">Already have an account? <Link href="/auth/login" className="text-indigo-600 hover:underline">Sign in</Link></p>
      </div>
    </div>
  );
}
