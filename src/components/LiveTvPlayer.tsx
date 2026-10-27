'use client';

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Volume2, VolumeX, Maximize, AlertCircle, RefreshCw, Radio } from 'lucide-react';
import { LiveTvChannel } from '@/lib/iptv';

interface LiveTvPlayerProps {
  channel: LiveTvChannel;
}

export default function LiveTvPlayer({ channel }: LiveTvPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProxyActive, setIsProxyActive] = useState<boolean>(false);
  const hlsRef = useRef<Hls | null>(null);

  const initPlayer = (useProxy: boolean) => {
    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setError(null);
    setIsProxyActive(useProxy);

    const streamTarget = useProxy
      ? `/api/proxy/hls?url=${encodeURIComponent(channel.streamUrl)}`
      : channel.streamUrl;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
        maxBufferLength: 30,
      });
      hlsRef.current = hls;

      hls.loadSource(streamTarget);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsPlaying(true);
        video.play().catch(() => {
          // Autoplay policy might require user click or mute
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              if (!useProxy) {
                // Automatically retry through the server CORS proxy
                console.warn('Direct HLS network error, switching to proxy for:', channel.name);
                hls.destroy();
                initPlayer(true);
              } else {
                setError('লাইভ সম্প্রচার সাময়িকভাবে অফলাইন বা লোড হতে সমস্যা হয়েছে। অনুগ্রহ করে অন্য চ্যানেল দেখুন।');
                hls.destroy();
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              if (!useProxy) {
                hls.destroy();
                initPlayer(true);
              } else {
                setError('লাইভ সম্প্রচার লোড হতে সমস্যা হয়েছে।');
                hls.destroy();
              }
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari / iOS
      video.src = streamTarget;
      video.play().catch(() => {});
    }
  };

  useEffect(() => {
    initPlayer(false);

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [channel]);

  const handleRetry = () => {
    initPlayer(true);
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls
        playsInline
      />

      {/* Floating Channel Watermark / Header */}
      <div className="absolute top-4 left-4 flex items-center gap-2.5 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-700/60 pointer-events-none z-10">
        <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
        <span className="text-xs font-black uppercase tracking-wider text-white">
          LIVE • {channel.name}
        </span>
        <span className="text-[10px] text-zinc-400 border-l border-zinc-700 pl-2">
          {channel.quality}
        </span>
      </div>

      {/* Proxy Active Indicator */}
      {isProxyActive && (
        <div className="absolute top-4 right-4 bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md z-10">
          CORS Bypass Proxy Active
        </div>
      )}

      {/* Error Fallback Overlay */}
      {error && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center space-y-4 z-20">
          <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-700 flex items-center justify-center text-red-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white mb-1">
              চ্যানেল লোড করা সম্ভব হয়নি
            </h4>
            <p className="text-xs text-zinc-400 max-w-md">{error}</p>
          </div>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-lg shadow-red-600/30"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>আবার চেষ্টা করুন (Retry via Proxy)</span>
          </button>
        </div>
      )}
    </div>
  );
}
