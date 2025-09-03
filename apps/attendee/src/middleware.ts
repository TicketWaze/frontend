import createMiddleware from 'next-intl/middleware';
import type {NextFetchEvent } from 'next/server';
import { getLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { auth } from '@/lib/auth';

const middleware = auth(async (req, event: NextFetchEvent) => {
  const locale  = await getLocale()
  
  if (!req.auth && !req.nextUrl.pathname.startsWith(`/${locale}/auth/`)) {
    const newUrl = new URL(`/${locale}/auth/login`, req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
  return createMiddleware(routing)(req);
});

export default middleware;

export const config = {    
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};