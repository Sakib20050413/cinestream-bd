import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * High-Performance CORS-bypassing HLS Stream Proxy
 * Fetches upstream .m3u8 playlists and .ts media chunks on server-side
 * and serves them with permissive CORS headers to guarantee 100% browser playback.
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    const upstreamRes = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Referer: new URL(url).origin,
      },
      next: { revalidate: 0 },
    });

    if (!upstreamRes.ok) {
      return new NextResponse(`Upstream failed with status ${upstreamRes.status}`, {
        status: upstreamRes.status,
      });
    }

    const contentType = upstreamRes.headers.get('content-type') || 'application/vnd.apple.mpegurl';
    const isPlaylist =
      url.endsWith('.m3u8') ||
      contentType.includes('mpegurl') ||
      contentType.includes('application/x-mpegURL');

    if (isPlaylist) {
      const playlistText = await upstreamRes.text();
      const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);

      // Rewrite relative URLs inside m3u8 playlist to route through the proxy
      const rewrittenPlaylist = playlistText
        .split('\n')
        .map((line) => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            // It's a URI line
            let resolvedUrl = trimmed;
            if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
              resolvedUrl = new URL(trimmed, baseUrl).toString();
            }
            return `/api/proxy/hls?url=${encodeURIComponent(resolvedUrl)}`;
          }
          return line;
        })
        .join('\n');

      return new NextResponse(rewrittenPlaylist, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    } else {
      // It's a binary chunk (.ts or .aac or .mp4)
      const buffer = await upstreamRes.arrayBuffer();
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }
  } catch (error: any) {
    return new NextResponse(`Proxy error: ${error.message}`, { status: 500 });
  }
}
