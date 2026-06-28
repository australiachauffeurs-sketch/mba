export type UserRole = "student" | "alumni" | "faculty" | "investor" | "admin" | "organisation";

export interface Profile {
  id: string;
  user_id: string;
  role: UserRole;
  full_name: string;
  email: string;
  avatar_url?: string;
  headline?: string;
  bio?: string;
  location?: string;
  linkedin_url?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentProfile extends Profile {
  role: "student";
  program?: string;
  graduation_year?: number;
  gpa?: number;
  career_goals?: string;
  industries_of_interest?: string[];
  skills?: string[];
  startup_interest?: boolean;
  internship_seeking?: boolean;
}

export interface AlumniProfile extends Profile {
  role: "alumni";
  graduation_year?: number;
  current_company?: string;
  current_title?: string;
  industry?: string;
  expertise?: string[];
  open_to_mentoring?: boolean;
  hiring?: boolean;
  hiring_roles?: string[];
}

export interface FacultyProfile extends Profile {
  role: "faculty";
  department?: string;
  research_areas?: string[];
  courses_taught?: string[];
  open_to_collaboration?: boolean;
}

export interface InvestorProfile extends Profile {
  role: "investor";
  firm?: string;
  investment_thesis?: string;
  industries?: string[];
  stages?: string[];
  ticket_size_min?: number;
  ticket_size_max?: number;
  geography?: string[];
}

export interface Match {
  id: string;
  source_profile_id: string;
  target_profile_id: string;
  match_type: MatchType;
  score: number;
  reason: string;
  status: "pending" | "accepted" | "declined" | "introduced";
  created_at: string;
  target_profile?: Profile;
}

export type MatchType =
  | "mentor"
  | "hire"
  | "invest"
  | "collaborate"
  | "cofounder"
  | "research";

export interface Introduction {
  id: string;
  match_id: string;
  message: string;
  status: "draft" | "sent" | "accepted" | "declined";
  created_at: string;
}

export interface AnalyticsMetric {
  label: string;
  value: number;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
}

export interface Recommendation {
  profile: Profile;
  matchScore: number;
  reason: string;
  matchType: MatchType;
  sharedInterests?: string[];
}
