import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Target, Users, BookOpen, ArrowRight, UserPlus, Briefcase } from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
  return (
    <>
      <Topbar title="Student Dashboard" subtitle="Welcome to UniConnect AI — let's get you started" />
      <main className="flex-1 p-6 space-y-6">

        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-lg">Your AI network is ready to activate</p>
              <p className="text-white/80 text-sm mt-1">
                Complete your profile so our AI can start matching you with mentors, alumni, investors, and opportunities across the network.
              </p>
              <div className="mt-4 flex gap-3">
                <Link href="/student/mentors" className="text-sm bg-white/20 hover:bg-white/30 transition px-4 py-2 rounded-lg font-medium">
                  Browse Mentors
                </Link>
                <Link href="/student/network" className="text-sm bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-lg">
                  Explore Network
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats — all zero until real data */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Network Connections", value: "0", icon: Users, color: "text-indigo-600" },
            { label: "AI Match Score", value: "—", icon: Sparkles, color: "text-purple-600" },
            { label: "Mentor Sessions", value: "0", icon: BookOpen, color: "text-green-600" },
            { label: "Career Readiness", value: "—", icon: Target, color: "text-amber-600" },
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

        <div className="grid grid-cols-3 gap-6">
          {/* Empty recommendations */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                AI-Recommended Connections
              </h2>
              <Link href="/student/mentors" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <Card>
              <CardContent className="p-12 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                  <UserPlus className="w-7 h-7 text-indigo-400" />
                </div>
                <p className="font-medium text-slate-800">No recommendations yet</p>
                <p className="text-sm text-slate-500 mt-1 max-w-xs">
                  Complete your profile with your interests and goals so AI can find the right people for you.
                </p>
                <Link href="/student/network" className="mt-4 text-sm text-indigo-600 hover:underline flex items-center gap-1">
                  Explore the network <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-500" />
                  Getting Started
                </CardTitle>
                <CardDescription>Steps to unlock the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Create your account", done: true },
                  { label: "Connect with a mentor", done: false },
                  { label: "Explore opportunities", done: false },
                  { label: "Join a conversation", done: false },
                  { label: "Get investor intro", done: false },
                ].map((m) => (
                  <div key={m.label} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${m.done ? "bg-green-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                      {m.done ? "✓" : ""}
                    </div>
                    <span className={`text-sm ${m.done ? "text-slate-400 line-through" : "text-slate-600"}`}>{m.label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-500" />
                  Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-sm text-slate-500">No opportunities yet</p>
                  <Link href="/student/opportunities" className="text-xs text-indigo-600 hover:underline mt-1 block">
                    Browse all →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
