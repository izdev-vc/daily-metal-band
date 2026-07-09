import { useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../constants/colors';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

type Props = {
  dates: string[];
  selectedDate: string;
  onSelect: (date: string) => void;
};

export default function DayStrip({ dates, selectedDate, onSelect }: Props) {
  const scrollRef = useRef<ScrollView>(null);

  return (
    <View style={styles.wrap}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: false })
        }
      >
        {dates.map((date) => {
          const [y, m, d] = date.split('-').map(Number);
          const weekday = WEEKDAYS[new Date(y, m - 1, d).getDay()];
          const selected = date === selectedDate;
          return (
            <TouchableOpacity
              key={date}
              onPress={() => onSelect(date)}
              activeOpacity={0.7}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text
                style={[
                  styles.chipWeekday,
                  selected && styles.chipWeekdaySelected,
                ]}
              >
                {weekday}
              </Text>
              <Text style={[styles.chipNum, selected && styles.chipNumSelected]}>
                {String(d).padStart(2, '0')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  strip: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    width: 44,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  chipSelected: {
    borderColor: COLORS.amber,
    backgroundColor: 'rgba(217,164,65,0.12)',
  },
  chipWeekday: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 8,
    letterSpacing: 1,
    color: COLORS.dim,
  },
  chipWeekdaySelected: {
    color: COLORS.amber,
  },
  chipNum: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 17,
    color: COLORS.dim,
  },
  chipNumSelected: {
    color: COLORS.bone,
  },
});
