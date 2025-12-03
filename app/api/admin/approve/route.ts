import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { upload_id, user_id, tokens_earned } = body;

        if (!upload_id || !user_id || tokens_earned === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Update upload status to approved
        const { error: updateError } = await supabase
            .from('uploads')
            .update({ status: 'approved' })
            .eq('id', upload_id);

        if (updateError) {
            console.error('Failed to update upload:', updateError);
            return NextResponse.json(
                { error: 'Failed to approve upload', details: updateError.message },
                { status: 500 }
            );
        }

        // Call the Postgres function to add tokens to wallet
        const { data, error: walletError } = await supabase
            .rpc('add_tokens_to_wallet', {
                user_uuid: user_id,
                tokens: tokens_earned,
            });

        if (walletError) {
            console.error('Failed to update wallet:', walletError);
            // Revert the upload status if wallet update fails
            await supabase
                .from('uploads')
                .update({ status: 'pending' })
                .eq('id', upload_id);

            return NextResponse.json(
                { error: 'Failed to update wallet', details: walletError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Upload approved and tokens added to wallet',
            new_balance: data,
        });

    } catch (error: any) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
