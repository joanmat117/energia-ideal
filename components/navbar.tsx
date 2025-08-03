"use client"

import { LucideLightbulb} from 'lucide-react'
import Link from "next/link"
import { categories } from "@/lib/data"
import { nicheMetadata } from "@/data/dataNiche"

export default function Navbar() {
  return (
    <nav className="bg-background-100 shadow-sm text-foreground-50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between flex-col md:flex-row md:gap-2 items-center md:items-stretch">
          <div className="flex items-center p-3">
            <Link href="/" className="flex gap-1 items-center mx-2">
            <LucideLightbulb/>
              <span className="text-2xl font-extrabold font-merriweather  ">{nicheMetadata.web_name}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center [scrollbar-width:none] md:[scrollbar-width:2px] mx-auto pb-1 w-fit max-w-full overflow-auto">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${category.id}`}
                className=" border-r p-2 transition border-r-foreground-900/50 last:border-none whitespace-nowrap hover:bg-foreground-950/20 font-medium"
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
