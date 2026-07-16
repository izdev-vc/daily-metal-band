import PostHog from 'posthog-react-native';

const apiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com';

// Brak klucza wyłącza analitykę zamiast wywalać apkę — dev bez .env ma działać normalnie
export const posthog = apiKey ? new PostHog(apiKey, { host }) : null;

export type AnalyticsEvent =
  | 'band_viewed'
  | 'band_load_failed'
  | 'wikipedia_opened'
  | 'share_card_shared'
  | 'favorite_added'
  | 'favorite_removed'
  | 'favorites_tab_opened';

export function track(
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean>
): void {
  posthog?.capture(event, properties);
}
