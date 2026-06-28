"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2, Plus, Trash2, Edit2, Calendar, MapPin, Users, X,
  CheckCircle, AlertCircle, Clock,
} from "lucide-react";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const EVENT_TYPES = ["workshop", "seminar", "networking", "hackathon", "recruitment", "webinar", "conference", "social", "other"];

interface EventItem {
  id: string;
  title: string;
  description: string;
  event_type: string;
  date: string;
  end_date: string;
  location: string;
  is_virtual: boolean;
  virtual_link: string;
  max_attendees: string;
  registration_deadline: string;
  tags: string[];
  created_at: string;
}

function blank(): Partial<EventItem> {
  return {
    title: "", description: "", event_type: "seminar", date: "", end_date: "",
    location: "", is_virtual: false, virtual_link: "", max_attendees: "", registration_deadline: "", tags: [],
  };
}

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white ${className}`}
      {...props}
    />
  );
}

function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white resize-none ${className}`}
      {...props}
    />
  );
}

function Select({ children, className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      className={`w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export default function OrganisationEventsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<EventItem>>(blank());
  const [editId, setEditId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [tagInput, setTagInput] = useState("");

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  const load = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("organiser_id", uid)
      .order("date", { ascending: true });
    setEvents(data || []);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      load(user.id).finally(() => setLoading(false));
    });
  }, [load]);

  function openCreate() {
    setEditing(blank());
    setEditId(null);
    setTagInput("");
    setShowForm(true);
  }

  function openEdit(ev: EventItem) {
    setEditing({ ...ev });
    setEditId(ev.id);
    setTagInput("");
    setShowForm(true);
  }

  async function saveEvent() {
    if (!userId || !editing.title || !editing.date) {
      showToast("error", "Title and date are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        organiser_id: userId,
        title: editing.title,
        description: editing.description || "",
        event_type: editing.event_type || "other",
        date: editing.date,
        end_date: editing.end_date || null,
        location: editing.location || "",
        is_virtual: editing.is_virtual || false,
        virtual_link: editing.virtual_link || "",
        max_attendees: editing.max_attendees ? parseInt(String(editing.max_attendees)) : null,
        registration_deadline: editing.registration_deadline || null,
        tags: editing.tags || [],
      };

      if (editId) {
        const { error } = await supabase.from("events").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("events").insert(payload);
        if (error) throw error;
      }

      showToast("success", editId ? "Event updated!" : "Event created!");
      setShowForm(false);
      await load(userId);
    } catch (e: any) {
      showToast("error", e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function deleteEvent(id: string) {
    if (!userId) return;
    await supabase.from("events").delete().eq("id", id).eq("organiser_id", userId);
    setEvents(prev => prev.filter(e => e.id !== id));
    showToast("success", "Event deleted");
  }

  function addTag() {
    const t = tagInput.trim();
    if (t && !editing.tags?.includes(t)) {
      setEditing(prev => ({ ...prev, tags: [...(prev.tags || []), t] }));
    }
    setTagInput("");
  }

  const upcoming = events.filter(e => new Date(e.date) >= new Date());
  const past = events.filter(e => new Date(e.date) < new Date());

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-12">
        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <>
      <Topbar title="Events" subtitle="Create and manage events for students" />
      <main className="flex-1 p-6 space-y-6">
        {toast && (
          <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
            toast.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
          }`}>
            {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </div>
        )}

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-40 flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 className="font-semibold text-lg text-slate-900">{editId ? "Edit Event" : "Create New Event"}</h2>
                <button onClick={() => setShowForm(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
                  <Input value={editing.title} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))} placeholder="Workshop: Finance Careers 2025" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <Textarea value={editing.description} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))} rows={4} placeholder="What will students learn, do, or gain?" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Event Type</label>
                    <Select value={editing.event_type} onChange={e => setEditing(p => ({ ...p, event_type: e.target.value }))}>
                      {EVENT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Max Attendees</label>
                    <Input type="number" min="1" value={editing.max_attendees} onChange={e => setEditing(p => ({ ...p, max_attendees: e.target.value }))} placeholder="100" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Date & Time <span className="text-red-500">*</span></label>
                    <Input type="datetime-local" value={editing.date} onChange={e => setEditing(p => ({ ...p, date: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">End Date & Time</label>
                    <Input type="datetime-local" value={editing.end_date} onChange={e => setEditing(p => ({ ...p, end_date: e.target.value }))} />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="is_virtual" checked={editing.is_virtual} onChange={e => setEditing(p => ({ ...p, is_virtual: e.target.checked }))} className="w-4 h-4 text-teal-600 rounded" />
                  <label htmlFor="is_virtual" className="text-sm font-medium text-slate-700">Virtual event</label>
                </div>
                {editing.is_virtual ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Virtual Link</label>
                    <Input value={editing.virtual_link} onChange={e => setEditing(p => ({ ...p, virtual_link: e.target.value }))} placeholder="https://zoom.us/j/..." />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <Input value={editing.location} onChange={e => setEditing(p => ({ ...p, location: e.target.value }))} placeholder="Room 201, Business School" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Registration Deadline</label>
                  <Input type="datetime-local" value={editing.registration_deadline} onChange={e => setEditing(p => ({ ...p, registration_deadline: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {(editing.tags || []).map(t => (
                      <span key={t} className="flex items-center gap-1 px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full">
                        {t}
                        <button onClick={() => setEditing(p => ({ ...p, tags: (p.tags || []).filter(x => x !== t) }))}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="e.g. finance, networking" onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} />
                    <Button type="button" variant="outline" onClick={addTag} className="flex-shrink-0">Add</Button>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-end p-6 border-t border-slate-100">
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button onClick={saveEvent} disabled={saving} className="bg-teal-600 hover:bg-teal-700 text-white">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editId ? "Update Event" : "Create Event"}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">{upcoming.length} upcoming · {past.length} past</p>
          </div>
          <Button onClick={openCreate} className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Event
          </Button>
        </div>

        {events.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-medium text-slate-600">No events yet</p>
              <p className="text-sm text-slate-400 mt-1">Create your first event to connect with students</p>
              <Button onClick={openCreate} className="mt-4 bg-teal-600 hover:bg-teal-700 text-white">Create Event</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Upcoming</h3>
                <div className="space-y-3">
                  {upcoming.map(ev => <EventCard key={ev.id} ev={ev} onEdit={openEdit} onDelete={deleteEvent} />)}
                </div>
              </div>
            )}
            {past.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">Past</h3>
                <div className="space-y-3 opacity-70">
                  {past.map(ev => <EventCard key={ev.id} ev={ev} onEdit={openEdit} onDelete={deleteEvent} />)}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

function EventCard({ ev, onEdit, onDelete }: { ev: EventItem; onEdit: (e: EventItem) => void; onDelete: (id: string) => void }) {
  const isPast = new Date(ev.date) < new Date();
  return (
    <Card className={isPast ? "opacity-70" : ""}>
      <CardContent className="p-5 flex items-start gap-4">
        <div className="w-12 h-12 bg-teal-50 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
          <span className="text-xs text-teal-600 font-semibold">{new Date(ev.date).toLocaleDateString("en-AU", { month: "short" })}</span>
          <span className="text-lg font-bold text-teal-700 leading-none">{new Date(ev.date).getDate()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-900 truncate">{ev.title}</p>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full flex-shrink-0">{ev.event_type}</span>
          </div>
          {ev.description && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{ev.description}</p>}
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(ev.date).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
            </span>
            {ev.location && <span className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.location}</span>}
            {ev.is_virtual && <span className="text-xs text-teal-600">Virtual</span>}
            {ev.max_attendees && <span className="text-xs text-slate-400 flex items-center gap-1"><Users className="w-3 h-3" />Max {ev.max_attendees}</span>}
          </div>
          {ev.tags?.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {ev.tags.map(t => <span key={t} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">{t}</span>)}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => onEdit(ev)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(ev.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
