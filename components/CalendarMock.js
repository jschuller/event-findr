"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const BasicScheduler = dynamic(
  () => import("calendarkit-basic").then((mod) => mod.BasicScheduler),
  { ssr: false }
);

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `evt-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function renderMarkdown(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, "<h5>$1</h5>")
    .replace(/^## (.+)$/gm, "<h4>$1</h4>")
    .replace(/^# (.+)$/gm, "<h3>$1</h3>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>")
    .replace(/\n{2,}/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

function parseEventsFromResponse(text) {
  const match = text.match(/```json\s*([\s\S]*?)```/);
  if (!match) return { display: text, parsedEvents: [] };

  const display = text.replace(/```json\s*[\s\S]*?```/, "").trim();
  let parsedEvents = [];
  try {
    const raw = JSON.parse(match[1].trim());
    parsedEvents = (Array.isArray(raw) ? raw : []).map((e) => {
      const [y, m, d] = (e.date || "").split("-").map(Number);
      const [sh, sm] = (e.startTime || "12:00").split(":").map(Number);
      const [eh, em] = (e.endTime || "13:00").split(":").map(Number);
      const start = new Date(y, m - 1, d, sh, sm);
      const end = new Date(y, m - 1, d, eh, em);
      return { title: e.title || "Event", start, end };
    });
  } catch {
    // JSON parse failed — just show the text
  }
  return { display, parsedEvents };
}

const EVENT_COLORS = [
  "#ff7a18", // accent orange
  "#157a6e", // accent teal
  "#f4c85f", // accent gold
  "#4a90d9", // blue
  "#d94a7b", // pink
  "#8b5cf6", // purple
  "#22c55e", // green
];

function getMockEvents() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7)); // current Monday
  monday.setHours(0, 0, 0, 0);

  function day(offset, hour, min = 0) {
    const d = new Date(monday);
    d.setDate(d.getDate() + offset);
    d.setHours(hour, min, 0, 0);
    return d;
  }

  return [
    {
      id: createId(),
      title: "Team Standup",
      start: day(0, 9, 0),
      end: day(0, 9, 30),
      color: EVENT_COLORS[1],
    },
    {
      id: createId(),
      title: "Yoga Class",
      start: day(1, 7, 0),
      end: day(1, 8, 0),
      color: EVENT_COLORS[6],
    },
    {
      id: createId(),
      title: "Lunch with Sara",
      start: day(2, 12, 0),
      end: day(2, 13, 0),
      color: EVENT_COLORS[0],
    },
    {
      id: createId(),
      title: "Dentist Appointment",
      start: day(3, 14, 0),
      end: day(3, 15, 0),
      color: EVENT_COLORS[4],
    },
    {
      id: createId(),
      title: "Team Standup",
      start: day(3, 9, 0),
      end: day(3, 9, 30),
      color: EVENT_COLORS[1],
    },
    {
      id: createId(),
      title: "Happy Hour",
      start: day(4, 17, 0),
      end: day(4, 19, 0),
      color: EVENT_COLORS[5],
    },
    {
      id: createId(),
      title: "Farmers Market",
      start: day(5, 9, 0),
      end: day(5, 11, 0),
      color: EVENT_COLORS[2],
    },
  ];
}

export default function CalendarMock() {
  const [events, setEvents] = useState(getMockEvents);
  const [view, setView] = useState("week");
  const [date, setDate] = useState(new Date());

  const [chatInput, setChatInput] = useState("");
  const [chatDisplay, setChatDisplay] = useState(null);
  const [chatParsedEvents, setChatParsedEvents] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [addedIds, setAddedIds] = useState(new Set());

  async function handleChatSubmit(e) {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    setChatLoading(true);
    setChatDisplay(null);
    setChatParsedEvents([]);
    setAddedIds(new Set());

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: chatInput.trim() }),
      });
      const data = await res.json();
      const raw = data.result || JSON.stringify(data, null, 2);
      const { display, parsedEvents } = parseEventsFromResponse(raw);
      setChatDisplay(display);
      setChatParsedEvents(parsedEvents);
    } catch (err) {
      setChatDisplay("Error: " + err.message);
    } finally {
      setChatLoading(false);
    }
  }

  function addEventToCalendar(idx) {
    const evt = chatParsedEvents[idx];
    if (!evt) return;
    setEvents((current) => [
      ...current,
      {
        id: createId(),
        title: evt.title,
        start: evt.start,
        end: evt.end,
        color: EVENT_COLORS[idx % EVENT_COLORS.length],
      },
    ]);
    setAddedIds((prev) => new Set(prev).add(idx));
    setDate(evt.start);
  }

  function addAllEvents() {
    const newEvents = chatParsedEvents
      .filter((_, i) => !addedIds.has(i))
      .map((evt, i) => ({
        id: createId(),
        title: evt.title,
        start: evt.start,
        end: evt.end,
        color: EVENT_COLORS[i % EVENT_COLORS.length],
      }));
    if (newEvents.length === 0) return;
    setEvents((current) => [...current, ...newEvents]);
    setAddedIds(new Set(chatParsedEvents.map((_, i) => i)));
    setDate(chatParsedEvents[0].start);
  }

  return (
    <section className="calendar-section">
      <div className="chat-widget">
        <h3>Find events</h3>
        <form className="chat-form" onSubmit={handleChatSubmit}>
          <input
            className="chat-input"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Find me tech events in NYC this weekend…"
          />
          <button className="cta" type="submit" disabled={chatLoading}>
            {chatLoading ? "Searching…" : "Search"}
          </button>
        </form>
        {chatDisplay && (
          <div className="chat-response">
            <div
              className="chat-response-text"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(chatDisplay) }}
            />
            {chatParsedEvents.length > 0 && (
              <div className="chat-events-list">
                <div className="chat-events-header">
                  <strong>{chatParsedEvents.length} event{chatParsedEvents.length !== 1 ? "s" : ""} found</strong>
                  <button
                    className="cta chat-add-all"
                    onClick={addAllEvents}
                    disabled={addedIds.size === chatParsedEvents.length}
                  >
                    {addedIds.size === chatParsedEvents.length ? "All added" : "+ Add all to calendar"}
                  </button>
                </div>
                {chatParsedEvents.map((evt, i) => (
                  <div key={i} className="chat-event-row">
                    <div>
                      <strong>{evt.title}</strong>
                      <span className="chat-event-meta">
                        {evt.start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        {" "}
                        {evt.start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        {" – "}
                        {evt.end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      </span>
                    </div>
                    <button
                      className="secondary"
                      onClick={() => addEventToCalendar(i)}
                      disabled={addedIds.has(i)}
                    >
                      {addedIds.has(i) ? "Added" : "+ Add"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="calendar-shell">
        <div className="calendar-frame">
          <BasicScheduler
            events={events}
            view={view}
            onViewChange={setView}
            date={date}
            onDateChange={setDate}
            onEventCreate={(event) =>
              setEvents((current) => [...current, { ...event, id: createId() }])
            }
            onEventUpdate={(updatedEvent) => {
              setEvents((current) =>
                current.map((event) =>
                  event.id === updatedEvent.id ? updatedEvent : event
                )
              );
            }}
            onEventDelete={(eventId) => {
              setEvents((current) => current.filter((event) => event.id !== eventId));
            }}
          />
        </div>
      </div>
    </section>
  );
}
