import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Target, Route, TrendingUp } from "lucide-react";

export default function CareerGPSPage() {
  return (
    <>
      <Topbar title="Career GPS" subtitle="Your personalized AI-powered degree navigator" />
      <main className="flex-1 p-6 space-y-6">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">Your Career GPS is setting up</h2>
              <p className="opacity-80 text-sm leading-relaxed max-w-2xl">
                Complete your profile with your career goals and interests so AI can map your personalized MBA roadmap — mentors, courses, investors, and milestones optimized for you.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Route className="w-4 h-4 text-indigo-500" />
              Your Roadmap
            </h2>
            <Card>
              <CardContent className="p-12 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                  <Sparkles className="w-7 h-7 text-indigo-400" />
                </div>
                <p className="font-medium text-slate-800">Roadmap not generated yet</p>
                <p className="text-sm text-slate-500 mt-2 max-w-xs">
                  Tell us your career goal — founder, consultant, investor — and AI will build a step-by-step 12-month plan tailored to you.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-500" />
                  Skill Gap Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <p className="text-sm text-slate-500">Set your career goal to see skill gaps</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
