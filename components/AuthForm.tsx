// components/AuthForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function AuthForm({ mode = 'login' }: { mode?: 'login' | 'signup' }) {
    const supabase = createClient()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            if (mode === 'signup') {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                })
                if (signUpError) throw signUpError
                setSuccess('Account created! Please check your email for confirmation.')
                setTimeout(() => router.push('/login'), 2000)
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (signInError) throw signInError
                router.push('/upload')
            }
        } catch (err: any) {
            setError(err.message || 'Authentication error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-8">
            <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <p className="text-gray-600">
                        {mode === 'signup' ? 'Join Annot and start earning tokens' : 'Log in to your account'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 text-sm">❌ {error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800 text-sm">✅ {success}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Please wait...' : mode === 'signup' ? 'Sign Up' : 'Log In'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <Link
                            href={mode === 'signup' ? '/login' : '/signup'}
                            className="text-purple-600 hover:text-purple-700 font-medium"
                        >
                            {mode === 'signup' ? 'Log In' : 'Sign Up'}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
