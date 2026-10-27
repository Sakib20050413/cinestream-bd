import { NextRequest, NextResponse } from 'next/server';
import { searchMedia } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const results = await searchMedia(query);
    return NextResponse.json({ success: true, query, results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
