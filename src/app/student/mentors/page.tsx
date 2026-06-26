"use client";
import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, CheckCircle, Star } from "lucide-react";

export default function MentorsPage() {
  const [tab, setTab] = useState<"discover" | "my">("discover");
  return (
    <>
      <Topbar title="Mentors" subtitle="AI-matched mentors based on your career goals" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Active Mentors", value: "0", icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Sessions Completed", value: "0", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
            { label: "Avg. Rating", value: "—", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-5 flex items-center gap-4">
              <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div><p className="text-2xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
          {(["discover", "my"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              {t === "discover" ? "Discover Mentors" : "My Mentors"}
            </button>
          ))}
        </div>

        <Card>
          <CardContent className="p-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-indigo-400" />
            </div>
            <p className="font-semibold text-slate-800 text-lg">
              {tab === "discover" ? "No mentor matches yet" : "You haven't connected with any mentors yet"}
            </p>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">
              {tab === "discover"
                ? "Once alumni and faculty mark themselves as available for mentoring, AI will match them to your profile here."
                : "Browse the Discover tab to find and request your first mentor session."}
            </p>
            {tab === "my" && (
              <Button className="mt-6" onClick={() => setTab("discover")}>Discover Mentors</Button>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
