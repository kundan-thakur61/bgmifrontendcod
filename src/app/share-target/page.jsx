'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ShareTargetContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Processing shared content…');
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    async function handleShare() {
      const sharedUrl  = searchParams.get('url');
      const sharedText = searchParams.get('text');

      if (sharedUrl) {
        try {
          const target = new URL(sharedUrl);
          if (target.hostname.includes('battlexzone.com') || target.hostname === 'localhost') {
            setStatus(`Opening ${target.pathname}…`);
            setTimeout(() => router.push(target.pathname + target.search), 800);
            return;
          }
        } catch { /* not a valid URL */ }
        setStatus('Redirecting to matches…');
        setTimeout(() => router.push('/matches'), 800);
        return;
      }

      if (sharedText) {
        const encoded = encodeURIComponent(sharedText.slice(0, 500));
        setStatus('Opening support…');
        setTimeout(() => router.push(`/tickets?prefill=${encoded}`), 800);
        return;
      }

      setStatus('Redirecting to upload screenshot…');
      setTimeout(() => router.push('/disputes'), 1000);
    }

    handleShare();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-4 px-4">
      <div className="w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
      <p className="text-gray-300 text-sm">{status}</p>
      {preview && (
        <img
          src={preview}
          alt="Shared image preview"
          className="mt-4 w-48 h-48 object-cover rounded-xl border border-gray-700"
        />
      )}
    </div>
  );
}

// useSearchParams() requires a Suspense boundary for static generation
export default function ShareTargetPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
        </div>
      }
    >
      <ShareTargetContent />
    </Suspense>
  );
}
