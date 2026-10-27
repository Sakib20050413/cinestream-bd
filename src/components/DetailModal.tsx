'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Play, Plus, Check, Star, Clock, Globe } from 'lucide-react';
import { MediaItem } from '@/lib/types';
import { getImageUrl } from '@/lib/tmdb';
import { STREAM_SERVERS } from '@/lib/embedServers';

interface DetailModalProps {
  movie: MediaItem | null;
  onClose: () => void;
}

export default function DetailModal({ movie, onClose }: DetailModalProps) {
  const [inList, setInList] = useState(false);
  const [backdropSrc, setBackdropSrc] = useState('');

  useEffect(() => {
    if (!movie) return;
    setBackdropSrc(getImageUrl(movie.backdrop_path || movie.poster_path, 'w1280'));
    try {
      const saved = localStorage.getItem('my_streaming_list');
      if (saved) {
        const list: MediaItem[] = JSON.parse(saved);
        setInList(list.some((item) => item.id === movie.id));
      }
    } catch (e) {}

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movie, onClose]);

  if (!movie) return null;

  const toggleMyList = () => {
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
    : '2024';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#181818] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Backdrop Banner */}
        <div className="relative h-64 sm:h-80 w-full bg-black">
          <img
            src={backdropSrc}
            alt={movie.title}
            onError={() => {
              setBackdropSrc('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1280&q=80');
            }}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/30" />

          {/* Quick Actions at bottom of image */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3">
            <Link
              href={`/watch/${movie.media_type || 'movie'}/${movie.id}`}
              className="flex items-center gap-2 bg-[#E50914] hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-red-600/40 transition active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch Now</span>
            </Link>

            <button
              onClick={toggleMyList}
              className={`p-2.5 rounded-lg border flex items-center justify-center transition backdrop-blur-md ${
                inList
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                  : 'border-zinc-500 bg-black/60 text-white hover:border-white'
              }`}
            >
              {inList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-bold text-emerald-400">98% Match</span>
            <span className="text-zinc-400">{year}</span>
            <span className="px-1.5 py-0.5 rounded border border-zinc-700 text-zinc-300 font-semibold">
              {movie.quality || '4K UHD'}
            </span>
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {movie.vote_average?.toFixed(1) || '8.2'}
            </span>
            {movie.runtime && (
              <span className="flex items-center gap-1 text-zinc-400">
                <Clock className="w-3.5 h-3.5" />
                {movie.runtime} min
              </span>
            )}
            <span className="flex items-center gap-1 text-zinc-400 uppercase">
              <Globe className="w-3.5 h-3.5" />
              {movie.original_language}
            </span>
          </div>

          <h2 className="text-2xl font-black text-white">{movie.title}</h2>
          {movie.original_title && movie.original_title !== movie.title && (
            <p className="text-sm font-semibold text-red-400 -mt-2">
              {movie.original_title}
            </p>
          )}

          <p className="text-sm text-zinc-300 leading-relaxed">{movie.overview}</p>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs text-zinc-400 font-medium self-center mr-1">
                Genres:
              </span>
              {movie.genres.map((g) => (
                <span
                  key={g.id}
                  className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-xs"
                >
                  {g.name}
                </span>
              ))}
            </div>
          )}

          {/* Available Stream Engine Servers */}
          <div className="pt-3 border-t border-zinc-800">
            <span className="text-xs text-zinc-400 block mb-2 font-medium">
              Available Fast API Stream Servers:
            </span>
            <div className="flex flex-wrap gap-2">
              {STREAM_SERVERS.map((server) => (
                <span
                  key={server.id}
                  className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[11px] text-zinc-300 flex items-center gap-1.5"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${server.badgeColor}`} />
                  {server.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
