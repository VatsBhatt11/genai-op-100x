import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { context } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a technical recruiter creating pre-screening questions for candidates. Generate 3-5 relevant technical and behavioral questions based on the job context. Questions should be specific, clear, and help assess candidate fit.",
        },
        {
          role: "user",
          content: context,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || "";
    const questions = response
      .split("\n")
      .filter(
        (line) => line.trim().startsWith("-") || line.trim().match(/^\d+\./)
      )
      .map((line) => line.replace(/^[-•\d\.\s]+/, "").trim())
      .filter(Boolean)
      .map((question, index) => ({
        id: `q${index + 1}`,
        question,
      }));

    return NextResponse.json({ questions });
  } catch (error) {
    // console.error("Question generation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
