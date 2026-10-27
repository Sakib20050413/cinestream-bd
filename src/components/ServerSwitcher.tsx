'use client';

import React from 'react';
import { Server, Zap, Video, CheckCircle2 } from 'lucide-react';
import { STREAM_SERVERS } from '@/lib/embedServers';

interface ServerSwitcherProps {
  currentServerId: string;
  onSelectServer: (serverId: string) => void;
  hasTrailer: boolean;
  isTrailerActive: boolean;
  onToggleTrailer: () => void;
}

export default function ServerSwitcher({
  currentServerId,
  onSelectServer,
  hasTrailer,
  isTrailerActive,
  onToggleTrailer,
}: ServerSwitcherProps) {
  return (
    <div className="bg-[#181818]/90 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Streaming Mirrors & Cloud Engines
            </h3>
            <p className="text-[11px] text-zinc-400">
              যেকোনো সার্ভারে বাফারিং বা সমস্যা হলে নিচের যেকোনো সার্ভার পরিবর্তন করুন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-[11px] font-semibold text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>High-Speed Cloud CDNs</span>
        </div>
      </div>

      {/* Server Pills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
        {STREAM_SERVERS.map((server) => {
          const isActive = !isTrailerActive && currentServerId === server.id;
          return (
            <button
              key={server.id}
              onClick={() => onSelectServer(server.id)}
              className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all duration-300 relative overflow-hidden group ${
                isActive
                  ? 'border-red-500 bg-gradient-to-b from-red-950/60 to-zinc-900 text-white ring-1 ring-red-500/60 shadow-lg shadow-red-950/50 scale-[1.02]'
                  : 'border-zinc-800/80 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/80'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-white ${server.badgeColor}`}
                >
                  {server.badge}
                </span>
                {isActive ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Zap className="w-3 h-3 text-zinc-500 group-hover:text-amber-400 transition" />
                )}
              </div>
              <span className="text-xs font-bold truncate w-full mt-0.5">{server.name}</span>
              <span className="text-[10px] text-zinc-400 truncate w-full mt-0.5">
                {server.description.split('•')[0]}
              </span>
            </button>
          );
        })}

        {/* Trailer Button */}
        {hasTrailer && (
          <button
            onClick={onToggleTrailer}
            className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all duration-300 relative overflow-hidden group ${
              isTrailerActive
                ? 'border-red-500 bg-gradient-to-b from-red-950/60 to-zinc-900 text-white ring-1 ring-red-500/60 shadow-lg shadow-red-950/50 scale-[1.02]'
                : 'border-zinc-800/80 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/80'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-600 text-white">
                Trailer
              </span>
              <Video className="w-3.5 h-3.5 text-red-400" />
            </div>
            <span className="text-xs font-bold truncate w-full mt-0.5">Official Trailer</span>
            <span className="text-[10px] text-zinc-400 truncate w-full mt-0.5">4K Preview</span>
          </button>
        )}
      </div>
    </div>
  );
}
