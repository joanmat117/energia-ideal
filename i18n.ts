// i18n.ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export default getRequestConfig(async ({ locale }) => {
  // Proporcionar un valor predeterminado para locale si es undefined
  const currentLocale = locale ?? 'es'; // 'es' es el valor predeterminado

  let messages;
  try {
    messages = (await import(`@/messages/${currentLocale}.json`)).default;
  } catch (e) {
    notFound();
  }

  return {
    locale: currentLocale,
    messages
  };
});
