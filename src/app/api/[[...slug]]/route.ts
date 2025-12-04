import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _req: NextRequest,
  _context: { params: Promise<{ slug?: string[] }> }
) {
  // Minimal contract: always return a JSON body with a "message" field.
  // Edge workers or other infrastructure can still change the HTTP status
  // code and/or mutate this message, but the frontend only relies on this
  // simple shape.
  return NextResponse.json(
    {
      message: "Login succeeded",
    },
    {
      status: 200,
    }
  );
}



