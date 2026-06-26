"use client";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const memberGrowth = [
  { month: "Jan", students: 820, alumni: 340, faculty: 95, investors: 28 },
  { month: "Feb", students: 890, alumni: 370, faculty: 98, investors: 32 },
  { month: "Mar", students: 960, alumni: 410, faculty: 102, investors: 38 },
  { month: "Apr", students: 1050, alumni: 450, faculty: 106, investors: 44 },
  { month: "May", students: 1120, alumni: 490, faculty: 110, investors: 51 },
  { month: "Jun", students: 1243, alumni: 524, faculty: 118, investors: 63 },
];

const engagementData = [
  { month: "Jan", connections: 240, messages: 890, introductions: 67 },
  { month: "Feb", connections: 310, messages: 1100, introductions: 89 },
  { month: "Mar", connections: 390, messages: 1350, introductions: 112 },
  { month: "Apr", connections: 450, messages: 1600, introductions: 145 },
  { month: "May", connections: 520, messages: 1850, introductions: 178 },
  { month: "Jun", connections: 610, messages: 2100, introductions: 203 },
];

const outcomesPie = [
  { name: "Internships", value: 127, color: "#6366f1" },
  { name: "Full-Time Jobs", value: 89, color: "#22c55e" },
  { name: "Research Placements", value: 54, color: "#f59e0b" },
  { name: "Startup Investments", value: 23, color: "#ec4899" },
  { name: "Mentorships", value: 218, color: "#06b6d4" },
];

export default function AdminAnalyticsPage() {
  return (
    <>
      <Topbar title="Analytics" subtitle="Platform engagement, growth, and outcome metrics" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Members", value: "2,011", change: "+12%", pos: true },
            { label: "Active This Week", value: "1,340", change: "+8%", pos: true },
            { label: "Connections Made", value: "6,240", change: "+15%", pos: true },
            { label: "AI Introductions", value: "894", change: "+22%", pos: true },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-5">
              <p className="text-3xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              <p className={`text-xs font-medium mt-1 ${s.pos ? "text-green-600" : "text-red-500"}`}>{s.change} vs last month</p>
            </CardContent></Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Member Growth by Role</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={memberGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="students" stackId="1" stroke="#6366f1" fill="#e0e7ff" />
                  <Area type="monotone" dataKey="alumni" stackId="1" stroke="#22c55e" fill="#dcfce7" />
                  <Area type="monotone" dataKey="faculty" stackId="1" stroke="#f59e0b" fill="#fef3c7" />
                  <Area type="monotone" dataKey="investors" stackId="1" stroke="#ec4899" fill="#fce7f3" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Engagement Activity</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="connections" fill="#6366f1" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="introductions" fill="#22c55e" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Outcomes by Category</CardTitle></CardHeader>
            <CardContent className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={outcomesPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {outcomesPie.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {outcomesPie.map(o => (
                  <div key={o.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: o.color }} />
                      <span className="text-xs text-slate-600">{o.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-900">{o.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">AI System Performance</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Match Acceptance Rate", value: 73, color: "bg-indigo-500" },
                { label: "Introduction Success Rate", value: 68, color: "bg-green-500" },
                { label: "Recommendation CTR", value: 54, color: "bg-amber-500" },
                { label: "Profile Completeness", value: 81, color: "bg-cyan-500" },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{m.label}</span><span className="font-semibold text-slate-700">{m.value}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`${m.color} h-2 rounded-full`} style={{ width: `${m.value}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
