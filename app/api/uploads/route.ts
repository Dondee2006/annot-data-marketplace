import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { user_id, file_name, file_type, file_size, storage_path, tokens_earned } = body;

        // Validate required fields
        if (!user_id || !file_name || !file_type || !file_size || !storage_path) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Insert upload record
        const { data: upload, error: uploadError } = await supabase
            .from('uploads')
            .insert({
                user_id,
                file_name,
                file_type,
                file_size,
                storage_path,
                tokens_earned: tokens_earned || 0,
                status: 'pending',
            })
            .select()
            .single();

        if (uploadError) {
            console.error('Database error:', uploadError);
            return NextResponse.json(
                { error: 'Failed to save upload', details: uploadError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            upload,
            message: 'Upload saved successfully. Pending admin approval.',
        });

    } catch (error: any) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user_id');

        let query = supabase.from('uploads').select('*').order('created_at', { ascending: false });

        if (userId) {
            query = query.eq('user_id', userId);
        }

        const { data: uploads, error } = await query;

        if (error) {
            return NextResponse.json(
                { error: 'Failed to fetch uploads', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ uploads });

    } catch (error: any) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
