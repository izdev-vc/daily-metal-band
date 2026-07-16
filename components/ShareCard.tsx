import * as Sharing from 'expo-sharing';
import React, { useRef, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import { COLORS } from '../constants/colors';
import { track } from '../services/analytics';

type Props = {
  bandName: string;
  genre: string;
  country: string;
  foundedYear: string | number;
};

export default function ShareCard({ bandName, genre, country, foundedYear }: Props) {
  const cardRef = useRef<ViewShot>(null);
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const uri = await cardRef.current?.capture?.();
      if (!uri) return;

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert('Udostępnianie niedostępne na tym urządzeniu');
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Udostępnij zespół dnia',
      });
      track('share_card_shared', { band_name: bandName });
    } catch {
      Alert.alert('Błąd', 'Nie udało się wygenerować karty.');
    } finally {
      setSharing(false);
    }
  };

  return (
    <View>
      {/* Ukryta karta — renderowana poza ekranem */}
      <ViewShot
        ref={cardRef}
        options={{ format: 'png', quality: 1.0 }}
        style={styles.cardWrapper}
      >
        <View style={styles.card}>
          <View style={styles.bgAccent} />

          <Text style={styles.labelTop}>DAILY METAL BAND</Text>
          <View style={styles.rule} />
          <Text style={styles.bandName}>{bandName.toUpperCase()}</Text>
          <View style={styles.rule} />

          <View style={styles.details}>
            <View style={styles.detail}>
              <Text style={styles.detailLabel}>GENRE</Text>
              <Text style={styles.detailValue}>{genre.toUpperCase()}</Text>
            </View>
            <View style={styles.detailSep} />
            <View style={styles.detail}>
              <Text style={styles.detailLabel}>FROM</Text>
              <Text style={styles.detailValue}>{country.toUpperCase()}</Text>
            </View>
            <View style={styles.detailSep} />
            <View style={styles.detail}>
              <Text style={styles.detailLabel}>SINCE</Text>
              <Text style={styles.detailValue}>{foundedYear}</Text>
            </View>
          </View>

          <Text style={styles.footer}>dailymetalband.app</Text>
        </View>
      </ViewShot>

      {/* Przycisk widoczny dla użytkownika */}
      <TouchableOpacity
        style={[styles.btn, sharing && styles.btnSharing]}
        onPress={handleShare}
        disabled={sharing}
        activeOpacity={0.85}
      >
        <Text style={[styles.btnText, sharing && styles.btnTextSharing]}>
          {sharing ? 'GENERATING...' : '↗  SHARE CARD'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    position: 'absolute',
    top: -9999,
    left: -9999,
    width: 1080,
    height: 1920,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 80,
    position: 'relative',
    overflow: 'hidden',
  },
  bgAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: COLORS.amberGlow,
    borderTopLeftRadius: 600,
    borderTopRightRadius: 600,
  },
  labelTop: {
    fontFamily: 'System',
    fontSize: 28,
    letterSpacing: 12,
    color: COLORS.dim,
    marginBottom: 40,
    textAlign: 'center',
  },
  rule: {
    width: 120,
    height: 3,
    backgroundColor: COLORS.amber,
    marginVertical: 40,
  },
  bandName: {
    fontFamily: 'System',
    fontSize: 160,
    fontWeight: '900',
    color: COLORS.bone,
    textAlign: 'center',
    lineHeight: 155,
    letterSpacing: 4,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 40,
  },
  detail: {
    alignItems: 'center',
    gap: 12,
  },
  detailLabel: {
    fontFamily: 'System',
    fontSize: 22,
    letterSpacing: 6,
    color: COLORS.dim,
  },
  detailValue: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.bone,
    letterSpacing: 2,
  },
  detailSep: {
    width: 2,
    height: 60,
    backgroundColor: COLORS.line,
  },
  footer: {
    position: 'absolute',
    bottom: 80,
    fontFamily: 'System',
    fontSize: 24,
    letterSpacing: 6,
    color: COLORS.faint,
  },
  btn: {
    borderWidth: 1.5,
    borderColor: COLORS.bone,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSharing: {
    borderColor: '#444',
    opacity: 0.6,
  },
  btnText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
    letterSpacing: 3,
    color: COLORS.bone,
  },
  btnTextSharing: {
    color: '#666',
  },
});
