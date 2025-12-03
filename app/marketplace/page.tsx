'use client';

import { useState, useEffect } from 'react';
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

export default function MarketplacePage() {
    const [uploads, setUploads] = useState<Upload[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');

    useEffect(() => {
        fetchApprovedUploads();
    }, []);

    const fetchApprovedUploads = async () => {
        try {
            const response = await fetch('/api/uploads');
            const data = await response.json();
            // Filter only approved uploads
            const approved = (data.uploads || []).filter((u: Upload) => u.status === 'approved');
            setUploads(approved);
        } catch (error) {
            console.error('Failed to fetch uploads:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUploads = uploads.filter(upload => {
        const matchesSearch = upload.file_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || upload.file_type.includes(filterType);
        return matchesSearch && matchesType;
    });

    const getFileTypeCategory = (fileType: string) => {
        if (fileType.includes('image')) return 'Image';
        if (fileType.includes('audio')) return 'Audio';
        if (fileType.includes('video')) return 'Video';
        if (fileType.includes('text') || fileType.includes('json') || fileType.includes('csv')) return 'Text/Data';
        return 'Other';
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.includes('image')) return '🖼️';
        if (fileType.includes('audio')) return '🎵';
        if (fileType.includes('video')) return '🎬';
        if (fileType.includes('text')) return '📄';
        if (fileType.includes('json')) return '📋';
        if (fileType.includes('csv')) return '📊';
        return '📁';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Data Marketplace</h1>
                    <p className="text-gray-600">Browse and purchase high-quality African datasets</p>
                </div>

                {/* Search and Filter */}
                <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Datasets
                            </label>
                            <input
                                type="text"
                                placeholder="Search by filename..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Type
                            </label>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="all">All Types</option>
                                <option value="image">Images</option>
                                <option value="audio">Audio</option>
                                <option value="video">Video</option>
                                <option value="text">Text/Data</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Dataset Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                ) : filteredUploads.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <p className="text-gray-500 text-lg">No datasets found</p>
                        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredUploads.map((upload) => (
                                <Link
                                    key={upload.id}
                                    href={`/marketplace/${upload.id}`}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-300 transition-all duration-300 overflow-hidden group"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="text-4xl">{getFileIcon(upload.file_type)}</div>
                                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                                {getFileTypeCategory(upload.file_type)}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-purple-600 transition-colors">
                                            {upload.file_name}
                                        </h3>

                                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                                            <p>
                                                <span className="font-semibold">Size:</span> {(upload.file_size / 1024).toFixed(2)} KB
                                            </p>
                                            <p>
                                                <span className="font-semibold">Type:</span> {upload.file_type}
                                            </p>
                                            <p>
                                                <span className="font-semibold">Uploaded:</span> {new Date(upload.created_at).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">Price</span>
                                                <span className="text-xl font-bold text-purple-600">
                                                    ${(upload.size_mb * 10).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 group-hover:bg-purple-50 transition-colors">
                                        <p className="text-sm text-center text-gray-600 group-hover:text-purple-700 font-medium">
                                            View Details →
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Results Count */}
                        <div className="mt-8 text-center text-gray-600">
                            Showing {filteredUploads.length} of {uploads.length} datasets
                        </div>
                    </>
                )}

                {/* Info Section */}
                <div className="mt-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white">
                    <h2 className="text-2xl font-bold mb-4">Why Choose Annot Datasets?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <div className="text-3xl mb-2">✅</div>
                            <h3 className="font-semibold mb-2">Quality Verified</h3>
                            <p className="text-purple-100 text-sm">All datasets are reviewed and approved by our team</p>
                        </div>
                        <div>
                            <div className="text-3xl mb-2">🌍</div>
                            <h3 className="font-semibold mb-2">African Focus</h3>
                            <p className="text-purple-100 text-sm">Authentic, diverse data from African sources</p>
                        </div>
                        <div>
                            <div className="text-3xl mb-2">⚡</div>
                            <h3 className="font-semibold mb-2">Instant Access</h3>
                            <p className="text-purple-100 text-sm">Download immediately after purchase</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
