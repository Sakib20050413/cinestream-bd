import { MediaItem } from './types';
import {
  ALL_MEDIA_CATALOG,
  BANGLA_MOVIES,
  POPULAR_TV_SHOWS,
  TOP_RATED_MOVIES,
  TRENDING_MOVIES,
} from './mockData';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY =
  process.env.TMDB_API_KEY ||
  process.env.NEXT_PUBLIC_TMDB_API_KEY ||
  'c45a857c193f6302f2b5061c3b85e743';

export const getImageUrl = (
  path: string | undefined | null,
  size: 'original' | 'w500' | 'w780' | 'w1280' = 'w500'
) => {
  if (!path) {
    return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
  }
  if (path.startsWith('http')) return path;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// 1. Trending Today (Daily Auto-Refresh)
export async function fetchTrendingToday(): Promise<MediaItem[]> {
  if (TMDB_API_KEY) {
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/trending/all/day?api_key=${TMDB_API_KEY}&language=en-US`,
        { next: { revalidate: 1800 } } // 30 mins auto-refresh
      );
      if (res.ok) {
        const data = await res.json();
        return data.results.map((item: any) => ({
          ...item,
          title: item.title || item.name,
          quality: '4K UHD',
          dubbing: 'Bangla Sub',
        }));
      }
    } catch (err) {
      console.warn('TMDB Trending Today Error:', err);
    }
  }
  return TRENDING_MOVIES;
}

export const fetchTrending = fetchTrendingToday;

export async function fetchTopRated(): Promise<MediaItem[]> {
  if (TMDB_API_KEY) {
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
        { next: { revalidate: 3600 } }
      );
      if (res.ok) {
        const data = await res.json();
        return data.results.map((item: any) => ({
          ...item,
          media_type: 'movie',
          quality: '4K UHD',
          dubbing: 'Dual Audio',
        }));
      }
    } catch (err) {
      console.warn('TMDB Top Rated Error:', err);
    }
  }
  return TOP_RATED_MOVIES;
}

export async function fetchPopularTv(): Promise<MediaItem[]> {
  if (TMDB_API_KEY) {
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
        { next: { revalidate: 3600 } }
      );
      if (res.ok) {
        const data = await res.json();
        return data.results.map((item: any) => ({
          ...item,
          media_type: 'tv',
          title: item.name,
          quality: '4K UHD',
          dubbing: 'Dual Audio',
        }));
      }
    } catch (err) {
      console.warn('TMDB TV Error:', err);
    }
  }
  return POPULAR_TV_SHOWS;
}


// 2. Now Playing In Theaters (Soddo Released Hall & Web-DL)
export async function fetchNowPlaying(): Promise<MediaItem[]> {
  if (TMDB_API_KEY) {
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
        { next: { revalidate: 1800 } }
      );
      if (res.ok) {
        const data = await res.json();
        return data.results.map((item: any) => ({
          ...item,
          media_type: 'movie',
          quality: 'Hall Print & HD',
          dubbing: 'Dual Audio',
        }));
      }
    } catch (err) {
      console.warn('TMDB Now Playing Error:', err);
    }
  }
  return TRENDING_MOVIES.slice(0, 5);
}

// 3. Airing Today TV Series (Daily TV Broadcasts)
export async function fetchAiringTodayTv(): Promise<MediaItem[]> {
  if (TMDB_API_KEY) {
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/tv/airing_today?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
        { next: { revalidate: 1800 } }
      );
      if (res.ok) {
        const data = await res.json();
        return data.results.map((item: any) => ({
          ...item,
          media_type: 'tv',
          title: item.name,
          quality: '1080p FHD',
          dubbing: 'Original Sub',
        }));
      }
    } catch (err) {
      console.warn('TMDB Airing Today Error:', err);
    }
  }
  return POPULAR_TV_SHOWS;
}

// 4. Bangla Cinema (Dhallywood & Kolkata)
export async function fetchBanglaMovies(): Promise<MediaItem[]> {
  const verifiedBangla = BANGLA_MOVIES;
  if (TMDB_API_KEY) {
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=bn&sort_by=popularity.desc&page=1`,
        { next: { revalidate: 3600 } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const apiBangla = data.results
            .filter((item: any) => item.poster_path)
            .map((item: any) => ({
              ...item,
              media_type: 'movie',
              quality: '1080p HD',
              dubbing: 'Original Bangla',
            }));

          // Merge verified blockbusters (Toofan, Surongo, Priyotoma) with API catalog
          const existingIds = new Set(verifiedBangla.map((m) => m.id));
          const uniqueFromApi = apiBangla.filter((m: any) => !existingIds.has(m.id));
          return [...verifiedBangla, ...uniqueFromApi];
        }
      }
    } catch (err) {
      console.warn('TMDB Bangla Error:', err);
    }
  }
  return BANGLA_MOVIES;
}

// 4.1 Pre-DVD & Hall Prints (Movielinkbd & Cinefreak Style Soddo Released Cam/VOD)
export async function fetchPreDvdMovies(): Promise<MediaItem[]> {
  if (TMDB_API_KEY) {
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
        { next: { revalidate: 1800 } }
      );
      if (res.ok) {
        const data = await res.json();
        return data.results.map((item: any, idx: number) => ({
          ...item,
          media_type: 'movie',
          quality: idx % 2 === 0 ? 'Pre-DVD (HQ-CAM)' : 'Hall Print HDTS',
          dubbing: idx % 3 === 0 ? 'Hindi Dubbed' : 'Dual Audio [ESub]',
        }));
      }
    } catch (err) {
      console.warn('TMDB Pre-DVD Error:', err);
    }
  }
  return TRENDING_MOVIES.map((m, idx) => ({
    ...m,
    quality: idx % 2 === 0 ? 'Pre-DVD (HQ-CAM)' : 'Hall Print HDTS',
    dubbing: 'Dual Audio',
  }));
}

// 5. Bollywood & Hindi Cinema
export async function fetchBollywoodMovies(): Promise<MediaItem[]> {
  if (TMDB_API_KEY) {
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=hi&sort_by=popularity.desc&page=1`,
        { next: { revalidate: 3600 } }
      );
      if (res.ok) {
        const data = await res.json();
        return data.results.map((item: any) => ({
          ...item,
          media_type: 'movie',
          quality: '1080p HD',
          dubbing: 'Hindi Original',
        }));
      }
    } catch (err) {
      console.warn('TMDB Bollywood Error:', err);
    }
  }
  return [
    {
      id: 878361,
      title: 'Jawan',
      original_title: 'जवान',
      overview: 'A high-octane action thriller detailing the emotional journey of a man set to rectify wrongs in society.',
      poster_path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
      backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
      media_type: 'movie',
      vote_average: 7.2,
      original_language: 'hi',
      quality: '1080p HD',
      dubbing: 'Hindi Original',
    },
    {
      id: 792307,
      title: 'Poor Things',
      original_title: 'Poor Things',
      overview: 'The incredible tale of Bella Baxter, a young woman brought back to life by an eccentric scientist.',
      poster_path: '/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg',
      backdrop_path: '/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
      media_type: 'movie',
      vote_average: 7.8,
      original_language: 'en',
      quality: '4K UHD',
      dubbing: 'Dual Audio',
    },
  ];
}

// 6. South Indian Hindi Dubbed Hits
export async function fetchSouthIndianMovies(): Promise<MediaItem[]> {
  if (TMDB_API_KEY) {
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_original_languages=te|ta|ml|kn&sort_by=popularity.desc&page=1`,
        { next: { revalidate: 3600 } }
      );
      if (res.ok) {
        const data = await res.json();
        return data.results.map((item: any) => ({
          ...item,
          media_type: 'movie',
          quality: '4K UHD',
          dubbing: 'Hindi Dubbed',
        }));
      }
    } catch (err) {
      console.warn('TMDB South Indian Error:', err);
    }
  }
  return [
    {
      id: 579974,
      title: 'RRR',
      original_title: 'రౌద్రం రణం రుధిరం',
      overview: 'A fictional history of two legendary revolutionaries and their journey away from home before fighting for their country.',
      poster_path: '/wE0noFfZ0TrvUt7841NqIE18c8P.jpg',
      backdrop_path: '/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
      media_type: 'movie',
      vote_average: 7.8,
      original_language: 'te',
      quality: '4K UHD',
      dubbing: 'Hindi Dubbed',
    },
    {
      id: 695721,
      title: 'K.G.F: Chapter 2',
      original_title: 'ಕೆ.ಜಿ.ಎಫ್: ಅಧ್ಯಾಯ ೨',
      overview: 'The blood-soaked land of Kolar Gold Fields has a new overlord whose name strikes fear into the heart of his foes.',
      poster_path: '/hkxxMIGaiCTmrEArK7J56JTKUlB.jpg',
      backdrop_path: '/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
      media_type: 'movie',
      vote_average: 7.3,
      original_language: 'kn',
      quality: '1080p HD',
      dubbing: 'Hindi Dubbed',
    },
  ];
}

// 7. Pakistani Dramas
export async function fetchPakistaniDramas(): Promise<MediaItem[]> {
  if (TMDB_API_KEY) {
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_original_language=ur&sort_by=popularity.desc&page=1`,
        { next: { revalidate: 3600 } }
      );
      if (res.ok) {
        const data = await res.json();
        return data.results.map((item: any) => ({
          ...item,
          media_type: 'tv',
          title: item.name,
          quality: '1080p HD',
          dubbing: 'Original Urdu',
        }));
      }
    } catch (err) {
      console.warn('TMDB Pakistani Dramas Error:', err);
    }
  }
  return [
    {
      id: 205322,
      title: 'Tere Bin',
      name: 'Tere Bin',
      overview: 'A passionate love-hate saga between Meerab, an ambitious young woman, and Murtasim, a powerful feudal leader.',
      poster_path: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
      backdrop_path: '/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
      media_type: 'tv',
      vote_average: 8.5,
      original_language: 'ur',
      number_of_seasons: 1,
      number_of_episodes: 58,
      quality: '1080p HD',
      dubbing: 'Original Urdu',
    },
    {
      id: 247814,
      title: 'Kabhi Main Kabhi Tum',
      name: 'Kabhi Main Kabhi Tum',
      overview: 'The story of Sharjeena and Mustafa who find companionship and love after an unexpected marriage of circumstance.',
      poster_path: '/reEMJA1uzscCbk5rRgkTaGLq74X.jpg',
      backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
      media_type: 'tv',
      vote_average: 8.8,
      original_language: 'ur',
      number_of_seasons: 1,
      number_of_episodes: 35,
      quality: '1080p HD',
      dubbing: 'Original Urdu',
    },
  ];
}

// 8. K-Drama & Asian Series
export async function fetchKDramas(): Promise<MediaItem[]> {
  if (TMDB_API_KEY) {
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_original_language=ko&sort_by=popularity.desc&page=1`,
        { next: { revalidate: 3600 } }
      );
      if (res.ok) {
        const data = await res.json();
        return data.results.map((item: any) => ({
          ...item,
          media_type: 'tv',
          title: item.name,
          quality: '4K UHD',
          dubbing: 'Bangla Sub',
        }));
      }
    } catch (err) {
      console.warn('TMDB KDrama Error:', err);
    }
  }
  return POPULAR_TV_SHOWS.slice(0, 3);
}

// 9. Details & Videos
export async function fetchMediaDetails(
  id: string | number,
  type: 'movie' | 'tv' = 'movie'
): Promise<MediaItem | null> {
  const numId = Number(id);

  if (TMDB_API_KEY) {
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/${type}/${numId}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits,similar`,
        { next: { revalidate: 3600 } }
      );
      if (res.ok) {
        const data = await res.json();
        const trailer =
          data.videos?.results?.find(
            (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
          )?.key || data.videos?.results?.[0]?.key;

        return {
          ...data,
          title: data.title || data.name,
          media_type: type,
          trailer_key: trailer,
          quality: '4K UHD',
          dubbing: 'Bangla Sub',
        };
      }
    } catch (err) {
      console.warn('TMDB Details Error:', err);
    }
  }

  const found = ALL_MEDIA_CATALOG.find((m) => m.id === numId);
  if (found) return found;

  return {
    id: numId,
    title: `Stream Title #${numId}`,
    overview:
      'High-Definition streaming called dynamically via real-time multi-server stream API without any upload required. Switch between high-speed servers below if buffering occurs.',
    poster_path: '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdrop_path: '/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    media_type: type,
    vote_average: 8.0,
    vote_count: 120,
    original_language: 'en',
    quality: '4K UHD',
    dubbing: 'Dual Audio',
    trailer_key: '73_1biulkYk',
  };
}

// 10. Multi-Search with instant matching
export async function searchMedia(query: string): Promise<MediaItem[]> {
  if (!query.trim()) return [];

  if (TMDB_API_KEY) {
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          query
        )}&page=1`,
        { next: { revalidate: 1800 } }
      );
      if (res.ok) {
        const data = await res.json();
        return data.results
          .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
          .map((item: any) => ({
            ...item,
            title: item.title || item.name,
            quality: '1080p HD',
            dubbing: 'Bangla Sub',
          }));
      }
    } catch (err) {
      console.warn('TMDB Search Error:', err);
    }
  }

  const q = query.toLowerCase();
  return ALL_MEDIA_CATALOG.filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      (m.original_title && m.original_title.toLowerCase().includes(q)) ||
      (m.overview && m.overview.toLowerCase().includes(q))
  );
}
