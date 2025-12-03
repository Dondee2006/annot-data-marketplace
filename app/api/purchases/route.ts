import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { buyer_id, upload_id, price } = body;

        if (!buyer_id || !upload_id || !price) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Verify the upload exists and is approved
        const { data: upload, error: uploadError } = await supabase
            .from('uploads')
            .select('*')
            .eq('id', upload_id)
            .eq('status', 'approved')
            .single();

        if (uploadError || !upload) {
            return NextResponse.json(
                { error: 'Dataset not found or not approved' },
                { status: 404 }
            );
        }

        // Create purchase record
        const { data: purchase, error: purchaseError } = await supabase
            .from('purchases')
            .insert({
                buyer_id,
                upload_id,
                price,
                metadata: {
                    file_name: upload.file_name,
                    file_type: upload.file_type,
                },
            })
            .select()
            .single();

        if (purchaseError) {
            console.error('Purchase error:', purchaseError);
            return NextResponse.json(
                { error: 'Failed to create purchase', details: purchaseError.message },
                { status: 500 }
            );
        }

        // In production, you would:
        // 1. Process payment via Stripe/PayPal
        // 2. Generate download link or signed URL
        // 3. Send confirmation email
        // 4. Update analytics

        return NextResponse.json({
            success: true,
            purchase,
            message: 'Purchase completed successfully',
            download_url: `/api/downloads/${upload.storage_path}`, // Mock URL
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
        const buyerId = searchParams.get('buyer_id');

        let query = supabase
            .from('purchases')
            .select('*, uploads(*)')
            .order('purchase_date', { ascending: false });

        if (buyerId) {
            query = query.eq('buyer_id', buyerId);
        }

        const { data: purchases, error } = await query;

        if (error) {
            return NextResponse.json(
                { error: 'Failed to fetch purchases', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ purchases });

    } catch (error: any) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
