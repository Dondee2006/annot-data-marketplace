import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { upload_id, storage_path } = body;

        if (!upload_id) {
            return NextResponse.json(
                { error: 'Missing upload_id' },
                { status: 400 }
            );
        }

        // Update upload status to rejected
        const { error: updateError } = await supabase
            .from('uploads')
            .update({ status: 'rejected' })
            .eq('id', upload_id);

        if (updateError) {
            console.error('Failed to update upload:', updateError);
            return NextResponse.json(
                { error: 'Failed to reject upload', details: updateError.message },
                { status: 500 }
            );
        }

        // Optionally delete the file from storage
        if (storage_path) {
            const { error: storageError } = await supabase.storage
                .from('uploads')
                .remove([storage_path]);

            if (storageError) {
                console.warn('Failed to delete file from storage:', storageError);
                // Continue anyway - the upload is marked as rejected
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Upload rejected successfully',
        });

    } catch (error: any) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
