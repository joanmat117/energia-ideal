import fs from 'fs/promises'
import path from 'path'

export default async function getTransaltion(locale:string){
    try {
        const filePath = path.join(process.cwd(),'public','locales',`${locale}.json`)
        const fileContent = await fs.readFile(filePath,'utf8')
        return JSON.parse(fileContent)
    }
    catch (error) {
        console.log(`Error loading translations for locale ${locale}: `,error)
        const defaultTranslation = JSON.parse(await fs.readFile(
            path.join(
                process.cwd(),
                'public',
                'locales',
                `es.json`
            ),
            'utf8'))
        if (!defaultTranslation) return {}
        return defaultTranslation
    }
}