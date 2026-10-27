import { NextResponse } from 'next/server';
import { fetchPopularTv } from '@/lib/tmdb';

export async function GET() {
  try {
    const shows = await fetchPopularTv();
    return NextResponse.json({ success: true, results: shows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
