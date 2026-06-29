"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles, LayoutDashboard, Users, Network, BarChart2,
  Briefcase, Calendar, MessageSquare, Settings, LogOut, Shield,
} from "lucide-react";
import { adminLogout } from "@/app/admin/login/action";

const nav = [
  { label: "Dashboard",    href: "/admin",             icon: LayoutDashboard },
  { label: "Users",        href: "/admin/users",        icon: Users },
  { label: "Connections",  href: "/admin/connections",  icon: Network },
  { label: "Opportunities",href: "/admin/opportunities",icon: Briefcase },
  { label: "Events",       href: "/admin/events",       icon: Calendar },
  { label: "Messages",     href: "/admin/messages",     icon: MessageSquare },
  { label: "Analytics",    href: "/admin/analytics",    icon: BarChart2 },
  { label: "Settings",     href: "/admin/settings",     icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await adminLogout();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-56 flex-shrink-0 bg-slate-900 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">UniConnect</p>
            <p className="text-slate-400 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Admin badge */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2 bg-indigo-600/15 border border-indigo-500/20 rounded-lg px-3 py-2">
          <Shield className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-indigo-300 text-xs font-medium">Admin Access</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                active
                  ? "bg-indigo-600 text-white font-medium"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
