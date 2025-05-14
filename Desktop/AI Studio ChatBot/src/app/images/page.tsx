"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setImage(null)
    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      const data = await response.json()
      if (data.image) {
        setImage(data.image)
      } else {
        setError(data.error || "Failed to generate image.")
      }
    } catch (err) {
      setError("Failed to generate image.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen py-10 bg-gradient-to-br from-purple-100 to-pink-100">
      <h1 className="text-3xl font-bold mb-6">AI Image Generator</h1>
      <form onSubmit={handleGenerate} className="w-full max-w-md flex flex-col gap-4 mb-8">
        <input
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe the image you want..."
          className="rounded-md border px-3 py-2"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !prompt.trim()}>
          {isLoading ? "Generating..." : "Generate"}
        </Button>
      </form>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {image && (
        <div className="rounded-lg shadow-lg overflow-hidden border bg-white p-4">
          <img src={image} alt="Generated AI" className="max-w-full max-h-[500px]" />
        </div>
      )}
    </div>
  )
} 