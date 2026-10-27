'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import DetailModal from '@/components/DetailModal';
import Footer from '@/components/Footer';
import { MediaItem } from '@/lib/types';
import { Bookmark, Play, Trash2 } from 'lucide-react';

export default function MyListPage() {
  const [list, setList] = useState<MediaItem[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MediaItem | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('my_streaming_list');
      if (saved) {
        setList(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const handleClearList = () => {
    if (confirm('আপনি কি আপনার সম্পূর্ণ ওয়াচলিস্ট মুছে ফেলতে চান?')) {
      localStorage.removeItem('my_streaming_list');
      setList([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full space-y-8">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-amber-500" />
              <span>আমার ওয়াচলিস্ট (My Watchlist)</span>
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              আপনার পরবর্তীতে দেখার জন্য বুকমার্ক করা মুভি ও সিরিজসমূহ
            </p>
          </div>

          {list.length > 0 && (
            <button
              onClick={handleClearList}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-900/60 bg-red-950/40 text-red-400 hover:bg-red-900/60 text-xs font-semibold transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>মুছে ফেলুন</span>
            </button>
          )}
        </div>

        {list.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
              <Bookmark className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-zinc-300">ওয়াচলিস্টে এখনো কোনো মুভি যোগ করা হয়নি</h3>
            <p className="text-xs text-zinc-500 max-w-sm">
              পছন্দের সিনেমা বা সিরিজের উপর প্লাস (+) আইকনে ক্লিক করে সহজেই এখানে যোগ করুন।
            </p>
            <Link
              href="/"
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition"
            >
              সিনেমা এক্সপ্লোর করুন
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {list.map((m) => (
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
