"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { UserPlus } from "lucide-react"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => router.push("/login"), 2000)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-purple-100">
        <div className="flex flex-col items-center mb-6">
          <span className="bg-gradient-to-tr from-pink-400 to-purple-500 p-4 rounded-full shadow-lg mb-2">
            <UserPlus className="h-8 w-8 text-white" />
          </span>
          <h1 className="text-3xl font-extrabold text-purple-700 mb-1 tracking-tight drop-shadow">Create Account</h1>
          <p className="text-purple-400 text-sm">Sign up to get started</p>
        </div>
        <form onSubmit={handleSignup} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="rounded-xl border border-purple-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm bg-white/90 placeholder-purple-300 text-purple-700"
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="rounded-xl border border-purple-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 transition shadow-sm bg-white/90 placeholder-purple-300 text-purple-700"
            required
            autoComplete="new-password"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-xl py-3 font-bold shadow-md hover:from-pink-500 hover:to-purple-600 transition text-lg tracking-wide disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        {error && <div className="text-red-500 mt-4 text-center font-medium">{error}</div>}
        {success && <div className="text-green-600 mt-4 text-center font-medium">Account created! Redirecting...</div>}
        <div className="mt-6 text-center text-purple-500">
          Already have an account? <a href="/login" className="text-pink-500 font-semibold hover:underline">Login</a>
        </div>
      </div>
    </div>
  )
} 