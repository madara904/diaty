import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function middleware(req: NextRequest) {
    const session = await auth();

 
    const protectedRoutes = ['/dashboard'];
    const protectedApiRoutes = ['/api']; 
    const { pathname } = req.nextUrl;


    if (protectedRoutes.some(route => pathname.startsWith(route)) && !session) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }


    if (protectedApiRoutes.some(route => pathname.startsWith(route)) && !session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); 
    }

    return NextResponse.next(); 
}

export const config = {
    matcher: ['/dashboard/:path*', '/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'], 
    runtime: 'nodejs'
};