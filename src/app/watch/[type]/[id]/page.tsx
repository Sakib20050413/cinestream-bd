'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Star, Clock, Globe, Film, Bookmark, Check, Plus, Share2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import VideoPlayer from '@/components/VideoPlayer';
import MovieRow from '@/components/MovieRow';
import DetailModal from '@/components/DetailModal';
import Footer from '@/components/Footer';
import { MediaItem } from '@/lib/types';

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const type = (params?.type as 'movie' | 'tv') || 'movie';
  const id = params?.id as string;

  const [movie, setMovie] = useState<MediaItem | null>(null);
  const [similarMovies, setSimilarMovies] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [inList, setInList] = useState(false);
  const [selectedModalMovie, setSelectedModalMovie] = useState<MediaItem | null>(null);

  useEffect(() => {
    async function loadMovieDetails() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/details/${type}/${id}`);
        const data = await res.json();
        if (data.success) {
          setMovie(data.details);
        }

        // Fetch recommendations / trending
        const trendRes = await fetch('/api/movies/trending');
        const trendData = await trendRes.json();
        if (trendData.success) {
          setSimilarMovies(trendData.results.filter((m: MediaItem) => String(m.id) !== String(id)));
        }
      } catch (err) {
        console.error('Error fetching watch details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadMovieDetails();
  }, [type, id]);

  useEffect(() => {
    if (!movie) return;
    try {
      const saved = localStorage.getItem('my_streaming_list');
      if (saved) {
        const list: MediaItem[] = JSON.parse(saved);
        setInList(list.some((item) => item.id === movie.id));
      }
    } catch (e) {}
  }, [movie]);

  const toggleMyList = () => {
    if (!movie) return;
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie?.title || 'Watch Free Cinema',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('স্ট্রিমিং লিঙ্ক কপি করা হয়েছে!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-24">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-zinc-400">স্ট্রিমিং প্লেয়ার লোড হচ্ছে...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center pt-24 text-center px-4">
          <h2 className="text-2xl font-bold mb-2">ভিডিও খুঁজে পাওয়া যায়নি</h2>
          <p className="text-sm text-zinc-400 mb-6">অনুরোধকৃত মুভি বা সিরিজটির স্ট্রিম পাওয়া যায়নি।</p>
          <Link
            href="/"
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
          >
            হোমে ফিরে যান
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const year = movie.release_date
    ? movie.release_date.split('-')[0]
    : movie.first_air_date
    ? movie.first_air_date.split('-')[0]
    : '2024';

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 hover:text-white transition group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>ফিরে যান (Back)</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="capitalize">{movie.media_type === 'tv' ? 'TV Series' : 'Movie'}</span>
            <span>/</span>
            <span className="text-white font-medium truncate max-w-xs">{movie.title}</span>
          </div>
        </div>

        {/* Video Player Section */}
        <VideoPlayer movie={movie} />

        {/* Media Information Section */}
        <div className="bg-[#181818] border border-zinc-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded bg-red-600 text-white text-xs font-bold uppercase">
                  {movie.quality || '4K UHD'}
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs font-medium">
                  {year}
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {movie.vote_average?.toFixed(1) || '8.2'}
                </span>
                {movie.dubbing && (
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 text-xs font-medium">
                    {movie.dubbing}
                  </span>
                )}
                {movie.runtime && (
                  <span className="flex items-center gap-1 text-zinc-400 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    {movie.runtime} min
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white">{movie.title}</h1>
              {movie.original_title && movie.original_title !== movie.title && (
                <p className="text-base font-semibold text-red-400 mt-0.5">
                  {movie.original_title}
                </p>
              )}
            </div>

            {/* Action Buttons: Bookmark & Share */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMyList}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold transition ${
                  inList
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                    : 'border-zinc-700 bg-zinc-800/80 text-white hover:border-zinc-500'
                }`}
              >
                {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{inList ? 'Added to List' : 'Add to List'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-lg border border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:text-white hover:border-zinc-500 transition"
                title="Share Link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-2">গল্প সংক্ষেপ (Storyline)</h3>
            <p className="text-sm text-zinc-300 leading-relaxed max-w-4xl">
              {movie.overview}
            </p>
          </div>

          {/* Genres & Tags */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-zinc-400 font-medium">Genres:</span>
              {movie.genres.map((g) => (
                <span
                  key={g.id}
                  className="px-2.5 py-0.5 rounded-md bg-zinc-800/90 text-zinc-300 text-xs border border-zinc-700/60"
                >
                  {g.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Similar / Recommended Row */}
        {similarMovies.length > 0 && (
          <div className="pt-4">
            <MovieRow
              title="🍿 You May Also Like (সম্পর্কিত মুভি)"
              subtitle="এই মুভির অনুরূপ অন্যান্য জনপ্রিয় কনটেন্ট"
              movies={similarMovies}
              onOpenDetails={(item) => setSelectedModalMovie(item)}
            />
          </div>
        )}
      </main>

      {/* Quick Details Modal if clicked inside recommended */}
      <DetailModal
        movie={selectedModalMovie}
        onClose={() => setSelectedModalMovie(null)}
      />

      <Footer />
    </div>
  );
}
