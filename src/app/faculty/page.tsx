import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { MetricCard } from "@/components/analytics/metric-card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, BookOpen, Users, Lightbulb, FlaskConical } from "lucide-react";

const studentMatches = [
  {
    name: "Priya Sharma",
    interest: "Digital payments in emerging markets",
    matchScore: 95,
    skills: ["Financial Modeling", "Market Research"],
    reason: "Priya's startup idea in fintech payments directly overlaps with your current research on CBDCs in Southeast Asia.",
  },
  {
    name: "Alex Thompson",
    interest: "Cryptocurrency regulation and policy",
    matchScore: 88,
    skills: ["Policy Analysis", "Data Science"],
    reason: "Strong academic background in economics with crypto policy focus — could contribute to your regulation paper.",
  },
];

const researchProjects = [
  { title: "CBDC Adoption in Emerging Markets", status: "Active", studentsNeeded: 2, fundingStatus: "Funded ($85K)" },
  { title: "Blockchain for Cross-Border Payments", status: "Proposed", studentsNeeded: 1, fundingStatus: "Seeking funding" },
];

export default function FacultyDashboard() {
  return (
    <>
      <Topbar title="Faculty Dashboard" subtitle="Research collaborations and student connections" />
      <main className="flex-1 p-6 space-y-6">
        {/* AI Summary */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">AI Research Intelligence</p>
              <p className="text-sm opacity-90 leading-relaxed">
                <strong>4 students</strong> have research interests that overlap with your digital payments work. <strong>2 alumni</strong> are building companies in your area and could co-author or co-present findings.
              </p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <MetricCard label="Student Collaborators" value={8} icon={Users} />
          <MetricCard label="Active Research Projects" value={2} icon={FlaskConical} iconColor="text-green-600" />
          <MetricCard label="Citations This Year" value={34} change={18} changeType="increase" icon={BookOpen} />
          <MetricCard label="Industry Connections" value={12} icon={Lightbulb} iconColor="text-teal-600" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Student Matches */}
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-green-600" />
              Students Matched to Your Research
            </h2>
            {studentMatches.map((s) => (
              <Card key={s.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Avatar name={s.name} size="md" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium text-slate-900">{s.name}</p>
                        <span className="text-sm font-bold text-green-600">{s.matchScore}%</span>
                      </div>
                      <p className="text-xs text-slate-500">Interest: {s.interest}</p>
                      <Progress value={s.matchScore} className="mt-2" barClassName="bg-green-500" />
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {s.skills.map((sk) => <Badge key={sk} variant="secondary">{sk}</Badge>)}
                      </div>
                      <p className="text-xs text-green-800 bg-green-50 rounded-lg p-2 mt-2">{s.reason}</p>
                      <div className="flex gap-2 mt-3">
                        <button className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700">Invite to Research</button>
                        <button className="text-xs border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-50">View Profile</button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Research Projects */}
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-green-600" />
              Research Projects
            </h2>
            {researchProjects.map((p) => (
              <Card key={p.title}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{p.title}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className={p.status === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}>
                          {p.status}
                        </Badge>
                        <span className="text-xs text-slate-500">Needs {p.studentsNeeded} student{p.studentsNeeded > 1 ? "s" : ""}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{p.fundingStatus}</p>
                    </div>
                    <button className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 whitespace-nowrap">
                      Find Students
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your Research Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["Digital Payments", "Financial Inclusion", "Cryptocurrency", "Central Bank Digital Currencies", "Cross-border Finance", "Emerging Markets"].map((area) => (
                    <Badge key={area}>{area}</Badge>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-4">
                  AI uses these to match you with students, alumni founders, and industry collaborators in real time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
