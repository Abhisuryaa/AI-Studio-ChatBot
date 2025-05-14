import { NextResponse } from "next/server"

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "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"

export async function POST(req: Request) {
  try {
    const { messages, searchResults } = await req.json()
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      )
    }

    // Add a system prompt at the start for context
    const systemPrompt = { 
      role: "system", 
      content: `You are a helpful AI assistant. Keep your answers as short and minimal as possible.
      ${searchResults?.length ? `Here are some relevant search results to help with your response:
      ${searchResults.map((r: any) => `- ${r.title}: ${r.snippet}`).join('\n')}` : ''}`
    }
    const fullMessages = [systemPrompt, ...messages]

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: fullMessages,
        max_tokens: 60,
        temperature: 0.2
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to get response")
    }

    const data = await response.json()
    const assistantResponse = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response."

    return NextResponse.json({
      message: assistantResponse,
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      { error: "Failed to get response from AI" },
      { status: 500 }
    )
  }
} 