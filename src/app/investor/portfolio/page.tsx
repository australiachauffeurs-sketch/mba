import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, TrendingUp, DollarSign, Plus } from "lucide-react";

export default function PortfolioPage() {
  return (
    <>
      <Topbar title="Portfolio" subtitle="Track your investments in MBA-founded companies" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Portfolio Companies", value: "0", icon: Briefcase, color: "text-indigo-600" },
            { label: "Avg. MOIC", value: "—", icon: TrendingUp, color: "text-green-600" },
            { label: "Total Deployed", value: "—", icon: DollarSign, color: "text-amber-600" },
            { label: "Healthy", value: "0", icon: TrendingUp, color: "text-purple-600" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center"><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div><p className="text-2xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-indigo-400" />
            </div>
            <p className="font-semibold text-slate-800 text-lg">No portfolio companies yet</p>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">
              Add companies you've already invested in, or make your first investment through UniConnect's deal flow.
            </p>
            <Button className="mt-6"><Plus className="w-4 h-4 mr-1" /> Add Portfolio Company</Button>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
