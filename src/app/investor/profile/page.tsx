"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";
import {
  User, Save, CheckCircle, Loader2, AlertCircle,
  Link2, Building2, TrendingUp, Briefcase,
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

function ChipInput({ chips, setChips, placeholder }: { chips: string[]; setChips: (v: string[]) => void; placeholder: string }) {
  const [input, setInput] = useState("");
  return (
    <>
      <div className="flex flex-wrap gap-2 mb-2">
        {chips.map(chip => (
          <span key={chip} className="flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full">
            {chip}
            <button onClick={() => setChips(chips.filter(c => c !== chip))} className="hover:text-red-500">×</button>
          </span>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter" && input.trim()) {
            setChips([...chips, input.trim()]);
            setInput("");
            e.preventDefault();
          }
        }}
        placeholder={placeholder}
        className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 w-full"
      />
    </>
  );
}

export default function InvestorProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");

  // Personal
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");

  // Firm details
  const [investorType, setInvestorType] = useState("");
  const [firmName, setFirmName] = useState("");
  const [aumRange, setAumRange] = useState("");
  const [firmLocation, setFirmLocation] = useState("");
  const [firmWebsite, setFirmWebsite] = useState("");

  // Investment thesis
  const [stageFocus, setStageFocus] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [geographies, setGeographies] = useState<string[]>([]);
  const [checkSizeRange, setCheckSizeRange] = useState("");
  const [thesisDescription, setThesisDescription] = useState("");

  // Portfolio
  const [portfolioCount, setPortfolioCount] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [notableInvestments, setNotableInvestments] = useState("");

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

      const { data: ip } = await supabase.from("investor_profiles").select("*").eq("id", user.id).single();
      if (ip) {
        setInvestorType(ip.investor_type || "");
        setFirmName(ip.firm_name || "");
        setAumRange(ip.aum_range || "");
        setFirmLocation(ip.firm_location || "");
        setFirmWebsite(ip.firm_website || "");
        setStageFocus(ip.stage_focus || []);
        setSectors(ip.sectors || []);
        setGeographies(ip.geographies || []);
        setCheckSizeRange(ip.check_size_range || "");
        setThesisDescription(ip.thesis_description || "");
        setPortfolioCount(ip.portfolio_count?.toString() || "");
        setLinkedinUrl(ip.linkedin_url || "");
        setNotableInvestments(ip.notable_investments || "");
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

    const { error: e2 } = await supabase.from("investor_profiles").upsert({
      id: userId,
      investor_type: investorType,
      firm_name: firmName,
      aum_range: aumRange,
      firm_location: firmLocation,
      firm_website: firmWebsite,
      stage_focus: stageFocus,
      sectors,
      geographies,
      check_size_range: checkSizeRange,
      thesis_description: thesisDescription,
      portfolio_count: portfolioCount ? parseInt(portfolioCount) : null,
      linkedin_url: linkedinUrl,
      notable_investments: notableInvestments,
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

  // Profile completion (~12 key fields)
  const fields = [
    fullName, bio, investorType, firmName, aumRange, firmLocation,
    stageFocus.length > 0 ? "filled" : "",
    sectors.length > 0 ? "filled" : "",
    checkSizeRange, thesisDescription, portfolioCount, linkedinUrl,
  ];
  const filled = fields.filter(Boolean).length;
  const completion = Math.round((filled / fields.length) * 100);

  if (loading) {
    return (
      <>
        <Topbar title="My Profile" subtitle="Manage your investor profile" />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
        </main>
      </>
    );
  }

  return (
    <>
      <Topbar title="My Profile" subtitle="Attract the right deal flow by keeping your profile complete" />
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
              {completion === 100 ? "Your profile is complete!" : "Complete your profile to receive better matched deal flow."}
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
              <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Rajiv Menon" className={inputCls} />
            </Field>
          </div>
          <Field label="Bio">
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
              placeholder="Describe your investment background, what excites you, and what founders can expect from you..."
              className={inputCls} />
          </Field>
        </SectionCard>

        {/* Firm Details */}
        <SectionCard title="Firm Details" icon={Building2}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Investor Type" required>
              <select value={investorType} onChange={e => setInvestorType(e.target.value)} className={inputCls}>
                <option value="">Select type</option>
                <option>Angel Investor</option>
                <option>Venture Capital</option>
                <option>Private Equity</option>
                <option>Family Office</option>
                <option>Corporate VC</option>
                <option>Accelerator / Incubator</option>
                <option>Micro VC</option>
                <option>Hedge Fund</option>
                <option>Sovereign Wealth Fund</option>
              </select>
            </Field>
            <Field label="Firm Name">
              <input value={firmName} onChange={e => setFirmName(e.target.value)} placeholder="e.g. Nexus Venture Partners" className={inputCls} />
            </Field>
            <Field label="AUM Range">
              <select value={aumRange} onChange={e => setAumRange(e.target.value)} className={inputCls}>
                <option value="">Select AUM range</option>
                <option>{"< $10M"}</option>
                <option>$10M – $50M</option>
                <option>$50M – $200M</option>
                <option>$200M – $1B</option>
                <option>$1B – $5B</option>
                <option>{"> $5B"}</option>
              </select>
            </Field>
            <Field label="Firm Location">
              <input value={firmLocation} onChange={e => setFirmLocation(e.target.value)} placeholder="e.g. Mumbai, India" className={inputCls} />
            </Field>
            <Field label="Firm Website">
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={firmWebsite} onChange={e => setFirmWebsite(e.target.value)}
                  placeholder="https://yourfirm.com" className={`${inputCls} pl-9`} />
              </div>
            </Field>
          </div>
        </SectionCard>

        {/* Investment Thesis */}
        <SectionCard title="Investment Thesis" icon={TrendingUp}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Check Size Range">
              <select value={checkSizeRange} onChange={e => setCheckSizeRange(e.target.value)} className={inputCls}>
                <option value="">Select range</option>
                <option>{"< $50K"}</option>
                <option>$50K – $250K</option>
                <option>$250K – $1M</option>
                <option>$1M – $5M</option>
                <option>$5M – $25M</option>
                <option>{"$25M+"}</option>
              </select>
            </Field>
          </div>

          <Field label="Stage Focus">
            <ChipInput chips={stageFocus} setChips={setStageFocus} placeholder="Type a stage and press Enter (e.g. Pre-Seed, Series A)" />
          </Field>

          <Field label="Sectors">
            <ChipInput chips={sectors} setChips={setSectors} placeholder="Type a sector and press Enter (e.g. FinTech, HealthTech)" />
          </Field>

          <Field label="Geographies">
            <ChipInput chips={geographies} setChips={setGeographies} placeholder="Type a geography and press Enter (e.g. India, SEA)" />
          </Field>

          <Field label="Investment Thesis">
            <textarea value={thesisDescription} onChange={e => setThesisDescription(e.target.value)} rows={4}
              placeholder="Describe your investment thesis — what problems you focus on, what stage and sector, and what you look for in founders..."
              className={inputCls} />
          </Field>
        </SectionCard>

        {/* Portfolio */}
        <SectionCard title="Portfolio" icon={Briefcase}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Portfolio Companies Count">
              <input type="number" value={portfolioCount} onChange={e => setPortfolioCount(e.target.value)}
                placeholder="e.g. 18" min="0" className={inputCls} />
            </Field>
            <Field label="LinkedIn URL">
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)}
                  placeholder="linkedin.com/in/yourname" className={`${inputCls} pl-9`} />
              </div>
            </Field>
          </div>
          <Field label="Notable Investments">
            <textarea value={notableInvestments} onChange={e => setNotableInvestments(e.target.value)} rows={3}
              placeholder="List some notable portfolio companies or exits (e.g. Zomato, Razorpay, Zepto)..."
              className={inputCls} />
          </Field>
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
