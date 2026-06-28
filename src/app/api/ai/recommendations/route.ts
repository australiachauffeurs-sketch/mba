import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

export interface RecommendationItem {
  title: string;
  description: string;
  why: string;
  tags: string[];
  action: string;
  actionHref?: string;
  urgent?: boolean;
}

export interface RecommendationCategory {
  type: "alumni" | "mentor" | "course" | "club" | "research" | "internship" | "cofounder";
  label: string;
  emoji: string;
  items: RecommendationItem[];
}

export interface AIRecommendationsResponse {
  insight: string;
  studentName: string;
  goalLabel: string;
  categories: RecommendationCategory[];
  generatedAt: string;
  isAIGenerated: boolean;
}

// Fallback static recommendations by career goal when no OpenAI key
const STATIC_RECS: Record<string, Omit<AIRecommendationsResponse, "studentName" | "goalLabel" | "generatedAt" | "isAIGenerated">> = {
  founder: {
    insight: "You're on the founder track — the #1 lever is warm intros. UniConnect is scanning alumni who've founded companies, investors who back first-time founders, and professors whose research aligns with your thesis.",
    categories: [
      {
        type: "alumni", label: "Alumni to Connect With", emoji: "🤝",
        items: [
          { title: "Serial Founders in Alumni Network", description: "Alumni who have founded and exited companies — they know the exact journey you're on", why: "Peer founders are your highest-value network: co-investor intros, hiring referrals, and honest advice no VC will give you", tags: ["Founder", "Exit", "Startup"], action: "Request Introduction", urgent: true },
          { title: "Fintech & SaaS Builders", description: "Alumni running funded startups in tech-adjacent verticals who are actively hiring MBA talent", why: "They often bring on MBA co-founders or early hires from their alma mater", tags: ["SaaS", "Fintech", "Funded"], action: "View Profile" },
        ]
      },
      {
        type: "mentor", label: "Mentors Recommended", emoji: "🧭",
        items: [
          { title: "Founding CEO / Entrepreneur-in-Residence", description: "Mentor with 2+ company builds and investor relationships at Seed/Series A level", why: "You need someone who has raised a pre-seed round — they'll pressure-test your pitch and make warm intros to angels", tags: ["CEO", "EIR", "Fundraising"], action: "Book Session", urgent: true },
          { title: "Product & GTM Advisor", description: "Operator with B2B or consumer GTM experience at a startup that scaled 0→$10M ARR", why: "Execution mentors help you avoid the product-market-fit mistakes that kill 90% of startups before Series A", tags: ["GTM", "Product", "Growth"], action: "Book Session" },
        ]
      },
      {
        type: "cofounder", label: "Co-founder Matches", emoji: "🤝",
        items: [
          { title: "Technical Co-founder (CTO Profile)", description: "Engineering students or alumni with full-stack or ML background looking to build", why: "Your MBA business skills pair perfectly with a technical co-founder — this is the most common founding team pattern at YC", tags: ["CTO", "Engineering", "Full-Stack"], action: "Find Co-founders" },
        ]
      },
      {
        type: "course", label: "Courses to Take Now", emoji: "📚",
        items: [
          { title: "Entrepreneurial Finance", description: "Cap tables, term sheets, SAFE notes, and Series A mechanics taught by a practicing VC", why: "You'll need to negotiate your first term sheet within 18 months — learn the vocabulary now", tags: ["Finance", "VC", "Term Sheet"], action: "Enroll" },
          { title: "New Venture Launch", description: "Lean startup methodology with live customer discovery sprints and weekly investor feedback", why: "Forces you to talk to 50 customers in 8 weeks — the single best predictor of founder success", tags: ["Lean Startup", "Customer Discovery"], action: "Enroll" },
        ]
      },
      {
        type: "club", label: "Clubs to Join", emoji: "🏛",
        items: [
          { title: "Entrepreneurship & Innovation Club", description: "Pitch competitions, demo days, and access to the school's venture fund", why: "Competitions give you a forcing function to build and present — and judges are often alumni investors", tags: ["Pitch", "Demo Day", "Venture Fund"], action: "Join Club" },
        ]
      },
      {
        type: "internship", label: "Experience to Get", emoji: "💼",
        items: [
          { title: "Startup Internship (Pre-MBA / Summer)", description: "Internship at a Series A–B startup where you own a real function (growth, ops, or product)", why: "Hiring a founder who has seen a startup's internal chaos is what separates credible from classroom founders", tags: ["Series A", "Operator", "Growth"], action: "Explore Opportunities" },
        ]
      },
    ]
  },
  consultant: {
    insight: "Consulting recruiting moves fast — first coffee chats happen in Month 1. UniConnect is surfacing alumni at MBB and Big 4 Strategy, professors who teach case methods, and case prep resources specific to your profile.",
    categories: [
      {
        type: "alumni", label: "Alumni to Connect With", emoji: "🤝",
        items: [
          { title: "MBB Associates & Managers", description: "Alumni currently at McKinsey, BCG, or Bain who joined from this MBA program", why: "They know exactly which office, practice, and recruiter to target — and referrals dramatically increase interview chances", tags: ["MBB", "Strategy", "Referral"], action: "Request Introduction", urgent: true },
          { title: "Boutique Strategy Consultants", description: "Alumni at firms like LEK, Oliver Wyman, or Kearney — strong alternatives to MBB with higher offer rates", why: "Boutiques are less selective but equally respected in many industries — good backup and often better culture fit", tags: ["Boutique", "LEK", "Oliver Wyman"], action: "View Profile" },
        ]
      },
      {
        type: "mentor", label: "Mentors Recommended", emoji: "🧭",
        items: [
          { title: "Former McKinsey / BCG Engagement Manager", description: "Mentor who has been through the same program and is now senior enough to refer you internally", why: "An EM-level referral carries 3× the weight of a junior associate referral in the hiring process", tags: ["McKinsey", "EM", "Referral"], action: "Book Session", urgent: true },
        ]
      },
      {
        type: "course", label: "Courses to Take Now", emoji: "📚",
        items: [
          { title: "Strategic Management (Case Method)", description: "Core strategy course taught entirely with HBS-style case discussions", why: "Case interviewing is a practiced skill — every case discussion in class is free practice", tags: ["Strategy", "Cases", "HBS Method"], action: "Enroll" },
          { title: "Data-Driven Decision Making", description: "Excel and PowerPoint-heavy course mimicking real consulting deliverables", why: "Slide quality separates good consultants from great ones — learn the McKinsey pyramid principle", tags: ["Excel", "PowerPoint", "Pyramid Principle"], action: "Enroll" },
        ]
      },
      {
        type: "club", label: "Clubs to Join", emoji: "🏛",
        items: [
          { title: "Consulting Club", description: "Weekly case practice sessions, mock interviews with alumni, and firm info sessions", why: "The consulting club is where recruiting actually happens — firms watch who shows up", tags: ["Cases", "Mock Interviews", "Recruiting"], action: "Join Club", urgent: true },
        ]
      },
    ]
  },
};

function buildStaticRec(goal: string, name: string, goalLabel: string): AIRecommendationsResponse {
  const base = STATIC_RECS[goal] || STATIC_RECS["founder"];
  return { ...base, studentName: name, goalLabel, generatedAt: new Date().toISOString(), isAIGenerated: false };
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch profile data (include cached recs)
    const [{ data: profile }, { data: sp }] = await Promise.all([
      supabase.from("profiles").select("full_name, bio").eq("id", user.id).single(),
      supabase.from("student_profiles").select("program, specialization, career_goal, custom_career_goal, skills, career_interests, interests, looking_for, work_experience, gpa, batch_year, ai_recommendations, ai_recommendations_at").eq("profile_id", user.id).single(),
    ]);

    const name = profile?.full_name?.split(" ")[0] || "Student";
    const goal = sp?.career_goal || "";
    const customGoal = sp?.custom_career_goal || "";
    const goalLabel = goal === "custom" ? (customGoal || "Custom Goal") : goal.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());

    if (!goal) {
      return NextResponse.json({ error: "no_goal", message: "Student hasn't set a career goal yet" }, { status: 200 });
    }

    // Return cached recommendations (only regenerate when goal changes, which clears this)
    if (sp?.ai_recommendations) {
      const cached = sp.ai_recommendations as AIRecommendationsResponse;
      cached.studentName = name;
      cached.goalLabel = goalLabel;
      return NextResponse.json(cached);
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const hasValidKey = apiKey && apiKey.length > 10 && !apiKey.startsWith("sk-placeholder");

    if (!hasValidKey) {
      const staticRec = buildStaticRec(goal, name, goalLabel);
      // Save static recs to DB so refresh doesn't lose them
      await supabase.from("student_profiles").update({
        ai_recommendations: staticRec,
        ai_recommendations_at: new Date().toISOString(),
      }).eq("profile_id", user.id);
      return NextResponse.json(staticRec);
    }

    // Build AI prompt context
    const context = [
      `Name: ${profile?.full_name || "Unknown"}`,
      `Program: ${sp?.program || "MBA"}${sp?.specialization ? ` – ${sp.specialization}` : ""}`,
      `Batch Year: ${sp?.batch_year || "Unknown"}`,
      `GPA: ${sp?.gpa || "Not specified"}`,
      `Career Goal: ${goalLabel}${goal === "custom" ? ` (student wrote: "${customGoal}")` : ""}`,
      `Skills: ${(sp?.skills || []).join(", ") || "Not specified"}`,
      `Career Interests: ${(sp?.career_interests || []).join(", ") || "Not specified"}`,
      `Personal Interests: ${(sp?.interests || []).join(", ") || "Not specified"}`,
      `Looking For: ${(sp?.looking_for || []).join(", ") || "Not specified"}`,
      `Work Experience: ${sp?.work_experience || "Not specified"}`,
      `Bio: ${profile?.bio || "Not specified"}`,
    ].join("\n");

    const openai = new OpenAI({ apiKey });

    const systemPrompt = `You are UniConnect AI — an intelligent university network advisor for MBA students. Given a student's profile, generate hyper-personalized recommendations for who they should connect with and what they should do.

Return a JSON object with this exact structure:
{
  "insight": "2-3 sentence personalized narrative about what the AI found for this specific student. Reference their exact goal, background, and skills. Sound like a smart advisor who knows them personally.",
  "studentName": "string",
  "goalLabel": "string",
  "categories": [
    {
      "type": "alumni" | "mentor" | "course" | "club" | "research" | "internship" | "cofounder",
      "label": "string (e.g. 'Alumni to Connect With')",
      "emoji": "single emoji",
      "items": [
        {
          "title": "specific, concrete title",
          "description": "2 sentences explaining who/what this is",
          "why": "1-2 sentences explaining WHY this specific student should pursue this (reference their background/goal directly)",
          "tags": ["tag1", "tag2", "tag3"],
          "action": "CTA button label (e.g. 'Request Introduction', 'Book Session', 'Enroll', 'Join Club')",
          "urgent": boolean
        }
      ]
    }
  ],
  "generatedAt": "ISO date string",
  "isAIGenerated": true
}

Rules:
- Generate 5-7 categories covering: alumni connections, mentors, courses, clubs, and at least one of: research/internship/cofounder (based on their goal)
- 2-3 items per category
- Be SPECIFIC — don't say generic things. Reference their actual career goal, skills, and background in every "why" field.
- The insight should feel like it was written specifically for this person, not a template.
- Make urgent: true for the 2-3 most time-sensitive actions (e.g. recruiting season, limited spots)`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate personalized recommendations for this MBA student:\n\n${context}` },
      ],
      max_tokens: 2500,
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");
    result.isAIGenerated = true;
    result.generatedAt = new Date().toISOString();
    result.studentName = name;
    result.goalLabel = goalLabel;

    // Persist to DB so it survives page refreshes
    await supabase.from("student_profiles").update({
      ai_recommendations: result,
      ai_recommendations_at: result.generatedAt,
    }).eq("profile_id", user.id);

    return NextResponse.json(result);
  } catch (err) {
    console.error("AI recommendations error:", err);
    return NextResponse.json({ error: "generation_failed" }, { status: 500 });
  }
}
