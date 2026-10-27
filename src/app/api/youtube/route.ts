import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ success: false, error: 'Query parameter q is required' }, { status: 400 });
  }

  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json({ success: false, error: 'YouTube search failed' }, { status: 502 });
    }

    const html = await response.text();
    // Match "videoId":"..."
    const match = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);

    if (match && match[1]) {
      return NextResponse.json({
        success: true,
        videoId: match[1],
        embedUrl: `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0`,
        watchUrl: `https://www.youtube.com/watch?v=${match[1]}`,
      });
    }

    return NextResponse.json({ success: false, error: 'No video ID found' }, { status: 404 });
  } catch (error) {
    console.error('YouTube search route error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
