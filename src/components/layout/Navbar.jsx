'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import SearchBar from '@/components/ui/SearchBar';
import MessagesLink, { UnreadMessagesProvider } from './MessagesLink';

// Inject global styles for the navbar
const NavbarStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Exo+2:wght@400;500;600&display=swap');

    :root {
      --neon-cyan: #00f5ff;
      --neon-purple: #bf00ff;
      --neon-green: #39ff14;
      --dark-base: #080c14;
      --dark-panel: #0d1220;
      --dark-border: rgba(0,245,255,0.12);
      --dark-border-hover: rgba(0,245,255,0.35);
    }

    .bz-navbar-font { font-family: 'Rajdhani', sans-serif; }
    .bz-body-font { font-family: 'Exo 2', sans-serif; }

    /* Scanline overlay effect */
    .bz-scanlines::before {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0,0,0,0.04) 2px,
        rgba(0,0,0,0.04) 4px
      );
      pointer-events: none;
      z-index: 1;
    }

    /* Glowing logo */
    .bz-logo-glow {
      box-shadow: 0 0 12px rgba(0,245,255,0.4), 0 0 30px rgba(0,245,255,0.15), inset 0 1px 0 rgba(255,255,255,0.1);
      background: linear-gradient(135deg, #00c8ff 0%, #bf00ff 100%);
    }

    .bz-logo-text {
      background: linear-gradient(90deg, #00f5ff, #bf00ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: 0.05em;
    }

    /* Nav link with corner accents */
    .bz-nav-link {
      position: relative;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-size: 0.8rem;
      color: rgba(180,200,220,0.8);
      padding: 6px 14px;
      transition: color 0.2s, background 0.2s;
    }

    .bz-nav-link::before,
    .bz-nav-link::after {
      content: '';
      position: absolute;
      width: 6px;
      height: 6px;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .bz-nav-link::before {
      top: 4px; left: 4px;
      border-top: 1.5px solid var(--neon-cyan);
      border-left: 1.5px solid var(--neon-cyan);
    }

    .bz-nav-link::after {
      bottom: 4px; right: 4px;
      border-bottom: 1.5px solid var(--neon-cyan);
      border-right: 1.5px solid var(--neon-cyan);
    }

    .bz-nav-link:hover {
      color: #fff;
      background: rgba(0,245,255,0.06);
    }

    .bz-nav-link:hover::before,
    .bz-nav-link:hover::after {
      opacity: 1;
    }

    .bz-nav-link.active {
      color: var(--neon-cyan);
      background: rgba(0,245,255,0.08);
    }

    .bz-nav-link.active::before,
    .bz-nav-link.active::after {
      opacity: 1;
    }

    /* Wallet badge */
    .bz-wallet {
      font-family: 'Exo 2', sans-serif;
      font-weight: 600;
      font-size: 0.82rem;
      color: var(--neon-green);
      padding: 5px 12px;
      border: 1px solid rgba(57,255,20,0.25);
      border-radius: 3px;
      background: rgba(57,255,20,0.05);
      letter-spacing: 0.02em;
      transition: all 0.2s;
      text-shadow: 0 0 8px rgba(57,255,20,0.5);
    }

    .bz-wallet:hover {
      border-color: rgba(57,255,20,0.5);
      background: rgba(57,255,20,0.1);
      box-shadow: 0 0 12px rgba(57,255,20,0.15);
    }

    /* Buttons */
    .bz-btn-outline {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 0.78rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 6px 16px;
      border: 1px solid var(--dark-border-hover);
      border-radius: 3px;
      color: rgba(200,220,240,0.9);
      background: rgba(0,245,255,0.04);
      transition: all 0.2s;
    }

    .bz-btn-outline:hover {
      border-color: var(--neon-cyan);
      color: var(--neon-cyan);
      box-shadow: 0 0 14px rgba(0,245,255,0.15);
    }

    .bz-btn-primary {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 0.78rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 6px 16px;
      border-radius: 3px;
      color: #000;
      background: linear-gradient(90deg, #00f5ff, #00c0cc);
      box-shadow: 0 0 16px rgba(0,245,255,0.3), inset 0 1px 0 rgba(255,255,255,0.25);
      transition: all 0.2s;
      border: none;
    }

    .bz-btn-primary:hover {
      box-shadow: 0 0 24px rgba(0,245,255,0.5), inset 0 1px 0 rgba(255,255,255,0.3);
      transform: translateY(-1px);
    }

    .bz-btn-logout {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 0.78rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 6px 12px;
      color: rgba(255,80,80,0.6);
      border-radius: 3px;
      transition: color 0.2s, background 0.2s;
      border: none;
      background: transparent;
      cursor: pointer;
    }

    .bz-btn-logout:hover {
      color: #ff4444;
      background: rgba(255,60,60,0.08);
    }

    /* Main desktop nav bar */
    .bz-main-nav {
      background: linear-gradient(180deg, rgba(8,12,20,0.98) 0%, rgba(13,18,32,0.97) 100%);
      border-bottom: 1px solid var(--dark-border);
      box-shadow: 0 2px 30px rgba(0,0,0,0.6), 0 1px 0 rgba(0,245,255,0.04);
      position: relative;
    }

    /* Horizontal accent line at very top */
    .bz-main-nav::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, var(--neon-cyan) 30%, var(--neon-purple) 70%, transparent 100%);
      opacity: 0.6;
    }

    /* Mobile dropdown */
    .bz-mobile-menu {
      background: rgba(8,12,20,0.99);
      border-bottom: 1px solid var(--dark-border);
      backdrop-filter: blur(20px);
    }

    .bz-mobile-link {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 0.95rem;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: rgba(160,185,210,0.85);
      padding: 12px 16px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: color 0.15s, background 0.15s;
      position: relative;
      min-height: 44px;
    }

    .bz-mobile-link::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 2px;
      height: 0;
      background: var(--neon-cyan);
      border-radius: 2px;
      transition: height 0.2s;
    }

    .bz-mobile-link:hover {
      color: #fff;
      background: rgba(0,245,255,0.05);
    }

    .bz-mobile-link:hover::before {
      height: 60%;
    }

    .bz-mobile-link.active {
      color: var(--neon-cyan);
    }

    .bz-mobile-link.active::before {
      height: 60%;
    }

    /* Bottom nav (mobile tab bar) */
    .bz-bottom-nav {
      background: rgba(8,12,20,0.98);
      border-top: 1px solid var(--dark-border);
      backdrop-filter: blur(24px);
    }

    .bz-tab-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      height: 100%;
      padding: 4px 0;
      color: rgba(100,130,160,0.7);
      transition: color 0.2s;
      gap: 2px;
      position: relative;
    }

    .bz-tab-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 20%;
      right: 20%;
      height: 2px;
      background: var(--neon-cyan);
      border-radius: 0 0 4px 4px;
      opacity: 0;
      transition: opacity 0.2s;
      box-shadow: 0 0 8px var(--neon-cyan);
    }

    .bz-tab-item.active {
      color: var(--neon-cyan);
    }

    .bz-tab-item.active::before {
      opacity: 1;
    }

    .bz-tab-item:hover:not(.active) {
      color: rgba(160,190,220,0.9);
    }

    .bz-tab-label {
      font-family: 'Exo 2', sans-serif;
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    /* Create tab — special accent */
    .bz-tab-create {
      background: linear-gradient(135deg, rgba(0,245,255,0.12), rgba(191,0,255,0.12));
      border-radius: 8px;
      margin: 4px 2px;
      border: 1px solid rgba(0,245,255,0.15);
    }

    .bz-tab-create.active,
    .bz-tab-create:hover {
      border-color: rgba(0,245,255,0.35);
      background: linear-gradient(135deg, rgba(0,245,255,0.18), rgba(191,0,255,0.18));
    }

    /* Divider */
    .bz-divider {
      border-color: rgba(0,245,255,0.08);
      margin: 6px 0;
    }

    /* Logout mobile */
    .bz-logout-mobile {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(255,80,80,0.7);
      padding: 12px 16px;
      border-radius: 4px;
      width: 100%;
      text-align: left;
      transition: color 0.15s, background 0.15s;
      background: transparent;
      border: none;
      cursor: pointer;
      min-height: 44px;
    }

    .bz-logout-mobile:hover {
      color: #ff4444;
      background: rgba(255,60,60,0.07);
    }

    /* Slide down animation */
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .bz-slide-down {
      animation: slideDown 0.18s ease-out;
    }
  `}</style>
);

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
      <NavbarStyles />

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
      <nav
        className="bz-bottom-nav fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
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
