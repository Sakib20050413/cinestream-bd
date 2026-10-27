import { NextResponse } from 'next/server';
import { fetchTrending } from '@/lib/tmdb';

export async function GET() {
  try {
    const movies = await fetchTrending();
    return NextResponse.json({ success: true, results: movies });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
