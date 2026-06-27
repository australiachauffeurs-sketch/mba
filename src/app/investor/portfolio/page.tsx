"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Plus, Loader2, Building2, TrendingUp, X } from "lucide-react";

interface PortfolioCompany {
  id: string;
  name: string;
  sector: string;
  stage: string;
  tagline: string;
  founder_name: string;
  founder_id: string;
}

interface AddForm {
  name: string;
  tagline: string;
  sector: string;
  stage: string;
}

const STAGES = ["Pre-seed", "Seed", "Series A", "Series B", "Series C+", "Growth"];
const SECTORS = ["FinTech", "HealthTech", "EdTech", "SaaS", "E-commerce", "DeepTech", "CleanTech", "Other"];

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddForm>({ name: "", tagline: "", sector: "", stage: "" });
  const [submitting, setSubmitting] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchPortfolio = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    // Get accepted connections from this investor
    const { data: conns } = await supabase
      .from("connections")
      .select("recipient_id")
      .eq("requester_id", user.id)
      .eq("status", "accepted");

    const founderIds = (conns || []).map((c: any) => c.recipient_id);

    if (founderIds.length === 0) { setLoading(false); return; }

    // Find startups by those founders
    const { data: startups } = await supabase
      .from("startups")
      .select("id, name, tagline, sector, stage, founder_id, founder:founder_id(full_name)")
      .in("founder_id", founderIds);

    const mapped: PortfolioCompany[] = (startups || []).map((s: any) => ({
      id: s.id,
      name: s.name ?? "",
      sector: s.sector ?? "",
      stage: s.stage ?? "",
      tagline: s.tagline ?? "",
      founder_name: s.founder?.full_name ?? "Unknown",
      founder_id: s.founder_id,
    }));

    setPortfolio(mapped);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchPortfolio(); }, [fetchPortfolio]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Create startup with investor as founder (manual add)
      const { data: startup } = await supabase
        .from("startups")
        .insert({
          name: form.name,
          tagline: form.tagline,
          sector: form.sector,
          stage: form.stage,
          founder_id: user.id,
        })
        .select()
        .single();

      // Create accepted connection to self (marks as portfolio)
      if (startup) {
        await supabase.from("connections").insert({
          requester_id: user.id,
          recipient_id: user.id,
          status: "accepted",
        });

        setPortfolio(prev => [...prev, {
          id: startup.id,
          name: startup.name,
          sector: startup.sector ?? "",
          stage: startup.stage ?? "",
          tagline: startup.tagline ?? "",
          founder_name: "Manually Added",
          founder_id: user.id,
        }]);
      }
    }

    setForm({ name: "", tagline: "", sector: "", stage: "" });
    setShowForm(false);
    setSubmitting(false);
  }

  return (
    <>
      <Topbar title="Portfolio" subtitle="Track your investments in MBA-founded companies" />
      <main className="flex-1 p-6 space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Portfolio Companies", value: portfolio.length, color: "text-indigo-600" },
            { label: "Avg. MOIC", value: "—", color: "text-green-600" },
            { label: "Total Deployed", value: "—", color: "text-amber-600" },
            { label: "Active", value: portfolio.filter(p => p.stage !== "Exited").length, color: "text-purple-600" },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Button */}
        <div className="flex justify-end">
          <Button onClick={() => setShowForm(v => !v)}>
            {showForm ? <><X className="w-4 h-4 mr-1" />Cancel</> : <><Plus className="w-4 h-4 mr-1" />Add Portfolio Company</>}
          </Button>
        </div>

        {/* Add Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add Portfolio Company</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      placeholder="e.g. Acme Corp"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={form.tagline}
                      onChange={e => setForm(p => ({ ...p, tagline: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      placeholder="One-line description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Sector</label>
                    <select
                      value={form.sector}
                      onChange={e => setForm(p => ({ ...p, sector: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                      <option value="">Select sector</option>
                      {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Stage</label>
                    <select
                      value={form.stage}
                      onChange={e => setForm(p => ({ ...p, stage: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                      <option value="">Select stage</option>
                      {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <Button type="submit" disabled={submitting || !form.name.trim()}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                  Add Company
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Portfolio List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : portfolio.length === 0 ? (
          <Card>
            <CardContent className="p-16 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-indigo-400" />
              </div>
              <p className="font-semibold text-slate-800 text-lg">No portfolio companies yet</p>
              <p className="text-sm text-slate-500 mt-2 max-w-sm">
                Companies you've invested in will appear here when you have an accepted connection with the founder. Use "Add Portfolio Company" to manually add existing investments.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio.map(company => (
              <Card key={company.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{company.name}</p>
                      {company.tagline && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{company.tagline}</p>}
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3">
                    {company.sector && (
                      <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">{company.sector}</span>
                    )}
                    {company.stage && (
                      <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{company.stage}</span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400">Founder: {company.founder_name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
