import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}



// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isProtectedRoute = createRouteMatcher(['/hoyacalculator'])

// export default clerkMiddleware({
//   publicRoutes: ["/", "/unauthorized", "/api/check-whitelist"],
//   async afterAuth(auth, req) {
//     console.log("🔥 Middleware is running");
//     const { userId } = auth;
// console.log('auth in middleware',auth)
//     if (!userId) {
//       // 🔁 Manual redirect to sign-in
//       return NextResponse.redirect(
//         new URL(`/sign-in?redirect_url=${req.nextUrl.pathname}`, req.url)
//       );
//     }

//     // Optional: Redirect signed-in users at "/" to /hoyacalculator
//     if (req.nextUrl.pathname === "/") {
//       return NextResponse.redirect(new URL("/hoyacalculator", req.url));
//     }

//     // ✅ Email whitelist check
//     console.log(`${req.nextUrl.origin}/api/check-whitelist`)
//     const res = await fetch(`${req.nextUrl.origin}/api/check-whitelist`, {
//       headers: {
//         cookie: req.headers.get("cookie") ?? "",
//       },
//     });
//     console.log('middleware, res',res)

//     if (!res.ok) {
//       return NextResponse.redirect(new URL("/unauthorized", req.url));
//     }

//     return NextResponse.next();
//   },
// });

// export const config = {
//   matcher: [
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|...)).*)",
//     "/(api|trpc)(.*)",
//   ],
// };
