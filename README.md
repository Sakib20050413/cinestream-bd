# CineStream BD - Automated Cloud Streaming & Live World TV Platform

একটি আধুনিক, ১০০% স্বয়ংক্রিয় এবং ফুল-স্ট্যাক ভিডিও স্ট্রিমিং ও লাইভ টিভি প্ল্যাটফর্ম। Netflix, Movielinkbd এবং Cinefreak-এর মতো ইউজার ইন্টারফেস এবং আর্কিটেকচারে তৈরি। এখানে কোনো মুভি বা ভিডিও ম্যানুয়ালি আপলোড করার প্রয়োজন পড়ে না; সমস্ত নতুন রিলিজ, হল প্রিন্ট, ওয়েব সিরিজ এবং ১৯৫+ দেশের লাইভ টিভি চ্যানেল এপিআই (API) এবং ক্লাউড এম্বেড ইঞ্জিনের মাধ্যমে স্বয়ংক্রিয়ভাবে আপডেট ও স্ট্রিম হয়।

---

## 🌟 মূল ফিচারসমূহ (Core Features)

1. **Zero-Upload Cloud Embed Architecture:**
   - নিজস্ব সার্ভার স্টোরেজ বা ব্যান্ডউইথের খরচ ছাড়াই আনলিমিটেড মুভি ও টিভি সিরিজ স্ট্রিমিং।
   - ৮টি হাই-স্পিড ক্লাউড এম্বেড ইঞ্জিন ইন্টিগ্রেটেড:
     - **VidLink Pro 4K** (Next-gen fast streaming)
     - **VidSrc VIP** (Ultra-fast CDN)
     - **EmbedSU Cinema** (Multi-quality stream)
     - **MultiEmbed Dual Audio** (Hindi / Bangla / English Dubbed)
     - **2Embed Hall Print** (Day-one theater prints)
     - **AutoEmbed Global** (High reliability backup)
     - **SmashyStream** (Alternate CDN)
     - **VidSrc TO** (Stable legacy server)

2. **Ad-Shield & Anti-Redirect Engine:**
   - থার্ড-পার্টি এম্বেড আইফ্রেমের অনাকাঙ্ক্ষিত পপ-আপ অ্যাড ও রিলিংক রিডাইরেক্ট ব্লক করার জন্য আইফ্রেম স্যান্ডবক্সিং (`allow-scripts allow-same-origin allow-forms`).
   - প্লেয়ারের ভেতরে 'Ad-Shield Active' টগল ও 'Lights Off' (সিনেমা থিয়েটার ডার্ক মোড) বাটন।

3. **লাইভ ওয়ার্ল্ড টিভি (Live World TV Hub - 195+ Countries):**
   - দেশভিত্তিক (বাংলাদেশ, ভারত, ইউএসএ, ইউকে, সৌদি আরব ইত্যাদি) ও ক্যাটাগরিভিত্তিক (News, Sports, Entertainment, Movies, Kids, Music) ৮,০০০+ ওপেন টিভি চ্যানেল।
   - ব্রাউজারে সরাসরি কোনো থার্ড-পার্টি প্লেয়ার ছাড়াই নেটিভ HLS.js ইঞ্জিন দিয়ে লাইভ স্ট্রিমিং।

4. **ঢালিউড, বলিউড, সাউথ ইন্ডিয়ান ও পাকিস্তানি ড্রামা:**
   - ঢালিউডের নতুন রিলিজ (*তুফান*, *সুড়ঙ্গ*, *প্রিয়তমা*, *পরাণ*, *হাওয়া*, *আয়নাবাজি*) সহ এক্সক্লুসিভ বাংলা হাব (`/bangla`)।
   - বলিউড ও সাউথ ইন্ডিয়ান হিন্দি ডাবড মুভি।
   - পাকিস্তানি জনপ্রিয় ড্রামা ও কে-ড্রামা (K-Drama) কালেকশন।

5. **টিভি সিরিজ ও ড্রপডাউন এপিসোড নেভিগেটর:**
   - সিজন এবং এপিসোড সিলেক্ট করলেই স্বয়ংক্রিয়ভাবে প্লেয়ার নির্দিষ্ট এপিসোডে সুইচ করে।

6. **ডাউনলোড ম্যানেজার ও সাবটাইটেল ইঞ্জিন:**
   - 4K, 1080p, 720p ডিরেক্ট স্ট্রিম ডোমেইন লিঙ্ক।
   - সাবটাইটেল (বাংলা ও ইংরেজি) খোঁজার জন্য Subscene / OpenSubtitles ওয়ান-ক্লিক সার্চ লিঙ্ক।

7. **অটোমেটেড ডাটা সিঙ্ক (Automated 6-Hour Cron):**
   - Vercel Cron (`/api/cron/sync`) এর মাধ্যমে প্রতি ৬ ঘণ্টা পরপর নতুন মুভি ও ট্রেন্ডিং কন্টেন্ট স্বয়ংক্রিয়ভাবে রিভ্যালিডেট হয়।

---

## 🛠 টেকনোলজি স্ট্যাক (Tech Stack)

- **Framework:** Next.js 16 (App Router with React 19)
- **Styling:** Tailwind CSS v4 + PostCSS
- **Streaming Players:** Custom Sandboxed Iframe (Movies/Series) + HLS.js (Live TV)
- **Data Source:** TMDB API v3 REST Client + Open IPTV Data
- **Icons:** Lucide React

---

## 🚀 লোকাল ডেভেলপমেন্ট রান করার নিয়ম (Local Setup)

```bash
# ডিপেন্ডেন্সি ইন্সটল করুন (যদি আগে না করা থাকে):
npm install

# ডেভেলপমেন্ট সার্ভার চালু করুন:
npm run dev

# অথবা প্রোডাকশন বিল্ড তৈরি করে চালু করুন:
npm run build
npm start
```

ব্রাউজারে ভিজিট করুন: `http://localhost:3000`

---

## 🌐 ভার্সেল ডিপ্লয় ও ডাটাবেস কানেকশন গাইড (Vercel & Supabase Setup)

### ১. গিটহাব রিপোজিটরিতে কোড পুশ করা
```bash
git init
git add .
git commit -m "feat: complete automated streaming platform"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### ২. ভার্সেলে ১-ক্লিক ডিপ্লয়
1. [vercel.com](https://vercel.com)-এ লগইন করে **Add New Project** সিলেক্ট করুন।
2. আপনার গিটহাব রিপোজিটরিটি ইম্পোর্ট করুন।
3. **Environment Variables** সেকশনে যোগ করুন:
   - `TMDB_API_KEY`: আপনার TMDB এপিআই কি (বিনামূল্যে `themoviedb.org` থেকে পাওয়া যায়)।
   - `CRON_SECRET`: যেকোনো গোপন স্ট্রিং (ক্রন জব সিকিউরিটির জন্য)।
4. **Deploy** বাটনে ক্লিক করুন। ২ মিনিটের মধ্যে আপনার ওয়েবসাইট বিশ্বব্যাপী লাইভ হয়ে যাবে।

### ৩. ডাটাবেস কানেক্ট করা (Supabase / Neon PostgreSQL)
ব্যবহারকারীদের ওয়াচলিস্ট, কাস্টম বুকমার্ক বা ওয়াচ হিস্ট্রি ক্লাউডে সেভ করার জন্য Supabase (বিনামূল্যে PostgreSQL) কানেক্ট করতে পারেন:

```sql
-- Supabase SQL Editor এ রান করার জন্য স্ক্রিপ্ট:
CREATE TABLE IF NOT EXISTS user_watchlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  media_id INTEGER NOT NULL,
  media_type VARCHAR(10) NOT NULL,
  title VARCHAR(255) NOT NULL,
  poster_path TEXT,
  rating NUMERIC(3, 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS watch_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  media_id INTEGER NOT NULL,
  media_type VARCHAR(10) NOT NULL,
  title VARCHAR(255) NOT NULL,
  season_number INTEGER DEFAULT 1,
  episode_number INTEGER DEFAULT 1,
  last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## ⚖️ আইনি নোটিশ (DMCA Disclaimer)
CineStream BD কোনো ভিডিও ফাইল নিজস্ব সার্ভারে আপলোড বা হোস্ট করে না। প্রদর্শিত সমস্ত ভিডিও কনটেন্ট ইন্টারনেটে উন্মুক্ত থাকা থার্ড-পার্টি মিডিয়া সার্ভার এবং এপিআই প্রোভাইডারের মাধ্যমে স্ট্রিমিং হয়।
