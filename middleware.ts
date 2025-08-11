import createMiddleware from 'next-intl/middleware';
import i18n from './i18n'

export default createMiddleware({
  defaultLocale: 'es',
  locales: ['en', 'es']
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
