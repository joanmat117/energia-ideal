"use client"

import { useState, useEffect } from "react"
import { List } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Heading {
  id: string
  text: string
}

interface ArticleIndexProps {
  headings: Heading[]
}

export default function ArticleIndex({ headings }: ArticleIndexProps) {
  const [activeHeading, setActiveHeading] = useState<string>("")
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id)
          }
        })
      },
      { rootMargin: "-100px 0px -80% 0px" },
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [headings])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsOpen(false)
  }

  if (headings.length === 0) return null

  return (
    <>
      {/* Mobile Toggle */}
      <div className="hidden mb-6">
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="w-full justify-start">
          <List className="w-4 h-4 mr-2" />
          Índice del artículo
        </Button>
      </div>

      {/* Index Card */}
      <Card className={`mb-8 border-background-950 bg-transparent shadow-none max-w-lg ${isOpen ? "block" : "hidden lg:block"}`}>
        <CardHeader className="p-2">
          <CardTitle className="flex items-center text-lg">
            <List className="w-5 h-5 mx-auto" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <nav className="">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={`block w-full text-left p-1 rounded text-xs transition-colors ${
                  activeHeading === heading.id
                    ? "bg-transparent text-accent-700 font-medium"
                    : "text-foreground-900 hover:bg-gray-100"
                }`}
              >
                {heading.text}
              </button>
            ))}
          </nav>
        </CardContent>
      </Card>
    </>
  )
}
