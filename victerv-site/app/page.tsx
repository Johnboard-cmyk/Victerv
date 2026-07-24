"use client";

import { FormEvent, useEffect, useState } from "react";

const trackerUrl = "https://fortnitetracker.com/profile/kbm/DIG%20Vict%D0%B5rV/events?region=GLOBAL";
const liquipediaUrl = "https://liquipedia.net/fortnite/VicterV";
const ewcUrl = "https://esportsworldcup.com/en/competitions/2026/fortnite";

const events = [
  { title: "FNCS Major 2 Finals", date: "Jul 18 — Aug 02", location: "NAC", detail: "Online team finals", source: trackerUrl, color: "violet" },
  { title: "FNCS Global Championship Last Chance", date: "Aug 03 — Aug 14", location: "NAC", detail: "Online qualification", source: trackerUrl, color: "pink" },
  { title: "Reload Elite Series at EWC 26", date: "Aug 19 — Aug 22", location: "Riyadh · LAN", detail: "Reload competition", source: ewcUrl, color: "cyan" },
  { title: "Global Championship", date: "Sep 26 — Sep 27", location: "LAN", detail: "Global championship", source: ewcUrl, color: "yellow" },
  { title: "FNCS Solos", date: "October 2026", location: "NAC", detail: "Online solo event", source: trackerUrl, color: "lime" },
];

const placements = [
  { event: "Performance Evaluation · Event 5 Round 2", date: "Jul 23", place: "#10", result: "625 PR", team: "Queasy + VicterV" },
  { event: "Performance Evaluation · Event 5 Round 1", date: "Jul 23", place: "#12", result: "305 PR", team: "Queasy + VicterV" },
  { event: "FNCS Major 2 Play-In · Cumulative", date: "Jul 19", place: "#29", result: "966 PR", team: "Queasy + VicterV" },
  { event: "Solo Victory Cup · Day 3 Round 2", date: "Jul 18", place: "#43", result: "$100", team: "Solo" },
];

const socialCards = [
  { type: "TWITCH", title: "VicterV on Twitch", copy: "The stream preview lives here when he goes live.", button: "Open stream", href: "https://lnktr.ee/victerv", visual: "stream" },
  { type: "YOUTUBE", title: "Latest on YouTube", copy: "Videos, highlights, and tournament uploads.", button: "Watch videos", href: "https://lnktr.ee/victerv", visual: "youtube" },
  { type: "X", title: "@VicterV_", copy: "Posts, announcements, and tournament updates.", button: "View posts", href: "https://x.com/VicterV_", visual: "post" },
  { type: "CLIPS", title: "@VicterVClips", copy: "The best moments from the run.", button: "Watch clips", href: "https://x.com/VicterVClips", visual: "clip" },
  { type: "UPDATES", title: "@VicterVUpdates", copy: "Community news and profile updates.", button: "See updates", href: "https://x.com/VicterVUpdates", visual: "update" },
  { type: "DISCORD", title: "The Discord", copy: "Join the community around VicterV.", button: "Join server", href: "https://discord.gg/bvuKDb5yxJ", visual: "discord" },
];

type LiveData = { earnings: string; eventsPlayed: string; latestPr: string; placements: typeof placements; updatedAt: string; live: boolean };
const initialLiveData: LiveData = { earnings: "$89,665", eventsPlayed: "345", latestPr: "966", placements, updatedAt: "", live: false };

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<(typeof events)[number] | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("Ask about VicterV's stats, region, teammates, events, or socials.");
  const [asking, setAsking] = useState(false);
  const [liveData, setLiveData] = useState<LiveData>(initialLiveData);

  useEffect(() => {
    fetch("/api/player-data", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: LiveData) => setLiveData(data))
      .catch(() => undefined);
  }, []);

  async function ask(event: FormEvent) {
    event.preventDefault();
    if (!question.trim() || asking) return;
    setAsking(true);
    try {
      const response = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question }) });
      const data = await response.json();
      setAnswer(data.answer || data.error || "I couldn't answer that right now.");
    } catch {
      setAnswer("The AI assistant is temporarily unavailable. Try again in a moment.");
    } finally {
      setAsking(false);
    }
  }

  return (
    <main className="site-shell">
      <div className="rainbow-line" />
      <nav className="topbar"><a className="wordmark" href="#top"><span>DIG</span> VICTERV<span className="spark">✦</span></a><div className="nav-links"><a href="#results">Results</a><a href="#timeline">Events</a><a href="#socials">Socials</a><a href="#ask">Ask AI</a></div><a className="nav-source" href={trackerUrl} target="_blank" rel="noreferrer">Profile <Arrow /></a></nav>

      <section className="hero" id="top"><div className="hero-copy"><p className="eyebrow">DIG · VICTERV</p><h1>Youngest<br /><span>Fortnite pro.</span></h1><p className="hero-bio">A North America Central player making noise on Dignitas.</p><a className="hero-button" href="#results">See the results <Arrow /></a></div><div className="hero-photo-wrap"><div className="photo-glow" /><div className="hero-photo-card"><img src="/victerv-profile.png" alt="VicterV competing at a LAN" /><div className="photo-stamp">DIG<br /><b>VICTERV</b></div></div></div></section>

      <section className="stats-section"><div className="stats-grid"><article className="stat-card stat-feature"><small>EARNINGS</small><strong>{liveData.earnings}</strong><span>all time</span></article><article className="stat-card"><small>EVENTS</small><strong>{liveData.eventsPlayed}</strong><span>played</span></article><article className="stat-card"><small>RECENT PR</small><strong>{liveData.latestPr}</strong><span>latest highlighted result</span></article><a className="profile-cta" href={trackerUrl} target="_blank" rel="noreferrer"><span>Full profile</span><strong>↗</strong><small>{liveData.live ? "Updated just now" : "Tracker reconnecting"}</small></a></div></section>

      <section className="intro-section"><div><p className="eyebrow dark">THE PLAYER</p><h2>Good at<br /><em>the game.</em></h2></div><div className="file-copy"><p>VicterV is a Dignitas Fortnite pro from North America Central. His current Battle Royale teammate is Queasy, and he plays Reload with Khanada.</p><a href={liquipediaUrl} target="_blank" rel="noreferrer">More on Liquipedia <Arrow /></a></div></section>

      <section className="results-section" id="results"><div className="section-heading"><div><p className="eyebrow">RECENT RUNS</p><h2>Results</h2></div><a href={trackerUrl} target="_blank" rel="noreferrer">Full event history <Arrow /></a></div><div className="placement-table">{liveData.placements.map((item) => <a className="placement-row" href={trackerUrl} target="_blank" rel="noreferrer" key={item.event}><div><strong>{item.event}</strong><span>{item.team}</span></div><time>{item.date}</time><strong className="place">{item.place}</strong><span className="result">{item.result}</span><Arrow /></a>)}</div></section>

      <section className="timeline-section" id="timeline"><div className="section-heading"><div><p className="eyebrow">WHAT'S NEXT</p><h2>Follow<br /><span>the run.</span></h2></div><p className="section-note">Tap an event for the details and official link.</p></div><div className="event-road">{events.map((event, index) => <button className={`road-event ${event.color} ${index % 2 ? "right" : "left"}`} key={event.title} onClick={() => setSelectedEvent(event)}><span className="road-dot" /><span className="road-date">{event.date}</span><strong>{event.title}</strong><small>{event.location} · {event.detail}</small><Arrow /></button>)}</div></section>

      <section className="squad-section"><div className="section-heading"><div><p className="eyebrow">THE SQUAD</p><h2>Who’s<br /><span>with him.</span></h2></div><p className="section-note">Current teammates, former teammates, and the coach behind the scenes.</p></div><div className="roster"><article><b className="roster-mark pink">Q</b><div><strong>Queasy</strong><span>Battle Royale teammate</span></div></article><article><b className="roster-mark cyan">K</b><div><strong>Khanada</strong><span>Reload teammate</span></div></article><article><b className="roster-mark yellow">P</b><div><strong>Pops</strong><span>Coach / manager</span></div></article></div><p className="former">Former teammates: Paper · Epikwhale · Minit · Ark</p></section>

      <section className="socials-section" id="socials"><div className="section-heading"><div><p className="eyebrow">EVERYWHERE ELSE</p><h2>See him<br /><span>in action.</span></h2></div><p className="section-note">Previews for the places VicterV posts, streams, and hangs out.</p></div><div className="social-grid">{socialCards.map((card) => <a className="social-card-new" href={card.href} target="_blank" rel="noreferrer" key={card.type}><div className={`social-preview ${card.visual}`}><span>{card.type}</span>{card.visual === "stream" && <b className="live-pill">● LIVE WHEN STREAMING</b>}{card.visual === "post" && <p>“The grind continues.”<small>@VicterV_ · X</small></p>}{card.visual === "clip" && <div className="clip-bars"><i /><i /><i /><i /></div>}{card.visual === "youtube" && <b className="play">▶</b>}</div><div className="social-card-copy"><strong>{card.title}</strong><span>{card.copy}</span><b>{card.button} <Arrow /></b></div></a>)}</div></section>

      <section className="ask-section" id="ask"><div className="ask-copy"><p className="eyebrow">QUESTIONS?</p><h2>Ask about<br /><span>VicterV.</span></h2><p>Ask anything about his results, teammates, events, career, or socials.</p><form onSubmit={ask}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask anything about VicterV" aria-label="Ask about VicterV" /><button type="submit" disabled={asking}>{asking ? "Thinking…" : "Ask"} <Arrow /></button></form><div className="answer"><span>ANSWER</span><p>{answer}</p></div></div></section>

      <footer><a className="wordmark" href="#top"><span>DIG</span> VICTERV<span className="spark">✦</span></a><span>2026</span></footer>
      {selectedEvent && <div className="modal-backdrop" onClick={() => setSelectedEvent(null)}><div className="event-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedEvent(null)}>×</button><p className={`eyebrow ${selectedEvent.color}`}>{selectedEvent.location}</p><h2>{selectedEvent.title}</h2><div className="modal-details"><div><small>DATES</small><strong>{selectedEvent.date}, 2026</strong></div><div><small>FORMAT</small><strong>{selectedEvent.detail}</strong></div><div><small>COMPETING?</small><strong>Yes</strong></div><div><small>DETAILS</small><strong>Official source</strong></div></div><a className="modal-link" href={selectedEvent.source} target="_blank" rel="noreferrer">Open event details <Arrow /></a></div></div>}
    </main>
  );
}
