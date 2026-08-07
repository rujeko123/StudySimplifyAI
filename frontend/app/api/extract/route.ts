import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import { generateAIStudyNotes } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Invalid file." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();

    let extractedText = "";

    if (fileName.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
      return NextResponse.json(
        {
          error:
            "Currently only Word (.docx) files are supported.",
        },
        { status: 400 }
      );
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        {
          error:
            "The uploaded document does not contain readable text.",
        },
        { status: 400 }
      );
    }

    console.log("Document:", file.name);
    console.log("Characters extracted:", extractedText.length);

    let aiStudyNotes = "";

    try {
      aiStudyNotes =
        await generateAIStudyNotes(extractedText);
    } catch (error) {
      console.error(
        "AI study notes generation failed:",
        error
      );

      aiStudyNotes =
        "AI study notes could not be generated. Please try again.";
    }

    return NextResponse.json({
      summary:
        "📚 STUDY NOTES\n\n" +
        "=================================\n\n" +
        "📄 File\n\n" +
        file.name +
        "\n\n=================================\n\n" +
        "📝 AI-GENERATED STUDY NOTES\n\n" +
        aiStudyNotes +
        "\n\n=================================\n\n" +
        "🎯 Status\n\n" +
        "✅ Document uploaded successfully\n" +
        "✅ Text extracted successfully\n" +
        "⚠️ AI study notes generation unavailable",

      fileName: file.name,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        error:
          "Something went wrong while processing the document.",
      },
      { status: 500 }
    );
  }
}