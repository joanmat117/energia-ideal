import Link from "next/link"
import Image from "next/image"
import { Clock, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Article } from "@/lib/data"

interface ArticleCardProps {
  article: Article
  featured?: boolean
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <Card className={`group hover:shadow-lg transition-shadow ${featured ? "md:col-span-2" : ""}`}>
      <Link href={`/articulo/${article.slug}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            width={featured ? 800 : 400}
            height={featured ? 400 : 250}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {article.featured && (
            <Badge className="absolute top-4 left-4 bg-indigo-500 hover:bg-indigo-600">Destacado</Badge>
          )}
        </div>
      </Link>

      <CardHeader className="pb-3">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <User className="w-4 h-4 mr-1" />
          <span>{article.author}</span>
          <span className="mx-2">•</span>
          <Clock className="w-4 h-4 mr-1" />
          <span>{article.readTime}</span>
        </div>

        <CardTitle className="line-clamp-2 group-hover:text-indigo-600 transition-colors">
          <Link href={`/articulo/${article.slug}`}>{article.title}</Link>
        </CardTitle>

        <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
      </CardHeader>
    </Card>
  )
}
