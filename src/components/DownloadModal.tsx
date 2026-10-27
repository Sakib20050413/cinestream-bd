'use client';

import React from 'react';
import { X, Download, ShieldCheck, Film, HardDrive, FileText, ExternalLink } from 'lucide-react';
import { MediaItem } from '@/lib/types';

interface DownloadModalProps {
  movie: MediaItem | null;
  season?: number;
  episode?: number;
  onClose: () => void;
}

export default function DownloadModal({
  movie,
  season = 1,
  episode = 1,
  onClose,
}: DownloadModalProps) {
  if (!movie) return null;

  const titleText =
    movie.media_type === 'tv'
      ? `${movie.title} - S${String(season).padStart(2, '0')}E${String(episode).padStart(2, '0')}`
      : movie.title;

  const downloadLinks = [
    {
      quality: '4K Ultra HD (2160p HDR)',
      size: '4.8 GB',
      format: 'MKV • 10-bit x265 • Atmos 5.1',
      speed: 'High-Speed Cloud CDN',
      url: `https://dl.vidsrc.vip/download?id=${movie.id}&type=${movie.media_type}&q=4k`,
      badge: 'Best Quality',
      color: 'bg-emerald-600',
    },
    {
      quality: 'Full HD 1080p (Web-DL)',
      size: '2.1 GB',
      format: 'MP4 • H.264 • Dual Audio',
      speed: 'Instant Direct Mirror',
      url: `https://dl.vidsrc.vip/download?id=${movie.id}&type=${movie.media_type}&q=1080p`,
      badge: 'Recommended',
      color: 'bg-blue-600',
    },
    {
      quality: 'HD 720p (Mobile Rip)',
      size: '950 MB',
      format: 'MP4 • Fast Buffering',
      speed: 'Mobile Fast CDN',
      url: `https://dl.vidsrc.vip/download?id=${movie.id}&type=${movie.media_type}&q=720p`,
      badge: 'Data Saver',
      color: 'bg-zinc-700',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#181818] border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-red-500" />
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Download Manager (ডাউনলোড হাব)
              </h3>
              <p className="text-xs text-zinc-400 truncate max-w-sm">{titleText}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security / Quality Guarantee */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>
            ক্লিন ডাউনলোড মিরর: কোনো ম্যালওয়্যার বা রিডাইরেক্ট স্প্যাম নেই। সরাসরি ক্লাউড লিঙ্ক।
          </span>
        </div>

        {/* Links List */}
        <div className="space-y-3">
          {downloadLinks.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:border-zinc-700 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{item.quality}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded text-white ${item.color}`}>
                    {item.badge}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3" />
                    {item.size}
                  </span>
                  <span>•</span>
                  <span>{item.format}</span>
                </div>
              </div>

              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/30 transition active:scale-95 shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            </div>
          ))}
        </div>

        {/* Subtitles Download */}
        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>বাংলা ও ইংরেজি সাবটাইটেল (.srt):</span>
          </div>
          <a
            href={`https://subdl.com/search/${encodeURIComponent(movie.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold"
          >
            <span>Get Bangla Subs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
