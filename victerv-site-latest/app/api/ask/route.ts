const profileContext = `You are the VicterV profile assistant. Answer the user's question directly and naturally. Use this verified profile context when relevant: VicterV is a Fortnite professional from North America Central. He plays Battle Royale with Queasy and Reload with Khanada. Current Tracker snapshot: $89,665 all-time earnings, 345 events played, and recent highlighted PR of 966. Recent results include #10 in Performance Evaluation Event 5 Round 2, #12 in Round 1, #29 in FNCS Major 2 Play-In Cumulative, and #43 in Solo Victory Cup Day 3 Round 2. Upcoming events include FNCS Major 2 Finals, FNCS Global Championship Last Chance, Reload Elite Series at EWC 26 in Paris, Global Championship, and FNCS Solos. His socials are @VicterV_ on X, itsvicterv on Twitch, and @fnvicterv on YouTube. If the question is outside this context, answer helpfully but do not invent VicterV-specific facts. Keep answers concise.`;

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return Response.json({ error: "The AI assistant is not configured yet. Add OPENROUTER_API_KEY in Netlify environment variables." }, { status: 503 });

  try {
    const { question } = await request.json();
    if (!question || typeof question !== "string") return Response.json({ error: "Ask a question first." }, { status: 400 });
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "HTTP-Referer": "https://victerv.netlify.app", "X-Title": "VicterV Profile" },
      body: JSON.stringify({ model: "openrouter/free", messages: [{ role: "system", content: profileContext }, { role: "user", content: question }], max_tokens: 350 }),
    });
    if (!response.ok) throw new Error(`OpenRouter returned ${response.status}`);
    const data = await response.json();
    return Response.json({ answer: data.choices?.[0]?.message?.content || "I couldn't find an answer for that." });
  } catch {
    return Response.json({ error: "The AI assistant is temporarily unavailable. Try again in a moment." }, { status: 502 });
  }
}
