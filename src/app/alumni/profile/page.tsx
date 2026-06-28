"use client";

import { useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Topbar } from "@/components/layout/topbar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WorkJob {
  id: string;
  company: string;
  role: string;
  industry: string;
  from_year: string;
  to_year: string;
  description: string;
  is_current: boolean;
}

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  year: string;
}

interface ProfileForm {
  // profiles table
  full_name: string;
  phone: string;
  nationality: string;
  bio: string;

  // alumni_profiles table
  company: string;
  job_title: string;
  industry: string;
  years_of_experience: string;
  headline: string;
  location: string;
  linkedin_url: string;
  website_url: string;
  batch_year: string;
  roll_number: string;
  expertise_areas: string[];
  mentoring_topics: string[];
  open_to_mentor: boolean;
  open_to_hire: boolean;
  hiring_roles: string[];
  achievements: string;
  work_history: WorkJob[];
  education: EducationEntry[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const INDUSTRIES = [
  "Accounting",
  "Aerospace & Defence",
  "Agriculture",
  "Automotive",
  "Banking & Finance",
  "Biotechnology",
  "Chemicals",
  "Consulting",
  "Consumer Goods",
  "E-Commerce",
  "Education",
  "Energy & Utilities",
  "Engineering",
  "Entertainment & Media",
  "Fashion & Retail",
  "Food & Beverage",
  "Government & Public Sector",
  "Healthcare",
  "Hospitality & Tourism",
  "Information Technology",
  "Insurance",
  "Legal",
  "Logistics & Supply Chain",
  "Manufacturing",
  "Marketing & Advertising",
  "Mining & Resources",
  "Non-Profit",
  "Pharmaceuticals",
  "Private Equity & Venture Capital",
  "Real Estate",
  "Research & Development",
  "Telecommunications",
  "Transportation",
  "Other",
];

const DEFAULT_FORM: ProfileForm = {
  full_name: "",
  phone: "",
  nationality: "",
  bio: "",
  company: "",
  job_title: "",
  industry: "",
  years_of_experience: "",
  headline: "",
  location: "",
  linkedin_url: "",
  website_url: "",
  batch_year: "",
  roll_number: "",
  expertise_areas: [],
  mentoring_topics: [],
  open_to_mentor: false,
  open_to_hire: false,
  hiring_roles: [],
  achievements: "",
  work_history: [],
  education: [],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function calcCompletion(form: ProfileForm): number {
  const checks = [
    !!form.full_name,
    !!form.phone,
    !!form.nationality,
    !!form.bio,
    !!form.company,
    !!form.job_title,
    !!form.industry,
    !!form.headline,
    !!form.location,
    !!form.linkedin_url,
    !!form.batch_year,
    form.expertise_areas.length > 0,
    form.mentoring_topics.length > 0,
    form.work_history.length > 0,
    form.achievements.trim().length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ChipInput({
  label,
  chips,
  onChange,
  placeholder,
}: {
  label: string;
  chips: string[];
  onChange: (chips: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  function addChip() {
    const val = input.trim();
    if (val && !chips.includes(val)) {
      onChange([...chips, val]);
    }
    setInput("");
  }

  function removeChip(chip: string) {
    onChange(chips.filter((c) => c !== chip));
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {chips.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full"
          >
            {chip}
            <button
              type="button"
              onClick={() => removeChip(chip)}
              className="text-emerald-600 hover:text-emerald-900 leading-none"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addChip();
            }
          }}
          placeholder={placeholder ?? "Type and press Enter"}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Button
          type="button"
          onClick={addChip}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-3 py-2 h-auto"
        >
          Add
        </Button>
      </div>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          checked ? "bg-emerald-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function FieldInput({
  label,
  required,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...props}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

function FieldSelect({
  label,
  required,
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  required?: boolean;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        {...props}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
      >
        <option value="">Select&hellip;</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function FieldTextarea({
  label,
  required,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        {...props}
        rows={props.rows ?? 3}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
      />
    </div>
  );
}

// ─── Work History Section ─────────────────────────────────────────────────────

function WorkHistorySection({
  jobs,
  onChange,
}: {
  jobs: WorkJob[];
  onChange: (jobs: WorkJob[]) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState<WorkJob>({
    id: "",
    company: "",
    role: "",
    industry: "",
    from_year: "",
    to_year: "",
    description: "",
    is_current: false,
  });

  function openAdd() {
    setDraft({
      id: genId(),
      company: "",
      role: "",
      industry: "",
      from_year: "",
      to_year: "",
      description: "",
      is_current: false,
    });
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(job: WorkJob) {
    setDraft({ ...job });
    setEditId(job.id);
    setShowForm(true);
  }

  function saveDraft() {
    if (!draft.company || !draft.role || !draft.from_year) return;
    if (editId) {
      onChange(jobs.map((j) => (j.id === editId ? draft : j)));
    } else {
      onChange([...jobs, draft]);
    }
    setShowForm(false);
  }

  function removeJob(id: string) {
    onChange(jobs.filter((j) => j.id !== id));
  }

  function setDraftField<K extends keyof WorkJob>(key: K, val: WorkJob[K]) {
    setDraft((prev) => ({
      ...prev,
      [key]: val,
      ...(key === "is_current" && val === true ? { to_year: "Present" } : {}),
      ...(key === "is_current" && val === false ? { to_year: "" } : {}),
    }));
  }

  return (
    <div className="space-y-4">
      {jobs.length === 0 && (
        <p className="text-sm text-gray-500 italic">No work history added yet.</p>
      )}

      {/* Timeline */}
      <div className="relative space-y-4">
        {jobs.map((job, idx) => (
          <div key={job.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
              {idx < jobs.length - 1 && (
                <div className="w-0.5 flex-1 bg-emerald-200 mt-1" />
              )}
            </div>
            <div className="pb-4 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{job.role}</p>
                  <p className="text-sm text-gray-600">
                    {job.company}
                    {job.industry ? ` · ${job.industry}` : ""}
                  </p>
                  <p className="text-xs text-gray-400">
                    {job.from_year} &ndash;{" "}
                    {job.is_current ? "Present" : job.to_year || "—"}
                  </p>
                  {job.description && (
                    <p className="text-xs text-gray-500 mt-1">{job.description}</p>
                  )}
                </div>
                <div className="flex gap-1 ml-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(job)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded hover:bg-indigo-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeJob(job.id)}
                    className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
          <p className="text-sm font-semibold text-gray-700">
            {editId ? "Edit Job" : "Add Job"}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <FieldInput
              label="Company"
              required
              value={draft.company}
              onChange={(e) => setDraftField("company", e.target.value)}
              placeholder="KPMG"
            />
            <FieldInput
              label="Role / Title"
              required
              value={draft.role}
              onChange={(e) => setDraftField("role", e.target.value)}
              placeholder="Director"
            />
            <FieldSelect
              label="Industry"
              options={INDUSTRIES}
              value={draft.industry}
              onChange={(e) => setDraftField("industry", e.target.value)}
            />
            <FieldInput
              label="From Year"
              required
              type="number"
              value={draft.from_year}
              onChange={(e) => setDraftField("from_year", e.target.value)}
              placeholder="2018"
              min={1970}
              max={2099}
            />
          </div>
          <div className="flex items-end gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer pb-0.5">
              <input
                type="checkbox"
                checked={draft.is_current}
                onChange={(e) => setDraftField("is_current", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              Currently working here
            </label>
            {!draft.is_current && (
              <div className="flex-1">
                <FieldInput
                  label="To Year"
                  type="number"
                  value={draft.to_year}
                  onChange={(e) => setDraftField("to_year", e.target.value)}
                  placeholder="2022"
                  min={1970}
                  max={2099}
                />
              </div>
            )}
          </div>
          <FieldTextarea
            label="Description"
            value={draft.description}
            onChange={(e) => setDraftField("description", e.target.value)}
            placeholder="Brief description of your role and responsibilities&hellip;"
            rows={2}
          />
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm px-3 py-1.5 h-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={saveDraft}
              disabled={!draft.company || !draft.role || !draft.from_year}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1.5 h-auto disabled:opacity-50"
            >
              {editId ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      )}

      {!showForm && (
        <Button
          type="button"
          onClick={openAdd}
          className="bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-sm px-3 py-1.5 h-auto"
        >
          + Add Job
        </Button>
      )}
    </div>
  );
}

// ─── Education Section ────────────────────────────────────────────────────────

function EducationSection({
  entries,
  onChange,
}: {
  entries: EducationEntry[];
  onChange: (entries: EducationEntry[]) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EducationEntry>({
    id: "",
    institution: "",
    degree: "",
    field: "",
    year: "",
  });

  function openAdd() {
    setDraft({ id: genId(), institution: "", degree: "", field: "", year: "" });
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(e: EducationEntry) {
    setDraft({ ...e });
    setEditId(e.id);
    setShowForm(true);
  }

  function saveDraft() {
    if (!draft.institution || !draft.degree) return;
    if (editId) {
      onChange(entries.map((e) => (e.id === editId ? draft : e)));
    } else {
      onChange([...entries, draft]);
    }
    setShowForm(false);
  }

  function removeEntry(id: string) {
    onChange(entries.filter((e) => e.id !== id));
  }

  function setDraftField<K extends keyof EducationEntry>(
    key: K,
    val: EducationEntry[K]
  ) {
    setDraft((prev) => ({ ...prev, [key]: val }));
  }

  return (
    <div className="space-y-4">
      {entries.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          No additional education added yet.
        </p>
      )}

      <div className="space-y-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-start justify-between bg-gray-50 rounded-lg p-3 border border-gray-200"
          >
            <div>
              <p className="font-medium text-sm text-gray-900">
                {entry.degree}
                {entry.field ? ` in ${entry.field}` : ""}
              </p>
              <p className="text-sm text-gray-600">{entry.institution}</p>
              {entry.year && (
                <p className="text-xs text-gray-400">{entry.year}</p>
              )}
            </div>
            <div className="flex gap-1 ml-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => openEdit(entry)}
                className="text-xs text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded hover:bg-indigo-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => removeEntry(entry.id)}
                className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
          <p className="text-sm font-semibold text-gray-700">
            {editId ? "Edit Education" : "Add Education"}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <FieldInput
              label="Institution"
              required
              value={draft.institution}
              onChange={(e) => setDraftField("institution", e.target.value)}
              placeholder="Harvard Business School"
            />
            <FieldInput
              label="Degree"
              required
              value={draft.degree}
              onChange={(e) => setDraftField("degree", e.target.value)}
              placeholder="MBA"
            />
            <FieldInput
              label="Field of Study"
              value={draft.field}
              onChange={(e) => setDraftField("field", e.target.value)}
              placeholder="Finance"
            />
            <FieldInput
              label="Year"
              type="number"
              value={draft.year}
              onChange={(e) => setDraftField("year", e.target.value)}
              placeholder="2020"
              min={1970}
              max={2099}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm px-3 py-1.5 h-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={saveDraft}
              disabled={!draft.institution || !draft.degree}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1.5 h-auto disabled:opacity-50"
            >
              {editId ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      )}

      {!showForm && (
        <Button
          type="button"
          onClick={openAdd}
          className="bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-sm px-3 py-1.5 h-auto"
        >
          + Add Education
        </Button>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AlumniProfilePage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [form, setForm] = useState<ProfileForm>(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // ── Load ──────────────────────────────────────────────────────────────────

  const loadProfile = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    setUserId(user.id);

    const [profilesRes, alumniRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("alumni_profiles")
        .select("*")
        .eq("profile_id", user.id)
        .single(),
    ]);

    const p = profilesRes.data;
    const a = alumniRes.data;

    setForm({
      full_name: p?.full_name ?? "",
      phone: p?.phone ?? "",
      nationality: p?.nationality ?? "",
      bio: p?.bio ?? a?.bio ?? "",

      company: a?.company ?? "",
      job_title: a?.job_title ?? "",
      industry: a?.industry ?? "",
      years_of_experience: a?.years_of_experience?.toString() ?? "",
      headline: a?.headline ?? "",
      location: a?.location ?? p?.location ?? "",
      linkedin_url: a?.linkedin_url ?? p?.linkedin_url ?? "",
      website_url: a?.website_url ?? "",
      batch_year: a?.batch_year?.toString() ?? "",
      roll_number: a?.roll_number ?? "",
      expertise_areas: a?.expertise_areas ?? [],
      mentoring_topics: a?.mentoring_topics ?? [],
      open_to_mentor: a?.open_to_mentor ?? false,
      open_to_hire: a?.open_to_hire ?? false,
      hiring_roles: a?.hiring_roles ?? [],
      achievements: ((a?.achievements ?? []) as string[]).join("\n"),
      work_history: ((a?.work_history ?? []) as Record<string, unknown>[]).map(
        (j) => ({
          id: (j.id as string) ?? genId(),
          company: (j.company as string) ?? "",
          role: (j.role as string) ?? "",
          industry: (j.industry as string) ?? "",
          from_year: (j.from_year as string) ?? "",
          to_year: (j.to_year as string) ?? "",
          description: (j.description as string) ?? "",
          is_current: (j.is_current as boolean) ?? false,
        })
      ),
      education: ((a?.education ?? []) as Record<string, unknown>[]).map(
        (e) => ({
          id: (e.id as string) ?? genId(),
          institution: (e.institution as string) ?? "",
          degree: (e.degree as string) ?? "",
          field: (e.field as string) ?? "",
          year: (e.year as string) ?? "",
        })
      ),
    });

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // ── Set field helper ──────────────────────────────────────────────────────

  function setField<K extends keyof ProfileForm>(key: K, val: ProfileForm[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
    setSaveSuccess(false);
    setSaveError(null);
  }

  // ── Save ──────────────────────────────────────────────────────────────────

  async function handleSave() {
    if (!userId) return;
    if (!form.full_name.trim()) {
      setSaveError("Full name is required.");
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const achievementsArr = form.achievements
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const [profileUpsert, alumniUpsert] = await Promise.all([
      supabase.from("profiles").upsert(
        {
          id: userId,
          full_name: form.full_name.trim(),
          phone: form.phone.trim(),
          nationality: form.nationality.trim(),
          linkedin_url: form.linkedin_url.trim(),
          bio: form.bio.trim(),
        },
        { onConflict: "id" }
      ),
      supabase.from("alumni_profiles").upsert(
        {
          profile_id: userId,
          company: form.company.trim(),
          job_title: form.job_title.trim(),
          industry: form.industry,
          years_of_experience: form.years_of_experience
            ? parseInt(form.years_of_experience, 10)
            : null,
          headline: form.headline.trim(),
          location: form.location.trim(),
          linkedin_url: form.linkedin_url.trim(),
          website_url: form.website_url.trim(),
          batch_year: form.batch_year ? parseInt(form.batch_year, 10) : null,
          roll_number: form.roll_number.trim(),
          expertise_areas: form.expertise_areas,
          mentoring_topics: form.mentoring_topics,
          open_to_mentor: form.open_to_mentor,
          open_to_hire: form.open_to_hire,
          hiring_roles: form.hiring_roles,
          achievements: achievementsArr,
          work_history: form.work_history,
          education: form.education,
          bio: form.bio.trim(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "profile_id" }
      ),
    ]);

    setSaving(false);

    if (profileUpsert.error || alumniUpsert.error) {
      setSaveError(
        profileUpsert.error?.message ??
          alumniUpsert.error?.message ??
          "Save failed."
      );
    } else {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const completion = calcCompletion(form);
  const initials = getInitials(form.full_name || "");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Topbar
          title="My Profile"
          subtitle="Keep your profile updated to connect with students"
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar
        title="My Profile"
        subtitle="Keep your profile updated to connect with students"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Profile Header ─────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-md select-none">
                {initials || "?"}
              </div>

              {/* Name + completion */}
              <div className="space-y-2">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {form.full_name || "Your Name"}
                  </h2>
                  {form.headline && (
                    <p className="text-sm text-gray-500 mt-0.5">
                      {form.headline}
                    </p>
                  )}
                  {form.location && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {form.location}
                    </p>
                  )}
                </div>
                <div className="w-64">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">
                      Profile completeness
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        completion >= 80
                          ? "text-emerald-600"
                          : completion >= 50
                          ? "text-yellow-600"
                          : "text-red-500"
                      }`}
                    >
                      {completion}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        completion >= 80
                          ? "bg-emerald-500"
                          : completion >= 50
                          ? "bg-yellow-400"
                          : "bg-red-400"
                      }`}
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save button */}
            <div className="flex flex-col items-end gap-2">
              <Button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 h-auto font-medium shadow-sm disabled:opacity-60"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Saving&hellip;
                  </span>
                ) : (
                  "Save Profile"
                )}
              </Button>
              {saveError && (
                <p className="text-xs text-red-600 max-w-xs text-right">
                  {saveError}
                </p>
              )}
              {saveSuccess && (
                <p className="text-xs text-emerald-600 font-medium">
                  Profile saved successfully!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Two-column layout ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column — 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldInput
                    label="Full Name"
                    required
                    value={form.full_name}
                    onChange={(e) => setField("full_name", e.target.value)}
                    placeholder="Dheeraj Sharma"
                  />
                  <FieldInput
                    label="Phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                  <FieldInput
                    label="Nationality"
                    value={form.nationality}
                    onChange={(e) => setField("nationality", e.target.value)}
                    placeholder="Indian"
                  />
                  <FieldInput
                    label="Location (City, Country)"
                    value={form.location}
                    onChange={(e) => setField("location", e.target.value)}
                    placeholder="Mumbai, India"
                  />
                </div>
                <FieldTextarea
                  label="Bio"
                  value={form.bio}
                  onChange={(e) => setField("bio", e.target.value)}
                  rows={4}
                  placeholder="Write a short bio about yourself — your background, passions, and what drives you&hellip;"
                />
              </CardContent>
            </Card>

            {/* Current Position */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Current Position
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldInput
                    label="Company"
                    required
                    value={form.company}
                    onChange={(e) => setField("company", e.target.value)}
                    placeholder="KPMG"
                  />
                  <FieldInput
                    label="Job Title"
                    required
                    value={form.job_title}
                    onChange={(e) => setField("job_title", e.target.value)}
                    placeholder="Director"
                  />
                  <FieldSelect
                    label="Industry"
                    options={INDUSTRIES}
                    value={form.industry}
                    onChange={(e) => setField("industry", e.target.value)}
                  />
                  <FieldInput
                    label="Years of Experience"
                    type="number"
                    value={form.years_of_experience}
                    onChange={(e) =>
                      setField("years_of_experience", e.target.value)
                    }
                    placeholder="10"
                    min={0}
                    max={60}
                  />
                </div>
                <FieldInput
                  label="Professional Headline"
                  value={form.headline}
                  onChange={(e) => setField("headline", e.target.value)}
                  placeholder="Director at KPMG | MBA 2018 | Mentor"
                />
              </CardContent>
            </Card>

            {/* Work History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Work History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WorkHistorySection
                  jobs={form.work_history}
                  onChange={(jobs) => setField("work_history", jobs)}
                />
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                  <FieldInput
                    label="MBA Batch Year"
                    type="number"
                    value={form.batch_year}
                    onChange={(e) => setField("batch_year", e.target.value)}
                    placeholder="2018"
                    min={1970}
                    max={2099}
                  />
                  <FieldInput
                    label="Roll Number"
                    value={form.roll_number}
                    onChange={(e) => setField("roll_number", e.target.value)}
                    placeholder="MBA-2018-042"
                  />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Additional Education
                </p>
                <EducationSection
                  entries={form.education}
                  onChange={(edu) => setField("education", edu)}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right column — 1/3 */}
          <div className="space-y-6">
            {/* Expertise & Mentoring */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Expertise &amp; Mentoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <ChipInput
                  label="Expertise Areas"
                  chips={form.expertise_areas}
                  onChange={(chips) => setField("expertise_areas", chips)}
                  placeholder="e.g. Financial Modelling"
                />
                <ChipInput
                  label="Mentoring Topics"
                  chips={form.mentoring_topics}
                  onChange={(chips) => setField("mentoring_topics", chips)}
                  placeholder="e.g. Career Switch, MBA Tips"
                />
                <div className="border-t border-gray-100 pt-4">
                  <Toggle
                    label="Open to Mentor"
                    description="Students can send you mentorship requests"
                    checked={form.open_to_mentor}
                    onChange={(v) => setField("open_to_mentor", v)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Hiring */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Hiring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Toggle
                  label="Open to Hire"
                  description="Your company is actively hiring"
                  checked={form.open_to_hire}
                  onChange={(v) => setField("open_to_hire", v)}
                />
                {form.open_to_hire && (
                  <ChipInput
                    label="Roles You Are Hiring For"
                    chips={form.hiring_roles}
                    onChange={(chips) => setField("hiring_roles", chips)}
                    placeholder="e.g. Business Analyst"
                  />
                )}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FieldTextarea
                  label="One achievement per line"
                  value={form.achievements}
                  onChange={(e) => setField("achievements", e.target.value)}
                  rows={5}
                  placeholder={
                    "Forbes 30 Under 30, 2022\nBest Startup Pitch Award, IIM A\nCFA Charterholder"
                  }
                />
                <p className="text-xs text-gray-400 mt-1">
                  Press Enter to separate achievements.
                </p>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Social Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FieldInput
                  label="LinkedIn URL"
                  type="url"
                  value={form.linkedin_url}
                  onChange={(e) => setField("linkedin_url", e.target.value)}
                  placeholder="https://linkedin.com/in/dheeraj-sharma"
                />
                <FieldInput
                  label="Website / Portfolio URL"
                  type="url"
                  value={form.website_url}
                  onChange={(e) => setField("website_url", e.target.value)}
                  placeholder="https://dheeraj.com"
                />
              </CardContent>
            </Card>

            {/* Mobile save button */}
            <div className="lg:hidden">
              <Button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 h-auto font-medium"
              >
                {saving ? "Saving…" : "Save Profile"}
              </Button>
              {saveError && (
                <p className="text-xs text-red-600 mt-2 text-center">
                  {saveError}
                </p>
              )}
              {saveSuccess && (
                <p className="text-xs text-emerald-600 mt-2 text-center font-medium">
                  Saved!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
