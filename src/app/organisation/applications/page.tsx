"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Users, CheckCircle, XCircle, Clock, Briefcase } from "lucide-react";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Application {
  id: string;
  status: string;
  created_at: string;
  cover_letter: string;
  opportunities: { id: string; title: string; type: string } | null;
  profiles: { full_name: string; email: string } | null;
  student_profiles: { headline: string; program: string } | null;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  reviewing: "bg-blue-100 text-blue-700",
  shortlisted: "bg-purple-100 text-purple-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function OrganisationApplicationsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [oppFilter, setOppFilter] = useState<string>("all");
  const [opportunities, setOpportunities] = useState<{ id: string; title: string }[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async (uid: string) => {
    const [appsRes, oppsRes] = await Promise.all([
      supabase
        .from("opportunity_applications")
        .select("id, status, created_at, cover_letter, opportunities(id, title, type), profiles(full_name, email), student_profiles(headline, program)")
        .eq("organisation_id", uid)
        .order("created_at", { ascending: false }),
      supabase.from("opportunities").select("id, title").eq("posted_by", uid).eq("open", true),
    ]);
    setApps((appsRes.data as any) || []);
    setOpportunities(oppsRes.data || []);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      load(user.id).finally(() => setLoading(false));
    });
  }, [load]);

  async function updateStatus(appId: string, status: string) {
    setUpdatingId(appId);
    await supabase.from("opportunity_applications").update({ status }).eq("id", appId);
    setApps(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    setUpdatingId(null);
  }

  const filtered = apps.filter(a => {
    const statusMatch = filter === "all" || a.status === filter;
    const oppMatch = oppFilter === "all" || (a.opportunities as any)?.id === oppFilter;
    return statusMatch && oppMatch;
  });

  const counts = {
    all: apps.length,
    pending: apps.filter(a => a.status === "pending").length,
    reviewing: apps.filter(a => a.status === "reviewing").length,
    shortlisted: apps.filter(a => a.status === "shortlisted").length,
    accepted: apps.filter(a => a.status === "accepted").length,
    rejected: apps.filter(a => a.status === "rejected").length,
  };

  if (loading) return <div className="flex items-center justify-center h-full p-12"><Loader2 className="w-6 h-6 animate-spin text-teal-600" /></div>;

  return (
    <>
      <Topbar title="Applications" subtitle="Review and manage student applications" />
      <main className="flex-1 p-6 space-y-6">
        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          {(["all", "pending", "reviewing", "shortlisted", "accepted", "rejected"] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${filter === s ? "bg-teal-600 text-white border-teal-600" : "bg-white text-slate-600 border-slate-200 hover:border-teal-400"}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              <span className="ml-1.5 text-xs opacity-70">({counts[s]})</span>
            </button>
          ))}
          {opportunities.length > 0 && (
            <select
              value={oppFilter}
              onChange={e => setOppFilter(e.target.value)}
              className="ml-auto px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="all">All Opportunities</option>
              {opportunities.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
            </select>
          )}
        </div>

        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-medium text-slate-600">No applications {filter !== "all" ? `with status "${filter}"` : "yet"}</p>
              <p className="text-sm text-slate-400 mt-1">Applications will appear here when students apply to your opportunities</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map(app => {
              const opp = app.opportunities as any;
              const profile = app.profiles as any;
              const studentP = app.student_profiles as any;
              const initials = (profile?.full_name || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

              return (
                <Card key={app.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-700 flex-shrink-0">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-slate-900">{profile?.full_name || "Unknown"}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[app.status] || "bg-slate-100 text-slate-600"}`}>
                            {app.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{profile?.email}</p>
                        {studentP?.program && <p className="text-xs text-slate-500 mt-0.5">{studentP.program}{studentP.headline ? ` · ${studentP.headline}` : ""}</p>}
                        <div className="flex items-center gap-2 mt-2">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <p className="text-xs text-slate-500">{opp?.title || "Unknown opportunity"}{opp?.type ? ` (${opp.type})` : ""}</p>
                        </div>
                        {app.cover_letter && (
                          <p className="text-xs text-slate-500 mt-2 line-clamp-2 italic">"{app.cover_letter}"</p>
                        )}
                        <p className="text-xs text-slate-300 mt-1">Applied {new Date(app.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <select
                          value={app.status}
                          onChange={e => updateStatus(app.id, e.target.value)}
                          disabled={updatingId === app.id}
                          className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        {updatingId === app.id && <Loader2 className="w-4 h-4 animate-spin text-teal-600 mx-auto" />}
                      </div>
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
