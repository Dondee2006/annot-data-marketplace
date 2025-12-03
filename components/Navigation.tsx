'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Navigation() {
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser()
            setUserEmail(data?.user?.email ?? null)
        }
        getUser()
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserEmail(session?.user?.email ?? null)
        })
        return () => sub?.subscription.unsubscribe()
    }, [])

    const logout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-8 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            Annot
                        </span>
                    </Link>

                    <div className="flex items-center space-x-6">
                        <Link href="/marketplace" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                            Marketplace
                        </Link>
                        <Link href="/upload" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                            Upload
                        </Link>
                        <Link href="/admin" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                            Admin
                        </Link>

                        {userEmail ? (
                            <>
                                <span className="text-sm text-gray-600">{userEmail}</span>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                                    Login
                                </Link>
                                <Link href="/signup" className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

