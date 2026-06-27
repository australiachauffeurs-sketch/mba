"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn, getRoleBadgeColor } from "@/lib/utils";
import { UserRole } from "@/lib/types";
import { createBrowserClient } from "@supabase/ssr";
import {
  LayoutDashboard, Users, Sparkles, MessageSquare, TrendingUp, Settings,
  BookOpen, Briefcase, DollarSign, BarChart3, Bell, LogOut, UserCircle,
  Calendar, Handshake,
} from "lucide-react";

interface NavItem { label: string; href: string; icon: React.ElementType; }

const navByRole: Record<UserRole, NavItem[]> = {
  student: [
    { label: "Dashboard", href: "/student", icon: LayoutDashboard },
    { label: "My Profile", href: "/student/profile", icon: UserCircle },
    { label: "Career GPS", href: "/student/career-gps", icon: Sparkles },
    { label: "AI Advisor", href: "/student/ai-recommendations", icon: TrendingUp },
    { label: "My Network", href: "/student/network", icon: Users },
    { label: "Mentors", href: "/student/mentors", icon: BookOpen },
    { label: "Opportunities", href: "/student/opportunities", icon: Briefcase },
    { label: "Events & Clubs", href: "/student/events", icon: Calendar },
    { label: "Co-founders", href: "/student/cofounders", icon: Handshake },
    { label: "Messages", href: "/student/messages", icon: MessageSquare },
  ],
  alumni: [
    { label: "Dashboard", href: "/alumni", icon: LayoutDashboard },
    { label: "My Profile", href: "/alumni/profile", icon: UserCircle },
    { label: "AI Advisor", href: "/alumni/ai-recommendations", icon: Sparkles },
    { label: "Students to Mentor", href: "/alumni/mentoring", icon: Users },
    { label: "Hiring Matches", href: "/alumni/hiring", icon: Briefcase },
    { label: "Startups", href: "/alumni/startups", icon: TrendingUp },
    { label: "Messages", href: "/alumni/messages", icon: MessageSquare },
  ],
  faculty: [
    { label: "Dashboard", href: "/faculty", icon: LayoutDashboard },
    { label: "My Profile", href: "/faculty/profile", icon: UserCircle },
    { label: "AI Advisor", href: "/faculty/ai-recommendations", icon: Sparkles },
    { label: "Research Matches", href: "/faculty/research", icon: BookOpen },
    { label: "Students", href: "/faculty/students", icon: Users },
    { label: "Collaborations", href: "/faculty/collaborations", icon: TrendingUp },
    { label: "Messages", href: "/faculty/messages", icon: MessageSquare },
  ],
  investor: [
    { label: "Dashboard", href: "/investor", icon: LayoutDashboard },
    { label: "My Profile", href: "/investor/profile", icon: UserCircle },
    { label: "AI Advisor", href: "/investor/ai-recommendations", icon: Sparkles },
    { label: "Deal Flow", href: "/investor/dealflow", icon: TrendingUp },
    { label: "Startups", href: "/investor/startups", icon: Sparkles },
    { label: "Founders", href: "/investor/founders", icon: Users },
    { label: "Portfolio", href: "/investor/portfolio", icon: DollarSign },
    { label: "Messages", href: "/investor/messages", icon: MessageSquare },
  ],
  admin: [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Connections", href: "/admin/connections", icon: Sparkles },
    { label: "Reports", href: "/admin/reports", icon: TrendingUp },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ],
};

const roleLabel: Record<UserRole, string> = {
  student: "Student", alumni: "Alumni", faculty: "Faculty", investor: "Investor", admin: "Admin",
};

interface SidebarProps { role: UserRole; userName: string; userEmail?: string; }

export function Sidebar({ role, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = navByRole[role];
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetch("/api/notifications")
      .then(r => r.ok ? r.json() : [])
      .then((data: { read: boolean }[]) => {
        setUnreadCount(data.filter(n => !n.read).length);
      })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  async function handleNotificationsClick() {
    if (unreadCount > 0) {
      await fetch("/api/notifications", { method: "PATCH" });
      setUnreadCount(0);
    }
  }

  const initials = userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg">UniConnect</span>
        </Link>
        <p className="text-xs text-slate-500 mt-1 ml-10">AI University Network</p>
      </div>

      {/* User */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{userName}</p>
            {userEmail && <p className="text-xs text-slate-400 truncate">{userEmail}</p>}
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={cn("w-2 h-2 rounded-full", getRoleBadgeColor(role))} />
              <span className="text-xs text-slate-500">{roleLabel[role]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== `/${role}` && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                active ? "bg-indigo-50 text-indigo-700 font-medium" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-slate-100 space-y-0.5">
        <Link href="/notifications"
          onClick={handleNotificationsClick}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
          <Bell className="w-4 h-4" />
          Notifications
          {unreadCount > 0 && (
            <span className="ml-auto bg-indigo-600 text-white text-xs rounded-full px-1.5 py-0.5">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
