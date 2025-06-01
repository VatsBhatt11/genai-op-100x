import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";
import { QdrantClient } from "@qdrant/js-client-rest";

const qdrant = new QdrantClient({
  url: process.env.QDRANT_API_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as Session & {
      user: {
        id: string;
        role: string;
      };
    };

    if (!session?.user || session.user.role !== "CANDIDATE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.candidateProfile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    // console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session & {
      user: {
        id: string;
        role: string;
      };
    };

    if (!session?.user || session.user.role !== "CANDIDATE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Update profile in database
    const updatedProfile = await prisma.candidateProfile.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        location: data.location,
        experience: data.experience,
        skills: data.skills,
        education: data.education,
        languages: data.languages,
        certifications: data.certifications,
        employmentType: data.employmentType,
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
        portfolioUrl: data.portfolioUrl,
      },
      create: {
        userId: session.user.id,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        location: data.location,
        experience: data.experience,
        skills: data.skills,
        education: data.education,
        languages: data.languages,
        certifications: data.certifications,
        employmentType: data.employmentType,
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
        portfolioUrl: data.portfolioUrl,
      },
    });

    // Prepare vector data for Qdrant
    const vectorData = {
      id: session.user.id,
      vector: [
        // Convert text fields to embeddings (you'll need to implement this)
        // For now, we'll use a simple concatenation of fields
        ...data.skills.map((skill: string) => skill.toLowerCase()),
        data.experience?.toLowerCase(),
        // Convert education array to string and then to lowercase
        ...data.education?.map((edu: any) =>
          `${edu.institution} ${edu.degree} ${edu.field} ${edu.gpa}`.toLowerCase()
        ),
        data.languages?.map((lang: string) => lang.toLowerCase()),
        data.certifications?.map((cert: string) => cert.toLowerCase()),
      ]
        .flat()
        .filter(Boolean),
      payload: {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        location: data.location,
        experience: data.experience,
        skills: data.skills,
        education: data.education,
        languages: data.languages,
        certifications: data.certifications,
        employmentType: data.employmentType,
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
        portfolioUrl: data.portfolioUrl,
      },
    };

    // Update vector in Qdrant
    // await qdrant.upsert("resume_chunks", {
    //   points: [vectorData],
    // });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    // console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
