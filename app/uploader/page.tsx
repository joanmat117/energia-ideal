"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react"
import { supabase, isSupabaseConfigured } from "@/services/supabase"
import { nicheCategories } from "@/data/dataNiche"

const SUBCATEGORIES = nicheCategories.categories.flatMap(category=>{
  return category.subcategories.map(subcategory=>{
    return subcategory.id
  })
})

interface FormData {
  title: string
  description: string
  content: string
  image: string
  subcategory: string[]
}

interface FormErrors {
  title?: string
  description?: string
  content?: string
  image?: string
  subcategory?: string
}

interface ProgressStep {
  id: string
  label: string
  status: "pending" | "loading" | "success" | "error"
  details?: string
}

export default function ArticleForm() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    content: "",
    image: "",
    subcategory: [],
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [jsonData, setJsonData] = useState<any[] | null>(null)
  const [jsonText, setJsonText] = useState("")

  // Estados para el progreso de subida
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([])
  const [showProgress, setShowProgress] = useState(false)

  useEffect(() => {
    const authStatus = localStorage.getItem("articles-auth")
    if (authStatus === "authenticated") {
      setIsAuthenticated(true)
    }
  }, [])

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "yoansito15") {
      setIsAuthenticated(true)
      localStorage.setItem("articles-auth", "authenticated")
      setAuthError("")
      toast({
        title: "¡Acceso concedido! ✅",
        description: "Bienvenido al panel de administración",
      })
    } else {
      setAuthError("Contraseña incorrecta")
      toast({
        title: "Acceso denegado",
        description: "La contraseña ingresada es incorrecta",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("articles-auth")
    setPassword("")
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    })
  }

  // Función para generar slug automáticamente
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remover caracteres especiales
      .replace(/[\s_-]+/g, "-") // Reemplazar espacios y guiones bajos con guiones
      .replace(/^-+|-+$/g, "") // Remover guiones al inicio y final
  }

  // Validar URL de imagen
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Función para actualizar el progreso
  const updateProgressStep = (stepId: string, status: ProgressStep["status"], details?: string) => {
    setProgressSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, status, details } : step)))
  }

  // Función para inicializar pasos de progreso
  const initializeProgress = (isBulk = false) => {
    const steps: ProgressStep[] = [
      { id: "validate", label: "Validando datos", status: "pending" },
      { id: "upload-es", label: "Subiendo artículo(s) en español", status: "pending" },
    ]

    setProgressSteps(steps)
    setShowProgress(true)
  }

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido"
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida"
    }

    if (!formData.content.trim()) {
      newErrors.content = "El contenido es requerido"
    }

    if (!formData.image.trim()) {
      newErrors.image = "La imagen es requerida"
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = "Debe ser una URL válida"
    }

    if (formData.subcategory.length === 0) {
      newErrors.subcategory = "Debe seleccionar al menos una subcategoría"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejar cambios en subcategorías
  const handleSubcategoryChange = (subcategory: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      subcategory: checked ? [...prev.subcategory, subcategory] : prev.subcategory.filter((s) => s !== subcategory),
    }))
  }

  // Enviar formulario individual
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    initializeProgress()
    setIsLoading(true)

    try {
      // Paso 1: Validar
      updateProgressStep("validate", "loading")

      if (!validateForm()) {
        updateProgressStep("validate", "error", "Errores en el formulario")
        return
      }

      if (!isSupabaseConfigured()) {
        updateProgressStep("validate", "error", "Supabase no configurado")
        return
      }

      updateProgressStep("validate", "success")

      // Paso 2: Subir artículo en español
      updateProgressStep("upload-es", "loading")

      const slug = generateSlug(formData.title)
      const processedContent = formData.content.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
      const processedDescription = formData.description.replace(/\r\n/g, "\n").replace(/\r/g, "\n")

      const articleData = {
        title: formData.title.trim(),
        description: processedDescription.trim(),
        content: processedContent.trim(),
        image: formData.image.trim(),
        subcategory: formData.subcategory,
        slug: slug,
      }

      const { data: spanishData, error: spanishError } = await supabase.from("articles").insert([articleData]).select()

      if (spanishError) {
        throw new Error(`Error al subir artículo en español: ${spanishError.message}`)
      }

      updateProgressStep("upload-es", "success", `ID: ${spanishData[0]?.id}`)

      // Limpiar formulario
      setFormData({
        title: "",
        description: "",
        content: "",
        image: "",
        subcategory: [],
      })
      setErrors({})

      toast({
        title: "¡Artículo guardado! ✅",
        description: "El artículo se ha subido correctamente a la base de datos",
      })

      console.log("Artículo guardado:", spanishData[0])
    } catch (error: any) {
      console.error("Error completo:", error)

      if (error.message.includes("español")) {
        updateProgressStep("upload-es", "error", error.message)
      } else {
        updateProgressStep("validate", "error", error.message)
      }

      toast({
        title: "Error al guardar",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      // Ocultar progreso después de 5 segundos si todo fue exitoso
      setTimeout(() => {
        const allSuccess = progressSteps.every((step) => step.status === "success")
        if (allSuccess) {
          setShowProgress(false)
        }
      }, 5000)
    }
  }

  // Manejar entrada de JSON manual
  const handleJsonInput = (text: string) => {
    if (!text.trim()) {
      setJsonData(null)
      return
    }

    try {
      const jsonContent = JSON.parse(text)

      if (!Array.isArray(jsonContent)) {
        throw new Error("El JSON debe ser un array de artículos")
      }

      // Validar estructura básica
      const validArticles = jsonContent.filter((article) => {
        return (
          article.title &&
          article.content &&
          article.image &&
          Array.isArray(article.subcategory) &&
          article.subcategory.length > 0
        )
      })

      if (validArticles.length === 0) {
        throw new Error("No se encontraron artículos válidos en el JSON")
      }

      if (validArticles.length !== jsonContent.length) {
        toast({
          title: "⚠️ Artículos filtrados",
          description: `Se encontraron ${validArticles.length} artículos válidos de ${jsonContent.length} total.\nLos artículos inválidos fueron omitidos.`,
          variant: "destructive",
          duration: 5000,
        })
      } else {
        toast({
          title: "✅ JSON válido detectado",
          description: `${validArticles.length} artículos listos para subir`,
          duration: 3000,
        })
      }

      setJsonData(validArticles)
    } catch (error: any) {
      setJsonData(null)
      // No mostrar toast para errores de sintaxis mientras el usuario está escribiendo
      if (text.trim().length > 10) {
        console.log("Error de JSON:", error.message)
      }
    }
  }

  // Validar artículo individual del JSON
  const validateJsonArticle = (article: any, index: number): string[] => {
    const errors: string[] = []

    if (!article.title?.trim()) {
      errors.push(`Artículo ${index + 1}: Falta el título`)
    }

    if (!article.content?.trim()) {
      errors.push(`Artículo ${index + 1}: Falta el contenido`)
    }

    if (!article.image?.trim()) {
      errors.push(`Artículo ${index + 1}: Falta la imagen`)
    } else if (!isValidUrl(article.image)) {
      errors.push(`Artículo ${index + 1}: URL de imagen inválida`)
    }

    if (!Array.isArray(article.subcategory) || article.subcategory.length === 0) {
      errors.push(`Artículo ${index + 1}: Debe tener al menos una subcategoría`)
    } else {
      const invalidSubcategories = article.subcategory.filter((sub: string) => !SUBCATEGORIES.includes(sub))
      if (invalidSubcategories.length > 0) {
        errors.push(`Artículo ${index + 1}: Subcategorías inválidas: ${invalidSubcategories.join(", ")}`)
      }
    }

    return errors
  }

  // Subida masiva de artículos
  const handleBulkUpload = async () => {
    if (!jsonData || jsonData.length === 0) {
      toast({
        title: "No hay datos",
        description: "Por favor carga un archivo JSON primero",
        variant: "destructive",
      })
      return
    }

    initializeProgress(true)
    setIsLoading(true)

    try {
      // Paso 1: Validar
      updateProgressStep("validate", "loading")

      if (!isSupabaseConfigured()) {
        updateProgressStep("validate", "error", "Supabase no configurado")
        return
      }

      // Validar todos los artículos
      const allErrors: string[] = []
      jsonData.forEach((article, index) => {
        const errors = validateJsonArticle(article, index)
        allErrors.push(...errors)
      })

      if (allErrors.length > 0) {
        updateProgressStep("validate", "error", `${allErrors.length} errores encontrados`)
        console.error("Errores de validación:", allErrors)
        toast({
          title: "Errores de validación",
          description: `Se encontraron ${allErrors.length} errores. Revisa la consola para más detalles.`,
          variant: "destructive",
        })
        return
      }

      updateProgressStep("validate", "success")

      // Paso 2: Subir artículos en español
      updateProgressStep("upload-es", "loading")

      const articlesToInsert = jsonData.map((article) => {
        const slug = article.slug || generateSlug(article.title)
        const processedContent = article.content.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
        const processedDescription = article.description
          ? article.description.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
          : article.title

        return {
          title: article.title.trim(),
          description: processedDescription.trim(),
          content: processedContent.trim(),
          image: article.image.trim(),
          subcategory: article.subcategory,
          slug: slug,
        }
      })

      const { data: spanishData, error: spanishError } = await supabase
        .from("articles")
        .insert(articlesToInsert)
        .select()

      if (spanishError) {
        throw new Error(`Error al subir artículos en español: ${spanishError.message}`)
      }

      updateProgressStep("upload-es", "success", `${spanishData?.length} artículos`)

      // Limpiar datos
      setJsonData(null)
      setJsonText("")

      toast({
        title: "¡Artículos guardados! ✅",
        description: `Se han subido ${spanishData?.length} artículos a la base de datos`,
      })

      console.log(`✅ Proceso completado:`, {
        spanish: spanishData?.length,
      })
    } catch (error: any) {
      console.error("Error en carga masiva:", error)

      if (error.message.includes("español")) {
        updateProgressStep("upload-es", "error", error.message)
      } else {
        updateProgressStep("validate", "error", error.message)
      }

      toast({
        title: "Error en carga masiva",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      // Ocultar progreso después de 10 segundos si todo fue exitoso
      setTimeout(() => {
        const allSuccess = progressSteps.every((step) => step.status === "success")
        if (allSuccess) {
          setShowProgress(false)
        }
      }, 10000)
    }
  }

  // Componente de progreso
  const ProgressIndicator = () => {
    if (!showProgress) return null

    return (
      <div className="fixed top-4 right-4 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Progreso de subida</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowProgress(false)} className="h-6 w-6 p-0">
            ×
          </Button>
        </div>

        <div className="space-y-3">
          {progressSteps.map((step) => (
            <div key={step.id} className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {step.status === "pending" && <Clock className="h-4 w-4 text-gray-400" />}
                {step.status === "loading" && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
                {step.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                {step.status === "error" && <XCircle className="h-4 w-4 text-red-500" />}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    step.status === "success"
                      ? "text-green-700"
                      : step.status === "error"
                        ? "text-red-700"
                        : step.status === "loading"
                          ? "text-blue-700"
                          : "text-gray-500"
                  }`}
                >
                  {step.label}
                </p>
                {step.details && <p className="text-xs text-gray-500 truncate">{step.details}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">🔐 Acceso Restringido</CardTitle>
            <CardDescription>Ingresa la contraseña para acceder al panel de administración</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa la contraseña"
                  className={authError ? "border-red-500" : ""}
                  autoFocus
                />
                {authError && <p className="text-sm text-red-500">{authError}</p>}
              </div>
              <Button type="submit" className="w-full">
                Ingresar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ProgressIndicator />

      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold">Crear Nuevo Artículo</CardTitle>
                <CardDescription>
                  Los artículos se subirán a la base de datos en español
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 bg-transparent"
              >
                Cerrar Sesión
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Ingresa el título del artículo"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                {formData.title && <p className="text-sm text-gray-500">Slug: {generateSlug(formData.title)}</p>}
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Ingresa una descripción del artículo&#10;Puedes usar múltiples líneas"
                  className={errors.description ? "border-red-500" : ""}
                  rows={3}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              {/* Imagen */}
              <div className="space-y-2">
                <Label htmlFor="image">URL de la Imagen *</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className={errors.image ? "border-red-500" : ""}
                />
                {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
              </div>

              {/* Subcategorías */}
              <div className="space-y-3">
                <Label>Subcategorías * (selecciona al menos una)</Label>
                <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded-md p-4">
                  {SUBCATEGORIES.map((subcategory) => (
                    <div key={subcategory} className="flex items-center space-x-2">
                      <Checkbox
                        id={subcategory}
                        checked={formData.subcategory.includes(subcategory)}
                        onCheckedChange={(checked) => handleSubcategoryChange(subcategory, checked as boolean)}
                      />
                      <Label htmlFor={subcategory} className="text-sm font-normal cursor-pointer">
                        {subcategory}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.subcategory && <p className="text-sm text-red-500">{errors.subcategory}</p>}
                {formData.subcategory.length > 0 && (
                  <p className="text-sm text-gray-500">Seleccionadas: {formData.subcategory.join(", ")}</p>
                )}
              </div>

              {/* Contenido */}
              <div className="space-y-2">
                <Label htmlFor="content">Contenido *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Escribe el contenido completo del artículo&#10;&#10;Los saltos de línea se preservarán automáticamente"
                  className={errors.content ? "border-red-500" : ""}
                  rows={8}
                />
                {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
                <p className="text-xs text-gray-500">
                  💡 Tip: Los saltos de línea se guardarán correctamente en la base de datos
                </p>
              </div>

              {/* Botón de envío */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  "Guardar Artículo"
                )}
              </Button>

              {/* Separador */}
              <div className="flex items-center my-8">
                <div className="flex-1 border-t border-gray-300"></div>
                <div className="px-4 text-sm text-gray-500 bg-gray-50">O</div>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Sección de carga masiva por JSON */}
              <div className="space-y-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">📝 Carga Masiva por JSON</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Escribe o pega el JSON con múltiples artículos para subirlos en español
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="jsonInput">JSON de Artículos</Label>
                  <Textarea
                    id="jsonInput"
                    value={jsonText}
                    onChange={(e) => {
                      setJsonText(e.target.value)
                      handleJsonInput(e.target.value)
                    }}
                    placeholder={`Pega aquí tu JSON con la estructura:
[
  {
    "title": "Título del artículo",
    "description": "Descripción del artículo",
    "slug": "titulo-del-articulo",
    "subcategory": ["gasolina", "emergencias"],
    "content": "Contenido completo...",
    "image": "https://ejemplo.com/imagen.jpg"
  },
  {
    "title": "Otro artículo",
    "subcategory": ["solares", "casa"],
    "content": "Más contenido...",
    "image": "https://ejemplo.com/imagen2.jpg"
  }
]`}
                    className="min-h-[200px] font-mono text-sm"
                    rows={10}
                  />

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>
                      <strong>Campos requeridos:</strong> title, content, image, subcategory
                    </p>
                    <p>
                      <strong>Campos opcionales:</strong> description, slug
                    </p>
                    <p>
                      💡 <strong>Tip:</strong> El slug se genera automáticamente si no lo incluyes
                    </p>
                  </div>

                  <Button
                    onClick={handleBulkUpload}
                    disabled={!jsonData || isLoading}
                    className="w-full"
                    variant="secondary"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando {jsonData?.length || 0} artículos...
                      </>
                    ) : (
                      `Subir ${jsonData?.length || 0} artículos`
                    )}
                  </Button>

                  {jsonData && jsonData.length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-md">
                      <p className="text-sm text-blue-800">
                        ✅ JSON válido: <strong>{jsonData.length} artículos</strong> listos para subir
                      </p>
                      <div className="mt-2 max-h-32 overflow-y-auto">
                        <ul className="text-xs text-blue-700 space-y-1">
                          {jsonData.slice(0, 5).map((article, index) => (
                            <li key={index}>• {article.title}</li>
                          ))}
                          {jsonData.length > 5 && <li className="text-blue-600">... y {jsonData.length - 5} más</li>}
                        </ul>
                      </div>
                    </div>
                  )}

                  {jsonText && !jsonData && (
                    <div className="mt-3 p-3 bg-red-50 rounded-md">
                      <p className="text-sm text-red-800">❌ JSON inválido o estructura incorrecta</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Estado de conexión */}
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Estado de la base de datos:</span>
                  <span className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${isSupabaseConfigured() ? "bg-green-500" : "bg-yellow-500"}`}
                    ></div>
                    {isSupabaseConfigured() ? "Conectado a Supabase" : "Configuración pendiente"}
                  </span>
                </div>
                {!isSupabaseConfigured() && (
                  <p className="text-xs text-yellow-600 mt-1">
                    ⚠️ Configura las variables de entorno NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}