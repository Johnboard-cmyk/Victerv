const profileContext = `You are the VicterV profile assistant. Answer naturally and directly. Verified facts: VicterV is a Fortnite professional from North America Central. Battle Royale teammate: Queasy. Reload teammate: Khanada. Current tracker snapshot: $89,665 all-time earnings, 345 events played, recent highlighted PR 966. Recent results include #10 Performance Evaluation Event 5 Round 2, #12 Round 1, #29 FNCS Major 2 Play-In Cumulative, and #43 Solo Victory Cup Day 3 Round 2. Upcoming events: FNCS Major 2 Finals, FNCS Global Championship Last Chance, Reload Elite Series at EWC 26 in Paris, Global Championship, and FNCS Solos. Socials: @VicterV_ on X, itsvicterv on Twitch, and @fnvicterv on YouTube. Do not invent VicterV-specific facts. If a fact is not known, say so and point the user to the relevant profile link. Keep answers concise.`;

function localAnswer(question: string) {
  const q = question.toLowerCase();
  if (q.includes("best placement") || q.includes("best result")) return "VicterV’s strongest listed result is a first-place FNCS Major 1 win with Queasy, according to the profile data.";
  if (q.includes("earn") || q.includes("money")) return "The current tracker snapshot shows $89,665 in all-time earnings.";
  if (q.includes("team") || q.includes("teammate")) return "VicterV plays Battle Royale with Queasy and Reload with Khanada.";
  if (q.includes("twitch") || q.includes("stream")) return "VicterV’s Twitch is twitch.tv/itsvicterv.";
  if (q.includes("youtube")) return "VicterV’s YouTube is youtube.com/@fnvicterv.";
  return "I can answer about VicterV’s results, earnings, events, teammates, drop spots, and socials. The live AI connection is not responding right now, so try asking one of those directly.";
}

export async function POST(request: Request) {
  try {
    const { question } = await request.json();
    if (!question || typeof question !== "string") return Response.json({ error: "Ask a question first." }, { status: 400 });
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) return Response.json({ answer: localAnswer(question), source: "profile fallback" });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST", signal: controller.signal,
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "HTTP-Referer": "https://victerv.netlify.app", "X-Title": "VicterV Profile" },
      body: JSON.stringify({ model: "openrouter/free", messages: [{ role: "system", content: profileContext }, { role: "user", content: question }], max_tokens: 350 }),
    });
    clearTimeout(timeout);
    if (!response.ok) return Response.json({ answer: localAnswer(question), source: "profile fallback", providerError: `AI provider returned ${response.status}. Check that OPENROUTER_API_KEY is valid.` });
    const data = await response.json();
    return Response.json({ answer: data.choices?.[0]?.message?.content || localAnswer(question) });
  } catch {
    return Response.json({ answer: localAnswer("general"), source: "profile fallback", providerError: "The AI provider timed out or was unavailable." });
  }
}
