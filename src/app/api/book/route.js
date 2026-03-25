import { NextResponse } from "next/server";
import { bookSlot } from "../../../lib/sheets";

export async function POST(request) {
  try {
    const body = await request.json();
    const { teacherId, teacherName, slotId, slotLabel, parentName, childName, email, phone } = body;

    // Validate required fields
    if (!teacherId || !teacherName || !slotId || !slotLabel || !parentName || !childName || !email || !phone) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const result = await bookSlot({
      teacherId,
      teacherName,
      slotId,
      slotLabel,
      parentName,
      childName,
      email,
      phone,
    });

    if (!result.success) {
      const status = result.error === "SLOT_TAKEN" ? 409 : 500;
      return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error booking slot:", error);
    return NextResponse.json(
      { error: "Failed to process booking" },
      { status: 500 }
    );
  }
}
