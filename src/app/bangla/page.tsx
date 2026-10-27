'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import DetailModal from '@/components/DetailModal';
import Footer from '@/components/Footer';
import { MediaItem } from '@/lib/types';
import { Film, Sparkles, Filter } from 'lucide-react';

export default function BanglaMoviesPage() {
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBangla() {
      try {
        const res = await fetch('/api/movies/bangla', { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
          setMovies(data.results);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadBangla();
  }, []);

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full space-y-8">
        {/* Header Header Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-950/80 via-zinc-900 to-black border border-emerald-900/50 p-6 sm:p-10 shadow-2xl">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dhallywood & Bangla Hall Hits</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              বাংলা সিনেমা ও হল রিলিজ
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed">
              তুফান, হাওয়া, সুড়ঙ্গ, পরাণ সহ বাংলাদেশের সাম্প্রতিক আলোড়ন সৃষ্টিকারী সব মুভি ও হল প্রিন্ট সরাসরি স্ট্রিম করুন কোনো বিজ্ঞাপন বা সাবস্ক্রিপশন ছাড়া।
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
            <Film className="w-4 h-4 text-emerald-400" />
            <span>মোট {movies.length} টি সিনেমা উপলব্ধ</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-emerald-900/50 text-emerald-300 border border-emerald-700/50 font-medium">
              সবগুলো (All)
            </span>
            <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer transition">
              Hall Hits
            </span>
            <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer transition">
              1080p HD
            </span>
          </div>
        </div>

        {/* Grid Display */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-zinc-800/60 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {movies.map((m) => (
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
