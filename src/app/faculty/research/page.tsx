"use client";
import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlaskConical, Plus, BookOpen, Users } from "lucide-react";

export default function ResearchPage() {
  const [tab, setTab] = useState<"projects" | "publications">("projects");
  return (
    <>
      <Topbar title="Research" subtitle="Manage your research projects and publications" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Active Projects", value: "0", icon: FlaskConical, color: "text-teal-600", bg: "bg-teal-50" },
            { label: "Publications", value: "0", icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Research Assistants", value: "0", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-5 flex items-center gap-4">
              <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div><p className="text-2xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
            {(["projects", "publications"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {t === "projects" ? "Research Projects" : "Publications"}
              </button>
            ))}
          </div>
          <Button size="sm"><Plus className="w-4 h-4 mr-1" /> {tab === "projects" ? "New Project" : "Add Publication"}</Button>
        </div>

        <Card>
          <CardContent className="p-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-4">
              <FlaskConical className="w-8 h-8 text-teal-400" />
            </div>
            <p className="font-semibold text-slate-800 text-lg">
              {tab === "projects" ? "No research projects yet" : "No publications added yet"}
            </p>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">
              {tab === "projects"
                ? "Add your active research projects to attract student assistants and find collaboration partners."
                : "Add your publications to build your academic profile and increase visibility in the network."}
            </p>
            <Button className="mt-6"><Plus className="w-4 h-4 mr-1" /> {tab === "projects" ? "Add Research Project" : "Add Publication"}</Button>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
