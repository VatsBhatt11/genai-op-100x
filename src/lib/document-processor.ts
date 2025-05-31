import { pipeline } from "@xenova/transformers";
import { QdrantClient } from "@qdrant/js-client-rest";
import Groq from "groq-sdk";
import { ResumeParser } from "@/lib/resumeParser";
import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";

console.log(process.env.QDRANT_API_URL, process.env.QDRANT_API_KEY);

if (!process.env.QDRANT_API_URL || !process.env.QDRANT_API_KEY) {
  throw new Error(
    "QDRANT_API_URL and QDRANT_API_KEY environment variables are required"
  );
}

const qdrant = new QdrantClient({
  url: process.env.QDRANT_API_URL?.startsWith("http")
    ? process.env.QDRANT_API_URL
    : `https://${process.env.QDRANT_API_URL}`,
  apiKey: process.env.QDRANT_API_KEY,
  timeout: 30000, // 30 seconds timeout
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const RESUME_COLLECTION = "resume_chunks";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Initialize the embedding pipeline
let embedder: any = null;

async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

// Generate embeddings for text
async function generateEmbedding(text: string): Promise<number[]> {
  const embedder = await getEmbedder();
  const output = await embedder(text, {
    pooling: "mean",
    normalize: true,
  });
  return Array.from(output.data);
}

// Initialize the resume collection
export async function initResumeCollection() {
  try {
    // Check if collection exists
    const collections = await qdrant.getCollections();
    const exists = collections.collections.some(
      (c) => c.name === RESUME_COLLECTION
    );

    if (!exists) {
      console.log("Creating Qdrant collection:", RESUME_COLLECTION);

      // Create collection with proper configuration
      await qdrant.createCollection(RESUME_COLLECTION, {
        vectors: {
          size: 384, // Size for all-MiniLM-L6-v2
          distance: "Cosine",
        },
      });

      console.log("Successfully created Qdrant collection:", RESUME_COLLECTION);
    } else {
      console.log("Qdrant collection already exists:", RESUME_COLLECTION);
    }
  } catch (error) {
    console.error("Failed to initialize resume collection:", error);
    throw new Error(
      `Failed to initialize Qdrant collection: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Process and store resume chunks
export async function processResume(
  fileBuffer: Buffer,
  candidateId: string,
  fileName: string
) {
  let tempFilePath: string | null = null;

  try {
    // Ensure collection exists
    await initResumeCollection();

    // Initialize ResumeParser
    const parser = new ResumeParser();

    // Create a temporary file in the system's temp directory
    tempFilePath = path.join(os.tmpdir(), `resume-${Date.now()}.pdf`);
    fs.writeFileSync(tempFilePath, fileBuffer);

    // Parse PDF using ResumeParser
    console.log("Parsing resume with ResumeParser...");
    const parsedResume = await parser.parseResumeFromUrl(tempFilePath);

    // Combine all resume information into a single text for semantic search
    const resumeText = `
      Name: ${parsedResume.name}
      Skills: ${parsedResume.skills.join(", ")}
      Experience: ${parsedResume.experience}
      Education: ${parsedResume.education
        .map((edu) => `${edu.degree} in ${edu.field} from ${edu.institution}`)
        .join(", ")}
      Certifications: ${parsedResume.certifications
        .map((cert) => cert.name)
        .join(", ")}
      Contact: ${parsedResume.contact}
      ${parsedResume.text}
    `.trim();

    // Generate embedding for the entire resume
    console.log("Generating embedding for resume...");
    const vector = await generateEmbedding(resumeText);

    // Delete existing chunks for this candidate
    console.log(`Deleting existing chunks for candidate ${candidateId}...`);
    try {
      await qdrant.delete(RESUME_COLLECTION, {
        filter: {
          must: [
            {
              key: "candidateId",
              match: { value: candidateId },
            },
          ],
        },
      });
      console.log(`Deleted existing chunks for candidate ${candidateId}`);
    } catch (error) {
      console.warn(`No existing chunks found for candidate ${candidateId}`);
    }

    // Store the entire resume as a single chunk
    console.log("Storing resume in Qdrant...");
    try {
      await qdrant.upsert(RESUME_COLLECTION, {
        points: [
          {
            id: uuidv4(),
            vector,
            payload: {
              candidateId,
              fileName,
              text: resumeText,
              parsedData: parsedResume,
              timestamp: new Date().toISOString(),
            },
          },
        ],
      });
      console.log("Successfully stored resume in Qdrant");
    } catch (error: any) {
      console.error("Qdrant upsert error:", error);
      if (error.response?.data) {
        console.error("Qdrant error details:", error.response.data);
      }
      throw new Error(
        `Failed to store resume in Qdrant: ${error.message || "Unknown error"}`
      );
    }

    return {
      success: true,
      chunksCount: 1,
    };
  } catch (error) {
    console.error("Error processing resume:", error);
    throw new Error(
      `Failed to process resume: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  } finally {
    // Clean up temporary file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
        console.log("Cleaned up temporary file:", tempFilePath);
      } catch (error) {
        console.warn("Failed to clean up temporary file:", error);
      }
    }
  }
}

// Search resume content
export async function searchResumeContent(
  query: string,
  limit: number = 10
): Promise<
  Array<{
    candidateId: string;
    fileName: string;
    content: string;
    parsedData: any;
    score: number;
  }>
> {
  try {
    const queryVector = await generateEmbedding(query);
    console.log("Searching Qdrant with query vector...");

    const searchResult = await qdrant.search(RESUME_COLLECTION, {
      vector: queryVector,
      limit,
      with_payload: true,
    });

    console.log(`Found ${searchResult.length} results in Qdrant`);

    return searchResult
      .filter((result) => result.payload !== null)
      .map((result) => ({
        candidateId: result.payload!.candidateId as string,
        fileName: result.payload!.fileName as string,
        content: result.payload!.text as string,
        parsedData: result.payload!.parsedData,
        score: result.score,
      }));
  } catch (error) {
    console.error("Error searching resume content:", error);
    throw new Error(
      `Failed to search resume content: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
