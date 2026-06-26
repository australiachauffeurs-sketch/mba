import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar, TrendingUp, Users, Link2 } from "lucide-react";

const reports = [
  { id: "r1", title: "Monthly Engagement Report — June 2026", type: "Engagement", generated: "Jun 26, 2026", size: "2.4 MB", status: "ready", summary: "1,340 active users, 610 new connections, 203 AI-brokered introductions. 22% MoM growth." },
  { id: "r2", title: "Outcome Tracking — Q2 2026", type: "Outcomes", generated: "Jun 30, 2026", size: "4.1 MB", status: "ready", summary: "127 internships, 89 full-time placements, 54 research roles, 23 startup investments facilitated." },
  { id: "r3", title: "AI Matching Performance — June 2026", type: "AI Performance", generated: "Jun 26, 2026", size: "1.8 MB", status: "ready", summary: "73% match acceptance rate. Top sectors: Fintech (34%), VC/PE (18%), Consulting (14%)." },
  { id: "r4", title: "Diversity & Inclusion Snapshot — Q2 2026", type: "DEI", generated: "Jun 30, 2026", size: "3.2 MB", status: "pending", summary: "Generating..." },
  { id: "r5", title: "Annual Impact Report — AY 2025-26", type: "Annual", generated: "Jul 15, 2026", size: "—", status: "scheduled", summary: "Scheduled for July 15th post-commencement." },
];

const statusMap: Record<string, { label: string; color: string }> = {
  ready: { label: "Ready", color: "bg-green-100 text-green-700" },
  pending: { label: "Generating", color: "bg-amber-100 text-amber-700" },
  scheduled: { label: "Scheduled", color: "bg-blue-100 text-blue-700" },
};

const typeIcons: Record<string, typeof FileText> = {
  Engagement: Users,
  Outcomes: TrendingUp,
  "AI Performance": TrendingUp,
  DEI: Users,
  Annual: FileText,
};

export default function AdminReportsPage() {
  return (
    <>
      <Topbar title="Reports" subtitle="Download and schedule institutional impact reports" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Reports Generated", value: 47, icon: FileText },
            { label: "Scheduled Reports", value: 3, icon: Calendar },
            { label: "Downloads This Month", value: 128, icon: Download },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center"><s.icon className="w-5 h-5 text-indigo-600" /></div>
              <div><p className="text-2xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-slate-900">Available Reports</h2>
          <Button size="sm"><Calendar className="w-4 h-4" /> Schedule New Report</Button>
        </div>

        <div className="space-y-3">
          {reports.map(r => {
            const Icon = typeIcons[r.type] || FileText;
            return (
              <Card key={r.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 text-sm">{r.title}</h3>
                        <Badge className={statusMap[r.status]?.color}>{statusMap[r.status]?.label}</Badge>
                        <Badge variant="secondary">{r.type}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{r.summary}</p>
                      <p className="text-xs text-slate-400 mt-1">Generated: {r.generated} {r.size !== "—" && `· ${r.size}`}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {r.status === "ready" && (
                        <>
                          <Button size="sm" variant="outline" className="text-xs"><Download className="w-3.5 h-3.5" /> PDF</Button>
                          <Button size="sm" variant="outline" className="text-xs"><Download className="w-3.5 h-3.5" /> CSV</Button>
                        </>
                      )}
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
