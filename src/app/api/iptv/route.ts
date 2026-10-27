import { NextRequest, NextResponse } from 'next/server';
import { LIVE_TV_CHANNELS } from '@/lib/iptv';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country');
  const category = searchParams.get('category');
  const query = searchParams.get('q');

  let filtered = [...LIVE_TV_CHANNELS];

  if (country && country !== 'all') {
    filtered = filtered.filter((c) => c.countryCode.toLowerCase() === country.toLowerCase());
  }

  if (category && category !== 'all') {
    filtered = filtered.filter((c) => c.category.toLowerCase() === category.toLowerCase());
  }

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    channels: filtered,
  });
}
