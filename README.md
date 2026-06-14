# 🤘 Daily Metal Band

> One metal band. Every day. Forever.

A mobile app for Android that delivers one handpicked metal band every single day — with genre, essential album, fun fact and a Wikipedia link.

---

## 📱 Download

> Coming soon to Google Play Store

---

## ✨ Features

- 🎸 One new metal band every day
- 🏷️ Genre, country, founding year and active status
- 💿 Essential album recommendation
- 🤘 Fun fact about the band
- 📤 Share today's band with friends
- 🌑 Pure dark UI built for metal fans
- ☁️ Data fetched from the cloud — always fresh

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React Native + Expo | Mobile app (Android) |
| TypeScript | Type-safe code |
| Supabase | Cloud database & API |
| EAS Build | Cloud building & deployment |
| GitHub Actions | Automated Android builds |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 24+
- Expo Go app on your phone

### Installation

Clone the repo and install dependencies:

    git clone https://github.com/izdev-vc/daily-metal-band.git
    cd daily-metal-band
    npm install

### Environment Variables

Create a `.env` file in the root directory:

    EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
    EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

### Run

    npx expo start

Scan the QR code with Expo Go on your phone.

---

## 🗄️ Database Schema

    CREATE TABLE bands (
      id bigint PRIMARY KEY,
      name varchar NOT NULL,
      country varchar NOT NULL,
      year_founded int4,
      is_active bool,
      genre varchar NOT NULL,
      essential_album_title varchar,
      essential_album_year int4,
      fun_fact text,
      wikipedia_url varchar,
      active_date date UNIQUE,
      created_at timestamptz DEFAULT now()
    );

---

## 🔒 Security

- Row Level Security (RLS) enabled on Supabase
- Public read-only access — no user data collected
- API keys stored as environment variables

---

## 📖 Privacy Policy

[Privacy Policy](https://izdev-vc.github.io/daily-metal-band/privacy-policy)

---

## 🎯 What I Learned

My first mobile app, built while learning to code from scratch. Key learnings:

- Building a React Native app with Expo from zero
- Connecting a mobile app to a cloud database (Supabase)
- Row Level Security for API protection
- EAS Build for cloud compilation
- Git & GitHub for version control
- GitHub Actions for automated Android builds

---

## 👤 Author

**izdev-vc**
- GitHub: [@izdev-vc](https://github.com/izdev-vc)

---
