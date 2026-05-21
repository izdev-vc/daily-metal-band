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
import { createClient } from '@supabase/supabase-js';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import {
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ShareCard from '../components/ShareCard';

// ─── Supabase ─────────────────────────────────────────────────
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

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

// ─── Helpers ──────────────────────────────────────────────────
function formatDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function SectionLabel({ text }: { text: string }) {
  return (
    <View style={styles.seclabel}>
      <View style={styles.seclabelDot} />
      <Text style={styles.seclabelText}>{text}</Text>
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

  const [band, setBand] = useState<Band | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    supabase
      .from('bands')
      .select(
        'id, name, country, year_founded, is_active, genre, essential_album_title, essential_album_year, fun_fact, wikipedia_url, active_date'
      )
      .eq('active_date', today)
      .single()
      .then(({ data }) => {
        if (data) setBand(data as Band);
      });
  }, []);

  if (!fontsLoaded || !band) return null;

  const handleShare = async () => {
    await Share.share({
      message:
        `Today's metal band: ${band.name} — from ${band.country}, founded ${band.year_founded}.\n` +
        `Genre: ${band.genre}.\n` +
        `Essential album: ${band.essential_album_title} (${band.essential_album_year}).\n\n` +
        `Daily Metal Band`
        // Odkomentować po publikacji aplikacji w Google Play. Zastąp PACKAGE_NAME prawdziwym package name z app.json.
        // + `\n\nhttps://play.google.com/store/apps/details?id=PACKAGE_NAME`,
    });
  };

  const handleWikipedia = async () => {
    if (band.wikipedia_url) {
      try {
        await Linking.openURL(band.wikipedia_url);
      } catch (e) {
        console.log('Cannot open URL:', e);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.screenContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. TOP HEADER */}
        <View style={styles.top}>
          <Text style={styles.brand}>DAILY METAL BAND</Text>
        </View>

        {/* 2. HERO */}
        <View style={styles.hero}>
          <Text style={styles.heroCaption}>TODAY'S BAND</Text>
          <View style={styles.heroRule} />
          <Text style={styles.bandName} numberOfLines={2} adjustsFontSizeToFit>
            {band.name}
          </Text>
          <View style={styles.heroRule} />
          <Text style={styles.heroDate}>{formatDate(new Date())}</Text>
        </View>

        {/* 3. SPECS GRID */}
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
              <Text style={styles.specValue}>
                {band.is_active ? 'ACTIVE' : 'INACTIVE'}
              </Text>
            </View>
          </View>
        </View>

        {/* 4. GENRE */}
        <View style={styles.block}>
          <SectionLabel text="GENRE" />
          <View style={styles.genreBox}>
            <Text style={styles.genreName}>{band.genre.toUpperCase()}</Text>
          </View>
        </View>

        {/* 5. ESSENTIAL ALBUM */}
        <View style={styles.block}>
          <SectionLabel text="ESSENTIAL ALBUM" />
          <Text style={styles.albumTitle}>
            {band.essential_album_title.toUpperCase()}
          </Text>
          <Text style={styles.albumYear}>RELEASED {band.essential_album_year}</Text>
        </View>

        {/* 6. DID YOU KNOW */}
        <View style={styles.block}>
          <SectionLabel text="DID YOU KNOW" />
          <Text style={styles.pullquote}>{band.fun_fact}</Text>
        </View>

        {/* 7. ACTIONS */}
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

        {/* 8. FOOTER */}
        <Text style={styles.footnote}>— DAILY METAL BAND —</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Style ────────────────────────────────────────────────────
const COLORS = {
  bg: '#0d0d0d',
  red: '#cc0000',
  amber: '#d9a441',
  bone: '#e8dcc4',
  dim: '#8a8579',
  faint: '#4a4640',
  line: '#2a2722',
  moss: '#6cd47e',
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
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
    paddingVertical: 40,
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
    marginBottom: 18,
  },
  heroRule: {
    width: 60,
    height: 2,
    backgroundColor: COLORS.amber,
    marginVertical: 18,
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    backgroundColor: COLORS.red,
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
    fontSize: 26,
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
  btnSecondary: {
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: 'transparent',
  },
  btnSecondaryText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    letterSpacing: 3,
    color: COLORS.bone,
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