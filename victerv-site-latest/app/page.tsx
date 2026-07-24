"use client";

import { FormEvent, useEffect, useState } from "react";

const trackerUrl = "https://fortnitetracker.com/profile/kbm/DIG%20Vict%D0%B5rV/events?region=GLOBAL";
const liquipediaUrl = "https://liquipedia.net/fortnite/VicterV";
const ewcUrl = "https://esportsworldcup.com/en/competitions/2026/fortnite";

const events = [
  { title: "FNCS Major 2 Finals", date: "Jul 18 — Aug 02", location: "NAC", detail: "Duos · Online", source: trackerUrl, color: "violet" },
  { title: "FNCS Global Championship Last Chance", date: "Aug 03 — Aug 14", location: "NAC", detail: "Duos · Online", source: trackerUrl, color: "pink" },
  { title: "Reload Elite Series at EWC 26", date: "Aug 19 — Aug 22", location: "Paris · LAN", detail: "Duos · Reload", source: ewcUrl, color: "cyan" },
  { title: "Global Championship", date: "Sep 26 — Sep 27", location: "LAN", detail: "Duos · Global finals", source: ewcUrl, color: "yellow" },
  { title: "FNCS Solos", date: "October 2026", location: "NAC", detail: "Solos · Online", source: trackerUrl, color: "lime" },
];

const placements = [
  { event: "Performance Evaluation · Event 5 Round 2", date: "Jul 23", place: "#10", result: "625 PR", team: "Queasy + VicterV" },
  { event: "Performance Evaluation · Event 5 Round 1", date: "Jul 23", place: "#12", result: "305 PR", team: "Queasy + VicterV" },
  { event: "FNCS Major 2 Play-In · Cumulative", date: "Jul 19", place: "#29", result: "966 PR", team: "Queasy + VicterV" },
  { event: "Solo Victory Cup · Day 3 Round 2", date: "Jul 18", place: "#43", result: "$100", team: "Solo" },
];

const socialCards = [
  { type: "TWITCH", title: "VicterV on Twitch", copy: "Live streams and tournament watch-alongs.", button: "Open Twitch", href: "https://www.twitch.tv/itsvicterv", visual: "stream" },
  { type: "YOUTUBE", title: "Latest on YouTube", copy: "Videos, highlights, and tournament uploads.", button: "Open YouTube", href: "https://www.youtube.com/@fnvicterv", visual: "youtube" },
  { type: "X", title: "@VicterV_", copy: "Posts and announcements.", button: "View posts", href: "https://x.com/VicterV_", visual: "post" },
  { type: "CLIPS", title: "@VicterVClips", copy: "The best moments from the run.", button: "Watch clips", href: "https://x.com/VicterVClips", visual: "clip" },
  { type: "UPDATES", title: "@VicterVUpdates", copy: "Community news and updates.", button: "See updates", href: "https://x.com/VicterVUpdates", visual: "update" },
  { type: "DISCORD", title: "The Discord", copy: "Join the VicterV community.", button: "Join server", href: "https://discord.gg/bvuKDb5yxJ", visual: "discord" },
];

const teammateData = {
  "Battle Royale": { teammate: "Queasy", coach: "Buzzavita", drop: "Sandy Strip", image: "/drop-queasy.png", note: "Current duo · Chapter 7 Season 2" },
  Reload: { teammate: "Khanada", coach: "No coach listed", drop: "Reload drop spot", image: "/drop-khanada-reload.png", note: "Current duo · Reload" },
};

type LiveData = { earnings: string; eventsPlayed: string; latestPr: string; placements: typeof placements; live: boolean };
const initialLiveData: LiveData = { earnings: "$89,665", eventsPlayed: "345", latestPr: "966", placements, live: false };
function Arrow() { return <span aria-hidden="true">→</span>; }

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<(typeof events)[number] | null>(null);
  const [mode, setMode] = useState<keyof typeof teammateData>("Battle Royale");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("Ask anything about VicterV.");
  const [asking, setAsking] = useState(false);
  const [liveData, setLiveData] = useState<LiveData>(initialLiveData);

  useEffect(() => { fetch("/api/player-data", { cache: "no-store" }).then((r) => r.json()).then(setLiveData).catch(() => undefined); }, []);
  async function ask(event: FormEvent) {
    event.preventDefault(); if (!question.trim() || asking) return; setAsking(true);
    try { const r = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question }) }); const data = await r.json(); setAnswer(data.answer || data.error || "I could not answer that right now."); }
    catch { setAnswer("The assistant is temporarily unavailable."); } finally { setAsking(false); }
  }
  const squad = teammateData[mode];
  return <main className="site-shell">
    <div className="rainbow-line" />
    <nav className="topbar"><a className="wordmark" href="#top">VICTERV<span className="spark">✦</span></a><div className="nav-links"><a href="#results">Results</a><a href="#timeline">Events</a><a href="#socials">Socials</a><a href="#ask">Ask</a></div><a className="nav-source" href={trackerUrl} target="_blank" rel="noreferrer">Profile <Arrow /></a></nav>
    <section className="hero" id="top"><div className="hero-copy"><p className="eyebrow">VICTERV</p><h1>Built for<br /><span>big moments.</span></h1><p className="hero-bio">The competitive Fortnite profile of VicterV.</p><a className="hero-button" href="#results">See the results <Arrow /></a></div><div className="hero-photo-wrap"><div className="photo-glow" /><div className="hero-photo-card"><img src="/victerv-profile.png" alt="VicterV competing" /><div className="photo-stamp"><b>VICTERV</b></div></div></div></section>
    <section className="stats-section"><div className="stats-grid"><article className="stat-card stat-feature"><small>EARNINGS</small><strong>{liveData.earnings}</strong><span>all time</span></article><article className="stat-card"><small>EVENTS</small><strong>{liveData.eventsPlayed}</strong><span>played</span></article><article className="stat-card"><small>RECENT PR</small><strong>{liveData.latestPr}</strong><span>latest highlighted result</span></article><a className="profile-cta" href={trackerUrl} target="_blank" rel="noreferrer"><span>Full profile</span><strong><Arrow /></strong><small>{liveData.live ? "Updated just now" : "Open Fortnite Tracker"}</small></a></div></section>
    <section className="intro-section"><div><p className="eyebrow dark">THE PLAYER</p><h2>Good at<br /><em>the game.</em></h2></div><div className="file-copy"><p>Follow VicterV’s results, upcoming events, teammates, drop spots, and socials in one place.</p><a href={liquipediaUrl} target="_blank" rel="noreferrer">More on Liquipedia <Arrow /></a></div></section>
    <section className="results-section" id="results"><div className="section-heading"><div><p className="eyebrow">RECENT RUNS</p><h2>Results</h2></div><a href={trackerUrl} target="_blank" rel="noreferrer">Full event history <Arrow /></a></div><div className="placement-table">{liveData.placements.map((item) => <a className="placement-row" href={trackerUrl} target="_blank" rel="noreferrer" key={item.event}><div><strong>{item.event}</strong><span>{item.team}</span></div><time>{item.date}</time><strong className="place">{item.place}</strong><span className="result">{item.result}</span><Arrow /></a>)}</div></section>
    <section className="timeline-section" id="timeline"><div className="section-heading"><div><p className="eyebrow">WHAT’S NEXT</p><h2>Follow<br /><span>the run.</span></h2></div><p className="section-note">Upcoming tournaments and appearances.</p></div><div className="event-road">{events.map((event, index) => <button className={`road-event ${event.color} ${index % 2 ? "right" : "left"}`} key={event.title} onClick={() => setSelectedEvent(event)}><span className="road-dot" /><span className="road-date">{event.date}</span><strong>{event.title}</strong><small>{event.location} · {event.detail}</small><Arrow /></button>)}</div></section>
    <section className="squad-section"><div className="section-heading"><div><p className="eyebrow">TEAMMATES</p><h2>Who’s<br /><span>with him.</span></h2></div><p className="section-note">Switch between game modes to see the current lineup and drop spot.</p></div><div className="mode-tabs">{(Object.keys(teammateData) as Array<keyof typeof teammateData>).map((item) => <button className={mode === item ? "active" : ""} onClick={() => setMode(item)} key={item}>{item}</button>)}</div><div className="roster"><article><b className="roster-mark pink">{squad.teammate[0]}</b><div><strong>{squad.teammate}</strong><span>{mode} teammate</span></div></article><article><b className="roster-mark cyan">⌖</b><div><strong>{squad.drop}</strong><span>Drop spot · {squad.note}</span></div></article><article><b className="roster-mark yellow">C</b><div><strong>{squad.coach}</strong><span>{mode === "Battle Royale" ? "Coach" : "Coaching not listed"}</span></div></article></div></section>
    <section className="socials-section" id="socials"><div className="section-heading"><div><p className="eyebrow">SOCIALS</p><h2>See him<br /><span>in action.</span></h2></div><p className="section-note">Official links for streams, videos, posts, clips, updates, and Discord.</p></div><div className="social-grid">{socialCards.map((card) => <a className="social-card-new" href={card.href} target="_blank" rel="noreferrer" key={card.type}><div className={`social-preview ${card.visual}`}><span>{card.type}</span>{card.visual === "stream" && <b className="live-pill">● LIVE WHEN STREAMING</b>}{card.visual === "post" && <p>VicterV updates and posts<small>@VicterV_ · X</small></p>}{card.visual === "clip" && <div className="clip-bars"><i /><i /><i /><i /></div>}{card.visual === "youtube" && <b className="play">▶</b>}</div><div className="social-card-copy"><strong>{card.title}</strong><span>{card.copy}</span><b>{card.button} <Arrow /></b></div></a>)}</div></section>
    <section className="ask-section" id="ask"><div className="ask-copy"><p className="eyebrow">QUESTIONS?</p><h2>Ask about<br /><span>VicterV.</span></h2><p>Ask any question about his results, teammates, events, career, or socials.</p><form onSubmit={ask}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask anything about VicterV" aria-label="Ask about VicterV" /><button type="submit" disabled={asking}>{asking ? "Thinking…" : "Ask"} <Arrow /></button></form><div className="answer"><span>ANSWER</span><p>{answer}</p></div></div></section>
    <footer><a className="wordmark" href="#top">VICTERV<span className="spark">✦</span></a><span>© VicterV · 2026</span></footer>
    {selectedEvent && <div className="modal-backdrop" onClick={() => setSelectedEvent(null)}><div className="event-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedEvent(null)}>×</button><p className={`eyebrow ${selectedEvent.color}`}>{selectedEvent.location}</p><h2>{selectedEvent.title}</h2><div className="modal-details"><div><small>DATES</small><strong>{selectedEvent.date}, 2026</strong></div><div><small>TEAM SIZE</small><strong>{selectedEvent.detail.split(" · ")[0]}</strong></div><div><small>COMPETING?</small><strong>Yes</strong></div><div><small>FORMAT</small><strong>{selectedEvent.detail.split(" · ")[1]}</strong></div></div><a className="modal-link" href={selectedEvent.source} target="_blank" rel="noreferrer">Open event details <Arrow /></a></div></div>}
  </main>;
}
