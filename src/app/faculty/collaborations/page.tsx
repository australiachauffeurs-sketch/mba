import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sparkles, Building2, Globe, ArrowRight } from "lucide-react";

const collaborations = [
  { id: "col1", type: "Industry", partner: "PayBridge", contact: "Sarah Chen", role: "CEO", description: "Joint research on payment infrastructure in underbanked markets. Access to transaction data.", status: "Active", since: "Jan 2026", tags: ["Fintech", "Data Partnership"] },
  { id: "col2", type: "Academic", partner: "MIT Media Lab", contact: "Dr. Hiroshi Tanaka", role: "Research Scientist", description: "CBDC simulation framework collaboration. Co-authoring paper for Nature Finance.", status: "Active", since: "Mar 2026", tags: ["CBDC", "Co-authorship"] },
  { id: "col3", type: "Government", partner: "World Bank", contact: "Dr. Amara Diallo", role: "Senior Economist", description: "Consulting on digital financial inclusion policy for Sub-Saharan Africa.", status: "Pending", since: "Jun 2026", tags: ["Policy", "Development Finance"] },
];

const suggested = [
  { name: "Dr. Elena Vasquez", affiliation: "Harvard Business School", area: "FinTech regulation", matchScore: 88 },
  { name: "Prof. James Osei", affiliation: "London School of Economics", area: "Digital currency adoption", matchScore: 84 },
];

export default function CollaborationsPage() {
  return (
    <>
      <Topbar title="Collaborations" subtitle="Industry, academic, and government partnerships" />
      <main className="flex-1 p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="font-semibold text-slate-900">Active Collaborations</h2>
          {collaborations.map(c => (
            <Card key={c.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${c.type === "Industry" ? "bg-blue-50" : c.type === "Academic" ? "bg-purple-50" : "bg-green-50"}`}>
                    {c.type === "Industry" ? <Building2 className={`w-6 h-6 text-blue-600`} /> : <Globe className={`w-6 h-6 ${c.type === "Academic" ? "text-purple-600" : "text-green-600"}`} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">{c.partner}</h3>
                          <Badge variant="secondary">{c.type}</Badge>
                          <Badge className={c.status === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}>{c.status}</Badge>
                        </div>
                        <p className="text-sm text-slate-500">Contact: {c.contact} · {c.role}</p>
                        <p className="text-sm text-slate-600 mt-2">{c.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {c.tags.map(t => <Badge key={t}>{t}</Badge>)}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <p className="text-xs text-slate-400">Since {c.since}</p>
                        <Button size="sm" variant="outline" className="text-xs">Manage <ArrowRight className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-green-500" /> AI-Suggested Collaborators
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {suggested.map(s => (
              <Card key={s.name}>
                <CardContent className="p-5 flex items-start gap-3">
                  <Avatar name={s.name} size="md" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{s.name}</p>
                    <p className="text-sm text-slate-500">{s.affiliation}</p>
                    <p className="text-xs text-slate-400 mt-1">Research: {s.area}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-bold text-green-600">{s.matchScore}% match</span>
                      <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700">Connect</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
