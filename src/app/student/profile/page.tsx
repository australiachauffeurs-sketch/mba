"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";
import {
  User, GraduationCap, Briefcase, Heart, Save, CheckCircle,
  Loader2, AlertCircle, Link2, Code2,
} from "lucide-react";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SKILL_OPTIONS = ["Finance", "Strategy", "Marketing", "Product Management", "Data Analytics", "Operations", "Consulting", "Entrepreneurship", "Venture Capital", "Private Equity", "Investment Banking", "Supply Chain", "HR", "Tech / Engineering", "Healthcare", "Real Estate"];
const INTEREST_OPTIONS = ["Full-time Job", "Internship", "Co-founder", "Mentor", "Research Collaboration", "Investor Introduction", "Networking", "Advisory Role"];
const CAREER_OPTIONS = ["Consulting", "Investment Banking", "Venture Capital", "Private Equity", "Corporate Strategy", "Startup / Founder", "Tech Product Manager", "Marketing / Brand", "Operations", "Healthcare", "Real Estate", "Non-profit / Social Impact"];

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-slate-800">
          <Icon className="w-4 h-4 text-indigo-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400";

function ChipSelector({ options, selected, onChange, color = "indigo" }: {
  options: string[]; selected: string[]; onChange: (v: string[]) => void; color?: string;
}) {
  const toggle = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => toggle(opt)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            selected.includes(opt)
              ? `bg-${color}-600 text-white border-${color}-600`
              : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
          }`}
          style={selected.includes(opt) ? { backgroundColor: "#4f46e5", borderColor: "#4f46e5", color: "#fff" } : {}}>
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");

  // Personal
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");

  // Academic
  const [rollNumber, setRollNumber] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [program, setProgram] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [gpa, setGpa] = useState("");
  const [expectedGraduation, setExpectedGraduation] = useState("");
  const [universityId, setUniversityId] = useState("");

  // Professional
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [workExperienceYears, setWorkExperienceYears] = useState("");
  const [previousCompany, setPreviousCompany] = useState("");
  const [previousRole, setPreviousRole] = useState("");

  // Interests
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [careerInterests, setCareerInterests] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [openToMentor, setOpenToMentor] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (p) {
        setFullName(p.full_name || "");
        setPhone(p.phone || "");
        setDateOfBirth(p.date_of_birth || "");
        setGender(p.gender || "");
        setNationality(p.nationality || "");
        setLinkedinUrl(p.linkedin_url || "");
        setBio(p.bio || "");
      }

      const { data: sp } = await supabase.from("student_profiles").select("*").eq("id", user.id).single();
      if (sp) {
        setRollNumber(sp.roll_number || "");
        setBatchNumber(sp.batch_number || "");
        setBatchYear(sp.batch_year?.toString() || "");
        setProgram(sp.program || "");
        setSpecialization(sp.specialization || "");
        setGpa(sp.gpa?.toString() || "");
        setExpectedGraduation(sp.expected_graduation || "");
        setUniversityId(sp.university_id || "");
        setGithubUrl(sp.github_url || "");
        setWorkExperienceYears(sp.work_experience_years?.toString() || "");
        setPreviousCompany(sp.previous_company || "");
        setPreviousRole(sp.previous_role || "");
        setSkills(sp.skills || []);
        setCareerInterests(sp.career_interests || []);
        setLookingFor(sp.looking_for || []);
        setOpenToMentor(sp.open_to_mentor || false);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);

    const { error: e1 } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: fullName,
      phone,
      date_of_birth: dateOfBirth || null,
      gender,
      nationality,
      linkedin_url: linkedinUrl,
      bio,
      is_profile_complete: true,
      updated_at: new Date().toISOString(),
    });

    const { error: e2 } = await supabase.from("student_profiles").upsert({
      id: userId,
      roll_number: rollNumber,
      batch_number: batchNumber,
      batch_year: batchYear ? parseInt(batchYear) : null,
      program,
      specialization,
      gpa: gpa ? parseFloat(gpa) : null,
      expected_graduation: expectedGraduation,
      university_id: universityId,
      github_url: githubUrl,
      work_experience_years: workExperienceYears ? parseInt(workExperienceYears) : null,
      previous_company: previousCompany,
      previous_role: previousRole,
      skills,
      career_interests: careerInterests,
      looking_for: lookingFor,
      open_to_mentor: openToMentor,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);
    if (e1 || e2) {
      setError(e1?.message || e2?.message || "Failed to save. Please try again.");
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  // Profile completion
  const fields = [fullName, phone, dateOfBirth, gender, nationality, rollNumber, batchYear, program, gpa, linkedinUrl, bio];
  const filled = fields.filter(Boolean).length;
  const completion = Math.round((filled / fields.length) * 100);

  if (loading) {
    return (
      <>
        <Topbar title="My Profile" subtitle="Manage your UniConnect profile" />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
        </main>
      </>
    );
  }

  return (
    <>
      <Topbar title="My Profile" subtitle="Keep your profile up-to-date to get better AI matches" />
      <main className="flex-1 p-6 space-y-6 max-w-4xl">

        {/* Completion banner */}
        <Card className={completion === 100 ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-slate-800">Profile Completion</p>
                <span className={`text-sm font-bold ${completion === 100 ? "text-green-600" : "text-amber-600"}`}>{completion}%</span>
              </div>
              <div className="w-full bg-white/60 rounded-full h-2">
                <div className="h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completion}%`, backgroundColor: completion === 100 ? "#16a34a" : "#d97706" }} />
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                {completion === 100 ? "Your profile is complete! You're getting the best AI matches." : "Complete your profile to unlock better AI matches and visibility."}
              </p>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
          </div>
        )}

        {/* Personal Info */}
        <SectionCard title="Personal Information" icon={User}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name" required>
              <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Dheeraj Kumar" className={inputCls} />
            </Field>
            <Field label="Phone Number">
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 9876543210" className={inputCls} />
            </Field>
            <Field label="Date of Birth">
              <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Gender">
              <select value={gender} onChange={e => setGender(e.target.value)} className={inputCls}>
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Non-binary</option>
                <option>Prefer not to say</option>
              </select>
            </Field>
            <Field label="Nationality">
              <input value={nationality} onChange={e => setNationality(e.target.value)} placeholder="e.g. Indian" className={inputCls} />
            </Field>
          </div>
        </SectionCard>

        {/* Academic Info */}
        <SectionCard title="Academic Information" icon={GraduationCap}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Roll Number" required>
              <input value={rollNumber} onChange={e => setRollNumber(e.target.value)} placeholder="e.g. MBA2024001" className={inputCls} />
            </Field>
            <Field label="Batch Number">
              <input value={batchNumber} onChange={e => setBatchNumber(e.target.value)} placeholder="e.g. Batch 12" className={inputCls} />
            </Field>
            <Field label="Batch Year" required>
              <input value={batchYear} onChange={e => setBatchYear(e.target.value)} placeholder="e.g. 2024" className={inputCls} />
            </Field>
            <Field label="University ID">
              <input value={universityId} onChange={e => setUniversityId(e.target.value)} placeholder="e.g. U12345" className={inputCls} />
            </Field>
            <Field label="Program" required>
              <select value={program} onChange={e => setProgram(e.target.value)} className={inputCls}>
                <option value="">Select program</option>
                <option>MBA</option>
                <option>Executive MBA</option>
                <option>MBA (Full-time)</option>
                <option>MBA (Part-time)</option>
                <option>PGDM</option>
                <option>MMS</option>
              </select>
            </Field>
            <Field label="Specialization">
              <select value={specialization} onChange={e => setSpecialization(e.target.value)} className={inputCls}>
                <option value="">Select specialization</option>
                <option>Finance</option>
                <option>Marketing</option>
                <option>Operations</option>
                <option>Strategy</option>
                <option>Entrepreneurship</option>
                <option>Human Resources</option>
                <option>Information Technology</option>
                <option>Healthcare Management</option>
                <option>International Business</option>
              </select>
            </Field>
            <Field label="GPA / CGPA">
              <input value={gpa} onChange={e => setGpa(e.target.value)} placeholder="e.g. 3.8" className={inputCls} />
            </Field>
            <Field label="Expected Graduation">
              <input value={expectedGraduation} onChange={e => setExpectedGraduation(e.target.value)} placeholder="e.g. May 2026" className={inputCls} />
            </Field>
          </div>
        </SectionCard>

        {/* Professional Info */}
        <SectionCard title="Professional Background" icon={Briefcase}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="LinkedIn URL">
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)}
                  placeholder="linkedin.com/in/yourname" className={`${inputCls} pl-9`} />
              </div>
            </Field>
            <Field label="GitHub URL">
              <div className="relative">
                <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={githubUrl} onChange={e => setGithubUrl(e.target.value)}
                  placeholder="github.com/yourname" className={`${inputCls} pl-9`} />
              </div>
            </Field>
            <Field label="Years of Work Experience">
              <select value={workExperienceYears} onChange={e => setWorkExperienceYears(e.target.value)} className={inputCls}>
                <option value="">Select years</option>
                <option value="0">Fresher (0 years)</option>
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
                <option value="4">4 years</option>
                <option value="5">5+ years</option>
                <option value="8">8+ years</option>
              </select>
            </Field>
            <Field label="Previous Company">
              <input value={previousCompany} onChange={e => setPreviousCompany(e.target.value)}
                placeholder="e.g. Infosys, Deloitte" className={inputCls} />
            </Field>
            <Field label="Previous Role">
              <input value={previousRole} onChange={e => setPreviousRole(e.target.value)}
                placeholder="e.g. Business Analyst" className={inputCls} />
            </Field>
          </div>
        </SectionCard>

        {/* Interests & Goals */}
        <SectionCard title="Interests & Goals" icon={Heart}>
          <Field label="Bio / About Me">
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
              placeholder="Tell the network about yourself — your background, what you're working on, and what you're looking for..."
              className={inputCls} />
          </Field>

          <Field label="Career Interests">
            <ChipSelector options={CAREER_OPTIONS} selected={careerInterests} onChange={setCareerInterests} />
          </Field>

          <Field label="Skills">
            <ChipSelector options={SKILL_OPTIONS} selected={skills} onChange={setSkills} />
          </Field>

          <Field label="I'm looking for">
            <ChipSelector options={INTEREST_OPTIONS} selected={lookingFor} onChange={setLookingFor} />
          </Field>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setOpenToMentor(!openToMentor)}
              className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 ${openToMentor ? "bg-indigo-600" : "bg-slate-200"}`}
              style={{ position: "relative" }}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${openToMentor ? "left-6" : "left-1"}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">Open to peer mentoring</p>
              <p className="text-xs text-slate-500">Other students can reach out to you for guidance</p>
            </div>
          </label>
        </SectionCard>

        {/* Save button */}
        <div className="flex items-center gap-3 pb-8">
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" /> Save Profile</>}
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
              <CheckCircle className="w-4 h-4" /> Profile saved successfully!
            </span>
          )}
        </div>
      </main>
    </>
  );
}
