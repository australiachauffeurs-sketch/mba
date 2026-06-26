"use client";
import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Search, UserPlus } from "lucide-react";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  return (
    <>
      <Topbar title="Users" subtitle="Manage all platform members" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-5 gap-4">
          {["All", "Students", "Alumni", "Faculty", "Investors"].map((role) => (
            <div key={role} onClick={() => setRoleFilter(role)} className="cursor-pointer">
              <Card className={`transition-shadow hover:shadow-md ${roleFilter === role ? "ring-2 ring-indigo-500" : ""}`}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-slate-900">0</p>
                  <p className="text-xs text-slate-500 mt-1">{role}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <Button size="sm"><UserPlus className="w-4 h-4 mr-1" /> Invite User</Button>
        </div>

        <Card>
          <CardContent className="p-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-indigo-400" />
            </div>
            <p className="font-semibold text-slate-800 text-lg">No users yet</p>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">
              Share the signup link with students, alumni, faculty, and investors to onboard your first members.
            </p>
            <Button className="mt-6"><UserPlus className="w-4 h-4 mr-1" /> Invite First Users</Button>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
