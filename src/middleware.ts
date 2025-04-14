import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware({
  publicRoutes: ["/", "/unauthorized", "/api/check-whitelist"],

  async afterAuth(auth, req) {
    const { userId } = auth;

    if (!userId) {
      // 🔁 Manual redirect to sign-in
      return NextResponse.redirect(
        new URL(`/sign-in?redirect_url=${req.nextUrl.pathname}`, req.url)
      );
    }

    // Optional: Redirect signed-in users at "/" to /hoyacalculator
    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/hoyacalculator", req.url));
    }

    // ✅ Email whitelist check
    const res = await fetch(`${req.nextUrl.origin}/api/check-whitelist`, {
      headers: {
        cookie: req.headers.get("cookie") ?? "",
      },
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
