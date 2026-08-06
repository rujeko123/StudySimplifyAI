import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `Summarize this text in simple language:

${body.text}`,
    });

    return NextResponse.json({
      summary: response.output_text,
    });
  } catch (error) {
    console.error("OpenAI Error:", error);

    return NextResponse.json(
      { error: "Failed to generate summary." },
      { status: 500 }
    );
  }
}