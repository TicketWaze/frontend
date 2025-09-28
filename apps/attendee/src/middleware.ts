import createMiddleware from 'next-intl/middleware';
import type {NextFetchEvent } from 'next/server';
import { getLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { auth } from '@/lib/auth';

const middleware = auth(async (req, event: NextFetchEvent) => {
  const locale = await getLocale()
  
  // Define paths that don't require authentication
  const publicPaths = [
    `/${locale}/auth/`,
    `/${locale}/explore`,
    `/${locale}/organizers`,
    `/`,
  ];
  
  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  );
  
  // Redirect to login only if user is not authenticated AND path is not public
  if (!req.auth && !isPublicPath) {
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