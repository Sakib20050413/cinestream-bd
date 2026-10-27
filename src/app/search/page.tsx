'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import DetailModal from '@/components/DetailModal';
import Footer from '@/components/Footer';
import { MediaItem } from '@/lib/types';
import { Search } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MediaItem | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      fetch('/api/movies/trending')
        .then((r) => r.json())
        .then((d) => {
          if (d.success) setResults(d.results);
        });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.results);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full space-y-8">
        <div className="border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Search className="w-8 h-8 text-red-500" />
            <span>মুভি ও সিরিজ অনুসন্ধান (Search Engine)</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            নাম, বছর বা ভাষা লিখে তাৎক্ষণিক যেকোনো সিনেমা বা টিভি সিরিজ খুঁজুন
          </p>

          {/* Search Box Input */}
          <div className="mt-4 relative max-w-xl">
            <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="মুভির নাম লিখুন (যেমন: Toofan, Deadpool, Stranger Things)..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition shadow-inner"
            />
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            {query.trim() ? `"${query}" এর জন্য ফলাফল:` : 'জনপ্রিয় সুপারিশসমূহ:'}
          </span>
          <span>{results.length} টি কনটেন্ট পাওয়া গেছে</span>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-zinc-800/60 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <p className="text-lg font-bold text-zinc-300">কোনো ফলাফল পাওয়া যায়নি</p>
            <p className="text-xs text-zinc-500">ভিন্ন কোনো ইংরেজি বা বাংলা কি-ওয়ার্ড দিয়ে আবার চেষ্টা করুন।</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {results.map((m) => (
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
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col justify-between">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center pt-28">
            <div className="text-zinc-500 text-sm">লোড হচ্ছে...</div>
          </div>
        }
      >
        <SearchContent />
      </Suspense>
      <Footer />
    </div>
  );
}
