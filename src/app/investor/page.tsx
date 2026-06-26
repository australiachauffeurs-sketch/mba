import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Briefcase, Users, DollarSign, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function InvestorDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user!.id).single();
  const firstName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";
  return (
    <>
      <Topbar title="Investor Dashboard" subtitle={`Welcome back, ${firstName} — discover MBA-founded startups`} />
      <main className="flex-1 p-6 space-y-6">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-lg">Your deal pipeline is ready</p>
              <p className="text-white/80 text-sm mt-1">
                Complete your investment thesis so AI can surface MBA-founded startups that match your focus areas, stage, and sectors.
              </p>
              <div className="mt-4 flex gap-3">
                <Link href="/investor/dealflow" className="text-sm bg-white/20 hover:bg-white/30 transition px-4 py-2 rounded-lg font-medium">View Deal Flow</Link>
                <Link href="/investor/founders" className="text-sm bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-lg">Browse Founders</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Deal Flow", value: "0", icon: TrendingUp, color: "text-amber-600" },
            { label: "Portfolio Companies", value: "0", icon: Briefcase, color: "text-indigo-600" },
            { label: "MBA Founders Met", value: "0", icon: Users, color: "text-green-600" },
            { label: "Intros Made", value: "0", icon: DollarSign, color: "text-purple-600" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center"><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div><p className="text-2xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {[
            { title: "Deal Flow", href: "/investor/dealflow", icon: TrendingUp, desc: "No deals in pipeline yet. AI will surface startups matching your thesis as founders join." },
            { title: "Portfolio", href: "/investor/portfolio", icon: Briefcase, desc: "No portfolio companies added yet. Add existing investments to track them here." },
          ].map(item => (
            <Card key={item.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-amber-500" />{item.title}
                  </h3>
                  <Link href={item.href} className="text-xs text-amber-600 hover:underline flex items-center gap-1">View <ArrowRight className="w-3 h-3" /></Link>
                </div>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
