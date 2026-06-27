"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Target, Loader2, X, Handshake } from "lucide-react";

interface Startup {
  id: string;
  founder_id: string;
  name: string;
  tagline: string;
  sector: string;
  stage: string;
  raising: boolean;
  hiring: boolean;
  founder_name: string;
  matchScore: number;
}

export default function DealFlowPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [passed, setPassed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [interested, setInterested] = useState<Set<string>>(new Set());
  const [investorSectors, setInvestorSectors] = useState<string[]>([]);
  const [investorStages, setInvestorStages] = useState<string[]>([]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const matchScore = useCallback((startup: { sector: string; stage: string }) => {
    const sectorMatch = investorSectors.includes(startup.sector) ? 50 : 0;
    const stageMatch = investorStages.includes(startup.stage) ? 50 : 0;
    return sectorMatch + stageMatch;
  }, [investorSectors, investorStages]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data: ip } = await supabase
      .from("investor_profiles")
      .select("sectors, stage_focus")
      .eq("id", user.id)
      .single();

    const sectors: string[] = ip?.sectors ?? [];
    const stages: string[] = ip?.stage_focus ?? [];
    setInvestorSectors(sectors);
    setInvestorStages(stages);

    const { data: startupsData } = await supabase
      .from("startups")
      .select("id, founder_id, name, tagline, sector, stage, raising, hiring, founder:founder_id(full_name)")
      .order("created_at", { ascending: false });

    const mapped: Startup[] = (startupsData || []).map((s: any) => {
      const sectorMatch = sectors.includes(s.sector) ? 50 : 0;
      const stageMatch = stages.includes(s.stage) ? 50 : 0;
      return {
        id: s.id,
        founder_id: s.founder_id,
        name: s.name,
        tagline: s.tagline ?? "",
        sector: s.sector ?? "",
        stage: s.stage ?? "",
        raising: s.raising ?? false,
        hiring: s.hiring ?? false,
        founder_name: s.founder?.full_name ?? "Unknown Founder",
        matchScore: sectorMatch + stageMatch,
      };
    });

    setStartups(mapped);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleInterested(startup: Startup) {
    setConnecting(startup.id);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("connections").insert({
        requester_id: user.id,
        recipient_id: startup.founder_id,
        status: "pending",
      });
      setInterested(prev => new Set([...prev, startup.id]));
    }
    setConnecting(null);
  }

  const visible = startups.filter(s => !passed.has(s.id));
  const highMatch = startups.filter(s => s.matchScore > 50);
  const inPipeline = interested.size;
  const passedCount = passed.size;

  return (
    <>
      <Topbar title="Deal Flow" subtitle="MBA-founded startups matched to your investment thesis" />
      <main className="flex-1 p-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Startups Reviewed", value: startups.length, color: "text-slate-700" },
            { label: "High Match (>50%)", value: highMatch.length, color: "text-green-600" },
            { label: "In Pipeline", value: inPipeline, color: "text-indigo-600" },
            { label: "Passed", value: passedCount, color: "text-slate-400" },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-4 text-center">
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : visible.length === 0 ? (
          <Card>
            <CardContent className="p-16 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-amber-400" />
              </div>
              <p className="font-semibold text-slate-800 text-lg">
                {startups.length === 0 ? "No startups in deal flow yet" : "You've reviewed all startups"}
              </p>
              <p className="text-sm text-slate-500 mt-2 max-w-sm">
                {startups.length === 0
                  ? "MBA-founded startups that match your investment thesis will appear here as founders join the platform."
                  : "Check back soon as new founders join the platform."}
              </p>
              {startups.length === 0 && (
                <div className="mt-4 flex items-center gap-1 text-xs text-amber-600">
                  <TrendingUp className="w-3.5 h-3.5" /> Update your thesis to improve match accuracy
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map(startup => {
              const isHighMatch = startup.matchScore > 50;
              return (
                <Card key={startup.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-slate-900">{startup.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">by {startup.founder_name}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                        isHighMatch
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}>
                        {isHighMatch ? "High Match" : "Low Match"}
                      </span>
                    </div>

                    {startup.tagline && (
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{startup.tagline}</p>
                    )}

                    <div className="flex gap-2 mb-4">
                      {startup.sector && (
                        <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">{startup.sector}</span>
                      )}
                      {startup.stage && (
                        <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{startup.stage}</span>
                      )}
                      {startup.raising && (
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">Raising</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        variant={interested.has(startup.id) ? "outline" : "default"}
                        disabled={interested.has(startup.id) || connecting === startup.id}
                        onClick={() => handleInterested(startup)}>
                        {connecting === startup.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : interested.has(startup.id) ? (
                          <><Handshake className="w-4 h-4 mr-1" />Interested</>
                        ) : (
                          <><Handshake className="w-4 h-4 mr-1" />Interested</>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-slate-500"
                        onClick={() => setPassed(prev => new Set([...prev, startup.id]))}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
