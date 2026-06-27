"use client"
import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Topbar } from "@/components/layout/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Brain, Bell, Shield, Mail, Save, CheckCircle, Loader2 } from "lucide-react"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // AI Matching
  const [minMatchThreshold, setMinMatchThreshold] = useState(70)
  const [maxIntrosPerWeek, setMaxIntrosPerWeek] = useState(5)

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [requireAdminApproval, setRequireAdminApproval] = useState(false)

  // Email config
  const [fromName, setFromName] = useState("UniConnect AI")
  const [replyTo, setReplyTo] = useState("support@uniconnect.edu")

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from("platform_settings")
        .select("*")
        .eq("id", "global")
        .single()

      if (data) {
        if (data.min_match_threshold != null) setMinMatchThreshold(data.min_match_threshold)
        if (data.max_intros_per_week != null) setMaxIntrosPerWeek(data.max_intros_per_week)
        if (data.email_notifications != null) setEmailNotifications(data.email_notifications)
        if (data.weekly_digest != null) setWeeklyDigest(data.weekly_digest)
        if (data.require_admin_approval != null) setRequireAdminApproval(data.require_admin_approval)
        if (data.from_name) setFromName(data.from_name)
        if (data.reply_to) setReplyTo(data.reply_to)
      }
      setLoading(false)
    }
    loadSettings()
  }, [])

  async function handleSave() {
    setSaving(true)
    await supabase.from("platform_settings").upsert({
      id: "global",
      min_match_threshold: minMatchThreshold,
      max_intros_per_week: maxIntrosPerWeek,
      email_notifications: emailNotifications,
      weekly_digest: weeklyDigest,
      require_admin_approval: requireAdminApproval,
      from_name: fromName,
      reply_to: replyTo,
      updated_at: new Date().toISOString(),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
    return (
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${value ? "bg-indigo-600" : "bg-slate-200"}`}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${value ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
    )
  }

  if (loading) {
    return (
      <>
        <Topbar title="Platform Settings" subtitle="Configure matching algorithms, notifications, and access controls" />
        <main className="flex-1 p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
        </main>
      </>
    )
  }

  return (
    <>
      <Topbar title="Platform Settings" subtitle="Configure matching algorithms, notifications, and access controls" />
      <main className="flex-1 p-6 space-y-6">
        {saved && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Settings saved!
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* AI Matching Engine */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-500" /> AI Matching Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  Minimum match threshold: <span className="text-indigo-600 font-bold">{minMatchThreshold}%</span>
                </label>
                <input
                  type="range"
                  min={50}
                  max={95}
                  value={minMatchThreshold}
                  onChange={(e) => setMinMatchThreshold(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <p className="text-xs text-slate-400 mt-1">Only show matches above this threshold to users</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  Max intros per week: <span className="text-indigo-600 font-bold">{maxIntrosPerWeek}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={maxIntrosPerWeek}
                  onChange={(e) => setMaxIntrosPerWeek(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Matching weights</label>
                <div className="space-y-2">
                  {[
                    { label: "Industry / Sector Overlap", weight: 35 },
                    { label: "Career Stage Compatibility", weight: 25 },
                    { label: "Geographic Proximity", weight: 15 },
                    { label: "Shared Interests & Skills", weight: 15 },
                    { label: "Profile Completeness", weight: 10 },
                  ].map((f) => (
                    <div key={f.label} className="flex items-center gap-2 text-xs">
                      <span className="flex-1 text-slate-600">{f.label}</span>
                      <div className="w-32 bg-slate-100 rounded-full h-1.5">
                        <div
                          className="bg-indigo-500 h-1.5 rounded-full"
                          style={{ width: `${f.weight * 2.86}%` }}
                        />
                      </div>
                      <span className="text-slate-400 w-8 text-right">{f.weight}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-500" /> Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <Toggle value={emailNotifications} onChange={setEmailNotifications} />
                <div>
                  <p className="text-sm font-medium text-slate-900">Email notifications</p>
                  <p className="text-xs text-slate-500">Users receive email when a new AI match is found</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <Toggle value={weeklyDigest} onChange={setWeeklyDigest} />
                <div>
                  <p className="text-sm font-medium text-slate-900">Weekly digest</p>
                  <p className="text-xs text-slate-500">Summary of activity and new connections</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <Toggle value={requireAdminApproval} onChange={setRequireAdminApproval} />
                <div>
                  <p className="text-sm font-medium text-slate-900">Require admin approval for new accounts</p>
                  <p className="text-xs text-slate-500">New registrations need admin review before access</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-500" /> Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">From Name</label>
                <input
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Reply-To</label>
                <input
                  type="email"
                  value={replyTo}
                  onChange={(e) => setReplyTo(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                />
              </div>
            </CardContent>
          </Card>

          {/* Platform Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-500" /> Platform Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-medium text-slate-500 mb-1">Current configuration</p>
                <div className="space-y-1 text-sm text-slate-700">
                  <p>Match threshold: <span className="font-semibold text-indigo-600">{minMatchThreshold}%</span></p>
                  <p>Max intros/week: <span className="font-semibold text-indigo-600">{maxIntrosPerWeek}</span></p>
                  <p>Email notifications: <span className="font-semibold">{emailNotifications ? "On" : "Off"}</span></p>
                  <p>Weekly digest: <span className="font-semibold">{weeklyDigest ? "On" : "Off"}</span></p>
                  <p>Admin approval: <span className="font-semibold">{requireAdminApproval ? "Required" : "Not required"}</span></p>
                </div>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <p className="text-xs font-medium text-indigo-700">Settings are saved to the <code className="bg-indigo-100 px-1 rounded">platform_settings</code> table and take effect immediately.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button size="lg" onClick={handleSave} disabled={saving} className={saved ? "bg-green-600 hover:bg-green-700" : ""}>
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            ) : saved ? (
              <><CheckCircle className="w-4 h-4" /> Saved!</>
            ) : (
              <><Save className="w-4 h-4" /> Save Settings</>
            )}
          </Button>
        </div>
      </main>
    </>
  )
}
