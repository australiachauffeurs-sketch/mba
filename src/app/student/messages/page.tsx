"use client";
import { Topbar } from "@/components/layout/topbar";
import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  return (
    <>
      <Topbar title="Messages" subtitle="Your conversations across the network" />
      <main className="flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 73px)" }}>
        <aside className="w-80 border-r border-slate-200 bg-white flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <input placeholder="Search messages..." className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex-1 flex items-center justify-center p-6 text-center">
            <div>
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No conversations yet</p>
            </div>
          </div>
        </aside>
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 gap-3">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-indigo-400" />
          </div>
          <p className="font-semibold text-slate-800">No messages yet</p>
          <p className="text-sm text-slate-500 text-center max-w-xs">
            Connect with mentors, alumni, or faculty and start a conversation. Messages will appear here.
          </p>
        </div>
      </main>
    </>
  );
}
