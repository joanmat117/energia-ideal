"use client";

import { useEffect, useRef } from 'react';

interface AdsterraAdProps {
  adKey: string;
  width: number;
  height: number;
  className?:string;
  format?: 'iframe'; // Hacemos 'format' opcional, ya que casi siempre será 'iframe'
}

// 2. Usamos React.FC (Functional Component) con los tipos definidos
const AdsterraAdBanner: React.FC<AdsterraAdProps> = ({ 
  adKey, 
  width, 
  height, 
  className,
  format = 'iframe' 
}) => {
  // 3. Tipamos la referencia del ref para que sea un elemento div de HTML
  const adContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Usamos una guarda para asegurarnos de que el ref está disponible
    const container = adContainerRef.current;
    if (!container) return;

    // Evitamos volver a añadir los scripts si el contenedor ya tiene hijos
    if (container.hasChildNodes()) return;

    // El objeto de configuración del anuncio
    const atOptions = {
      'key': adKey,
      'format': format,
      'height': height,
      'width': width,
      'params': {}
    };

    // Script 1: Establece la variable global `atOptions`
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.innerHTML = `var atOptions = ${JSON.stringify(atOptions)};`;

    // Script 2: Carga el anuncio usando la configuración recién establecida
    const adScript = document.createElement('script');
    adScript.type = 'text/javascript';
    adScript.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
    adScript.async = true; // Buena práctica para no bloquear el renderizado

    // Añadimos los scripts al contenedor en el orden correcto
    container.append(configScript);
    container.append(adScript);

    // El efecto se volverá a ejecutar solo si alguna de estas propiedades cambia
  }, [adKey, width, height, format]);

  // Renderizamos el div que actuará como contenedor para el anuncio.
  // El estilo se aplica para reservar el espacio visualmente.
  return (
    <div className={'flex w-full justify-center relative m-1' + className}>
      <div 
        ref={adContainerRef} 
        style={{ 
          display: 'inline-block', // Evita colapsos de layout
          width: `${width}px`, 
          height: `${height}px`,
        }} 
      />
      </div>
  );
};

export default AdsterraAdBanner;