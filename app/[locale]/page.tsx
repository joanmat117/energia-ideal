import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ArticleCard from "@/components/article-card";
import { getLatestArticles, categories } from "@/lib/data";
import { getTranslations } from "next-intl/server";

interface HomePageProps {
  params: { locale: string };
}

export default async function HomePage({ params }: HomePageProps) {
  const t = await getTranslations(params.locale);

  const latestArticles = await getLatestArticles(8);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-foreground-50 to-foreground-100 text-background-50 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center flex flex-col gap-2 py-2">
            <h1 className="text-xl font-bold">
              {t("HomeText.title_hero")}
            </h1>
            <div className="flex gap-4 justify-center items-center">
              <p className="text-sm max-w-3xl text-background-500 mx-auto">
                {t("HomeText.description_hero")}
              </p>
              <Link
                className="px-5 py-3 border text-sm font-semibold transition border-accent-600 p-0 rounded-xl text-background-300 hover:bg-accent-600 hover:text-white bg-transparent"
                href={t("HomeText.cta_link")}
              >
                {t("HomeText.cta_text")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-6">
          <h2 className="text-3xl font-bold text-center mb-8">{t("HomeText.category_section")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="group rounded-none md:rounded-md overflow-hidden border-none md:border border-foreground-800/60 transition shadow ">
                <Link href={`/${category.id}`} className="hover:opacity-80 hover:contrast-125 transition">
                  <CardHeader className="text-center p-0">
                    <img src={category.image} className="aspect-[21/9] object-cover" alt={t(`categories.${category.id}.name`)} />
                    <CardTitle className={"group-hover:text-accent-600 text-start transition-colors text-2xl mx-3 p-0 font-merriweather"}>
                      {t(`categories.${category.id}.name`)}
                    </CardTitle>
                    <CardDescription className="p-0 mx-3 text-start">{t(`categories.${category.id}.description`)}</CardDescription>
                  </CardHeader>
                </Link>
                <CardContent className="p-0 mx-2 my-2 mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {category.subcategories.slice(0, 3).map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/${category.id}/${sub.id}`}
                        className="block text-sm border py-1 hover:bg-transparent rounded-full px-4 hover:text-foreground-800 text-background-400 bg-foreground-100 transition-colors m-0"
                      >
                        {t(`categories.${category.id}.subcategories.${sub.id}.name`)}
                      </Link>
                    ))}
                    {category.subcategories.length > 3 && (
                      <Link
                        href={`/${category.id}`}
                        className="block text-sm text-foreground-500 hover:text-foreground-100 font-medium"
                      >
                        {t("HomeText.watch_more")}
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto lg:px-8 ">
          <h2 className="text-3xl font-bold text-center mb-8">{t("HomeText.last_articles_section")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
