import { NextRequest, NextResponse } from 'next/server';
import { fetchMediaDetails } from '@/lib/tmdb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const { type, id } = await params;
    const mediaType = type === 'tv' ? 'tv' : 'movie';
    const details = await fetchMediaDetails(id, mediaType);

    if (!details) {
      return NextResponse.json({ success: false, error: 'Media not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, details });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
