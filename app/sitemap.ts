
// import { nicheCategories, nicheMetadata } from '@/data/dataNiche';
import { categories } from '@/data/categories'
import { categoriesArray, getAllSlugsAndCreatedAt} from '@/lib/data'

const baseUrl = 'https://energiaideal.vercel.app';

export const revalidate = 3600; 

function getSubcategorySitemapEntries() {
  const subcategoryEntries:{url:any,lastModified:any,changeFrequency:string,priority:number}[] = [];

  categories.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      const url = `${baseUrl}/${category.id}/${subcategory.id}`;
      subcategoryEntries.push({
        url: url,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  });

  return subcategoryEntries;
}

export default async function sitemap() {
  const articlesData = await getAllSlugsAndCreatedAt();

  const articleEntries = articlesData.map((article:any) => ({
    url: `${baseUrl}/article/${article.slug}`, 
    lastModified: new Date(article.created_at).toISOString(), 
    changeFrequency: 'daily',
    priority: 0.8,
  }));  
  const categoriesEntries = categoriesArray.map((category) => ({
    url: `${baseUrl}/${category}`, 
    lastModified: new Date().toISOString(), 
    changeFrequency: 'daily',
    priority: 0.8,
  }));

    const subcategoriesEntries = getSubcategorySitemapEntries()

  const staticPages = [
    {
      url: `${baseUrl}/`, 
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1, 
    }
  ];

  // Retorna un array que Next.js convertirá en el XML del sitemap.
  return [...staticPages, ...articleEntries, ...categoriesEntries,...subcategoriesEntries];
}