import React from 'react';
import { Text, StyleSheet, type TextProps } from 'react-native';
import { brand } from '@/constants/theme';

export function Title({ children, style, ...rest }: TextProps) {
  return (
    <Text style={[styles.title, style]} {...rest}>
      {children}
    </Text>
  );
}

export function Body({ children, style, muted, ...rest }: TextProps & { muted?: boolean }) {
  return (
    <Text style={[styles.body, muted && styles.muted, style]} {...rest}>
      {children}
    </Text>
  );
}

export function Label({ children, style, ...rest }: TextProps) {
  return (
    <Text style={[styles.label, style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    color: brand.text,
    fontFamily: 'Oswald_700Bold',
    fontSize: 28,
    letterSpacing: 0.5,
  },
  body: {
    color: brand.text,
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    lineHeight: 22,
  },
  muted: {
    color: brand.textMuted,
  },
  label: {
    color: brand.textMuted,
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});
