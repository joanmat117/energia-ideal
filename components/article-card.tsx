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
  
  const date = new Date(article.created_at).toLocaleDateString("es-ES")
  
  return (
    <Card className={`group transition border-none overflow-hidden rounded-none sm:rounded-lg cursor-pointer`}>
      <Link href={`/articulo/${article.slug}`}>
        <div className="relative overflow-hidden">
          <Image
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            width={featured ? 800 : 400}
            height={featured ? 400 : 250}
            className="w-full aspect-[21/9] object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {featured && (
            <Badge className="absolute top-0 rounded-none rounded-br-md left-0 bg-foreground-100 text-background-100 text-sm">Destacado</Badge>
          )}
        </div>

      <CardHeader className="pb-3 m-0 p-3">
        <div className="flex items-center text-sm text-foreground-900 mb-2">
          <Clock className="w-4 h-4 mr-1" />
          <span>{date}</span>
        </div>

        <CardTitle className="line-clamp-2 text-2xl font-merriweather group-hover:text-accent-600 transition-colors">
          {article.title}
        </CardTitle>

        <CardDescription className="line-clamp-2">{article.description}</CardDescription>
      </CardHeader>
      </Link>
    </Card>
  )
}
