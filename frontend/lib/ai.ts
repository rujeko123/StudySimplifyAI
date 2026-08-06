import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAIStudyNotes(text: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful study assistant. Convert lecture notes into simple student-friendly study notes.",
        },
        {
          role: "user",
          content: `
Create study notes from this material:

${text}

Include:
- Main ideas
- Simple explanations
- Important points
- Practice questions
`,
        },
      ],
    });

    return response.choices[0].message.content || "";

  } catch (error) {
    console.log("AI unavailable");

    throw error;
}

}
export function explainTopic(question: string) {

  const lower = question.toLowerCase();

  if (lower.includes("critical consciousness")) {
    return "Critical Consciousness means being able to think deeply about society, identify problems, and understand how people can create positive change.";
  }

  if (lower.includes("zss")) {
    return "ZSS teaches students about Zimbabwe's history, culture, citizenship, national values and their responsibilities as citizens.";
  }

  if (lower.includes("civic education")) {
    return "Civic Education teaches people about their rights, responsibilities, values and participation in society.";
  }

  return `This topic is explained as follows: ${question}. It is an important concept from your study notes.`;
}

