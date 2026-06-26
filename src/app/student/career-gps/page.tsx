"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecommendationCard } from "@/components/profiles/recommendation-card";
import { Progress } from "@/components/ui/progress";
import { mockRecommendationsForPriya } from "@/lib/mock-data";
import { Sparkles, Target, Route, Lightbulb, BookOpen, TrendingUp } from "lucide-react";

const careerPath = [
  { phase: "Now", label: "Build Network", actions: ["Connect with 3 fintech mentors", "Join Fintech Club", "Attend VC networking events"], done: true },
  { phase: "Month 2–3", label: "Gain Experience", actions: ["Secure fintech internship", "Lead case competition", "Start researching with Prof. Kumar"], done: false },
  { phase: "Month 4–6", label: "Validate Idea", actions: ["Define startup concept", "Get investor feedback", "Build MVP prototype"], done: false },
  { phase: "Month 7–12", label: "Launch & Fund", actions: ["Pitch to alumni investors", "Apply to accelerators", "Recruit co-founder"], done: false },
];

const recommendedCourses = [
  { title: "Fintech & Innovation", professor: "Prof. David Kumar", relevance: 97, reason: "Directly covers the digital payments space you want to enter" },
  { title: "Venture Capital & PE", professor: "Prof. Lisa Wong", relevance: 91, reason: "Learn how investors think before pitching Horizon Ventures" },
  { title: "Global Financial Markets", professor: "Prof. Michael Torres", relevance: 84, reason: "Essential for emerging market understanding" },
];

const skillGaps = [
  { skill: "Financial Modeling", current: 60, target: 90 },
  { skill: "Technical Product Management", current: 45, target: 85 },
  { skill: "Fundraising & Pitching", current: 30, target: 80 },
  { skill: "Go-to-Market Strategy", current: 70, target: 90 },
];

export default function CareerGPSPage() {
  const [activeRecs, setActiveRecs] = useState(mockRecommendationsForPriya);

  return (
    <>
      <Topbar title="Career GPS" subtitle="Your personalized AI-powered degree navigator" />
      <main className="flex-1 p-6 space-y-6">
        {/* Goal summary */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">Goal: Fintech Founder</h2>
              <p className="opacity-80 text-sm leading-relaxed max-w-2xl">
                AI has mapped your entire MBA to this goal. Every recommendation — mentors, courses, investors, research — is optimized to make you a fundable fintech founder by graduation.
              </p>
              <div className="flex gap-3 mt-4">
                <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                  <div className="text-2xl font-bold">6</div>
                  <div className="text-xs opacity-80">People matched</div>
                </div>
                <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-xs opacity-80">Courses recommended</div>
                </div>
                <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                  <div className="text-2xl font-bold">78%</div>
                  <div className="text-xs opacity-80">Readiness score</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Roadmap */}
          <div className="col-span-2 space-y-4">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Route className="w-4 h-4 text-indigo-500" />
              12-Month Founder Roadmap
            </h2>
            <div className="space-y-3">
              {careerPath.map((phase, i) => (
                <Card key={i} className={phase.done ? "opacity-75" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${phase.done ? "bg-green-500 text-white" : i === 1 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                        {phase.done ? "✓" : i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-slate-400">{phase.phase}</span>
                          <span className="font-semibold text-slate-900">{phase.label}</span>
                          {i === 1 && <Badge>Current</Badge>}
                        </div>
                        <ul className="space-y-1">
                          {phase.actions.map((action) => (
                            <li key={action} className="text-sm text-slate-600 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI Recommendations */}
            <h2 className="font-semibold text-slate-900 flex items-center gap-2 mt-6">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              AI-Matched Connections for Your Goal
            </h2>
            {activeRecs.map((rec, i) => (
              <RecommendationCard key={i} recommendation={rec} />
            ))}
          </div>

          {/* Right: Courses + Skills */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  Recommended Courses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendedCourses.map((course) => (
                  <div key={course.title} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{course.title}</p>
                        <p className="text-xs text-slate-400">{course.professor}</p>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 flex-shrink-0">{course.relevance}%</span>
                    </div>
                    <div className="mt-1.5">
                      <Progress value={course.relevance} barClassName="bg-indigo-500" />
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5 flex items-start gap-1">
                      <Lightbulb className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                      {course.reason}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-500" />
                  Skill Gap Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {skillGaps.map((s) => (
                  <div key={s.skill}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600">{s.skill}</span>
                      <span className="text-slate-400">{s.current}% → {s.target}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={s.target} barClassName="bg-slate-100" />
                      <div className="absolute inset-0">
                        <Progress value={s.current} barClassName="bg-indigo-500" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
