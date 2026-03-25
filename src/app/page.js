"use client";

import { useEffect, useState } from "react";
import { TEACHERS, SCHOOL, formatConferenceDate, generateTimeSlots } from "../lib/config";

export default function HomePage() {
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const totalSlots = generateTimeSlots().length;

  useEffect(() => {
    async function fetchAvailability() {
      try {
        const results = {};
        await Promise.all(
          TEACHERS.map(async (teacher) => {
            const res = await fetch(`/api/bookings?teacherId=${teacher.id}`);
            const data = await res.json();
            results[teacher.id] = totalSlots - (data.bookedSlots?.length || 0);
          })
        );
        setAvailability(results);
      } catch (error) {
        console.error("Failed to fetch availability:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAvailability();
  }, [totalSlots]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/3 -translate-x-1/4"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm px-4 py-1.5 rounded-full mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatConferenceDate()}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Parent-Teacher Conference
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-2">
            {SCHOOL.name}
          </p>
          <p className="text-base text-white/60 max-w-lg mx-auto">
            Book a 10-minute conference with your child&apos;s teacher.
            <br />
            Slots available from 5:00 PM to 7:00 PM.
          </p>
        </div>
      </section>

      {/* Teacher Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-2">
            Select a Teacher
          </h2>
          <p className="text-gray-500">
            Choose a teacher to view available time slots and book your conference.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {TEACHERS.map((teacher) => {
            const available = availability[teacher.id];
            const isFullyBooked = available === 0;

            return (
              <a
                key={teacher.id}
                href={`/book/${teacher.id}`}
                id={`teacher-card-${teacher.id}`}
                className={`card-hover block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm ${
                  isFullyBooked ? "opacity-60 pointer-events-none" : ""
                }`}
              >
                {/* Color bar */}
                <div
                  className="h-2"
                  style={{ backgroundColor: teacher.color }}
                />

                <div className="p-6">
                  {/* Avatar */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${teacher.color}, ${teacher.color}dd)`,
                    }}
                  >
                    {teacher.initials}
                  </div>

                  {/* Info */}
                  <h3 className="text-lg font-semibold text-dark mb-1">
                    {teacher.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{teacher.grades}</p>

                  {/* Availability Badge */}
                  <div className="flex items-center justify-between">
                    {loading ? (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full spinner" />
                        Loading...
                      </div>
                    ) : isFullyBooked ? (
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                        Fully Booked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">
                        <span className="w-2 h-2 bg-green-500 rounded-full pulse-dot" />
                        {available} slot{available !== 1 ? "s" : ""} available
                      </span>
                    )}

                    <svg
                      className="w-5 h-5 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="text-2xl font-bold text-dark text-center mb-10">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Choose a Teacher",
                desc: "Select your child's teacher from the list above.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                ),
              },
              {
                step: "2",
                title: "Pick a Time Slot",
                desc: "Browse available time slots and select one.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
              },
              {
                step: "3",
                title: "Confirm Booking",
                desc: "Fill in your details and confirm your appointment.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </div>
                <h3 className="font-semibold text-dark mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
