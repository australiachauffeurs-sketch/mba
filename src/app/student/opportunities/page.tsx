"use client";
import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Filter } from "lucide-react";

export default function OpportunitiesPage() {
  const [filter, setFilter] = useState("All");
  return (
    <>
      <Topbar title="Opportunities" subtitle="AI-curated internships, jobs and research matched to your profile" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Matched Roles", value: "0", color: "text-indigo-600" },
            { label: "Internships", value: "0", color: "text-blue-600" },
            { label: "Full-time Roles", value: "0", color: "text-green-600" },
            { label: "Research Positions", value: "0", color: "text-purple-600" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </CardContent></Card>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            {["All", "Internship", "Full-time", "Research"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {f}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-1" /> Filters</Button>
        </div>

        <Card>
          <CardContent className="p-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-indigo-400" />
            </div>
            <p className="font-semibold text-slate-800 text-lg">No opportunities yet</p>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">
              Opportunities posted by alumni, faculty, and investors will appear here, ranked by AI match score against your profile.
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
