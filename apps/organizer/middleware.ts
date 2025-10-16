import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "@/lib/auth";
import type { NextFetchEvent, NextRequest } from "next/server";

// Create the intl middleware first
const intlMiddleware = createMiddleware(routing);

const middleware = auth(async (req, event: NextFetchEvent) => {
  // First, let next-intl handle locale detection and redirection
  const intlResponse = intlMiddleware(req as NextRequest);

  // Extract locale from pathname
  const pathnameLocale = req.nextUrl.pathname.split("/")[1];
  const locale = routing.locales.includes(pathnameLocale as any)
    ? pathnameLocale
    : routing.defaultLocale;

  // Then check authentication - req.auth is available in the Auth.js callback
  if (!req.auth && !req.nextUrl.pathname.startsWith(`/${locale}/auth/`)) {
    const newUrl = new URL(`/${locale}/auth/login`, req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  return intlResponse;
}) as any; // Type assertion needed due to Auth.js middleware typing

export default middleware;

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
