import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { FlaskConical, Sparkles, Users } from "lucide-react";

export default function CollaborationsPage() {
  return (
    <>
      <Topbar title="Collaborations" subtitle="Research partnerships and co-author connections" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Active Collaborations", value: "0", icon: FlaskConical, color: "text-teal-600" },
            { label: "AI Suggestions", value: "0", icon: Sparkles, color: "text-indigo-600" },
            { label: "Pending Invites", value: "0", icon: Users, color: "text-purple-600" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center"><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div><p className="text-2xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-4">
              <FlaskConical className="w-8 h-8 text-teal-400" />
            </div>
            <p className="font-semibold text-slate-800 text-lg">No collaborations yet</p>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">
              As you add research areas to your profile, AI will suggest faculty collaborators and alumni with complementary expertise.
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
