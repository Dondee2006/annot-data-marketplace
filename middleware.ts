import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    const protectedRoutes = ['/upload', '/admin'];
    const adminRoutes = ['/admin'];

    // Only run middleware for protected routes
    if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Get Supabase auth token from cookies
    // Supabase stores tokens in cookies with pattern: sb-<project-ref>-auth-token
    const allCookies = req.cookies.getAll();
    const authCookie = allCookies.find(cookie =>
        cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')
    );

    if (!authCookie) {
        const loginUrl = new URL('/login', req.url);
        return NextResponse.redirect(loginUrl);
    }

    // Parse the auth token
    let accessToken: string | null = null;
    try {
        const cookieValue = JSON.parse(authCookie.value);
        accessToken = cookieValue.access_token || cookieValue[0]; // Handle different formats
    } catch {
        // If parsing fails, redirect to login
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (!accessToken) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // For admin routes, verify user is admin
    if (adminRoutes.some((route) => pathname.startsWith(route))) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            global: { headers: { Authorization: `Bearer ${accessToken}` } },
        });

        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser(accessToken);

            if (!user) {
                return NextResponse.redirect(new URL('/login', req.url));
            }

            // Check if user exists in 'admins' table (optional - comment out if not using)
            const { data: adminData, error } = await supabase
                .from('admins')
                .select('user_id')
                .eq('user_id', user.id)
                .single();

            if (error || !adminData) {
                // Not an admin → redirect to home instead of login
                return NextResponse.redirect(new URL('/', req.url));
            }

        } catch (err) {
            console.error('Admin middleware error:', err);
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    return NextResponse.next();
}

// Apply middleware to upload and admin routes
export const config = {
    matcher: ['/upload/:path*', '/admin/:path*'],
};

