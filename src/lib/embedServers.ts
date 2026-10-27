import { StreamServer } from './types';

export const STREAM_SERVERS: StreamServer[] = [
  {
    id: 'rivestream',
    name: 'সার্ভার ১ (AutoEmbed VIP • নো অ্যাড্স)',
    description: 'AutoEmbed প্রিমিয়াম ইঞ্জিন • জিরো পপ-আপ • আল্ট্রা ফাস্ট বাফারিং',
    badge: '⚡ AutoEmbed VIP',
    badgeColor: 'bg-emerald-600',
    getUrl: ({ tmdbId, type, season = 1, episode = 1 }) => {
      if (type === 'tv') {
        return `https://www.rivestream.app/embed?type=tv&id=${tmdbId}&season=${season}&episode=${episode}`;
      }
      return `https://www.rivestream.app/embed?type=movie&id=${tmdbId}`;
    },
  },
  {
    id: 'vidsrc-cc',
    name: 'সার্ভার ২ (VidSrc V2 • ১০৮০p FHD)',
    description: 'হাই বিটরেট ১০৮০p ক্লাউড • মাল্টি-সাবটাইটেল • স্মুথ প্লেব্যাক',
    badge: '🚀 VidSrc V2',
    badgeColor: 'bg-blue-600',
    getUrl: ({ tmdbId, type, season = 1, episode = 1 }) => {
      if (type === 'tv') {
        return `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://vidsrc.cc/v2/embed/movie/${tmdbId}`;
    },
  },
  {
    id: 'embed-su',
    name: 'সার্ভার ৩ (EmbedSU Cinema)',
    description: 'ডিরেক্ট হাই-স্পিড ক্লাউড স্ট্রিম • নো ল্যাগ • মোবাইল ফ্রেন্ডলি',
    badge: '🎬 Cinema Cloud',
    badgeColor: 'bg-purple-600',
    getUrl: ({ tmdbId, type, season = 1, episode = 1 }) => {
      if (type === 'tv') {
        return `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://embed.su/embed/movie/${tmdbId}`;
    },
  },
  {
    id: 'multiembed',
    name: 'সার্ভার ৪ (MultiEmbed ডুয়াল অডিও)',
    description: 'হিন্দি / ইংলিশ / বাংলা ডাবিং • ডুয়াল অডিও অরিজিনাল ট্র্যাক',
    badge: '🎧 Dual Audio',
    badgeColor: 'bg-amber-600',
    getUrl: ({ tmdbId, type, season = 1, episode = 1 }) => {
      if (type === 'tv') {
        return `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`;
      }
      return `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`;
    },
  },
  {
    id: 'twoembed',
    name: 'সার্ভার ৫ (2Embed হল প্রিন্ট ও প্রি-ডিভিডি)',
    description: 'সদ্য রিলিজ হওয়া থিয়েটার প্রিন্ট, স্ক্রিনার ও প্রি-ডিভিডি রিলিজ',
    badge: '🍿 Pre-DVD / Hall',
    badgeColor: 'bg-rose-600',
    getUrl: ({ tmdbId, type, season = 1, episode = 1 }) => {
      if (type === 'tv') {
        return `https://www.2embed.stream/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://www.2embed.stream/embed/movie/${tmdbId}`;
    },
  },
  {
    id: 'smashystream',
    name: 'সার্ভার ৬ (Smashy VIP ক্লাউড)',
    description: 'ফাস্ট অল্টারনেটিভ সিডিএন • ব্যাকআপ ক্লাউড ইঞ্জিন',
    badge: '⚡ Smashy Fast',
    badgeColor: 'bg-indigo-600',
    getUrl: ({ tmdbId, type, season = 1, episode = 1 }) => {
      if (type === 'tv') {
        return `https://player.smashy.stream/tv/${tmdbId}?s=${season}&e=${episode}`;
      }
      return `https://player.smashy.stream/movie/${tmdbId}`;
    },
  },
  {
    id: 'vidsrc-xyz',
    name: 'সার্ভার ৭ (VidSrc XYZ গ্লোবাল)',
    description: 'স্টেবল মাল্টি-সাবটাইটেল মিরর • হাই অ্যাভেইলেবিলিটি',
    badge: '🌐 Global Mirror',
    badgeColor: 'bg-teal-600',
    getUrl: ({ tmdbId, type, season = 1, episode = 1 }) => {
      if (type === 'tv') {
        return `https://vidsrc.xyz/embed/tv/${tmdbId}/${season}-${episode}`;
      }
      return `https://vidsrc.xyz/embed/movie/${tmdbId}`;
    },
  },
  {
    id: 'vidlink-pro',
    name: 'সার্ভার ৮ (VidLink Pro 4K)',
    description: '৪K আল্ট্রা এইচডি আল্টারনেটিভ • কাস্টম প্লেয়ার কন্ট্রোল',
    badge: '4K Ultra',
    badgeColor: 'bg-red-600',
    getUrl: ({ tmdbId, type, season = 1, episode = 1 }) => {
      if (type === 'tv') {
        return `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?primaryColor=E50914&autoplay=false`;
      }
      return `https://vidlink.pro/movie/${tmdbId}?primaryColor=E50914&autoplay=false`;
    },
  },
  {
    id: 'autoembed-edge',
    name: 'সার্ভার ৯ (AutoEmbed এজ মিরর)',
    description: 'লো লেটেন্সি এজ মিরর • অটো বাফার অপটিমাইজার',
    badge: 'Edge Mirror',
    badgeColor: 'bg-cyan-600',
    getUrl: ({ tmdbId, type, season = 1, episode = 1 }) => {
      if (type === 'tv') {
        return `https://player.autoembed.cc/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://player.autoembed.cc/embed/movie/${tmdbId}`;
    },
  },
  {
    id: 'primesrc',
    name: 'সার্ভার ১০ (PrimeSrc আল্ট্রা)',
    description: 'গ্লোবাল ব্যাকআপ স্ট্রিম • বিকল্প ব্যাকআপ পাথ',
    badge: 'Ultra Stream',
    badgeColor: 'bg-violet-600',
    getUrl: ({ tmdbId, type, season = 1, episode = 1 }) => {
      if (type === 'tv') {
        return `https://primesrc.me/embed/tv?id=${tmdbId}&season=${season}&episode=${episode}`;
      }
      return `https://primesrc.me/embed/movie?id=${tmdbId}`;
    },
  },
];
