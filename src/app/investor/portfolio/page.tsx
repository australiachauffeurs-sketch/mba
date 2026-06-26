import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, BarChart2 } from "lucide-react";

const portfolio = [
  { id: "p1", name: "ClearKYC", founder: "Mei Lin", invested: "$250K", currentVal: "$820K", stage: "Series A", mrr: "$220K", growth: "+12%/mo", health: "strong", moic: "3.3x", tags: ["RegTech", "APAC"], update: "Closed $5M Series A in May. Expanding to Malaysia." },
  { id: "p2", name: "NovaPay", founder: "James Osei", invested: "$100K", currentVal: "$95K", stage: "Seed", mrr: "$22K", growth: "+4%/mo", health: "watch", moic: "0.95x", tags: ["Payments", "West Africa"], update: "Growth slowing. Pivoting to B2B from B2C." },
];

const healthMap: Record<string, { color: string; label: string }> = {
  strong: { color: "bg-green-100 text-green-700", label: "Strong" },
  watch: { color: "bg-amber-100 text-amber-700", label: "Watch" },
  at_risk: { color: "bg-red-100 text-red-700", label: "At Risk" },
};

export default function PortfolioPage() {
  const totalInvested = portfolio.reduce((a, p) => a + parseInt(p.invested.replace(/[$K]/g, "")) * 1000, 0);
  const totalVal = portfolio.reduce((a, p) => a + parseInt(p.currentVal.replace(/[$K]/g, "")) * 1000, 0);

  return (
    <>
      <Topbar title="Portfolio" subtitle="Track performance and updates from your investments" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Companies", value: portfolio.length, color: "text-slate-900" },
            { label: "Total Invested", value: `$${(totalInvested / 1000).toFixed(0)}K`, color: "text-slate-900" },
            { label: "Portfolio Value", value: `$${(totalVal / 1000).toFixed(0)}K`, color: "text-green-600" },
            { label: "Avg MOIC", value: `${(portfolio.reduce((a, p) => a + parseFloat(p.moic), 0) / portfolio.length).toFixed(1)}x`, color: "text-amber-600" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-5 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </CardContent></Card>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-slate-900">Portfolio Companies</h2>
          {portfolio.map(p => {
            const isUp = parseFloat(p.moic) >= 1;
            return (
              <Card key={p.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-6 h-6 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900">{p.name}</h3>
                            <Badge variant="secondary">{p.stage}</Badge>
                            <Badge className={healthMap[p.health]?.color}>{healthMap[p.health]?.label}</Badge>
                          </div>
                          <p className="text-sm text-slate-500">Founded by {p.founder}</p>
                        </div>
                        <div className="text-right">
                          <div className={`flex items-center gap-1 ${isUp ? "text-green-600" : "text-red-500"}`}>
                            {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span className="text-xl font-bold">{p.moic}</span>
                          </div>
                          <p className="text-xs text-slate-400">MOIC</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-3 mt-3">
                        {[["Invested", p.invested], ["Current Value", p.currentVal], ["MRR", p.mrr], ["MoM Growth", p.growth]].map(([k, v]) => (
                          <div key={k as string} className="bg-slate-50 rounded-lg p-2 text-center">
                            <p className="text-xs text-slate-400">{k}</p>
                            <p className="text-sm font-semibold text-slate-800">{v}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {p.tags.map(t => <Badge key={t}>{t}</Badge>)}
                      </div>
                      <p className="text-sm text-slate-600 mt-2 italic bg-slate-50 rounded-lg px-3 py-2">Latest: {p.update}</p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="text-xs bg-amber-500 hover:bg-amber-600"><BarChart2 className="w-3.5 h-3.5" /> Full Report</Button>
                        <Button size="sm" variant="outline" className="text-xs">Message Founder</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </>
  );
}
