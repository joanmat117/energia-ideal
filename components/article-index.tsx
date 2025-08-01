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
  const [isOpen, setIsOpen] = useState(false)

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
      <div className="lg:hidden mb-6">
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="w-full justify-start">
          <List className="w-4 h-4 mr-2" />
          Índice del artículo
        </Button>
      </div>

      {/* Index Card */}
      <Card className={`mb-8 ${isOpen ? "block" : "hidden lg:block"}`}>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <List className="w-5 h-5 mr-2" />
            Índice del artículo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <nav className="space-y-2">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={`block w-full text-left p-2 rounded text-sm transition-colors ${
                  activeHeading === heading.id
                    ? "bg-indigo-100 text-indigo-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
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
