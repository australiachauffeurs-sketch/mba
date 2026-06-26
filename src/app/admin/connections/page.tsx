import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, Sparkles, TrendingUp } from "lucide-react";

export default function ConnectionsPage() {
  return (
    <>
      <Topbar title="Connections" subtitle="Network activity and AI-facilitated introductions" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Connections", value: "0", icon: Link2, color: "text-indigo-600" },
            { label: "AI-Suggested Intros", value: "0", icon: Sparkles, color: "text-purple-600" },
            { label: "Accepted Rate", value: "—", icon: TrendingUp, color: "text-green-600" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center"><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div><p className="text-2xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Connection Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="p-12 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                <Link2 className="w-7 h-7 text-indigo-400" />
              </div>
              <p className="font-medium text-slate-800">No connections yet</p>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">Connection activity will appear here as users join and start networking.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
