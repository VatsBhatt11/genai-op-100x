import { z } from "zod";
import { Groq } from "groq-sdk";

// Define the interface for search filters
export interface SearchFilters {
  skills?: string[];
  experience?: string;
  location?: string;
  employmentType?: string;
  keywords?: string[];
}

// Define the Groq API response schema for chat completions
const groqResponseSchema = z.object({
  id: z.string(),
  object: z.string(),
  created: z.number(),
  model: z.string(),
  choices: z.array(
    z.object({
      index: z.number(),
      message: z.object({
        role: z.string(),
        content: z.string(),
      }),
      finish_reason: z.string().optional(),
    })
  ),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number(),
    total_tokens: z.number(),
  }),
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Groq API client
export async function callGroq(
  messages: any[],
  temperature = 0.2,
  model = "llama-3.3-70b-versatile"
) {
  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: 1024,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const validatedData = groqResponseSchema.parse(data);

    return validatedData.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error calling Groq API:", error);
    throw new Error(`Failed to call Groq API: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Parse natural language query into structured filters
export async function parseQueryToFilters(
  query: string
): Promise<SearchFilters> {
  try {
    const prompt = `
Parse the following natural language job search query into structured JSON filters.

Query: "${query}"

Extract the following information if present:
- skills: Array of technical skills, technologies, frameworks mentioned
- experience: Experience level (Junior, Mid, Senior, Lead, Principal, etc.)
- location: Geographic location, country, region, or city
- employmentType: Employment type (Full-time, Part-time, Contract, Freelance, Remote, etc.)
- keywords: Other relevant keywords not captured above

Return only valid JSON in this exact format:
{
  "skills": ["skill1", "skill2"],
  "experience": "experience_level",
  "location": "location",
  "employmentType": "employment_type",
  "keywords": ["keyword1", "keyword2"]
}

If a field is not mentioned or unclear, omit it from the response.
`;

    const messages = [
      {
        role: "system",
        content:
          "You are a helpful assistant that parses job search queries into structured data. Always respond with valid JSON only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    const content = await callGroq(messages, 0.1);

    if (!content) {
      throw new Error("No response from Groq");
    }

    // Parse the JSON response
    const filters = JSON.parse(content) as SearchFilters;
    return filters;
  } catch (error) {
    console.error("Error parsing query with Groq:", error);
    // Fallback to basic keyword extraction
    return extractBasicFilters(query);
  }
}

// Generate job match score using Groq
export async function generateJobMatchScore(
  candidateProfile: any,
  jobDescription: string,
  jobSkills: string[]
): Promise<{ score: number; reasoning: string }> {
  try {
    const prompt = `
Analyze the match between this candidate and job posting. Provide a score from 0-100 and brief reasoning.

Candidate Profile:
- Skills: ${candidateProfile.skills?.join(", ") || "Not specified"}
- Experience: ${candidateProfile.experience || "Not specified"}
- Location: ${candidateProfile.location || "Not specified"}
- Resume Summary: ${candidateProfile.parsedProfile?.summary || "Not available"}

Job Requirements:
- Description: ${jobDescription}
- Required Skills: ${jobSkills.join(", ")}

Respond in this exact JSON format:
{
  "score": 85,
  "reasoning": "Strong match due to relevant skills and experience level. Missing some specific requirements."
}
`;

    const messages = [
      {
        role: "system",
        content:
          "You are an expert recruiter that evaluates candidate-job matches. Always respond with valid JSON only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    const content = await callGroq(messages, 0.3);

    if (!content) {
      throw new Error("No response from Groq");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("Error generating match score:", error);
    return {
      score: 50,
      reasoning:
        `Unable to generate detailed analysis. Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// Fallback function for basic filter extraction
function extractBasicFilters(query: string): SearchFilters {
  const lowerQuery = query.toLowerCase();
  const filters: SearchFilters = {};

  // Basic experience level detection
  if (lowerQuery.includes("senior") || lowerQuery.includes("sr.")) {
    filters.experience = "Senior";
  } else if (lowerQuery.includes("junior") || lowerQuery.includes("jr.")) {
    filters.experience = "Junior";
  } else if (lowerQuery.includes("mid") || lowerQuery.includes("middle")) {
    filters.experience = "Mid";
  } else if (lowerQuery.includes("lead") || lowerQuery.includes("principal")) {
    filters.experience = "Lead";
  }

  // Basic employment type detection
  if (lowerQuery.includes("contract") || lowerQuery.includes("freelance")) {
    filters.employmentType = "Contract";
  } else if (
    lowerQuery.includes("part-time") ||
    lowerQuery.includes("part time")
  ) {
    filters.employmentType = "Part-time";
  } else if (lowerQuery.includes("remote")) {
    filters.employmentType = "Remote";
  }

  // Extract potential skills (basic approach)
  const commonSkills = [
    "react",
    "vue",
    "angular",
    "javascript",
    "typescript",
    "python",
    "java",
    "go",
    "rust",
    "node.js",
    "express",
    "fastapi",
    "django",
    "flask",
    "spring",
    "laravel",
    "postgresql",
    "mysql",
    "mongodb",
    "redis",
    "elasticsearch",
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "terraform",
    "langchain",
    "rag",
    "openai",
    "llm",
    "machine learning",
    "ai",
  ];

  const foundSkills = commonSkills.filter((skill) =>
    lowerQuery.includes(skill.toLowerCase())
  );

  if (foundSkills.length > 0) {
    filters.skills = foundSkills;
  }

  return filters;
}

export async function generateJobFromQuery(query: string) {
  const prompt = `Given the following job search query, extract and structure the job details into a JSON format. Include all relevant information about the role, requirements, and preferences.

Query: "${query}"

Please provide a JSON object with the following structure:
{
  "title": "Job title",
  "description": "Detailed job description",
  "location": "Job location or 'Remote'",
  "experience": "Experience level (e.g., 'Entry Level', 'Mid Level', 'Senior Level')",
  "employmentType": "Employment type (e.g., 'Full-time', 'Part-time', 'Contract')",
  "isRemote": boolean,
  "skills": ["Required skill 1", "Required skill 2", ...],
  "requirements": "Detailed requirements",
  "benefits": "Job benefits and perks"
}

IMPORTANT: Respond with ONLY the JSON object, no additional text or explanation.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a job posting expert that extracts structured information from natural language queries. Always respond with ONLY valid JSON, no additional text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 1024,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response from Groq");
    }

    // Clean the response to ensure it's valid JSON
    const cleanedResponse = response
      .trim()
      .replace(/^[^{]*/, "")
      .replace(/[^}]*$/, "");

    // Parse the JSON response
    const jobData = JSON.parse(cleanedResponse);
    return jobData;
  } catch (error) {
    // console.error("Error generating job from query:", error);
    throw error;
  }
}

export async function generatePreScreeningQuestions({
  jobTitle,
  jobDescription,
  skills,
}: {
  jobTitle: string;
  jobDescription: string;
  skills: string[];
}): Promise<{ question: string; answer: string }[]> {
  try {
    const prompt = `
Generate 5 pre-screening questions for this job posting. Each question should be specific, relevant, and help assess the candidate's fit for the role.

Job Title: ${jobTitle}
Job Description: ${jobDescription}
Required Skills: ${skills.join(", ")}

For each question, provide:
1. A clear, specific question that helps evaluate the candidate's experience or knowledge
2. A sample answer that demonstrates what a good response would look like

Return the questions and answers in this exact JSON format:
[
  {
    "question": "What is your experience with [specific technology]?",
    "answer": "I have worked with [technology] for X years, specifically on projects involving..."
  },
  ...
]

Make the questions specific to the role and required skills.`;

    const messages = [
      {
        role: "system",
        content:
          "You are an expert recruiter that creates effective pre-screening questions. Always respond with valid JSON only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    const content = await callGroq(messages, 0.3);

    if (!content) {
      throw new Error("No response from Groq");
    }

    return JSON.parse(content);
  } catch (error) {
    // console.error("Error generating pre-screening questions:", error);
    return [
      {
        question: "",
        answer: "",
      },
    ];
  }
}
