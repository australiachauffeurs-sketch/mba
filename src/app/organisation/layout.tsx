import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";

export default async function OrganisationLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirectTo=/organisation");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, email")
    .eq("id", user.id)
    .single();

  if (profile?.role && profile.role !== "organisation") redirect(`/${profile.role}`);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        role="organisation"
        userName={profile?.full_name || user.email?.split("@")[0] || "Organisation"}
        userEmail={profile?.email || user.email}
      />
      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  );
}
