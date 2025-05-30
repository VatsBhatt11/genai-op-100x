import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const messageSendSchema = z.object({
  applicationId: z.string(),
  channel: z.enum(["EMAIL", "WHATSAPP", "SMS"]),
  templateData: z.object({}).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { applicationId, channel, templateData } = messageSendSchema.parse(body)

    // Get application details
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          include: {
            company: true,
          },
        },
        candidate: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Check if user is the company owner
    if (session.user.id !== application.job.companyId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Generate message content based on template
    const content = generateMessageContent(application, channel, templateData)

    // Create message log
    const messageLog = await prisma.messageLog.create({
      data: {
        applicationId,
        senderId: session.user.id,
        channel,
        content,
        status: "PENDING",
      },
    })

    // Here you would integrate with actual messaging services
    // For now, we'll just mark as sent
    const updatedMessageLog = await prisma.messageLog.update({
      where: { id: messageLog.id },
      data: {
        status: "SENT",
        sentAt: new Date(),
      },
    })

    return NextResponse.json(updatedMessageLog, { status: 201 })
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateMessageContent(application: any, channel: string, templateData: any): string {
  const candidateName = application.candidate.parsedProfile?.name || "Candidate"
  const jobTitle = application.job.title
  const companyEmail = application.job.company.email

  switch (channel) {
    case "EMAIL":
      return `Subject: Application Update for ${jobTitle}

Dear ${candidateName},

Thank you for your application for the ${jobTitle} position. We have reviewed your profile and would like to move forward with the next steps.

Best regards,
${companyEmail}`

    case "WHATSAPP":
      return `Hi ${candidateName}! Thanks for applying to ${jobTitle}. We'd like to schedule an interview. Please reply with your availability.`

    case "SMS":
      return `Hi ${candidateName}, your application for ${jobTitle} has been reviewed. We'll contact you soon with next steps.`

    default:
      return "Thank you for your application."
  }
}
