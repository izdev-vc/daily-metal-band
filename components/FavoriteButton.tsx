import { useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet } from 'react-native';

const hornsFull = require('../assets/images/logo-horns.png');
const hornsOutline = require('../assets/images/logo-horns-outline.png');

type Props = {
  isFavorite: boolean;
  onToggle: () => void;
};

export default function FavoriteButton({ isFavorite, onToggle }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    scale.setValue(1);
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.35, duration: 140, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 210, useNativeDriver: true }),
    ]).start();
    onToggle();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={styles.hitbox}
      accessibilityRole="button"
      accessibilityLabel={
        isFavorite ? 'Remove from favorites' : 'Add to favorites'
      }
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Image
          source={isFavorite ? hornsFull : hornsOutline}
          style={styles.horns}
          resizeMode="contain"
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hitbox: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horns: {
    width: 34,
    height: 34 * (430 / 370),
  },
});
