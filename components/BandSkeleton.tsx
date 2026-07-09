import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/colors';

const BARS = [
  { color: COLORS.amber, duration: 900, delay: 0 },
  { color: COLORS.red, duration: 700, delay: 150 },
  { color: COLORS.bone, duration: 1100, delay: 300 },
  { color: COLORS.red, duration: 800, delay: 50 },
  { color: COLORS.amber, duration: 1000, delay: 200 },
];

function EqBar({ color, duration, delay }: (typeof BARS)[number]) {
  const scale = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    const anim = Animated.sequence([
      Animated.delay(delay),
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1,
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.25,
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ),
    ]);
    anim.start();
    return () => anim.stop();
  }, [scale, duration, delay]);

  return (
    <Animated.View
      style={[
        styles.eqBar,
        { backgroundColor: color, transform: [{ scaleY: scale }] },
      ]}
    />
  );
}

export default function BandSkeleton() {
  const flicker = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(700),
        Animated.timing(flicker, { toValue: 0.3, duration: 90, useNativeDriver: true }),
        Animated.timing(flicker, { toValue: 1, duration: 90, useNativeDriver: true }),
        Animated.delay(1000),
        Animated.timing(flicker, { toValue: 0.4, duration: 90, useNativeDriver: true }),
        Animated.timing(flicker, { toValue: 1, duration: 90, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [flicker]);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={[styles.box, styles.boxHeader]} />
      </View>
      <View style={styles.hero}>
        <View style={[styles.box, styles.boxCaption]} />
        <View style={[styles.box, styles.boxName]} />
        <View style={[styles.box, styles.boxDate]} />
      </View>
      <View style={styles.specs}>
        <View style={[styles.box, styles.boxSpec]} />
        <View style={[styles.box, styles.boxSpec]} />
        <View style={[styles.box, styles.boxSpec]} />
      </View>

      <View style={styles.overlay}>
        <View style={styles.eqRow}>
          {BARS.map((bar, i) => (
            <EqBar key={i} {...bar} />
          ))}
        </View>
        <Animated.Text style={[styles.summon, { opacity: flicker }]}>
          SUMMONING TODAY&apos;S BAND
        </Animated.Text>
      </View>
    </View>
  );
}

const SKELETON = '#221f1a';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  box: {
    backgroundColor: SKELETON,
    borderRadius: 2,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    alignItems: 'center',
  },
  boxHeader: {
    width: 150,
    height: 16,
  },
  hero: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  boxCaption: {
    width: 70,
    height: 10,
    marginBottom: 20,
  },
  boxName: {
    width: 190,
    height: 40,
    marginBottom: 20,
  },
  boxDate: {
    width: 60,
    height: 8,
  },
  specs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  boxSpec: {
    flex: 1,
    height: 60,
    margin: 16,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
    backgroundColor: 'rgba(13,13,13,0.72)',
  },
  eqRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
    height: 44,
  },
  eqBar: {
    width: 6,
    height: 44,
    transformOrigin: 'bottom',
  },
  summon: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 10,
    letterSpacing: 4,
    color: COLORS.dim,
  },
});
