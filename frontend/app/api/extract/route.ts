import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import { generateAIStudyNotes } from "@/lib/ai";
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
      error: "Currently only Word (.docx) files are supported.",
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

Simple Explanation:
${paragraph}

Why It Matters:
Understanding ${concept} helps students develop knowledge, awareness, and the ability to apply this concept in real life.

Remember:
${concept} is one of the important ideas covered in this topic.`;   
  })
  .join("\n\n=================================\n\n");
 let aiStudyNotes = "";

try {
  aiStudyNotes = await generateAIStudyNotes(extractedText);
} catch (error) {
  console.log("Using built-in notes generator");
  aiStudyNotes = studyNotes;
}
const quizQuestions = paragraphs
  .map((paragraph, index) => {

    const lower = paragraph.toLowerCase();

    let question = "";

    if (lower.includes("purpose")) {
      question = "Explain the purpose/rationale of ZSS.";
    }
    else if (lower.includes("aim")) {
      question = "Explain the major aims of ZSS.";
    }
    else if (lower.includes("rationale")) {
      question = "Why was the ZSS module introduced to university students?";
    }
    else if (
      lower.includes("zss can be defined") ||
      lower.includes("civic or citizenship education")
    ) {
      question = "What is ZSS and how does it contribute to civic education?";
    }
    else if (lower.includes("civic education")) {
      question = "Explain the importance of civic education.";
    }
    else {
      question = `Explain ${paragraph}.`;
    }

    return `${index + 1}. ${question}`;

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
    ? `This topic introduces students to important ideas about Zimbabwe Studies. 
It explains ${paragraphs
        .slice(0, 3)
        .map((paragraph) =>
          paragraph
            .toLowerCase()
            .replace(/\.$/, "")
        )
        .join(", ")}.

Students learn how these concepts relate to citizenship, national development, and their responsibilities in society.`
    : "No chapter summary available.";
  const keyConcepts = paragraphs
  .map((paragraph, index) => {

    let concept = "";

    const lower = paragraph.toLowerCase();

if (lower.includes("purpose")) {
  concept = "Purpose of ZSS";
}
else if (lower.includes("aim")) {
  concept = "Major Aims of ZSS";
}
else if (lower.includes("rationale")) {
  concept = "Rationale Behind ZSS";
}
else if (
  lower.includes("zss can be defined") ||
  lower.includes("civic or citizenship education")
) {
  concept = "ZSS Definition";
}
else if (lower.includes("civic education")) {
  concept = "Civic Education";
}
else if (lower.includes("patriot")) {
  concept = "Patriotism";
}
else {
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
const explanations = {
  "Purpose of ZSS":
    "The purpose of the ZSS module is to help students understand Zimbabwe, appreciate national values, and become responsible citizens.",

  "Major Aims of ZSS":
    "The major aims of ZSS are to develop patriotism, critical thinking, civic responsibility, and knowledge of Zimbabwe's history and culture.",

  "Civic Education":
    "Civic Education helps people understand their rights, responsibilities, and how they can contribute positively to society."
};
return NextResponse.json({
  summary: `📚 STUDY NOTES

=================================

📄 File

${file.name}

=================================

📝 Key Notes

${aiStudyNotes}

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

${chapterSummary}`,

  flashcards: flashcards,
  explanations
});
}