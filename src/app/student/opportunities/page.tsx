"use client";
import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Briefcase, MapPin, DollarSign, Clock, Building2, BookmarkPlus, ExternalLink, Filter } from "lucide-react";

const opportunities = [
  {
    id: "o1", type: "internship", title: "Product Manager Intern", company: "PayBridge", location: "San Francisco, CA",
    stipend: "$8,000/mo", duration: "Summer 2026", deadline: "Feb 15, 2026", matchScore: 94,
    postedBy: "Sarah Chen (MBA '18)", tags: ["Fintech", "Product", "B2C"],
    description: "Join the PayBridge product team to build next-gen payment infrastructure for emerging markets.",
    aiReason: "Sarah Chen (your top mentor match) posted this. Your fintech + product skills are a direct fit.",
  },
  {
    id: "o2", type: "fulltime", title: "Associate Product Manager", company: "Salesforce", location: "San Francisco, CA",
    stipend: "$145,000/yr", duration: "Full-time", deadline: "Mar 1, 2026", matchScore: 87,
    postedBy: "James Park (MBA '16)", tags: ["SaaS", "Enterprise", "Product"],
    description: "APM role on the core CRM team. Drive product strategy for 150k+ enterprise customers.",
    aiReason: "James Park (connected alumni) is actively hiring MBAs for this role. Your product strategy skills align.",
  },
  {
    id: "o3", type: "internship", title: "Strategy & Ops Intern", company: "Horizon Ventures", location: "New York, NY",
    stipend: "$7,500/mo", duration: "Summer 2026", deadline: "Jan 30, 2026", matchScore: 79,
    postedBy: "Robert Tanaka (Investor)", tags: ["VC", "Strategy", "Fintech"],
    description: "Work directly with the investment team on deal sourcing, due diligence, and portfolio support.",
    aiReason: "Robert Tanaka invests in fintech — exposure to his portfolio would accelerate your founder journey.",
  },
  {
    id: "o4", type: "research", title: "Research Assistant — Digital Payments", company: "University", location: "On-campus",
    stipend: "$3,000/mo", duration: "Fall 2026", deadline: "Apr 1, 2026", matchScore: 91,
    postedBy: "Prof. David Kumar", tags: ["Research", "Fintech", "Payments"],
    description: "Assist Prof. Kumar's research on CBDC adoption in Southeast Asia and Africa.",
    aiReason: "This research directly feeds into your fintech startup idea and adds academic credibility.",
  },
  {
    id: "o5", type: "fulltime", title: "Growth Manager", company: "HealthAI", location: "Chicago, IL",
    stipend: "$130,000/yr", duration: "Full-time", deadline: "Mar 15, 2026", matchScore: 68,
    postedBy: "Aisha Okonkwo (MBA '17)", tags: ["HealthTech", "Growth", "B2B"],
    description: "Own growth strategy and execution for HealthAI's B2B SaaS platform.",
    aiReason: "Aisha is a physician-turned-founder — working here gives strong startup exposure even in a different vertical.",
  },
];

const typeColors: Record<string, string> = {
  internship: "bg-blue-100 text-blue-700",
  fulltime: "bg-green-100 text-green-700",
  research: "bg-purple-100 text-purple-700",
};

export default function OpportunitiesPage() {
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [applied, setApplied] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? opportunities : opportunities.filter(o => o.type === filter.toLowerCase());

  return (
    <>
      <Topbar title="Opportunities" subtitle="AI-curated internships, jobs, and research matched to your profile" />
      <main className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Matched Roles", value: 5, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Internships", value: 2, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Full-time Roles", value: 2, color: "text-green-600", bg: "bg-green-50" },
            { label: "Research Positions", value: 1, color: "text-purple-600", bg: "bg-purple-50" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </CardContent></Card>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            {["All", "Internship", "Fulltime", "Research"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {f}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm"><Filter className="w-4 h-4" /> More Filters</Button>
        </div>

        {/* Opportunities list */}
        <div className="space-y-4">
          {filtered.map(opp => (
            <Card key={opp.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900 text-lg">{opp.title}</h3>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[opp.type]}`}>{opp.type}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1"><Building2 className="w-4 h-4" />{opp.company}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{opp.location}</span>
                          <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{opp.stipend}</span>
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{opp.duration}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-2xl font-bold text-indigo-600">{opp.matchScore}%</p>
                        <p className="text-xs text-slate-400">match</p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 mt-3">{opp.description}</p>

                    <div className="mt-3 bg-indigo-50 rounded-lg px-4 py-2.5 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-indigo-800">{opp.aiReason}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-wrap gap-1.5">
                          {opp.tags.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                        </div>
                        <span className="text-xs text-slate-400">via {opp.postedBy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-red-500 font-medium">Deadline: {opp.deadline}</span>
                        <button onClick={() => setSaved(p => ({ ...p, [opp.id]: !p[opp.id] }))}
                          className={`p-1.5 rounded-lg transition-colors ${saved[opp.id] ? "text-indigo-600 bg-indigo-50" : "text-slate-400 hover:bg-slate-100"}`}>
                          <BookmarkPlus className="w-4 h-4" />
                        </button>
                        {applied[opp.id] ? (
                          <Button size="sm" variant="secondary" disabled>Applied</Button>
                        ) : (
                          <Button size="sm" onClick={() => setApplied(p => ({ ...p, [opp.id]: true }))}>
                            <ExternalLink className="w-3.5 h-3.5" /> Apply Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
