import { prisma } from "@/lib/prisma";
import {
  initVectorCollection,
  upsertCandidateVector,
} from "@/lib/vector-search";

async function main() {
  try {
    // console.log("Initializing vector collection...");
    await initVectorCollection();

    // console.log("Fetching all candidate profiles...");
    const profiles = await prisma.candidateProfile.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    // console.log(`Found ${profiles.length} profiles. Starting vectorization...`);

    for (const profile of profiles) {
      // console.log(`Processing profile: ${profile.fullName}`);
      await upsertCandidateVector(profile.id, {
        fullName: profile.fullName,
        skills: profile.skills,
        experience: profile.experience || undefined,
        location: profile.location || undefined,
        employmentType: profile.employmentType || undefined,
      });
    }

    // console.log("Vector database initialization complete!");
  } catch (error) {
    // console.error("Error initializing vector database:", error);
    process.exit(1);
  }
}

main();
