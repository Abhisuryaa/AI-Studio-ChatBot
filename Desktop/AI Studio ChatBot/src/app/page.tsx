import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">AI Content Generator</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/chat" className="transition-colors hover:text-foreground/80">
                Chat
              </Link>
              <Link href="/blog" className="transition-colors hover:text-foreground/80">
                Blog Generator
              </Link>
              <Link href="/images" className="transition-colors hover:text-foreground/80">
                Image Generator
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Generate Amazing Content with AI
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Create high-quality blog posts, articles, and images using advanced AI technology.
              Perfect for content creators, marketers, and businesses.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/chat">Try Demo</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-4 text-center text-muted-foreground border-t mt-8">
        Made by Abhi
      </footer>
    </div>
  )
} 