"use client";
import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const conversations = [
  { id: "c1", name: "Priya Sharma", role: "student", lastMessage: "The paper is fascinating — especially the CBDC adoption data in section 3!", time: "10m ago", unread: 1, online: true },
  { id: "c2", name: "Dr. Hiroshi Tanaka", role: "faculty", lastMessage: "The draft looks great. Shall we target NBER working paper first?", time: "1h ago", unread: 0, online: false },
  { id: "c3", name: "Sarah Chen", role: "alumni", lastMessage: "Happy to share PayBridge anonymized transaction data for your research.", time: "2d ago", unread: 0, online: true },
];

const msgs: Record<string, { from: "me" | "them"; text: string; time: string }[]> = {
  c1: [
    { from: "me", text: "Priya, I've attached some research papers on digital payments that should help with your startup.", time: "Today 9:00 AM" },
    { from: "them", text: "The paper is fascinating — especially the CBDC adoption data in section 3!", time: "Today 10:00 AM" },
  ],
};

export default function FacultyMessagesPage() {
  const [active, setActive] = useState("c1");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(msgs);
  const activeConvo = conversations.find(c => c.id === active)!;

  function send(text: string) {
    setMessages(p => ({ ...p, [active]: [...(p[active] || []), { from: "me" as const, text, time: "Just now" }] }));
    setInput("");
  }

  return (
    <>
      <Topbar title="Messages" subtitle="Your conversations across the network" />
      <main className="flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 73px)" }}>
        <aside className="w-80 border-r border-slate-200 bg-white flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <input placeholder="Search messages..." className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map(c => (
              <button key={c.id} onClick={() => setActive(c.id)}
                className={`w-full flex items-start gap-3 p-4 text-left border-b border-slate-100 hover:bg-slate-50 ${active === c.id ? "bg-green-50 border-l-2 border-l-green-600" : ""}`}>
                <div className="relative flex-shrink-0">
                  <Avatar name={c.name} size="md" />
                  {c.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="font-medium text-slate-900 text-sm">{c.name}</p>
                    <span className="text-xs text-slate-400">{c.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{c.lastMessage}</p>
                  <div className="flex justify-between mt-1">
                    <Badge variant="secondary" className="text-xs capitalize">{c.role}</Badge>
                    {c.unread > 0 && <span className="bg-green-600 text-white text-xs rounded-full px-1.5 py-0.5">{c.unread}</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>
        <div className="flex-1 flex flex-col bg-slate-50">
          <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3">
            <Avatar name={activeConvo.name} size="md" />
            <div><p className="font-semibold text-slate-900">{activeConvo.name}</p><p className="text-xs text-slate-500 capitalize">{activeConvo.role}</p></div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {(messages[active] || []).map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                {msg.from === "them" && <Avatar name={activeConvo.name} size="sm" className="mr-2 flex-shrink-0 mt-1" />}
                <div className={`max-w-sm flex flex-col ${msg.from === "me" ? "items-end" : "items-start"}`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${msg.from === "me" ? "bg-green-600 text-white rounded-tr-sm" : "bg-white text-slate-900 border border-slate-200 rounded-tl-sm shadow-sm"}`}>{msg.text}</div>
                  <span className="text-xs text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center gap-3">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && input.trim() && send(input.trim())}
              placeholder="Type a message..." className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none" />
            <Button size="md" onClick={() => input.trim() && send(input.trim())} disabled={!input.trim()} className="bg-green-600 hover:bg-green-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
