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

    // Get token from cookies
    const token = req.cookies.get('sb-access-token');

    if (!token) {
        const loginUrl = new URL('/login', req.url);
        return NextResponse.redirect(loginUrl);
    }

    // For admin routes, verify user is admin
    if (adminRoutes.some((route) => pathname.startsWith(route))) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            global: { headers: { Authorization: `Bearer ${token.value}` } },
        });

        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser(token.value);

            if (!user) {
                return NextResponse.redirect(new URL('/login', req.url));
            }

            // Check if user exists in 'admins' table
            const { data: adminData, error } = await supabase
                .from('admins')
                .select('user_id')
                .eq('user_id', user.id)
                .single();

            if (error || !adminData) {
                // Not an admin → redirect
                return NextResponse.redirect(new URL('/login', req.url));
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
