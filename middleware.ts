import {
  clerkMiddleware,
  createRouteMatcher
} from '@clerk/nextjs/server';
// import { NextApiResponse } from 'next';
// import { NextResponse } from 'next/server';

// export function middleware(req: Request, res:NextApiResponse) {
//   const origin = req.headers.get('origin');

//   const response = NextResponse.next();

//   response.headers.set('Access-Control-Allow-Origin', origin || '*');
//   response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   response.headers.set('Access-Control-Allow-Credentials', 'true');
//   response.headers.set('Access-Control-Max-Age', '86400'); // Cache preflight response for 1 day

//   if (req.method === 'OPTIONS') {
//     return new Response(null, {
//       headers: response.headers,
//       status: 204, // No Content
//     });
//   }

//   return response;
// }

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