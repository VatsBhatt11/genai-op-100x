"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SignupPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page since we handle both login and signup there
    router.push("/login")
  }, [router])

  return null
}
