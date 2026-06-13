'use client';

import { useState, useEffect } from 'react';
import { Navbar, Footer } from '@/components/layout';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function StreamingHub() {
  const { user } = useAuth();
  const [streamers, setStreamers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myYoutube, setMyYoutube] = useState('');
  const [myTwitch, setMyTwitch] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStreamers();
    if (user?.streaming) {
      setMyYoutube(user.streaming.youtube || '');
      setMyTwitch(user.streaming.twitch || '');
    }
  }, [user]);

  const loadStreamers = async () => {
    try {
      const data = await api.getStreamers({ limit: 12 });
      setStreamers(data.streamers || []);
    } catch (e) {
      console.error('Failed to load streamers');
    } finally {
      setLoading(false);
    }
  };

  const saveMyStreams = async () => {
    if (!user) return alert('Login required');
    setSaving(true);
    try {
      await api.updateStreaming({ youtube: myYoutube, twitch: myTwitch });
      alert('Stream links saved! They will appear in the hub and help with SEO.');
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // Simple embed helpers
  const getYoutubeEmbed = (url) => {
    if (!url) return null;
    const id = url.includes('watch?v=') ? url.split('watch?v=')[1] : url.split('/').pop();
    return `https://www.youtube.com/embed/${id}?autoplay=0`;
  };

  const getTwitchEmbed = (username) => {
    if (!username) return null;
    const clean = username.replace('https://www.twitch.tv/', '').replace('twitch.tv/', '');
    return `https://player.twitch.tv/?channel=${clean}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}`;
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 sm:pt-20 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black">Streaming Hub</h1>
              <p className="text-gray-400">Watch live BGMI tournaments &amp; creators • Add your stream for visibility</p>
            </div>
            <Link href="/profile" className="px-6 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl font-semibold text-sm">Manage in Profile</Link>
          </div>

          {/* Add / Edit your stream */}
          {user && (
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 mb-10">
              <h3 className="font-semibold mb-3">Link your stream (appears publicly + SEO)</h3>
              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                <input 
                  className="flex-1 bg-gray-800 rounded-xl px-4 py-3 text-sm" 
                  placeholder="YouTube channel URL or @handle" 
                  value={myYoutube} 
                  onChange={(e) => setMyYoutube(e.target.value)} 
                />
                <input 
                  className="flex-1 bg-gray-800 rounded-xl px-4 py-3 text-sm" 
                  placeholder="Twitch username" 
                  value={myTwitch} 
                  onChange={(e) => setMyTwitch(e.target.value)} 
                />
              </div>
              <button 
                onClick={saveMyStreams} 
                disabled={saving}
                className="px-8 py-3 bg-white text-black rounded-xl font-semibold disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Stream Links'}
              </button>
              <p className="text-[11px] text-gray-500 mt-2">Links help creators get discovered in search and the hub.</p>
            </div>
          )}

          {/* Live / Featured Streams */}
          <h2 className="font-bold text-xl mb-4 flex items-center gap-2">🔴 LIVE &amp; FEATURED STREAMERS</h2>
          {loading ? (
            <div className="text-gray-400">Loading streamers...</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {streamers.length === 0 && <div className="text-gray-400 col-span-2">No streamers yet. Be the first!</div>}
              {streamers.map((s, i) => {
                const ytEmbed = getYoutubeEmbed(s.youtube);
                const twEmbed = getTwitchEmbed(s.twitch);
                return (
                  <div key={i} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {s.name?.[0] || 'S'}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{s.name}</div>
                        <div className="text-xs text-gray-400">{s.level} • {s.wins || 0} wins</div>
                      </div>
                      {s.isLive && <span className="ml-auto text-red-400 text-xs font-bold">LIVE</span>}
                    </div>

                    {/* Embeds */}
                    {ytEmbed && (
                      <div className="aspect-video mb-2 rounded overflow-hidden bg-black">
                        <iframe src={ytEmbed} className="w-full h-full" allowFullScreen title="YouTube" />
                      </div>
                    )}
                    {twEmbed && !ytEmbed && (
                      <div className="aspect-video mb-2 rounded overflow-hidden bg-black">
                        <iframe src={twEmbed} className="w-full h-full" allowFullScreen title="Twitch" />
                      </div>
                    )}

                    <div className="flex gap-2 text-xs">
                      {s.youtube && <a href={s.youtube} target="_blank" className="text-red-400 hover:underline">YouTube →</a>}
                      {s.twitch && <a href={`https://twitch.tv/${s.twitch.replace('twitch.tv/', '')}`} target="_blank" className="text-purple-400 hover:underline">Twitch →</a>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Watch Live Tournaments */}
          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 mb-8">
            <h3 className="font-semibold mb-3">Watch Live Tournaments</h3>
            <p className="text-sm text-gray-400 mb-4">Many tournaments have official streams. Check match/tournament detail pages for embedded streams when available.</p>
            <Link href="/tournaments" className="inline-block px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-sm font-semibold">Browse Tournaments</Link>
          </div>

          <p className="text-center text-xs text-gray-500">Streams help with SEO and community growth. Add yours in Profile → Streaming.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
