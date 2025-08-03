import { supabase } from '@/services/supabase';
import { nicheCategories as categoriesData, tableDB } from "@/data/dataNiche";
import { SubcategoryIdType } from "./types";

const TABLE_ARTICLES = tableDB;

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

export interface Subcategory {
  id: string;
  name: string;
  icon:string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image:string;
  subcategories: Subcategory[];
}

// Las categorías se siguen cargando desde el JSON local, no desde Supabase
export const categories: Category[] = categoriesData.categories;

/**
 * Obtiene un artículo por su slug.
 * @param slug El slug del artículo a buscar.
 * @returns El artículo o undefined si no se encuentra.
 */
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
  return data as Article; // Aseguramos el tipo
}

/**
 * Obtiene artículos filtrados por una categoría principal (basado en IDs de subcategorías).
 * @param categoryId El ID de la categoría principal.
 * @returns Un array de artículos.
 */
export async function getArticlesByCategory(categoryId: string): Promise<Article[]> {
  // Primero, encontramos las subcategorías asociadas a esta categoría principal
  const targetCategory = categories.find(cat => cat.id === categoryId);
  if (!targetCategory) {
    console.warn(`Categoría "${categoryId}" no encontrada.`);
    return [];
  }

  const subcategoryIdsInTargetCategory = targetCategory.subcategories.map(sub => sub.id);

  const { data, error } = await supabase
    .from(TABLE_ARTICLES)
    .select('*')
    .overlaps('subcategory', subcategoryIdsInTargetCategory) // Buscar artículos cuya subcategory (array) se solape con los IDs de subcategoría de la categoría principal
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error al obtener artículos por categoría "${categoryId}":`, error);
    return [];
  }
  return data as Article[];
}

/**
 * Obtiene artículos filtrados por una subcategoría específica.
 * @param categorySlug El slug de la categoría principal (no se usa directamente en la consulta a DB, pero útil para validación/contexto).
 * @param subcategorySlug El slug de la subcategoría a buscar.
 * @returns Un array de artículos.
 */
export async function getArticlesBySubcategory(categorySlug: string, subcategorySlug: string): Promise<Article[]> {
  const { data, error } = await supabase
    .from(TABLE_ARTICLES)
    .select('*')
    .contains('subcategory', [subcategorySlug]) // Busca el subcategorySlug dentro del array 'subcategory'
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error al obtener artículos por subcategoría "${subcategorySlug}":`, error);
    return [];
  }
  return data as Article[];
}

/**
 * Obtiene artículos destacados.
 * NOTA: Tu tabla no tiene 'featured'. Asumo que si quieres 'destacados', tendrías una columna boolean 'is_featured'
 * o un mecanismo para marcarlos. Como no la tienes, esta función devuelve los 3 artículos más recientes como "destacados".
 * CONSIDERAR AÑADIR UNA COLUMNA 'is_featured' (boolean) A TU TABLA DE ARTÍCULOS EN SUPABASE.
 * @returns Un array de artículos "destacados".
 */
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
export async function getRelatedArticles(currentArticle: Article, limit = 3): Promise<Article[]> {
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
export function getCategoryBySlug(slug: string): Category | undefined {
  // Las categorías no se obtienen de Supabase, sino de 'categoriesData'
  return categories.find((category) => category.id === slug); // Usamos 'id' en lugar de 'slug' para el match
}

/**
 * Obtiene una subcategoría por su slug dentro de una categoría específica.
 * NOTA: Las subcategorías también se cargan desde el JSON local (categoriesData).
 * @param categorySlug El slug de la categoría principal.
 * @param subcategorySlug El slug de la subcategoría a buscar.
 * @returns La subcategoría o undefined si no se encuentra.
 */
export function getSubcategoryBySlug(categorySlug: string, subcategorySlug: string): Subcategory | undefined {
  const category = getCategoryBySlug(categorySlug);
  // Las subcategorías no se obtienen de Supabase
  return category?.subcategories.find((sub) => sub.id === subcategorySlug); // Usamos 'id' en lugar de 'slug' para el match
}

/**
 * Obtiene todos los slugs de artículos.
 * @returns Un array de slugs.
 */
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
  return categoriesData.categories.find(category => {
    // Asegurarse de que al menos una subcategoría coincida
    return category.subcategories.some(subcategory => subcategoryArray.includes(subcategory.id));
  });
}

export function getAllCategoryBySubcategories(subcategoryArray: string[]): string[] {
  return categoriesData.categories.flatMap(category => {
    // Si alguna de las subcategorías del artículo está presente en las subcategorías de esta categoría,
    // se devuelve el ID de la categoría principal.
    return category.subcategories.some(subcategory => subcategoryArray.includes(subcategory.id)) ?
      [category.id] :
      [];
  });
}