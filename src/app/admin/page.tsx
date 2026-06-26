"use client";

import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/analytics/metric-card";
import { Progress } from "@/components/ui/progress";
import { adminMetrics } from "@/lib/mock-data";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Users, Sparkles, TrendingUp, DollarSign, BarChart3, Activity, Award } from "lucide-react";

const engagementTrend = [
  { month: "Jan", students: 820, alumni: 310, faculty: 45 },
  { month: "Feb", students: 890, alumni: 340, faculty: 52 },
  { month: "Mar", students: 950, alumni: 380, faculty: 61 },
  { month: "Apr", students: 1020, alumni: 420, faculty: 68 },
  { month: "May", students: 1100, alumni: 490, faculty: 74 },
  { month: "Jun", students: 1204, alumni: 560, faculty: 82 },
];

const connectionTypes = [
  { name: "Mentor–Student", value: 342, color: "#6366f1" },
  { name: "Alumni Hiring", value: 211, color: "#8b5cf6" },
  { name: "Investor–Founder", value: 89, color: "#f59e0b" },
  { name: "Research Collab", value: 124, color: "#10b981" },
  { name: "Peer Network", value: 1081, color: "#94a3b8" },
];

const topMentors = [
  { name: "Sarah Chen", role: "CEO PayBridge", sessions: 12, hires: 3 },
  { name: "James Park", role: "VP Product, Salesforce", sessions: 9, hires: 4 },
  { name: "Aisha Okonkwo", role: "Founder HealthAI", sessions: 7, hires: 0 },
];

const outcomesData = [
  { month: "Jan", placements: 12, funded: 1 },
  { month: "Feb", placements: 15, funded: 2 },
  { month: "Mar", placements: 18, funded: 1 },
  { month: "Apr", placements: 22, funded: 3 },
  { month: "May", placements: 27, funded: 4 },
  { month: "Jun", placements: 32, funded: 3 },
];

export default function AdminDashboard() {
  const totalFunding = (adminMetrics.fundingRaised / 1000000).toFixed(1);

  return (
    <>
      <Topbar title="University Analytics" subtitle="Real-time network intelligence for institutional reporting" />
      <main className="flex-1 p-6 space-y-6">
        {/* Top Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <MetricCard label="Total Members" value={adminMetrics.totalUsers.toLocaleString()} change={14} changeType="increase" icon={Users} />
          <MetricCard label="Active Connections" value={adminMetrics.activeConnections.toLocaleString()} change={22} changeType="increase" icon={Activity} iconColor="text-indigo-600" />
          <MetricCard label="Job Placements" value={adminMetrics.jobPlacements} change={18} changeType="increase" icon={Award} iconColor="text-green-600" />
          <MetricCard label="Funding Raised" value={`$${totalFunding}M`} change={35} changeType="increase" icon={DollarSign} iconColor="text-amber-500" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <MetricCard label="Mentor Sessions" value={adminMetrics.mentorSessions} change={28} changeType="increase" icon={Sparkles} />
          <MetricCard label="Startups Funded" value={adminMetrics.startupsFunded} icon={TrendingUp} iconColor="text-purple-600" />
          <MetricCard label="Network Engagement Score" value={`${adminMetrics.engagementScore}/100`} change={5} changeType="increase" icon={BarChart3} iconColor="text-teal-600" />
        </div>

        {/* User Breakdown */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: "Students", count: adminMetrics.students, color: "bg-blue-500", pct: (adminMetrics.students / adminMetrics.totalUsers) * 100 },
            { label: "Alumni", count: adminMetrics.alumni, color: "bg-purple-500", pct: (adminMetrics.alumni / adminMetrics.totalUsers) * 100 },
            { label: "Faculty", count: adminMetrics.faculty, color: "bg-green-500", pct: (adminMetrics.faculty / adminMetrics.totalUsers) * 100 },
            { label: "Investors", count: adminMetrics.investors, color: "bg-amber-500", pct: (adminMetrics.investors / adminMetrics.totalUsers) * 100 },
            { label: "Introductions Sent", count: adminMetrics.introductionsSent, color: "bg-indigo-500", pct: 100 },
          ].map((item) => (
            <Card key={item.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-xs text-slate-500">{item.label}</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{item.count.toLocaleString()}</p>
                <Progress value={item.pct} className="mt-2" barClassName={item.color} />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Engagement Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Member Growth</CardTitle>
              <CardDescription>Active users by role over 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={engagementTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="students" stackId="1" stroke="#6366f1" fill="#e0e7ff" name="Students" />
                  <Area type="monotone" dataKey="alumni" stackId="1" stroke="#8b5cf6" fill="#ede9fe" name="Alumni" />
                  <Area type="monotone" dataKey="faculty" stackId="1" stroke="#10b981" fill="#d1fae5" name="Faculty" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Outcomes */}
          <Card>
            <CardHeader>
              <CardTitle>Placement & Funding Outcomes</CardTitle>
              <CardDescription>Monthly job placements and startups funded</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={outcomesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="placements" fill="#6366f1" name="Placements" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="funded" fill="#f59e0b" name="Startups Funded" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Connection Types */}
          <Card>
            <CardHeader>
              <CardTitle>Connection Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={connectionTypes} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {connectionTypes.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {connectionTypes.map((ct) => (
                  <div key={ct.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ct.color }} />
                      <span className="text-slate-600">{ct.name}</span>
                    </div>
                    <span className="font-medium text-slate-900">{ct.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Mentors */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Top Alumni Contributors</CardTitle>
              <CardDescription>Ranked by mentoring sessions and hires facilitated</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topMentors.map((mentor, i) => (
                  <div key={mentor.name} className="flex items-center gap-4">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-slate-900">{mentor.name}</p>
                          <p className="text-xs text-slate-500">{mentor.role}</p>
                        </div>
                        <div className="flex gap-3 text-xs text-slate-500">
                          <span><strong className="text-slate-800">{mentor.sessions}</strong> sessions</span>
                          <span><strong className="text-slate-800">{mentor.hires}</strong> hires</span>
                        </div>
                      </div>
                      <Progress value={mentor.sessions * 8} className="mt-2" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-indigo-50 rounded-xl">
                <p className="text-sm font-medium text-indigo-900 mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Accreditation Insight
                </p>
                <p className="text-xs text-indigo-700 leading-relaxed">
                  Alumni engagement is up <strong>22%</strong> this semester. Career outcome tracking shows <strong>89 placements</strong> with average salary of $128K — key metric for AACSB reporting.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
