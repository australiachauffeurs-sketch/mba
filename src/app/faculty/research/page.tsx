"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlaskConical, Plus, X, Loader2, Briefcase } from "lucide-react";

interface Opportunity {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

export default function ResearchPage() {
  const [tab, setTab] = useState<"areas" | "ra">("areas");
  const [researchAreas, setResearchAreas] = useState<string[]>([]);
  const [newArea, setNewArea] = useState("");
  const [savingAreas, setSavingAreas] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loadingOpp, setLoadingOpp] = useState(true);
  const [postForm, setPostForm] = useState({ title: "", description: "" });
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data: fp } = await supabase
      .from("faculty_profiles")
      .select("research_areas")
      .eq("id", user.id)
      .single();

    setResearchAreas(fp?.research_areas ?? []);

    const { data: opps } = await supabase
      .from("opportunities")
      .select("id, title, description, created_at")
      .eq("type", "research")
      .order("created_at", { ascending: false });

    setOpportunities(opps ?? []);
    setLoading(false);
    setLoadingOpp(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  function addArea() {
    const trimmed = newArea.trim();
    if (trimmed && !researchAreas.includes(trimmed)) {
      setResearchAreas(prev => [...prev, trimmed]);
    }
    setNewArea("");
  }

  function removeArea(area: string) {
    setResearchAreas(prev => prev.filter(a => a !== area));
  }

  async function saveAreas() {
    setSavingAreas(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("faculty_profiles").update({ research_areas: researchAreas }).eq("id", user.id);
    }
    setSavingAreas(false);
  }

  async function postOpportunity(e: React.FormEvent) {
    e.preventDefault();
    if (!postForm.title.trim()) return;
    setPosting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from("opportunities").insert({
        title: postForm.title,
        description: postForm.description,
        type: "research",
        posted_by: user.id,
      }).select().single();
      if (data) setOpportunities(prev => [data, ...prev]);
    }
    setPostForm({ title: "", description: "" });
    setPosting(false);
  }

  return (
    <>
      <Topbar title="Research" subtitle="Manage your research areas and find research assistants" />
      <main className="flex-1 p-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
          {(["areas", "ra"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              {t === "areas" ? "My Research Areas" : "Looking for RAs"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : tab === "areas" ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Research Areas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {researchAreas.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {researchAreas.map(area => (
                    <span key={area} className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-sm px-3 py-1 rounded-full">
                      {area}
                      <button onClick={() => removeArea(area)} className="hover:text-red-500 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No research areas added yet. Add some below to help students and collaborators find you.</p>
              )}

              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="e.g. Machine Learning, Behavioral Economics..."
                  value={newArea}
                  onChange={e => setNewArea(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addArea())}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <Button variant="outline" onClick={addArea} disabled={!newArea.trim()}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>

              <Button onClick={saveAreas} disabled={savingAreas}>
                {savingAreas ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                Save Research Areas
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Post Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Post a Research Assistant Opportunity</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={postOpportunity} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. RA for AI in Healthcare Research"
                      value={postForm.title}
                      onChange={e => setPostForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={4}
                      placeholder="Describe the research project, required skills, time commitment, and what students will gain..."
                      value={postForm.description}
                      onChange={e => setPostForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                    />
                  </div>
                  <Button type="submit" disabled={posting || !postForm.title.trim()}>
                    {posting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                    Post Opportunity
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Existing Opportunities */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Your Posted Opportunities</h3>
              {loadingOpp ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                </div>
              ) : opportunities.length === 0 ? (
                <Card>
                  <CardContent className="p-10 flex flex-col items-center text-center">
                    <Briefcase className="w-8 h-8 text-slate-300 mb-3" />
                    <p className="text-sm text-slate-500">No RA opportunities posted yet. Use the form above to attract talented students to your research.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {opportunities.map(opp => (
                    <Card key={opp.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{opp.title}</p>
                            {opp.description && (
                              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{opp.description}</p>
                            )}
                            <p className="text-xs text-slate-400 mt-2">
                              Posted {new Date(opp.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full flex-shrink-0">Research</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
