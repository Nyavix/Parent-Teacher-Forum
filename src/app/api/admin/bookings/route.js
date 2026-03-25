import { NextResponse } from "next/server";
import { getAllBookings } from "../../../../lib/sheets";

export async function GET() {
  try {
    const bookings = await getAllBookings();
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
