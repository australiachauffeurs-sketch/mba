"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { getRoleColor } from "@/lib/utils";
import { Recommendation } from "@/lib/types";
import { Sparkles, Send, Check, MapPin, Building2, ChevronDown, ChevronUp } from "lucide-react";

const matchTypeLabel: Record<string, string> = {
  mentor: "Mentor Match",
  hire: "Hiring Match",
  invest: "Investment Match",
  collaborate: "Collaboration",
  cofounder: "Co-founder Match",
  research: "Research Match",
};

const matchTypeColor: Record<string, string> = {
  mentor: "bg-blue-100 text-blue-700",
  hire: "bg-green-100 text-green-700",
  invest: "bg-amber-100 text-amber-700",
  collaborate: "bg-purple-100 text-purple-700",
  cofounder: "bg-rose-100 text-rose-700",
  research: "bg-teal-100 text-teal-700",
};

interface RecommendationCardProps {
  recommendation: Recommendation;
  onConnect?: (rec: Recommendation) => void;
}

export function RecommendationCard({ recommendation, onConnect }: RecommendationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [connected, setConnected] = useState(false);
  const { profile, matchScore, reason, matchType, sharedInterests } = recommendation;

  const location = (profile as any).location;
  const company = (profile as any).current_company || (profile as any).firm || (profile as any).department;

  function handleConnect() {
    setConnected(true);
    onConnect?.(recommendation);
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar name={profile.full_name} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-slate-900">{profile.full_name}</h3>
                <p className="text-sm text-slate-500 truncate">{profile.headline}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                  {company && (
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {company}
                    </span>
                  )}
                  {location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {location}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${matchTypeColor[matchType] ?? "bg-slate-100 text-slate-600"}`}>
                  {matchTypeLabel[matchType]}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(profile.role)}`}>
                  {profile.role}
                </span>
              </div>
            </div>

            {/* Match score */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    AI Match Score
                  </span>
                  <span className="text-xs font-bold text-indigo-600">{matchScore}%</span>
                </div>
                <Progress
                  value={matchScore}
                  barClassName={matchScore >= 90 ? "bg-indigo-600" : matchScore >= 75 ? "bg-blue-500" : "bg-slate-400"}
                />
              </div>
            </div>

            {/* AI reason */}
            <div className="mt-3 bg-indigo-50 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-indigo-800 leading-relaxed">{reason}</p>
              </div>
            </div>

            {/* Shared interests */}
            {sharedInterests && sharedInterests.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {sharedInterests.map((interest) => (
                  <Badge key={interest} variant="secondary">{interest}</Badge>
                ))}
              </div>
            )}

            {/* Expanded bio */}
            {expanded && profile.bio && (
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{profile.bio}</p>
            )}

            {/* Actions */}
            <div className="mt-4 flex items-center gap-2">
              {connected ? (
                <Button size="sm" variant="secondary" disabled>
                  <Check className="w-3.5 h-3.5" />
                  Request Sent
                </Button>
              ) : (
                <Button size="sm" onClick={handleConnect}>
                  <Send className="w-3.5 h-3.5" />
                  Connect
                </Button>
              )}
              <Button size="sm" variant="outline">View Profile</Button>
              <button
                onClick={() => setExpanded(!expanded)}
                className="ml-auto text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
              >
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {expanded ? "Less" : "More"}
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
