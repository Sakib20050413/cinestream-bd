'use client';

import React from 'react';
import { Tv, Play } from 'lucide-react';

interface EpisodeSelectorProps {
  totalSeasons: number;
  totalEpisodes: number;
  currentSeason: number;
  currentEpisode: number;
  onSelect: (season: number, episode: number) => void;
}

export default function EpisodeSelector({
  totalSeasons = 1,
  totalEpisodes = 10,
  currentSeason = 1,
  currentEpisode = 1,
  onSelect,
}: EpisodeSelectorProps) {
  const seasons = Array.from({ length: Math.max(1, totalSeasons) }, (_, i) => i + 1);
  const episodes = Array.from({ length: Math.max(1, totalEpisodes) }, (_, i) => i + 1);

  return (
    <div className="bg-[#181818] border border-zinc-800 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Tv className="w-4 h-4 text-red-500" />
          <span>Episodic Navigation (সিজন ও পর্ব নির্বাচন)</span>
        </div>
        <span className="text-xs text-zinc-400">
          Season {currentSeason} • Episode {currentEpisode}
        </span>
      </div>

      {/* Season Selection Pills */}
      <div>
        <label className="text-xs text-zinc-400 block mb-2 font-medium">Select Season:</label>
        <div className="flex flex-wrap gap-2">
          {seasons.map((s) => (
            <button
              key={s}
              onClick={() => onSelect(s, 1)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                s === currentSeason
                  ? 'bg-[#E50914] text-white shadow-md shadow-red-600/30'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              Season {s}
            </button>
          ))}
        </div>
      </div>

      {/* Episodes Grid */}
      <div>
        <label className="text-xs text-zinc-400 block mb-2 font-medium">Select Episode:</label>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-48 overflow-y-auto pr-1">
          {episodes.map((ep) => {
            const isPlaying = ep === currentEpisode;
            return (
              <button
                key={ep}
                onClick={() => onSelect(currentSeason, ep)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition ${
                  isPlaying
                    ? 'bg-red-600 text-white shadow-lg ring-1 ring-white/30'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white'
                }`}
              >
                {isPlaying ? <Play className="w-3 h-3 fill-white" /> : null}
                <span>EP {ep}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
