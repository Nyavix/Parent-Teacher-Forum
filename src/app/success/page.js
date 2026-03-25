"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatConferenceDate, SCHOOL } from "../../lib/config";

export default function SuccessPage() {
  const router = useRouter();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("confirmedBooking");
    if (!stored) {
      router.push("/");
      return;
    }
    setBooking(JSON.parse(stored));
    // Clean up
    sessionStorage.removeItem("confirmedBooking");
  }, [router]);

  if (!booking) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full spinner" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="animate-fade-in-up text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-gray-500 mb-8">
          Your conference appointment has been successfully booked.
        </p>

        {/* Booking Details Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-left mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 text-white flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">Appointment Details</span>
          </div>

          <div className="p-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Date</span>
              <span className="text-sm font-medium text-dark">{formatConferenceDate()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Time</span>
              <span className="text-sm font-medium text-dark">{booking.slotLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Teacher</span>
              <span className="text-sm font-medium text-dark">{booking.teacherName}</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Parent / Guardian</span>
              <span className="text-sm font-medium text-dark">{booking.parentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Child</span>
              <span className="text-sm font-medium text-dark">{booking.childName}</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 text-sm text-gray-600">
          <p>
            If you need to make changes, please contact us at{" "}
            <a href={`mailto:${SCHOOL.email}`} className="text-primary font-medium hover:underline">
              {SCHOOL.email}
            </a>{" "}
            or call{" "}
            <a href={`tel:${SCHOOL.phone}`} className="text-primary font-medium hover:underline">
              {SCHOOL.phone}
            </a>
            .
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/"
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-all inline-flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Book Another
          </a>
          <a
            href="/"
            className="bg-white text-dark border border-gray-200 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all inline-flex items-center justify-center"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
