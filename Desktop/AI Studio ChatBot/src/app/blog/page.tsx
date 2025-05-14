"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface BlogSection {
  title: string
  content: string
}

export default function BlogPage() {
  const [title, setTitle] = useState("")
  const [keywords, setKeywords] = useState("")
  const [tone, setTone] = useState("professional")
  const [length, setLength] = useState("medium")
  const [style, setStyle] = useState("informative")
  const [outline, setOutline] = useState("")
  const [sections, setSections] = useState<BlogSection[]>([])
  const [rawContent, setRawContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [unstructured, setUnstructured] = useState(false)
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!title.trim() || !keywords.trim()) {
      toast({
        title: "Error",
        description: "Please provide a title and keywords",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setUnstructured(false)
    setRawContent(null)

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          keywords,
          tone,
          length,
          style,
          outline,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate blog")

      const data = await response.json()
      if (Array.isArray(data.sections)) {
        setSections(data.sections)
        // If only one section and its title is the same as the blog title, treat as unstructured
        if (data.sections.length === 1 && data.sections[0].title === title) {
          setUnstructured(true)
          setRawContent(data.sections[0].content)
        } else {
          setUnstructured(false)
          setRawContent(null)
        }
      } else {
        setSections([])
        setUnstructured(true)
        setRawContent(data.sections)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate blog. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Blog Generator</h1>
          <p className="text-muted-foreground">
            Generate SEO-optimized blog posts with AI
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2"
              placeholder="Enter blog title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Keywords</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2"
              placeholder="Enter keywords (comma-separated)..."
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="technical">Technical</option>
                <option value="friendly">Friendly</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Length</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2"
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2"
              >
                <option value="informative">Informative</option>
                <option value="persuasive">Persuasive</option>
                <option value="storytelling">Storytelling</option>
                <option value="conversational">Conversational</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Outline (optional)</label>
            <textarea
              value={outline}
              onChange={(e) => setOutline(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2"
              placeholder="Enter custom outline or section headers, one per line..."
              rows={3}
            />
          </div>

          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Blog"}
          </Button>
        </div>

        {unstructured && rawContent && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
            <p className="font-semibold mb-2">Note:</p>
            <p>The AI did not return a structured blog. Here is the raw output:</p>
            {typeof rawContent === "string" ? (
              <pre className="whitespace-pre-wrap mt-2">{rawContent}</pre>
            ) : typeof rawContent === "object" && rawContent !== null ? (
              <div className="mt-2 space-y-4">
                {Object.entries(rawContent).map(([sectionTitle, sectionContent], idx) => (
                  <div key={idx}>
                    <h2 className="text-xl font-semibold">{sectionTitle}</h2>
                    <p className="text-muted-foreground whitespace-pre-wrap">{sectionContent as string}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}

        {!unstructured && sections.length > 0 && (
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className="space-y-2">
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 