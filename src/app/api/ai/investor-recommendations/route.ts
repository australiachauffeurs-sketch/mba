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

    const [{ data: profile }, { data: ip }] = await Promise.all([
      supabase.from("profiles").select("full_name, bio").eq("id", user.id).single(),
      supabase.from("investor_profiles").select("firm, industries, stage_focus, check_size_min, check_size_max, thesis_description, geographies, ai_recommendations, ai_recommendations_at").eq("profile_id", user.id).single(),
    ]);

    // Return cached recommendations if available
    if (ip?.ai_recommendations) {
      return NextResponse.json(ip.ai_recommendations as AIRecommendationsResult);
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const hasValidKey = apiKey && apiKey.length > 10 && !apiKey.startsWith("sk-placeholder");

    const sectorsStr = (ip?.industries || []).join(", ") || "your focus sectors";
    const stageFocusStr = (ip?.stage_focus || []).join(", ") || "early stage";
    const firmLabel = ip?.firm || "your firm";
    const checkSizeLabel = ip?.check_size_min && ip?.check_size_max
      ? `$${ip.check_size_min}k–$${ip.check_size_max}k`
      : ip?.check_size_min ? `$${ip.check_size_min}k+` : "Not specified";

    const staticRec: AIRecommendationsResult = {
      insight: `You're an investor at ${firmLabel} focused on ${sectorsStr}. UniConnect identified ${stageFocusStr} founders building in your thesis areas, co-investors with overlapping mandates, and research with near-term commercial potential.`,
      categories: [
        {
          type: "startups",
          label: "Startups Matching Your Thesis",
          emoji: "🚀",
          items: [
            {
              title: `${stageFocusStr.split(",")[0].trim()} Startups in ${sectorsStr.split(",")[0].trim()}`,
              description: `MBA student and alumni-founded companies in ${sectorsStr} currently raising their first or second round`,
              why: `Your ${checkSizeLabel} check size and ${sectorsStr} focus make you the ideal lead or follow investor for these teams`,
              tags: [stageFocusStr.split(",")[0].trim(), sectorsStr.split(",")[0].trim(), "Raising"],
              action: "View Deal Flow",
              urgent: true,
            },
            {
              title: "Startups with MVP Traction",
              description: "Early-stage companies with initial revenue or strong user growth looking for institutional backing",
              why: `Traction-stage companies in your thesis sectors de-risk the investment and fit your ${ip?.stage_focus?.includes("seed") ? "Seed" : "early"} mandate`,
              tags: ["Traction", "Revenue", "Growth"],
              action: "Review Startups",
            },
          ],
        },
        {
          type: "founders",
          label: "Founders to Meet",
          emoji: "👥",
          items: [
            {
              title: "Alumni Founders with Domain Expertise",
              description: `MBA graduates who built careers in ${sectorsStr} and are now founding companies in the same space`,
              why: "Domain-expert founders have a 2× higher success rate at Series A — they know the problem from the inside",
              tags: ["Domain Expert", "Alumni", "Founder"],
              action: "Meet Founders",
              urgent: true,
            },
            {
              title: "Second-Time Founders in Network",
              description: "Alumni who have previously built and exited a company and are now on their next venture",
              why: "Repeat founders return 3× more capital on average — and this network gives you warm access before they open a competitive round",
              tags: ["Serial Founder", "Exit", "Track Record"],
              action: "View Profiles",
            },
          ],
        },
        {
          type: "coinvestors",
          label: "Co-investors to Syndicate With",
          emoji: "🤝",
          items: [
            {
              title: `Investors with Overlapping Thesis`,
              description: `Investors in the UniConnect network focused on ${sectorsStr} at similar stages looking to co-invest`,
              why: "Syndicate partners with thesis alignment share deal flow, reduce concentration risk, and bring complementary value-add to portfolio companies",
              tags: ["Syndicate", "Co-invest", sectorsStr.split(",")[0].trim()],
              action: "Find Co-investors",
            },
          ],
        },
        {
          type: "research",
          label: "Research with Commercial Potential",
          emoji: "🔬",
          items: [
            {
              title: `Faculty Research in ${sectorsStr.split(",")[0].trim()}`,
              description: `University professors doing applied research that could become defensible IP in your target sectors`,
              why: "Academic spinouts backed at the research stage give you first-mover advantage before IP is licensed or spun out competitively",
              tags: ["Deep Tech", "IP", "Academic"],
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
        await supabase.from("investor_profiles").update({
          ai_recommendations: staticRec,
          ai_recommendations_at: staticRec.generatedAt,
        }).eq("profile_id", user.id);
      } catch (_) { /* ignore save failure */ }
      return NextResponse.json(staticRec);
    }

    const context = [
      `Name: ${profile?.full_name || "Unknown"}`,
      `Firm: ${firmLabel}`,
      `Sectors / Industries: ${sectorsStr}`,
      `Stage Focus: ${stageFocusStr}`,
      `Check Size: ${checkSizeLabel}`,
      `Geographies: ${(ip?.geographies || []).join(", ") || "Not specified"}`,
      `Investment Thesis: ${ip?.thesis_description || "Not specified"}`,
      `Bio: ${profile?.bio || "Not specified"}`,
    ].join("\n");

    const openai = new OpenAI({ apiKey });

    const systemPrompt = `You are UniConnect AI advising a venture investor. Generate recommendations for: startups matching their investment thesis, founders to meet, co-investors, and research with commercial potential. Reference their specific sectors, stage focus, and check size. Return JSON with: insight(string), categories(array with type/label/emoji/items where items have title/description/why/tags/action/urgent), generatedAt(ISO string), isAIGenerated:true.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate personalized recommendations for this investor:\n\n${context}` },
      ],
      max_tokens: 2500,
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}") as AIRecommendationsResult;
    result.isAIGenerated = true;
    result.generatedAt = new Date().toISOString();

    try {
      await supabase.from("investor_profiles").update({
        ai_recommendations: result,
        ai_recommendations_at: result.generatedAt,
      }).eq("profile_id", user.id);
    } catch (_) { /* ignore save failure */ }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Investor AI recommendations error:", err);
    return NextResponse.json({ error: "generation_failed" }, { status: 500 });
  }
}
