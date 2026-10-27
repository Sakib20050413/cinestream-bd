'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import DetailModal from '@/components/DetailModal';
import Footer from '@/components/Footer';
import { MediaItem } from '@/lib/types';
import { Tv } from 'lucide-react';

export default function TvShowsPage() {
  const [shows, setShows] = useState<MediaItem[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTvShows() {
      try {
        const [popRes, pakRes] = await Promise.all([
          fetch('/api/tv/popular', { cache: 'no-store' }).then((r) => r.json()),
          fetch('/api/tv/pakistani', { cache: 'no-store' }).then((r) => r.json()),
        ]);
        const combined: MediaItem[] = [];
        if (popRes.success) combined.push(...popRes.results);
        if (pakRes.success) combined.push(...pakRes.results);

        const unique = Array.from(new Map(combined.map((m) => [m.id, m])).values());
        setShows(unique);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadTvShows();
  }, []);

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full space-y-8">
        <div className="border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Tv className="w-8 h-8 text-blue-500" />
            <span>টিভি ও ওয়েব সিরিজ (TV & Web Series)</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            সিজন ও পর্ব নির্বাচন সুবিধা সহ সকল জনপ্রিয় নেটফ্লিক্স ও আন্তর্জাতিক ওয়েব সিরিজ
          </p>
        </div>

        {/* TV Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-zinc-800/60 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {shows.map((s) => (
              <MovieCard
                key={s.id}
                movie={s}
                onOpenDetails={(item) => setSelectedMovie(item)}
              />
            ))}
          </div>
        )}
      </main>

      <DetailModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />

      <Footer />
    </div>
  );
}
