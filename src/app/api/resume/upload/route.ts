import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { processResume, initResumeCollection } from "@/lib/document-processor";
import * as fs from "fs";
import * as path from "path";
import type { Session } from "next-auth";

// Ensure upload directory exists
const UPLOAD_DIR = path.join(process.cwd(), "public", "resumes");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function POST(req: Request) {
  // console.log("Starting resume upload process...");

  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user) {
      // console.log("Unauthorized access attempt");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const candidateId = formData.get("candidateId") as string;

    // console.log("Received upload request:", {
    //   fileName: file?.name,
    //   candidateId,
    //   fileType: file?.type,
    // });

    if (!file || !candidateId) {
      // console.log("Missing required fields");
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Verify file type
    if (!file.type.includes("pdf")) {
      // console.log("Invalid file type:", file.type);
      return new NextResponse("Only PDF files are allowed", { status: 400 });
    }

    // Convert File to Buffer
    // console.log("Converting file to buffer...");
    const buffer = Buffer.from(await file.arrayBuffer());
    // console.log("File converted to buffer, size:", buffer.length);

    // Create candidate directory if it doesn't exist
    const candidateDir = path.join(UPLOAD_DIR, candidateId);
    if (!fs.existsSync(candidateDir)) {
      // console.log("Creating candidate directory:", candidateDir);
      fs.mkdirSync(candidateDir, { recursive: true });
    }

    // Save file to disk
    const filePath = path.join(candidateDir, file.name);
    // console.log("Saving file to disk:", filePath);
    fs.writeFileSync(filePath, buffer);
    // console.log("File saved successfully");

    // Initialize Qdrant collection
    // console.log("Initializing Qdrant collection...");
    try {
      await initResumeCollection();
      // console.log("Qdrant collection initialized successfully");
    } catch (error) {
      // console.error("Failed to initialize Qdrant collection:", error);
      throw error;
    }

    // Process the resume and store chunks in vector database
    // console.log("Starting resume processing...");
    let processResult;
    try {
      processResult = await processResume(buffer, candidateId, file.name);
      // console.log("Resume processing completed:", processResult);
    } catch (error) {
      // console.error("Failed to process resume:", error);
      throw error;
    }

    // Update candidate profile with resume information
    // console.log("Updating candidate profile...");
    try {
      await prisma.candidateProfile.update({
        where: { id: candidateId },
        data: {
          resumeUrl: `/resumes/${candidateId}/${file.name}`,
          updatedAt: new Date(),
        },
      });
      // console.log("Candidate profile updated successfully");
    } catch (error) {
      // console.error("Failed to update candidate profile:", error);
      throw error;
    }

    // console.log("Resume upload process completed successfully");
    return NextResponse.json({
      success: true,
      message: "Resume processed successfully",
      chunksCount: processResult.chunksCount,
    });
  } catch (error) {
    // console.error("Resume upload error:", error);
    return new NextResponse(
      `Internal Server Error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 500 }
    );
  }
}
