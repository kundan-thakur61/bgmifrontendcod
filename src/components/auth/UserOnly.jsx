'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/**
 * UserOnly Component - Protects routes that should only be accessible by regular users (not admins)
 * 
 * @param {React.ReactNode} children - The protected content
 */
export default function UserOnly({ children }) {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            // Not logged in
            if (!user) {
                router.push('/login?redirect=/create-match');
                return;
            }

            // Check if user is admin - admins should not access user-only pages
            if (['admin', 'super_admin', 'match_manager'].includes(user.role)) {
                router.push('/matches'); // Redirect admins to matches management page
                return;
            }
        }
    }, [user, loading, router]);

    // Show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-dark-900 to-dark-800">
                <div className="text-center p-8 bg-dark-800/50 backdrop-blur-md rounded-2xl border border-dark-700">
                    <div className="text-6xl mb-4 animate-spin">⏳</div>
                    <p className="text-xl text-dark-200">Loading...</p>
                </div>
            </div>
        );
    }

    // Not logged in
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-dark-900 to-dark-800">
                <div className="text-center p-8 bg-dark-800/50 backdrop-blur-md rounded-2xl border border-dark-700">
                    <div className="text-6xl mb-4">🔒</div>
                    <p className="text-xl text-dark-200 mb-4">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    // Admin trying to access user page
    if (['admin', 'super_admin', 'match_manager'].includes(user.role)) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-dark-900 to-dark-800">
                <div className="text-center p-8 bg-dark-800/50 backdrop-blur-md rounded-2xl border border-dark-700">
                    <div className="text-6xl mb-4">👑</div>
                    <p className="text-xl text-blue-400 mb-4">Admin Access Detected</p>
                    <p className="text-dark-400 mb-6">This page is for regular users. Admins should use the admin panel to create matches.</p>
                    <button
                        onClick={() => router.push('/matches')}
                        className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                    >
                        Go to Match Management
                    </button>
                </div>
            </div>
        );
    }

    // Regular user has permission, render children
    return <>{children}</>;
}
