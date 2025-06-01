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
            "You are a professional recruiter writing outreach messages to potential candidates. Write a personalized, engaging message that highlights the opportunity and encourages the candidate to respond.",
        },
        {
          role: "user",
          content: context,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const message = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ message });
  } catch (error) {
    // console.error("Message generation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
