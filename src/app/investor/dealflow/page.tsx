"use client";
import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Sparkles, Filter } from "lucide-react";

export default function DealFlowPage() {
  const [tab, setTab] = useState<"pipeline" | "passed">("pipeline");
  return (
    <>
      <Topbar title="Deal Flow" subtitle="AI-matched MBA startup opportunities" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "In Pipeline", value: "0", color: "text-amber-600" },
            { label: "Thesis Match >80%", value: "0", color: "text-indigo-600" },
            { label: "Pitch Requested", value: "0", color: "text-green-600" },
            { label: "Passed", value: "0", color: "text-slate-400" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </CardContent></Card>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
            {(["pipeline", "passed"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {t === "pipeline" ? "Active Pipeline" : "Passed"}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-1" /> Filter by thesis</Button>
        </div>

        <Card>
          <CardContent className="p-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-amber-400" />
            </div>
            <p className="font-semibold text-slate-800 text-lg">No deals in pipeline yet</p>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">
              AI will surface MBA-founded startups that match your investment thesis (stage, sector, check size) as founders join the platform.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs text-amber-600">
              <TrendingUp className="w-3.5 h-3.5" /> Update your thesis to improve match accuracy
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
