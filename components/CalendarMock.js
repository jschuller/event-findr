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
  const [chatResponse, setChatResponse] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);

  async function handleChatSubmit(e) {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    setChatLoading(true);
    setChatResponse(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: chatInput.trim() }),
      });
      const data = await res.json();
      setChatResponse(data.result || JSON.stringify(data, null, 2));
    } catch (err) {
      setChatResponse("Error: " + err.message);
    } finally {
      setChatLoading(false);
    }
  }

  function addBlankEvent() {
    const now = new Date();
    const start = new Date(now);
    start.setMinutes(0, 0, 0);
    start.setHours(start.getHours() + 1);
    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    setEvents((current) => [
      ...current,
      {
        id: createId(),
        title: "New Event",
        start,
        end,
        color: EVENT_COLORS[0],
      },
    ]);
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
        {chatResponse && (
          <div className="chat-response">
            <div className="chat-response-text">{chatResponse}</div>
            <button className="secondary" onClick={addBlankEvent}>
              + Add event to calendar
            </button>
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
