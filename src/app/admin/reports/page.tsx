import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

const reportTypes = [
  { title: "Member Growth Report", desc: "Monthly signups and role distribution", icon: FileText },
  { title: "Network Connections Report", desc: "Connection rates and AI match performance", icon: FileText },
  { title: "Outcomes Report", desc: "Jobs, mentoring sessions, and funding events", icon: FileText },
  { title: "AI Performance Report", desc: "Match accuracy and recommendation quality", icon: FileText },
];

export default function ReportsPage() {
  return (
    <>
      <Topbar title="Reports" subtitle="Export platform data and insights" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {reportTypes.map(r => (
            <Card key={r.title}>
              <CardContent className="p-6 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <r.icon className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{r.title}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{r.desc}</p>
                    <p className="text-xs text-slate-400 mt-2">No data available yet</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" disabled>
                  <Download className="w-4 h-4 mr-1" /> Export
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-medium text-slate-700">Reports will populate automatically</p>
            <p className="text-sm text-slate-500 mt-1">Once users join and start activity, export buttons will become available with real data.</p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
