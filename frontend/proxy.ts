import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = ["/sign-up", "/sign-in"];
const PROTECTED_ROUTES = ["/user", "/admin", "/doctor", "/dashboard"];

export function proxy(request: NextRequest) {

  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  const isPublicRoute = PUBLIC_ROUTES.some(
    route => pathname === route || pathname.startsWith(route)
  );

  const isProtectedRoute = PROTECTED_ROUTES.some(
    route => pathname.startsWith(route)
  );

  if (pathname === "/") {
    if (accessToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL('/sign-in', request.url);
    console.log(pathname, "pathname")
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 🔁 Auth route but already logged in
  if ((pathname === '/sign-in' || pathname === '/sign-up') && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|static|favicon.ico).*)'],
};