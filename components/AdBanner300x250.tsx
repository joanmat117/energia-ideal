"use client"
import Script from "next/script"

export default function AdBanner300x250(){
    return (
        <>
        <Script id="adsterra-config" strategy="afterInteractive">
          {`
            atOptions = {
              'key' : '5a7109c19094b265cfcde808d7765658',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          `}
        </Script>

        <Script
          src="//www.highperformanceformat.com/5a7109c19094b265cfcde808d7765658/invoke.js"
          strategy="afterInteractive"
        />
        </>
    )
}