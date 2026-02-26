import Link from 'next/link';

export default function CTASection() {
    return (
        <section className="py-16 sm:py-24 px-3 sm:px-4 relative overflow-hidden">
            <div className="absolute inset-0 holographic" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />

            <div className="relative max-w-4xl mx-auto text-center">
                <h2 className="hero-title text-3xl sm:text-5xl md:text-6xl mb-4 sm:mb-6">
                    <span className="text-white">READY TO JOIN </span>
                    <span className="neon-text">BGMI TOURNAMENTS?</span>
                </h2>
                <p className="text-base sm:text-xl text-gray-300 mb-8 sm:mb-12 font-light px-2">
                    Join <span className="text-cyan-400 font-semibold">thousands of BGMI players</span> competing in daily scrims for real cash prizes
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-2">
                    <Link
                        href="/register"
                        className="cta-button w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white rounded-lg text-lg sm:text-xl font-bold shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 will-change-transform translate-z-0 text-center min-h-[48px]"
                        style={{ boxShadow: '0 0 40px rgba(168, 85, 247, 0.4)' }}
                        data-track="register"
                    >
                        Register for BGMI Tournament
                    </Link>
                    <Link
                        href="/tournaments"
                        className="cta-button w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 bg-transparent border-2 border-purple-400 text-purple-400 rounded-lg text-lg sm:text-xl font-bold hover:bg-purple-400/10 transition-all duration-300 hover:scale-105 will-change-transform translate-z-0 text-center min-h-[48px]"
                    >
                        Browse BGMI Daily Scrims
                    </Link>
                </div>
            </div>
        </section>
    );
}
