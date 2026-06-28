"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  role: string;
  url: string;
  year: string;
  ongoing: boolean;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  url: string;
  credential_id: string;
}

const SKILL_OPTIONS = [
  "Python", "Excel", "SQL", "Tableau", "Power BI", "R", "SPSS",
  "Financial Modeling", "Valuation", "M&A", "Private Equity", "Venture Capital",
  "Marketing Strategy", "Digital Marketing", "Brand Management", "SEO/SEM",
  "Operations Management", "Supply Chain", "Six Sigma", "Lean",
  "Leadership", "Project Management", "Agile", "Scrum",
  "Business Development", "Sales", "CRM", "Negotiation",
  "Corporate Finance", "Accounting", "Risk Management",
  "Consulting", "Strategy", "Market Research", "Data Analysis",
];

const CAREER_INTEREST_OPTIONS = [
  "Investment Banking", "Private Equity", "Venture Capital", "Consulting",
  "Product Management", "General Management", "Marketing", "Operations",
  "Finance", "Strategy", "Entrepreneurship", "Social Impact",
  "Healthcare", "Technology", "FMCG", "Real Estate", "Media & Entertainment",
];

const LOOKING_FOR_OPTIONS = [
  "Internship", "Full-time", "Co-founder", "Mentor", "Research", "Networking", "Investor Intro",
];

function newProject(): Project {
  return { id: crypto.randomUUID(), title: "", description: "", tech_stack: [], role: "", url: "", year: "", ongoing: false };
}

function newCert(): Certification {
  return { id: crypto.randomUUID(), name: "", issuer: "", year: "", url: "", credential_id: "" };
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white disabled:bg-slate-50 disabled:text-slate-500 ${className}`}
      {...props}
    />
  );
}

function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white resize-none ${className}`}
      {...props}
    />
  );
}

function Select({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      className={`w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

function ChipSelector({
  options,
  selected,
  onChange,
  allowCustom = false,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  allowCustom?: boolean;
}) {
  const [custom, setCustom] = useState("");

  function toggle(opt: string) {
    onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);
  }

  function addCustom() {
    const v = custom.trim();
    if (v && !selected.includes(v)) {
      onChange([...selected, v]);
    }
    setCustom("");
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              selected.includes(opt)
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-400"
            }`}
          >
            {opt}
          </button>
        ))}
        {selected.filter(s => !options.includes(s)).map(s => (
          <button
            key={s}
            type="button"
            onClick={() => toggle(s)}
            className="px-3 py-1 text-xs rounded-full border bg-indigo-600 text-white border-indigo-600"
          >
            {s}
          </button>
        ))}
      </div>
      {allowCustom && (
        <div className="flex gap-2 mt-2">
          <Input
            value={custom}
            onChange={e => setCustom(e.target.value)}
            placeholder="Add custom…"
            className="flex-1"
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
          />
          <button
            type="button"
            onClick={addCustom}
            className="px-3 py-1 text-sm bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 border border-indigo-200"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <CardTitle className="flex items-center gap-2 text-base">{children}</CardTitle>;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      {children}
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

export default function StudentProfilePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // profiles fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  // student_profiles fields
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [program, setProgram] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [expectedGraduation, setExpectedGraduation] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [gpa, setGpa] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [workExperienceYears, setWorkExperienceYears] = useState("");
  const [previousCompany, setPreviousCompany] = useState("");
  const [previousRole, setPreviousRole] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [openToMentor, setOpenToMentor] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [careerInterests, setCareerInterests] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [achievements, setAchievements] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);

  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);
      setEmail(user.email ?? "");

      const [profileRes, spRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("student_profiles").select("*").eq("profile_id", user.id).single(),
      ]);

      if (profileRes.data) {
        const p = profileRes.data;
        setFullName(p.full_name ?? "");
        setBio(p.bio ?? "");
        setPhone(p.phone ?? "");
        setDateOfBirth(p.date_of_birth ?? "");
        setGender(p.gender ?? "");
        setNationality(p.nationality ?? "");
        setLinkedinUrl(p.linkedin_url ?? "");
      }

      if (spRes.data) {
        const s = spRes.data;
        setHeadline(s.headline ?? "");
        setLocation(s.location ?? "");
        setProgram(s.program ?? "");
        setSpecialization(s.specialization ?? "");
        setBatchYear(s.batch_year?.toString() ?? "");
        setExpectedGraduation(s.expected_graduation ?? "");
        setRollNumber(s.roll_number ?? "");
        setGpa(s.gpa?.toString() ?? "");
        setUniversityId(s.university_id ?? "");
        setBatchNumber(s.batch_number ?? "");
        setWorkExperienceYears(s.work_experience_years?.toString() ?? "");
        setPreviousCompany(s.previous_company ?? "");
        setPreviousRole(s.previous_role ?? "");
        setWorkExperience(s.work_experience ?? "");
        setGithubUrl(s.github_url ?? "");
        setPortfolioUrl(s.portfolio_url ?? "");
        setOpenToMentor(s.open_to_mentor ?? false);
        setSkills(s.skills ?? []);
        setCareerInterests(s.career_interests ?? []);
        setLookingFor(s.looking_for ? (Array.isArray(s.looking_for) ? s.looking_for : [s.looking_for]) : []);
        setAchievements((s.achievements ?? []).join("\n"));
        setProjects(
          (s.projects ?? []).map((p: Project & { id?: string }) => ({
            ...p,
            id: p.id ?? crypto.randomUUID(),
          }))
        );
        setCertifications(
          (s.certifications ?? []).map((c: Certification & { id?: string }) => ({
            ...c,
            id: c.id ?? crypto.randomUUID(),
          }))
        );
      }

      setLoading(false);
    }
    load();
  }, []);

  function computeCompletion() {
    const fields = [
      fullName, bio, phone, dateOfBirth, gender, nationality, linkedinUrl,
      headline, location, program, specialization, batchYear, expectedGraduation,
      rollNumber, gpa, workExperienceYears, previousCompany, previousRole, workExperience,
      githubUrl, portfolioUrl,
    ];
    const arrays = [skills, careerInterests, lookingFor];
    const lists = [projects, certifications];
    let filled = 0;
    const total = fields.length + arrays.length + lists.length + 1;
    fields.forEach(f => { if (f && f.trim()) filled++; });
    arrays.forEach(a => { if (a.length > 0) filled++; });
    lists.forEach(l => { if (l.length > 0) filled++; });
    if (achievements.trim()) filled++;
    return Math.round((filled / total) * 100);
  }

  async function handleSave() {
    if (!userId) return;
    setSaving(true);
    try {
      const achievementsArr = achievements.split("\n").map(s => s.trim()).filter(Boolean);

      const [r1, r2] = await Promise.all([
        supabase.from("profiles").upsert({
          id: userId,
          full_name: fullName,
          email,
          bio,
          phone,
          date_of_birth: dateOfBirth || null,
          gender,
          nationality,
          linkedin_url: linkedinUrl,
        }),
        supabase.from("student_profiles").upsert({
          profile_id: userId,
          headline,
          location,
          program,
          specialization,
          batch_year: batchYear ? parseInt(batchYear) : null,
          expected_graduation: expectedGraduation,
          roll_number: rollNumber,
          gpa: gpa ? parseFloat(gpa) : null,
          university_id: universityId,
          batch_number: batchNumber,
          work_experience_years: workExperienceYears ? parseInt(workExperienceYears) : null,
          previous_company: previousCompany,
          previous_role: previousRole,
          work_experience: workExperience,
          github_url: githubUrl,
          portfolio_url: portfolioUrl,
          linkedin_url: linkedinUrl,
          open_to_mentor: openToMentor,
          skills,
          career_interests: careerInterests,
          looking_for: lookingFor,
          achievements: achievementsArr,
          projects,
          certifications,
        }),
      ]);

      if (r1.error) throw r1.error;
      if (r2.error) throw r2.error;
      showToast("success", "Profile saved successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save profile.";
      showToast("error", message);
    } finally {
      setSaving(false);
    }
  }

  const completion = computeCompletion();
  const initials = fullName
    ? fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  function updateProject(id: string, patch: Partial<Project>) {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));
  }

  function removeProject(id: string) {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (editingProjectId === id) setEditingProjectId(null);
  }

  function updateCert(id: string, patch: Partial<Certification>) {
    setCertifications(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  }

  function removeCert(id: string) {
    setCertifications(prev => prev.filter(c => c.id !== id));
    if (editingCertId === id) setEditingCertId(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Topbar title="My Profile" subtitle="Manage your personal and academic information" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Topbar title="My Profile" subtitle="Manage your personal and academic information" />

      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
          toast.type === "success"
            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full px-6 py-6 space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-indigo-600 text-white text-2xl font-bold flex items-center justify-center flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{fullName || "Your Name"}</h2>
                  {headline && <p className="text-sm text-slate-500 mt-0.5">{headline}</p>}
                </div>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? "Saving…" : "Save Profile"}
                </Button>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Profile completion</span>
                  <span className="font-medium text-indigo-600">{completion}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <Card>
              <CardHeader className="pb-4">
                <SectionTitle>Personal Information</SectionTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Grid2>
                  <Field label="Full Name" required>
                    <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Jane Doe" />
                  </Field>
                  <Field label="Email">
                    <Input value={email} disabled placeholder="jane@example.com" />
                  </Field>
                </Grid2>
                <Grid2>
                  <Field label="Phone">
                    <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" />
                  </Field>
                  <Field label="Date of Birth">
                    <Input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} />
                  </Field>
                </Grid2>
                <Grid2>
                  <Field label="Gender">
                    <Select value={gender} onChange={e => setGender(e.target.value)}>
                      <option value="">Select…</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Non-binary</option>
                      <option>Prefer not to say</option>
                    </Select>
                  </Field>
                  <Field label="Nationality">
                    <Input value={nationality} onChange={e => setNationality(e.target.value)} placeholder="Indian" />
                  </Field>
                </Grid2>
                <Field label="Location">
                  <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Mumbai, India" />
                </Field>
                <Field label="Bio">
                  <Textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="A short introduction about yourself…" />
                </Field>
              </CardContent>
            </Card>

            {/* Academic Details */}
            <Card>
              <CardHeader className="pb-4">
                <SectionTitle>Academic Details</SectionTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Grid2>
                  <Field label="Program">
                    <Select value={program} onChange={e => setProgram(e.target.value)}>
                      <option value="">Select…</option>
                      <option>MBA</option>
                      <option>PGDM</option>
                      <option>Executive MBA</option>
                    </Select>
                  </Field>
                  <Field label="Specialization">
                    <Input value={specialization} onChange={e => setSpecialization(e.target.value)} placeholder="Finance & Strategy" />
                  </Field>
                </Grid2>
                <Grid2>
                  <Field label="Batch Year">
                    <Input type="number" value={batchYear} onChange={e => setBatchYear(e.target.value)} placeholder="2023" min={2000} max={2100} />
                  </Field>
                  <Field label="Expected Graduation">
                    <Input value={expectedGraduation} onChange={e => setExpectedGraduation(e.target.value)} placeholder="2025" />
                  </Field>
                </Grid2>
                <Grid2>
                  <Field label="Roll Number">
                    <Input value={rollNumber} onChange={e => setRollNumber(e.target.value)} placeholder="MBA2023001" />
                  </Field>
                  <Field label="GPA (0–10)">
                    <Input type="number" value={gpa} onChange={e => setGpa(e.target.value)} placeholder="8.5" min={0} max={10} step={0.01} />
                  </Field>
                </Grid2>
                <Grid2>
                  <Field label="University ID">
                    <Input value={universityId} onChange={e => setUniversityId(e.target.value)} placeholder="UID-2023-001" />
                  </Field>
                  <Field label="Batch Number">
                    <Input value={batchNumber} onChange={e => setBatchNumber(e.target.value)} placeholder="Batch 42" />
                  </Field>
                </Grid2>
              </CardContent>
            </Card>

            {/* Professional Background */}
            <Card>
              <CardHeader className="pb-4">
                <SectionTitle>Professional Background</SectionTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="Headline">
                  <Input value={headline} onChange={e => setHeadline(e.target.value)} placeholder="MBA Candidate | Ex-Google | Aspiring VC" />
                </Field>
                <Grid2>
                  <Field label="Years of Work Experience">
                    <Input type="number" value={workExperienceYears} onChange={e => setWorkExperienceYears(e.target.value)} placeholder="3" min={0} />
                  </Field>
                  <Field label="Previous Company">
                    <Input value={previousCompany} onChange={e => setPreviousCompany(e.target.value)} placeholder="Google" />
                  </Field>
                </Grid2>
                <Field label="Previous Role">
                  <Input value={previousRole} onChange={e => setPreviousRole(e.target.value)} placeholder="Senior Software Engineer" />
                </Field>
                <Field label="Work Experience Summary">
                  <Textarea value={workExperience} onChange={e => setWorkExperience(e.target.value)} rows={4} placeholder="Describe your professional background, key responsibilities, and accomplishments…" />
                </Field>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="open-mentor"
                    checked={openToMentor}
                    onChange={e => setOpenToMentor(e.target.checked)}
                    className="w-4 h-4 accent-indigo-600"
                  />
                  <label htmlFor="open-mentor" className="text-sm text-slate-700">Open to mentoring junior students</label>
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <SectionTitle>Projects</SectionTitle>
                  <button
                    type="button"
                    onClick={() => {
                      const p = newProject();
                      setProjects(prev => [...prev, p]);
                      setEditingProjectId(p.id);
                    }}
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <Plus className="w-4 h-4" /> Add Project
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {projects.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">No projects added yet. Click &quot;Add Project&quot; to get started.</p>
                )}
                {projects.map(proj => (
                  <div key={proj.id} className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50">
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{proj.title || "Untitled Project"}</p>
                        {proj.ongoing
                          ? <span className="text-xs text-emerald-600 font-medium">Ongoing</span>
                          : proj.year && <span className="text-xs text-slate-500">{proj.year}</span>
                        }
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingProjectId(editingProjectId === proj.id ? null : proj.id)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50"
                        >
                          {editingProjectId === proj.id ? "Collapse" : "Edit"}
                        </button>
                        <button type="button" onClick={() => removeProject(proj.id)} className="text-slate-400 hover:text-red-500 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {editingProjectId === proj.id && (
                      <div className="p-4 space-y-3">
                        <Grid2>
                          <Field label="Title" required>
                            <Input value={proj.title} onChange={e => updateProject(proj.id, { title: e.target.value })} placeholder="Project title" />
                          </Field>
                          <Field label="Role">
                            <Input value={proj.role} onChange={e => updateProject(proj.id, { role: e.target.value })} placeholder="Lead Developer" />
                          </Field>
                        </Grid2>
                        <Field label="Description">
                          <Textarea value={proj.description} onChange={e => updateProject(proj.id, { description: e.target.value })} rows={2} placeholder="What did you build and why?" />
                        </Field>
                        <Grid2>
                          <Field label="Tech Stack (comma-separated)">
                            <Input
                              value={proj.tech_stack.join(", ")}
                              onChange={e => updateProject(proj.id, { tech_stack: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                              placeholder="React, Node.js, PostgreSQL"
                            />
                          </Field>
                          <Field label="Year">
                            <Input value={proj.year} onChange={e => updateProject(proj.id, { year: e.target.value })} placeholder="2024" />
                          </Field>
                        </Grid2>
                        <div className="flex items-end gap-4">
                          <div className="flex-1">
                            <Field label="URL">
                              <div className="flex items-center gap-2">
                                <Input value={proj.url} onChange={e => updateProject(proj.id, { url: e.target.value })} placeholder="https://github.com/…" />
                                {proj.url && (
                                  <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 flex-shrink-0">
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
                            </Field>
                          </div>
                          <div className="flex items-center gap-2 pb-2">
                            <input
                              type="checkbox"
                              id={`ongoing-${proj.id}`}
                              checked={proj.ongoing}
                              onChange={e => updateProject(proj.id, { ongoing: e.target.checked })}
                              className="w-4 h-4 accent-indigo-600"
                            />
                            <label htmlFor={`ongoing-${proj.id}`} className="text-sm text-slate-700 whitespace-nowrap">Ongoing</label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <SectionTitle>Certifications</SectionTitle>
                  <button
                    type="button"
                    onClick={() => {
                      const c = newCert();
                      setCertifications(prev => [...prev, c]);
                      setEditingCertId(c.id);
                    }}
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <Plus className="w-4 h-4" /> Add Certification
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {certifications.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">No certifications added yet.</p>
                )}
                {certifications.map(cert => (
                  <div key={cert.id} className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50">
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{cert.name || "Untitled Certification"}</p>
                        {cert.issuer && (
                          <p className="text-xs text-slate-500">{cert.issuer}{cert.year ? ` · ${cert.year}` : ""}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingCertId(editingCertId === cert.id ? null : cert.id)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50"
                        >
                          {editingCertId === cert.id ? "Collapse" : "Edit"}
                        </button>
                        <button type="button" onClick={() => removeCert(cert.id)} className="text-slate-400 hover:text-red-500 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {editingCertId === cert.id && (
                      <div className="p-4 space-y-3">
                        <Grid2>
                          <Field label="Certification Name" required>
                            <Input value={cert.name} onChange={e => updateCert(cert.id, { name: e.target.value })} placeholder="AWS Solutions Architect" />
                          </Field>
                          <Field label="Issuing Organization">
                            <Input value={cert.issuer} onChange={e => updateCert(cert.id, { issuer: e.target.value })} placeholder="Amazon Web Services" />
                          </Field>
                        </Grid2>
                        <Grid2>
                          <Field label="Year">
                            <Input value={cert.year} onChange={e => updateCert(cert.id, { year: e.target.value })} placeholder="2024" />
                          </Field>
                          <Field label="Credential ID">
                            <Input value={cert.credential_id} onChange={e => updateCert(cert.id, { credential_id: e.target.value })} placeholder="ABC-123456" />
                          </Field>
                        </Grid2>
                        <Field label="Certificate URL">
                          <div className="flex items-center gap-2">
                            <Input value={cert.url} onChange={e => updateCert(cert.id, { url: e.target.value })} placeholder="https://…" />
                            {cert.url && (
                              <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 flex-shrink-0">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </Field>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <SectionTitle>Skills</SectionTitle>
              </CardHeader>
              <CardContent>
                <ChipSelector options={SKILL_OPTIONS} selected={skills} onChange={setSkills} allowCustom />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <SectionTitle>Career Interests</SectionTitle>
              </CardHeader>
              <CardContent>
                <ChipSelector options={CAREER_INTEREST_OPTIONS} selected={careerInterests} onChange={setCareerInterests} allowCustom />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <SectionTitle>Looking For</SectionTitle>
              </CardHeader>
              <CardContent>
                <ChipSelector options={LOOKING_FOR_OPTIONS} selected={lookingFor} onChange={setLookingFor} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <SectionTitle>Achievements</SectionTitle>
              </CardHeader>
              <CardContent>
                <Label>One achievement per line</Label>
                <Textarea
                  value={achievements}
                  onChange={e => setAchievements(e.target.value)}
                  rows={6}
                  placeholder={"Dean's List — 2023\nCase Competition Winner — IIM Ahmedabad\nForbes 30 Under 30 Nominee"}
                />
                <p className="text-xs text-slate-400 mt-1">
                  {achievements.split("\n").filter(s => s.trim()).length} achievement(s)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <SectionTitle>Social & Portfolio Links</SectionTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="LinkedIn URL">
                  <div className="flex items-center gap-2">
                    <Input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/…" />
                    {linkedinUrl && (
                      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 flex-shrink-0">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </Field>
                <Field label="GitHub URL">
                  <div className="flex items-center gap-2">
                    <Input value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/…" />
                    {githubUrl && (
                      <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 flex-shrink-0">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </Field>
                <Field label="Portfolio URL">
                  <div className="flex items-center gap-2">
                    <Input value={portfolioUrl} onChange={e => setPortfolioUrl(e.target.value)} placeholder="https://yoursite.com" />
                    {portfolioUrl && (
                      <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 flex-shrink-0">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </Field>
              </CardContent>
            </Card>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Saving…" : "Save All Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
