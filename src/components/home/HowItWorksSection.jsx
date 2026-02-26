const steps = [
    { step: '1', title: 'Sign Up', desc: 'Create your free account in seconds', color: 'cyan' },
    { step: '2', title: 'Add Funds', desc: 'Deposit money securely via UPI/Cards', color: 'purple' },
    { step: '3', title: 'Join Match', desc: 'Pick a match and receive room details', color: 'pink' },
    { step: '4', title: 'Win & Withdraw', desc: 'Win prizes and withdraw anytime', color: 'blue' },
];

export default function HowItWorksSection() {
    return (
        <section className="py-16 sm:py-24 px-3 sm:px-4 bg-black/40">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10 sm:mb-16">
                    <h2 className="hero-title text-3xl sm:text-5xl md:text-6xl mb-4 sm:mb-6">
                        <span className="text-white">HOW IT </span>
                        <span className="neon-text">WORKS</span>
                    </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                    {steps.map((item, index) => (
                        <div
                            key={item.step}
                            className="text-center"
                            style={{
                                animation: `fadeInUp 0.6s ease-out ${index * 0.15}s backwards`
                            }}
                        >
                            <div className={`step-indicator w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 rotate-45`}>
                                <span className="hero-title text-2xl sm:text-3xl font-black text-white -rotate-45">
                                    {item.step}
                                </span>
                            </div>
                            <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-3 text-white tracking-wide">
                                {item.title}
                            </h3>
                            <p className="text-xs sm:text-base text-gray-400 leading-relaxed font-light">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
