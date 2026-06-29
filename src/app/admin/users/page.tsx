import { createClient } from "@/lib/supabase/server";
import { Users, GraduationCap, Trophy, FlaskConical, TrendingUp, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const roleConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  student:      { label: "Student",      color: "text-indigo-700",  bg: "bg-indigo-50",  icon: GraduationCap },
  alumni:       { label: "Alumni",       color: "text-purple-700",  bg: "bg-purple-50",  icon: Trophy },
  faculty:      { label: "Faculty",      color: "text-green-700",   bg: "bg-green-50",   icon: FlaskConical },
  investor:     { label: "Investor",     color: "text-amber-700",   bg: "bg-amber-50",   icon: TrendingUp },
  organisation: { label: "Organisation", color: "text-teal-700",    bg: "bg-teal-50",    icon: Building2 },
  admin:        { label: "Admin",        color: "text-slate-700",   bg: "bg-slate-100",  icon: Users },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const all = users ?? [];
  const counts: Record<string, number> = {};
  for (const u of all) counts[u.role] = (counts[u.role] ?? 0) + 1;

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4">
        <h1 className="text-lg font-bold text-slate-900">Users</h1>
        <p className="text-xs text-slate-400">{all.length} members on the platform</p>
      </header>

      <main className="p-6 space-y-5 max-w-5xl">
        {/* Role chips */}
        <div className="flex flex-wrap gap-3">
          {Object.entries(roleConfig).map(([role, cfg]) => {
            const Icon = cfg.icon;
            return (
              <div key={role} className={`${cfg.bg} px-3 py-1.5 rounded-full flex items-center gap-1.5`}>
                <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}s</span>
                <span className={`text-xs ${cfg.color} opacity-70`}>· {counts[role] ?? 0}</span>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Member</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {all.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-12 text-slate-400 text-sm">No users yet</td></tr>
              ) : (
                all.map((u: { id: string; full_name: string; email: string; role: string; created_at: string }) => {
                  const cfg = roleConfig[u.role] ?? roleConfig.admin;
                  const Icon = cfg.icon;
                  const initials = (u.full_name ?? "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                            <span className={`text-xs font-bold ${cfg.color}`}>{initials}</span>
                          </div>
                          <span className="font-medium text-slate-900">{u.full_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500">{u.email}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                          <Icon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 text-xs">{timeAgo(u.created_at)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
