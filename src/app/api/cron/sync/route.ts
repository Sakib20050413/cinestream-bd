import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { fetchTrendingToday, fetchNowPlaying, fetchBanglaMovies } from '@/lib/tmdb';

export async function GET() {
  try {
    // 1. Fetch latest data to prime cache
    const [trending, nowPlaying, bangla] = await Promise.all([
      fetchTrendingToday(),
      fetchNowPlaying(),
      fetchBanglaMovies(),
    ]);

    // 2. Revalidate paths for instant client-side fresh view
    revalidatePath('/');
    revalidatePath('/movies');
    revalidatePath('/tv');
    revalidatePath('/bangla');

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Automated Catalog & Stream Cache Synchronized Successfully',
      syncedCounts: {
        trendingToday: trending.length,
        nowPlayingHall: nowPlaying.length,
        banglaCinema: bangla.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
