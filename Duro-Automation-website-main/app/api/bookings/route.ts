import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone } = body;

    // Basic validation
    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Booking request received successfully",
        data: { id: "req_" + Date.now() },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: true, data: [] },
    { status: 200 }
  );
}
