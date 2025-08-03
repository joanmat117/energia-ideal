export type CategoryIdType = 
  "generadores-electricos" | 
  "energia-solar" | 
  "estaciones-portatiles" | 
  "guias-consejos" | 
  "destacados" | 
  "marcas";

export type SubcategoryIdType = 
  // generadores-electricos
  "gasolina" | "inverter" | "solares" | "casa" | "camping" | "emergencias" | "mantenimiento" | "errores-comunes" |
  
  // energia-solar
  "paneles-casa" | "kits-portatiles" | "instalacion-costos" |
  
  // estaciones-portatiles (contiene 'ecoflow' y 'champion' que se repiten en marcas, lo cual es correcto aquí)
  "ecoflow" | "champion" | "comparativas" | "trucos-aprovechamiento" |
  
  // guias-consejos
  "que-elegir" | "ahorro-energetico" | "soluciones-apagones" |
  
  // destacados
  "analisis-generadores" | "power-banks-solares" | "lanzamientos-productos" | "luces-gadgets-solares" | "tendencias-energia-limpia" |

  // marcas (nuevas subcategorías)
  "bluetti" | "honda" | "hyundai" | "pulsar" | "einhell";
