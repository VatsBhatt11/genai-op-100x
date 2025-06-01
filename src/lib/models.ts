// Available LLM models for different use cases
export const MODELS = {
  // Groq models
  DEFAULT: "llama-3.3-70b-versatile", // Good balance of performance and quality
  PARSING: "llama-3.3-70b-versatile", // Good for structured data extraction
  MATCHING: "llama-3.3-70b-versatile", // Better for complex reasoning tasks
  FEEDBACK: "llama-3.3-70b-versatile", // Higher quality for detailed feedback
};

// Helper to select the appropriate model based on task complexity and token needs
export function selectModel(
  task: "parsing" | "matching" | "feedback" | "default",
  complexityLevel = "medium"
) {
  switch (task) {
    case "parsing":
      return MODELS.PARSING;
    case "matching":
      return complexityLevel === "high" ? MODELS.FEEDBACK : MODELS.MATCHING;
    case "feedback":
      return MODELS.FEEDBACK;
    default:
      return MODELS.DEFAULT;
  }
}
