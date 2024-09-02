import {
  clerkMiddleware,
  createRouteMatcher
} from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/',
]);
const isPublicRoute = createRouteMatcher([
  '/api/:path*',
  '/api(.*)',
]);

export default clerkMiddleware((auth, req) => {

  if (isPublicRoute(req)) {
    // Skip authentication for public routes
    return;
  } else if (isProtectedRoute(req)) {
    // Enforce authentication for protected routes
    auth().protect();
  }

//   if (isProtectedRoute(req)) auth().protect();
//  else if (isPublicRoute(req)) {
//     // Handle public route logic if needed
//     return;
//   }
});


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};