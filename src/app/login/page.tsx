"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import "../../styles/auth.css"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    userType: "candidate",
  })
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isLogin) {
      // Simulate login
      if (formData.userType === "company") {
        router.push("/company/dashboard")
      } else {
        router.push("/onboarding")
      }
    } else {
      // Simulate signup
      router.push("/onboarding")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="auth-container">
      <div className="auth-card animate-scale-in">
        <h1 className="auth-title">{isLogin ? "Welcome Back" : "Create Account"}</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="userType">I am a</label>
            <select id="userType" name="userType" value={formData.userType} onChange={handleInputChange}>
              <option value="candidate">Job Seeker</option>
              <option value="company">Employer</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
