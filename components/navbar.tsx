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
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">EnergyHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${category.slug}`}
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/${category.slug}`}
                      className="text-lg font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {category.icon} {category.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
