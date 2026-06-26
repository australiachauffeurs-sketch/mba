import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Link2, Sparkles, BarChart2 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <>
      <Topbar title="Analytics" subtitle="Platform growth, engagement, and AI performance" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Members", value: "0", icon: Users, color: "text-indigo-600" },
            { label: "Connections", value: "0", icon: Link2, color: "text-green-600" },
            { label: "AI Matches", value: "0", icon: Sparkles, color: "text-purple-600" },
            { label: "Outcomes", value: "0", icon: TrendingUp, color: "text-amber-600" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center"><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div><p className="text-2xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        {["Member Growth", "Engagement by Role", "AI Match Performance"].map(title => (
          <Card key={title}>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><BarChart2 className="w-4 h-4 text-indigo-500" />{title}</CardTitle></CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center bg-slate-50 rounded-xl">
                <div className="text-center">
                  <BarChart2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No data yet — charts will populate as users join</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>
    </>
  );
}
