import { NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const { jobDescription, candidateId, interviewTranscript, applicationId } =
      await request.json();

    if (
      !jobDescription ||
      !candidateId ||
      !interviewTranscript ||
      !applicationId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate report using Groq
    const prompt = `
      Based *strictly* on the following job description and interview transcript, generate an interview report.
      Do not infer or assume any information not explicitly present in the provided text.
      The report should include:
      - An overall score out of 100.
      - A summary of the candidate's performance.
      - Key strengths observed during the interview.
      - Areas for improvement.

      Job Description: ${jobDescription}

      Interview Transcript:
      ${interviewTranscript}

      Respond in this exact JSON format : (for example this is a sample response):
      {
        "score": {{score_value}} // Calculate the score based on the candidate's performance and strengths observed during the interview and ensure it is number.
        "summary": {{summary_value}} // Generate a summary based on the candidate's performance. Ensure this is never empty and it is string.
        "strengths": {{strengths_value}} // List candidate's strengths. If no specific strengths are identified, provide a general statement like "No specific strengths identified based on the provided transcript." inside the list, ensure it is never empty and is list.
        "areasForImprovement": {{areasForImprovement_value}} // List areas for improvement. If no specific areas for improvement are identified, provide a general statement like "No specific areas for improvement identified based on the provided transcript." and ensure it is never empty and is list.
      }

      (for example this is a sample response):
      {
        "score": 85,
        "summary": "Candidate demonstrated strong understanding of core concepts and effectively answered questions. Always provide at least one sentence for the summary.",
        "strengths": ["Strong communication skills", "Good problem-solving approach"], 
        "areasForImprovement": ["Could elaborate more on past project details", "Needs to improve on specific technical area"] 
      }
    `;

    const messages = [
      {
        role: "system",
        content:
          "You are an AI assistant that generates interview reports based on job descriptions and interview transcripts. Always respond with valid JSON only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    const groqResponse = await callGroq(messages, 0.5);
    // Extract JSON string from Groq's response, removing markdown code block if present
    let jsonString = groqResponse.trim();
    // If the response is wrapped in markdown, extract the JSON part using a more robust regex
    const match = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      jsonString = match[1].trim();
    }
    const report = JSON.parse(jsonString);

    // Save the report to the database (e.g., update the outreach record or create a new interview record)
    // For demonstration, let's assume we update an outreach record or create a new one.
    // You might need to adjust this based on your actual Prisma schema.
    await prisma.interviewReport.upsert({
      where: { applicationId: applicationId },
      update: {
        score: report.score,
        summary: report.summary,
        strengths: report.strengths,
        areasForImprovement: report.areasForImprovement,
      },
      create: {
        score: report.score,
        summary: report.summary,
        strengths: report.strengths,
        areasForImprovement: report.areasForImprovement,
        application: { connect: { id: applicationId } },
      },
    });

    await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: ApplicationStatus.INTERVIEW_COMPLETED,
        score: report.score,
      },
    });

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Error generating interview report:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
