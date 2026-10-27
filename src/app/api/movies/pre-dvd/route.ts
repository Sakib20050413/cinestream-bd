import { NextResponse } from 'next/server';
import { fetchPreDvdMovies } from '@/lib/tmdb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const movies = await fetchPreDvdMovies();
    return NextResponse.json({ success: true, results: movies });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
