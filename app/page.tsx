import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ArticleCard from "@/components/article-card"
import { getFeaturedArticles, getLatestArticles, categories } from "@/lib/data"
import { nicheHomeText } from "@/data/dataNiche"

export default function HomePage() {
  const featuredArticles = getFeaturedArticles()
  const latestArticles = getLatestArticles()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {nicheHomeText.title_hero}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {nicheHomeText.description_hero}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white hover:bg-gray-100 text-indigo-600">
                {nicheHomeText.cta_1}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-indigo-600 bg-transparent"
              >
                {nicheHomeText.cta_2}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{nicheHomeText.category_section}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Card key={category.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <CardTitle className="group-hover:text-indigo-600 transition-colors">
                    <Link href={`/${category.id}`}>{category.name}</Link>
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.subcategories.slice(0, 3).map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/${category.id}/${sub.id}`}
                        className="block text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                      >
                        • {sub.name}
                      </Link>
                    ))}
                    {category.subcategories.length > 3 && (
                      <Link
                        href={`/${category.id}`}
                        className="block text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        {nicheHomeText.watch_more}
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{nicheHomeText.featured_articles_section}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{nicheHomeText.last_articles_section}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              {nicheHomeText.btn_all_articles}
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{nicheHomeText.cta_section}</h2>
          <p className="text-xl mb-8">
            {nicheHomeText.cta_section_description}
          </p>
          <Button size="lg" className="bg-white hover:bg-gray-100 text-indigo-600">
            {nicheHomeText.watch_guides}
          </Button>
        </div>
      </section>
    </div>
  )
}
