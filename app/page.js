import FirebaseInit from "../components/FirebaseInit";
import CalendarMock from "../components/CalendarMock";

export default function Home() {
  return (
    <div className="page">
      <FirebaseInit />
      <header className="nav">
        <div className="brand">
          <span className="logo">EF</span>
          <div>
            <p className="brand-name">Event Findr</p>
            <p className="brand-tag">Personalized fun, right on your calendar.</p>
          </div>
        </div>
        <div className="nav-actions">
          <a className="ghost" href="#how-it-works">How it works</a>
          <button className="cta">Join the beta</button>
        </div>
      </header>

      <main className="hero">
        <div className="hero-copy reveal" style={{ "--delay": "0ms" }}>
          <p className="eyebrow">Your city. Your vibe. Your time.</p>
          <h1>
            A personal event finder that learns what you love and fills your
            week with things worth doing.
          </h1>
          <p className="lead">
            Event Findr curates concerts, pop-ups, classes, and hidden gems,
            then syncs the best picks straight to your calendar. Tell us your
            preferences once and we keep refining the lineup.
          </p>
          <div className="hero-actions">
            <button className="cta">Get early access</button>
            <button className="secondary">See sample week</button>
          </div>
          <div className="trust">
            <span>Personalized picks</span>
            <span>Calendar-ready</span>
            <span>ARIA-backed recommendations</span>
          </div>
        </div>

        <div className="hero-card reveal" style={{ "--delay": "120ms" }}>
          <div className="card-header">
            <p className="card-title">Tonight&apos;s plan</p>
            <span className="badge">Matched to you</span>
          </div>
          <div className="card-body">
            <div className="event-row">
              <div>
                <p className="event-title">Sunset Rooftop Jazz</p>
                <p className="event-meta">7:30 PM · 0.8 mi · Indoor/outdoor</p>
              </div>
              <span className="pill">98% fit</span>
            </div>
            <div className="event-row">
              <div>
                <p className="event-title">Night Market + Street Food</p>
                <p className="event-meta">Friday · 14 stalls · Saves you a spot</p>
              </div>
              <span className="pill">93% fit</span>
            </div>
            <div className="event-row">
              <div>
                <p className="event-title">Studio Pottery Drop-In</p>
                <p className="event-meta">Weekend · Chill · Bring a friend</p>
              </div>
              <span className="pill">89% fit</span>
            </div>
          </div>
          <div className="card-footer">
            <span>Synced with your calendar</span>
            <span>1 click to RSVP</span>
          </div>
        </div>
      </main>

      <section className="section" id="how-it-works">
        <div className="section-head reveal" style={{ "--delay": "80ms" }}>
          <h2>How it works</h2>
          <p>
            A simple flow that gets smarter every week, without the endless
            searching.
          </p>
        </div>
        <div className="grid">
          <div className="card reveal" style={{ "--delay": "120ms" }}>
            <h3>1. Tell us your taste</h3>
            <p>
              Pick the vibes, venues, and price points you love. Update anytime.
            </p>
          </div>
          <div className="card reveal" style={{ "--delay": "160ms" }}>
            <h3>2. Connect your calendar</h3>
            <p>
              We only suggest events that fit your actual schedule.
            </p>
          </div>
          <div className="card reveal" style={{ "--delay": "200ms" }}>
            <h3>3. Get curated plans</h3>
            <p>
              ARIA helps rank events by your interests, energy, and timing.
            </p>
          </div>
        </div>
      </section>

      <div className="hero-image reveal" style={{ "--delay": "100ms" }}>
        <img
          src="/hero-event.webp"
          alt="A bustling tech hackathon with developers collaborating at tables, colorful banners, and a city skyline through floor-to-ceiling windows"
          width={1920}
          height={1080}
        />
      </div>

      <CalendarMock />

      <section className="section split">
        <div className="panel reveal" style={{ "--delay": "120ms" }}>
          <h2>Personalization that feels effortless</h2>
          <p>
            We learn from every save, skip, and RSVP to keep your feed fresh and
            accurate. The result: fewer tabs, more great nights out.
          </p>
          <div className="tag-list">
            <span>Live music</span>
            <span>Late-night food</span>
            <span>Art walks</span>
            <span>Wellness</span>
            <span>Outdoor</span>
            <span>Friends welcome</span>
          </div>
        </div>
        <div className="panel highlight reveal" style={{ "--delay": "160ms" }}>
          <h3>Calendar-first planning</h3>
          <p>
            Event Findr checks your availability before it recommends anything.
            When you say yes, we place it directly on your calendar with all the
            details.
          </p>
          <ul>
            <li>One-tap RSVP links</li>
            <li>Smart reminders before you head out</li>
            <li>Share plans with friends</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal" style={{ "--delay": "120ms" }}>
          <h2>Powered by the ARIA backend</h2>
          <p>
            Our recommendation engine blends local listings, venue calendars,
            and your personal signals to find the best fit.
          </p>
        </div>
        <div className="grid wide">
          <div className="card reveal" style={{ "--delay": "140ms" }}>
            <h3>Real-time discovery</h3>
            <p>Fresh drops, last-minute seats, and new pop-ups before they sell out.</p>
          </div>
          <div className="card reveal" style={{ "--delay": "180ms" }}>
            <h3>Signal-aware ranking</h3>
            <p>Balances energy level, travel time, and the people you want to go with.</p>
          </div>
          <div className="card reveal" style={{ "--delay": "220ms" }}>
            <h3>Privacy-respectful</h3>
            <p>We only use the preferences you share and keep data lightweight.</p>
          </div>
          <div className="card reveal" style={{ "--delay": "260ms" }}>
            <h3>Always improving</h3>
            <p>The more you interact, the sharper the weekly picks become.</p>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h2>Build your perfect week</h2>
          <p>Join the beta and help shape the future of personalized events.</p>
        </div>
        <button className="cta">Request invite</button>
      </section>
    </div>
  );
}
