import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { theme } from '../theme';

const categoryData = [
  { category: 'Food', compliant: 440, violations: 80 },
  { category: 'Care', compliant: 295, violations: 85 },
  { category: 'Home', compliant: 210, violations: 30 },
  { category: 'Elec', compliant: 93, violations: 51 },
];

export function CategoryBarChart() {
  const chartWidth = Dimensions.get('window').width - 64;
  const chartHeight = 160;
  const paddingBottom = 26;
  const paddingTop = 12;
  const maxVal = 500;

  const barGroupWidth = (chartWidth - 40) / categoryData.length;
  const singleBarWidth = 14;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Audits by Category</Text>
          <Text style={styles.subtitle}>Compliant vs. Flagged commodities</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
            <Text style={styles.legendLabel}>Compliant</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#f43f5e' }]} />
            <Text style={styles.legendLabel}>Violations</Text>
          </View>
        </View>
      </View>

      {/* SVG Bar Chart */}
      <View style={styles.svgContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          {/* Baseline */}
          <Line
            x1="10"
            y1={chartHeight - paddingBottom}
            x2={chartWidth - 10}
            y2={chartHeight - paddingBottom}
            stroke="#e2e8f0"
            strokeWidth="1"
          />

          {/* Grid lines */}
          <Line
            x1="10"
            y1={(chartHeight - paddingBottom + paddingTop) / 2}
            x2={chartWidth - 10}
            y2={(chartHeight - paddingBottom + paddingTop) / 2}
            stroke="#f1f5f9"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Render Groups of Bars */}
          {categoryData.map((d, index) => {
            const groupX = 20 + index * barGroupWidth;
            const usableHeight = chartHeight - paddingBottom - paddingTop;

            const hCompliant = (d.compliant / maxVal) * usableHeight;
            const yCompliant = chartHeight - paddingBottom - hCompliant;

            const hViolations = (d.violations / maxVal) * usableHeight;
            const yViolations = chartHeight - paddingBottom - hViolations;

            return (
              <React.Fragment key={d.category}>
                {/* Compliant Bar */}
                <Rect
                  x={groupX}
                  y={yCompliant}
                  width={singleBarWidth}
                  height={hCompliant}
                  fill="#10b981"
                  rx="3"
                />

                {/* Violations Bar */}
                <Rect
                  x={groupX + singleBarWidth + 4}
                  y={yViolations}
                  width={singleBarWidth}
                  height={hViolations}
                  fill="#f43f5e"
                  rx="3"
                />

                {/* Category Label */}
                <SvgText
                  x={groupX + singleBarWidth}
                  y={chartHeight - 6}
                  fontSize="10"
                  fontWeight="bold"
                  fill="#64748b"
                  textAnchor="middle"
                >
                  {d.category}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>

      {/* Statistics summary below chart */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>HIGHEST COMPLIANCE</Text>
          <Text style={styles.metaVal}>Food & Beverages (84.6%)</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>ATTENTION NEEDED</Text>
          <Text style={[styles.metaVal, { color: theme.colors.rose.text }]}>Electronics (64.5%)</Text>
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
    marginBottom: 16,
    ...theme.shadows.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radius.md,
    padding: 10,
    marginTop: 8,
  },
  metaItem: {
    gap: 2,
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.textSubtle,
    letterSpacing: 0.3,
  },
  metaVal: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.text,
  },
});

