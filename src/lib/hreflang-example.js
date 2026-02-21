// Hreflang implementation for multilingual support
// Add this to your Next.js pages for international SEO

export const metadata = {
  alternates: {
    canonical: 'https://www.battlexzone.com/tournaments',
    languages: {
      'en-IN': 'https://www.battlexzone.com/en/tournaments',
      'hi-IN': 'https://www.battlexzone.com/hi/tournaments',
      'x-default': 'https://www.battlexzone.com/tournaments'
    }
  }
};

// Example usage in page component
export default function TournamentsPage() {
  return (
    <>
      {/* Page content */}
    </>
  );
}

// For dynamic routes
export async function generateMetadata({ params }) {
  const { locale, id } = params;
  
  return {
    alternates: {
      canonical: `https://www.battlexzone.com/${locale}/tournaments/${id}`,
      languages: {
        'en-IN': `https://www.battlexzone.com/en/tournaments/${id}`,
        'hi-IN': `https://www.battlexzone.com/hi/tournaments/${id}`,
        'x-default': `https://www.battlexzone.com/tournaments/${id}`
      }
    }
  };
}
