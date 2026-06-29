import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

export interface AIRecommendationItem {
  title: string;
  description: string;
  why: string;
  tags: string[];
  action: string;
  urgent?: boolean;
}

export interface AIRecommendationCategory {
  type: string;
  label: string;
  emoji: string;
  items: AIRecommendationItem[];
}

export interface AIRecommendationsResult {
  insight: string;
  categories: AIRecommendationCategory[];
  generatedAt: string;
  isAIGenerated: boolean;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [{ data: profile }, { data: fp }] = await Promise.all([
      supabase.from("profiles").select("full_name, bio").eq("id", user.id).single(),
      supabase.from("faculty_profiles").select("department, title, research_areas, open_to_collaboration, ai_recommendations, ai_recommendations_at").eq("profile_id", user.id).single(),
    ]);

    // Return cached recommendations if available
    if (fp?.ai_recommendations) {
      return NextResponse.json(fp.ai_recommendations as AIRecommendationsResult);
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const hasValidKey = apiKey && apiKey.length > 10 && !apiKey.startsWith("sk-placeholder");

    const researchAreasStr = (fp?.research_areas || []).join(", ") || "your research areas";

    const staticRec: AIRecommendationsResult = {
      insight: `You're a ${fp?.title || "faculty member"} in ${fp?.department || "your department"}. UniConnect is surfacing students whose interests align with your research, industry partners, and grant opportunities to advance your work.`,
      categories: [
        {
          type: "students",
          label: "Students for Research",
          emoji: "🎓",
          items: [
            {
              title: "PhD & MBA Students Aligned with Your Research",
              description: `Students whose thesis topics and interests overlap with ${researchAreasStr}`,
              why: `Your research in ${researchAreasStr} is exactly the kind of applied work that ambitious graduate students want to build on`,
              tags: ["PhD", "MBA", "Research Assistant"],
              action: "View Students",
              urgent: true,
            },
            {
              title: "Students Seeking Research Mentorship",
              description: "High-performing students looking for a faculty research mentor for independent study or capstone projects",
              why: `Mentoring students in your domain extends your research reach and often surfaces fresh perspectives on ${researchAreasStr}`,
              tags: ["Mentorship", "Capstone", "Independent Study"],
              action: "Review Applications",
            },
          ],
        },
        {
          type: "research_grant",
          label: "Grant Opportunities",
          emoji: "💰",
          items: [
            {
              title: "Government Research Grants in Your Domain",
              description: `Active funding cycles from NSF, NIH, or domain-specific agencies aligned with ${researchAreasStr}`,
              why: `Your focus on ${researchAreasStr} and track record position you well for competitive grant applications in this cycle`,
              tags: ["Grant", "NSF", "Funding"],
              action: "Explore Grants",
              urgent: true,
            },
            {
              title: "Industry-Sponsored Research Fellowships",
              description: "Corporate R&D labs offering co-funded research partnerships with academia",
              why: "Industry co-funding dramatically accelerates timelines and provides real-world data access that purely academic grants rarely offer",
              tags: ["Industry", "Fellowship", "R&D"],
              action: "View Fellowships",
            },
          ],
        },
        {
          type: "industry_partner",
          label: "Industry Partners",
          emoji: "🏢",
          items: [
            {
              title: "Companies Doing Applied Work in Your Research Area",
              description: `Organizations whose product and R&D investments directly overlap with ${researchAreasStr}`,
              why: "Industry partnerships give your research access to proprietary datasets, real deployment environments, and publication co-authorship opportunities",
              tags: ["Partnership", "Applied Research", "Data Access"],
              action: "Explore Partners",
            },
          ],
        },
        {
          type: "collaborator",
          label: "Alumni & Investor Collaborators",
          emoji: "🤝",
          items: [
            {
              title: "Alumni in Research-Adjacent Industries",
              description: `MBA graduates now working in sectors that apply ${researchAreasStr} at scale`,
              why: "Alumni bridges between academia and industry open doors to sponsored research, conference introductions, and advisory board roles",
              tags: ["Alumni", "Advisory", "Bridge"],
              action: "View Alumni",
            },
            {
              title: "Investors Interested in Research Commercialization",
              description: "Venture investors and angels who actively back academic spinouts and IP licensing deals",
              why: `If your research in ${researchAreasStr} has commercial potential, early investor conversations shape what's patentable and fundable`,
              tags: ["VC", "IP", "Spinout"],
              action: "Meet Investors",
            },
          ],
        },
      ],
      generatedAt: new Date().toISOString(),
      isAIGenerated: false,
    };

    if (!hasValidKey) {
      try {
        await supabase.from("faculty_profiles").update({
          ai_recommendations: staticRec,
          ai_recommendations_at: staticRec.generatedAt,
        }).eq("profile_id", user.id);
      } catch (_) { /* ignore save failure */ }
      return NextResponse.json(staticRec);
    }

    const context = [
      `Name: ${profile?.full_name || "Unknown"}`,
      `Title: ${fp?.title || "Not specified"}`,
      `Department: ${fp?.department || "Not specified"}`,
      `Research Areas: ${researchAreasStr}`,
      `Open to Collaboration: ${fp?.open_to_collaboration ? "Yes" : "No"}`,
      `Bio: ${profile?.bio || "Not specified"}`,
    ].join("\n");

    const openai = new OpenAI({ apiKey });

    const systemPrompt = `You are UniConnect AI advising a university faculty member. Generate recommendations for: students interested in their research, industry partners, grant opportunities, and alumni collaborators. Reference their specific research areas, department, and publications. Return JSON with: insight(string), categories(array with type/label/emoji/items where items have title/description/why/tags/action/urgent), generatedAt(ISO string), isAIGenerated:true.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate personalized recommendations for this faculty member:\n\n${context}` },
      ],
      max_tokens: 2500,
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}") as AIRecommendationsResult;
    result.isAIGenerated = true;
    result.generatedAt = new Date().toISOString();

    try {
      await supabase.from("faculty_profiles").update({
        ai_recommendations: result,
        ai_recommendations_at: result.generatedAt,
      }).eq("profile_id", user.id);
    } catch (_) { /* ignore save failure */ }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Faculty AI recommendations error:", err);
    return NextResponse.json({ error: "generation_failed" }, { status: 500 });
  }
}
