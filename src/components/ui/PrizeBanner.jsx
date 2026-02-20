'use client';

import Link from 'next/link';

/**
 * Full-width mobile prize banner — "Win up to ₹10,000 daily!"
 * Place above the fold on the Matches / Tournaments page.
 */
export default function PrizeBanner({
    amount = '₹10,000',
    text = 'in daily prizes — Join Free!',
    href = '/register',
    cta = 'Play Now →',
}) {
    return (
        <Link href={href} className="block">
            <div
                className="prize-banner tap-scale"
                role="banner"
                aria-label={`Win ${amount} ${text}`}
            >
                {/* Trophy icon */}
                <span style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)', lineHeight: 1 }}>🏆</span>

                <div style={{ flex: 1 }}>
                    <span className="prize-text">Win up to </span>
                    <span className="prize-amount">{amount}</span>
                    <span className="prize-text"> {text}</span>
                </div>

                <span
                    style={{
                        flexShrink: 0,
                        padding: '6px 14px',
                        background: 'linear-gradient(90deg,#00f5ff,#bf00ff)',
                        borderRadius: 8,
                        fontFamily: "'Rajdhani', sans-serif",
                        fontWeight: 700,
                        fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
                        color: '#000',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {cta}
                </span>
            </div>
        </Link>
    );
}
