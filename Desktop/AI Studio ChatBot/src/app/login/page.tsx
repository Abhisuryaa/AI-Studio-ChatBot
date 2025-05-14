"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { Lock } from "lucide-react"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      router.push("/chat")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-purple-100">
        <div className="flex flex-col items-center mb-6">
          <span className="bg-gradient-to-tr from-purple-500 to-pink-400 p-4 rounded-full shadow-lg mb-2">
            <Lock className="h-8 w-8 text-white" />
          </span>
          <h1 className="text-3xl font-extrabold text-purple-700 mb-1 tracking-tight drop-shadow">Welcome Back</h1>
          <p className="text-purple-400 text-sm">Sign in to your account</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
            autoComplete="current-password"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-pink-400 text-white rounded-xl py-3 font-bold shadow-md hover:from-purple-600 hover:to-pink-500 transition text-lg tracking-wide disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {error && <div className="text-red-500 mt-4 text-center font-medium">{error}</div>}
        <div className="mt-6 text-center text-purple-500">
          Don&apos;t have an account? <a href="/signup" className="text-pink-500 font-semibold hover:underline">Sign up</a>
        </div>
      </div>
    </div>
  )
} 