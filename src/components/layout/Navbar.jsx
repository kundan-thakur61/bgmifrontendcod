'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import SearchBar from '@/components/ui/SearchBar';
import MessagesLink, { UnreadMessagesProvider } from './MessagesLink';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => { setIsMenuOpen(false); }, [pathname]);

  const navLinks = [
    { href: '/matches', label: 'Matches' },
    { href: '/tournaments', label: 'Tournaments' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/how-it-works', label: 'How It Works' },
  ];

  const authenticatedNavLinks = [
    { href: '/create-match', label: 'Create Match' },
    ...navLinks,
  ];

  const displayNavLinks = isAuthenticated ? authenticatedNavLinks : navLinks;

  const userLinks = [
    { href: '/wallet', label: 'Wallet' },
    { href: '/messages', label: 'Messages' },
    { href: '/profile', label: 'Profile' },
    { href: '/notifications', label: 'Notifications' },
  ];

  const mobileNavItems = [
    {
      href: '/', label: 'Home',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      href: '/matches', label: 'Matches',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      href: '/create-match', label: 'Create', isCreate: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      href: '/messages', label: 'Chat',
      icon: (
        <MessagesLink isMobile asLink={false} />
      )
    },
    {
      href: '/profile', label: 'Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
  ];

  const isActive = (href) => pathname === href;

  return (
    <UnreadMessagesProvider>
      {/* ── DESKTOP NAV ─────────────────────────────────────── */}
      <nav className="bz-main-nav bz-scanlines fixed top-0 left-0 right-0 z-50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16" style={{ position: 'relative', zIndex: 2 }}>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="bz-logo-glow w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-105">
                <span className="bz-navbar-font text-black font-bold text-lg leading-none select-none">B</span>
              </div>
              <span className="bz-logo-text bz-navbar-font text-xl font-bold tracking-widest uppercase">
                BattleZone
              </span>
            </Link>

            {/* Nav links */}
            <div className="flex items-center gap-0.5">
              {displayNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`bz-nav-link rounded-sm ${isActive(link.href) ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2.5">
              <SearchBar className="w-44 hidden lg:block" />

              {isAuthenticated ? (
                <>
                  <MessagesLink className="text-gray-400 hover:text-white transition-colors p-2" />
                  <Link href="/wallet" className="bz-wallet">
                    ₹{user?.walletBalance || 0}
                  </Link>
                  <Link href="/profile" className="bz-btn-outline">
                    {user?.username || 'Profile'}
                  </Link>
                  <button onClick={() => logout()} className="bz-btn-logout">
                    Exit
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="bz-btn-outline">Login</Link>
                  <Link href="/register" className="bz-btn-primary">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE TOP BAR ──────────────────────────────────── */}
      <nav className="bz-main-nav fixed top-0 left-0 right-0 z-50 md:hidden">
        <div className="px-3 sm:px-4" style={{ position: 'relative', zIndex: 2 }}>
          <div className="flex items-center justify-between h-14">

            <Link href="/" className="flex items-center gap-2 group min-w-0">
              <div className="bz-logo-glow w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0">
                <span className="bz-navbar-font text-black font-bold text-base leading-none select-none">B</span>
              </div>
              <span className="bz-logo-text bz-navbar-font text-base font-bold tracking-widest uppercase truncate">
                BattleZone
              </span>
            </Link>

            <div className="flex items-center gap-1">
              {isAuthenticated && (
                <Link href="/wallet" className="bz-wallet text-xs px-2 py-1">
                  ₹{user?.walletBalance || 0}
                </Link>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                style={{
                  width: 44, height: 44,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 6,
                  border: '1px solid rgba(0,245,255,0.1)',
                  background: isMenuOpen ? 'rgba(0,245,255,0.07)' : 'transparent',
                  color: isMenuOpen ? 'var(--neon-cyan)' : 'rgba(160,185,210,0.7)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isMenuOpen && (
          <div className="bz-mobile-menu bz-slide-down absolute top-full left-0 right-0 z-50 max-h-[calc(100vh-56px-64px)] overflow-y-auto">
            <div className="px-3 py-3 space-y-0.5">
              {displayNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`bz-mobile-link ${isActive(link.href) ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  <hr className="bz-divider border-t" />
                  {userLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`bz-mobile-link ${isActive(link.href) ? 'active' : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </>
              )}

              <hr className="bz-divider border-t" />

              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); setIsMenuOpen(false); }}
                  className="bz-logout-mobile"
                >
                  Log Out
                </button>
              ) : (
                <div className="flex flex-col gap-2 pt-1 pb-1">
                  <Link
                    href="/login"
                    className="bz-btn-outline text-center"
                    style={{ minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bz-btn-primary text-center"
                    style={{ minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ── MOBILE BOTTOM TAB BAR ───────────────────────────── */}
      <nav className="bz-bottom-nav fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="flex items-stretch justify-around h-16 px-1 max-w-lg mx-auto">
          {mobileNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`bz-tab-item ${active ? 'active' : ''} ${item.isCreate ? 'bz-tab-create' : ''}`}
              >
                {item.icon}
                <span className="bz-tab-label">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </UnreadMessagesProvider>
  );
}
