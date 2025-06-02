import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is where you would store your actual password.
// For production, **DO NOT hardcode this value here**.
// Use environment variables (e.g., process.env.HOYA_CALCULATOR_PASSWORD).
const SECRET_PASSWORD = process.env.CALCULATOR_PASSWORD || "redhouse2024"; // Fallback for development if env not set

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // 1. Check if the request is for the /hoyacalculator page
  if (url.pathname === '/hoyacalculator') {
    // 2. Check if a password cookie exists
    const hasAccessCookie = request.cookies.has('hoya_calculator_access');

    // 3. If no access cookie, redirect to the landing page with a query parameter
    if (!hasAccessCookie) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (url.pathname === '/') {
    const submittedPassword = url.searchParams.get('password');

    if (submittedPassword && submittedPassword === SECRET_PASSWORD) {
      const response = NextResponse.redirect(new URL('/hoyacalculator', request.url));
      // Set the cookie. 'true' is just a placeholder value, its presence is what matters.
      // 'httpOnly: true' is important for security to prevent client-side script access.
      // 'secure: true' for HTTPS (in production).
      // 'maxAge' determines how long the cookie lasts (e.g., 1 hour = 3600 seconds).
      response.cookies.set('hoya_calculator_access', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 60 * 60, // 1 hour
        path: '/', // The cookie is valid for the entire site
      });
      return response;
    }
  }

  // If none of the above conditions are met, proceed with the request
  return NextResponse.next();
}

// 5. Configure the middleware to run only for specific paths
export const config = {
  matcher: ['/', '/hoyacalculator'], // Apply middleware only to these paths
};