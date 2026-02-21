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

export default function CalendarMock() {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("week");
  const [date, setDate] = useState(new Date());

  return (
    <section className="calendar-section">
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
