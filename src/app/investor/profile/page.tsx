"use client";

import { useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Topbar } from "@/components/layout/topbar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PortfolioCompany {
  name: string;
  sector: string;
  stage: string;
  year_invested: string;
  status: "Active" | "Exited" | "Written Off" | "";
  exit_multiple: string;
  url: string;
}

interface ProfileForm {
  // from profiles table
  full_name: string;
  phone: string;
  nationality: string;
  bio: string;
  // from investor_profiles
  headline: string;
  location: string;
  linkedin_url: string;
  twitter_url: string;
  website_url: string;
  firm: string;
  firm_website: string;
  aum_range: string;
  firm_location: string;
  stage_focus: string[];
  industries: string[];
  geographies: string[];
  check_size_min: string;
  check_size_max: string;
  thesis_description: string;
  notable_investments: string;
  investment_thesis: string;
  portfolio_companies: PortfolioCompany[];
  alumni_connection: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STAGE_OPTIONS = [
  "Pre-seed",
  "Seed",
  "Series A",
  "Series B",
  "Growth",
  "Late Stage",
];

const AUM_OPTIONS = [
  { value: "", label: "Select AUM Range" },
  { value: "<$10M", label: "< $10M" },
  { value: "$10M-$100M", label: "$10M – $100M" },
  { value: "$100M-$1B", label: "$100M – $1B" },
  { value: ">$1B", label: "> $1B" },
  { value: "Individual Angel", label: "Individual Angel" },
];

const STATUS_OPTIONS: PortfolioCompany["status"][] = [
  "Active",
  "Exited",
  "Written Off",
];

const EMPTY_COMPANY: PortfolioCompany = {
  name: "",
  sector: "",
  stage: "",
  year_invested: "",
  status: "",
  exit_multiple: "",
  url: "",
};

const DEFAULT_FORM: ProfileForm = {
  full_name: "",
  phone: "",
  nationality: "",
  bio: "",
  headline: "",
  location: "",
  linkedin_url: "",
  twitter_url: "",
  website_url: "",
  firm: "",
  firm_website: "",
  aum_range: "",
  firm_location: "",
  stage_focus: [],
  industries: [],
  geographies: [],
  check_size_min: "",
  check_size_max: "",
  thesis_description: "",
  notable_investments: "",
  investment_thesis: "",
  portfolio_companies: [],
  alumni_connection: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcCompletion(form: ProfileForm): number {
  const fields: (string | string[])[] = [
    form.full_name,
    form.headline,
    form.bio,
    form.location,
    form.firm,
    form.aum_range,
    form.stage_focus,
    form.industries,
    form.geographies,
    form.thesis_description,
    form.notable_investments,
    form.linkedin_url,
    form.alumni_connection,
  ];
  const filled = fields.filter((f) =>
    Array.isArray(f) ? f.length > 0 : f.trim() !== ""
  ).length;
  return Math.round((filled / fields.length) * 100);
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ChipInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setInput("");
  };

  const remove = (idx: number) => {
    onChange(values.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex flex-wrap gap-2 mb-2 min-h-[28px]">
        {values.map((v, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-violet-100 text-violet-800"
          >
            {v}
            <button
              type="button"
              onClick={() => remove(i)}
              className="hover:text-violet-600 focus:outline-none font-bold"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder ?? "Type and press Enter"}
        />
        <Button
          type="button"
          variant="outline"
          onClick={add}
          className="text-sm shrink-0"
        >
          Add
        </Button>
      </div>
    </div>
  );
}

function StageChips({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (stage: string) => {
    onChange(
      selected.includes(stage)
        ? selected.filter((s) => s !== stage)
        : [...selected, stage]
    );
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Stage Focus
      </label>
      <div className="flex flex-wrap gap-2">
        {STAGE_OPTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => toggle(s)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              selected.includes(s)
                ? "bg-violet-600 text-white border-violet-600"
                : "bg-white text-gray-600 border-gray-300 hover:border-violet-400"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function PortfolioCompanyCard({
  company,
  index,
  onChange,
  onRemove,
}: {
  company: PortfolioCompany;
  index: number;
  onChange: (idx: number, field: keyof PortfolioCompany, value: string) => void;
  onRemove: (idx: number) => void;
}) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">
          {company.name || `Company #${index + 1}`}
        </span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-gray-400 hover:text-red-500 text-xs transition-colors"
        >
          Remove
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Company Name *
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={company.name}
            onChange={(e) => onChange(index, "name", e.target.value)}
            placeholder="Acme Inc."
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Sector
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={company.sector}
            onChange={(e) => onChange(index, "sector", e.target.value)}
            placeholder="FinTech"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Stage
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            value={company.stage}
            onChange={(e) => onChange(index, "stage", e.target.value)}
          >
            <option value="">Select stage</option>
            {STAGE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Year Invested
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={company.year_invested}
            onChange={(e) => onChange(index, "year_invested", e.target.value)}
            placeholder="2021"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Status
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            value={company.status}
            onChange={(e) => onChange(index, "status", e.target.value)}
          >
            <option value="">Select status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Exit Multiple
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={company.exit_multiple}
            onChange={(e) => onChange(index, "exit_multiple", e.target.value)}
            placeholder="3x"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Website URL
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          value={company.url}
          onChange={(e) => onChange(index, "url", e.target.value)}
          placeholder="https://acme.com"
        />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InvestorProfilePage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileForm>(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  // ── Load ──────────────────────────────────────────────────────────────────

  const loadProfile = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }
    setUserId(user.id);

    const [{ data: profile }, { data: inv }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("investor_profiles")
        .select("*")
        .eq("profile_id", user.id)
        .single(),
    ]);

    setForm({
      full_name: profile?.full_name ?? "",
      phone: profile?.phone ?? "",
      nationality: profile?.nationality ?? "",
      bio: profile?.bio ?? inv?.bio ?? "",
      headline: inv?.headline ?? "",
      location: inv?.location ?? "",
      linkedin_url: inv?.linkedin_url ?? profile?.linkedin_url ?? "",
      twitter_url: inv?.twitter_url ?? "",
      website_url: inv?.website_url ?? "",
      firm: inv?.firm ?? "",
      firm_website: inv?.firm_website ?? "",
      aum_range: inv?.aum_range ?? "",
      firm_location: inv?.firm_location ?? "",
      stage_focus: inv?.stage_focus ?? [],
      industries: inv?.industries ?? [],
      geographies: inv?.geographies ?? [],
      check_size_min: inv?.check_size_min?.toString() ?? "",
      check_size_max: inv?.check_size_max?.toString() ?? "",
      thesis_description: inv?.thesis_description ?? "",
      notable_investments: inv?.notable_investments ?? "",
      investment_thesis: inv?.investment_thesis ?? "",
      portfolio_companies: inv?.portfolio_companies ?? [],
      alumni_connection: inv?.alumni_connection ?? "",
    });
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // ── Save ──────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);

    const portfolioCount = form.portfolio_companies.length;

    const [profileResult, investorResult] = await Promise.all([
      supabase.from("profiles").upsert({
        id: userId,
        full_name: form.full_name,
        phone: form.phone,
        nationality: form.nationality,
        bio: form.bio,
        linkedin_url: form.linkedin_url,
      }),
      supabase.from("investor_profiles").upsert({
        profile_id: userId,
        firm: form.firm,
        firm_website: form.firm_website,
        aum_range: form.aum_range,
        firm_location: form.firm_location,
        industries: form.industries,
        stage_focus: form.stage_focus,
        geographies: form.geographies,
        check_size_min:
          form.check_size_min !== "" ? parseFloat(form.check_size_min) : null,
        check_size_max:
          form.check_size_max !== "" ? parseFloat(form.check_size_max) : null,
        thesis_description: form.thesis_description,
        notable_investments: form.notable_investments,
        investment_thesis: form.investment_thesis,
        portfolio_companies: form.portfolio_companies,
        portfolio_count: portfolioCount,
        bio: form.bio,
        headline: form.headline,
        location: form.location,
        linkedin_url: form.linkedin_url,
        twitter_url: form.twitter_url,
        website_url: form.website_url,
        alumni_connection: form.alumni_connection,
        updated_at: new Date().toISOString(),
      }),
    ]);

    setSaving(false);

    if (profileResult.error || investorResult.error) {
      const msg =
        profileResult.error?.message ??
        investorResult.error?.message ??
        "Save failed";
      setToast({ type: "error", msg });
    } else {
      setToast({ type: "success", msg: "Profile saved successfully!" });
    }

    setTimeout(() => setToast(null), 3500);
  };

  // ── Form helpers ──────────────────────────────────────────────────────────

  function set<K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const updateCompany = (
    idx: number,
    field: keyof PortfolioCompany,
    value: string
  ) => {
    const updated = form.portfolio_companies.map((c, i) =>
      i === idx ? { ...c, [field]: value } : c
    );
    set("portfolio_companies", updated);
  };

  const addCompany = () =>
    set("portfolio_companies", [
      ...form.portfolio_companies,
      { ...EMPTY_COMPANY },
    ]);

  const removeCompany = (idx: number) =>
    set(
      "portfolio_companies",
      form.portfolio_companies.filter((_, i) => i !== idx)
    );

  // ── Derived ───────────────────────────────────────────────────────────────

  const completion = calcCompletion(form);
  const initials = getInitials(form.full_name);

  // ── Loading State ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar
        title="Investor Profile"
        subtitle="Share your thesis and portfolio with the startup ecosystem"
      />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            toast.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {toast.type === "success" ? "✓ " : "✕ "}
          {toast.msg}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── Profile Header ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">
              {initials}
            </div>

            {/* Name / headline / completion */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 truncate">
                {form.full_name || "Your Name"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5 truncate">
                {form.headline || "Add your headline below"}
              </p>
              <div className="mt-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-violet-700 whitespace-nowrap">
                    {completion}% complete
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Complete your profile to get better matches with founders
                </p>
              </div>
            </div>

            {/* Stats + Save */}
            <div className="flex flex-col items-end gap-3 shrink-0">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-xl font-medium shadow-sm disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Profile"}
              </Button>
              <div className="flex gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-violet-600">
                    {form.portfolio_companies.length}
                  </p>
                  <p className="text-xs text-gray-400">Portfolio</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-indigo-600">
                    {form.stage_focus.length}
                  </p>
                  <p className="text-xs text-gray-400">Stages</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-violet-600">
                    {form.industries.length}
                  </p>
                  <p className="text-xs text-gray-400">Industries</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN (2/3) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Personal Info */}
            <Card className="shadow-sm border border-gray-100 rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold shrink-0">
                    P
                  </span>
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                      value={form.full_name}
                      onChange={(e) => set("full_name", e.target.value)}
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="+1 555 000 0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nationality
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                      value={form.nationality}
                      onChange={(e) => set("nationality", e.target.value)}
                      placeholder="American"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location (City / Country)
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                      value={form.location}
                      onChange={(e) => set("location", e.target.value)}
                      placeholder="San Francisco, USA"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Headline
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    value={form.headline}
                    onChange={(e) => set("headline", e.target.value)}
                    placeholder="Partner at Sequoia | Investing in AI & SaaS | MBA 2012"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                    rows={4}
                    value={form.bio}
                    onChange={(e) => set("bio", e.target.value)}
                    placeholder="Tell founders about yourself, your background, and what excites you about investing..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Firm Details */}
            <Card className="shadow-sm border border-gray-100 rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                    F
                  </span>
                  Firm Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Firm Name *
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                      value={form.firm}
                      onChange={(e) => set("firm", e.target.value)}
                      placeholder="Sequoia Capital"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Firm Website
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                      value={form.firm_website}
                      onChange={(e) => set("firm_website", e.target.value)}
                      placeholder="https://sequoiacap.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      AUM Range
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                      value={form.aum_range}
                      onChange={(e) => set("aum_range", e.target.value)}
                    >
                      {AUM_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Firm Location
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                      value={form.firm_location}
                      onChange={(e) => set("firm_location", e.target.value)}
                      placeholder="Menlo Park, CA"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investment Thesis */}
            <Card className="shadow-sm border border-gray-100 rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold shrink-0">
                    T
                  </span>
                  Investment Thesis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thesis Description
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                    rows={4}
                    value={form.thesis_description}
                    onChange={(e) => set("thesis_description", e.target.value)}
                    placeholder="Describe what you look for in founders and companies — market size, team, differentiation, traction signals..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notable Investments
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                    rows={4}
                    value={form.notable_investments}
                    onChange={(e) => set("notable_investments", e.target.value)}
                    placeholder="Describe 2-3 notable portfolio companies and their outcomes (e.g. Acme — acquired by Google 2023 at 5x, Bravo — currently Series B)..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Companies */}
            <Card className="shadow-sm border border-gray-100 rounded-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                      C
                    </span>
                    Portfolio Companies
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold">
                      {form.portfolio_companies.length}
                    </span>
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCompany}
                    className="text-sm border-violet-300 text-violet-700 hover:bg-violet-50"
                  >
                    + Add Company
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {form.portfolio_companies.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <div className="text-5xl mb-3">🏢</div>
                    <p className="text-sm font-medium">
                      No portfolio companies added yet
                    </p>
                    <p className="text-xs mt-1">
                      Click &quot;+ Add Company&quot; to showcase your investments
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {form.portfolio_companies.map((company, idx) => (
                      <PortfolioCompanyCard
                        key={idx}
                        company={company}
                        index={idx}
                        onChange={updateCompany}
                        onRemove={removeCompany}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN (1/3) */}
          <div className="space-y-6">

            {/* Investment Focus */}
            <Card className="shadow-sm border border-gray-100 rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold shrink-0">
                    I
                  </span>
                  Investment Focus
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <StageChips
                  selected={form.stage_focus}
                  onChange={(v) => set("stage_focus", v)}
                />

                <ChipInput
                  label="Industries"
                  values={form.industries}
                  onChange={(v) => set("industries", v)}
                  placeholder="e.g. FinTech, SaaS, HealthTech"
                />

                <ChipInput
                  label="Geographies"
                  values={form.geographies}
                  onChange={(v) => set("geographies", v)}
                  placeholder="e.g. North America, SEA"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check Size (USD)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Minimum</p>
                      <input
                        type="number"
                        min={0}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                        value={form.check_size_min}
                        onChange={(e) => set("check_size_min", e.target.value)}
                        placeholder="25000"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Maximum</p>
                      <input
                        type="number"
                        min={0}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                        value={form.check_size_max}
                        onChange={(e) => set("check_size_max", e.target.value)}
                        placeholder="500000"
                      />
                    </div>
                  </div>
                  {form.check_size_min && form.check_size_max && (
                    <p className="text-xs text-violet-600 mt-1 font-medium">
                      ${Number(form.check_size_min).toLocaleString()} –{" "}
                      ${Number(form.check_size_max).toLocaleString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Alumni Connection */}
            <Card className="shadow-sm border border-gray-100 rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                    A
                  </span>
                  Alumni Connection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  value={form.alumni_connection}
                  onChange={(e) => set("alumni_connection", e.target.value)}
                  placeholder="MBA 2014, Finance Club President"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Share your class year, clubs, or activities to connect with
                  fellow alumni founders.
                </p>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="shadow-sm border border-gray-100 rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold shrink-0">
                    S
                  </span>
                  Social Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    value={form.linkedin_url}
                    onChange={(e) => set("linkedin_url", e.target.value)}
                    placeholder="https://linkedin.com/in/yourname"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Twitter / X URL
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    value={form.twitter_url}
                    onChange={(e) => set("twitter_url", e.target.value)}
                    placeholder="https://x.com/yourhandle"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Personal Website
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    value={form.website_url}
                    onChange={(e) => set("website_url", e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-sm border border-gray-100 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-800">
                  Profile Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-violet-600">
                    {form.portfolio_companies.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Portfolio Co.</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">
                    {form.industries.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Industries</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-violet-600">
                    {form.stage_focus.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Stages</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">
                    {form.geographies.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Geographies</p>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Save Button */}
            <div className="lg:hidden">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl font-semibold shadow disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
