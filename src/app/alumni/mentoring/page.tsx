"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, CheckCircle, X, Clock, Loader2 } from "lucide-react";

interface MentorSession {
  id: string;
  mentor_id: string;
  mentee_id: string;
  status: "requested" | "accepted" | "completed" | "declined";
  topic: string;
  scheduled_at: string | null;
  created_at: string;
  mentee_name: string;
  mentee_program: string;
  mentee_career_goal: string;
}

export default function MentoringPage() {
  const [tab, setTab] = useState<"requests" | "active">("requests");
  const [sessions, setSessions] = useState<MentorSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from("mentor_sessions")
      .select(`
        id, mentor_id, mentee_id, status, topic, scheduled_at, created_at,
        mentee:mentee_id(full_name, student_profiles(program, career_goal))
      `)
      .eq("mentor_id", user.id)
      .order("created_at", { ascending: false });

    const mapped: MentorSession[] = (data || []).map((s: any) => ({
      id: s.id,
      mentor_id: s.mentor_id,
      mentee_id: s.mentee_id,
      status: s.status,
      topic: s.topic,
      scheduled_at: s.scheduled_at,
      created_at: s.created_at,
      mentee_name: s.mentee?.full_name ?? "Unknown",
      mentee_program: s.mentee?.student_profiles?.[0]?.program ?? "",
      mentee_career_goal: s.mentee?.student_profiles?.[0]?.career_goal ?? "",
    }));

    setSessions(mapped);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  async function updateStatus(sessionId: string, status: "accepted" | "declined" | "completed") {
    setActionLoading(sessionId);
    await supabase.from("mentor_sessions").update({ status }).eq("id", sessionId);
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status } : s));
    setActionLoading(null);
  }

  const pending = sessions.filter(s => s.status === "requested");
  const active = sessions.filter(s => s.status === "accepted");
  const completed = sessions.filter(s => s.status === "completed");
  const displayed = tab === "requests" ? pending : active;

  return (
    <>
      <Topbar title="Mentoring" subtitle="Guide the next generation of MBA students" />
      <main className="flex-1 p-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Pending Requests", value: pending.length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Active Mentees", value: active.length, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Completed Sessions", value: completed.length, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
          {(["requests", "active"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              {t === "requests" ? `Pending Requests${pending.length > 0 ? ` (${pending.length})` : ""}` : "Active Mentees"}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : displayed.length === 0 ? (
          <Card>
            <CardContent className="p-16 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-purple-400" />
              </div>
              <p className="font-semibold text-slate-800 text-lg">
                {tab === "requests" ? "No pending requests" : "No active mentees"}
              </p>
              <p className="text-sm text-slate-500 mt-2 max-w-sm">
                {tab === "requests"
                  ? "Students AI-matched to your expertise will send mentoring requests here. Make sure your profile highlights your areas of expertise."
                  : "Accepted mentees will appear here. Review your pending requests to start mentoring."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {displayed.map(session => (
              <Card key={session.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm flex-shrink-0">
                        {session.mentee_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{session.mentee_name}</p>
                        {session.mentee_program && (
                          <p className="text-sm text-slate-500">{session.mentee_program}</p>
                        )}
                        {session.mentee_career_goal && (
                          <p className="text-xs text-slate-400 mt-0.5">Goal: {session.mentee_career_goal}</p>
                        )}
                        {session.topic && (
                          <div className="mt-2 inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-md">
                            Topic: {session.topic}
                          </div>
                        )}
                        <p className="text-xs text-slate-400 mt-2">
                          Requested {new Date(session.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {tab === "requests" ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateStatus(session.id, "accepted")}
                            disabled={actionLoading === session.id}
                            className="bg-green-600 hover:bg-green-700 text-white">
                            {actionLoading === session.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-1" />Accept</>}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(session.id, "declined")}
                            disabled={actionLoading === session.id}
                            className="text-red-600 border-red-200 hover:bg-red-50">
                            <X className="w-4 h-4 mr-1" />Decline
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(session.id, "completed")}
                          disabled={actionLoading === session.id}>
                          {actionLoading === session.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-1" />Mark Complete</>}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
