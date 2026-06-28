"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle, ExternalLink, Globe } from "lucide-react";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ORG_TYPES = ["club", "company", "ngo", "startup", "association", "institute", "government", "other"];
const ORG_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"];
const INDUSTRIES = [
  "Technology", "Finance", "Consulting", "Healthcare", "Education", "Media", "Retail",
  "Manufacturing", "Real Estate", "Government", "Non-profit", "Hospitality", "Legal", "Other",
];

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white ${className}`}
      {...props}
    />
  );
}

function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white resize-none ${className}`}
      {...props}
    />
  );
}

function Select({ children, className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      className={`w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

export default function OrganisationProfilePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // profiles table
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");

  // organisation_profiles table
  const [headline, setHeadline] = useState("");
  const [orgType, setOrgType] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [orgSize, setOrgSize] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [location, setLocation] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const [profileRes, orgRes] = await Promise.all([
        supabase.from("profiles").select("full_name, email, bio, phone").eq("id", user.id).single(),
        supabase.from("organisation_profiles").select("*").eq("profile_id", user.id).single(),
      ]);

      if (profileRes.data) {
        setFullName(profileRes.data.full_name || "");
        setEmail(profileRes.data.email || "");
        setBio(profileRes.data.bio || "");
        setPhone(profileRes.data.phone || "");
      }
      if (orgRes.data) {
        setHeadline(orgRes.data.headline || "");
        setOrgType(orgRes.data.org_type || "");
        setDescription(orgRes.data.description || "");
        setWebsite(orgRes.data.website || "");
        setIndustry(orgRes.data.industry || "");
        setOrgSize(orgRes.data.org_size || "");
        setFoundedYear(orgRes.data.founded_year ? String(orgRes.data.founded_year) : "");
        setLocation(orgRes.data.location || "");
        setLogoUrl(orgRes.data.logo_url || "");
        setLinkedinUrl(orgRes.data.linkedin_url || "");
        setTwitterUrl(orgRes.data.twitter_url || "");
        setInstagramUrl(orgRes.data.instagram_url || "");
        setVerified(orgRes.data.verified || false);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function save() {
    if (!userId) return;
    setSaving(true);
    try {
      const [profileRes, orgRes] = await Promise.all([
        supabase.from("profiles").update({ full_name: fullName, bio, phone }).eq("id", userId),
        supabase.from("organisation_profiles").upsert({
          profile_id: userId,
          headline,
          org_type: orgType || null,
          description,
          website,
          industry,
          org_size: orgSize || null,
          founded_year: foundedYear ? parseInt(foundedYear) : null,
          location,
          logo_url: logoUrl,
          linkedin_url: linkedinUrl,
          twitter_url: twitterUrl,
          instagram_url: instagramUrl,
          updated_at: new Date().toISOString(),
        }),
      ]);

      if (profileRes.error || orgRes.error) throw new Error(profileRes.error?.message || orgRes.error?.message);
      showToast("success", "Profile saved successfully!");
    } catch (e: any) {
      showToast("error", e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  const completionFields = [fullName, headline, description, orgType, industry, location, website];
  const completion = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-12">
        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
      </div>
    );
  }

  const initials = fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "ORG";

  return (
    <>
      <Topbar title="Organisation Profile" subtitle="Manage your organisation's presence on the platform" />
      <main className="flex-1 p-6 space-y-6">
        {/* Toast */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
            toast.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
          }`}>
            {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </div>
        )}

        {/* Header */}
        <div className="relative bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
              {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-cover rounded-2xl" /> : initials}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-white truncate">{fullName || "Organisation Name"}</h1>
              <p className="text-white/80 text-sm mt-1">{headline || "Add a tagline for your organisation"}</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 bg-white/20 rounded-full h-1.5">
                  <div className="bg-white rounded-full h-1.5 transition-all" style={{ width: `${completion}%` }} />
                </div>
                <span className="text-white/80 text-xs font-medium">{completion}% complete</span>
              </div>
              {verified && (
                <span className="mt-2 inline-block text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">Verified Organisation</span>
              )}
            </div>
            <Button onClick={save} disabled={saving} className="bg-white text-teal-700 hover:bg-teal-50 font-semibold px-6 flex-shrink-0">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Profile"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left col */}
          <div className="col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader><CardTitle className="text-base">Organisation Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label required>Organisation Name</Label>
                    <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Acme Inc." />
                  </div>
                  <div>
                    <Label>Tagline / Headline</Label>
                    <Input value={headline} onChange={e => setHeadline(e.target.value)} placeholder="Empowering the next generation" />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Tell students about your organisation, mission, and values..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Organisation Type</Label>
                    <Select value={orgType} onChange={e => setOrgType(e.target.value)}>
                      <option value="">Select type…</option>
                      {ORG_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </Select>
                  </div>
                  <div>
                    <Label>Industry</Label>
                    <Select value={industry} onChange={e => setIndustry(e.target.value)}>
                      <option value="">Select industry…</option>
                      {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Organisation Size</Label>
                    <Select value={orgSize} onChange={e => setOrgSize(e.target.value)}>
                      <option value="">Select size…</option>
                      {ORG_SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
                    </Select>
                  </div>
                  <div>
                    <Label>Founded Year</Label>
                    <Input type="number" min="1900" max={new Date().getFullYear()} value={foundedYear} onChange={e => setFoundedYear(e.target.value)} placeholder="2010" />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Sydney, Australia" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader><CardTitle className="text-base">Contact & Bio</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Contact Email</Label>
                    <Input value={email} disabled className="opacity-60" />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+61 2 1234 5678" />
                  </div>
                </div>
                <div>
                  <Label>About (for profile listing)</Label>
                  <Textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Short bio shown in search results..." />
                </div>
              </CardContent>
            </Card>

            {/* Logo */}
            <Card>
              <CardHeader><CardTitle className="text-base">Logo URL</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Logo Image URL</Label>
                  <Input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://your-logo.png" />
                </div>
                {logoUrl && (
                  <img src={logoUrl} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-slate-200" onError={e => (e.currentTarget.style.display = "none")} />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right col */}
          <div className="space-y-6">
            {/* Website & Socials */}
            <Card>
              <CardHeader><CardTitle className="text-base">Website & Social Links</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://your-org.com" className="pl-9" />
                  </div>
                  {website && (
                    <a href={website} target="_blank" rel="noreferrer" className="mt-1 text-xs text-teal-600 hover:underline flex items-center gap-1">
                      Visit <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <div>
                  <Label>LinkedIn</Label>
                  <Input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/company/..." />
                </div>
                <div>
                  <Label>Twitter / X</Label>
                  <Input value={twitterUrl} onChange={e => setTwitterUrl(e.target.value)} placeholder="https://twitter.com/yourorg" />
                </div>
                <div>
                  <Label>Instagram</Label>
                  <Input value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)} placeholder="https://instagram.com/yourorg" />
                </div>
              </CardContent>
            </Card>

            {/* Quick stats */}
            <Card className="bg-teal-50 border-teal-100">
              <CardContent className="p-4 space-y-3">
                <p className="text-sm font-semibold text-teal-800">Profile Tips</p>
                <ul className="text-xs text-teal-700 space-y-1.5">
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> Add a logo URL to stand out</li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> Write a compelling description</li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> Link your social profiles</li>
                  <li className="flex items-start gap-1.5"><CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> Post events and opportunities regularly</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
