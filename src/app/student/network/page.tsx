"use client";
import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, UserPlus, Sparkles, Search } from "lucide-react";

const tabs = ["All", "Alumni", "Students", "Faculty", "Investors"];

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <>
      <Topbar title="My Network" subtitle="Connect with alumni, faculty, investors and peers" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Connections", value: "0", icon: Users, color: "text-indigo-600" },
            { label: "Alumni Connected", value: "0", icon: UserCheck, color: "text-purple-600" },
            { label: "Pending Requests", value: "0", icon: UserPlus, color: "text-amber-600" },
            { label: "Suggested by AI", value: "0", icon: Sparkles, color: "text-green-600" },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {tab}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm"><Search className="w-4 h-4 mr-1" /> Search people</Button>
        </div>

        <Card>
          <CardContent className="p-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-indigo-400" />
            </div>
            <p className="font-semibold text-slate-800 text-lg">Your network is empty</p>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">
              As more students, alumni, faculty and investors join UniConnect AI, they'll appear here. Start by browsing mentors to make your first connection.
            </p>
            <Button className="mt-6">Find Mentors</Button>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
