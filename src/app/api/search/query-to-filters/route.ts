import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { parseQueryToFilters } from "@/lib/groq"
import { getCandidateMatchCount } from "@/lib/enhanced-search"
import { z } from "zod"

const querySchema = z.object({
  query: z.string().min(1, "Query cannot be empty"),
})

const filtersSchema = z.object({
  skills: z.array(z.string()).optional(),
  experience: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.string().optional(),
  keywords: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only companies should be able to search for candidates
    if (session.user.role !== "COMPANY") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { query } = querySchema.parse(body)

    // Parse the natural language query into structured filters
    const rawFilters = await parseQueryToFilters(query)

    // Validate the parsed filters
    const filters = filtersSchema.parse(rawFilters)

    // Get sample matching candidate count
    const matchCount = await getCandidateMatchCount(filters)

    return NextResponse.json({
      originalQuery: query,
      parsedFilters: filters,
      estimatedMatches: matchCount,
      success: true,
    })
  } catch (error) {
    console.error("Query parsing error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid query format", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to parse query" }, { status: 500 })
  }
}
