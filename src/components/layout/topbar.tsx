"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Bell, X, User, Briefcase, Rocket } from "lucide-react";
import Link from "next/link";

interface PersonResult {
  id: string;
  full_name: string;
  role: string;
  alumni_profiles?: { company?: string; job_title?: string } | null;
  faculty_profiles?: { department?: string } | null;
  student_profiles?: { program?: string } | null;
  investor_profiles?: { firm_name?: string } | null;
}

interface OppResult { id: string; title: string; company?: string; type: string; }
interface StartupResult { id: string; name: string; tagline?: string; sector?: string; }

interface SearchResults {
  people: PersonResult[];
  opportunities: OppResult[];
  startups: StartupResult[];
}

interface TopbarProps { title: string; subtitle?: string; }

export function Topbar({ title, subtitle }: TopbarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setResults(null); setOpen(false); return; }
    setSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data: SearchResults = await res.json();
        setResults(data);
        setOpen(true);
      }
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSearch(query), 300);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query, doSearch]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function personSubtitle(p: PersonResult) {
    if (p.alumni_profiles) return [p.alumni_profiles.job_title, p.alumni_profiles.company].filter(Boolean).join(" @ ") || "Alumni";
    if (p.faculty_profiles) return p.faculty_profiles.department || "Faculty";
    if (p.student_profiles) return p.student_profiles.program || "Student";
    if (p.investor_profiles) return p.investor_profiles.firm_name || "Investor";
    return p.role;
  }

  function personHref(p: PersonResult) {
    const roleMap: Record<string, string> = { student: "/student/network", alumni: "/student/network", faculty: "/student/network", investor: "/student/network" };
    return roleMap[p.role] || "/student/network";
  }

  const hasResults = results && (results.people.length + results.opportunities.length + results.startups.length) > 0;

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative" ref={wrapperRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => { if (results) setOpen(true); }}
            placeholder="Search people, companies..."
            className="pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 bg-slate-50"
          />
          {query && (
            <button onClick={() => { setQuery(""); setResults(null); setOpen(false); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3 h-3" />
            </button>
          )}

          {open && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-lg z-50 max-h-80 overflow-y-auto">
              {searching && <p className="text-xs text-slate-400 px-4 py-3">Searching…</p>}
              {!searching && !hasResults && query.length >= 2 && (
                <p className="text-xs text-slate-400 px-4 py-3">No results for &quot;{query}&quot;</p>
              )}
              {!searching && hasResults && (
                <>
                  {results!.people.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 px-4 pt-3 pb-1 flex items-center gap-1"><User className="w-3 h-3" />People</p>
                      {results!.people.map(p => (
                        <Link key={p.id} href={personHref(p)} onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                            {p.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{p.full_name}</p>
                            <p className="text-xs text-slate-500 truncate">{personSubtitle(p)}</p>
                          </div>
                          <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded capitalize">{p.role}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                  {results!.opportunities.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 px-4 pt-3 pb-1 flex items-center gap-1"><Briefcase className="w-3 h-3" />Opportunities</p>
                      {results!.opportunities.map(o => (
                        <Link key={o.id} href="/student/opportunities" onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{o.title}</p>
                            <p className="text-xs text-slate-500 truncate">{o.company} · {o.type}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {results!.startups.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 px-4 pt-3 pb-1 flex items-center gap-1"><Rocket className="w-3 h-3" />Startups</p>
                      {results!.startups.map(s => (
                        <Link key={s.id} href="/alumni/startups" onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{s.name}</p>
                            <p className="text-xs text-slate-500 truncate">{s.sector} · {s.tagline}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        <button className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full" />
        </button>
      </div>
    </header>
  );
}
