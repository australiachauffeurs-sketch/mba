import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Link2, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <>
      <Topbar title="Admin Dashboard" subtitle="Platform overview and management" />
      <main className="flex-1 p-6 space-y-6">
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-lg">Platform is live and ready</p>
              <p className="text-white/70 text-sm mt-1">
                UniConnect AI is deployed. Invite your first users — students, alumni, faculty, and investors — to start building the network.
              </p>
              <div className="mt-4 flex gap-3">
                <Link href="/admin/users" className="text-sm bg-white/20 hover:bg-white/30 transition px-4 py-2 rounded-lg font-medium">Manage Users</Link>
                <Link href="/admin/settings" className="text-sm bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-lg">Settings</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: "0", icon: Users, color: "text-indigo-600" },
            { label: "Connections Made", value: "0", icon: Link2, color: "text-green-600" },
            { label: "AI Matches", value: "0", icon: Sparkles, color: "text-purple-600" },
            { label: "Outcomes", value: "0", icon: TrendingUp, color: "text-amber-600" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center"><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div><p className="text-2xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {[
            { title: "Recent Users", href: "/admin/users", desc: "No users yet. Share the signup link to onboard your first members." },
            { title: "Recent Connections", href: "/admin/connections", desc: "No connections yet. As users join and connect, activity will appear here." },
          ].map(item => (
            <Card key={item.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <Link href={item.href} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
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
