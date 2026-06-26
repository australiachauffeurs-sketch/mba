"use client";
import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, Filter, UserCheck, UserX, Shield } from "lucide-react";

const users = [
  { id: "u1", name: "Priya Sharma", email: "priya.sharma@mba.edu", role: "student", status: "active", joined: "Sep 2025", connections: 34, lastActive: "Today" },
  { id: "u2", name: "Sarah Chen", email: "sarah.chen@paybridgefintech.com", role: "alumni", status: "active", joined: "Jan 2026", connections: 67, lastActive: "Today" },
  { id: "u3", name: "Prof. David Kumar", email: "d.kumar@university.edu", role: "faculty", status: "active", joined: "Aug 2025", connections: 89, lastActive: "Yesterday" },
  { id: "u4", name: "Robert Tanaka", email: "r.tanaka@asiacapital.vc", role: "investor", status: "active", joined: "Feb 2026", connections: 23, lastActive: "2 days ago" },
  { id: "u5", name: "Alex Thompson", email: "alex.t@mba.edu", role: "student", status: "pending", joined: "Jun 2026", connections: 5, lastActive: "Today" },
  { id: "u6", name: "James Osei", email: "j.osei@novapay.io", role: "alumni", status: "inactive", joined: "Mar 2025", connections: 12, lastActive: "1 month ago" },
];

const roleColors: Record<string, string> = {
  student: "bg-blue-100 text-blue-700",
  alumni: "bg-purple-100 text-purple-700",
  faculty: "bg-green-100 text-green-700",
  investor: "bg-amber-100 text-amber-700",
  admin: "bg-red-100 text-red-700",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  inactive: "bg-slate-100 text-slate-500",
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const filtered = users.filter(u =>
    (roleFilter === "All" || u.role === roleFilter.toLowerCase()) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Topbar title="User Management" subtitle="Manage members across all roles and statuses" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: "Students", value: users.filter(u => u.role === "student").length, color: "text-blue-600" },
            { label: "Alumni", value: users.filter(u => u.role === "alumni").length, color: "text-purple-600" },
            { label: "Faculty", value: users.filter(u => u.role === "faculty").length, color: "text-green-600" },
            { label: "Investors", value: users.filter(u => u.role === "investor").length, color: "text-amber-600" },
            { label: "Pending", value: users.filter(u => u.status === "pending").length, color: "text-red-600" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </CardContent></Card>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none bg-white" />
          </div>
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            {["All", "Student", "Alumni", "Faculty", "Investor"].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${roleFilter === r ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>{r}</button>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="border-b border-slate-100">
                <tr className="text-xs text-slate-500 text-left">
                  {["User", "Role", "Status", "Connections", "Last Active", "Joined", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} size="sm" />
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge className={roleColors[u.role] + " capitalize"}>{u.role}</Badge></td>
                    <td className="px-4 py-3"><Badge className={statusColors[u.status] + " capitalize"}>{u.status}</Badge></td>
                    <td className="px-4 py-3 text-sm text-slate-600">{u.connections}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{u.lastActive}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{u.joined}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button title="Approve" className="p-1.5 hover:bg-green-50 rounded text-slate-400 hover:text-green-600"><UserCheck className="w-3.5 h-3.5" /></button>
                        <button title="Suspend" className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-600"><UserX className="w-3.5 h-3.5" /></button>
                        <button title="Admin" className="p-1.5 hover:bg-indigo-50 rounded text-slate-400 hover:text-indigo-600"><Shield className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
