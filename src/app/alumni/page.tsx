import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Briefcase, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AlumniDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user!.id).single();
  const firstName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";
  return (
    <>
      <Topbar title="Alumni Dashboard" subtitle={`Welcome back, ${firstName} — give back to your network`} />
      <main className="flex-1 p-6 space-y-6">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-lg">Your alumni network is live</p>
              <p className="text-white/80 text-sm mt-1">
                Start mentoring students, post job openings, and connect with fellow alumni and faculty through AI-powered matching.
              </p>
              <div className="mt-4 flex gap-3">
                <Link href="/alumni/mentoring" className="text-sm bg-white/20 hover:bg-white/30 transition px-4 py-2 rounded-lg font-medium">Start Mentoring</Link>
                <Link href="/alumni/hiring" className="text-sm bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-lg">Post a Job</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Students Mentored", value: "0", icon: Users, color: "text-indigo-600" },
            { label: "Jobs Posted", value: "0", icon: Briefcase, color: "text-green-600" },
            { label: "Connections", value: "0", icon: Users, color: "text-purple-600" },
            { label: "AI Matches", value: "0", icon: Sparkles, color: "text-amber-600" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center"><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div><p className="text-2xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {[
            { title: "Mentoring Requests", href: "/alumni/mentoring", icon: BookOpen, desc: "No mentoring requests yet. Students will reach out once you mark yourself as available." },
            { title: "Hiring Activity", href: "/alumni/hiring", icon: Briefcase, desc: "No jobs posted yet. Share opportunities from your company with MBA students." },
          ].map(item => (
            <Card key={item.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-indigo-500" />{item.title}
                  </h3>
                  <Link href={item.href} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">View <ArrowRight className="w-3 h-3" /></Link>
                </div>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
