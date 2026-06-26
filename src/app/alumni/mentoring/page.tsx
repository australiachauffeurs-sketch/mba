"use client";
import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Calendar, Star, Users, TrendingUp, MessageSquare } from "lucide-react";

const studentMatches = [
  { id: "s1", name: "Priya Sharma", program: "MBA '26", goal: "Fintech Founder", matchScore: 96, skills: ["Product Strategy", "Fintech", "Go-to-Market"], reason: "Her goal mirrors your PayBridge journey exactly. Highest-impact mentoring opportunity.", status: "new" },
  { id: "s2", name: "Lena Park", program: "MBA '26", goal: "Payments Product Manager", matchScore: 88, skills: ["Product Management", "UX Research", "Agile"], reason: "Wants to break into payments PM — your expertise is directly applicable.", status: "new" },
  { id: "s3", name: "Ahmed Hassan", program: "MBA '26", goal: "Fintech Startup (B2B)", matchScore: 81, skills: ["Sales", "Business Development", "Fintech"], reason: "B2B fintech angle complements your B2C expertise — diverse mentoring impact.", status: "pending" },
  { id: "s4", name: "Sophia Williams", program: "MBA '25", goal: "VC / Investment", matchScore: 74, skills: ["Financial Modeling", "Due Diligence", "Strategy"], reason: "Interested in the VC angle of fintech — your investor relationships add value.", status: "active" },
];

const activeMentees = studentMatches.filter(s => s.status === "active");

export default function MentoringPage() {
  const [tab, setTab] = useState<"matches" | "active">("matches");
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});

  return (
    <>
      <Topbar title="Students to Mentor" subtitle="AI-matched students who would benefit most from your expertise" />
      <main className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Active Mentees", value: 1, icon: Users, color: "text-purple-600" },
            { label: "Sessions This Month", value: 4, icon: Calendar, color: "text-indigo-600" },
            { label: "Avg. Mentee Rating", value: "4.9★", icon: Star, color: "text-amber-500" },
            { label: "Career Outcomes", value: "3 hires", icon: TrendingUp, color: "text-green-600" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center"><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
          {(["matches", "active"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              {t === "matches" ? `AI Matches (${studentMatches.length})` : `Active Mentees (${activeMentees.length})`}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-5">
          {(tab === "matches" ? studentMatches : activeMentees).map(student => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar name={student.name} size="lg" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{student.name}</p>
                        <p className="text-sm text-slate-500">{student.program}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-600">{student.matchScore}%</p>
                        <Badge className={student.status === "active" ? "bg-green-100 text-green-700 mt-1" : student.status === "pending" ? "bg-amber-100 text-amber-700 mt-1" : "bg-slate-100 text-slate-600 mt-1"}>{student.status}</Badge>
                      </div>
                    </div>

                    <div className="mt-2">
                      <Progress value={student.matchScore} barClassName="bg-purple-500" />
                    </div>

                    <p className="text-sm font-medium text-slate-700 mt-2">Goal: {student.goal}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {student.skills.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                    </div>
                    <p className="text-xs text-purple-800 bg-purple-50 rounded-lg p-2 mt-3 flex items-start gap-1">
                      <Sparkles className="w-3 h-3 flex-shrink-0 mt-0.5 text-purple-500" />{student.reason}
                    </p>
                    <div className="flex gap-2 mt-4">
                      {accepted[student.id] || student.status === "active" ? (
                        <Button size="sm" variant="secondary" className="text-xs">
                          <Calendar className="w-3.5 h-3.5" /> Schedule Session
                        </Button>
                      ) : (
                        <Button size="sm" className="text-xs bg-purple-600 hover:bg-purple-700" onClick={() => setAccepted(p => ({ ...p, [student.id]: true }))}>
                          Accept as Mentee
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="text-xs"><MessageSquare className="w-3.5 h-3.5" /> Message</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
