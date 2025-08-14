// components/AdsterraAd.tsx
"use client";

import { useEffect, useRef } from 'react';

interface AdsterraAdProps {
  adKey: string;
  width: number;
  height: number;
  className?:string,
  format?: 'iframe';
}

const AdsterraAdBanner: React.FC<AdsterraAdProps> = ({ 
  adKey, 
  width, 
  height, 
  className,
  format = 'iframe' 
}) => {
  // La referencia ahora apuntará a un elemento iframe
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // 1. Preparamos la configuración y los scripts como un string de HTML
    const atOptions = {
      'key': adKey,
      'format': format,
      'height': height,
      'width': width,
      'params': {}
    };

    // 2. Creamos un documento HTML completo que se inyectará en el iframe
    const adHtml = `
      <html>
        <head>
          <style>
            /* Elimina márgenes y asegura que el contenido ocupe todo el espacio */
            body { margin: 0; padding: 0; }
          </style>
        </head>
        <body>
          <script type="text/javascript">
            var atOptions = ${JSON.stringify(atOptions)};
          <\/script>
          <script type="text/javascript" src="https://www.highperformanceformat.com/${adKey}/invoke.js"><\/script>
        </body>
      </html>
    `;

    // 3. Usamos `srcDoc` para escribir este HTML en el iframe.
    // Esto es seguro y crea un contexto de documento completamente nuevo y aislado.
    iframe.srcdoc = adHtml;
    
    // NOTA: Es importante que el efecto se ejecute solo una vez.
    // El array de dependencias vacío [] asegura esto.
    // Si las props cambian, React destruirá el componente y creará uno nuevo,
    // disparando el efecto de forma natural.
  }, []); // El array de dependencias se deja vacío intencionadamente.

  return (
    <iframe
      ref={iframeRef}
      width={width}
      height={height}
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        border: 'none', // Ocultamos el borde por defecto del iframe
        overflow: 'hidden', // Evitamos barras de scroll indeseadas
      }}
      scrolling="no"
      title={`Adsterra Ad ${adKey}`} // Buena práctica para accesibilidad
    ></iframe>
  );
};

export default AdsterraAdBanner;