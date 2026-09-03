import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

export function StatCard({
  title,
  value,
  change,
  icon,
  tone = 'blue',
  isPositive = true,
}: {
  title: string;
  value: string;
  change: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  tone?: 'blue' | 'green' | 'amber' | 'red';
  isPositive?: boolean;
}) {
  const toneConfig = {
    blue: {
      border: theme.colors.brand.primary,
      iconBg: theme.colors.brand.light,
      iconColor: theme.colors.brand.primary,
    },
    green: {
      border: theme.colors.emerald.primary,
      iconBg: theme.colors.emerald.light,
      iconColor: theme.colors.emerald.primary,
    },
    amber: {
      border: theme.colors.amber.primary,
      iconBg: theme.colors.amber.light,
      iconColor: theme.colors.amber.primary,
    },
    red: {
      border: theme.colors.rose.primary,
      iconBg: theme.colors.rose.light,
      iconColor: theme.colors.rose.primary,
    },
  }[tone];

  return (
    <View style={[styles.card, { borderLeftColor: toneConfig.border }]}>
      <View style={styles.topRow}>
        <View style={styles.content}>
          <Text style={styles.title}>{title.toUpperCase()}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
        <View style={[styles.iconBox, { backgroundColor: toneConfig.iconBg }]}>
          <MaterialCommunityIcons name={icon} size={22} color={toneConfig.iconColor} />
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.trendRow}>
          <MaterialCommunityIcons
            name={isPositive ? 'arrow-top-right' : 'arrow-bottom-right'}
            size={14}
            color={tone === 'red' ? (isPositive ? theme.colors.rose.primary : theme.colors.emerald.primary) : isPositive ? theme.colors.emerald.primary : theme.colors.rose.primary}
          />
          <Text
            style={[
              styles.change,
              {
                color:
                  tone === 'red'
                    ? isPositive
                      ? theme.colors.rose.primary
                      : theme.colors.emerald.primary
                    : isPositive
                    ? theme.colors.emerald.primary
                    : theme.colors.rose.primary,
              },
            ]}
          >
            {change}
          </Text>
          <Text style={styles.period}>vs. last month</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderLeftWidth: 4,
    marginBottom: 12,
    ...theme.shadows.card,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: theme.colors.textMuted,
  },
  value: {
    fontSize: 26,
    fontWeight: '900',
    color: theme.colors.text,
    marginTop: 4,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceSubtle,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  change: {
    fontSize: 12,
    fontWeight: '700',
  },
  period: {
    fontSize: 11,
    color: theme.colors.textSubtle,
    marginLeft: 2,
  },
});

