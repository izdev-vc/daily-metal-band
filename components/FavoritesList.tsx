import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { FavoriteBand } from '../hooks/useFavorites';
import { formatDateString } from '../utils/date';

const hornsFull = require('../assets/images/logo-horns.png');
const hornsOutline = require('../assets/images/logo-horns-outline.png');

type Props = {
  favorites: FavoriteBand[];
  onOpen: (activeDate: string) => void;
  onRemove: (activeDate: string) => void;
  onGoToday: () => void;
};

export default function FavoritesList({
  favorites,
  onOpen,
  onRemove,
  onGoToday,
}: Props) {
  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.brand}>FAVORITES</Text>
        </View>
        <View style={styles.empty}>
          <Image source={hornsOutline} style={styles.emptyHorns} resizeMode="contain" />
          <Text style={styles.emptyTitle}>NO FAVORITES YET</Text>
          <Text style={styles.emptyHint}>
            Tap the horns on any band{'\n'}to keep it here.
          </Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={onGoToday}
            activeOpacity={0.7}
          >
            <Text style={styles.emptyBtnText}>GO TO TODAY&apos;S BAND</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const sorted = [...favorites].sort((a, b) =>
    b.activeDate.localeCompare(a.activeDate)
  );

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.brand}>FAVORITES</Text>
      </View>
      <Text style={styles.countLabel}>
        {favorites.length} {favorites.length === 1 ? 'BAND SAVED' : 'BANDS SAVED'}
      </Text>
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.activeDate}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => onOpen(item.activeDate)}
            activeOpacity={0.7}
          >
            <View style={styles.rowMain}>
              <Text style={styles.rowName} numberOfLines={1}>
                {item.name.toUpperCase()}
              </Text>
              <Text style={styles.rowMeta} numberOfLines={1}>
                {item.genre.toUpperCase()} · {item.country.toUpperCase()} ·{' '}
                {item.yearFounded}
              </Text>
            </View>
            <Text style={styles.rowDate}>{formatDateString(item.activeDate)}</Text>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => onRemove(item.activeDate)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Remove from favorites"
            >
              <Image source={hornsFull} style={styles.removeHorns} resizeMode="contain" />
            </TouchableOpacity>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
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
  countLabel: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 10,
    letterSpacing: 2.5,
    color: COLORS.dim,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  rowMain: {
    flex: 1,
    minWidth: 0,
  },
  rowName: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 26,
    letterSpacing: 1,
    lineHeight: 28,
    color: COLORS.bone,
  },
  rowMeta: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9,
    letterSpacing: 2,
    color: COLORS.dim,
    marginTop: 5,
  },
  rowDate: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9,
    letterSpacing: 1.5,
    color: COLORS.faint,
    textAlign: 'right',
  },
  removeBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeHorns: {
    width: 34,
    height: 34 * (430 / 370),
  },
  chevron: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 20,
    color: COLORS.faint,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  emptyHorns: {
    width: 38,
    height: 38 * (430 / 370),
    opacity: 0.7,
    marginBottom: 18,
  },
  emptyTitle: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 22,
    letterSpacing: 2,
    color: COLORS.bone,
    marginBottom: 10,
  },
  emptyHint: {
    fontFamily: 'IBMPlexSans_300Light',
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.dim,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyBtn: {
    borderWidth: 1,
    borderColor: COLORS.amber,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
  emptyBtnText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 14,
    letterSpacing: 3,
    color: COLORS.amber,
  },
});
