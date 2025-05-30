import { prisma } from "./prisma"

export async function searchJobs(query: string, userId: string) {
  if (!query.trim()) {
    return await prisma.job.findMany({
      include: {
        company: {
          select: {
            id: true,
            email: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  // Use PostgreSQL full-text search
  const jobs = await prisma.$queryRaw`
    SELECT j.*, u.email as company_email,
           ts_rank(
             to_tsvector('english', j.title || ' ' || j.description || ' ' || array_to_string(j.skills, ' ')),
             plainto_tsquery('english', ${query})
           ) as rank
    FROM jobs j
    JOIN users u ON j."companyId" = u.id
    WHERE to_tsvector('english', j.title || ' ' || j.description || ' ' || array_to_string(j.skills, ' ')) 
          @@ plainto_tsquery('english', ${query})
    ORDER BY rank DESC, j."createdAt" DESC
  `

  return jobs
}

export async function calculateMatchScore(candidateId: string, jobId: string): Promise<number> {
  const candidate = await prisma.candidateProfile.findUnique({
    where: { id: candidateId },
  })

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  })

  if (!candidate || !job) return 0

  let score = 0
  const candidateSkills = candidate.skills || []
  const jobSkills = job.skills || []

  // Skill matching (60% weight)
  const skillMatches = candidateSkills.filter((skill) =>
    jobSkills.some(
      (jobSkill) =>
        jobSkill.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(jobSkill.toLowerCase()),
    ),
  )
  const skillScore = (skillMatches.length / Math.max(jobSkills.length, 1)) * 60

  // Experience matching (30% weight)
  const experienceScore = candidate.experience && job.experience ? 30 : 0

  // Location matching (10% weight)
  const locationScore =
    candidate.location && job.location && candidate.location.toLowerCase().includes(job.location.toLowerCase()) ? 10 : 0

  score = skillScore + experienceScore + locationScore
  return Math.min(Math.round(score), 100)
}

export async function generateFeedback(candidateId: string, jobId: string, matchScore: number): Promise<string> {
  const candidate = await prisma.candidateProfile.findUnique({
    where: { id: candidateId },
  })

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  })

  if (!candidate || !job) return "Unable to generate feedback"

  const candidateSkills = candidate.skills || []
  const jobSkills = job.skills || []

  const missingSkills = jobSkills.filter(
    (skill) => !candidateSkills.some((candidateSkill) => candidateSkill.toLowerCase().includes(skill.toLowerCase())),
  )

  let feedback = `Match Score: ${matchScore}%\n\n`

  if (matchScore >= 80) {
    feedback += "Excellent match! Your profile aligns very well with this position."
  } else if (matchScore >= 60) {
    feedback += "Good match! You have many of the required qualifications."
  } else if (matchScore >= 40) {
    feedback += "Moderate match. Consider highlighting relevant experience."
  } else {
    feedback += "Lower match. This role may require additional skills or experience."
  }

  if (missingSkills.length > 0) {
    feedback += `\n\nSkills to develop: ${missingSkills.slice(0, 5).join(", ")}`
  }

  return feedback
}
