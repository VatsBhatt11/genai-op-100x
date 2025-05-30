import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { parseQueryToFilters } from "@/lib/groq"

// Test endpoint to verify Groq integration
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { query } = body

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const filters = await parseQueryToFilters(query)

    return NextResponse.json({
      originalQuery: query,
      parsedFilters: filters,
      model: "llama3-8b-8192", // Default model used
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Test endpoint error:", error)
    return NextResponse.json({ error: "Failed to test query parsing", details: error.message }, { status: 500 })
  }
}
