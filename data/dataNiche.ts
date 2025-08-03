export const tableDB = "articles"

export const nicheCategories = {
    "categories": [
    {
      "id": "generadores-electricos",
      "name": "Generadores Eléctricos",
      "description": "Todo sobre generadores eléctricos para hogar, camping y emergencias",
      "image":"https://images.pexels.com/photos/18816918/pexels-photo-18816918/free-photo-of-technicians-tinkering-with-a-power-generator.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "subcategories": [
        {
          "id": "gasolina",
          "name": "De gasolina",
          "icon": "⛽", // &#x26FD;
          "description": "Generadores de gasolina para uso doméstico y comercial"
        },
        {
          "id": "inverter",
          "name": "Inverter",
          "icon": "⚡", // &#x26A1;
          "description": "Generadores inverter con tecnología avanzada"
        },
        {
          "id": "solares",
          "name": "Solares",
          "icon": "☀️", // &#x2600;
          "description": "Generadores solares y energía renovable"
        },
        {
          "id": "casa",
          "name": "Para casa",
          "icon": "🏠", // &#x1F3E0;
          "description": "Generadores ideales para uso residencial"
        },
        {
          "id": "camping",
          "name": "Camping",
          "icon": "⛺", // &#x26FA;
          "description": "Generadores portátiles para actividades al aire libre"
        },
        {
          "id": "emergencias",
          "name": "Emergencias",
          "icon": "⚠️", // &#x26A0;
          "description": "Generadores de respaldo para situaciones críticas"
        },
        {
          "id": "mantenimiento",
          "name": "Mantenimiento",
          "icon": "🔧", // &#x1F527;
          "description": "Cuidado y mantenimiento de generadores"
        },
        {
          "id": "errores-comunes",
          "name": "Errores comunes",
          "icon": "🐛", // &#x1F41B;
          "description": "Problemas frecuentes y soluciones"
        }
      ]
    },
    {
      "id": "energia-solar",
      "name": "Energía Solar",
      "description": "Paneles solares, kits e instalaciones para aprovechar la energía del sol",
      "image": "https://i.ibb.co/zWY50hkn/web2.jpg",
      "subcategories": [
        {
          "id": "paneles-casa",
          "name": "Paneles solares para casa",
          "icon": "🪟", // &#x1FA9F;
          "description": "Paneles solares residenciales y instalación"
        },
        {
          "id": "kits-portatiles",
          "name": "Kits portátiles",
          "icon": "🧳", // &#x1F9F3;
          "description": "Kits solares portátiles para camping y viajes"
        },
        {
          "id": "instalacion-costos",
          "name": "Instalación y costos",
          "icon": "🧮", // &#x1F5EE;
          "description": "Guía de instalación y análisis de costos"
        }
      ]
    },
    {
      "id": "estaciones-portatiles",
      "name": "Estaciones Portátiles",
      "description": "Estaciones de energía portátil para alimentar tus dispositivos",
      "image": "https://i.ibb.co/YFFdvvSg/web.jpg",
      "subcategories": [
        {
          "id": "ecoflow",
          "name": "EcoFlow",
          "icon": "⚡", // &#x26A1;
          "description": "Estaciones de energía EcoFlow"
        },
        {
          "id": "champion",
          "name": "Champion",
          "icon": "👑", // &#x1F451;
          "description": "Estaciones de energía Champion"
        },
        {
          "id": "comparativas",
          "name": "Comparativas",
          "icon": "⚖️", // &#x2696;
          "description": "Comparación entre diferentes marcas y modelos"
        },
        {
          "id": "trucos-aprovechamiento",
          "name": "Trucos para aprovecharlos",
          "icon": "✨", // &#x2728;
          "description": "Consejos para maximizar el uso de tu estación"
        }
      ]
    },
    {
      "id": "guias-consejos",
      "name": "Guías",
      "description": "Guías completas y consejos expertos sobre energía",
      "image": "https://i.ibb.co/bj5xq9vb/pexels-cristian-rojas-8853502.jpg",
      "subcategories": [
        {
          "id": "que-elegir",
          "name": "Qué elegir",
          "icon": "🔍", // &#x1F50D;
          "description": "Guías para elegir el equipo adecuado"
        },
        {
          "id": "ahorro-energetico",
          "name": "Ahorro energético",
          "icon": "🍃", // &#x1F343;
          "description": "Consejos para reducir el consumo energético"
        },
        {
          "id": "soluciones-apagones",
          "name": "Soluciones para apagones",
          "icon": "💡", // &#x1F4A1;
          "description": "Preparación y soluciones para cortes de luz"
        }
      ]
    },
    {
      "id": "destacados",
      "name": "Destacados",
      "description": "Análisis, reviews y las últimas tendencias en energía",
      "image": "https://i.ibb.co/wZDQDjJM/pexels-kindelmedia-9800028.jpg",
      "subcategories": [
        {
          "id": "analisis-generadores",
          "name": "Análisis de generadores",
          "icon": "📈", // &#x1F4C8;
          "description": "Reviews detallados de generadores"
        },
        {
          "id": "power-banks-solares",
          "name": "Power banks solares",
          "icon": "🔋", // &#x1F50B;
          "description": "Análisis de power banks con energía solar"
        },
        {
          "id": "lanzamientos-productos",
          "name": "Lanzamientos de productos",
          "icon": "🚀", // &#x1F680;
          "description": "Nuevos productos y lanzamientos"
        },
        {
          "id": "luces-gadgets-solares",
          "name": "Luces y gadgets solares",
          "icon": "💡", // &#x1F4A1;
          "description": "Iluminación y gadgets con energía solar"
        },
        {
          "id": "tendencias-energia-limpia",
          "name": "Tendencias en energía limpia",
          "icon": "🌎", // &#x1F30E;
          "description": "Últimas tendencias en energía renovable"
        }
      ]
    }
  ]
}

export const nicheSubcategoryPage = {
  not_articles:"No hay artículos disponibles en esta subcategoría aún.",
  not_page:"Página no encontrada",
  not_article:"Articulo no encontrado"
}
export const nicheCategoryPage = {
  subcategory:"Subcategorías",
  not_subcategory:"Categoría no encontrada"
}

export const nicheMetadata = {
    title:"Energía Ideal - Generadores, Energía Solar y Estaciones Portátiles",
    description:"Tu guía completa sobre generadores eléctricos, paneles solares, estaciones de energía portátil y todo sobre energía renovable.",
    web_name:"Energía Ideal",
    base_url:"https://energiaideal.vercel.app",
    meta_image:"/placeholder.svg?height=630&width=1200&text=EnergyHub"
}

export const nicheHeaderAndFooter = {

}

export const nicheHomeText = {
    title_hero:"Tu Guía Completa de Energía",
    description_hero:"Descubre todo sobre generadores eléctricos, paneles solares, estaciones portátiles y energía renovable",
    cta_text:"Explorar Guías",
    cta_link:nicheCategories.categories[3].id,
    category_section:"Categorías",
    watch_more:"Ver más...",
    featured_articles_section:"Relevantes",
    last_articles_section:"Últimos Artículos",
    btn_all_articles:"Ver Todos los Artículos",
    cta_section:"¿Necesitas ayuda eligiendo?",
    cta_section_description:"Nuestras guías te ayudarán a encontrar la solución energética perfecta para tus necesidades",
    watch_guides:"Ver Guías de Compra"
}

export const nicheArticleText = {
    recommended:"Artículos Relacionados",
}