import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Radio, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black/95 border-t border-zinc-900 text-zinc-400 text-xs py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Brand & Disclaimer */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-900 pb-8">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <div className="w-8 h-8 rounded bg-[#E50914] flex items-center justify-center font-black text-white text-base shadow-red-600/40 shadow">
                C
              </div>
              <span className="font-black text-lg tracking-wider text-white">
                CINE<span className="text-[#E50914]">STREAM</span> BD
              </span>
            </div>
            <p className="text-zinc-500 max-w-lg text-[11px] leading-relaxed">
              স্বয়ংক্রিয় অনলাইন ভিডিও স্ট্রিমিং প্লাটফর্ম। এই সাইটে কোনো ভিডিও ফাইল হোস্ট বা আপলোড করা হয় না। সমস্ত মুভি ও সিরিজের কনটেন্ট সরাসরি এক্সটার্নাল এপিআই ও ক্লাউড সিডিএন এর মাধ্যমে পরিবেশন করা হয়।
            </p>
          </div>

          <div className="flex items-center gap-6 text-zinc-400 text-xs">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>DMCA Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-red-500">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Live World TV Satellites</span>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <h4 className="text-white font-semibold mb-3">Categories</h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <Link href="/movies" className="hover:text-white transition">
                  Hollywood & Bollywood
                </Link>
              </li>
              <li>
                <Link href="/bangla" className="hover:text-white transition">
                  বাংলা সিনেমা (Dhallywood)
                </Link>
              </li>
              <li>
                <Link href="/tv" className="hover:text-white transition">
                  Web Series & TV Shows
                </Link>
              </li>
              <li>
                <Link href="/live-tv" className="hover:text-white transition flex items-center gap-1 text-red-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Live Satellite TV (195+ Countries)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Cloud Streaming Engines</h4>
            <ul className="space-y-2 text-zinc-400">
              <li>Server Alpha (VidLink Pro 4K)</li>
              <li>Server Beta (VidSrc VIP FHD)</li>
              <li>Server Gamma (EmbedSU Cinema)</li>
              <li>Server Delta (MultiEmbed Dual Audio)</li>
              <li>Server Epsilon (2Embed Hall Releases)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Special Cinema Hubs</h4>
            <ul className="space-y-2 text-zinc-400">
              <li>Toofan (তুফান) & Priyotoma</li>
              <li>Hawa (হাওয়া) & Surongo</li>
              <li>South Indian Hindi Dubbed</li>
              <li>Pakistani Dramas</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home (হোম)
                </Link>
              </li>
              <li>
                <Link href="/my-list" className="hover:text-white transition">
                  My Watchlist
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition">
                  Search Engine
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-900 text-center text-zinc-400 text-[11px]">
          © {new Date().getFullYear()} CineStream BD. Zero-Upload Automated Streaming Platform.
        </div>
      </div>
    </footer>
  );
}
