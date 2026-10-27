'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LiveTvPlayer from '@/components/LiveTvPlayer';
import { LIVE_TV_CHANNELS, LiveTvChannel } from '@/lib/iptv';
import { Radio, Search, Tv } from 'lucide-react';

function ChannelLogo({ logo, name }: { logo: string; name: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !logo) {
    const initials = name
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .split(' ')
      .map((w) => w[0])
      .slice(0, 3)
      .join('')
      .toUpperCase() || 'TV';

    return (
      <div className="w-full h-full rounded flex flex-col items-center justify-center bg-gradient-to-br from-red-600/40 via-zinc-900 to-black text-white p-1 text-center select-none">
        <span className="font-black text-[11px] tracking-wider text-red-400">{initials}</span>
        <span className="text-[8px] text-zinc-400 font-semibold uppercase leading-none mt-0.5">HD LIVE</span>
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt={name}
      onError={() => setHasError(true)}
      className="max-w-full max-h-full object-contain filter drop-shadow"
      loading="lazy"
    />
  );
}

export default function LiveTvPage() {
  const [channels] = useState<LiveTvChannel[]>(LIVE_TV_CHANNELS);
  const [selectedChannel, setSelectedChannel] = useState<LiveTvChannel>(LIVE_TV_CHANNELS[0]);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const countries = [
    { code: 'all', name: 'All Countries (সকল দেশ)' },
    { code: 'BD', name: '🇧🇩 Bangladesh' },
    { code: 'IN', name: '🇮🇳 India' },
    { code: 'GLOBAL', name: '🌐 Global Sports' },
    { code: 'US', name: '🇺🇸 United States' },
    { code: 'UK', name: '🇬🇧 United Kingdom' },
    { code: 'PK', name: '🇵🇰 Pakistan' },
  ];

  const categories = ['all', 'Sports', 'News', 'Entertainment', 'Movies', 'Kids', 'Music'];

  const filteredChannels = channels.filter((c) => {
    if (selectedCountry !== 'all' && c.countryCode.toLowerCase() !== selectedCountry.toLowerCase()) {
      return false;
    }
    if (selectedCategory !== 'all' && c.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full space-y-6">
        {/* Live TV Hero Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-500">
                IPTV Global Live Hub (১৯৫+ দেশ)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <Radio className="w-7 h-7 text-red-500" />
              <span>লাইভ টিভি স্যাটেলাইট চ্যানেল (Live World TV)</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              বাংলাদেশ, ভারত, ইউএসএ, ইউকে ও আন্তর্জাতিক ৮,০০০+ ফ্রি-টু-এয়ার চ্যানেল সরাসরি ব্রাউজারে উপভোগ করুন
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="চ্যানেলের নাম লিখুন (যেমন: Somoy, T Sports, BTV)..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition"
            />
          </div>
        </div>

        {/* Live Player Screen */}
        <div className="space-y-3">
          <LiveTvPlayer channel={selectedChannel} />

          {/* Selected Channel Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-black/60 p-1.5 flex items-center justify-center border border-zinc-700/80 shrink-0">
                <ChannelLogo logo={selectedChannel.logo} name={selectedChannel.name} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{selectedChannel.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-red-600 text-white font-black uppercase tracking-wider animate-pulse">
                    LIVE
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {selectedChannel.country} • {selectedChannel.category} •{' '}
                  <span className="text-emerald-400 font-semibold">{selectedChannel.quality}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">
                মোট <strong>{filteredChannels.length}</strong> টি চ্যানেল তালিকাভুক্ত
              </span>
            </div>
          </div>
        </div>

        {/* Filter Bar: Countries & Categories */}
        <div className="space-y-3 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
          {/* Countries */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {countries.map((c) => (
              <button
                key={c.code}
                onClick={() => setSelectedCountry(c.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedCountry === c.code
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs font-medium capitalize whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-zinc-100 text-black font-bold'
                    : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'সকল ক্যাটাগরি' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredChannels.map((c) => {
            const isCurrent = c.id === selectedChannel.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedChannel(c);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className={`flex flex-col items-center p-3.5 rounded-xl border text-center transition-all duration-200 group ${
                  isCurrent
                    ? 'border-red-500 bg-red-950/40 text-white ring-1 ring-red-500/60 shadow-lg scale-102'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/80 hover:scale-102'
                }`}
              >
                <div className="w-14 h-14 rounded-lg bg-black/60 p-1.5 flex items-center justify-center mb-2.5 border border-zinc-800 group-hover:border-zinc-600 transition">
                  <ChannelLogo logo={c.logo} name={c.name} />
                </div>
                <h4 className="text-xs font-bold text-white truncate w-full group-hover:text-red-400">
                  {c.name}
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-1">
                  <span>{c.country}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">{c.quality.split(' ')[0]}</span>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
