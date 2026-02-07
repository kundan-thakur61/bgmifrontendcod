'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/**
 * AdminOnly Component - Protects routes that should only be accessible by admins
 * 
 * @param {React.ReactNode} children - The protected content
 * @param {Array<string>} allowedRoles - Array of allowed roles (default: ['admin', 'super_admin', 'match_manager'])
 */
export default function AdminOnly({ children, allowedRoles = ['admin', 'super_admin', 'match_manager'] }) {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            // Not logged in
            if (!user) {
                router.push('/login?redirect=/matches');
                return;
            }

            // Check if user has allowed role
            if (!allowedRoles.includes(user.role)) {
                router.push('/');
                return;
            }
        }
    }, [user, loading, router, allowedRoles]);

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

    // User doesn't have permission
    if (!allowedRoles.includes(user.role)) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-dark-900 to-dark-800">
                <div className="text-center p-8 bg-dark-800/50 backdrop-blur-md rounded-2xl border border-dark-700">
                    <div className="text-6xl mb-4">⛔</div>
                    <p className="text-xl text-red-400 mb-4">Access Denied</p>
                    <p className="text-dark-400 mb-6">You don't have permission to access this page.</p>
                    <p className="text-sm text-dark-500">Required role: Admin or Match Manager</p>
                    <p className="text-sm text-dark-500 mb-6">Your role: {user.role}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    // User has permission, render children
    return <>{children}</>;
}
