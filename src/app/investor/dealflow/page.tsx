"use client";
import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, DollarSign, TrendingUp, CheckCircle, X, Eye, Filter } from "lucide-react";

const pipeline = [
  { id: "d1", name: "PayFlow Africa", founder: "Priya Sharma", stage: "Pre-seed", ask: "$500K", industry: "Fintech", traction: "$15K MRR · 200 users", thesisMatch: 94, status: "new", tags: ["Payments", "Africa", "B2C"], reason: "Direct thesis match — emerging market payments infrastructure. Faculty-backed by Prof. Kumar." },
  { id: "d2", name: "LoanWise", founder: "Chen Wei", stage: "Seed", ask: "$1.2M", industry: "Fintech", traction: "$80K MRR · 1,400 SMBs", thesisMatch: 89, status: "reviewing", tags: ["Lending", "SMB", "AI"], reason: "AI underwriting for SMB lending in Southeast Asia. Strong revenue growth (3x YoY)." },
  { id: "d3", name: "RemitFast", founder: "Abiodun Adeyemi", stage: "Pre-seed", ask: "$350K", industry: "Fintech", traction: "Beta · 500 test users", thesisMatch: 81, status: "new", tags: ["Remittances", "Africa", "Mobile"], reason: "Mobile-first remittance for Nigerian diaspora. Founder has 8 years in telco payments." },
  { id: "d4", name: "ComplianceAI", founder: "Mei Lin", stage: "Seed", ask: "$2M", industry: "RegTech", traction: "12 enterprise clients", thesisMatch: 74, status: "passed", tags: ["RegTech", "B2B", "SaaS"], reason: "Adjacent to fintech thesis — compliance automation. Enterprise traction is strong." },
];

const statusMap: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-700" },
  reviewing: { label: "In Review", color: "bg-amber-100 text-amber-700" },
  pitched: { label: "Pitched", color: "bg-purple-100 text-purple-700" },
  passed: { label: "Passed", color: "bg-slate-100 text-slate-500" },
};

export default function DealFlowPage() {
  const [statuses, setStatuses] = useState<Record<string, string>>(Object.fromEntries(pipeline.map(d => [d.id, d.status])));
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? pipeline : pipeline.filter(d => statuses[d.id] === filter.toLowerCase());

  return (
    <>
      <Topbar title="Deal Flow" subtitle="AI-ranked startup opportunities matched to your thesis" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "New Deals", value: pipeline.filter(d => d.status === "new").length, color: "text-blue-600" },
            { label: "In Review", value: pipeline.filter(d => d.status === "reviewing").length, color: "text-amber-600" },
            { label: "Total Pipeline", value: pipeline.length, color: "text-indigo-600" },
            { label: "Avg Match Score", value: `${Math.round(pipeline.reduce((a, d) => a + d.thesisMatch, 0) / pipeline.length)}%`, color: "text-green-600" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-5 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </CardContent></Card>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            {["All", "New", "Reviewing", "Passed"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>{f}</button>
            ))}
          </div>
          <Button variant="outline" size="sm"><Filter className="w-4 h-4" /> Filter by Stage</Button>
        </div>

        <div className="space-y-4">
          {filtered.map(deal => (
            <Card key={deal.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900">{deal.name}</h3>
                          <Badge variant="secondary">{deal.stage}</Badge>
                          <Badge className={statusMap[statuses[deal.id]]?.color}>{statusMap[statuses[deal.id]]?.label}</Badge>
                        </div>
                        <p className="text-sm text-slate-500">by {deal.founder} · {deal.industry} · Raising {deal.ask}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-amber-600">{deal.thesisMatch}%</p>
                        <p className="text-xs text-slate-400">thesis match</p>
                      </div>
                    </div>
                    <Progress value={deal.thesisMatch} className="mt-2" barClassName="bg-amber-500" />
                    <p className="text-sm text-slate-600 mt-2"><span className="font-medium">Traction:</span> {deal.traction}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {deal.tags.map(t => <Badge key={t}>{t}</Badge>)}
                    </div>
                    <p className="text-xs text-amber-900 bg-amber-50 rounded-lg px-3 py-2 mt-3 flex items-start gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-600 flex-shrink-0 mt-0.5" />{deal.reason}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="text-xs bg-amber-500 hover:bg-amber-600" onClick={() => setStatuses(p => ({ ...p, [deal.id]: "reviewing" }))}>
                        <Eye className="w-3.5 h-3.5" /> Request Pitch
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">View Details</Button>
                      <button onClick={() => setStatuses(p => ({ ...p, [deal.id]: "passed" }))}
                        className="ml-auto text-xs text-slate-400 hover:text-red-500 flex items-center gap-1">
                        <X className="w-3.5 h-3.5" /> Pass
                      </button>
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
