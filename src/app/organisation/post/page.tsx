"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Briefcase, ArrowRight } from "lucide-react";

export default function OrganisationPostPage() {
  const router = useRouter();

  const options = [
    {
      title: "Post an Opportunity",
      description: "Share internships, full-time roles, volunteer positions, research roles, or workshops with students on the platform.",
      icon: Briefcase,
      href: "/organisation/opportunities",
      color: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Create an Event",
      description: "Host seminars, networking nights, hackathons, webinars, or recruitment events and get students to register.",
      icon: Calendar,
      href: "/organisation/events",
      color: "from-teal-500 to-cyan-600",
      bg: "bg-teal-50",
      iconColor: "text-teal-600",
    },
  ];

  return (
    <>
      <Topbar title="Post New" subtitle="Create an opportunity or event for students" />
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto mt-8 space-y-4">
          <p className="text-slate-600 text-center mb-8">What would you like to post?</p>
          {options.map(opt => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.href}
                onClick={() => router.push(opt.href)}
                className="w-full text-left"
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-teal-200">
                  <CardContent className="p-6 flex items-start gap-5">
                    <div className={`w-14 h-14 ${opt.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-7 h-7 ${opt.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-semibold text-slate-900 text-lg">{opt.title}</h2>
                      <p className="text-slate-500 text-sm mt-1">{opt.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 mt-4 flex-shrink-0" />
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </div>
      </main>
    </>
  );
}
