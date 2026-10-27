import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CineStream BD | Free HD Streaming Platform (Netflix & Movielinkbd Style)',
  description:
    'Watch trending movies, web series, Bengali cinema, and hall hits with multi-server zero-buffering streaming APIs without any uploads.',
  keywords: [
    'netflix bd',
    'movielinkbd',
    'cinefreak',
    'streaming platform',
    'bangla movie stream',
    'toofan movie',
    'free hd movie player',
    'tmdb streaming',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="dark h-full antialiased">
      <body className="min-h-full bg-[#141414] text-white flex flex-col font-sans selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
