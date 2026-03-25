"use client";

import { useEffect, useState } from "react";
import { SCHOOL } from "../../lib/config";

export default function AdminPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/admin/bookings");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        setError("Failed to load bookings. Please check your configuration.");
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors mb-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </a>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark">
            Admin — All Bookings
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Read-only view of all conference bookings from Google Sheets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-dark text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full spinner mx-auto mb-4" />
            <p className="text-sm text-gray-500">Loading bookings...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-6 text-center">
          <svg className="w-8 h-8 mx-auto mb-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="font-medium mb-1">Error Loading Bookings</p>
          <p>{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-16 text-center">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-semibold text-dark mb-1">No Bookings Yet</h3>
          <p className="text-sm text-gray-500">
            Bookings will appear here once parents start scheduling conferences.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Timestamp</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Teacher</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Time Slot</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Parent Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Child Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Phone</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {b.Timestamp
                        ? new Date(b.Timestamp).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3 font-medium text-dark whitespace-nowrap">
                      {b["Teacher Name"] || "—"}
                    </td>
                    <td className="px-4 py-3 text-dark whitespace-nowrap">
                      {b["Slot Label"] || "—"}
                    </td>
                    <td className="px-4 py-3 text-dark">{b["Parent Name"] || "—"}</td>
                    <td className="px-4 py-3 text-dark">{b["Child Name"] || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{b.Email || "—"}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{b.Phone || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
