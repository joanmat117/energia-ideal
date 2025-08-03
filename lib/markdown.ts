import { remark } from "remark"
import html from "remark-html"
import remarkGfm from "remark-gfm"

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
  .use(remarkGfm)
  .use(html, { sanitize: false })
  .process(markdown)
  return result.toString()
}

export function extractHeadings(markdown: string): Array<{ id: string; text: string }> {
  const headings: Array<{ id: string; text: string }> = []
  const lines = markdown.split("\n")

  for (const line of lines) {
    const match = line.match(/^## (.+)$/)
    if (match) {
      const text = match[1]
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
      headings.push({ id, text })
    }
  }

  return headings
}

export function addIdsToHeadings(html: string): string {
  return html.replace(/<h2>(.*?)<\/h2>/g, (match, title) => {
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
    return `<h2 id="${id}">${title}</h2>`
  })
}
