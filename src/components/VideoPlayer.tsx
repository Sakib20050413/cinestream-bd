'use client';

import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Shield,
  ShieldAlert,
  Moon,
  Sun,
  Download,
  Tv,
  ExternalLink,
  Play,
  Zap,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { MediaItem } from '@/lib/types';
import { STREAM_SERVERS } from '@/lib/embedServers';
import ServerSwitcher from './ServerSwitcher';
import EpisodeSelector from './EpisodeSelector';
import DownloadModal from './DownloadModal';

const YouTubeIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

interface VideoPlayerProps {
  movie: MediaItem;
}

export default function VideoPlayer({ movie }: VideoPlayerProps) {
  const [selectedServerId, setSelectedServerId] = useState<string>(STREAM_SERVERS[0].id);
  const [currentSeason, setCurrentSeason] = useState<number>(1);
  const [currentEpisode, setCurrentEpisode] = useState<number>(1);
  const [isTrailerActive, setIsTrailerActive] = useState<boolean>(false);
  const [isYouTubeOfficial, setIsYouTubeOfficial] = useState<boolean>(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [isFetchingYouTube, setIsFetchingYouTube] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [adShieldActive, setAdShieldActive] = useState<boolean>(true);
  const [clickShieldActive, setClickShieldActive] = useState<boolean>(true);
  const [strictSandbox, setStrictSandbox] = useState<boolean>(false);
  const [lightsOff, setLightsOff] = useState<boolean>(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState<boolean>(false);

  // Anti-Redirect and Pop-up Interceptor
  useEffect(() => {
    if (!adShieldActive) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Prevents third-party iframes from forcing top-level navigation away from CineStream
      e.preventDefault();
      e.returnValue = '';
    };

    const handleBlur = () => {
      // If an ad script opens a popup tab or loses window focus, instantly reclaim focus
      setTimeout(() => {
        window.focus();
      }, 50);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('blur', handleBlur);
    };
  }, [adShieldActive]);

  // Fetch official YouTube broadcast stream when requested (e.g. for Dar-E-Nijaat or regional serials)
  useEffect(() => {
    if (!isYouTubeOfficial) return;

    let isMounted = true;
    const fetchYouTubeStream = async () => {
      setIsFetchingYouTube(true);
      try {
        const query = `${movie.title} ${
          movie.media_type === 'tv' ? `Episode ${currentEpisode}` : 'Full Movie'
        } HD`;
        const res = await fetch(`/api/youtube?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (isMounted && data.success && data.videoId) {
          setYoutubeVideoId(data.videoId);
        }
      } catch (err) {
        console.error('Failed to fetch YouTube stream:', err);
      } finally {
        if (isMounted) setIsFetchingYouTube(false);
      }
    };

    fetchYouTubeStream();

    return () => {
      isMounted = false;
    };
  }, [isYouTubeOfficial, currentEpisode, movie.title, movie.media_type]);

  const selectedServer =
    STREAM_SERVERS.find((s) => s.id === selectedServerId) || STREAM_SERVERS[0];

  // Determine current iframe stream URL
  let currentStreamUrl = selectedServer.getUrl({
    tmdbId: movie.id,
    imdbId: movie.imdb_id,
    type: movie.media_type,
    season: currentSeason,
    episode: currentEpisode,
  });

  if (isTrailerActive && movie.trailer_key) {
    currentStreamUrl = `https://www.youtube.com/embed/${movie.trailer_key}?autoplay=1&rel=0`;
  } else if (isYouTubeOfficial && youtubeVideoId) {
    currentStreamUrl = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0`;
  }

  const handleSelectServer = (serverId: string) => {
    setIsTrailerActive(false);
    setIsYouTubeOfficial(false);
    setSelectedServerId(serverId);
    setIframeKey((prev) => prev + 1);
    setClickShieldActive(true);
  };

  const handleToggleOfficialYouTube = () => {
    setIsTrailerActive(false);
    setIsYouTubeOfficial(!isYouTubeOfficial);
    setIframeKey((prev) => prev + 1);
    setClickShieldActive(false);
  };

  const handleToggleTrailer = () => {
    setIsYouTubeOfficial(false);
    setIsTrailerActive(!isTrailerActive);
    setIframeKey((prev) => prev + 1);
    setClickShieldActive(false);
  };

  const handleEpisodeChange = (season: number, episode: number) => {
    setCurrentSeason(season);
    setCurrentEpisode(episode);
    setIsTrailerActive(false);
    setIframeKey((prev) => prev + 1);
    setClickShieldActive(true);
  };

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
    setClickShieldActive(true);
  };

  const fallbackYouTubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${movie.title} ${movie.media_type === 'tv' ? `Episode ${currentEpisode}` : 'Full Movie'} HD`
  )}`;

  return (
    <>
      {/* Cinema Lights Off Overlay */}
      {lightsOff && (
        <div
          onClick={() => setLightsOff(false)}
          className="fixed inset-0 bg-black/95 z-40 cursor-pointer backdrop-blur-sm transition-opacity duration-500"
          title="ক্লিক করে লাইট অন করুন"
        />
      )}

      <div className={`space-y-4 ${lightsOff ? 'relative z-50' : ''}`}>
        {/* Top Buffer-Fix Quick Bar (Fixes video stuttering instantly without scrolling) */}
        <div className="bg-[#141417] border border-white/10 rounded-2xl p-3 backdrop-blur-xl shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5 px-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-white tracking-wide">
                বাফারিং ফিক্স ও সার্ভার সুইচ (Buffer Free Mirrors)
              </span>
            </div>

            {/* Anti-Redirect Security Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAdShieldActive(!adShieldActive)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  adShieldActive
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                    : 'bg-zinc-800 border border-zinc-700 text-zinc-400'
                }`}
                title="পপ-আপ ও রিডাইরেক্ট ব্লক করুন"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Ad-Shield: {adShieldActive ? 'চালু' : 'বন্ধ'}</span>
              </button>

              <button
                onClick={() => setDownloadModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold transition shadow-md shadow-red-600/20 active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ডাউনলোড</span>
              </button>

              <button
                onClick={() => setLightsOff(!lightsOff)}
                className={`p-1.5 rounded-lg border text-xs transition ${
                  lightsOff
                    ? 'border-amber-500/60 bg-amber-500/15 text-amber-300'
                    : 'border-white/10 bg-zinc-800 text-zinc-300 hover:text-white'
                }`}
                title={lightsOff ? 'লাইট অন করুন' : 'সিনেমা থিয়েটার মোড (Lights Off)'}
              >
                {lightsOff ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                onClick={handleRefresh}
                className="p-1.5 rounded-lg border border-white/10 bg-zinc-800 text-zinc-300 hover:text-white transition"
                title="প্লেয়ার রিলোড করুন"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick-Switch Pill Buttons (Top 5 Best CDN Mirrors + Official YouTube) */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
            <span className="text-[11px] font-medium text-zinc-400 hidden sm:inline mr-1">
              দ্রুত পরিবর্তন:
            </span>

            {/* Server 1: RiveStream AutoEmbed VIP (No Ads, No Popups) */}
            <button
              onClick={() => handleSelectServer('rivestream')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedServerId === 'rivestream' && !isYouTubeOfficial && !isTrailerActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400'
                  : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-white/10'
              }`}
            >
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>সার্ভার ১ (AutoEmbed VIP)</span>
            </button>

            {/* Server 2: VidSrc V2 (High Bitrate 1080p) */}
            <button
              onClick={() => handleSelectServer('vidsrc-cc')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedServerId === 'vidsrc-cc' && !isYouTubeOfficial && !isTrailerActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400'
                  : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-white/10'
              }`}
            >
              <span>সার্ভার ২ (VidSrc ১০৮০p)</span>
            </button>

            {/* Server 3: EmbedSU Cinema */}
            <button
              onClick={() => handleSelectServer('embed-su')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedServerId === 'embed-su' && !isYouTubeOfficial && !isTrailerActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-1 ring-purple-400'
                  : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-white/10'
              }`}
            >
              <span>সার্ভার ৩ (Cinema Cloud)</span>
            </button>

            {/* Server 4: MultiEmbed Dual Audio */}
            <button
              onClick={() => handleSelectServer('multiembed')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedServerId === 'multiembed' && !isYouTubeOfficial && !isTrailerActive
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 ring-1 ring-amber-400'
                  : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-white/10'
              }`}
            >
              <span>সার্ভার ৪ (ডুয়াল অডিও)</span>
            </button>

            {/* Server 5: 2Embed Hall Prints */}
            <button
              onClick={() => handleSelectServer('twoembed')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedServerId === 'twoembed' && !isYouTubeOfficial && !isTrailerActive
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-1 ring-rose-400'
                  : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-white/10'
              }`}
            >
              <span>সার্ভার ৫ (হল প্রিন্ট/প্রি-ডিভিডি)</span>
            </button>

            {/* Official YouTube Stream (100% Guaranteed Playback for Pakistani/Bangla/Regional serials) */}
            <button
              onClick={handleToggleOfficialYouTube}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                isYouTubeOfficial
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 ring-1 ring-red-400'
                  : 'bg-red-950/50 hover:bg-red-900/60 text-red-200 border border-red-800/40'
              }`}
              title="পাকিস্তানি ও আঞ্চলিক সিরিয়ালের জন্য সরাসরি ১০৮০p স্ট্রিম"
            >
              <YouTubeIcon className="w-3.5 h-3.5 text-red-400 fill-current" />
              <span>অফিসিয়াল এইচডি স্ট্রিম (YouTube)</span>
            </button>
          </div>
        </div>

        {/* Video Player Display Container */}
        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/90">
          {/* Smart Transparent Click-Shield Overlay */}
          {clickShieldActive && !isTrailerActive && !isYouTubeOfficial && (
            <div
              onClick={() => setClickShieldActive(false)}
              className="absolute inset-0 z-30 cursor-pointer flex items-center justify-center bg-black/50 hover:bg-black/30 transition-all duration-300 group"
              title="প্লে করতে ক্লিক করুন"
            >
              <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-black/85 border border-white/20 backdrop-blur-xl shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 rounded-full bg-[#E50914] flex items-center justify-center text-white shadow-xl shadow-red-600/50">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white tracking-wide">
                    প্লে করতে এখানে ক্লিক করুন
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1 flex items-center justify-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400 inline" />
                    <span>Ad-Shield সক্রিয় • অযাচিত রিডাইরেক্ট ব্লক করা আছে</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* YouTube Stream Fetching Spinner */}
          {isYouTubeOfficial && isFetchingYouTube && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 text-white gap-3">
              <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
              <p className="text-sm font-semibold">
                ইউটিউব থেকে অফিসিয়াল ১০৮০p পর্ব খোঁজা হচ্ছে...
              </p>
            </div>
          )}

          {/* The Video Iframe */}
          <iframe
            key={`${currentStreamUrl}-${iframeKey}`}
            src={currentStreamUrl}
            referrerPolicy={
              isYouTubeOfficial || isTrailerActive
                ? 'strict-origin-when-cross-origin'
                : 'no-referrer'
            }
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title={`${movie.title} Player`}
            {...(strictSandbox
              ? {
                  sandbox:
                    'allow-scripts allow-same-origin allow-forms allow-presentation allow-encrypted-media allow-downloads',
                }
              : {})}
          />
        </div>

        {/* Player Status & Information Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs px-4 py-2.5 bg-[#141417] border border-white/10 rounded-xl text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              বর্তমান সোর্স:{' '}
              <strong className="text-white">
                {isTrailerActive
                  ? 'অফিসিয়াল ট্রেইলার'
                  : isYouTubeOfficial
                  ? `ইউটিউব অফিসিয়াল ১০৮০p ব্রডকাস্ট (Episode ${currentEpisode})`
                  : selectedServer.name}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            {isYouTubeOfficial ? (
              <a
                href={fallbackYouTubeSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-red-400 hover:text-red-300 font-semibold"
              >
                <span>ইউটিউব সরাসরি পেজে খুলুন</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span>বাফারিং বা আটকে গেলে উপরের যেকোনো বিকল্প সার্ভারে ক্লিক করুন</span>
            )}
          </div>
        </div>

        {/* Server Switcher (Full 10-Server Catalog) */}
        <ServerSwitcher
          currentServerId={selectedServerId}
          onSelectServer={handleSelectServer}
          hasTrailer={Boolean(movie.trailer_key)}
          isTrailerActive={isTrailerActive}
          onToggleTrailer={handleToggleTrailer}
        />

        {/* Episode Selector for TV Shows */}
        {movie.media_type === 'tv' && (
          <EpisodeSelector
            totalSeasons={movie.number_of_seasons || 1}
            totalEpisodes={movie.number_of_episodes || 25}
            currentSeason={currentSeason}
            currentEpisode={currentEpisode}
            onSelect={handleEpisodeChange}
          />
        )}
      </div>

      {/* Direct Download Modal */}
      {downloadModalOpen && (
        <DownloadModal
          movie={movie}
          season={currentSeason}
          episode={currentEpisode}
          onClose={() => setDownloadModalOpen(false)}
        />
      )}
    </>
  );
}
