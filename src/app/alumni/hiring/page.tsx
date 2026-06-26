"use client";
import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Briefcase, Plus, CheckCircle, X, ExternalLink } from "lucide-react";

const openRoles = [
  { id: "r1", title: "Product Manager", level: "Mid-Level", location: "San Francisco, CA", type: "Full-time", applicants: 3 },
  { id: "r2", title: "Growth Lead", level: "Senior", location: "Remote", type: "Full-time", applicants: 2 },
];

const candidates = [
  { id: "c1", name: "Priya Sharma", program: "MBA '26", role: "Product Manager", matchScore: 94, skills: ["Product Strategy", "Fintech", "Go-to-Market", "Python"], reason: "Priya's fintech background and product strategy skills align directly with your open PM role at PayBridge.", status: "new" },
  { id: "c2", name: "Carlos Mendez", program: "MBA '26", role: "Growth Lead", matchScore: 87, skills: ["Growth Hacking", "B2C", "Analytics", "Paid Media"], reason: "Strong growth experience with consumer apps, fintech interest, and high culture fit score.", status: "new" },
  { id: "c3", name: "Jin Wu", program: "MBA '26", role: "Product Manager", matchScore: 79, skills: ["Product Management", "Engineering Background", "API Design"], reason: "Technical PM with strong engineering background — useful for PayBridge's infrastructure products.", status: "interviewed" },
  { id: "c4", name: "Maya Patel", program: "MBA '25", role: "Growth Lead", matchScore: 83, skills: ["SEO/SEM", "Content Strategy", "Growth Analytics", "CRO"], reason: "Led 3x growth at previous startup. MBA thesis on fintech user acquisition.", status: "new" },
];

const statusMap: Record<string, { label: string; color: string }> = {
  new: { label: "New Match", color: "bg-blue-100 text-blue-700" },
  interviewed: { label: "Interviewed", color: "bg-amber-100 text-amber-700" },
  offered: { label: "Offer Sent", color: "bg-green-100 text-green-700" },
  rejected: { label: "Passed", color: "bg-slate-100 text-slate-500" },
};

export default function HiringPage() {
  const [statuses, setStatuses] = useState<Record<string, string>>(Object.fromEntries(candidates.map(c => [c.id, c.status])));

  return (
    <>
      <Topbar title="Hiring Matches" subtitle="AI-matched MBA candidates for your open roles" />
      <main className="flex-1 p-6 space-y-6">
        {/* Open roles */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-green-600" /> Open Roles at PayBridge</CardTitle>
              <Button size="sm"><Plus className="w-4 h-4" /> Post New Role</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {openRoles.map(r => (
                <div key={r.id} className="border border-slate-200 rounded-xl p-4 flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{r.title}</p>
                    <p className="text-sm text-slate-500">{r.level} · {r.location} · {r.type}</p>
                    <p className="text-xs text-indigo-600 mt-2 font-medium">{r.applicants} AI-matched candidates</p>
                  </div>
                  <Button size="sm" variant="outline"><ExternalLink className="w-3.5 h-3.5" /> View</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI candidates */}
        <div>
          <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-indigo-500" /> AI-Matched Candidates
          </h2>
          <div className="space-y-4">
            {candidates.map(c => (
              <Card key={c.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <Avatar name={c.name} size="lg" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{c.name}</p>
                          <p className="text-sm text-slate-500">{c.program} · Applying for: <span className="font-medium text-slate-700">{c.role}</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusMap[statuses[c.id]]?.color}`}>{statusMap[statuses[c.id]]?.label}</span>
                          <span className="text-xl font-bold text-green-600">{c.matchScore}%</span>
                        </div>
                      </div>
                      <Progress value={c.matchScore} className="mt-2" barClassName="bg-green-500" />
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {c.skills.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                      </div>
                      <p className="text-xs text-indigo-800 bg-indigo-50 rounded-lg px-3 py-2 mt-3 flex items-start gap-1.5">
                        <Sparkles className="w-3 h-3 text-indigo-500 flex-shrink-0 mt-0.5" />{c.reason}
                      </p>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs" onClick={() => setStatuses(p => ({ ...p, [c.id]: "interviewed" }))}>
                          <CheckCircle className="w-3.5 h-3.5" /> Request Interview
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">View Full Profile</Button>
                        <button onClick={() => setStatuses(p => ({ ...p, [c.id]: "rejected" }))}
                          className="ml-auto text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                          <X className="w-3.5 h-3.5" /> Pass
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
