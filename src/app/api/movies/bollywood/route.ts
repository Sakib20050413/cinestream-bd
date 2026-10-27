import { NextResponse } from 'next/server';
import { fetchBollywoodMovies } from '@/lib/tmdb';

export async function GET() {
  try {
    const results = await fetchBollywoodMovies();
    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
