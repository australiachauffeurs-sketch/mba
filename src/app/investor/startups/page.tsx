import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Globe, TrendingUp, Users } from "lucide-react";

const startups = [
  { id: "s1", name: "PayFlow Africa", logo: "PF", founders: ["Priya Sharma"], stage: "Pre-seed", ask: "$500K", raised: "$150K", mrr: "$15K", growth: "+28%/mo", hq: "Lagos, Nigeria", team: 6, industry: "Payments", thesisMatch: 94, description: "Mobile-first cross-border payment rails for Sub-Saharan Africa.", tags: ["Payments", "Mobile", "B2C"], backed: false },
  { id: "s2", name: "LoanWise", logo: "LW", founders: ["Chen Wei"], stage: "Seed", ask: "$1.2M", raised: "$600K", mrr: "$80K", growth: "+18%/mo", hq: "Singapore", team: 12, industry: "Lending", thesisMatch: 89, description: "AI-powered credit scoring for underbanked SMBs in Southeast Asia.", tags: ["SMB Lending", "AI", "Credit"], backed: false },
  { id: "s3", name: "RemitFast", logo: "RF", founders: ["Abiodun Adeyemi"], stage: "Pre-seed", ask: "$350K", raised: "$0", mrr: "Beta", growth: "N/A", hq: "London, UK", team: 3, industry: "Remittances", thesisMatch: 81, description: "Instant remittances for Nigerian diaspora in the UK using stablecoins.", tags: ["Remittances", "Stablecoin", "Diaspora"], backed: false },
  { id: "s4", name: "ClearKYC", logo: "CK", founders: ["Mei Lin"], stage: "Series A", ask: "$5M", raised: "$3.2M", mrr: "$220K", growth: "+12%/mo", hq: "Hong Kong", team: 28, industry: "RegTech", thesisMatch: 76, description: "Compliance automation and KYC orchestration for APAC digital banks.", tags: ["RegTech", "KYC", "APAC"], backed: true },
];

export default function InvestorStartupsPage() {
  return (
    <>
      <Topbar title="Startup Ecosystem" subtitle="Curated startups from the UniConnect network" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Startups", value: 47, color: "text-amber-600" },
            { label: "Avg Thesis Match", value: "84%", color: "text-indigo-600" },
            { label: "Network-Backed", value: 12, color: "text-green-600" },
            { label: "In Your Portfolio", value: 2, color: "text-purple-600" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-5 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </CardContent></Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-5">
          {startups.map(s => (
            <Card key={s.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 text-amber-700 font-bold text-sm">{s.logo}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900">{s.name}</h3>
                          {s.backed && <Badge className="bg-green-100 text-green-700">Portfolio</Badge>}
                        </div>
                        <p className="text-sm text-slate-500">{s.stage} · {s.industry} · {s.hq}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-amber-600">{s.thesisMatch}%</p>
                        <p className="text-xs text-slate-400">match</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">{s.description}</p>
                    <Progress value={s.thesisMatch} className="mt-2" barClassName="bg-amber-500" />
                    <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                      {[["MRR", s.mrr], ["Growth", s.growth], ["Team", `${s.team} people`]].map(([k, v]) => (
                        <div key={k as string} className="bg-slate-50 rounded-lg p-2">
                          <p className="text-xs text-slate-400">{k}</p>
                          <p className="text-sm font-semibold text-slate-800">{v}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {s.tags.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="text-xs bg-amber-500 hover:bg-amber-600">View Deck</Button>
                      <Button size="sm" variant="outline" className="text-xs">Meet Founder</Button>
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
