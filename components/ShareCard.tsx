import * as Sharing from 'expo-sharing';
import React, { useRef } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ViewShot from 'react-native-view-shot';

type Props = {
  bandName: string;
  genre: string;
  country: string;
  foundedYear: string | number;
};

export default function ShareCard({ bandName, genre, country, foundedYear }: Props) {
  const cardRef = useRef<ViewShot>(null);

  const handleShare = async () => {
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
    } catch (e) {
      Alert.alert('Błąd', 'Nie udało się wygenerować karty.');
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
          {/* Tło z gradientem */}
          <View style={styles.bgAccent} />

          {/* Górna etykieta */}
          <Text style={styles.labelTop}>DAILY METAL BAND</Text>

          {/* Linia */}
          <View style={styles.rule} />

          {/* Nazwa zespołu */}
          <Text style={styles.bandName}>{bandName.toUpperCase()}</Text>

          {/* Linia */}
          <View style={styles.rule} />

          {/* Detale */}
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

          {/* Stopka */}
          <Text style={styles.footer}>dailymetalband.app</Text>
        </View>
      </ViewShot>

      {/* Przycisk widoczny dla użytkownika */}
      <TouchableOpacity style={styles.btn} onPress={handleShare}>
        <Text style={styles.btnText}>↗ SHARE CARD</Text>
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
    backgroundColor: '#0d0d0d',
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
    backgroundColor: 'rgba(217,164,65,0.05)',
    borderTopLeftRadius: 600,
    borderTopRightRadius: 600,
  },
  labelTop: {
    fontFamily: 'System',
    fontSize: 28,
    letterSpacing: 12,
    color: '#8a8579',
    marginBottom: 40,
    textAlign: 'center',
  },
  rule: {
    width: 120,
    height: 3,
    backgroundColor: '#d9a441',
    marginVertical: 40,
  },
  bandName: {
    fontFamily: 'System',
    fontSize: 160,
    fontWeight: '900',
    color: '#e8dcc4',
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
    color: '#8a8579',
  },
  detailValue: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '700',
    color: '#e8dcc4',
    letterSpacing: 2,
  },
  detailSep: {
    width: 2,
    height: 60,
    backgroundColor: '#2a2722',
  },
  footer: {
    position: 'absolute',
    bottom: 80,
    fontFamily: 'System',
    fontSize: 24,
    letterSpacing: 6,
    color: '#4a4640',
  },
  btn: {
    backgroundColor: '#cc0000',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 3,
  },
});