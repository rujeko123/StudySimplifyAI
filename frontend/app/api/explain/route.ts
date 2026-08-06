import { NextRequest, NextResponse } from "next/server";
import { explainTopic } from "@/lib/ai";

export async function POST(request: NextRequest) {

  const body = await request.json();

  const question = body.question;

  const answer = explainTopic(question);

  return NextResponse.json({
    answer
  });
}