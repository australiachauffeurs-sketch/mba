import { createClient } from "@/lib/supabase/server";
import {
  Users, Network, Briefcase, Calendar, MessageSquare,
  GraduationCap, Trophy, FlaskConical, TrendingUp, Building2,
  ArrowUpRight, Clock, CheckCircle, XCircle, AlertCircle,
  Sparkles, Activity, RefreshCw, BarChart2,
} from "lucide-react";
import Link from "next/link";

async function getAdminStats() {
  const supabase = await createClient();

  const now = new Date();
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - 7);
  const monthStart = new Date(now); monthStart.setDate(now.getDate() - 30);

  const [
    { count: totalUsers },
    { count: todayUsers },
    { count: weekUsers },
    { count: monthUsers },
    { data: roleBreakdown },
    { count: totalConnections },
    { count: pendingConnections },
    { count: weekConnections },
    { count: totalOpportunities },
    { count: openOpportunities },
    { count: totalApplications },
    { count: pendingApplications },
    { count: totalEvents },
    { count: upcomingEvents },
    { count: totalMessages },
    { count: weekMessages },
    { count: totalMentorSessions },
    { count: totalStartups },
    { count: totalCareerUpdates },
    { data: recentUsers },
    { data: recentApplications },
    { data: recentConnections },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", todayStart.toISOString()),
    supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", weekStart.toISOString()),
    supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", monthStart.toISOString()),
    supabase.from("profiles").select("role").then(r => ({ data: r.data, error: r.error })),
    supabase.from("connections").select("*", { count: "exact", head: true }),
    supabase.from("connections").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("connections").select("*", { count: "exact", head: true }).gte("created_at", weekStart.toISOString()),
    supabase.from("opportunities").select("*", { count: "exact", head: true }),
    supabase.from("opportunities").select("*", { count: "exact", head: true }).eq("open", true),
    supabase.from("opportunity_applications").select("*", { count: "exact", head: true }),
    supabase.from("opportunity_applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }).gte("event_date", now.toISOString()),
    supabase.from("messages").select("*", { count: "exact", head: true }),
    supabase.from("messages").select("*", { count: "exact", head: true }).gte("created_at", weekStart.toISOString()),
    supabase.from("mentor_sessions").select("*", { count: "exact", head: true }),
    supabase.from("startups").select("*", { count: "exact", head: true }),
    supabase.from("career_gps_updates").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("id, full_name, role, email, created_at").order("created_at", { ascending: false }).limit(8),
    supabase.from("opportunity_applications")
      .select("id, status, created_at, applicant:applicant_id(full_name), opportunity:opportunity_id(title)")
      .order("created_at", { ascending: false }).limit(6),
    supabase.from("connections")
      .select("id, status, created_at, requester:requester_id(full_name), recipient:recipient_id(full_name)")
      .order("created_at", { ascending: false }).limit(6),
  ]);

  // Role breakdown counts
  const roleCounts: Record<string, number> = {};
  for (const p of (roleBreakdown ?? [])) {
    roleCounts[p.role] = (roleCounts[p.role] ?? 0) + 1;
  }

  return {
    totalUsers: totalUsers ?? 0,
    todayUsers: todayUsers ?? 0,
    weekUsers: weekUsers ?? 0,
    monthUsers: monthUsers ?? 0,
    roleCounts,
    totalConnections: totalConnections ?? 0,
    pendingConnections: pendingConnections ?? 0,
    weekConnections: weekConnections ?? 0,
    totalOpportunities: totalOpportunities ?? 0,
    openOpportunities: openOpportunities ?? 0,
    totalApplications: totalApplications ?? 0,
    pendingApplications: pendingApplications ?? 0,
    totalEvents: totalEvents ?? 0,
    upcomingEvents: upcomingEvents ?? 0,
    totalMessages: totalMessages ?? 0,
    weekMessages: weekMessages ?? 0,
    totalMentorSessions: totalMentorSessions ?? 0,
    totalStartups: totalStartups ?? 0,
    totalCareerUpdates: totalCareerUpdates ?? 0,
    recentUsers: recentUsers ?? [],
    recentApplications: recentApplications ?? [],
    recentConnections: recentConnections ?? [],
    generatedAt: now.toISOString(),
  };
}

const roleConfig: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  student:      { label: "Students",      icon: GraduationCap, color: "text-indigo-600",  bg: "bg-indigo-50" },
  alumni:       { label: "Alumni",        icon: Trophy,        color: "text-purple-600",  bg: "bg-purple-50" },
  faculty:      { label: "Faculty",       icon: FlaskConical,  color: "text-green-600",   bg: "bg-green-50" },
  investor:     { label: "Investors",     icon: TrendingUp,    color: "text-amber-600",   bg: "bg-amber-50" },
  organisation: { label: "Organisations", icon: Building2,     color: "text-teal-600",    bg: "bg-teal-50" },
  admin:        { label: "Admins",        icon: Users,         color: "text-slate-600",   bg: "bg-slate-100" },
};

const statusStyle: Record<string, string> = {
  pending:     "bg-amber-50 text-amber-700 border-amber-200",
  reviewing:   "bg-blue-50 text-blue-700 border-blue-200",
  shortlisted: "bg-indigo-50 text-indigo-700 border-indigo-200",
  accepted:    "bg-green-50 text-green-700 border-green-200",
  rejected:    "bg-red-50 text-red-700 border-red-200",
  connected:   "bg-green-50 text-green-700 border-green-200",
};

function getName(val: unknown): string {
  if (!val) return "—";
  if (Array.isArray(val)) return (val[0] as Record<string,string>)?.full_name ?? "—";
  return (val as Record<string,string>).full_name ?? "—";
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboard() {
  const s = await getAdminStats();

  const topStats = [
    { label: "Total Members",       value: s.totalUsers,       sub: `+${s.todayUsers} today`,   icon: Users,         color: "indigo" },
    { label: "Connections",         value: s.totalConnections, sub: `+${s.weekConnections} this week`, icon: Network,   color: "violet" },
    { label: "Open Opportunities",  value: s.openOpportunities, sub: `${s.totalOpportunities} total`, icon: Briefcase,  color: "green" },
    { label: "Applications",        value: s.totalApplications, sub: `${s.pendingApplications} pending`, icon: Activity, color: "amber" },
    { label: "Upcoming Events",     value: s.upcomingEvents,   sub: `${s.totalEvents} total`,   icon: Calendar,      color: "teal" },
    { label: "Messages Sent",       value: s.totalMessages,    sub: `+${s.weekMessages} this week`, icon: MessageSquare, color: "blue" },
    { label: "Mentor Sessions",     value: s.totalMentorSessions, sub: "total recorded",        icon: Sparkles,      color: "purple" },
    { label: "GPS AI Updates",      value: s.totalCareerUpdates, sub: "career enrichments",     icon: RefreshCw,     color: "rose" },
  ];

  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
    green:  "bg-green-50 text-green-600 border-green-100",
    amber:  "bg-amber-50 text-amber-600 border-amber-100",
    teal:   "bg-teal-50 text-teal-600 border-teal-100",
    blue:   "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    rose:   "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Platform Dashboard</h1>
          <p className="text-xs text-slate-400">
            Live data · Updated {new Date(s.generatedAt).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live
          </span>
          <Link href="/admin" className="text-xs text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-slate-50 transition">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Link>
        </div>
      </header>

      <main className="p-6 space-y-6 max-w-7xl">

        {/* Growth strip */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-5 text-white flex items-center justify-between gap-6">
          <div>
            <p className="text-white/70 text-xs font-medium uppercase tracking-wide mb-1">Platform Growth</p>
            <p className="text-2xl font-black">{s.totalUsers} Members</p>
            <p className="text-white/70 text-sm mt-0.5">
              +{s.weekUsers} this week · +{s.monthUsers} this month
            </p>
          </div>
          <div className="hidden sm:flex gap-6 text-center">
            {[
              { v: s.totalStartups, l: "Startups" },
              { v: s.totalMentorSessions, l: "Mentorships" },
              { v: s.openOpportunities, l: "Open Roles" },
            ].map(x => (
              <div key={x.l}>
                <p className="text-2xl font-black">{x.v}</p>
                <p className="text-white/60 text-xs">{x.l}</p>
              </div>
            ))}
          </div>
          <div className="flex-shrink-0 hidden md:block">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 8 stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {topStats.map(stat => {
            const Icon = stat.icon;
            const cls = colorMap[stat.color];
            return (
              <div key={stat.label} className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-shadow">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border mb-3 ${cls}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">{stat.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Role breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900">Members by Role</h2>
            <Link href="/admin/users" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {Object.entries(roleConfig).map(([role, cfg]) => {
              const count = s.roleCounts[role] ?? 0;
              const total = s.totalUsers || 1;
              const pct = Math.round((count / total) * 100);
              const Icon = cfg.icon;
              return (
                <div key={role} className={`${cfg.bg} rounded-xl p-3 text-center`}>
                  <Icon className={`w-5 h-5 ${cfg.color} mx-auto mb-2`} />
                  <p className="text-xl font-black text-slate-900">{count}</p>
                  <p className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{pct}%</p>
                </div>
              );
            })}
          </div>
          {/* Visual bar */}
          <div className="mt-4 h-2.5 rounded-full bg-slate-100 flex overflow-hidden">
            {(["student","alumni","faculty","investor","organisation","admin"] as const).map((role) => {
              const pct = ((s.roleCounts[role] ?? 0) / (s.totalUsers || 1)) * 100;
              const barColor: Record<string,string> = { student:"bg-indigo-500", alumni:"bg-purple-500", faculty:"bg-green-500", investor:"bg-amber-500", organisation:"bg-teal-500", admin:"bg-slate-400" };
              if (!pct) return null;
              return <div key={role} style={{ width: `${pct}%` }} className={`${barColor[role]} transition-all`} />;
            })}
          </div>
        </div>

        {/* Three column activity */}
        <div className="grid md:grid-cols-3 gap-5">

          {/* Recent signups */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Recent Signups</h3>
              <Link href="/admin/users" className="text-xs text-indigo-600 hover:underline">View all</Link>
            </div>
            {s.recentUsers.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No users yet</p>
            ) : (
              <div className="space-y-2.5">
                {(s.recentUsers as Array<{ id: string; full_name: string; role: string; email: string; created_at: string }>).map(u => {
                  const cfg = roleConfig[u.role];
                  const Icon = cfg?.icon ?? Users;
                  return (
                    <div key={u.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg?.bg ?? "bg-slate-100"}`}>
                        <Icon className={`w-3.5 h-3.5 ${cfg?.color ?? "text-slate-500"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{u.full_name}</p>
                        <p className="text-xs text-slate-400 truncate">{u.email}</p>
                      </div>
                      <span className="text-xs text-slate-400 flex-shrink-0">{timeAgo(u.created_at)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent applications */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Recent Applications</h3>
              <Link href="/admin/opportunities" className="text-xs text-indigo-600 hover:underline">View all</Link>
            </div>
            {s.recentApplications.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No applications yet</p>
            ) : (
              <div className="space-y-2.5">
                {(s.recentApplications as Array<{
                  id: string; status: string; created_at: string;
                  applicant: unknown; opportunity: unknown;
                }>).map(a => (
                  <div key={a.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{getName(a.applicant)}</p>
                      <p className="text-xs text-slate-400 truncate">{getName(a.opportunity)}</p>
                    </div>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full border capitalize flex-shrink-0 ${statusStyle[a.status] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent connections */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Recent Connections</h3>
              <Link href="/admin/connections" className="text-xs text-indigo-600 hover:underline">View all</Link>
            </div>
            {s.recentConnections.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No connections yet</p>
            ) : (
              <div className="space-y-2.5">
                {(s.recentConnections as Array<{
                  id: string; status: string; created_at: string;
                  requester: unknown; recipient: unknown;
                }>).map(c => (
                  <div key={c.id} className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-900 font-medium truncate">
                        {getName(c.requester)} → {getName(c.recipient)}
                      </p>
                      <p className="text-xs text-slate-400">{timeAgo(c.created_at)}</p>
                    </div>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full border capitalize flex-shrink-0 ${
                      c.status === "accepted" ? "bg-green-50 text-green-700 border-green-200" :
                      c.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-red-50 text-red-700 border-red-200"
                    }`}>
                      {c.status === "accepted" ? <CheckCircle className="inline w-3 h-3 mr-0.5" /> : c.status === "pending" ? <Clock className="inline w-3 h-3 mr-0.5" /> : <XCircle className="inline w-3 h-3 mr-0.5" />}
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Manage Users",        href: "/admin/users",        icon: Users,        color: "indigo", sub: `${s.totalUsers} total` },
            { label: "Review Applications", href: "/admin/opportunities", icon: Briefcase,    color: "amber",  sub: `${s.pendingApplications} pending` },
            { label: "View Connections",    href: "/admin/connections",   icon: Network,      color: "green",  sub: `${s.pendingConnections} pending` },
            { label: "Platform Analytics",  href: "/admin/analytics",    icon: BarChart2,    color: "violet", sub: "Engagement data" },
          ].map(q => {
            const Icon = q.icon;
            const cls = colorMap[q.color];
            return (
              <Link key={q.href} href={q.href} className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${cls}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{q.label}</p>
                  <p className="text-xs text-slate-400">{q.sub}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="flex items-center gap-2 text-xs text-slate-400 pb-4">
          <AlertCircle className="w-3.5 h-3.5" />
          All data is live from Supabase. Click Refresh or reload the page to get the latest counts.
        </div>

      </main>
    </div>
  );
}
