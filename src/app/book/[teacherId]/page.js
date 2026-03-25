"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getTeacherById,
  generateTimeSlots,
  formatConferenceDate,
  TEACHERS,
} from "../../../lib/config";

export default function BookTeacherPage() {
  const params = useParams();
  const router = useRouter();
  const teacherId = params.teacherId;
  const teacher = getTeacherById(teacherId);
  const slots = generateTimeSlots();

  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    parentName: "",
    childName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    async function fetchBooked() {
      try {
        const res = await fetch(`/api/bookings?teacherId=${teacherId}`);
        const data = await res.json();
        setBookedSlots(data.bookedSlots || []);
      } catch (error) {
        console.error("Failed to load booked slots:", error);
      } finally {
        setLoading(false);
      }
    }
    if (teacherId) fetchBooked();
  }, [teacherId]);

  if (!teacher) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-dark mb-4">Teacher Not Found</h1>
        <p className="text-gray-500 mb-6">
          The teacher you&apos;re looking for doesn&apos;t exist.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          ← Back to Home
        </a>
      </div>
    );
  }

  const availableCount = slots.length - bookedSlots.length;

  function handleInputChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function isFormValid() {
    return (
      formData.parentName.trim() &&
      formData.childName.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    );
  }

  function handleProceed(e) {
    e.preventDefault();
    if (!selectedSlot || !isFormValid()) return;

    const bookingData = {
      teacherId: teacher.id,
      teacherName: teacher.name,
      teacherGrades: teacher.grades,
      slotId: selectedSlot.id,
      slotLabel: selectedSlot.label,
      ...formData,
    };

    // Store in sessionStorage for the confirm page
    sessionStorage.setItem("pendingBooking", JSON.stringify(bookingData));
    router.push("/confirm");
  }

  return (
    <div>
      {/* Teacher Header */}
      <section className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Teachers
          </a>

          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${teacher.color}, ${teacher.color}dd)`,
              }}
            >
              {teacher.initials}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-dark">
                {teacher.name}
              </h1>
              <p className="text-gray-500">{teacher.grades}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm">
            <span className="text-gray-500">
              📅 {formatConferenceDate()}
            </span>
            {!loading && (
              <span
                className={`inline-flex items-center gap-1.5 font-medium px-3 py-1 rounded-full ${
                  availableCount > 0
                    ? "text-green-700 bg-green-50"
                    : "text-gray-500 bg-gray-100"
                }`}
              >
                {availableCount > 0 ? (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full pulse-dot" />
                    {availableCount} slot{availableCount !== 1 ? "s" : ""}{" "}
                    available
                  </>
                ) : (
                  "Fully Booked"
                )}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Slot Grid + Form */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Slot Grid — 3 columns on lg */}
          <div className="lg:col-span-3">
            <h2 className="text-lg font-semibold text-dark mb-1">
              Select a Time Slot
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Choose an available 10-minute slot for your conference.
            </p>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full spinner" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 stagger-children">
                {slots.map((slot) => {
                  const isBooked = bookedSlots.includes(slot.id);
                  const isSelected = selectedSlot?.id === slot.id;

                  return (
                    <button
                      key={slot.id}
                      id={`slot-${slot.id}`}
                      disabled={isBooked}
                      onClick={() => setSelectedSlot(isSelected ? null : slot)}
                      className={
                        isBooked
                          ? "slot-booked"
                          : isSelected
                          ? "slot-selected"
                          : "slot-available"
                      }
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Legend */}
            <div className="mt-6 flex items-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-200 rounded bg-white" />
                Available
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary rounded bg-primary" />
                Selected
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-200 rounded bg-gray-100" />
                Booked
              </div>
            </div>
          </div>

          {/* Booking Form — 2 columns on lg */}
          <div className="lg:col-span-2">
            <div
              className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 ${
                selectedSlot
                  ? "opacity-100 translate-y-0"
                  : "opacity-40 translate-y-2 pointer-events-none"
              }`}
            >
              <div className="p-6">
                <h2 className="text-lg font-semibold text-dark mb-1">
                  Your Details
                </h2>
                {selectedSlot ? (
                  <p className="text-sm text-primary font-medium mb-6">
                    Selected: {selectedSlot.label}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 mb-6">
                    ← Select a time slot first
                  </p>
                )}

                <form onSubmit={handleProceed} className="space-y-4">
                  <div>
                    <label
                      htmlFor="parentName"
                      className="block text-sm font-medium text-dark mb-1"
                    >
                      Parent / Guardian Name
                    </label>
                    <input
                      type="text"
                      id="parentName"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="childName"
                      className="block text-sm font-medium text-dark mb-1"
                    >
                      Child&apos;s Name
                    </label>
                    <input
                      type="text"
                      id="childName"
                      name="childName"
                      value={formData.childName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your child's name"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-dark mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="parent@example.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-dark mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+1-250-555-1234"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedSlot || !isFormValid()}
                    className="w-full mt-2 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
                  >
                    Review Booking →
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
