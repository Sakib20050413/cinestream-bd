import { NextRequest, NextResponse } from 'next/server';
import { STREAM_SERVERS } from '@/lib/embedServers';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tmdbId = searchParams.get('tmdbId') || '533535';
  const type = (searchParams.get('type') || 'movie') as 'movie' | 'tv';
  const season = Number(searchParams.get('season')) || 1;
  const episode = Number(searchParams.get('episode')) || 1;

  const servers = STREAM_SERVERS.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    badge: s.badge,
    badgeColor: s.badgeColor,
    streamUrl: s.getUrl({ tmdbId, type, season, episode }),
  }));

  return NextResponse.json({
    success: true,
    tmdbId,
    type,
    season,
    episode,
    servers,
  });
}
