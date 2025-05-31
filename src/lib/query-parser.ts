import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface ParsedQuery {
  skills: string[];
  experience: string;
  location: string;
  employmentType: string;
  seniority: string;
  additionalRequirements: string[];
}

export async function parseQuery(query: string): Promise<ParsedQuery> {
  const prompt = `
    Parse the following job search query into structured data. Extract:
    - Required skills (as an array)
    - Experience level/requirements
    - Location preferences
    - Employment type (full-time, contract, etc.)
    - Seniority level
    - Any additional requirements

    Query: "${query}"

    Return the result as a JSON object with the following structure:
    {
      "skills": string[],
      "experience": string,
      "location": string,
      "employmentType": string,
      "seniority": string,
      "additionalRequirements": string[]
    }
  `;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a precise query parser that extracts structured data from natural language job search queries. Always return valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.1,
    max_tokens: 500,
    response_format: { type: "json_object" },
  });

  const parsedResult = JSON.parse(
    completion.choices[0]?.message?.content || "{}"
  );
  return parsedResult as ParsedQuery;
}
