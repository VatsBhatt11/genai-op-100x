import { pipeline } from "@xenova/transformers";
import { QdrantClient } from "@qdrant/js-client-rest";

// Initialize Qdrant client
const qdrant = new QdrantClient({
  url: process.env.QDRANT_API_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const COLLECTION_NAME = "resume_chunks";

// Initialize the embedding pipeline
let embedder: any = null;

async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

// Generate embeddings for text
export async function generateEmbedding(text: string): Promise<number[]> {
  const embedder = await getEmbedder();
  const output = await embedder(text, {
    pooling: "mean",
    normalize: true,
  });
  return Array.from(output.data);
}

// Create or update vector for a candidate profile
export async function upsertCandidateVector(
  profileId: string,
  profile: {
    fullName: string;
    skills: string[];
    experience?: string;
    location?: string;
    employmentType?: string;
  }
) {
  // Combine profile information into a single text
  const profileText = `
    ${profile.fullName}
    Skills: ${profile.skills.join(", ")}
    ${profile.experience ? `Experience: ${profile.experience}` : ""}
    ${profile.location ? `Location: ${profile.location}` : ""}
    ${
      profile.employmentType ? `Employment Type: ${profile.employmentType}` : ""
    }
  `.trim();

  // Generate embedding
  const vector = await generateEmbedding(profileText);

  // Upsert to Qdrant
  await qdrant.upsert(COLLECTION_NAME, {
    points: [
      {
        id: profileId,
        vector,
        payload: {
          profileId,
          fullName: profile.fullName,
          skills: profile.skills,
          experience: profile.experience,
          location: profile.location,
          employmentType: profile.employmentType,
        },
      },
    ],
  });
}

// Search candidates using vector similarity
export async function searchCandidates(
  query: string,
  limit: number = 20
): Promise<{ profileId: string; score: number }[]> {
  // Generate query embedding
  const queryVector = await generateEmbedding(query);

  // Search in Qdrant
  const searchResult = await qdrant.search(COLLECTION_NAME, {
    vector: queryVector,
    limit,
    with_payload: true,
  });

  return searchResult
    .filter((result) => result.payload !== null)
    .map((result) => ({
      profileId: result.payload!.profileId as string,
      score: result.score,
    }));
}

// Initialize the vector collection
export async function initVectorCollection() {
  try {
    // Check if collection exists
    const collections = await qdrant.getCollections();
    const exists = collections.collections.some(
      (c) => c.name === COLLECTION_NAME
    );

    if (!exists) {
      // Create collection with proper configuration
      await qdrant.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 384, // Size for all-MiniLM-L6-v2
          distance: "Cosine",
        },
      });
    }
  } catch (error) {
    console.error("Failed to initialize vector collection:", error);
    throw error;
  }
}
