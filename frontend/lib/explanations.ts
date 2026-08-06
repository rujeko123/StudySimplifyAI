export const explanations: Record<string, string> = {
  "ZSS":
    "The ZSS module teaches students about Zimbabwe's history, culture, citizenship, and national development so they can become responsible citizens.",

  "Purpose of ZSS":
    "The purpose of the ZSS module is to help students understand Zimbabwe, appreciate national values, and become responsible citizens.",

  "Major Aims of ZSS":
    "The major aims of ZSS are to develop patriotism, critical thinking, civic responsibility, and knowledge of Zimbabwe's history and culture.",

  "Civic Education":
    "Civic Education helps people understand their rights, responsibilities, and how they can contribute positively to society.",

  "Critical Consciousness":
    "Critical Consciousness is the ability to think deeply about society, identify problems, and work towards positive change.",
};

export function getSimpleExplanation(concept: string): string {
  return (
    explanations[concept] ??
    `${concept} is an important topic in your notes.`
  );
}