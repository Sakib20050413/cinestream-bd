'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import MovieRow from '@/components/MovieRow';
import DetailModal from '@/components/DetailModal';
import Footer from '@/components/Footer';
import { MediaItem } from '@/lib/types';
import { Flame, Tv, Star, Film, Clapperboard, Sparkles, Heart, Ticket, Radio } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [preDvdMovies, setPreDvdMovies] = useState<MediaItem[]>([]);
  const [nowPlaying, setNowPlaying] = useState<MediaItem[]>([]);
  const [banglaMovies, setBanglaMovies] = useState<MediaItem[]>([]);
  const [bollywoodMovies, setBollywoodMovies] = useState<MediaItem[]>([]);
  const [southMovies, setSouthMovies] = useState<MediaItem[]>([]);
  const [pakistaniDramas, setPakistaniDramas] = useState<MediaItem[]>([]);
  const [popularTv, setPopularTv] = useState<MediaItem[]>([]);
  const [topRated, setTopRated] = useState<MediaItem[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<MediaItem | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    async function loadData() {
      try {
        const [
          resTrend,
          resPreDvd,
          resNow,
          resBangla,
          resBol,
          resSouth,
          resPak,
          resTv,
          resTop,
        ] = await Promise.all([
          fetch('/api/movies/trending', { cache: 'no-store' }).then((r) => r.json()),
          fetch('/api/movies/pre-dvd', { cache: 'no-store' }).then((r) => r.json()),
          fetch('/api/movies/now-playing', { cache: 'no-store' }).then((r) => r.json()),
          fetch('/api/movies/bangla', { cache: 'no-store' }).then((r) => r.json()),
          fetch('/api/movies/bollywood', { cache: 'no-store' }).then((r) => r.json()),
          fetch('/api/movies/south', { cache: 'no-store' }).then((r) => r.json()),
          fetch('/api/tv/pakistani', { cache: 'no-store' }).then((r) => r.json()),
          fetch('/api/tv/popular', { cache: 'no-store' }).then((r) => r.json()),
          fetch('/api/movies/top-rated', { cache: 'no-store' }).then((r) => r.json()),
        ]);

        if (resTrend.success) setTrending(resTrend.results);
        if (resPreDvd.success) setPreDvdMovies(resPreDvd.results);
        if (resNow.success) setNowPlaying(resNow.results);
        if (resBangla.success) setBanglaMovies(resBangla.results);
        if (resBol.success) setBollywoodMovies(resBol.results);
        if (resSouth.success) setSouthMovies(resSouth.results);
        if (resPak.success) setPakistaniDramas(resPak.results);
        if (resTv.success) setPopularTv(resTv.results);
        if (resTop.success) setTopRated(resTop.results);

        if (resTrend.success && resTrend.results.length > 0) {
          setFeaturedMovie(resTrend.results[0]);
        }
      } catch (err) {
        console.error('Failed to load catalog data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* Hero Billboard Banner */}
        {loading ? (
          <div className="w-full h-[75vh] bg-zinc-900 animate-pulse flex items-center justify-center">
            <span className="text-zinc-500 font-medium">লোড হচ্ছে...</span>
          </div>
        ) : (
          <HeroBanner
            movie={featuredMovie}
            onOpenDetails={(item) => setSelectedMovie(item)}
          />
        )}

        {/* Quick Filter Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-30 mb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
              }`}
            >
              🔥 সকল কন্টেন্ট (All)
            </button>
            <button
              onClick={() => setActiveFilter('predvd')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                activeFilter === 'predvd'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
              }`}
            >
              <Ticket className="w-3.5 h-3.5 text-rose-400" />
              <span>🎟️ প্রি-ডিভিডি ও হল প্রিন্ট</span>
            </button>
            <button
              onClick={() => setActiveFilter('bangla')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                activeFilter === 'bangla'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
              }`}
            >
              <span>🇧🇩 বাংলা সিনেমা ও ঢালিউড</span>
            </button>
            <button
              onClick={() => setActiveFilter('bollywood')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                activeFilter === 'bollywood'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
              }`}
            >
              <span>🇮🇳 বলিউড ও ডাবিং</span>
            </button>
            <button
              onClick={() => setActiveFilter('series')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                activeFilter === 'series'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
              }`}
            >
              <span>📺 টিভি ও ওয়েব সিরিজ</span>
            </button>
            <Link
              href="/live-tv"
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-zinc-900/90 border border-zinc-800 text-red-400 hover:text-red-300 hover:border-red-500/50 flex items-center gap-1.5 transition whitespace-nowrap"
            >
              <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>📡 লাইভ টিভি (Live TV)</span>
            </Link>
          </div>
        </div>

        {/* Carousel Rows Container */}
        <div className="relative z-20 space-y-6 pb-16">
          {/* Trending Today */}
          {(activeFilter === 'all' || activeFilter === 'trending') && (
            <MovieRow
              title="🔥 Trending Today (আজকের সেরা ট্রেন্ডিং)"
              subtitle="দৈনিক অটো-আপডেট হওয়া বিশ্বসেরা মুভি ও সিরিজ"
              icon={<Flame className="w-5 h-5 text-red-500" />}
              movies={trending}
              onOpenDetails={(item) => setSelectedMovie(item)}
            />
          )}

          {/* Pre-DVD & Early Hall Releases (Movielinkbd & Cinefreak Style) */}
          {(activeFilter === 'all' || activeFilter === 'predvd') && (
            <MovieRow
              title="🎟️ Pre-DVD & Hall Prints (সদ্য রিলিজ হওয়া হল প্রিন্ট ও প্রি-ডিভিডি)"
              subtitle="Cinefreak ও Movielinkbd স্টাইল লেটেস্ট হল প্রিন্ট, HQ-CAM ও প্রি-ডিভিডি রিলিজ"
              icon={<Ticket className="w-5 h-5 text-rose-500" />}
              movies={preDvdMovies.length > 0 ? preDvdMovies : nowPlaying}
              onOpenDetails={(item) => setSelectedMovie(item)}
            />
          )}

          {/* Now Playing / In Theaters */}
          {(activeFilter === 'all' || activeFilter === 'nowplaying') && (
            <MovieRow
              title="🍿 Now in Theaters (সদ্য মুক্তিপ্রাপ্ত সিনেমা ও হল রিলিজ)"
              subtitle="সিনেমা হলে চলমান ও সদ্য রিলিজ হওয়া লেটেস্ট প্রিন্ট"
              icon={<Clapperboard className="w-5 h-5 text-amber-500" />}
              movies={nowPlaying}
              onOpenDetails={(item) => setSelectedMovie(item)}
            />
          )}

          {/* Bengali & Hall Cinema */}
          {(activeFilter === 'all' || activeFilter === 'bangla') && (
            <MovieRow
              title="🇧🇩 বাংলা সিনেমা ও Hall Hits (ঢালিউড স্পেশাল)"
              subtitle="তুফান, হাওয়া, সুড়ঙ্গ, প্রিয়তমা সহ সেরা বাংলাদেশি সিনেমা"
              icon={<Film className="w-5 h-5 text-emerald-400" />}
              movies={banglaMovies}
              onOpenDetails={(item) => setSelectedMovie(item)}
            />
          )}

          {/* Bollywood & Hindi */}
          {(activeFilter === 'all' || activeFilter === 'bollywood') && (
            <MovieRow
              title="🇮🇳 বলিউড ও হিন্দি সিনেমা (Bollywood Hits)"
              subtitle="শাহরুখ, সালমান ও বলিউড সেরা ব্লকবাস্টার"
              icon={<Sparkles className="w-5 h-5 text-orange-400" />}
              movies={bollywoodMovies}
              onOpenDetails={(item) => setSelectedMovie(item)}
            />
          )}

          {/* South Indian Hindi Dubbed */}
          {(activeFilter === 'all' || activeFilter === 'bollywood') && (
            <MovieRow
              title="⚡ South Indian Hindi Dubbed (সাউথ ইন্ডিয়ান ডাবিং)"
              subtitle="তামিল, তেলেগু ও কন্নড় সিনেমার হাই-অ্যাকশন হিন্দি ভার্সন"
              icon={<Flame className="w-5 h-5 text-yellow-400" />}
              movies={southMovies}
              onOpenDetails={(item) => setSelectedMovie(item)}
            />
          )}

          {/* TV & Web Series */}
          {(activeFilter === 'all' || activeFilter === 'series') && (
            <MovieRow
              title="📺 Popular TV & Web Series"
              subtitle="সিজন ও পর্ব ভিত্তিক নেটফ্লিক্স ও এইচবিও সিরিজ"
              icon={<Tv className="w-5 h-5 text-blue-400" />}
              movies={popularTv}
              onOpenDetails={(item) => setSelectedMovie(item)}
            />
          )}

          {/* Pakistani Drama Series */}
          {(activeFilter === 'all' || activeFilter === 'series') && (
            <MovieRow
              title="🇵🇰 Pakistani Hit Dramas (জনপ্রিয় পাকিস্তানি নাটক)"
              subtitle="তেরে বিন, কাভি ম্যায় কাভি তুম ও শীর্ষ রোমান্টিক ড্রামা"
              icon={<Heart className="w-5 h-5 text-emerald-400" />}
              movies={pakistaniDramas}
              onOpenDetails={(item) => setSelectedMovie(item)}
            />
          )}

          {/* Top Rated Masterpieces */}
          {activeFilter === 'all' && (
            <MovieRow
              title="⭐ All-Time Masterpieces (আইএমডিবি টপ রেটেড)"
              subtitle="সর্বকালের সেরা আইকনিক সিনেমা কালেকশন"
              icon={<Star className="w-5 h-5 text-yellow-500" />}
              movies={topRated}
              onOpenDetails={(item) => setSelectedMovie(item)}
            />
          )}
        </div>
      </main>

      {/* Quick Details Modal */}
      {selectedMovie && (
        <DetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      <Footer />
    </div>
  );
}
