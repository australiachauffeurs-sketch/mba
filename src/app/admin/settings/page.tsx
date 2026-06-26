"use client";
import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Brain, Bell, Shield, Mail, Save, CheckCircle } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [aiThreshold, setAiThreshold] = useState(70);
  const [maxIntrosPerWeek, setMaxIntrosPerWeek] = useState(5);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [requireApproval, setRequireApproval] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <>
      <Topbar title="Platform Settings" subtitle="Configure matching algorithms, notifications, and access controls" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Brain className="w-4 h-4 text-indigo-500" /> AI Matching Engine</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Minimum Match Threshold</label>
                <div className="flex items-center gap-3">
                  <input type="range" min={50} max={95} value={aiThreshold} onChange={e => setAiThreshold(Number(e.target.value))}
                    className="flex-1 accent-indigo-600" />
                  <span className="text-sm font-bold text-indigo-600 w-12 text-center">{aiThreshold}%</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Only show matches above this threshold to users</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Max AI Introductions per User/Week</label>
                <div className="flex items-center gap-3">
                  <input type="range" min={1} max={20} value={maxIntrosPerWeek} onChange={e => setMaxIntrosPerWeek(Number(e.target.value))}
                    className="flex-1 accent-indigo-600" />
                  <span className="text-sm font-bold text-indigo-600 w-12 text-center">{maxIntrosPerWeek}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Matching Factors</label>
                <div className="space-y-2">
                  {[
                    { label: "Industry / Sector Overlap", weight: 35 },
                    { label: "Career Stage Compatibility", weight: 25 },
                    { label: "Geographic Proximity", weight: 15 },
                    { label: "Shared Interests & Skills", weight: 15 },
                    { label: "Profile Completeness", weight: 10 },
                  ].map(f => (
                    <div key={f.label} className="flex items-center gap-2 text-xs">
                      <span className="flex-1 text-slate-600">{f.label}</span>
                      <div className="w-32 bg-slate-100 rounded-full h-1.5">
                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${f.weight * 2.86}%` }} />
                      </div>
                      <span className="text-slate-400 w-8 text-right">{f.weight}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="w-4 h-4 text-indigo-500" /> Notification Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Email notifications for new matches", desc: "Users receive email when a new AI match is found", value: emailNotifs, onChange: setEmailNotifs },
                { label: "Weekly digest emails", desc: "Summary of activity and new connections", value: weeklyDigest, onChange: setWeeklyDigest },
                { label: "Require admin approval for new users", desc: "New registrations need admin review before access", value: requireApproval, onChange: setRequireApproval },
              ].map(s => (
                <div key={s.label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <button onClick={() => s.onChange(!s.value)}
                    className={`w-10 h-5 rounded-full transition-colors flex-shrink-0 mt-0.5 ${s.value ? "bg-indigo-600" : "bg-slate-200"}`}>
                    <span className={`block w-4 h-4 bg-white rounded-full shadow-sm transition-transform mx-0.5 ${s.value ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{s.label}</p>
                    <p className="text-xs text-slate-500">{s.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="w-4 h-4 text-indigo-500" /> Access Control</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { role: "Student", permissions: ["View own profile", "Connect with alumni/faculty", "Apply to opportunities"], color: "bg-blue-100 text-blue-700" },
                { role: "Alumni", permissions: ["Post opportunities", "Mentor students", "Access hiring tools"], color: "bg-purple-100 text-purple-700" },
                { role: "Faculty", permissions: ["Post research projects", "Verify student credentials", "Access collaboration tools"], color: "bg-green-100 text-green-700" },
                { role: "Investor", permissions: ["Access deal flow", "View founder profiles", "Request introductions"], color: "bg-amber-100 text-amber-700" },
              ].map(r => (
                <div key={r.role} className="flex items-start gap-3 p-3 border border-slate-100 rounded-lg">
                  <Badge className={r.color}>{r.role}</Badge>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-1">
                      {r.permissions.map(p => <span key={p} className="text-xs text-slate-500">· {p}</span>)}
                    </div>
                  </div>
                  <button className="text-xs text-indigo-600 hover:underline flex-shrink-0">Edit</button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Mail className="w-4 h-4 text-indigo-500" /> Email Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "From Name", value: "UniConnect AI – Harvard Business School" },
                { label: "Reply-To", value: "support@uniconnect.edu" },
                { label: "Welcome Email", value: "Enabled" },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs font-medium text-slate-500 block mb-1">{f.label}</label>
                  <input defaultValue={f.value} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button size="lg" onClick={handleSave} className={saved ? "bg-green-600 hover:bg-green-700" : ""}>
            {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Settings</>}
          </Button>
        </div>
      </main>
    </>
  );
}
