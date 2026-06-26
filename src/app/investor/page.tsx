import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { MetricCard } from "@/components/analytics/metric-card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, TrendingUp, DollarSign, Zap, Users, MapPin, ArrowRight } from "lucide-react";

const dealflow = [
  {
    name: "PayFlow Africa",
    founder: "Priya Sharma",
    stage: "Pre-seed",
    industry: "Fintech",
    ask: "$500K",
    thesisMatch: 94,
    traction: "Beta with 200 users across Nigeria and Kenya",
    reason: "Priya's fintech idea in emerging markets aligns perfectly with your investment thesis. She has Prof. Kumar's backing.",
    tags: ["Payments", "Africa", "B2C"],
  },
  {
    name: "HealthLoop AI",
    founder: "Marcus Johnson",
    stage: "Pre-seed",
    industry: "HealthTech",
    ask: "$750K",
    thesisMatch: 78,
    traction: "LOIs from 3 hospital systems",
    reason: "Outside your primary thesis but strong traction. Forwarded to Elena Vasquez (Health Capital) automatically.",
    tags: ["Digital Health", "AI", "B2B"],
  },
];

const portfolioUpdates = [
  { company: "PayBridge", founder: "Sarah Chen (MBA '18)", update: "Hit $50M ARR milestone. Series B closing next month.", positive: true },
  { company: "SaasLaunch", founder: "David Kim (MBA '19)", update: "New enterprise client — Fortune 500 healthcare company.", positive: true },
];

export default function InvestorDashboard() {
  return (
    <>
      <Topbar title="Investor Dashboard" subtitle="Deal flow matched to your thesis — powered by AI" />
      <main className="flex-1 p-6 space-y-6">
        {/* AI Summary */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">AI Deal Flow Intelligence</p>
              <p className="text-sm opacity-90 leading-relaxed">
                <strong>3 startups</strong> in the university ecosystem match your investment thesis this week. Your focus on fintech and emerging market payments has 1 high-priority match with a founder who has faculty backing and early traction.
              </p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <MetricCard label="Thesis Matches" value={3} description="This month" icon={Zap} iconColor="text-amber-500" />
          <MetricCard label="Portfolio Companies" value={12} icon={DollarSign} iconColor="text-green-600" />
          <MetricCard label="Founders Tracked" value={47} icon={Users} />
          <MetricCard label="Avg Match Score" value="86%" icon={TrendingUp} iconColor="text-indigo-600" />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Deal Flow */}
          <div className="col-span-2 space-y-4">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              AI-Matched Deal Flow
            </h2>
            {dealflow.map((deal) => (
              <Card key={deal.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900">{deal.name}</h3>
                          <p className="text-sm text-slate-500">by {deal.founder}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-amber-600">{deal.thesisMatch}%</span>
                          <p className="text-xs text-slate-400">thesis match</p>
                        </div>
                      </div>
                      <Progress value={deal.thesisMatch} className="mt-2" barClassName="bg-amber-500" />
                      <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                        <Badge variant="secondary">{deal.stage}</Badge>
                        <Badge variant="secondary">{deal.industry}</Badge>
                        <span className="font-medium text-slate-700">Raising {deal.ask}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-2">{deal.traction}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {deal.tags.map((t) => <Badge key={t}>{t}</Badge>)}
                      </div>
                      <p className="text-xs text-indigo-700 bg-indigo-50 rounded-lg p-2 mt-3 flex items-start gap-1">
                        <Sparkles className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        {deal.reason}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button className="text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600">Request Pitch</button>
                        <button className="text-xs border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-50">Learn More</button>
                        <button className="text-xs text-slate-400 px-3 py-1.5 rounded-lg hover:text-slate-600">Pass</button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Investment Thesis + Portfolio */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your Investment Thesis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">Focus Areas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Fintech", "Payments", "B2B SaaS"].map((t) => <Badge key={t}>{t}</Badge>)}
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">Stages</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Pre-seed", "Seed", "Series A"].map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">Ticket Size</p>
                  <p className="text-slate-700 font-medium">$250K – $2M</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">Geography</p>
                  <div className="flex flex-col gap-1">
                    {["North America", "Southeast Asia", "Africa"].map((g) => (
                      <span key={g} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <MapPin className="w-3 h-3 text-slate-400" /> {g}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Portfolio Updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {portfolioUpdates.map((p) => (
                  <div key={p.company} className={`rounded-lg p-3 ${p.positive ? "bg-green-50" : "bg-red-50"}`}>
                    <p className="text-sm font-semibold text-slate-900">{p.company}</p>
                    <p className="text-xs text-slate-500">{p.founder}</p>
                    <p className="text-xs text-slate-700 mt-1">{p.update}</p>
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
