import pdf from "pdf-parse"

interface ParsedProfile {
  name?: string
  email?: string
  phone?: string
  skills: string[]
  experience: string[]
  education: string[]
  summary?: string
}

export async function parseResume(fileUrl: string): Promise<{
  parsedProfile: ParsedProfile
  rawText: string
  cleanedText: string
}> {
  try {
    // Fetch the PDF file
    const response = await fetch(fileUrl)
    const buffer = await response.arrayBuffer()

    // Parse PDF
    const data = await pdf(Buffer.from(buffer))
    const rawText = data.text

    // Clean text for better FTS
    const cleanedText = cleanTextForSearch(rawText)

    // Extract structured data using regex patterns
    const parsedProfile: ParsedProfile = {
      name: extractName(rawText),
      email: extractEmail(rawText),
      phone: extractPhone(rawText),
      skills: extractSkills(rawText),
      experience: extractExperience(rawText),
      education: extractEducation(rawText),
      summary: extractSummary(rawText),
    }

    return { parsedProfile, rawText, cleanedText }
  } catch (error) {
    console.error("Resume parsing error:", error)
    throw new Error("Failed to parse resume")
  }
}

function cleanTextForSearch(text: string): string {
  return text
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/[^\w\s.,()-]/g, "") // Remove special characters except basic punctuation
    .trim()
}

function extractName(text: string): string | undefined {
  const lines = text.split("\n").filter((line) => line.trim())
  return lines[0]?.trim()
}

function extractEmail(text: string): string | undefined {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
  const match = text.match(emailRegex)
  return match?.[0]
}

function extractPhone(text: string): string | undefined {
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?$$?\d{3}$$?[-.\s]?\d{3}[-.\s]?\d{4}/
  const match = text.match(phoneRegex)
  return match?.[0]
}

function extractSkills(text: string): string[] {
  const skillsSection = text.match(/(?:skills|technologies|technical skills)[:\s]*(.*?)(?:\n\n|\n[A-Z])/is)
  if (!skillsSection) return []

  const skillsText = skillsSection[1]
  const skills = skillsText
    .split(/[,\n•·-]/)
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 0 && skill.length < 50)

  return skills
}

function extractExperience(text: string): string[] {
  const experienceSection = text.match(
    /(?:experience|work history|employment)[:\s]*(.*?)(?:\n\n|\neducation|\nprojects)/is,
  )
  if (!experienceSection) return []

  const experiences = experienceSection[1]
    .split(/\n(?=[A-Z].*(?:20\d{2}|19\d{2}))/)
    .map((exp) => exp.trim())
    .filter((exp) => exp.length > 10)

  return experiences
}

function extractEducation(text: string): string[] {
  const educationSection = text.match(/(?:education|academic background)[:\s]*(.*?)(?:\n\n|\n[A-Z])/is)
  if (!educationSection) return []

  const education = educationSection[1]
    .split(/\n(?=[A-Z])/)
    .map((edu) => edu.trim())
    .filter((edu) => edu.length > 5)

  return education
}

function extractSummary(text: string): string | undefined {
  const summarySection = text.match(/(?:summary|objective|profile)[:\s]*(.*?)(?:\n\n|\n[A-Z])/is)
  return summarySection?.[1]?.trim()
}

export function calculateCompletionScore(profile: ParsedProfile): number {
  let score = 0
  const maxScore = 100

  if (profile.name) score += 15
  if (profile.email) score += 15
  if (profile.phone) score += 10
  if (profile.skills.length > 0) score += 20
  if (profile.experience.length > 0) score += 25
  if (profile.education.length > 0) score += 10
  if (profile.summary) score += 5

  return Math.min(score, maxScore)
}

export function extractExperienceLevel(profile: ParsedProfile): string {
  const experienceText = profile.experience.join(" ").toLowerCase()
  const summaryText = (profile.summary || "").toLowerCase()
  const allText = experienceText + " " + summaryText

  if (allText.includes("senior") || allText.includes("lead") || allText.includes("principal")) {
    return "Senior"
  } else if (allText.includes("mid") || allText.includes("intermediate")) {
    return "Mid"
  } else if (allText.includes("junior") || allText.includes("entry")) {
    return "Junior"
  }

  // Try to infer from years of experience
  const yearsMatch = allText.match(/(\d+)\s*(?:years?|yrs?)/i)
  if (yearsMatch) {
    const years = Number.parseInt(yearsMatch[1])
    if (years >= 5) return "Senior"
    if (years >= 2) return "Mid"
    return "Junior"
  }

  return "Mid" // Default
}
