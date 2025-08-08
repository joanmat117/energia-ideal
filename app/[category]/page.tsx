import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import Breadcrumbs from "@/components/breadcrumbs"
import { getCategoryBySlug, getArticlesByCategory } from "@/lib/data"
import { nicheCategoryPage, nicheMetadata, nicheSubcategoryPage } from "@/data/dataNiche"
import InfiniteScrollComponent from "@/components/InfiniteScrollComponent"
interface Props {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = getCategoryBySlug(categorySlug)

  if (!category) {
    return {
      title: nicheCategoryPage.not_subcategory,
    }
  }

  return {
    title: `${category.name} | ${nicheMetadata.web_name}`,
    description: category.description,
    openGraph: {
      title: `${category.name} | ${nicheMetadata.web_name}`,
      description: category.description,
      url: `/${category.id}`,
      images: [
        {
          url: category.image,
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | ${nicheMetadata.web_name}`,
      description: category.description,
      images: [category.image],
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug } = await params
  const category = getCategoryBySlug(categorySlug)
  const initialArticles = await getArticlesByCategory(category.id,5, 0);

  if (!category) {
    notFound()
  }

  const breadcrumbs = [{ label: category.id, href: `/${category.id}` }]

  const fetchMoreArticles = async (limit: number, offset: number) => {
    'use server'; 
    return getArticlesByCategory(category.id, limit, offset);
  };


  return (
    <div className="max-w-7xl mx-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbs} />
      </div>

      {/*===========Ad==========*/}

      <div className="mb-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl text-foreground-50 font-merriweather font-bold mb-4 flex items-center">
          {category.name}
        </h1>
        <p className="text-xl text-foreground-600 mb-8">{category.description}</p>
      </div>

      {/* Subcategories */}
      <div className="mb-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3 ">
          {category.subcategories.map((subcategory) => (
            <Card key={subcategory.id} className=" group shadow-none px-3 py-2 text-sm hover:opacity-80 cursor-pointer rounded-lg  transition border border-background-950 hover:border-accent-600 text-foreground-100">
              <Link href={`/${category.id}/${subcategory.id}`}>
              <CardHeader className="p-0">
                <CardTitle className="transition text-sm font-medium">
                  {subcategory.name}
                </CardTitle>
              </CardHeader>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Articles */}

        <div className="sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <InfiniteScrollComponent initialData={initialArticles} fetchMore={fetchMoreArticles} />
          </div>
        </div>

    </div>
  )
}
