"use client"

import { LucideLightbulb} from 'lucide-react'
import { useState } from "react"
import Link from "next/link"
import { Menu, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { categories } from "@/lib/data"
import { nicheMetadata } from "@/data/dataNiche"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-background-100 shadow-sm text-foreground-50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between flex-col md:flex-row md:gap-2 items-center md:items-stretch">
          <div className="flex items-center p-3">
            <Link href="/" className="flex items-center mx-2">
            <LucideLightbulb/>
              <span className="text-xl font-bold ">{nicheMetadata.web_name}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center [scrollbar-width:none] md:[scrollbar-width:2px] mx-auto pb-1 w-fit max-w-full overflow-auto">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${category.id}`}
                className=" border-r p-2 transition border-r-foreground-900/50 last:border-none whitespace-nowrap hover:underline font-medium"
              >
                {category.name}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </nav>
  )
}
