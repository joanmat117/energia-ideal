export type SubcategoryRef = { id: string };

export type Category = {
  id: string;
  image?: string;
  subcategories: SubcategoryRef[];
};

export const categories: Category[] = [
  {
    id: "generadores-electricos",
    image:
      "https://images.pexels.com/photos/18816918/pexels-photo-18816918/free-photo-of-technicians-tinkering-with-a-power-generator.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    subcategories: [
      { id: "gasolina" },
      { id: "inverter" },
      { id: "solares" },
      { id: "casa" },
      { id: "camping" },
      { id: "emergencias" },
      { id: "mantenimiento" },
      { id: "errores-comunes" }
    ]
  },
  {
    id: "energia-solar",
    image: "https://i.ibb.co/zWY50hkn/web2.jpg",
    subcategories: [
      { id: "paneles-casa" },
      { id: "kits-portatiles" },
      { id: "instalacion-costos" }
    ]
  },
  {
    id: "estaciones-portatiles",
    image: "https://i.ibb.co/YFFdvvSg/web.jpg",
    subcategories: [
      { id: "ecoflow" },
      { id: "champion" },
      { id: "comparativas" },
      { id: "trucos-aprovechamiento" }
    ]
  },
  {
    id: "guias-consejos",
    image: "https://i.ibb.co/bj5xq9vb/pexels-cristian-rojas-8853502.jpg",
    subcategories: [
      { id: "que-elegir" },
      { id: "ahorro-energetico" },
      { id: "soluciones-apagones" }
    ]
  },
  {
    id: "destacados",
    image: "https://i.ibb.co/wZDQDjJM/pexels-kindelmedia-9800028.jpg",
    subcategories: [
      { id: "analisis-generadores" },
      { id: "power-banks-solares" },
      { id: "lanzamientos-productos" },
      { id: "luces-gadgets-solares" },
      { id: "tendencias-energia-limpia" }
    ]
  },
  {
    id: "marcas",
    image: "https://i.ibb.co/jZRT2d2R/ilustratin.jpg",
    subcategories: [
      { id: "ecoflow" },
      { id: "champion" },
      { id: "bluetti" },
      { id: "honda" },
      { id: "hyundai" },
      { id: "pulsar" },
      { id: "einhell" }
    ]
  }
];
