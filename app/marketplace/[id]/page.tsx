'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Upload {
    id: string;
    user_id: string;
    file_name: string;
    file_type: string;
    file_size: number;
    size_mb: number;
    storage_path: string;
    status: string;
    tokens_earned: number;
    created_at: string;
}

export default function DatasetDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [dataset, setDataset] = useState<Upload | null>(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);

    useEffect(() => {
        fetchDataset();
    }, [params.id]);

    const fetchDataset = async () => {
        try {
            const response = await fetch('/api/uploads');
            const data = await response.json();
            const found = data.uploads?.find((u: Upload) => u.id === params.id && u.status === 'approved');
            setDataset(found || null);
        } catch (error) {
            console.error('Failed to fetch dataset:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async () => {
        if (!dataset) return;

        setPurchasing(true);
        try {
            // Mock buyer ID (in production, get from auth)
            const buyerId = '00000000-0000-0000-0000-000000000002';
            const price = dataset.size_mb * 10;

            const response = await fetch('/api/purchases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    buyer_id: buyerId,
                    upload_id: dataset.id,
                    price: price,
                }),
            });

            if (!response.ok) {
                throw new Error('Purchase failed');
            }

            alert('Purchase successful! 🎉');
            router.push('/marketplace');
        } catch (error) {
            console.error('Purchase error:', error);
            alert('Purchase failed. Please try again.');
        } finally {
            setPurchasing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!dataset) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <p className="text-gray-500 text-lg mb-4">Dataset not found</p>
                        <Link href="/marketplace" className="text-purple-600 hover:text-purple-700 font-medium">
                            ← Back to Marketplace
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const price = dataset.size_mb * 10;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/marketplace"
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium mb-6"
                >
                    ← Back to Marketplace
                </Link>

                {/* Main Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
                        <h1 className="text-3xl font-bold mb-2">{dataset.file_name}</h1>
                        <p className="text-purple-100">Dataset Details</p>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-600 mb-1">File Type</h3>
                                    <p className="text-lg text-gray-900">{dataset.file_type}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-600 mb-1">File Size</h3>
                                    <p className="text-lg text-gray-900">{(dataset.file_size / 1024).toFixed(2)} KB</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Upload Date</h3>
                                    <p className="text-lg text-gray-900">{new Date(dataset.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Status</h3>
                                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                        Approved
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Dataset ID</h3>
                                    <p className="text-sm text-gray-900 font-mono break-all">{dataset.id}</p>
                                </div>
                            </div>
                        </div>

                        {/* Preview Section */}
                        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Preview</h3>
                            <p className="text-gray-600 text-sm mb-2">
                                This is a sample preview of the dataset. Full access available after purchase.
                            </p>
                            <div className="bg-white p-4 rounded border border-gray-300 font-mono text-sm text-gray-700">
                                {dataset.file_type.includes('image') && '🖼️ Image file preview not available'}
                                {dataset.file_type.includes('audio') && '🎵 Audio file preview not available'}
                                {dataset.file_type.includes('video') && '🎬 Video file preview not available'}
                                {dataset.file_type.includes('text') && 'Sample text data...'}
                                {dataset.file_type.includes('json') && '{ "sample": "data" }'}
                                {dataset.file_type.includes('csv') && 'column1,column2,column3\nvalue1,value2,value3'}
                            </div>
                        </div>

                        {/* Pricing and Purchase */}
                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Price</p>
                                    <p className="text-4xl font-bold text-purple-600">${price.toFixed(2)}</p>
                                    <p className="text-xs text-gray-500 mt-1">One-time purchase, lifetime access</p>
                                </div>
                                <button
                                    onClick={handlePurchase}
                                    disabled={purchasing}
                                    className="px-8 py-4 bg-purple-600 text-white rounded-lg font-bold text-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                                >
                                    {purchasing ? 'Processing...' : 'Purchase Now'}
                                </button>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> This is a demo. No actual payment is processed.
                                    In production, integrate with a payment gateway like Stripe or PayPal.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="text-3xl mb-2">🔒</div>
                        <h3 className="font-bold mb-2">Secure Purchase</h3>
                        <p className="text-sm text-gray-600">Your transaction is protected and encrypted</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="text-3xl mb-2">⚡</div>
                        <h3 className="font-bold mb-2">Instant Download</h3>
                        <p className="text-sm text-gray-600">Access your dataset immediately after purchase</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="text-3xl mb-2">💎</div>
                        <h3 className="font-bold mb-2">Quality Guaranteed</h3>
                        <p className="text-sm text-gray-600">All datasets are verified for quality</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
