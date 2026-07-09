import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
} from '@expo-google-fonts/ibm-plex-mono';
import {
  IBMPlexSans_300Light,
  IBMPlexSans_300Light_Italic,
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
} from '@expo-google-fonts/ibm-plex-sans';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BandSkeleton from '../components/BandSkeleton';
import BottomTabBar, { TabKey } from '../components/BottomTabBar';
import DayStrip from '../components/DayStrip';
import FavoriteButton from '../components/FavoriteButton';
import FavoritesList from '../components/FavoritesList';
import ShareCard from '../components/ShareCard';
import UndoToast from '../components/UndoToast';
import { COLORS } from '../constants/colors';
import { useFavorites } from '../hooks/useFavorites';
import { supabase } from '../services/supabase';
import {
  formatDateString,
  getLocalDateString,
  shiftDateString,
} from '../utils/date';

// Dziś + 7 dni wstecz — starsze wpisy celowo niedostępne
const DAY_STRIP_LENGTH = 8;

// ─── Typ rekordu z bazy ───────────────────────────────────────
type Band = {
  id: number;
  name: string;
  country: string;
  year_founded: number;
  is_active: boolean;
  genre: string;
  essential_album_title: string;
  essential_album_year: number;
  fun_fact: string;
  wikipedia_url: string;
  active_date: string;
};

function SectionLabel({ text, accent }: { text: string; accent?: boolean }) {
  return (
    <View style={styles.seclabel}>
      <View style={styles.seclabelDot} />
      <Text style={[styles.seclabelText, accent && styles.seclabelTextAccent]}>
        {text}
      </Text>
      <View style={styles.seclabelLine} />
    </View>
  );
}

// ─── Ekran główny ─────────────────────────────────────────────
export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    IBMPlexSans_300Light,
    IBMPlexSans_300Light_Italic,
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
  });

  const [selectedDate, setSelectedDate] = useState(() =>
    getLocalDateString(new Date())
  );
  const [tab, setTab] = useState<TabKey>('today');
  const { favorites, isFavorite, toggleFavorite, removeFavorite, undoRemove, toast } =
    useFavorites();
  const [band, setBand] = useState<Band | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [earliestDate, setEarliestDate] = useState<string | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    supabase
      .from('bands')
      .select('active_date')
      .order('active_date', { ascending: true })
      .limit(1)
      .then(({ data }) => {
        if (data?.[0]) setEarliestDate(data[0].active_date);
      });
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    supabase
      .from('bands')
      .select(
        'id, name, country, year_founded, is_active, genre, essential_album_title, essential_album_year, fun_fact, wikipedia_url, active_date'
      )
      .eq('active_date', selectedDate)
      .maybeSingle()
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        setLoading(false);
        if (fetchError) {
          setBand(null);
          setError("No connection.\nCouldn't load\nthe band.");
        } else if (data) {
          setBand(data as Band);
        } else {
          setBand(null);
          setError('No band scheduled\nfor this date.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDate, fetchKey]);

  if (!fontsLoaded) return null;

  const today = getLocalDateString(new Date());
  const isToday = selectedDate === today;

  const dayDates: string[] = [];
  for (let i = DAY_STRIP_LENGTH - 1; i >= 0; i--) {
    const d = shiftDateString(today, -i);
    if (earliestDate && d < earliestDate) continue;
    dayDates.push(d);
  }

  const retry = () => setFetchKey((k) => k + 1);
  const goToday = () => setSelectedDate(today);

  const handleWikipedia = async () => {
    if (!band) return;
    const url = band.wikipedia_url;
    if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
      try {
        await Linking.openURL(url);
      } catch (e) {
        console.log('Cannot open URL:', e);
      }
    }
  };

  const openFavorite = (date: string) => {
    setSelectedDate(date);
    setTab('today');
  };

  const goTodayTab = () => {
    setSelectedDate(today);
    setTab('today');
  };

  const renderToday = () => {
    if (loading) return <BandSkeleton />;

    if (!band) {
      return (
        <View style={styles.errorScreen}>
          <View style={styles.errorBadge}>
            <Text style={styles.errorBang}>!</Text>
          </View>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={retry}
            activeOpacity={0.7}
          >
            <Text style={styles.retryBtnText}>TRY AGAIN</Text>
          </TouchableOpacity>
          {!isToday && (
            <TouchableOpacity
              style={styles.todayPill}
              onPress={goToday}
              activeOpacity={0.7}
            >
              <Text style={styles.todayPillText}>BACK TO TODAY</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.screenContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. TOP HEADER */}
        <View style={styles.top}>
          <Text style={styles.brand}>DAILY METAL BAND</Text>
        </View>

        {/* 2. DAY STRIP */}
        <DayStrip
          dates={dayDates}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />

        {/* 3. HERO */}
        <View style={styles.hero}>
          <Text style={styles.heroCaption}>
            {isToday ? "TODAY'S BAND" : 'FROM THE ARCHIVE'}
          </Text>
          <View style={styles.heroRule} />
          <Text style={styles.bandName} numberOfLines={2} adjustsFontSizeToFit>
            {band.name}
          </Text>
          <View style={styles.heroRule} />
          <Text style={styles.heroDate}>{formatDateString(selectedDate)}</Text>
          <FavoriteButton
            isFavorite={isFavorite(band.active_date)}
            onToggle={() =>
              toggleFavorite({
                activeDate: band.active_date,
                name: band.name,
                genre: band.genre,
                country: band.country,
                yearFounded: band.year_founded,
              })
            }
          />
          {!isToday && (
            <TouchableOpacity
              style={styles.todayPill}
              onPress={goToday}
              activeOpacity={0.7}
            >
              <Text style={styles.todayPillText}>BACK TO TODAY</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 4. SPECS GRID */}
        <View style={styles.specs}>
          <View style={styles.spec}>
            <Text style={styles.specLabel}>FROM</Text>
            <Text style={styles.specValue}>{band.country}</Text>
          </View>
          <View style={[styles.spec, styles.specMid]}>
            <Text style={styles.specLabel}>FOUNDED</Text>
            <Text style={styles.specValue}>{band.year_founded}</Text>
          </View>
          <View style={styles.spec}>
            <Text style={styles.specLabel}>STATUS</Text>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  band.is_active ? styles.statusDotActive : styles.statusDotInactive,
                ]}
              />
              <Text
                style={[styles.specValue, !band.is_active && styles.specValueDim]}
              >
                {band.is_active ? 'ACTIVE' : 'INACTIVE'}
              </Text>
            </View>
          </View>
        </View>

        {/* 5. GENRE */}
        <View style={styles.block}>
          <SectionLabel text="GENRE" />
          <View style={styles.genreBox}>
            <Text style={styles.genreName}>{band.genre.toUpperCase()}</Text>
          </View>
        </View>

        {/* 6. ESSENTIAL ALBUM */}
        <LinearGradient
          colors={['rgba(217,164,65,0.14)', 'rgba(217,164,65,0.03)', 'rgba(217,164,65,0)']}
          locations={[0, 0.55, 1]}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.block}
        >
          <SectionLabel text="ESSENTIAL ALBUM" accent />
          <Text style={styles.albumTitle}>
            {band.essential_album_title.toUpperCase()}
          </Text>
          <Text style={styles.albumYear}>RELEASED {band.essential_album_year}</Text>
        </LinearGradient>

        {/* 7. DID YOU KNOW */}
        <View style={styles.block}>
          <SectionLabel text="DID YOU KNOW" />
          <Text style={styles.pullquote}>{band.fun_fact}</Text>
        </View>

        {/* 8. ACTIONS */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary]}
            onPress={handleWikipedia}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>↗  READ ON WIKIPEDIA</Text>
          </TouchableOpacity>
          <ShareCard
            bandName={band.name}
            genre={band.genre}
            country={band.country}
            foundedYear={band.year_founded}
          />
        </View>

        {/* 9. FOOTER */}
        <Text style={styles.footnote}>— DAILY METAL BAND —</Text>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {tab === 'today' ? (
          renderToday()
        ) : (
          <FavoritesList
            favorites={favorites}
            onOpen={openFavorite}
            onRemove={removeFavorite}
            onGoToday={goTodayTab}
          />
        )}
        {toast && (
          <UndoToast
            bandName={toast.favorite.name}
            animKey={toast.key}
            onUndo={undoRemove}
          />
        )}
      </View>
      <BottomTabBar
        tab={tab}
        favoritesCount={favorites.length}
        onChange={setTab}
      />
    </SafeAreaView>
  );
}

// ─── Style ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  screenContent: {
    paddingBottom: 24,
  },

  // TOP HEADER
  top: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    alignItems: 'center',
  },
  brand: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 26,
    letterSpacing: 6,
    color: COLORS.bone,
  },

  // HERO
  hero: {
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  heroCaption: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 11,
    letterSpacing: 3,
    color: COLORS.dim,
    marginBottom: 16,
  },
  heroRule: {
    width: 60,
    height: 2,
    backgroundColor: COLORS.amber,
    marginVertical: 16,
  },
  bandName: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 64,
    lineHeight: 64,
    letterSpacing: 1,
    color: COLORS.bone,
    textAlign: 'center',
  },
  heroDate: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 10,
    letterSpacing: 3,
    color: COLORS.faint,
  },
  todayPill: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: COLORS.amber,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  todayPillText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 10,
    letterSpacing: 2,
    color: COLORS.amber,
  },

  // SPECS
  specs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  spec: {
    flex: 1,
    paddingVertical: 22,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  specMid: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.line,
  },
  specLabel: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9,
    letterSpacing: 2.5,
    color: COLORS.dim,
    marginBottom: 10,
  },
  specValue: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
    letterSpacing: 1,
    color: COLORS.bone,
  },
  specValueDim: {
    color: COLORS.dim,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusDotActive: {
    backgroundColor: COLORS.moss,
  },
  statusDotInactive: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.dim,
  },

  // BLOCK
  block: {
    paddingHorizontal: 24,
    paddingVertical: 26,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  seclabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  seclabelDot: {
    width: 6,
    height: 6,
    backgroundColor: COLORS.amber,
  },
  seclabelText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9,
    letterSpacing: 2.5,
    color: COLORS.dim,
  },
  seclabelTextAccent: {
    color: COLORS.amber,
  },
  seclabelLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.line,
  },

  // GENRE
  genreBox: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.amber,
  },
  genreName: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 24,
    letterSpacing: 1.5,
    color: COLORS.bone,
  },

  // ALBUM
  albumTitle: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 32,
    letterSpacing: 1.5,
    color: COLORS.bone,
  },
  albumYear: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 10,
    letterSpacing: 2,
    color: COLORS.dim,
  },

  // DID YOU KNOW
  pullquote: {
    fontFamily: 'IBMPlexSans_300Light_Italic',
    fontSize: 14.5,
    lineHeight: 22,
    color: COLORS.bone,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.amber,
    paddingLeft: 16,
  },

  // ACTIONS
  actions: {
    paddingHorizontal: 24,
    paddingVertical: 26,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  btn: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: COLORS.red,
  },
  btnPrimaryText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    letterSpacing: 3,
    color: '#fff',
  },
  // ERROR
  errorScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 28,
  },
  errorBadge: {
    width: 38,
    height: 38,
    borderWidth: 2,
    borderColor: COLORS.bone,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorBang: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 20,
    color: COLORS.bone,
  },
  errorText: {
    fontFamily: 'IBMPlexSans_300Light',
    fontSize: 14.5,
    lineHeight: 23,
    color: COLORS.dim,
    textAlign: 'center',
    marginBottom: 26,
  },
  retryBtn: {
    borderWidth: 1,
    borderColor: COLORS.amber,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
  retryBtnText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 14,
    letterSpacing: 3,
    color: COLORS.amber,
  },

  // FOOTER
  footnote: {
    textAlign: 'center',
    paddingVertical: 18,
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9,
    letterSpacing: 2.5,
    color: COLORS.bone,
    opacity: 0.4,
  },
});