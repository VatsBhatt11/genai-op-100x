import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateJobFromQuery } from "@/lib/groq";
import { z } from "zod";

const createJobSchema = z.object({
  query: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "COMPANY") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { query } = createJobSchema.parse(body);

    // Generate job data from the query using Groq
    const jobData = await generateJobFromQuery(query);

    // Create the job in the database
    const job = await prisma.job.create({
      data: {
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        experience: jobData.experience,
        employmentType: jobData.employmentType,
        isRemote: jobData.isRemote,
        skills: jobData.skills,
        companyId: session.user.id,
      },
      include: {
        company: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    // console.error("Create job from query error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
