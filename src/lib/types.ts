export interface MediaItem {
  id: number;
  title: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  media_type: 'movie' | 'tv';
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count?: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  original_language: string;
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  quality?: string;
  dubbing?: string;
  trailer_key?: string;
  imdb_id?: string;
}

export interface StreamServer {
  id: string;
  name: string;
  description: string;
  badge: string;
  badgeColor: string;
  getUrl: (params: {
    tmdbId: number | string;
    imdbId?: string;
    type: 'movie' | 'tv';
    season?: number;
    episode?: number;
  }) => string;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path?: string;
  runtime?: number;
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path?: string;
  episodes?: Episode[];
}
