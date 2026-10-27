'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Info, Star } from 'lucide-react';
import { MediaItem } from '@/lib/types';
import { getImageUrl } from '@/lib/tmdb';

interface HeroBannerProps {
  movie: MediaItem | null;
  onOpenDetails: (item: MediaItem) => void;
}

export default function HeroBanner({ movie, onOpenDetails }: HeroBannerProps) {
  if (!movie) return null;

  const year = movie.release_date
    ? movie.release_date.split('-')[0]
    : movie.first_air_date
    ? movie.first_air_date.split('-')[0]
    : '2024';

  const backdropSrc = getImageUrl(movie.backdrop_path || movie.poster_path, 'w1280');

  return (
    <div className="relative w-full h-[70vh] sm:h-[80vh] md:h-[85vh] bg-[#141414] overflow-hidden select-none">
      {/* Background Image with Fallback */}
      <div className="absolute inset-0">
        <img
          src={backdropSrc}
          alt={movie.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1280&q=80';
          }}
          className="w-full h-full object-cover object-top opacity-80"
        />
        {/* Cinema Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/70 to-transparent w-full md:w-3/4" />
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/90 to-transparent" />
      </div>

      {/* Banner Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-20 md:pb-24">
        <div className="max-w-2xl space-y-3 sm:space-y-4">
          {/* Quality & Meta Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#E50914] text-white text-xs font-bold uppercase tracking-wider shadow">
              {movie.original_language === 'bn' ? 'বাংলা হিট' : 'SPOTLIGHT'}
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {movie.vote_average?.toFixed(1) || '8.2'} IMDb
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs font-medium">
              {year}
            </span>
            <span className="px-2 py-0.5 rounded border border-zinc-600 text-zinc-300 text-xs font-semibold">
              {movie.quality || '4K UHD'}
            </span>
            {movie.dubbing && (
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 text-xs font-medium">
                {movie.dubbing}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-xl line-clamp-2">
            {movie.title}
          </h1>

          {/* Bengali Subtitle or Original Title */}
          {movie.original_title && movie.original_title !== movie.title && (
            <p className="text-base sm:text-lg text-red-400 font-semibold drop-shadow -mt-2">
              {movie.original_title}
            </p>
          )}

          {/* Synopsis */}
          <p className="text-xs sm:text-sm md:text-base text-gray-300 font-normal line-clamp-3 leading-relaxed drop-shadow max-w-xl">
            {movie.overview}
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 sm:gap-4 pt-2">
            <Link
              href={`/watch/${movie.media_type || 'movie'}/${movie.id}`}
              className="flex items-center gap-2 bg-[#E50914] hover:bg-red-700 text-white font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg shadow-xl shadow-red-600/30 transition-transform active:scale-95 text-sm sm:text-base"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
              <span>Watch Now</span>
            </Link>

            <button
              onClick={() => onOpenDetails(movie)}
              className="flex items-center gap-2 bg-zinc-800/80 hover:bg-zinc-700 text-white font-semibold px-5 sm:px-7 py-2.5 sm:py-3 rounded-lg backdrop-blur-md border border-zinc-600/60 transition active:scale-95 text-sm sm:text-base"
            >
              <Info className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
