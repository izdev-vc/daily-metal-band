# Daily Metal Band — Claude Code Config

## Project overview
React Native + Expo app (Android-first, iOS planned) that shows one metal band per day.
Backend: Supabase (PostgreSQL). Build: EAS. Target: Google Play Store.

## Stack
- **Runtime**: React Native 0.81 / Expo ~54 / Expo Router ~6
- **Language**: TypeScript ~5.9
- **Backend**: Supabase JS v2 (anon key, RLS-protected)
- **Analytics**: PostHog (EU cloud, `posthog-react-native`)
- **Fonts**: Bebas Neue, IBM Plex Mono, IBM Plex Sans (via @expo-google-fonts)
- **Build/Deploy**: EAS Build + EAS Submit

## Project structure
```
app/
  _layout.tsx        # Root layout (Expo Router)
  index.tsx          # Main screen (HomeScreen)
components/
  ShareCard.tsx      # Share card rendered via ViewShot
  ui/                # Generic UI primitives
services/
  supabase.ts        # Supabase client (single source of truth)
  analytics.ts       # PostHog client + typed track() (single source of truth)
assets/              # Images, fonts
android/             # Android native project
```

## Database (Supabase)
Table: `bands`
```sql
id              bigint PK
name            varchar
country         varchar
year_founded    int4
is_active       bool
genre           varchar
essential_album_title  varchar
essential_album_year   int4
fun_fact        text
wikipedia_url   varchar
active_date     date UNIQUE  -- one band per day
created_at      timestamptz
```

## Dev commands
```bash
npx expo start          # Dev server (scan QR in Expo Go)
npx expo run:android    # Run on Android emulator/device
npx expo lint           # ESLint
eas build --platform android --profile preview  # Cloud build
```

## Environment variables
Required in `.env` (never commit):
```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_POSTHOG_API_KEY=...   # phc_... project key; empty = analytics disabled (no-op)
```
`EXPO_PUBLIC_` prefix = bundled into the app (visible to users). Anon key only — no service role key ever.
Optional: `EXPO_PUBLIC_POSTHOG_HOST` (defaults to `https://eu.i.posthog.com`).

## Code style
- TypeScript strict, no `any`
- No default export from `services/supabase.ts` — use named export `supabase`
- Do NOT create a second Supabase client in components/screens — import from `services/supabase.ts`
- Analytics: always go through `track()` from `services/analytics.ts` — new event names must be added to the `AnalyticsEvent` union, snake_case
- Styles: `StyleSheet.create()` with a `COLORS` constant at the bottom of each file
- Dark UI only (`#0d0d0d` background, `#e8dcc4` text)
- No comments explaining *what* the code does — only *why* for non-obvious decisions

## Committing
When asked to commit:
1. Stage only relevant files (never `.env`, `node_modules`, `android/gradle.properties`, keystore files)
2. Write commit message in English, conventional commits format: `type: short description`
   - Types: `feat`, `fix`, `refactor`, `style`, `chore`, `docs`
3. Push to `main` after commit

## Known issues / TODOs
- `app/index.tsx` initializes its own Supabase client — should use `services/supabase.ts`
- Play Store URL in `handleShare` is commented out — add after app is published
