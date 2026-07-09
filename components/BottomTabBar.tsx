import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/colors';

export type TabKey = 'today' | 'favorites';

type Props = {
  tab: TabKey;
  favoritesCount: number;
  onChange: (tab: TabKey) => void;
};

export default function BottomTabBar({ tab, favoritesCount, onChange }: Props) {
  return (
    <View style={styles.bar}>
      <TouchableOpacity
        style={[styles.tab, tab === 'today' && styles.tabActive]}
        onPress={() => onChange('today')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, tab === 'today' && styles.tabTextActive]}>
          TODAY
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, tab === 'favorites' && styles.tabActive]}
        onPress={() => onChange('favorites')}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.tabText, tab === 'favorites' && styles.tabTextActive]}
        >
          FAVORITES
        </Text>
        {favoritesCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{favoritesCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    backgroundColor: COLORS.bg,
  },
  tab: {
    flex: 1,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderTopWidth: 2,
    borderTopColor: 'transparent',
    marginTop: -1,
  },
  tabActive: {
    borderTopColor: COLORS.amber,
  },
  tabText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 14,
    letterSpacing: 3,
    color: COLORS.dim,
  },
  tabTextActive: {
    color: COLORS.bone,
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.amber,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 10,
    color: COLORS.bg,
  },
});
