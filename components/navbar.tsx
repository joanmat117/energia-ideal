"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { categories } from "@/lib/data"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-background-100 shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between flex-col md:flex-row gap-2 items-center md:items-stretch">
          <div className="flex items-center p-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">EnergyHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center p-1 w-full md:w-fit bg-slate-200 overflow-auto">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${category.id}`}
                className="text-gray-700 border-r px-3 border-inherit last:border-none whitespace-nowrap hover:text-indigo-600 font-medium transition-colors"
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
