import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAIStudyNotes(text: string) {
  if (!text || !text.trim()) {
    throw new Error("No study material was provided.");
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful study assistant. Create accurate, simple, student-friendly study notes using ONLY the material provided by the student. Do not introduce unrelated subjects or information.",
      },
      {
        role: "user",
        content: `Create study notes from the following lecture material.

IMPORTANT:
- Use ONLY information contained in the material.
- Do not assume the subject is Zimbabwe Studies or ZSS.
- Do not add unrelated information.
- Identify the actual subject and concepts from the document.
- Keep explanations simple and clear.

Include:

1. Main Ideas
2. Simple Explanations
3. Important Points
4. Practice Questions

LECTURE MATERIAL:

${text}`,
      },
    ],
  });

  return response.choices[0]?.message?.content || "";
}


export function explainTopic(question: string) {
  return `Explain this concept using the student's uploaded study material:

${question}`;
}