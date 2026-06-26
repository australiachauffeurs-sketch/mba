import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sparkles, Link2, ArrowRight, TrendingUp } from "lucide-react";

const recentConnections = [
  { id: "c1", from: "Priya Sharma", fromRole: "student", to: "Sarah Chen", toRole: "alumni", type: "AI Intro", date: "Today 10:30 AM", outcome: "Mentorship" },
  { id: "c2", from: "Robert Tanaka", fromRole: "investor", to: "Priya Sharma", toRole: "student", type: "AI Intro", date: "Today 9:15 AM", outcome: "Investment Interest" },
  { id: "c3", from: "Prof. David Kumar", fromRole: "faculty", to: "Alex Thompson", toRole: "student", type: "Manual", date: "Yesterday", outcome: "Research Advisee" },
  { id: "c4", from: "Sarah Chen", fromRole: "alumni", to: "James Osei", toRole: "alumni", type: "Organic", date: "2 days ago", outcome: "Co-founder Discussion" },
  { id: "c5", from: "Robert Tanaka", fromRole: "investor", to: "Chen Wei", toRole: "alumni", type: "AI Intro", date: "3 days ago", outcome: "Deal Flow" },
];

const topPaths = [
  { path: "Student → Alumni", count: 1240, growth: "+18%", color: "bg-indigo-500" },
  { path: "Alumni → Alumni", count: 890, growth: "+12%", color: "bg-purple-500" },
  { path: "Student → Faculty", count: 670, growth: "+24%", color: "bg-green-500" },
  { path: "Investor → Alumni", count: 340, growth: "+31%", color: "bg-amber-500" },
  { path: "Faculty → Alumni", count: 290, growth: "+9%", color: "bg-cyan-500" },
];

const roleMap: Record<string, string> = {
  student: "bg-blue-100 text-blue-700",
  alumni: "bg-purple-100 text-purple-700",
  faculty: "bg-green-100 text-green-700",
  investor: "bg-amber-100 text-amber-700",
};

export default function AdminConnectionsPage() {
  return (
    <>
      <Topbar title="Connection Graph" subtitle="Monitor all connections and AI-generated introductions" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Connections", value: "6,240", color: "text-indigo-600" },
            { label: "AI Introductions", value: "894", color: "text-purple-600" },
            { label: "Intro Success Rate", value: "68%", color: "text-green-600" },
            { label: "New This Week", value: "342", color: "text-amber-600" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-5 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </CardContent></Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Top Connection Pathways</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {topPaths.map(p => (
                <div key={p.path}>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span className="font-medium text-slate-700">{p.path}</span>
                    <div className="flex gap-2">
                      <span className="text-green-600 font-medium">{p.growth}</span>
                      <span>{p.count.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`${p.color} h-2 rounded-full`} style={{ width: `${(p.count / 1240) * 100}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-500" /> AI-Suggested Introductions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { from: "Leila Nkosi", to: "Sarah Chen", reason: "Both focused on African fintech, no connection yet", score: 92 },
                { from: "Dan Cooper", to: "Robert Tanaka", reason: "Dan's blockchain thesis matches Robert's DeFi interest", score: 87 },
              ].map(s => (
                <div key={s.from} className="bg-indigo-50 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-slate-900">{s.from}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-900">{s.to}</span>
                    <Badge className="ml-auto bg-indigo-100 text-indigo-700">{s.score}%</Badge>
                  </div>
                  <p className="text-xs text-slate-600">{s.reason}</p>
                  <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700 w-full">Send Introduction</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Recent Connections</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="border-b border-slate-100">
                <tr className="text-xs text-slate-500 text-left">
                  {["From", "", "To", "Type", "Outcome", "Date"].map((h, i) => (
                    <th key={i} className="px-4 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentConnections.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={c.from} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{c.from}</p>
                          <Badge className={roleMap[c.fromRole] + " text-xs capitalize"}>{c.fromRole}</Badge>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><ArrowRight className="w-4 h-4 text-slate-300" /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={c.to} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{c.to}</p>
                          <Badge className={roleMap[c.toRole] + " text-xs capitalize"}>{c.toRole}</Badge>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={c.type === "AI Intro" ? "default" : "secondary"} className="text-xs">{c.type}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{c.outcome}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
