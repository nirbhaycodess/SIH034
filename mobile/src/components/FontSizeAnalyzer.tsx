import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

interface FontCheck {
  field: string;
  measuredMm: number;
  mandatedMm: number;
  status: 'PASS' | 'WARNING' | 'FAIL';
  ruleRef: string;
  details: string;
}

const fontChecks: Record<string, FontCheck> = {
  net_quantity: {
    field: 'Net Quantity',
    measuredMm: 4.2,
    mandatedMm: 4.0,
    status: 'PASS',
    ruleRef: 'Rule 9 & Second Schedule, Table 1',
    details: 'For 340ml package, minimum mandated height is 4.0mm. Measured: 4.2mm.',
  },
  mrp: {
    field: 'MRP & Taxes',
    measuredMm: 2.8,
    mandatedMm: 2.0,
    status: 'PASS',
    ruleRef: 'Rule 6(1)(e) & Rule 9(2)',
    details: 'Conforms to minimum permissible size for secondary price text.',
  },
  consumer_care: {
    field: 'Consumer Care',
    measuredMm: 1.2,
    mandatedMm: 2.0,
    status: 'FAIL',
    ruleRef: 'Rule 9(1) Readability & Contrast',
    details: 'Helpline font size is 1.2mm, which falls below the statutory 2.0mm threshold.',
  },
  manufacturer: {
    field: 'Manufacturer',
    measuredMm: 2.1,
    mandatedMm: 2.0,
    status: 'PASS',
    ruleRef: 'Rule 6(1)(a) & Rule 9(1)',
    details: 'Meets minimum height requirement with clear foreground contrast ratio.',
  },
};

export function FontSizeAnalyzer() {
  const [selectedKey, setSelectedKey] = useState<string>('net_quantity');
  const active = fontChecks[selectedKey] || fontChecks.net_quantity;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <MaterialCommunityIcons name="ruler" size={18} color={theme.colors.brand.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Font Size & PDP Readability</Text>
          <Text style={styles.subtitle}>Rule 9 & Second Schedule (Legal Metrology Rules, 2011)</Text>
        </View>
      </View>

      {/* Field selector tabs */}
      <View style={styles.tabRow}>
        {Object.entries(fontChecks).map(([key, item]) => {
          const isSelected = selectedKey === key;
          return (
            <Pressable
              key={key}
              style={[styles.tabBtn, isSelected && styles.tabBtnActive]}
              onPress={() => setSelectedKey(key)}
            >
              <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                {item.field}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Metric comparison cards */}
      <View style={styles.metricsRow}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>MEASURED HEIGHT</Text>
          <Text
            style={[
              styles.metricValue,
              {
                color:
                  active.status === 'PASS'
                    ? theme.colors.emerald.text
                    : theme.colors.rose.text,
              },
            ]}
          >
            {active.measuredMm} <Text style={{ fontSize: 12 }}>mm</Text>
          </Text>
          <Text style={styles.metricSub}>Vision OCR calibration</Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>MANDATED MINIMUM</Text>
          <Text style={styles.metricValue}>
            {active.mandatedMm} <Text style={{ fontSize: 12 }}>mm</Text>
          </Text>
          <Text style={styles.metricSub}>Second Schedule Tier</Text>
        </View>
      </View>

      {/* Findings description */}
      <View style={styles.findingBox}>
        <View style={styles.statusRow}>
          <Text style={styles.findingTitle}>{active.field} Analysis</Text>
          <View
            style={[
              styles.statusPill,
              {
                backgroundColor:
                  active.status === 'PASS'
                    ? theme.colors.emerald.light
                    : theme.colors.rose.light,
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    active.status === 'PASS'
                      ? theme.colors.emerald.text
                      : theme.colors.rose.text,
                },
              ]}
            >
              {active.status === 'PASS' ? 'RULE 9 COMPLIANT' : 'NON-COMPLIANT FONT'}
            </Text>
          </View>
        </View>
        <Text style={styles.findingDesc}>{active.details}</Text>
        <Text style={styles.citationText}>Citation: {active.ruleRef}</Text>
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
    marginBottom: 16,
    ...theme.shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.brand.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radius.sm,
    padding: 2,
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 6,
  },
  tabBtnActive: {
    backgroundColor: '#fff',
    ...theme.shadows.sm,
  },
  tabText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  tabTextActive: {
    color: theme.colors.brand.primary,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  metricBox: {
    flex: 1,
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radius.md,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.textSubtle,
    letterSpacing: 0.3,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.colors.text,
    marginVertical: 2,
  },
  metricSub: {
    fontSize: 9,
    color: theme.colors.textMuted,
  },
  findingBox: {
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  findingTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.text,
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
  },
  findingDesc: {
    fontSize: 11,
    color: theme.colors.textMuted,
    lineHeight: 16,
  },
  citationText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.brand.primary,
    marginTop: 6,
  },
});

