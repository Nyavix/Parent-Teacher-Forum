"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatConferenceDate } from "../../lib/config";

export default function ConfirmPage() {
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("pendingBooking");
    if (!stored) {
      router.push("/");
      return;
    }
    setBooking(JSON.parse(stored));
  }, [router]);

  async function handleConfirm() {
    if (!booking || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "SLOT_TAKEN") {
          setError(
            "This time slot was just booked by someone else. Please go back and select a different slot."
          );
        } else {
          setError("Something went wrong. Please try again.");
        }
        setSubmitting(false);
        return;
      }

      // Store confirmed booking for success page
      sessionStorage.setItem("confirmedBooking", JSON.stringify(booking));
      sessionStorage.removeItem("pendingBooking");
      router.push("/success");
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full spinner" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="animate-fade-in-up">
        {/* Header */}
        <a
          href={`/book/${booking.teacherId}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Time Slots
        </a>

        <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-2">
          Confirm Your Booking
        </h1>
        <p className="text-gray-500 mb-8">
          Please review the details below before confirming.
        </p>

        {/* Booking Summary Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          {/* Colored header */}
          <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-4 text-white">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold">{formatConferenceDate()}</span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <DetailRow label="Teacher" value={booking.teacherName} sub={booking.teacherGrades} />
            <DetailRow label="Time Slot" value={booking.slotLabel} />
            <hr className="border-gray-100" />
            <DetailRow label="Parent / Guardian" value={booking.parentName} />
            <DetailRow label="Child's Name" value={booking.childName} />
            <DetailRow label="Email" value={booking.email} />
            <DetailRow label="Phone" value={booking.phone} />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4 mb-6 flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="font-medium">Booking Failed</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleConfirm}
            disabled={submitting}
            id="confirm-booking-btn"
            className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full spinner" />
                Confirming...
              </>
            ) : (
              <>
                Confirm Booking
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            )}
          </button>
          <a
            href={`/book/${booking.teacherId}`}
            className="flex-1 text-center bg-white text-dark border border-gray-200 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
          >
            Go Back
          </a>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, sub }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-sm text-gray-500">{label}</span>
      <div className="text-right">
        <span className="text-sm font-medium text-dark">{value}</span>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}
