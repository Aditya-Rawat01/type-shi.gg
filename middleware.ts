import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
 
export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
	if (!sessionCookie) {
		if (request.nextUrl.pathname.startsWith("/api")) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
		return NextResponse.redirect(new URL("/login", request.url));
	}
	console.log("hallo")
	return NextResponse.next();
}
 
export const config = {
	matcher: [
		"/dashboard/:path*",
		"/api/:path*"
	], // Specify the routes the middleware applies to
};