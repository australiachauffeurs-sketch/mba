"use client";
import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { mockAlumni, mockFaculty, mockInvestors, mockStudents } from "@/lib/mock-data";
import { Users, UserCheck, UserPlus, Filter, MapPin, Building2, Sparkles } from "lucide-react";

const tabs = ["All", "Alumni", "Students", "Faculty", "Investors"];

const allConnections = [
  ...mockAlumni.map(p => ({ ...p, connected: true, mutualConnections: 4 })),
  ...mockStudents.map(p => ({ ...p, connected: false, mutualConnections: 2 })),
  ...mockFaculty.map(p => ({ ...p, connected: true, mutualConnections: 6 })),
  ...mockInvestors.slice(0, 1).map(p => ({ ...p, connected: false, mutualConnections: 3 })),
];

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [connections, setConnections] = useState<Record<string, boolean>>(
    Object.fromEntries(allConnections.map(c => [c.id, c.connected]))
  );

  const filtered = activeTab === "All" ? allConnections : allConnections.filter(c => c.role === activeTab.toLowerCase().slice(0, -1) || c.role === activeTab.toLowerCase().replace(/s$/, ""));

  return (
    <>
      <Topbar title="My Network" subtitle="Your connections across the university ecosystem" />
      <main className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Connections", value: 24, icon: Users, color: "text-indigo-600" },
            { label: "Alumni Connected", value: 14, icon: UserCheck, color: "text-purple-600" },
            { label: "Pending Requests", value: 3, icon: UserPlus, color: "text-amber-600" },
            { label: "Suggested by AI", value: 8, icon: Sparkles, color: "text-green-600" },
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

        {/* Tabs + Filter */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm"><Filter className="w-4 h-4" /> Filter</Button>
        </div>

        {/* Connection grid */}
        <div className="grid grid-cols-2 gap-4">
          {filtered.map(person => (
            <Card key={person.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar name={person.full_name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900">{person.full_name}</p>
                        <p className="text-sm text-slate-500 truncate">{person.headline}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                          {(person as any).location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{(person as any).location}</span>}
                          {((person as any).current_company || (person as any).firm || (person as any).department) && (
                            <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{(person as any).current_company || (person as any).firm || (person as any).department}</span>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary" className="flex-shrink-0 capitalize">{person.role}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">{(person as any).mutualConnections} mutual connections</p>
                    <div className="flex gap-2 mt-3">
                      {connections[person.id] ? (
                        <Button size="sm" variant="secondary" className="text-xs">
                          <UserCheck className="w-3.5 h-3.5" /> Connected
                        </Button>
                      ) : (
                        <Button size="sm" className="text-xs" onClick={() => setConnections(p => ({ ...p, [person.id]: true }))}>
                          <UserPlus className="w-3.5 h-3.5" /> Connect
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="text-xs">Message</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
