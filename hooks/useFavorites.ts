import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { track } from '../services/analytics';

const STORAGE_KEY = 'favorites:v1';
const TOAST_DURATION_MS = 5000;

export type FavoriteBand = {
  activeDate: string;
  name: string;
  genre: string;
  country: string;
  yearFounded: number;
  savedAt: string;
};

export type RemovalToast = {
  favorite: FavoriteBand;
  key: number;
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteBand[]>([]);
  const [toast, setToast] = useState<RemovalToast | null>(null);
  const loaded = useRef(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setFavorites(JSON.parse(raw) as FavoriteBand[]);
        } catch {
          // uszkodzony zapis — zaczynamy od pustej listy
        }
      }
      loaded.current = true;
    });
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)).catch(() => {
      // brak miejsca / IO — ulubione zostają w pamięci do końca sesji
    });
  }, [favorites]);

  const isFavorite = useCallback(
    (activeDate: string) => favorites.some((f) => f.activeDate === activeDate),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (band: Omit<FavoriteBand, 'savedAt'>) => {
      const exists = favorites.some((f) => f.activeDate === band.activeDate);
      track(exists ? 'favorite_removed' : 'favorite_added', {
        band_name: band.name,
        source: 'toggle',
      });
      setFavorites((prev) =>
        exists
          ? prev.filter((f) => f.activeDate !== band.activeDate)
          : [...prev, { ...band, savedAt: new Date().toISOString() }]
      );
    },
    [favorites]
  );

  const removeFavorite = useCallback(
    (activeDate: string) => {
      const removed = favorites.find((f) => f.activeDate === activeDate);
      if (!removed) return;
      track('favorite_removed', { band_name: removed.name, source: 'list' });
      setFavorites((prev) => prev.filter((f) => f.activeDate !== activeDate));
      setToast((t) => ({ favorite: removed, key: (t?.key ?? 0) + 1 }));
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    },
    [favorites]
  );

  const undoRemove = useCallback(() => {
    if (!toast) return;
    if (toastTimer.current) clearTimeout(toastTimer.current);
    track('favorite_added', { band_name: toast.favorite.name, source: 'undo' });
    setFavorites((prev) =>
      prev.some((f) => f.activeDate === toast.favorite.activeDate)
        ? prev
        : [...prev, toast.favorite]
    );
    setToast(null);
  }, [toast]);

  return { favorites, isFavorite, toggleFavorite, removeFavorite, undoRemove, toast };
}
