import { supabase } from '@/services/supabase';
import { categories as categoriesData, type Category, type SubcategoryRef } from "@/data/categories";
import { SubcategoryIdType } from "./types";

const TABLE_ARTICLES = 'articles';

export interface Article {
  id: number;
  created_at: string;
  title: string;
  slug: string;
  subcategory: SubcategoryIdType[]; 
  description: string;
  content: string;
  image: string;
}

export const categories: Category[] = categoriesData;

export const categoriesArray = categoriesData.map(category=>category.id)
export const subcategoriesArray = categoriesData.flatMap(category=>{
  return category.subcategories.map(subcategory=>{
    return subcategory.id
  })
})

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const { data, error } = await supabase
    .from(TABLE_ARTICLES)
    .select('*')
    .eq('slug', slug)
    .single(); // Usa .single() para esperar un solo resultado

  if (error) {
    console.error(`Error al obtener artículo por slug "${slug}":`, error);
    return undefined;
  }
  return data as Article; 
}

export async function getArticlesByCategory(
  categoryId: string,
  limit: number,
  offset: number
): Promise<Article[]> {
  const targetCategory = categories.find(cat => cat.id === categoryId);
  if (!targetCategory) {
    console.warn(`Categoría "${categoryId}" no encontrada.`);
    return [];
  }

  const subcategoryIdsInTargetCategory = targetCategory.subcategories.map(sub => sub.id);

  const { data, error } = await supabase
    .from(TABLE_ARTICLES)
    .select('*')
    .overlaps('subcategory', subcategoryIdsInTargetCategory)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error(`Error al obtener artículos por categoría "${categoryId}":`, error);
    return [];
  }
  return data as Article[];
}

export async function getArticlesBySubcategory(
  subcategorySlug: string,
  limit: number,
  offset: number
): Promise<Article[]> {
  const { data, error } = await supabase
    .from(TABLE_ARTICLES)
    .select('*')
    .contains('subcategory', [subcategorySlug])
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error(`Error al obtener artículos por subcategoría "${subcategorySlug}":`, error);
    return [];
  }
  return data as Article[];
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from(TABLE_ARTICLES)
    .select('*')
    .order('created_at', { ascending: false }) // Ordena por fecha de creación para simular "destacados" si no hay columna `is_featured`
    .limit(3); // Limita a 3 artículos, como un número típico de destacados

  if (error) {
    console.error('Error al obtener artículos destacados:', error);
    return [];
  }
  return data as Article[];
}

/**
 * Obtiene artículos relacionados con un artículo actual.
 * @param currentArticle El artículo de referencia.
 * @param limit El número máximo de artículos relacionados a devolver.
 * @returns Un array de artículos relacionados.
 * NOTA: Simulamos relación buscando artículos que compartan alguna de las subcategorías del artículo actual.
 */
export async function getRelatedArticles(currentArticle: Article, limit = 4): Promise<Article[]> {
  // Si el artículo actual no tiene subcategorías, no podemos encontrar relacionados por ese criterio
  if (!currentArticle.subcategory || currentArticle.subcategory.length === 0) {
    return [];
  }

  // Busca artículos que compartan al menos una subcategoría con el artículo actual
  // y que no sean el artículo actual.
  const { data, error } = await supabase
    .from(TABLE_ARTICLES)
    .select('*')
    .overlaps('subcategory', currentArticle.subcategory) // Busca artículos que se solapen en subcategorías
    .neq('id', currentArticle.id) // Excluye el artículo actual
    .limit(limit);

  if (error) {
    console.error('Error al obtener artículos relacionados:', error);
    return [];
  }
  return data as Article[];
}

/**
 * Obtiene una categoría por su slug.
 * NOTA: Las categorías se cargan desde el JSON local (categoriesData), no de Supabase.
 * @param slug El slug de la categoría a buscar.
 * @returns La categoría o undefined si no se encuentra.
 */
export function getCategoryBySlug(slug: string): Category{
  return categories.find((category) => category.id === slug) || categories[0]; // Usamos 'id' en lugar de 'slug' para el match
}

export function getSubcategoryBySlug(categorySlug: string, subcategorySlug: string): SubcategoryRef{
  const category = getCategoryBySlug(categorySlug);
  // Las subcategorías no se obtienen de Supabase
  return category.subcategories.find((sub) => sub.id === subcategorySlug) || category.subcategories[0]; // Usamos 'id' en lugar de 'slug' para el match
}

export async function getAllSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from(TABLE_ARTICLES)
    .select('slug'); // Solo seleccionamos la columna 'slug' para optimizar

  if (error) {
    console.error('Error al obtener todos los slugs:', error);
    return [];
  }
  return data.map((item: { slug: string }) => item.slug);
}

export async function getAllSlugsAndCreatedAt() {
  const { data, error } = await supabase
    .from(TABLE_ARTICLES)
    .select('slug, created_at'); // Ahora seleccionamos ambas columnas [1, 2]

  if (error) {
    console.error('Error al obtener slugs y created_at:', error);
    return [];
  }

  // Mapeamos los datos para asegurar que tengan el tipo correcto
  return data.map((item: { slug: string; created_at: string }) => ({
    slug: item.slug,
    created_at: item.created_at,
  }));
}

/**
 * Obtiene los artículos más recientes.
 * NOTA: Se asume que 'created_at' es la columna de fecha de publicación.
 * @param limit El número máximo de artículos a devolver.
 * @returns Un array de los artículos más recientes.
 */
export async function getLatestArticles(limit = 6): Promise<Article[]> {
  const { data, error } = await supabase
    .from(TABLE_ARTICLES)
    .select('*')
    .order('created_at', { ascending: false }) // Ordena por fecha de creación descendente
    .limit(limit);

  if (error) {
    console.error('Error al obtener los artículos más recientes:', error);
    return [];
  }
  return data as Article[];
}

// -------------------------------------
// Estas funciones NO se modifican ya que operan sobre 'categoriesData' (tu JSON local)
// y no sobre la base de datos de Supabase.

export function getCategoryBySubcategories(subcategoryArray: string[]): Category | undefined {
  return categoriesData.find(category => {
    // Asegurarse de que al menos una subcategoría coincida
    return category.subcategories.some(subcategory => subcategoryArray.includes(subcategory.id));
  });
}

export function getAllCategoryBySubcategories(subcategoryArray: string[]): string[] {
  return categoriesData.flatMap(category => {
    // Si alguna de las subcategorías del artículo está presente en las subcategorías de esta categoría,
    // se devuelve el ID de la categoría principal.
    return category.subcategories.some(subcategory => subcategoryArray.includes(subcategory.id)) ?
      [category.id] :
      [];
  });
}
