// Available LLM models for different use cases
export const MODELS = {
  // Groq models
  DEFAULT: "llama3-8b-8192", // Good balance of performance and quality
  PARSING: "llama3-8b-8192", // Good for structured data extraction
  MATCHING: "mixtral-8x7b-32768", // Better for complex reasoning tasks
  FEEDBACK: "llama3-70b-8192", // Higher quality for detailed feedback
}

// Helper to select the appropriate model based on task complexity and token needs
export function selectModel(task: "parsing" | "matching" | "feedback" | "default", complexityLevel = "medium") {
  switch (task) {
    case "parsing":
      return MODELS.PARSING
    case "matching":
      return complexityLevel === "high" ? MODELS.FEEDBACK : MODELS.MATCHING
    case "feedback":
      return MODELS.FEEDBACK
    default:
      return MODELS.DEFAULT
  }
}
