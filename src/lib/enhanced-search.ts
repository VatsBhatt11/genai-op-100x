import { prisma } from "./prisma"
import type { SearchFilters } from "./openai"

export async function searchCandidatesWithFilters(filters: SearchFilters, page = 1, limit = 20) {
  const offset = (page - 1) * limit

  // Build where clause based on filters
  const whereClause: any = {}

  if (filters.skills && filters.skills.length > 0) {
    whereClause.skills = {
      hasEvery: filters.skills,
    }
  }

  if (filters.experience) {
    whereClause.experience = {
      contains: filters.experience,
      mode: "insensitive",
    }
  }

  if (filters.location) {
    whereClause.location = {
      contains: filters.location,
      mode: "insensitive",
    }
  }

  if (filters.employmentType) {
    whereClause.employmentType = {
      contains: filters.employmentType,
      mode: "insensitive",
    }
  }

  // If we have keywords, use full-text search
  if (filters.keywords && filters.keywords.length > 0) {
    const searchQuery = filters.keywords.join(" & ")

    const candidates = await prisma.$queryRaw`
      SELECT cp.*, u.email, u.id as user_id,
             ts_rank(
               to_tsvector('english', COALESCE(cp."resumeText", '') || ' ' || 
                          COALESCE(cp."fullName", '') || ' ' || 
                          array_to_string(cp.skills, ' ')),
               plainto_tsquery('english', ${searchQuery})
             ) as rank
      FROM candidate_profiles cp
      JOIN users u ON cp."userId" = u.id
      WHERE to_tsvector('english', COALESCE(cp."resumeText", '') || ' ' || 
                       COALESCE(cp."fullName", '') || ' ' || 
                       array_to_string(cp.skills, ' ')) 
            @@ plainto_tsquery('english', ${searchQuery})
      ${filters.skills ? `AND cp.skills @> ARRAY[${filters.skills.map((s) => `'${s}'`).join(",")}]::text[]` : ""}
      ${filters.experience ? `AND cp.experience ILIKE '%${filters.experience}%'` : ""}
      ${filters.location ? `AND cp.location ILIKE '%${filters.location}%'` : ""}
      ${filters.employmentType ? `AND cp."employmentType" ILIKE '%${filters.employmentType}%'` : ""}
      ORDER BY rank DESC, cp."createdAt" DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    return candidates
  }

  // Regular Prisma query without full-text search
  const candidates = await prisma.candidateProfile.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: offset,
    take: limit,
  })

  return candidates
}

export async function searchJobsForCandidate(candidateId: string, page = 1, limit = 20) {
  const offset = (page - 1) * limit

  const candidate = await prisma.candidateProfile.findUnique({
    where: { id: candidateId },
  })

  if (!candidate) {
    throw new Error("Candidate not found")
  }

  // Build search query based on candidate skills and preferences
  const candidateSkills = candidate.skills || []
  const searchTerms = [candidate.experience, candidate.location, ...candidateSkills].filter(Boolean).join(" ")

  if (searchTerms) {
    const jobs = await prisma.$queryRaw`
      SELECT j.*, u.email as company_email,
             ts_rank(
               to_tsvector('english', j.title || ' ' || j.description || ' ' || 
                          array_to_string(j.skills, ' ')),
               plainto_tsquery('english', ${searchTerms})
             ) as rank
      FROM jobs j
      JOIN users u ON j."companyId" = u.id
      WHERE to_tsvector('english', j.title || ' ' || j.description || ' ' || 
                       array_to_string(j.skills, ' ')) 
            @@ plainto_tsquery('english', ${searchTerms})
      ORDER BY rank DESC, j."createdAt" DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    return jobs
  }

  // Fallback to recent jobs if no search terms
  return await prisma.job.findMany({
    include: {
      company: {
        select: {
          id: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: offset,
    take: limit,
  })
}

export async function getCandidateMatchCount(filters: SearchFilters): Promise<number> {
  const whereClause: any = {}

  if (filters.skills && filters.skills.length > 0) {
    whereClause.skills = {
      hasEvery: filters.skills,
    }
  }

  if (filters.experience) {
    whereClause.experience = {
      contains: filters.experience,
      mode: "insensitive",
    }
  }

  if (filters.location) {
    whereClause.location = {
      contains: filters.location,
      mode: "insensitive",
    }
  }

  if (filters.employmentType) {
    whereClause.employmentType = {
      contains: filters.employmentType,
      mode: "insensitive",
    }
  }

  return await prisma.candidateProfile.count({
    where: whereClause,
  })
}
