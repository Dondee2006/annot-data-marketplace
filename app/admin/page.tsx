'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface Upload {
    id: string;
    user_id: string;
    file_name: string;
    file_type: string;
    file_size: number;
    size_mb: number;
    storage_path: string;
    status: 'pending' | 'approved' | 'rejected';
    tokens_earned: number;
    created_at: string;
}

export default function AdminPage() {
    const router = useRouter();

    // AUTH STATE
    const [authChecked, setAuthChecked] = useState(false);
    const [user, setUser] = useState<any>(null);

    // ADMIN PAGE STATE
    const [uploads, setUploads] = useState<Upload[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const [processing, setProcessing] = useState<string | null>(null);

    // 🔐 AUTHENTICATION CHECK
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            setUser(user);
            setAuthChecked(true);
        };

        checkAuth();
    }, [supabase, router]);

    if (!authChecked) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-600 text-lg">Checking authentication...</p>
            </div>
        );
    }

    // FETCH UPLOADS
    useEffect(() => {
        fetchUploads();
    }, []);

    const fetchUploads = async () => {
        try {
            const response = await fetch('/api/uploads');
            const data = await response.json();
            setUploads(data.uploads || []);
        } catch (error) {
            console.error('Failed to fetch uploads:', error);
        } finally {
            setLoading(false);
        }
    };

    // APPROVE
    const handleApprove = async (uploadId: string, userId: string, tokensEarned: number) => {
        setProcessing(uploadId);
        try {
            const response = await fetch('/api/admin/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ upload_id: uploadId, user_id: userId, tokens_earned: tokensEarned }),
            });

            if (!response.ok) throw new Error('Failed to approve upload');

            await fetchUploads();
            alert('Upload approved successfully!');
        } catch (error) {
            console.error('Approval error:', error);
            alert('Failed to approve upload');
        } finally {
            setProcessing(null);
        }
    };

    // REJECT
    const handleReject = async (uploadId: string, storagePath: string) => {
        setProcessing(uploadId);
        try {
            const response = await fetch('/api/admin/reject', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ upload_id: uploadId, storage_path: storagePath }),
            });

            if (!response.ok) throw new Error('Failed to reject upload');

            await fetchUploads();
            alert('Upload rejected successfully!');
        } catch (error) {
            console.error('Rejection error:', error);
            alert('Failed to reject upload');
        } finally {
            setProcessing(null);
        }
    };

    // Filtering
    const filteredUploads = uploads.filter(upload =>
        filter === 'all' ? true : upload.status === filter
    );

    // Status badge colors
    const getStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
        };
        return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
    };

    // FULL ADMIN PAGE UI
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Panel</h1>
                    <p className="text-gray-600">Review and manage uploaded datasets</p>
                </div>

                {/* Filter Tabs */}
                <div className="mb-6 flex space-x-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200 w-fit">
                    {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`
                                px-4 py-2 rounded-md font-medium transition-all capitalize
                                ${filter === status
                                    ? 'bg-purple-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }
                            `}
                        >
                            {status}
                            <span className="ml-2 text-xs opacity-75">
                                ({uploads.filter(u => status === 'all' ? true : u.status === status).length})
                            </span>
                        </button>
                    ))}
                </div>

                {/* Upload Table */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                ) : filteredUploads.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <p className="text-gray-500 text-lg">No uploads found</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">File Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Size</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tokens</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredUploads.map((upload) => (
                                        <tr key={upload.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{upload.file_name}</p>
                                                <p className="text-xs text-gray-500 truncate max-w-xs">{upload.id}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{upload.file_type}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{(upload.file_size / 1024).toFixed(2)} KB</td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-semibold text-purple-600">{upload.tokens_earned}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(upload.status)}`}>
                                                    {upload.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(upload.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {upload.status === 'pending' ? (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleApprove(upload.id, upload.user_id, upload.tokens_earned)}
                                                            disabled={processing === upload.id}
                                                            className="px-3 py-1 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            {processing === upload.id ? '...' : 'Approve'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(upload.id, upload.storage_path)}
                                                            disabled={processing === upload.id}
                                                            className="px-3 py-1 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            {processing === upload.id ? '...' : 'Reject'}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">No actions</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Uploads</h3>
                        <p className="text-3xl font-bold text-gray-900">{uploads.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">Pending Review</h3>
                        <p className="text-3xl font-bold text-yellow-600">
                            {uploads.filter(u => u.status === 'pending').length}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">Approved</h3>
                        <p className="text-3xl font-bold text-green-600">
                            {uploads.filter(u => u.status === 'approved').length}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
