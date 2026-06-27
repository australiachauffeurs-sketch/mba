import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/layout/sidebar"
import { UserRole } from "@/lib/types"

export default async function NotificationsLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, email")
    .eq("id", user.id)
    .single()

  if (!profile) redirect("/auth/login")

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        role={profile.role as UserRole}
        userName={profile.full_name || user.email?.split("@")[0] || "User"}
        userEmail={profile.email || user.email}
      />
      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  )
}
