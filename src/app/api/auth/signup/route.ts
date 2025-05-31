import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/src/lib/prisma";
import { UserRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();

    // Validate input
    if (!email || !password || !role) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role as UserRole,
      },
    });

    // If user is a candidate, create an empty candidate profile
    if (role === UserRole.CANDIDATE) {
      await prisma.candidateProfile.create({
        data: {
          userId: user.id,
          skills: [],
          certifications: [],
          languages: [],
        },
      });
    }

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
