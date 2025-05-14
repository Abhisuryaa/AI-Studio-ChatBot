import { NextResponse } from "next/server"

const SERP_API_KEY = process.env.SERP_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=${SERP_API_KEY}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch search results')
    }

    const data = await response.json()
    
    // Transform SerpAPI results to match our interface
    const searchResults = data.organic_results?.slice(0, 3).map((result: any) => ({
      title: result.title,
      link: result.link,
      snippet: result.snippet
    })) || []

    return NextResponse.json({ items: searchResults })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch search results' },
      { status: 500 }
    )
  }
} 