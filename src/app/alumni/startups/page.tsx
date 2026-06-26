import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, TrendingUp, DollarSign, Users } from "lucide-react";

export default function StartupsPage() {
  return (
    <>
      <Topbar title="Startups" subtitle="MBA-founded startups in the network" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Startups in Network", value: "0", icon: Rocket, color: "text-indigo-600" },
            { label: "Actively Hiring", value: "0", icon: Users, color: "text-green-600" },
            { label: "Raising Now", value: "0", icon: DollarSign, color: "text-amber-600" },
            { label: "Exits / Acquired", value: "0", icon: TrendingUp, color: "text-purple-600" },
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
              <Rocket className="w-8 h-8 text-indigo-400" />
            </div>
            <p className="font-semibold text-slate-800 text-lg">No startups in the network yet</p>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">
              As students and alumni create startup profiles, they'll appear here. You can also add your own startup.
            </p>
            <Button className="mt-6">Add Your Startup</Button>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
