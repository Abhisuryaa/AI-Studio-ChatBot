"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from '@supabase/supabase-js'
import { Search } from "lucide-react"
import { v4 as uuidv4 } from 'uuid'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Message {
  id?: string
  role: "user" | "assistant"
  content: string
  created_at?: string
  session_id: string
}

interface SearchResult {
  title: string
  link: string
  snippet: string
}

interface ChatSession {
  id: string
  created_at?: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [sessionId, setSessionId] = useState<string>(() => uuidv4())
  const { toast } = useToast()
  const [btcPrice, setBtcPrice] = useState<string | null>(null)

  // Load messages for the current session from Supabase
  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
      if (error) {
        toast({ title: "Error", description: "Failed to load chat history", variant: "destructive" })
        return
      }
      if (data) setMessages(data)
    }
    loadMessages()
  }, [sessionId])

  // Extract BTC price from search results
  const extractBTCPrice = (results: SearchResult[]) => {
    for (const result of results) {
      const match = result.snippet.match(/\$([0-9,.]+)/)
      if (match) return match[0]
    }
    return null
  }

  const handleSearch = async (query: string) => {
    setIsSearching(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error('Search failed')
      const data = await response.json()
      setSearchResults(data.items?.slice(0, 3) || [])
      // If BTC price, extract and set
      if (/btc|bitcoin|price/i.test(query)) {
        const price = extractBTCPrice(data.items || [])
        setBtcPrice(price)
      } else {
        setBtcPrice(null)
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch search results", variant: "destructive" })
    } finally {
      setIsSearching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    const userMessage: Message = { role: "user", content: input, session_id: sessionId }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)
    try {
      // Save user message to Supabase
      const { error: userError } = await supabase
        .from('chat_messages')
        .insert([{ ...userMessage, session_id: sessionId }])
      if (userError) throw userError
      // Perform search before getting AI response
      await handleSearch(input)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, searchResults: searchResults, btcPrice }),
      })
      if (!response.ok) throw new Error("Failed to get response")
      const data = await response.json()
      const assistantMessage: Message = { role: "assistant", content: data.message, session_id: sessionId }
      // Save assistant message to Supabase
      const { error: assistantError } = await supabase
        .from('chat_messages')
        .insert([{ ...assistantMessage, session_id: sessionId }])
      if (assistantError) throw assistantError
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      toast({ title: "Error", description: "Failed to get response from AI. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = () => {
    setSessionId(uuidv4())
    setMessages([])
    setSearchResults([])
    setBtcPrice(null)
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex justify-end p-2">
        <Button variant="outline" onClick={handleNewChat}>New Chat</Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((message, i) => (
            <div key={i} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}> <div className={`rounded-lg px-4 py-2 max-w-[80%] ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{message.content}</div></div>))}
          {isLoading && (<div className="flex justify-start"><div className="rounded-lg bg-muted px-4 py-2">Thinking...</div></div>)}
          {btcPrice && (<div className="mt-4 text-green-700 font-bold">BTC Price: {btcPrice}</div>)}
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-semibold">Search Results:</h3>
              {searchResults.map((result, i) => (
                <div key={i} className="rounded-lg border p-3">
                  <a href={result.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline">{result.title}</a>
                  <p className="mt-1 text-sm text-gray-600">{result.snippet}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="flex gap-4">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="flex-1 rounded-md border bg-background px-3 py-2" disabled={isLoading || isSearching} />
            <Button type="submit" disabled={isLoading || isSearching}>{isSearching ? <Search className="h-4 w-4 animate-spin" /> : "Send"}</Button>
          </div>
        </form>
      </div>
    </div>
  )
} 