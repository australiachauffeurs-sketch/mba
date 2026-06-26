"use client";
import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Star } from "lucide-react";

export default function MentoringPage() {
  const [tab, setTab] = useState<"requests" | "active">("requests");
  return (
    <>
      <Topbar title="Mentoring" subtitle="Guide the next generation of MBA students" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Mentoring Requests", value: "0", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Active Mentees", value: "0", icon: BookOpen, color: "text-green-600", bg: "bg-green-50" },
            { label: "Sessions Done", value: "0", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-5 flex items-center gap-4">
              <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div><p className="text-2xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
          {(["requests", "active"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              {t === "requests" ? "Pending Requests" : "Active Mentees"}
            </button>
          ))}
        </div>

        <Card>
          <CardContent className="p-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-purple-400" />
            </div>
            <p className="font-semibold text-slate-800 text-lg">
              {tab === "requests" ? "No mentoring requests yet" : "No active mentees yet"}
            </p>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">
              Students AI-matched to your expertise will send mentoring requests here. Make sure your profile shows your areas of expertise.
            </p>
            <Button variant="outline" className="mt-6">Update availability</Button>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
