"use client";
import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Plus } from "lucide-react";

export default function HiringPage() {
  const [tab, setTab] = useState<"posted" | "applicants">("posted");
  return (
    <>
      <Topbar title="Hiring" subtitle="Post jobs and internships for MBA students" />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
            {(["posted", "applicants"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {t === "posted" ? "Posted Jobs" : "Applicants"}
              </button>
            ))}
          </div>
          <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Post a Job</Button>
        </div>

        <Card>
          <CardContent className="p-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-green-400" />
            </div>
            <p className="font-semibold text-slate-800 text-lg">
              {tab === "posted" ? "No jobs posted yet" : "No applicants yet"}
            </p>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">
              {tab === "posted"
                ? "Share internship or full-time openings from your company. AI will match them to the best-fit students."
                : "Post a job first to start receiving applicants from AI-matched students."}
            </p>
            {tab === "posted" && <Button className="mt-6"><Plus className="w-4 h-4 mr-1" /> Post Your First Job</Button>}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
