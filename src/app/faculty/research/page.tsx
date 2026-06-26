"use client";
import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, FlaskConical, BookOpen, Users, Plus, CheckCircle } from "lucide-react";

const researchMatches = [
  { id: "r1", name: "Priya Sharma", type: "student", program: "MBA '26", interest: "Digital payments in emerging markets", matchScore: 95, skills: ["Financial Modeling", "Market Research", "Python"], reason: "Priya's startup focus on African payments directly overlaps with your CBDC research in Southeast Asia. High co-authorship potential.", contribution: "Market research, user interviews" },
  { id: "r2", name: "Alex Thompson", type: "student", program: "MBA '26", interest: "Cryptocurrency regulation and policy", matchScore: 88, skills: ["Policy Analysis", "Data Science", "Econometrics"], reason: "Strong academic background in economics with crypto policy focus. Could contribute to your regulation paper.", contribution: "Data analysis, policy review" },
  { id: "r3", name: "Sarah Chen", type: "alumni", program: "MBA '18 · CEO PayBridge", interest: "Practical payment infrastructure challenges", matchScore: 82, skills: ["Fintech Operations", "Regulatory Navigation", "Scale"], reason: "Sarah's real-world experience at PayBridge provides primary data for your research. Industry co-authorship opportunity.", contribution: "Industry data, practitioner perspective" },
  { id: "r4", name: "Dr. Lisa Pham", type: "faculty", program: "Economics Dept.", interest: "Monetary policy and digital currencies", matchScore: 79, skills: ["Macroeconomics", "Central Banking", "Econometrics"], reason: "Complementary CBDC expertise from macroeconomic angle. Cross-department collaboration opportunity.", contribution: "Macroeconomic modeling" },
];

const activeProjects = [
  { title: "CBDC Adoption in Emerging Markets", collaborators: 2, status: "Active", deadline: "Dec 2026", funding: "$85K NSF Grant", progress: 45 },
  { title: "Blockchain for Cross-Border Payments", collaborators: 1, status: "Seeking collaborators", deadline: "Jun 2027", funding: "Seeking $50K", progress: 10 },
];

export default function ResearchPage() {
  const [invited, setInvited] = useState<Record<string, boolean>>({});
  const [tab, setTab] = useState<"matches" | "projects">("matches");

  return (
    <>
      <Topbar title="Research Matches" subtitle="AI-matched collaborators for your research projects" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Active Projects", value: 2, icon: FlaskConical, color: "text-green-600" },
            { label: "Collaborators", value: 8, icon: Users, color: "text-indigo-600" },
            { label: "Publications This Year", value: 4, icon: BookOpen, color: "text-teal-600" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center"><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div><p className="text-2xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
          {(["matches", "projects"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              {t === "matches" ? "AI Matches" : "My Projects"}
            </button>
          ))}
        </div>

        {tab === "matches" ? (
          <div className="grid grid-cols-2 gap-5">
            {researchMatches.map(m => (
              <Card key={m.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Avatar name={m.name} size="lg" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{m.name}</p>
                          <p className="text-sm text-slate-500">{m.program}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">{m.matchScore}%</p>
                          <Badge variant="secondary" className="capitalize">{m.type}</Badge>
                        </div>
                      </div>
                      <Progress value={m.matchScore} className="mt-2" barClassName="bg-green-500" />
                      <p className="text-sm text-slate-600 mt-2 italic">"{m.interest}"</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {m.skills.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                      </div>
                      <p className="text-xs text-green-800 bg-green-50 rounded-lg p-2 mt-3 flex items-start gap-1">
                        <Sparkles className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />{m.reason}
                      </p>
                      <p className="text-xs text-slate-500 mt-2"><span className="font-medium">Can contribute:</span> {m.contribution}</p>
                      <div className="flex gap-2 mt-3">
                        {invited[m.id] ? (
                          <Button size="sm" variant="secondary" className="text-xs" disabled><CheckCircle className="w-3.5 h-3.5" /> Invited</Button>
                        ) : (
                          <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700" onClick={() => setInvited(p => ({ ...p, [m.id]: true }))}>
                            Invite to Collaborate
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="text-xs">View Profile</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end"><Button size="sm"><Plus className="w-4 h-4" /> New Project</Button></div>
            {activeProjects.map(p => (
              <Card key={p.title}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{p.title}</h3>
                        <Badge className={p.status === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}>{p.status}</Badge>
                      </div>
                      <div className="flex gap-6 text-sm text-slate-500 mb-3">
                        <span><span className="font-medium text-slate-700">{p.collaborators}</span> collaborators</span>
                        <span>Deadline: <span className="font-medium text-slate-700">{p.deadline}</span></span>
                        <span className="text-green-600 font-medium">{p.funding}</span>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Progress</span><span>{p.progress}%</span>
                        </div>
                        <Progress value={p.progress} barClassName="bg-green-500" />
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Manage</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
