import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/analytics/metric-card";
import { RecommendationCard } from "@/components/profiles/recommendation-card";
import { mockRecommendationsForPriya } from "@/lib/mock-data";
import { Sparkles, Target, Users, BookOpen, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

const careerMilestones = [
  { label: "Profile Complete", done: true },
  { label: "First mentor connected", done: true },
  { label: "Internship application", done: false },
  { label: "Startup pitch ready", done: false },
  { label: "Funding introduction", done: false },
];

const upcomingEvents = [
  { title: "Fintech Innovation Panel", date: "Jul 3", type: "event" },
  { title: "Mentor call with Sarah Chen", date: "Jul 5", type: "meeting" },
  { title: "VC Networking Night", date: "Jul 9", type: "event" },
];

export default function StudentDashboard() {
  return (
    <>
      <Topbar title="Student Dashboard" subtitle="Welcome back, Priya — here's what AI found for you today" />
      <main className="flex-1 p-6 space-y-6">
        {/* AI Career Summary */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium opacity-80">AI Career Intelligence — Today</span>
              </div>
              <p className="text-lg font-medium leading-relaxed">
                Your fintech founder profile matched <strong>6 people</strong> in the network this week. Sarah Chen (PayBridge CEO), Robert Tanaka (Horizon Ventures), and Prof. Kumar are your highest-value connections right now.
              </p>
              <div className="flex gap-2 mt-4">
                <Badge className="bg-white/20 text-white border-0">3 new mentor matches</Badge>
                <Badge className="bg-white/20 text-white border-0">2 investor introductions pending</Badge>
                <Badge className="bg-white/20 text-white border-0">1 research opportunity</Badge>
              </div>
            </div>
            <Link href="/student/career-gps" className="ml-6 flex items-center gap-1 text-sm text-white/80 hover:text-white whitespace-nowrap">
              Full GPS <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-4 gap-4">
          <MetricCard label="Network Connections" value={24} change={12} changeType="increase" icon={Users} />
          <MetricCard label="AI Match Score" value="91%" description="Top 8% of your cohort" icon={Sparkles} iconColor="text-purple-600" />
          <MetricCard label="Mentor Sessions" value={3} change={50} changeType="increase" icon={BookOpen} />
          <MetricCard label="Career Readiness" value="78%" change={8} changeType="increase" icon={Target} />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Top Recommendations */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                AI-Recommended Connections
              </h2>
              <Link href="/student/mentors" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {mockRecommendationsForPriya.slice(0, 2).map((rec, i) => (
              <RecommendationCard key={i} recommendation={rec} />
            ))}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Career milestones */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-500" />
                  Career Milestones
                </CardTitle>
                <CardDescription>Your founder journey progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {careerMilestones.map((m) => (
                  <div key={m.label} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${m.done ? "bg-green-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                      {m.done ? "✓" : ""}
                    </div>
                    <span className={`text-sm ${m.done ? "text-slate-700 line-through" : "text-slate-600"}`}>{m.label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.map((e) => (
                  <div key={e.title} className="flex items-start gap-3">
                    <div className="text-center min-w-10">
                      <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg px-2 py-1">{e.date}</div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{e.title}</p>
                      <p className="text-xs text-slate-400 capitalize">{e.type}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
