"use client";
import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";

const conversations = [
  { id: "c1", name: "Sarah Chen", role: "alumni", lastMessage: "Happy to jump on a call next week! What time works for you?", time: "2m ago", unread: 2, online: true },
  { id: "c2", name: "Prof. David Kumar", role: "faculty", lastMessage: "The paper is attached. Let me know your thoughts on section 3.", time: "1h ago", unread: 0, online: false },
  { id: "c3", name: "Robert Tanaka", role: "investor", lastMessage: "Interesting idea. Can you share a deck?", time: "3h ago", unread: 1, online: false },
  { id: "c4", name: "James Park", role: "alumni", lastMessage: "Great chatting yesterday. Here's the referral link for the APM role.", time: "1d ago", unread: 0, online: true },
  { id: "c5", name: "Aisha Okonkwo", role: "alumni", lastMessage: "Good luck with your pitch! You've got this.", time: "2d ago", unread: 0, online: false },
];

const messageHistory: Record<string, { from: "me" | "them"; text: string; time: string }[]> = {
  c1: [
    { from: "them", text: "Hi Priya! I saw your profile on UniConnect. Your fintech idea sounds fascinating.", time: "Yesterday 2:30 PM" },
    { from: "me", text: "Thank you so much Sarah! I'm a big fan of what you've built at PayBridge. Would love to learn from your journey.", time: "Yesterday 3:15 PM" },
    { from: "them", text: "Happy to jump on a call next week! What time works for you?", time: "Yesterday 4:00 PM" },
  ],
  c2: [
    { from: "them", text: "Priya, I've been following your interest in digital payments. I have some research papers that might be useful for your startup.", time: "Today 9:00 AM" },
    { from: "me", text: "That would be amazing Prof. Kumar! I'd love to read them.", time: "Today 9:30 AM" },
    { from: "them", text: "The paper is attached. Let me know your thoughts on section 3.", time: "Today 10:15 AM" },
  ],
};

const aiSuggestions: Record<string, string[]> = {
  c1: ["Tuesday at 2 PM works great for me!", "I'd love to discuss my fintech idea with you.", "Thank you so much for your time!"],
  c2: ["Section 3 is fascinating — especially the CBDC adoption data.", "Would love to explore research collaboration.", "This aligns perfectly with my startup idea."],
};

export default function MessagesPage() {
  const [active, setActive] = useState("c1");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(messageHistory);

  const activeConvo = conversations.find(c => c.id === active)!;
  const activeMessages = messages[active] || [];
  const suggestions = aiSuggestions[active] || [];

  function send(text: string) {
    const msg = { from: "me" as const, text, time: "Just now" };
    setMessages(p => ({ ...p, [active]: [...(p[active] || []), msg] }));
    setInput("");
  }

  return (
    <>
      <Topbar title="Messages" subtitle="Your conversations across the network" />
      <main className="flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 73px)" }}>
        {/* Sidebar */}
        <aside className="w-80 border-r border-slate-200 bg-white flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <input placeholder="Search messages..." className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map(c => (
              <button key={c.id} onClick={() => setActive(c.id)}
                className={`w-full flex items-start gap-3 p-4 text-left border-b border-slate-100 hover:bg-slate-50 transition-colors ${active === c.id ? "bg-indigo-50 border-l-2 border-l-indigo-600" : ""}`}>
                <div className="relative flex-shrink-0">
                  <Avatar name={c.name} size="md" />
                  {c.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900 text-sm">{c.name}</p>
                    <span className="text-xs text-slate-400">{c.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{c.lastMessage}</p>
                  <div className="flex items-center justify-between mt-1">
                    <Badge variant="secondary" className="text-xs capitalize">{c.role}</Badge>
                    {c.unread > 0 && <span className="bg-indigo-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-5 text-center">{c.unread}</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-slate-50">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3">
            <div className="relative">
              <Avatar name={activeConvo.name} size="md" />
              {activeConvo.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{activeConvo.name}</p>
              <p className="text-xs text-slate-500 capitalize">{activeConvo.role} · {activeConvo.online ? "Online" : "Offline"}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activeMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                {msg.from === "them" && <Avatar name={activeConvo.name} size="sm" className="mr-2 flex-shrink-0 mt-1" />}
                <div className={`max-w-xs lg:max-w-md ${msg.from === "me" ? "items-end" : "items-start"} flex flex-col`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.from === "me" ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-white text-slate-900 border border-slate-200 rounded-tl-sm shadow-sm"}`}>
                    {msg.text}
                  </div>
                  <span className="text-xs text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* AI suggestions */}
          {suggestions.length > 0 && (
            <div className="px-6 py-3 bg-white border-t border-slate-100">
              <p className="text-xs text-slate-400 flex items-center gap-1 mb-2"><Sparkles className="w-3 h-3 text-indigo-400" /> AI suggested replies</p>
              <div className="flex gap-2 flex-wrap">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => send(s)}
                    className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors border border-indigo-100">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && input.trim() && send(input.trim())}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button size="md" onClick={() => input.trim() && send(input.trim())} disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
