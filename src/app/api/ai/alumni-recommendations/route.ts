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

    const [{ data: profile }, { data: sp }] = await Promise.all([
      supabase.from("profiles").select("full_name, bio").eq("id", user.id).single(),
      supabase.from("alumni_profiles").select("company, job_title, industry, expertise_areas, open_to_mentor, open_to_hire, batch_year, program, ai_recommendations, ai_recommendations_at").eq("id", user.id).single(),
    ]);

    // Return cached recommendations if available
    if (sp?.ai_recommendations) {
      return NextResponse.json(sp.ai_recommendations as AIRecommendationsResult);
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const hasValidKey = apiKey && apiKey.length > 10 && !apiKey.startsWith("sk-placeholder");

    const staticRec: AIRecommendationsResult = {
      insight: `You're a ${sp?.job_title || "professional"} at ${sp?.company || "your company"}. UniConnect found students who match your hiring profile, early-career founders in your space, and research collaborations relevant to your expertise.`,
      categories: [
        {
          type: "hiring",
          label: "Students to Hire",
          emoji: "💼",
          items: [
            {
              title: "MBA Students Matching Your Hiring Profile",
              description: "Students with backgrounds aligned with your company's domain and open roles",
              why: `As a ${sp?.job_title || "professional"} in ${sp?.industry || "your industry"}, these students are building the exact skills you value in candidates`,
              tags: [sp?.industry || "Industry", "MBA", "Hiring"],
              action: "View Candidates",
              urgent: true,
            },
            {
              title: "Internship Candidates",
              description: "Rising second-year MBA students looking for summer internships in your sector",
              why: "Internships are the highest-conversion hiring channel from MBA programs — many convert to full-time offers",
              tags: ["Internship", "Summer", "MBA"],
              action: "Post Internship",
            },
          ],
        },
        {
          type: "mentor",
          label: "Students to Mentor",
          emoji: "🧭",
          items: [
            {
              title: "Students on the Same Career Path",
              description: "First-year MBA students who want to enter your industry and need a guide",
              why: `Your journey into ${sp?.industry || "your field"} is exactly what these students need to map their own path`,
              tags: ["Mentoring", "Career", sp?.industry || "Industry"],
              action: "Accept Mentees",
              urgent: sp?.open_to_mentor === true,
            },
          ],
        },
        {
          type: "cofounder",
          label: "Founders to Back",
          emoji: "🚀",
          items: [
            {
              title: "Student Startups in Your Domain",
              description: "MBA students building companies in sectors where your expertise adds real value",
              why: "Alumni advisors with domain expertise are the #1 thing early-stage founders say they need most",
              tags: ["Startup", "Advisory", "Equity"],
              action: "Explore Startups",
            },
          ],
        },
        {
          type: "research",
          label: "Research Collaborations",
          emoji: "🔬",
          items: [
            {
              title: "Faculty Researching Your Industry",
              description: "Professors doing applied research in areas directly relevant to your company's strategy",
              why: "Industry-academia partnerships often surface market insights 2–3 years ahead of the competition",
              tags: ["Research", "Faculty", "Innovation"],
              action: "View Research",
            },
          ],
        },
      ],
      generatedAt: new Date().toISOString(),
      isAIGenerated: false,
    };

    if (!hasValidKey) {
      try {
        await supabase.from("alumni_profiles").update({
          ai_recommendations: staticRec,
          ai_recommendations_at: staticRec.generatedAt,
        }).eq("id", user.id);
      } catch (_) { /* ignore save failure */ }
      return NextResponse.json(staticRec);
    }

    // Build AI prompt context
    const context = [
      `Name: ${profile?.full_name || "Unknown"}`,
      `Job Title: ${sp?.job_title || "Not specified"}`,
      `Company: ${sp?.company || "Not specified"}`,
      `Industry: ${sp?.industry || "Not specified"}`,
      `Expertise Areas: ${(sp?.expertise_areas || []).join(", ") || "Not specified"}`,
      `Open to Mentor: ${sp?.open_to_mentor ? "Yes" : "No"}`,
      `Open to Hire: ${sp?.open_to_hire ? "Yes" : "No"}`,
      `Batch Year: ${sp?.batch_year || "Not specified"}`,
      `Program: ${sp?.program || "MBA"}`,
      `Bio: ${profile?.bio || "Not specified"}`,
    ].join("\n");

    const openai = new OpenAI({ apiKey });

    const systemPrompt = `You are UniConnect AI advising an MBA alumni professional. Generate personalized recommendations for: students to mentor, candidates to hire, startups to advise/invest in, and research collaborations. Each recommendation should reference their specific job title, company, industry, and expertise. Return JSON with: insight(string), categories(array with type/label/emoji/items where items have title/description/why/tags/action/urgent), generatedAt(ISO string), isAIGenerated:true.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate personalized recommendations for this MBA alumni:\n\n${context}` },
      ],
      max_tokens: 2500,
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}") as AIRecommendationsResult;
    result.isAIGenerated = true;
    result.generatedAt = new Date().toISOString();

    try {
      await supabase.from("alumni_profiles").update({
        ai_recommendations: result,
        ai_recommendations_at: result.generatedAt,
      }).eq("id", user.id);
    } catch (_) { /* ignore save failure */ }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Alumni AI recommendations error:", err);
    return NextResponse.json({ error: "generation_failed" }, { status: 500 });
  }
}
