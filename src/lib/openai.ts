import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface SearchFilters {
  skills?: string[]
  experience?: string
  location?: string
  employmentType?: string
  keywords?: string[]
}

export async function parseQueryToFilters(query: string): Promise<SearchFilters> {
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
`

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that parses job search queries into structured data. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 500,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error("No response from OpenAI")
    }

    // Parse the JSON response
    const filters = JSON.parse(content) as SearchFilters
    return filters
  } catch (error) {
    console.error("Error parsing query with OpenAI:", error)
    // Fallback to basic keyword extraction
    return extractBasicFilters(query)
  }
}

function extractBasicFilters(query: string): SearchFilters {
  const lowerQuery = query.toLowerCase()
  const filters: SearchFilters = {}

  // Basic experience level detection
  if (lowerQuery.includes("senior") || lowerQuery.includes("sr.")) {
    filters.experience = "Senior"
  } else if (lowerQuery.includes("junior") || lowerQuery.includes("jr.")) {
    filters.experience = "Junior"
  } else if (lowerQuery.includes("mid") || lowerQuery.includes("middle")) {
    filters.experience = "Mid"
  } else if (lowerQuery.includes("lead") || lowerQuery.includes("principal")) {
    filters.experience = "Lead"
  }

  // Basic employment type detection
  if (lowerQuery.includes("contract") || lowerQuery.includes("freelance")) {
    filters.employmentType = "Contract"
  } else if (lowerQuery.includes("part-time") || lowerQuery.includes("part time")) {
    filters.employmentType = "Part-time"
  } else if (lowerQuery.includes("remote")) {
    filters.employmentType = "Remote"
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
  ]

  const foundSkills = commonSkills.filter((skill) => lowerQuery.includes(skill.toLowerCase()))

  if (foundSkills.length > 0) {
    filters.skills = foundSkills
  }

  return filters
}

export async function generateJobMatchScore(
  candidateProfile: any,
  jobDescription: string,
  jobSkills: string[],
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
`

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert recruiter that evaluates candidate-job matches. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 300,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error("No response from OpenAI")
    }

    return JSON.parse(content)
  } catch (error) {
    console.error("Error generating match score:", error)
    return {
      score: 50,
      reasoning: "Unable to generate detailed analysis. Basic compatibility assessment needed.",
    }
  }
}
