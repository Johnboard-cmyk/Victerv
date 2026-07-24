const TRACKER_URL = "https://fortnitetracker.com/profile/kbm/DIG%20Vict%D0%B5rV/events?region=GLOBAL";

const fallbackPlacements = [
  { event: "Performance Evaluation · Event 5 Round 2", date: "Jul 23", place: "#10", result: "625 PR", team: "Queasy + VicterV" },
  { event: "Performance Evaluation · Event 5 Round 1", date: "Jul 23", place: "#12", result: "305 PR", team: "Queasy + VicterV" },
  { event: "FNCS Major 2 Play-In · Cumulative", date: "Jul 19", place: "#29", result: "966 PR", team: "Queasy + VicterV" },
  { event: "Solo Victory Cup · Day 3 Round 2", date: "Jul 18", place: "#43", result: "$100", team: "Solo" },
];

function plainText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function nearby(text: string, phrase: string) {
  const start = text.toLowerCase().indexOf(phrase.toLowerCase());
  return start === -1 ? "" : text.slice(start, start + 420);
}

function extractPlacements(text: string) {
  return fallbackPlacements.map((fallback) => {
    const window = nearby(text, fallback.event);
    if (!window) return fallback;
    const place = window.match(/#\s*(\d{1,4})/)?.[1];
    const pr = window.match(/(\d+(?:\.\d+)?)\s*PR/i)?.[1];
    const money = window.match(/\$\s*[\d,]+/)?.[0];
    return { ...fallback, place: place ? `#${place}` : fallback.place, result: money || (pr ? `${pr} PR` : fallback.result) };
  });
}

export async function GET() {
  try {
    const response = await fetch(TRACKER_URL, {
      cache: "no-store",
      headers: { "User-Agent": "VicterV-profile/1.0 (+https://fortnitetracker.com)" },
    });
    if (!response.ok) throw new Error(`Tracker returned ${response.status}`);
    const text = plainText(await response.text());
    const earnings = text.match(/\$\s*[\d,]+/)?.[0]?.replace(/\s+/g, "") || "$89,665";
    const eventsPlayed = text.match(/Events\s+(\d{1,5})/i)?.[1] || "345";
    const latestPr = text.match(/(\d+(?:\.\d+)?)\s*PR/i)?.[1] || "966";
    return Response.json({ earnings, eventsPlayed, latestPr, placements: extractPlacements(text), updatedAt: new Date().toISOString(), live: true });
  } catch {
    return Response.json({ earnings: "$89,665", eventsPlayed: "345", latestPr: "966", placements: fallbackPlacements, updatedAt: new Date().toISOString(), live: false });
  }
}
