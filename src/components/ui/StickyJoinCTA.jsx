'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * Mobile-only sticky CTA bar — floats above the bottom nav.
 * Pass `href` for a link, `onClick` for a callback, or leave blank for /matches.
 * Use `visible` prop to control visibility (defaults to always shown on mobile).
 */
export default function StickyJoinCTA({
    href = '/matches',
    label = '🎮 Join Tournament Now',
    onClick,
    visible = true,
}) {
    const [show, setShow] = useState(false);

    // Only show after a short delay so it doesn't block above-fold content
    useEffect(() => {
        const t = setTimeout(() => setShow(true), 1200);
        return () => clearTimeout(t);
    }, []);

    if (!show || !visible) return null;

    const content = (
        <button
            className="sticky-cta-btn tap-scale"
            aria-label={label}
            onClick={onClick}
        >
            <span
                style={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#00ff88',
                    boxShadow: '0 0 8px #00ff88',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    flexShrink: 0,
                }}
            />
            {label}
        </button>
    );

    return (
        <div className="sticky-cta md:hidden" role="complementary" aria-label="Quick join">
            {onClick ? content : <Link href={href}>{content}</Link>}
        </div>
    );
}
