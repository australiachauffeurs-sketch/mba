"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Search, Loader2, Handshake, FlaskConical } from "lucide-react";

interface FacultyMember {
  id: string;
  full_name: string;
  department: string;
  designation: string;
  research_areas: string[];
  collaboration: boolean;
}

export default function CollaborationsPage() {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchFaculty = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id ?? null);

    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, faculty_profiles(department, designation, research_areas, collaboration)")
      .eq("role", "faculty");

    const mapped: FacultyMember[] = (data || [])
      .map((p: any) => {
        const fp = Array.isArray(p.faculty_profiles) ? p.faculty_profiles[0] : p.faculty_profiles;
        return {
          id: p.id,
          full_name: p.full_name ?? "Unknown",
          department: fp?.department ?? "",
          designation: fp?.designation ?? "",
          research_areas: fp?.research_areas ?? [],
          collaboration: fp?.collaboration ?? false,
        };
      })
      .filter(f => f.collaboration && f.id !== user?.id);

    setFaculty(mapped);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchFaculty(); }, [fetchFaculty]);

  async function handleConnect(facultyId: string) {
    setConnecting(facultyId);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("connections").insert({
        requester_id: user.id,
        recipient_id: facultyId,
        status: "pending",
      });
      setConnected(prev => new Set([...prev, facultyId]));
    }
    setConnecting(null);
  }

  const filtered = faculty.filter(f =>
    f.full_name.toLowerCase().includes(search.toLowerCase()) ||
    f.department.toLowerCase().includes(search.toLowerCase()) ||
    f.research_areas.some(a => a.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Topbar title="Collaborations" subtitle="Connect with faculty open to research partnerships" />
      <main className="flex-1 p-6 space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Open to Collaborate", value: faculty.length, color: "text-teal-600", bg: "bg-teal-50" },
            { label: "Showing", value: filtered.length, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Requests Sent", value: connected.size, color: "text-purple-600", bg: "bg-purple-50" },
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
            placeholder="Search by name, department, or research area..."
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
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-4">
                <FlaskConical className="w-8 h-8 text-teal-400" />
              </div>
              <p className="font-semibold text-slate-800 text-lg">
                {search ? "No faculty match your search" : "No collaborators available yet"}
              </p>
              <p className="text-sm text-slate-500 mt-2 max-w-sm">
                {search
                  ? "Try a different name, department, or research area."
                  : "Faculty who mark themselves as open to collaboration will appear here. Update your own profile to show you're open to partnerships."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(member => (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold text-sm flex-shrink-0">
                      {member.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{member.full_name}</p>
                      {member.designation && <p className="text-xs text-slate-500">{member.designation}</p>}
                      {member.department && <p className="text-xs text-slate-400">{member.department}</p>}
                    </div>
                  </div>

                  {member.research_areas.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {member.research_areas.slice(0, 4).map(area => (
                        <span key={area} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">
                          {area}
                        </span>
                      ))}
                      {member.research_areas.length > 4 && (
                        <span className="text-xs text-slate-400">+{member.research_areas.length - 4} more</span>
                      )}
                    </div>
                  )}

                  <Button
                    size="sm"
                    variant={connected.has(member.id) ? "outline" : "default"}
                    className="w-full"
                    disabled={connected.has(member.id) || connecting === member.id}
                    onClick={() => handleConnect(member.id)}>
                    {connecting === member.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : connected.has(member.id) ? (
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
