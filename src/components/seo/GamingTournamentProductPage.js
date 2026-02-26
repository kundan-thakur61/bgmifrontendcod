'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

/**
 * Advanced SEO-Optimized Product Page for Gaming Tournaments
 * Specialized for Google Search Generative Experience (SGE) & NLP
 */
export default function GamingTournamentProductPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Product data with SEO-optimized content
  const productData = {
    name: "Premium BGMI & Free Fire Tournament Platform - Win Real Cash Prizes",
    description: "Join India's #1 competitive gaming platform for BGMI, Free Fire, and PUBG tournaments. Compete in professional esports events, win real money prizes up to ₹1,00,000, and showcase your gaming skills. Features secure room credentials, instant prize distribution, and 24/7 customer support. Perfect for both casual gamers and professional esports athletes.",
    brand: "BattleZone Gaming",
    category: "Gaming Platform",
    subCategory: "Esports Tournaments",
    price: "0", // Free to join
    priceCurrency: "INR",
    availability: "InStock",
    condition: "New",
    ratingValue: "4.8",
    reviewCount: "2847",
    sku: "BZ-GAMING-001",
    mpn: "BGMI-FF-TOURNAMENT-PLATFORM",
    
    // Rich features for SGE optimization
    features: [
      "Real cash prizes up to ₹1,00,000 per tournament",
      "Secure room credentials with anti-cheat protection",
      "Instant prize distribution within 24 hours",
      "24/7 customer support with dedicated gaming experts",
      "Mobile-optimized platform for seamless gameplay",
      "Multiple game modes: Squad, Duo, Solo tournaments",
      "Level-based matchmaking for fair competition",
      "Integrated wallet system with UPI & bank transfers",
      "Live leaderboard and performance analytics",
      "Community chat and team formation tools"
    ],
    
    // Specifications addressing user intents
    specifications: {
      compatibility: "Android 7.0+, iOS 12.0+, Windows 10+, macOS 10.14+",
      languages: "English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati",
      paymentMethods: "UPI, Paytm, PhonePe, Google Pay, Bank Transfer, Credit/Debit Cards",
      support: "24/7 Live Chat, Email Support, Phone Support",
      security: "SSL Encryption, Two-Factor Authentication, Secure Room Credentials"
    }
  };

  // FAQ Schema data addressing common user intents
  const faqData = [
    {
      question: "How do I join BGMI tournaments and win real money?",
      answer: "Register on our platform, verify your account, deposit minimum ₹50 in your wallet, browse active tournaments, select your preferred match, and join with required entry fee. Winners receive real cash prizes instantly credited to their verified wallet."
    },
    {
      question: "Are Free Fire tournaments safe and legitimate?",
      answer: "Yes, our platform is 100% legitimate with proper company registration. We use secure room credentials, have anti-cheat systems, and provide instant prize distribution. All transactions are protected with SSL encryption and banking-grade security."
    },
    {
      question: "What is the minimum level required to join tournaments?",
      answer: "Most tournaments require minimum level 30 for BGMI and level 25 for Free Fire. Premium tournaments may have higher level requirements. Check specific tournament details before joining."
    },
    {
      question: "How quickly do winners receive their prize money?",
      answer: "Winners receive their prize money within 24 hours of match completion. Our automated system processes results instantly, and funds are credited directly to your verified wallet account."
    },
    {
      question: "What payment methods are available for deposits?",
      answer: "We support all major Indian payment methods including UPI (Paytm, PhonePe, Google Pay), bank transfers, credit/debit cards, and digital wallets. All transactions are secure with instant processing."
    },
    {
      question: "Can I play on mobile devices?",
      answer: "Yes, our platform is fully optimized for mobile devices. You can join tournaments, manage your profile, and track performance directly from your smartphone or tablet running Android or iOS."
    }
  ];

  // JSON-LD Schema Markup
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productData.name,
    "description": productData.description,
    "brand": {
      "@type": "Brand",
      "name": productData.brand
    },
    "category": productData.category,
    "productID": productData.sku,
    "sku": productData.sku,
    "mpn": productData.mpn,
    "offers": {
      "@type": "Offer",
      "price": productData.price,
      "priceCurrency": productData.priceCurrency,
      "availability": `https://schema.org/${productData.availability}`,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "url": "https://yourdomain.com/tournaments",
      "seller": {
        "@type": "Organization",
        "name": productData.brand,
        "url": "https://yourdomain.com"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": productData.ratingValue,
      "reviewCount": productData.reviewCount,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Rajesh Kumar"
        },
        "datePublished": "2024-02-15",
        "reviewBody": "Won ₹25,000 in my first BGMI tournament! Platform is super smooth and payments are instant. Highly recommended for serious gamers.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Priya Sharma"
        },
        "datePublished": "2024-02-10",
        "reviewBody": "As a Free Fire player, this platform changed my gaming experience. Fair matches, quick payouts, and excellent customer support.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      }
    ],
    "feature": productData.features,
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Minimum Level Requirement",
        "value": "Level 30 (BGMI), Level 25 (Free Fire)"
      },
      {
        "@type": "PropertyValue",
        "name": "Prize Distribution Time",
        "value": "Within 24 hours"
      },
      {
        "@type": "PropertyValue",
        "name": "Supported Games",
        "value": "BGMI, Free Fire, PUBG Mobile"
      },
      {
        "@type": "PropertyValue",
        "name": "Payment Methods",
        "value": "UPI, Paytm, PhonePe, Bank Transfer"
      },
      {
        "@type": "PropertyValue",
        "name": "Customer Support",
        "value": "24/7 Live Chat & Phone"
      }
    ]
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://yourdomain.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tournaments",
        "item": "https://yourdomain.com/tournaments"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "BGMI & Free Fire Tournaments",
        "item": "https://yourdomain.com/tournaments/gaming"
      }
    ]
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{productData.name}</title>
        <meta name="description" content={productData.description} />
        <meta name="keywords" content="BGMI tournaments, Free Fire tournaments, PUBG tournaments, win money gaming, esports India, online gaming tournaments, real cash prizes, competitive gaming" />
        
        {/* Open Graph */}
        <meta property="og:title" content={productData.name} />
        <meta property="og:description" content={productData.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/tournaments/gaming" />
        <meta property="og:image" content="https://yourdomain.com/images/gaming-tournament-og.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={productData.name} />
        <meta name="twitter:description" content={productData.description} />
        <meta name="twitter:image" content="https://yourdomain.com/images/gaming-tournament-twitter.jpg" />
        
        {/* Canonical */}
        <link rel="canonical" href="https://yourdomain.com/tournaments/gaming" />
        
        {/* JSON-LD Schemas */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLdSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {productData.name}
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {productData.description}
            </p>
            
            {/* Rating Display */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center bg-gray-800/50 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-700">
                <div className="flex text-yellow-400 mr-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  ))}
                </div>
                <div className="text-white">
                  <span className="text-2xl font-bold">{productData.ratingValue}</span>
                  <span className="text-gray-400">/5</span>
                  <span className="text-gray-400 ml-2">({productData.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                Join Free Tournament
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 border border-gray-600">
                Watch Demo Video
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Why Choose Our Gaming Platform?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productData.features.map((feature, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-white mb-2">{feature}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Platform Specifications
            </h2>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Technical Specs</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-3">•</span>
                      <span className="text-gray-300">Compatibility: {productData.specifications.compatibility}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-3">•</span>
                      <span className="text-gray-300">Languages: {productData.specifications.languages}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-3">•</span>
                      <span className="text-gray-300">Security: {productData.specifications.security}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Payment & Support</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-3">•</span>
                      <span className="text-gray-300">Payment Methods: {productData.specifications.paymentMethods}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-3">•</span>
                      <span className="text-gray-300">Support: {productData.specifications.support}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-3">•</span>
                      <span className="text-gray-300">24/7 Gaming Experts Available</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                  <button className="w-full text-left p-6 focus:outline-none">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                      <svg className="w-5 h-5 text-gray-400 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </button>
                  <div className="px-6 pb-6">
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Trusted by Thousands of Gamers
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="text-3xl font-bold text-green-400 mb-2">50,000+</div>
                <div className="text-gray-400">Active Players</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="text-3xl font-bold text-green-400 mb-2">₹2 Crores+</div>
                <div className="text-gray-400">Prize Money Distributed</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="text-3xl font-bold text-green-400 mb-2">1000+</div>
                <div className="text-gray-400">Tournaments Monthly</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
                <div className="text-gray-400">Customer Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}