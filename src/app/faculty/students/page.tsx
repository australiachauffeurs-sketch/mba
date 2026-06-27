"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Search, Loader2, Handshake } from "lucide-react";

interface Student {
  id: string;
  full_name: string;
  program: string;
  specialization: string;
  career_goal: string;
  career_interests: string[];
  skills: string[];
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<Set<string>>(new Set());

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, student_profiles(program, specialization, career_goal, career_interests, skills)")
      .eq("role", "student");

    const mapped: Student[] = (data || []).map((p: any) => {
      const sp = Array.isArray(p.student_profiles) ? p.student_profiles[0] : p.student_profiles;
      return {
        id: p.id,
        full_name: p.full_name ?? "Unknown",
        program: sp?.program ?? "",
        specialization: sp?.specialization ?? "",
        career_goal: sp?.career_goal ?? "",
        career_interests: sp?.career_interests ?? [],
        skills: sp?.skills ?? [],
      };
    });

    setStudents(mapped);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  async function handleConnect(studentId: string) {
    setConnecting(studentId);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("connections").insert({
        requester_id: user.id,
        recipient_id: studentId,
        status: "pending",
      });
      setConnected(prev => new Set([...prev, studentId]));
    }
    setConnecting(null);
  }

  const filtered = students.filter(s =>
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    s.program.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Topbar title="Students" subtitle="MBA students matched to your research and expertise" />
      <main className="flex-1 p-6 space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Students", value: students.length, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Showing", value: filtered.length, color: "text-green-600", bg: "bg-green-50" },
            { label: "Connected", value: connected.size, color: "text-purple-600", bg: "bg-purple-50" },
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
            placeholder="Search by name or program..."
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
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <p className="font-semibold text-slate-800 text-lg">
                {search ? "No students match your search" : "No students yet"}
              </p>
              <p className="text-sm text-slate-500 mt-2 max-w-sm">
                {search
                  ? "Try a different name or program keyword."
                  : "Students will appear here once they join and complete their profiles."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(student => (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm flex-shrink-0">
                      {student.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{student.full_name}</p>
                      {student.program && <p className="text-xs text-slate-500">{student.program}</p>}
                      {student.specialization && <p className="text-xs text-slate-400">{student.specialization}</p>}
                    </div>
                  </div>

                  {student.career_goal && (
                    <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                      <span className="font-medium">Goal:</span> {student.career_goal}
                    </p>
                  )}

                  {student.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {student.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {skill}
                        </span>
                      ))}
                      {student.skills.length > 3 && (
                        <span className="text-xs text-slate-400">+{student.skills.length - 3} more</span>
                      )}
                    </div>
                  )}

                  <Button
                    size="sm"
                    variant={connected.has(student.id) ? "outline" : "default"}
                    className="w-full"
                    disabled={connected.has(student.id) || connecting === student.id}
                    onClick={() => handleConnect(student.id)}>
                    {connecting === student.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : connected.has(student.id) ? (
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
