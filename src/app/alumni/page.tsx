import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { MetricCard } from "@/components/analytics/metric-card";
import { Progress } from "@/components/ui/progress";
import { mockStudents } from "@/lib/mock-data";
import { Sparkles, Users, Briefcase, TrendingUp, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

const hiringMatches = [
  {
    name: "Priya Sharma",
    role: "MBA Candidate '26",
    matchedFor: "Product Manager",
    score: 94,
    skills: ["Product Strategy", "Fintech", "Go-to-Market"],
    reason: "Priya's fintech background and product strategy skills align with your open PM role at PayBridge.",
  },
  {
    name: "Carlos Mendez",
    role: "MBA Candidate '26",
    matchedFor: "Growth Lead",
    score: 87,
    skills: ["Growth Hacking", "B2C", "Analytics"],
    reason: "Strong growth experience with consumer apps, and interested in fintech. High culture fit.",
  },
];

const mentorSuggestions = [
  { name: "Priya Sharma", goal: "Fintech founder", matchScore: 96, reason: "Her goal mirrors your path at PayBridge. High impact mentoring opportunity." },
  { name: "Lena Park", goal: "Payments product manager", matchScore: 88, reason: "Wants to break into payments PM — your expertise is directly relevant." },
];

export default function AlumniDashboard() {
  return (
    <>
      <Topbar title="Alumni Dashboard" subtitle="Hello Sarah — here's your personalized network intelligence" />
      <main className="flex-1 p-6 space-y-6">
        {/* AI Summary */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">AI Network Intelligence</p>
              <p className="text-sm opacity-90 leading-relaxed">
                You are a VP at a fintech company and frequently hire product managers. Here are <strong>5 MBA students</strong> who match your hiring profile — and <strong>2 founders</strong> in the ecosystem who could benefit from your mentorship.
              </p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <MetricCard label="Students Mentored" value={12} change={20} changeType="increase" icon={Users} />
          <MetricCard label="Hires Made" value={4} description="Via university network" icon={Briefcase} iconColor="text-green-600" />
          <MetricCard label="Network Reach" value="1,204" description="Students you can impact" icon={TrendingUp} iconColor="text-purple-600" />
          <MetricCard label="Engagement Score" value="94/100" icon={Star} iconColor="text-amber-500" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Hiring Matches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-500" />
                AI Hiring Matches
              </h2>
              <span className="text-xs text-slate-400">For open roles at PayBridge</span>
            </div>
            {hiringMatches.map((match) => (
              <Card key={match.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Avatar name={match.name} size="md" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{match.name}</p>
                          <p className="text-xs text-slate-500">{match.role}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-indigo-600">{match.score}%</span>
                          <p className="text-xs text-slate-400">match</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Progress value={match.score} />
                      </div>
                      <Badge className="mt-2 bg-green-100 text-green-700">→ {match.matchedFor}</Badge>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {match.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
                      </div>
                      <p className="text-xs text-slate-500 mt-2 flex items-start gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-400 flex-shrink-0 mt-0.5" />
                        {match.reason}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700">Request Interview</button>
                        <button className="text-xs border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-50">View Profile</button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mentoring + Activity */}
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-indigo-500" />
              Students to Mentor
            </h2>
            {mentorSuggestions.map((s) => (
              <Card key={s.name}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Avatar name={s.name} size="md" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium text-slate-900">{s.name}</p>
                        <span className="text-xs font-bold text-indigo-600">{s.matchScore}% fit</span>
                      </div>
                      <p className="text-xs text-slate-500">Goal: {s.goal}</p>
                      <p className="text-xs text-slate-500 mt-2 bg-indigo-50 rounded-lg p-2">{s.reason}</p>
                      <button className="mt-3 text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700">
                        Offer to Mentor
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your Impact This Semester</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Mentor sessions held", value: "8 sessions" },
                  { label: "Students referred to jobs", value: "3 students" },
                  { label: "Startup advice given", value: "2 companies" },
                  { label: "Network introductions", value: "11 intros" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-slate-500">{item.label}</span>
                    <span className="font-medium text-slate-900">{item.value}</span>
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
