'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, Plus, Check, Star } from 'lucide-react';
import { MediaItem } from '@/lib/types';
import { getImageUrl } from '@/lib/tmdb';

interface MovieCardProps {
  movie: MediaItem;
  onOpenDetails: (item: MediaItem) => void;
}

export default function MovieCard({ movie, onOpenDetails }: MovieCardProps) {
  const [inList, setInList] = useState(false);
  const [imgSrc, setImgSrc] = useState(getImageUrl(movie.poster_path, 'w500'));

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('my_streaming_list');
      if (saved) {
        const list: MediaItem[] = JSON.parse(saved);
        if (list.some((item) => item.id === movie.id)) {
          setInList(true);
        }
      }
    } catch (e) {}
  }, [movie.id]);

  const toggleMyList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved = localStorage.getItem('my_streaming_list');
      let list: MediaItem[] = saved ? JSON.parse(saved) : [];

      if (inList) {
        list = list.filter((item) => item.id !== movie.id);
        setInList(false);
      } else {
        list.push(movie);
        setInList(true);
      }
      localStorage.setItem('my_streaming_list', JSON.stringify(list));
    } catch (e) {}
  };

  const year = movie.release_date
    ? movie.release_date.split('-')[0]
    : movie.first_air_date
    ? movie.first_air_date.split('-')[0]
    : '2026';

  const isPreDvd =
    movie.quality?.toLowerCase().includes('pre-dvd') ||
    movie.quality?.toLowerCase().includes('hall');

  return (
    <div className="relative group shrink-0 w-36 sm:w-44 md:w-52 select-none cursor-pointer">
      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-zinc-900 border border-white/10 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-black/80 group-hover:border-white/25">
        <img
          src={imgSrc}
          alt={movie.title}
          onError={() => {
            setImgSrc(
              'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80'
            );
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Quality Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10 pointer-events-none">
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-md border ${
              isPreDvd
                ? 'bg-rose-950/80 text-rose-300 border-rose-500/40 shadow-sm'
                : 'bg-black/80 text-white/90 border-white/15'
            }`}
          >
            {movie.quality || '4K UHD'}
          </span>
          {movie.dubbing && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-black/70 backdrop-blur-md text-zinc-300 border border-white/10">
              {movie.dubbing}
            </span>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white flex items-center gap-1 border border-white/15 pointer-events-none">
          <Star className="w-2.5 h-2.5 fill-[#F5C518] text-[#F5C518]" />
          <span>{movie.vote_average ? movie.vote_average.toFixed(1) : '8.0'}</span>
        </div>

        {/* Luxury Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 z-20">
          <div className="flex items-center justify-between gap-2 mb-2">
            <Link
              href={`/watch/${movie.media_type || 'movie'}/${movie.id}`}
              className="w-9 h-9 rounded-full bg-[#E50914] text-white flex items-center justify-center hover:bg-red-700 transition shadow-lg shadow-red-600/40 active:scale-95"
              title="প্লে করুন"
            >
              <Play className="w-4 h-4 fill-white ml-0.5" />
            </Link>

            <button
              onClick={toggleMyList}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition backdrop-blur-md ${
                inList
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                  : 'border-white/20 bg-black/60 text-white hover:border-white hover:bg-black/90'
              }`}
              title={inList ? 'তালিকা থেকে সরান' : 'আমার তালিকায় যোগ করুন'}
            >
              {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>

          <h3
            onClick={() => onOpenDetails(movie)}
            className="text-xs font-bold text-white truncate hover:text-red-400 transition"
          >
            {movie.title}
          </h3>

          <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
            <span>{year}</span>
            <span>•</span>
            <span className="capitalize">{movie.media_type === 'tv' ? 'সিরিজ' : 'মুভি'}</span>
          </div>
        </div>
      </div>

      {/* Persistent Title Under Card */}
      <div className="mt-2 text-left">
        <h4 className="text-xs font-semibold text-white/90 truncate group-hover:text-red-400 transition">
          {movie.title}
        </h4>
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-0.5">
          <span>{year}</span>
          <span>•</span>
          <span className="uppercase text-zinc-400">{movie.original_language || 'EN'}</span>
        </div>
      </div>
    </div>
  );
}
