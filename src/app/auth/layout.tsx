import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.3),transparent_60%)]" />
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-lg leading-none">UniConnect AI</p>
            <p className="text-indigo-300 text-xs mt-0.5">AI Operating System for Universities</p>
          </div>
        </Link>

        <div className="space-y-8 relative z-10">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Your academic network,<br />supercharged by AI.
            </h1>
            <p className="text-indigo-200 mt-4 text-lg leading-relaxed">
              Connect with alumni, faculty, investors, and peers through intelligent semantic matching — not cold outreach.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { stat: "2,000+", label: "Verified members across 5 roles" },
              { stat: "6,200+", label: "AI-facilitated connections" },
              { stat: "94%", label: "Match acceptance rate" },
              { stat: "511", label: "Outcomes: jobs, research, funding" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-4">
                <p className="text-2xl font-bold text-indigo-300 w-20 flex-shrink-0">{s.stat}</p>
                <p className="text-indigo-100 text-sm">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
            <p className="text-white text-sm italic leading-relaxed">
              "UniConnect AI introduced me to three investors in my exact thesis area within a week of joining. That network took my co-founder two years to build manually."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center text-white text-xs font-bold">PS</div>
              <div>
                <p className="text-white text-sm font-medium">Priya Sharma</p>
                <p className="text-indigo-300 text-xs">MBA '26 · Founder, PayFlow Africa</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-indigo-400 text-xs relative z-10">
          © 2026 UniConnect AI · Trusted by 50+ institutions worldwide
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
