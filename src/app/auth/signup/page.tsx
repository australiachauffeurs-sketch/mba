"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Briefcase, BookOpen, TrendingUp, Building2, ArrowRight, ArrowLeft } from "lucide-react";

const roles = [
  {
    id: "student",
    label: "Student",
    description: "Current MBA, EMBA, or PhD student",
    icon: GraduationCap,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200 hover:border-blue-400",
    perks: ["AI career mentorship", "Alumni network access", "Job & internship matching"],
  },
  {
    id: "alumni",
    label: "Alumni",
    description: "University graduate building a career",
    icon: Briefcase,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200 hover:border-purple-400",
    perks: ["Mentor current students", "Hire from your alma mater", "Startup ecosystem"],
  },
  {
    id: "faculty",
    label: "Faculty",
    description: "Professor, researcher, or lecturer",
    icon: BookOpen,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200 hover:border-green-400",
    perks: ["Find research collaborators", "Student talent pipeline", "Industry partnerships"],
  },
  {
    id: "investor",
    label: "Investor",
    description: "VC, angel, or institutional investor",
    icon: TrendingUp,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200 hover:border-amber-400",
    perks: ["Access MBA founder deals", "Thesis-matched deal flow", "Warm intro network"],
  },
  {
    id: "organisation",
    label: "Organisation / Club",
    description: "Company, club, NGO, or institution",
    icon: Building2,
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-200 hover:border-teal-400",
    perks: ["Post jobs & internships", "Host events & workshops", "Reach MBA talent"],
  },
];

export default function SignupRoleSelectionPage() {
  const router = useRouter();

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
      <Link href="/auth/login" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to login
      </Link>

      <div className="mb-7">
        <h2 className="text-2xl font-bold text-slate-900">Create your profile</h2>
        <p className="text-slate-500 text-sm mt-1.5">
          Select your role to get started. Each role has a tailored onboarding experience.
        </p>
      </div>

      <div className="space-y-3">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <button
              key={role.id}
              onClick={() => router.push(`/auth/signup/${role.id}`)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 ${role.border} bg-white transition-all text-left group`}
            >
              <div className={`w-12 h-12 ${role.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-6 h-6 ${role.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900">{role.label}</p>
                <p className="text-xs text-slate-500">{role.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {role.perks.map((p) => (
                    <span key={p} className={`text-xs px-2 py-0.5 ${role.bg} ${role.color} rounded-full font-medium`}>{p}</span>
                  ))}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors flex-shrink-0" />
            </button>
          );
        })}
      </div>

      <p className="text-xs text-center text-slate-400 mt-6">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-indigo-600 hover:underline font-medium">Sign in</Link>
      </p>
    </div>
  );
}
