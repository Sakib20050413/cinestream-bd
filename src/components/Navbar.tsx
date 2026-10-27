'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Radio, Bookmark, Tv, Film, Play, X, Sparkles } from 'lucide-react';
import { MediaItem } from '@/lib/types';
import { getImageUrl } from '@/lib/tmdb';

export default function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.results.slice(0, 6));
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#141414]/95 backdrop-blur-md shadow-2xl py-3 border-b border-zinc-800/60'
          : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Nav Links */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-[#E50914] flex items-center justify-center font-black text-white text-xl tracking-tighter shadow-red-600/50 shadow-lg group-hover:scale-105 transition-transform">
              C
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-wider text-white drop-shadow-md">
                CINE<span className="text-[#E50914]">STREAM</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold -mt-1">
                PREMIUM CINEMA
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="text-white hover:text-[#E50914] transition-colors flex items-center gap-1.5"
            >
              হোম
            </Link>
            <Link
              href="/movies"
              className="text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Film className="w-4 h-4 text-[#E50914]" />
              মুভিজ
            </Link>
            <Link
              href="/tv"
              className="text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Tv className="w-4 h-4 text-blue-500" />
              টিভি সিরিজ
            </Link>
            <Link
              href="/bangla"
              className="text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold">
                BD
              </span>
              বাংলা সিনেমা
            </Link>
            <Link
              href="/live-tv"
              className="text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Radio className="w-4 h-4 text-[#E50914] animate-pulse" />
              লাইভ টিভি
            </Link>
            <Link
              href="/my-list"
              className="text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              আমার তালিকা
            </Link>
          </nav>
        </div>

        {/* Right Section: Search & Actions */}
        <div className="flex items-center space-x-4">
          {/* Live Search Input */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center bg-[#1f1f1f] border border-gray-700 rounded-full px-3 py-1.5 w-60 sm:w-72 transition-all shadow-inner">
                <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="মুভি বা সিরিজ খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="bg-transparent text-sm text-white placeholder-gray-400 outline-none w-full"
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="text-gray-400 hover:text-white ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Instant Search Dropdown */}
            {searchOpen && searchResults.length > 0 && (
              <div
                ref={searchDropdownRef}
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#181818] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-gray-800/60"
              >
                <div className="p-2 bg-black/50 text-xs text-gray-400 flex justify-between items-center px-4 border-b border-gray-800">
                  <span>অনুসন্ধান ফলাফল</span>
                  <span>{searchResults.length} টি পাওয়া গেছে</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/watch/${item.media_type || 'movie'}/${item.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-white/10 transition group"
                    >
                      <img
                        src={getImageUrl(item.poster_path, 'w500')}
                        alt={item.title}
                        className="w-12 h-16 object-cover rounded shadow"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white group-hover:text-red-400 truncate">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                          <span>
                            {item.release_date
                              ? item.release_date.split('-')[0]
                              : item.first_air_date
                              ? item.first_air_date.split('-')[0]
                              : '2024'}
                          </span>
                          <span>•</span>
                          <span className="text-amber-400 font-bold">
                            ★ {item.vote_average?.toFixed(1) || '8.0'}
                          </span>
                          <span className="px-1.5 py-0.2 bg-red-600/30 text-red-400 text-[10px] rounded uppercase font-semibold">
                            {item.media_type === 'tv' ? 'Series' : 'Movie'}
                          </span>
                        </div>
                      </div>
                      <Play className="w-4 h-4 text-gray-400 group-hover:text-red-500 shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Luxury VIP Status Pill (Replaced raw 6 API text) */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/60 text-[11px] font-bold text-red-300">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>4K STREAM VIP</span>
          </div>

          {/* Avatar Profile */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-xs font-bold text-white shadow-md cursor-pointer hover:ring-2 hover:ring-red-500 transition">
            BD
          </div>
        </div>
      </div>
    </header>
  );
}
