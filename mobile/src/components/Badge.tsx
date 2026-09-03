import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import type { Status, CheckStatus } from '../types';

export function Badge({
  status,
  size = 'md',
}: {
  status: Status | CheckStatus | string;
  size?: 'sm' | 'md';
}) {
  const norm = status.toUpperCase();
  const isCompliant = norm === 'COMPLIANT' || norm === 'PASS';
  const isViolation = norm === 'VIOLATION' || norm === 'FAIL';
  const isWarning = norm === 'NEEDS REVIEW' || norm === 'WARNING' || norm === 'REVIEW';

  const colors = isCompliant
    ? {
        bg: theme.colors.emerald.light,
        border: theme.colors.emerald.border,
        text: theme.colors.emerald.text,
        dot: theme.colors.emerald.primary,
      }
    : isViolation
    ? {
        bg: theme.colors.rose.light,
        border: theme.colors.rose.border,
        text: theme.colors.rose.text,
        dot: theme.colors.rose.primary,
      }
    : isWarning
    ? {
        bg: theme.colors.amber.light,
        border: theme.colors.amber.border,
        text: theme.colors.amber.text,
        dot: theme.colors.amber.primary,
      }
    : {
        bg: theme.colors.surfaceSubtle,
        border: theme.colors.border,
        text: theme.colors.textMuted,
        dot: theme.colors.textSubtle,
      };

  return (
    <View
      style={[
        styles.badge,
        size === 'sm' ? styles.badgeSm : styles.badgeMd,
        { backgroundColor: colors.bg, borderColor: colors.border },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: colors.dot }]} />
      <Text
        style={[
          styles.text,
          size === 'sm' ? styles.textSm : styles.textMd,
          { color: colors.text },
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: theme.radius.full,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    gap: 4,
  },
  badgeMd: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  textSm: {
    fontSize: 10,
  },
  textMd: {
    fontSize: 11,
  },
});

