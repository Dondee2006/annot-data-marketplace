'use client';

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { calculateTokensFromBytes } from '@/lib/tokens';

const ALLOWED_FILE_TYPES = {
    'text/plain': '.txt',
    'application/json': '.json',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'audio/mpeg': '.mp3',
    'audio/wav': '.wav',
    'video/mp4': '.mp4',
    'text/csv': '.csv',
};

export default function UploadPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // 1️⃣ Check authentication when page loads
    useEffect(() => {
        const checkAuth = async () => {
            const { data: authData } = await supabase.auth.getUser();
            if (!authData.user) {
                router.push('/login'); // redirect if not logged in
            } else {
                setUser(authData.user);
            }
        };

        checkAuth();
    }, [router]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    // 2️⃣ Upload File Logic
    const handleFileUpload = async (file: File) => {
        setError(null);
        setUploadedFile(null);

        // Validate type
        if (!Object.keys(ALLOWED_FILE_TYPES).includes(file.type)) {
            setError(`File type ${file.type} is not supported.`);
            return;
        }

        setUploading(true);

        try {
            if (!user) throw new Error("User not authenticated");

            // Upload to Supabase Storage
            const fileName = `${Date.now()}-${file.name}`;
            const { data: storageData, error: storageError } = await supabase.storage
                .from('uploads')
                .upload(fileName, file);

            if (storageError) throw new Error(storageError.message);

            // Calculate tokens from your rule function
            const tokens = calculateTokensFromBytes(file.size, file.type);

            // Save metadata
            const response = await fetch('/api/uploads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id, // 🎯 REAL USER ID HERE
                    file_name: file.name,
                    file_type: file.type,
                    file_size: file.size,
                    storage_path: storageData.path,
                    tokens_earned: tokens,
                }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to save metadata');
            }

            const result = await response.json();

            setUploadedFile({
                ...result.upload,
                tokens,
                file,
            });

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    // If still fetching user, show loading
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-lg font-medium text-gray-600">
                Checking authentication...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Upload Data</h1>
                <p className="text-gray-600 mb-8">Upload your datasets and earn tokens</p>

                {/* Drag & Drop */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-4 border-dashed rounded-2xl p-12 text-center transition-all ${isDragging
                            ? 'border-purple-500 bg-purple-50 scale-105'
                            : 'border-gray-300 bg-white hover:border-purple-400'
                        }`}
                >
                    <div className="space-y-4">
                        <div className="text-6xl">📁</div>
                        <p className="text-xl font-semibold">Drag and drop your file</p>
                        <label>
                            <input type="file" className="hidden" onChange={handleFileSelect} />
                            <span className="px-6 py-3 bg-purple-600 text-white rounded-lg cursor-pointer">
                                Browse Files
                            </span>
                        </label>
                    </div>
                </div>

                {uploading && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800">
                        Uploading...
                    </div>
                )}

                {error && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
                        ❌ {error}
                    </div>
                )}

                {uploadedFile && (
                    <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl">
                        <h3 className="text-xl font-bold mb-2">Upload Successful 🎉</h3>
                        <p>You earned <b>{uploadedFile.tokens}</b> tokens</p>
                        <p className="mt-4 text-sm text-gray-700">
                            File: {uploadedFile.file_name}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
