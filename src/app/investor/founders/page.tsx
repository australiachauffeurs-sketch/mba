"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Search, Loader2, Handshake, Building2, Briefcase } from "lucide-react";

interface Founder {
  startupId: string;
  founderId: string;
  founderName: string;
  company: string;
  jobTitle: string;
  expertiseAreas: string[];
  startupName: string;
  sector: string;
  stage: string;
  tagline: string;
}

export default function FoundersPage() {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<Set<string>>(new Set());

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchFounders = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("startups")
      .select("id, name, tagline, sector, stage, founder_id, founder:founder_id(id, full_name, alumni_profiles(company, job_title, expertise_areas))")
      .order("created_at", { ascending: false });

    const mapped: Founder[] = (data || []).map((s: any) => {
      const ap = Array.isArray(s.founder?.alumni_profiles) ? s.founder?.alumni_profiles[0] : s.founder?.alumni_profiles;
      return {
        startupId: s.id,
        founderId: s.founder_id,
        founderName: s.founder?.full_name ?? "Unknown",
        company: ap?.company ?? "",
        jobTitle: ap?.job_title ?? "",
        expertiseAreas: ap?.expertise_areas ?? [],
        startupName: s.name ?? "",
        sector: s.sector ?? "",
        stage: s.stage ?? "",
        tagline: s.tagline ?? "",
      };
    });

    setFounders(mapped);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchFounders(); }, [fetchFounders]);

  async function handleConnect(founderId: string) {
    setConnecting(founderId);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("connections").insert({
        requester_id: user.id,
        recipient_id: founderId,
        status: "pending",
      });
      setConnected(prev => new Set([...prev, founderId]));
    }
    setConnecting(null);
  }

  const filtered = founders.filter(f =>
    f.founderName.toLowerCase().includes(search.toLowerCase()) ||
    f.startupName.toLowerCase().includes(search.toLowerCase()) ||
    f.sector.toLowerCase().includes(search.toLowerCase())
  );

  // Deduplicate by founderId for metrics
  const uniqueFounders = new Set(founders.map(f => f.founderId)).size;

  return (
    <>
      <Topbar title="MBA Founders" subtitle="Directory of founders who have submitted startups" />
      <main className="flex-1 p-6 space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Founders", value: uniqueFounders, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Startups Listed", value: founders.length, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Connected", value: connected.size, color: "text-green-600", bg: "bg-green-50" },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center`}>
                  <Users className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by founder name, startup, or sector..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="p-16 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-amber-400" />
              </div>
              <p className="font-semibold text-slate-800 text-lg">
                {search ? "No founders match your search" : "No founders yet"}
              </p>
              <p className="text-sm text-slate-500 mt-2 max-w-sm">
                {search
                  ? "Try a different name, startup, or sector."
                  : "MBA founders will appear here as they join the platform and submit their startups."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(founder => (
              <Card key={founder.startupId} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-sm flex-shrink-0">
                      {founder.founderName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{founder.founderName}</p>
                      {founder.company && (
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Building2 className="w-3 h-3" />{founder.company}
                        </p>
                      )}
                      {founder.jobTitle && (
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />{founder.jobTitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 mb-3">
                    <p className="font-medium text-slate-800 text-sm">{founder.startupName}</p>
                    {founder.tagline && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{founder.tagline}</p>}
                    <div className="flex gap-1.5 mt-2">
                      {founder.sector && (
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{founder.sector}</span>
                      )}
                      {founder.stage && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{founder.stage}</span>
                      )}
                    </div>
                  </div>

                  {founder.expertiseAreas.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {founder.expertiseAreas.slice(0, 3).map(area => (
                        <span key={area} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{area}</span>
                      ))}
                    </div>
                  )}

                  <Button
                    size="sm"
                    variant={connected.has(founder.founderId) ? "outline" : "default"}
                    className="w-full"
                    disabled={connected.has(founder.founderId) || connecting === founder.founderId}
                    onClick={() => handleConnect(founder.founderId)}>
                    {connecting === founder.founderId ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : connected.has(founder.founderId) ? (
                      <><Handshake className="w-4 h-4 mr-1" />Request Sent</>
                    ) : (
                      <><Handshake className="w-4 h-4 mr-1" />Connect</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
