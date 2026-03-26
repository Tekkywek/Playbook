import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { brand } from '@/constants/theme';

export function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
  style,
  textStyle,
  accent,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accent?: string;
}) {
  const c = accent ?? brand.blue;
  return (
    <Pressable onPress={onPress} disabled={disabled || loading} style={({ pressed }) => [style, pressed && { opacity: 0.9 }]}>
      <LinearGradient
        colors={[c, brand.red]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.grad, disabled && { opacity: 0.45 }]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.btnText, textStyle]}>{title}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

export function GhostButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.ghost}>
      <Text style={styles.ghostText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  grad: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 16,
  },
  ghost: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  ghostText: {
    color: brand.textMuted,
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 15,
  },
});
