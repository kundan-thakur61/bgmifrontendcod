import Link from 'next/link';

const stats = [
    { value: '50K+', label: 'Active Players' },
    { value: '₹10L+', label: 'Monthly Prizes' },
    { value: '1000+', label: 'Daily Matches' },
    { value: '99.9%', label: 'Uptime' },
];

const particlePositions = [
    { left: '8%', delay: 0, duration: 12 },
    { left: '25%', delay: 2, duration: 14 },
    { left: '42%', delay: 1, duration: 11 },
    { left: '58%', delay: 3, duration: 13 },
    { left: '72%', delay: 4, duration: 12 },
    { left: '84%', delay: 5, duration: 15 },
];

export default function HeroSection() {
    return (
        <section className="relative pt-20 pb-12 sm:pt-32 sm:pb-24 px-3 sm:px-4 overflow-hidden">
            <div className="absolute inset-0 hidden md:block cyber-grid opacity-30" aria-hidden="true" />
            <div className="hidden lg:block scanline" aria-hidden="true" />

            <div className="hidden lg:block particle-bg" aria-hidden="true">
                {particlePositions.map((pos, index) => (
                    <div
                        key={`particle-${index}`}
                        className="particle"
                        style={{
                            left: pos.left,
                            animationDelay: `${pos.delay}s`,
                            animationDuration: `${pos.duration}s`,
                        }}
                    />
                ))}
            </div>

            <div className="hero-orb hero-orb--cyan" aria-hidden="true" />
            <div className="hero-orb hero-orb--purple" aria-hidden="true" />

            <div className="relative max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-black/60 backdrop-blur-xl rounded-full border border-cyan-500/30 mb-6 sm:mb-10 holographic">
                    <span className="w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full mr-2 sm:mr-3 live-indicator hero-live-dot" aria-hidden="true" />
                    <span className="text-xs sm:text-sm font-semibold text-cyan-300 tracking-wider uppercase">Live Matches Available Now</span>
                </div>

                <h1 className="hero-title text-3xl sm:text-5xl md:text-7xl lg:text-8xl mb-6 sm:mb-8">
                    <span className="block mb-1 sm:mb-2 text-white hero-title-line">
                        PLAY DAILY
                    </span>
                    <span className="block neon-text mb-1 sm:mb-2 hero-title-line hero-title-line-delay">
                        BGMI TOURNAMENTS
                    </span>
                    <span className="block text-white gradient-text hero-title-line hero-title-line-delay-lg">
                        & WIN REAL CASH
                    </span>
                </h1>

                <p className="text-base sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-12 font-light leading-relaxed px-2 hero-fade">
                    Join daily <span className="text-cyan-400 font-semibold">BGMI tournaments</span> and custom rooms on BattleXZone. <span className="text-purple-400">Compete with top players in India, showcase your skills, and win real cash prizes today!</span>
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 sm:mb-20 px-2 hero-fade hero-fade-delay">
                    <Link
                        href="/register"
                        className="cta-button w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-base sm:text-lg font-bold shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 text-center min-h-[48px]"
                        data-track="register"
                    >
                        Register & Play Now
                    </Link>
                    <Link
                        href="/how-it-works"
                        className="cta-button w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-transparent border-2 border-cyan-400 text-cyan-400 rounded-lg text-base sm:text-lg font-bold hover:bg-cyan-400/10 transition-all duration-300 hover:scale-105 text-center min-h-[48px]"
                    >
                        How It Works
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto px-2">
                    {stats.map((stat, index) => (
                        <div
                            key={stat.label}
                            className="stat-glow hero-fade"
                            style={{ animationDelay: `${1 + index * 0.1}s` }}
                        >
                            <div className="text-3xl sm:text-5xl md:text-6xl font-black hero-title neon-text mb-1 sm:mb-2">
                                {stat.value}
                            </div>
                            <div className="text-xs sm:text-sm md:text-base text-gray-400 uppercase tracking-wider sm:tracking-widest font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
