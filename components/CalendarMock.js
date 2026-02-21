"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

const BasicScheduler = dynamic(
  () => import("calendarkit-basic").then((mod) => mod.BasicScheduler),
  { ssr: false }
);

const seedEvents = [
  {
    id: "evt-1",
    title: "Downtown Night Market",
    start: new Date(2026, 1, 21, 18, 30),
    end: new Date(2026, 1, 21, 20, 30),
    color: "#ff7a18",
    calendarId: "personal"
  },
  {
    id: "evt-2",
    title: "Rooftop Jazz Session",
    start: new Date(2026, 1, 23, 19, 0),
    end: new Date(2026, 1, 23, 21, 0),
    color: "#157a6e",
    calendarId: "work"
  },
  {
    id: "evt-3",
    title: "Sunrise Run Club",
    start: new Date(2026, 1, 24, 7, 0),
    end: new Date(2026, 1, 24, 8, 0),
    color: "#f4c85f",
    calendarId: "wellness"
  }
];

const seedCalendars = [
  { id: "work", label: "Work", color: "#157a6e", active: true },
  { id: "personal", label: "Personal", color: "#ff7a18", active: true },
  { id: "wellness", label: "Wellness", color: "#f4c85f", active: true }
];

const viewLabels = {
  month: "Month",
  week: "Week",
  day: "Day"
};

function shiftDate(current, view, direction) {
  const next = new Date(current);
  if (view === "month") {
    next.setMonth(next.getMonth() + direction);
  } else if (view === "week") {
    next.setDate(next.getDate() + direction * 7);
  } else {
    next.setDate(next.getDate() + direction);
  }
  return next;
}

function normalizeEvent(raw) {
  if (!raw) return null;
  const start = raw.start instanceof Date ? raw.start : new Date(raw.start);
  const end = raw.end instanceof Date ? raw.end : new Date(raw.end);
  if (Number.isNaN(start?.getTime()) || Number.isNaN(end?.getTime())) {
    return null;
  }
  return {
    id: raw.id || `evt-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    title: raw.title || "New Event",
    start,
    end,
    color: raw.color || "#ff7a18",
    calendarId: raw.calendarId || "personal"
  };
}

function extractEvents(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.events)) return payload.events;
  return [];
}

export default function CalendarMock() {
  const [events, setEvents] = useState(seedEvents);
  const [calendars, setCalendars] = useState(seedCalendars);
  const [view, setView] = useState("week");
  const [date, setDate] = useState(new Date());

  const eventCount = useMemo(() => events.length, [events]);
  const upcoming = useMemo(() => {
    return [...events]
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .slice(0, 5);
  }, [events]);

  useEffect(() => {
    const api = {
      addEventsFromJson: (json) => {
        try {
          const payload = typeof json === "string" ? JSON.parse(json) : json;
          const incoming = extractEvents(payload)
            .map(normalizeEvent)
            .filter(Boolean);
          if (incoming.length) {
            setEvents((current) => [...current, ...incoming]);
          }
        } catch (error) {
          console.error("Invalid calendar JSON", error);
        }
      },
      replaceEventsFromJson: (json) => {
        try {
          const payload = typeof json === "string" ? JSON.parse(json) : json;
          const incoming = extractEvents(payload)
            .map(normalizeEvent)
            .filter(Boolean);
          setEvents(incoming.length ? incoming : []);
        } catch (error) {
          console.error("Invalid calendar JSON", error);
        }
      }
    };

    window.EventFindrCalendar = api;
    return () => {
      delete window.EventFindrCalendar;
    };
  }, []);

  return (
    <section className="calendar-section">
      <div className="calendar-intro">
        <div>
          <p className="eyebrow">Mock Google Calendar</p>
          <h2>Connected calendar preview</h2>
          <p>
            This is a demo calendar with local state only. You can add, edit, and
            remove events without connecting a real account.
          </p>
        </div>
        <div className="calendar-meta">
          <div className="meta-pill">Google Calendar linked</div>
          <div className="meta-pill">{eventCount} events</div>
        </div>
      </div>

      <div className="calendar-shell">
        <div className="calendar-toolbar">
          <div className="calendar-controls">
            <button className="ghost" onClick={() => setDate(new Date())}>
              Today
            </button>
            <button
              className="ghost"
              onClick={() => setDate((current) => shiftDate(current, view, -1))}
            >
              Prev
            </button>
            <button
              className="ghost"
              onClick={() => setDate((current) => shiftDate(current, view, 1))}
            >
              Next
            </button>
          </div>
          <div className="calendar-controls">
            {Object.entries(viewLabels).map(([key, label]) => (
              <button
                key={key}
                className={key === view ? "chip active" : "chip"}
                onClick={() => setView(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="calendar-controls">
            <button
              className="secondary"
              onClick={() => {
                const start = new Date();
                const end = new Date(start.getTime() + 60 * 60 * 1000);
                setEvents((current) => [
                  {
                    id: `evt-${Date.now()}`,
                    title: "Spontaneous pop-up",
                    start,
                    end,
                    color: "#157a6e",
                    calendarId: "personal"
                  },
                  ...current
                ]);
              }}
            >
              Add sample event
            </button>
          </div>
        </div>

        <BasicScheduler
          events={events}
          calendars={calendars}
          view={view}
          onViewChange={setView}
          date={date}
          onDateChange={setDate}
          onEventCreate={(event) => {
            const normalized = normalizeEvent(event);
            if (normalized) {
              setEvents((current) => [...current, normalized]);
            }
          }}
          onEventUpdate={(updated) => {
            setEvents((current) =>
              current.map((event) =>
                event.id === updated.id ? { ...updated } : event
              )
            );
          }}
          onEventDelete={(eventId) => {
            setEvents((current) => current.filter((event) => event.id !== eventId));
          }}
          onCalendarToggle={(calendarId, active) => {
            setCalendars((current) =>
              current.map((calendar) =>
                calendar.id === calendarId
                  ? { ...calendar, active }
                  : calendar
              )
            );
          }}
        />
      </div>

      <div className="calendar-footer">
        <div>
          <h3>Quick add/removal hooks</h3>
          <p>
            You can call <code>window.EventFindrCalendar.addEventsFromJson()</code>{" "}
            to drop in mock events later. It accepts an array of events or an
            object with an <code>events</code> array.
          </p>
        </div>
        <button
          className="ghost"
          onClick={() => setEvents((current) => current.slice(0, 3))}
        >
          Reset to demo events
        </button>
      </div>

      <div className="event-list">
        <div>
          <h3>Upcoming mock events</h3>
          <p>Remove items here to simulate user dismissals.</p>
        </div>
        <div className="event-list-grid">
          {upcoming.map((event) => (
            <div key={event.id} className="event-item">
              <div>
                <p className="event-title">{event.title}</p>
                <p className="event-meta">
                  {new Date(event.start).toLocaleString()}
                </p>
              </div>
              <button
                className="ghost"
                onClick={() =>
                  setEvents((current) =>
                    current.filter((item) => item.id !== event.id)
                  )
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
