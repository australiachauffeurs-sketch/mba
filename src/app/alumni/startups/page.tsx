import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, DollarSign, Users, Rocket, ExternalLink } from "lucide-react";

const startups = [
  { id: "s1", name: "PayFlow Africa", founder: "Priya Sharma", program: "MBA '26", stage: "Pre-seed", industry: "Fintech", description: "Cross-border payment infrastructure for Africa and Southeast Asia.", traction: "200 beta users, $15K MRR", ask: "$500K", relevance: "Your PayBridge experience is directly applicable. She needs a fintech advisor.", tags: ["Payments", "Africa", "B2C"], aiScore: 94 },
  { id: "s2", name: "HealthLoop AI", founder: "Marcus Johnson", program: "MBA '26", stage: "Pre-seed", industry: "HealthTech", description: "AI-powered diagnostic support tool for rural healthcare providers.", traction: "3 hospital LOIs signed", ask: "$750K", relevance: "Strong traction. MD-MBA founder. Could use your go-to-market expertise.", tags: ["Digital Health", "AI", "B2B"], aiScore: 78 },
  { id: "s3", name: "EduLaunch", founder: "Ana Souza", program: "MBA '25", stage: "Seed", industry: "EdTech", description: "AI career coaching platform for first-generation college students.", traction: "1,200 users, 4.8★ rating", ask: "$2M", relevance: "Social impact angle aligns with your mentoring values. Network intro opportunity.", tags: ["EdTech", "AI", "Social Impact"], aiScore: 71 },
];

export default function StartupsPage() {
  return (
    <>
      <Topbar title="University Startups" subtitle="Student and alumni ventures in the ecosystem" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Active Startups", value: 14, icon: Rocket, color: "text-indigo-600" },
            { label: "Total Funding Raised", value: "$28.5M", icon: DollarSign, color: "text-green-600" },
            { label: "Founders in Network", value: 31, icon: Users, color: "text-purple-600" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center"><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div><p className="text-2xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        <h2 className="font-semibold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" /> Startups Relevant to Your Expertise
        </h2>

        <div className="space-y-4">
          {startups.map(s => (
            <Card key={s.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                        <Rocket className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{s.name}</h3>
                        <p className="text-sm text-slate-500">by {s.founder} · {s.program}</p>
                      </div>
                      <Badge className="bg-indigo-100 text-indigo-700">{s.stage}</Badge>
                      <Badge variant="secondary">{s.industry}</Badge>
                    </div>
                    <p className="text-slate-600 text-sm">{s.description}</p>
                    <div className="flex items-center gap-6 mt-3 text-sm">
                      <span className="text-slate-500"><span className="font-medium text-slate-800">Traction:</span> {s.traction}</span>
                      <span className="text-slate-500"><span className="font-medium text-slate-800">Raising:</span> {s.ask}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {s.tags.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                    </div>
                    <div className="mt-3 bg-purple-50 rounded-lg px-4 py-2.5 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-purple-800">{s.relevance}</p>
                    </div>
                  </div>
                  <div className="text-center flex-shrink-0">
                    <p className="text-3xl font-bold text-indigo-600">{s.aiScore}%</p>
                    <p className="text-xs text-slate-400">relevance</p>
                    <div className="flex flex-col gap-2 mt-4">
                      <Button size="sm" className="text-xs">Advise / Invest</Button>
                      <Button size="sm" variant="outline" className="text-xs"><ExternalLink className="w-3.5 h-3.5" /> View Pitch</Button>
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
