import { NextRequest, NextResponse } from "next/server";
import * as pdf from "pdf-parse";
import mammoth from "mammoth";
export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const file = formData.get("file");
if (!(file instanceof File)) {
  return NextResponse.json(
    { error: "Invalid file." },
    { status: 400 }
  );
}

const buffer = Buffer.from(await file.arrayBuffer());

let extractedText = "";
const fileName = file.name.toLowerCase();

if (fileName.endsWith(".docx")) {
  const result = await mammoth.extractRawText({
    buffer,
  });

  extractedText = result.value;
} else {
  return NextResponse.json(
    {
      error: "Unsupported file type.",
    },
    {
      status: 400,
    }
  );
}
  

 const preview = extractedText
  .replace(/\r/g, "")
  .trim()
  .slice(0, 2500);
const paragraphs = preview
  .split("\n")
  .map((line) => line.trim())
  .filter((line) =>
    line.length > 40 &&
    !line.toLowerCase().includes("by the end of the topic") &&
    !line.toLowerCase().includes("students should")
  )
  .map((line) =>
    line.replace(
      /^(explain|define|list and explain|list|describe|discuss|state|outline)\s+/i,
      ""
    ).trim()
  )
  .slice(0, 5);

const studyNotes = paragraphs
  .map((paragraph, index) => {

    let concept = "";

    if (
  paragraph.toLowerCase().includes("zss can be defined") ||
  paragraph.toLowerCase().includes("civic or citizenship education")
) {
  concept = "ZSS Definition";
}
else if (paragraph.toLowerCase().includes("purpose")) {
  concept = "Purpose of ZSS";
}
else if (paragraph.toLowerCase().includes("aim")) {
  concept = "Major Aims of ZSS";
}
else if (paragraph.toLowerCase().includes("rationale")) {
  concept = "Rationale Behind ZSS";
}
    else if (paragraph.toLowerCase().includes("civic education")) {
      concept = "Civic Education";
    } 
    else if (paragraph.toLowerCase().includes("critical consciousness")) {
      concept = "Critical Consciousness";
    } 
    else if (paragraph.toLowerCase().includes("patriot")) {
      concept = "Patriotism";
    } 
    else {
      concept = paragraph
        .split(" ")
        .slice(0, 5)
        .join(" ");
    }

    return `${index + 1}. ${concept}

Explanation:
${paragraph}

Key Point:
This concept is important because it helps students understand the topic better.`;
  })
  .join("\n\n=================================\n\n");
 const quizQuestions = paragraphs
  .map((paragraph, index) => {
    let topic = paragraph
      .replace(/^(explain|define|list|describe|discuss|state|outline)\s+/i, "")
      .replace(/:$/, "")
      .trim();

    const questionTypes = [
      `Define ${topic}.`,
      `Explain the importance of ${topic}.`,
      `Discuss ${topic}.`,
      `What is the significance of ${topic}?`
    ];

    return `${index + 1}. ${questionTypes[index % questionTypes.length]}`;
  })
  .join("\n\n");


const flashcards = paragraphs
  .filter((paragraph) => {
    const lower = paragraph.toLowerCase();

    return (
      !lower.includes("purpose/rationale") &&
      !lower.includes("major aims") &&
      !lower.includes("rationale behind introducing")
    );
  })
  .map((paragraph, index) => {

    let concept = "";

    if (paragraph.toLowerCase().startsWith("zss")) {
      concept = "ZSS";
    }
    else if (paragraph.toLowerCase().includes("civic education")) {
      concept = "Civic Education";
    }
    else if (paragraph.toLowerCase().includes("critical consciousness")) {
      concept = "Critical Consciousness";
    }
    else if (paragraph.toLowerCase().includes("patriot")) {
      concept = "Patriotism";
    }
    else {
      concept = paragraph
        .split(" ")
        .slice(0, 4)
        .join(" ");
    }

    return `📇 FLASHCARD ${index + 1}

FRONT:
What is ${concept}?

BACK:
${paragraph}`;
  })
  .join("\n\n=================================\n\n");
  const chapterSummary =
  paragraphs.length > 0
    ? `This chapter introduces ${file.name.replace(".docx", "")}. It explains ${paragraphs
        .slice(0, 3)
        .map((paragraph) => paragraph.toLowerCase().replace(/\.$/, ""))
        .join(", ")}. The chapter concludes by highlighting the importance of these concepts for students.`
    : "No chapter summary available.";
  const keyConcepts = paragraphs
  .map((paragraph, index) => {

    let concept = "";

    if (paragraph.toLowerCase().includes("zss")) {
      concept = "ZSS";
    } else if (paragraph.toLowerCase().includes("civic education")) {
      concept = "Civic Education";
    } else if (paragraph.toLowerCase().includes("critical consciousness")) {
      concept = "Critical Consciousness";
    } else if (paragraph.toLowerCase().includes("patriot")) {
      concept = "Patriotism";
    } else {
      concept = paragraph
        .split(" ")
        .slice(0, 4)
        .join(" ");
    }

    return `${index + 1}. ${concept}

Meaning:
${paragraph}`;

  })
  .join("\n\n=================================\n\n");
  console.log("Preview:");
console.log(preview);

console.log("Study Notes:");
console.log(studyNotes);
return NextResponse.json({
  summary: `📚 STUDY NOTES

=================================

📄 File

${file.name}

=================================

📝 Key Notes

${studyNotes}

=================================

🎯 Status

✅ Document uploaded successfully
✅ Text extracted successfully

=================================

❓ PRACTICE QUESTIONS

${quizQuestions}

=================================

📇 FLASHCARDS FOR REVISION

${flashcards}

=================================

⭐ KEY CONCEPTS

${keyConcepts}
=================================

📖 CHAPTER SUMMARY

${chapterSummary}`
});
}