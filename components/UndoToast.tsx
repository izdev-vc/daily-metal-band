import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/colors';

type Props = {
  bandName: string;
  animKey: number;
  onUndo: () => void;
};

export default function UndoToast({ bandName, animKey, onUndo }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(10);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();
  }, [animKey, opacity, translateY]);

  return (
    <Animated.View style={[styles.toast, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.textWrap}>
        <Text numberOfLines={1}>
          <Text style={styles.name}>{bandName.toUpperCase()}</Text>
          <Text style={styles.message}> removed from favorites</Text>
        </Text>
      </View>
      <TouchableOpacity style={styles.undoBtn} onPress={onUndo} activeOpacity={0.7}>
        <Text style={styles.undoText}>UNDO</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1a1712',
    borderWidth: 1,
    borderColor: COLORS.line,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.amber,
    paddingVertical: 13,
    paddingHorizontal: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 15,
    letterSpacing: 1.5,
    color: COLORS.bone,
  },
  message: {
    fontFamily: 'IBMPlexSans_300Light',
    fontSize: 13,
    color: COLORS.dim,
  },
  undoBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  undoText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 11,
    letterSpacing: 2,
    color: COLORS.amber,
  },
});
