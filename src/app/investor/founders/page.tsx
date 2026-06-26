import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Sparkles, Filter } from "lucide-react";

export default function FoundersPage() {
  return (
    <>
      <Topbar title="MBA Founders" subtitle="Connect with founders through warm alumni introductions" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Founders in Network", value: "0", icon: Users, color: "text-indigo-600" },
            { label: "Warm Intro Paths", value: "0", icon: Sparkles, color: "text-amber-600" },
            { label: "Met / Connected", value: "0", icon: Users, color: "text-green-600" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center"><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div><p className="text-2xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-1" /> Filter by stage</Button>
        </div>

        <Card>
          <CardContent className="p-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-amber-400" />
            </div>
            <p className="font-semibold text-slate-800 text-lg">No founders yet</p>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">
              MBA founders will appear here as they join the platform. AI maps the shortest warm introduction path through your shared alumni network.
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
