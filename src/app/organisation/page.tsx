import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Briefcase, Users, ArrowRight, Building2, PlusCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function OrganisationDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  const { data: orgProfile } = await supabase
    .from("organisation_profiles")
    .select("headline, org_type, verified")
    .eq("profile_id", user!.id)
    .single();

  const [{ count: eventsCount }, { count: oppsCount }, { count: appsCount }] = await Promise.all([
    supabase.from("events").select("*", { count: "exact", head: true }).eq("organiser_id", user!.id),
    supabase.from("opportunities").select("*", { count: "exact", head: true }).eq("posted_by", user!.id),
    supabase.from("opportunity_applications").select("*", { count: "exact", head: true }).eq("organisation_id", user!.id),
  ]);

  const orgName = profile?.full_name || user?.email?.split("@")[0] || "Organisation";

  const upcoming = await supabase
    .from("events")
    .select("id, title, date, event_type, registration_deadline")
    .eq("organiser_id", user!.id)
    .gte("date", new Date().toISOString())
    .order("date", { ascending: true })
    .limit(5);

  const recentApps = await supabase
    .from("opportunity_applications")
    .select("id, created_at, opportunities(title), profiles(full_name)")
    .eq("organisation_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <>
      <Topbar
        title="Organisation Dashboard"
        subtitle={`${orgName} — post events, jobs, and opportunities`}
      />
      <main className="flex-1 p-6 space-y-6">
        {/* Hero */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-3">
            <Building2 className="w-6 h-6 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-lg">{orgName}</p>
                {orgProfile?.verified && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Verified</span>
                )}
              </div>
              <p className="text-white/80 text-sm mt-1">
                {orgProfile?.headline || "Complete your profile to start posting events and opportunities for students."}
              </p>
              <div className="mt-4 flex gap-3 flex-wrap">
                <Link href="/organisation/post" className="text-sm bg-white/20 hover:bg-white/30 transition px-4 py-2 rounded-lg font-medium flex items-center gap-1">
                  <PlusCircle className="w-4 h-4" /> Post Opportunity
                </Link>
                <Link href="/organisation/events" className="text-sm bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-lg">
                  Manage Events
                </Link>
                <Link href="/organisation/profile" className="text-sm bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-lg">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Events Posted", value: String(eventsCount ?? 0), icon: Calendar, color: "text-teal-600" },
            { label: "Opportunities", value: String(oppsCount ?? 0), icon: Briefcase, color: "text-emerald-600" },
            { label: "Applications", value: String(appsCount ?? 0), icon: Users, color: "text-blue-600" },
            { label: "Profile Views", value: "—", icon: Building2, color: "text-purple-600" },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
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

        <div className="grid grid-cols-2 gap-6">
          {/* Upcoming Events */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-500" /> Upcoming Events
                </h3>
                <Link href="/organisation/events" className="text-xs text-teal-600 hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              {upcoming.data && upcoming.data.length > 0 ? (
                <div className="space-y-3">
                  {upcoming.data.map(ev => (
                    <div key={ev.id} className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
                      <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{ev.title}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(ev.date).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                          {ev.event_type && ` · ${ev.event_type}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No upcoming events. <Link href="/organisation/events" className="text-teal-600 hover:underline">Create one</Link>.</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" /> Recent Applications
                </h3>
                <Link href="/organisation/applications" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              {recentApps.data && recentApps.data.length > 0 ? (
                <div className="space-y-3">
                  {recentApps.data.map((app: any) => (
                    <div key={app.id} className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-semibold text-blue-600">
                        {(app.profiles?.full_name || "?")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{app.profiles?.full_name || "Student"}</p>
                        <p className="text-xs text-slate-400">{app.opportunities?.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No applications yet. Post an opportunity to start receiving them.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
