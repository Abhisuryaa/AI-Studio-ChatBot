import { NextResponse } from "next/server"

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "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"

export async function POST(req: Request) {
  try {
    const { title, keywords, tone, length, style, outline } = await req.json()

    if (!title || !keywords) {
      return NextResponse.json(
        { error: "Title and keywords are required" },
        { status: 400 }
      )
    }

    let prompt = `Generate an SEO-optimized blog post with the following details:\n`
    prompt += `Title: ${title}\n`
    prompt += `Keywords: ${keywords}\n`
    prompt += `Tone: ${tone}\n`
    prompt += `Length: ${length}\n`
    prompt += `Style: ${style}\n`
    if (outline && outline.trim()) {
      prompt += `Use this outline (section headers, one per line):\n${outline}\n`
    } else {
      prompt += `Please structure the blog post with the following sections:\n1. Introduction\n2. Main Points (3-4 sections)\n3. Conclusion\n`
    }
    prompt += `Each section should be well-structured, engaging, and optimized for the given keywords. Format the response as a JSON array of sections, where each section has a title and content.`

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You are a helpful AI assistant that generates SEO-optimized blog posts as requested." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1024,
        temperature: 0.7
      }),
    })

    if (!response.ok) throw new Error("Failed to get response")

    const data = await response.json()
    console.log(data)
    const content = data.choices?.[0]?.message?.content || ""
    // Try to parse the JSON array of sections from the response
    let sections = []
    try {
      sections = JSON.parse(content)
    } catch {
      // fallback: put the whole content in one section
      sections = [{ title: title, content }]
    }

    return NextResponse.json({ sections })
  } catch (error) {
    console.error("Error generating blog:", error)
    return NextResponse.json(
      { error: "Failed to generate blog" },
      { status: 500 }
    )
  }
} 