import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  return NextResponse.json({
    success: true,
    received: body,
    message: "API is working!",
  });
}