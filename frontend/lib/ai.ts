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