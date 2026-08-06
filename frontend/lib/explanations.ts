export function getSimpleExplanation(concept: string): string {
  switch (concept) {
    case "ZSS":
      return "The ZSS module teaches students about Zimbabwe's history, culture, citizenship, and national development so they can become responsible citizens.";

    case "Purpose of ZSS":
      return "The purpose of the ZSS module is to help students understand Zimbabwe, appreciate national values, and become responsible citizens.";

    case "Major Aims of ZSS":
      return "The major aims of ZSS are to develop patriotism, critical thinking, civic responsibility, and knowledge of Zimbabwe's history and culture.";

    case "Civic Education":
      return "Civic Education helps people understand their rights, responsibilities, and how they can contribute positively to society.";

    case "Critical Consciousness":
      return "Critical Consciousness is the ability to think deeply about society, identify problems, and work towards positive change.";

    default:
      return `${concept} is an important topic in your notes.`;
  }
}