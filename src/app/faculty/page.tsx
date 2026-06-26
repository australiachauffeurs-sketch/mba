import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, FlaskConical, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function FacultyDashboard() {
  return (
    <>
      <Topbar title="Faculty Dashboard" subtitle="Connect with students, alumni, and fellow researchers" />
      <main className="flex-1 p-6 space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-lg">Welcome to UniConnect AI</p>
              <p className="text-white/80 text-sm mt-1">
                Post research opportunities, mentor students, and find collaboration partners across the network.
              </p>
              <div className="mt-4 flex gap-3">
                <Link href="/faculty/research" className="text-sm bg-white/20 hover:bg-white/30 transition px-4 py-2 rounded-lg font-medium">My Research</Link>
                <Link href="/faculty/students" className="text-sm bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-lg">Browse Students</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Students Mentored", value: "0", icon: Users, color: "text-green-600" },
            { label: "Research Papers", value: "0", icon: BookOpen, color: "text-indigo-600" },
            { label: "Active Projects", value: "0", icon: FlaskConical, color: "text-teal-600" },
            { label: "Collaborations", value: "0", icon: Users, color: "text-purple-600" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center"><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div><p className="text-2xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {[
            { title: "Student Requests", href: "/faculty/students", icon: Users, desc: "No student requests yet. Students interested in your research will reach out here." },
            { title: "Research Collaborations", href: "/faculty/collaborations", icon: FlaskConical, desc: "No collaboration requests yet. AI will suggest matches based on your research areas." },
          ].map(item => (
            <Card key={item.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-green-500" />{item.title}
                  </h3>
                  <Link href={item.href} className="text-xs text-green-600 hover:underline flex items-center gap-1">View <ArrowRight className="w-3 h-3" /></Link>
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
