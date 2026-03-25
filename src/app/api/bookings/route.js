import { NextResponse } from "next/server";
import { getBookedSlots } from "../../../lib/sheets";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const teacherId = searchParams.get("teacherId");

  if (!teacherId) {
    return NextResponse.json(
      { error: "teacherId is required" },
      { status: 400 }
    );
  }

  try {
    const bookedSlots = await getBookedSlots(teacherId);
    return NextResponse.json({ bookedSlots });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
