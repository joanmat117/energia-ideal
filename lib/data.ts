import articlesData from "@/data/articles.json"
import { nicheCategories as categoriesData} from "@/data/dataNiche"
import { SubcategoryIdType } from "./types"

export interface Article {
  id: number
  created_at:string
  title: string
  slug: string
  subcategory: SubcategoryIdType[]
  description: string
  content: string
  image: string
}

export interface Subcategory {
  id: string
  name: string
  description: string
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  subcategories: Subcategory[]
}

export const articles: Article[] = 
export const categories: Category[] = categoriesData.categories

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}

export function getArticlesByCategory(category: string): Article[] {
  return undefined
}

export function getArticlesBySubcategory(category: string, subcategory: string): Article[] {
  return articles.filter((article) => article.category === category && article.subcategory === subcategory)
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((article) => article.featured)
}

export function getRelatedArticles(currentArticle: Article, limit = 3): Article[] {
  return articles
    .filter(
      (article) =>
        article.id !== currentArticle.id &&
        (article.category === currentArticle.category || article.tags.some((tag) => currentArticle.tags.includes(tag))),
    )
    .slice(0, limit)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug)
}

export function getSubcategoryBySlug(categorySlug: string, subcategorySlug: string): Subcategory | undefined {
  const category = getCategoryBySlug(categorySlug)
  return category?.subcategories.find((sub) => sub.slug === subcategorySlug)
}

export function getAllSlugs(): string[] {
  return articles.map((article) => article.slug)
}

export function getLatestArticles(limit = 6): Article[] {
  return articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, limit)
}

//-------------------------------------

export function getCategoryBySubcategories(subcategoryArray:string[]){
  return categoriesData.categories.find(category=>{
    category.subcategories.some(subcategory=>subcategory.id == subcategoryArray[0])
  })
}

export function getAllCategoryBySubcategories(subcategoryArray:string[]){
  return categoriesData.categories.flatMap(category=>{
    return category.subcategories.some(subcategory=>subcategoryArray.includes(subcategory.id))?
    [category.id] :
    []
  })
}
