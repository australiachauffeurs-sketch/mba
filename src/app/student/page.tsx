import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Target, Users, BookOpen, ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AIRecommendationsPreview } from "@/components/student/ai-recommendations-preview";

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: profile }, { data: sp }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user!.id).single(),
    supabase.from("student_profiles").select("career_goal").eq("id", user!.id).single(),
  ]);
  const firstName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";
  const hasGoal = !!sp?.career_goal;

  return (
    <>
      <Topbar title="Student Dashboard" subtitle={`Welcome back, ${firstName} — let's get you connected`} />
      <main className="flex-1 p-6 space-y-6">

        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-lg">
                {hasGoal ? "Your AI network is active" : "Your AI network is ready to activate"}
              </p>
              <p className="text-white/80 text-sm mt-1">
                {hasGoal
                  ? "AI is matching you with alumni, mentors, and opportunities based on your career goal."
                  : "Complete your profile and set a career goal so AI can start matching you with the right people."}
              </p>
              <div className="mt-4 flex gap-3">
                {hasGoal ? (
                  <>
                    <Link href="/student/ai-recommendations" className="text-sm bg-white text-indigo-600 hover:bg-white/90 transition px-4 py-2 rounded-lg font-semibold">
                      View AI Recommendations
                    </Link>
                    <Link href="/student/career-gps" className="text-sm bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-lg">
                      View Roadmap
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/student/career-gps" className="text-sm bg-white text-indigo-600 hover:bg-white/90 transition px-4 py-2 rounded-lg font-semibold">
                      Set Career Goal
                    </Link>
                    <Link href="/student/profile" className="text-sm bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-lg">
                      Complete Profile
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Network Connections", value: "0", icon: Users, color: "text-indigo-600" },
            { label: "AI Match Score", value: hasGoal ? "Active" : "—", icon: Sparkles, color: "text-purple-600" },
            { label: "Mentor Sessions", value: "0", icon: BookOpen, color: "text-green-600" },
            { label: "Career Readiness", value: hasGoal ? "In progress" : "—", icon: Target, color: "text-amber-600" },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* AI Recommendations preview — client component that fetches live */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                AI-Recommended Connections
              </h2>
              {hasGoal && (
                <Link href="/student/ai-recommendations" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  See all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
            <AIRecommendationsPreview hasGoal={hasGoal} />
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
                  { label: "Set your career goal", done: hasGoal },
                  { label: "Connect with a mentor", done: false },
                  { label: "Explore opportunities", done: false },
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
