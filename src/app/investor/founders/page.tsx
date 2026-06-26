import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, GraduationCap, Briefcase, Mail } from "lucide-react";

const founders = [
  { id: "f1", name: "Priya Sharma", company: "PayFlow Africa", program: "MBA '26", background: "Ex-Stripe · BCG", thesisMatch: 94, expertise: ["Payments", "Africa", "B2C Growth"], intro: "Priya's MBA background + Stripe experience is a rare combo for emerging market fintech. Prof. Kumar is her faculty sponsor.", connections: ["Prof. David Kumar", "Sarah Chen"] },
  { id: "f2", name: "Chen Wei", company: "LoanWise", program: "MBA '24 Alum", background: "Ex-Goldman Sachs · DBS", thesisMatch: 89, expertise: ["Credit Risk", "SMB Lending", "AI/ML"], intro: "Former Goldman credit analyst building AI lending for underbanked SMBs. Strong technical + finance hybrid profile.", connections: ["Sarah Chen"] },
  { id: "f3", name: "Abiodun Adeyemi", company: "RemitFast", program: "MBA '26", background: "Ex-MTN · Flutterwave", thesisMatch: 81, expertise: ["Telco Payments", "Nigeria", "Stablecoin"], intro: "8 years at MTN's mobile money division before MBA. Rare operator-turned-founder profile in African fintech.", connections: ["Prof. David Kumar"] },
  { id: "f4", name: "Mei Lin", company: "ClearKYC", program: "MBA '22 Alum", background: "Ex-HSBC · MAS Singapore", thesisMatch: 76, expertise: ["Compliance", "APAC RegTech", "Banking"], intro: "Former MAS regulator with HSBC compliance background. Domain expertise is hard to replicate.", connections: [] },
];

export default function FoundersPage() {
  return (
    <>
      <Topbar title="Founder Network" subtitle="MBA alumni and student founders matched to your thesis" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4 mb-2">
          {[
            { label: "MBA-Founder Matches", value: founders.length },
            { label: "With Warm Intro", value: founders.filter(f => f.connections.length > 0).length },
            { label: "Avg Match Score", value: `${Math.round(founders.reduce((a, f) => a + f.thesisMatch, 0) / founders.length)}%` },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-5 text-center">
              <p className="text-3xl font-bold text-amber-600">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </CardContent></Card>
          ))}
        </div>

        <div className="space-y-4">
          {founders.map(f => (
            <Card key={f.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar name={f.name} size="lg" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900">{f.name}</h3>
                        <p className="text-sm text-slate-600 font-medium">{f.company}</p>
                        <p className="text-sm text-slate-500">{f.program} · {f.background}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-amber-600">{f.thesisMatch}%</p>
                        <p className="text-xs text-slate-400">thesis match</p>
                      </div>
                    </div>
                    <Progress value={f.thesisMatch} className="mt-2" barClassName="bg-amber-500" />
                    <p className="text-xs text-amber-900 bg-amber-50 rounded-lg px-3 py-2 mt-3 flex items-start gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-600 flex-shrink-0 mt-0.5" />{f.intro}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {f.expertise.map(e => <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>)}
                    </div>
                    {f.connections.length > 0 && (
                      <p className="text-xs text-slate-500 mt-2">
                        <span className="font-medium">Warm intro via:</span> {f.connections.join(", ")}
                      </p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="text-xs bg-amber-500 hover:bg-amber-600">
                        {f.connections.length > 0 ? "Request Intro" : "Connect"}
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs"><Mail className="w-3.5 h-3.5" /> Message</Button>
                      <Button size="sm" variant="outline" className="text-xs">View Profile</Button>
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
