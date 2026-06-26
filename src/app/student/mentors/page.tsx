"use client";
import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockAlumni, mockFaculty } from "@/lib/mock-data";
import { Sparkles, Star, Calendar, MessageSquare, BookOpen, CheckCircle } from "lucide-react";

const mentors = [
  { ...mockAlumni[0], matchScore: 96, sessions: 0, status: "available", tags: ["Fintech", "Fundraising", "Go-to-Market"], nextSlot: "Jul 5, 2:00 PM" },
  { ...mockAlumni[1], matchScore: 82, sessions: 1, status: "available", tags: ["Product Management", "B2B SaaS", "OKRs"], nextSlot: "Jul 7, 4:00 PM" },
  { ...mockAlumni[2], matchScore: 74, sessions: 0, status: "busy", tags: ["Digital Health", "AI/ML", "Fundraising"], nextSlot: "Jul 12, 3:00 PM" },
  { ...mockFaculty[0], matchScore: 88, sessions: 2, status: "available", tags: ["Digital Payments", "Research", "Fintech"], nextSlot: "Jul 4, 10:00 AM" },
];

const myMentors = mentors.slice(0, 2);

export default function MentorsPage() {
  const [tab, setTab] = useState<"discover" | "my">("discover");
  const [requested, setRequested] = useState<Record<string, boolean>>({});

  return (
    <>
      <Topbar title="Mentors" subtitle="AI-matched mentors based on your career goals" />
      <main className="flex-1 p-6 space-y-6">
        {/* Header stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="p-5 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center"><BookOpen className="w-5 h-5 text-indigo-600" /></div>
            <div><p className="text-2xl font-bold text-slate-900">2</p><p className="text-xs text-slate-500">Active Mentors</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-5 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center"><CheckCircle className="w-5 h-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold text-slate-900">3</p><p className="text-xs text-slate-500">Sessions Completed</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-5 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center"><Star className="w-5 h-5 text-amber-500" /></div>
            <div><p className="text-2xl font-bold text-slate-900">4.9</p><p className="text-xs text-slate-500">Avg. Rating</p></div>
          </CardContent></Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
          {(["discover", "my"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              {t === "discover" ? "Discover Mentors" : "My Mentors"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-5">
          {(tab === "discover" ? mentors : myMentors).map(mentor => (
            <Card key={mentor.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Avatar name={mentor.full_name} size="lg" />
                    {mentor.status === "available" && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{mentor.full_name}</p>
                        <p className="text-sm text-slate-500 truncate">{mentor.headline}</p>
                      </div>
                      <span className="text-sm font-bold text-indigo-600 flex-shrink-0">{mentor.matchScore}%</span>
                    </div>

                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500 flex items-center gap-1"><Sparkles className="w-3 h-3 text-indigo-400" /> AI Match</span>
                      </div>
                      <Progress value={mentor.matchScore} />
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {mentor.tags.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                    </div>

                    {mentor.sessions > 0 && (
                      <p className="text-xs text-slate-400 mt-2">{mentor.sessions} session{mentor.sessions > 1 ? "s" : ""} completed</p>
                    )}

                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Next available: <span className="font-medium text-slate-700">{mentor.nextSlot}</span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      {requested[mentor.id] ? (
                        <Button size="sm" variant="secondary" disabled><CheckCircle className="w-3.5 h-3.5" /> Requested</Button>
                      ) : (
                        <Button size="sm" onClick={() => setRequested(p => ({ ...p, [mentor.id]: true }))}>
                          <Calendar className="w-3.5 h-3.5" /> Book Session
                        </Button>
                      )}
                      <Button size="sm" variant="outline"><MessageSquare className="w-3.5 h-3.5" /> Message</Button>
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
