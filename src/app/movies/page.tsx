'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import DetailModal from '@/components/DetailModal';
import Footer from '@/components/Footer';
import { MediaItem } from '@/lib/types';
import { Film, Filter } from 'lucide-react';

export default function MoviesPage() {
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MediaItem | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovies() {
      try {
        const [trendRes, preDvdRes, nowRes, banglaRes, bolRes] = await Promise.all([
          fetch('/api/movies/trending', { cache: 'no-store' }).then((r) => r.json()),
          fetch('/api/movies/pre-dvd', { cache: 'no-store' }).then((r) => r.json()),
          fetch('/api/movies/now-playing', { cache: 'no-store' }).then((r) => r.json()),
          fetch('/api/movies/bangla', { cache: 'no-store' }).then((r) => r.json()),
          fetch('/api/movies/bollywood', { cache: 'no-store' }).then((r) => r.json()),
        ]);

        const combined: MediaItem[] = [];
        if (preDvdRes.success) combined.push(...preDvdRes.results);
        if (nowRes.success) combined.push(...nowRes.results);
        if (trendRes.success) combined.push(...trendRes.results.filter((m: any) => m.media_type !== 'tv'));
        if (banglaRes.success) combined.push(...banglaRes.results);
        if (bolRes.success) combined.push(...bolRes.results);

        // Deduplicate
        const unique = Array.from(new Map(combined.map((m) => [m.id, m])).values());
        setMovies(unique);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadMovies();
  }, []);

  const genres = [
    { id: 'all', name: 'All Movies (সকল মুভি)' },
    { id: 'action', name: 'Action & Thriller' },
    { id: 'sci-fi', name: 'Sci-Fi & Fantasy' },
    { id: 'drama', name: 'Drama & Crime' },
  ];

  const filteredMovies = movies.filter((m) => {
    if (selectedGenre === 'all') return true;
    if (selectedGenre === 'action') {
      return m.genres?.some((g) => g.name.toLowerCase().includes('action') || g.name.toLowerCase().includes('thriller'));
    }
    if (selectedGenre === 'sci-fi') {
      return m.genres?.some((g) => g.name.toLowerCase().includes('sci-fi') || g.name.toLowerCase().includes('adventure'));
    }
    if (selectedGenre === 'drama') {
      return m.genres?.some((g) => g.name.toLowerCase().includes('drama') || g.name.toLowerCase().includes('crime'));
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Film className="w-8 h-8 text-red-500" />
              <span>মুভি সংগ্রহ (Movies Catalog)</span>
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              হলিউড, বলিউড ও আন্তর্জাতিক সেরা ব্লকবাস্টার সিনেমা সরাসরি স্ট্রিম করুন
            </p>
          </div>

          {/* Genre Filters */}
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(g.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedGenre === g.id
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-zinc-800/60 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredMovies.map((m) => (
              <MovieCard
                key={m.id}
                movie={m}
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
