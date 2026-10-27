import { NextResponse } from 'next/server';
import { fetchTopRated } from '@/lib/tmdb';

export async function GET() {
  try {
    const movies = await fetchTopRated();
    return NextResponse.json({ success: true, results: movies });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
