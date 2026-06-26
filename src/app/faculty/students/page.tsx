import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, GraduationCap, Mail } from "lucide-react";

const students = [
  { id: "s1", name: "Priya Sharma", program: "MBA '26", gpa: 3.8, interest: "Fintech, Digital Payments", relevance: 95, coursework: ["Fintech & Innovation", "International Finance"], status: "research-assistant" },
  { id: "s2", name: "Alex Thompson", program: "MBA '26", gpa: 3.7, interest: "Crypto Regulation, Policy", relevance: 88, coursework: ["Fintech & Innovation", "Corporate Law"], status: "enrolled" },
  { id: "s3", name: "Leila Nkosi", program: "MBA '26", gpa: 3.9, interest: "Emerging Market Finance", relevance: 84, coursework: ["International Finance", "Macroeconomics"], status: "enrolled" },
  { id: "s4", name: "Dan Cooper", program: "MBA '25", gpa: 3.6, interest: "Blockchain Infrastructure", relevance: 79, coursework: ["Blockchain & DeFi"], status: "thesis" },
];

const statusMap: Record<string, { label: string; color: string }> = {
  "research-assistant": { label: "Research Assistant", color: "bg-green-100 text-green-700" },
  enrolled: { label: "Enrolled in Your Course", color: "bg-blue-100 text-blue-700" },
  thesis: { label: "Thesis Advisee", color: "bg-purple-100 text-purple-700" },
};

export default function FacultyStudentsPage() {
  return (
    <>
      <Topbar title="Students" subtitle="Students in your courses and research program" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Students in Courses", value: 94 },
            { label: "Research Assistants", value: 1 },
            { label: "Thesis Advisees", value: 3 },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-5 text-center">
              <p className="text-3xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </CardContent></Card>
          ))}
        </div>

        <h2 className="font-semibold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-green-500" /> Students Most Aligned with Your Research
        </h2>

        <div className="grid grid-cols-2 gap-5">
          {students.map(s => (
            <Card key={s.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Avatar name={s.name} size="lg" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{s.name}</p>
                        <p className="text-sm text-slate-500">{s.program} · GPA {s.gpa}</p>
                      </div>
                      <span className="text-lg font-bold text-green-600">{s.relevance}%</span>
                    </div>
                    <Progress value={s.relevance} className="mt-2" barClassName="bg-green-500" />
                    <p className="text-xs text-slate-500 mt-2"><span className="font-medium">Interests:</span> {s.interest}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {s.coursework.map(c => <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>)}
                      <Badge className={statusMap[s.status]?.color + " text-xs"}>{statusMap[s.status]?.label}</Badge>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700"><GraduationCap className="w-3.5 h-3.5" /> Advise</Button>
                      <Button size="sm" variant="outline" className="text-xs"><Mail className="w-3.5 h-3.5" /> Email</Button>
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
