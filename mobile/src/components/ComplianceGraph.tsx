import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Line,
  Circle,
  Text as SvgText,
} from 'react-native-svg';
import { theme } from '../theme';

const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug'];

const trendData = [
  { month: 'Apr', compliant: 120, review: 40, violations: 18, rate: 76 },
  { month: 'May', compliant: 145, review: 35, violations: 15, rate: 78 },
  { month: 'Jun', compliant: 190, review: 48, violations: 22, rate: 80 },
  { month: 'Jul', compliant: 230, review: 50, violations: 25, rate: 82 },
  { month: 'Aug', compliant: 280, review: 42, violations: 19, rate: 85 },
];

export function ComplianceGraph() {
  const [mode, setMode] = useState<'rate' | 'volume'>('rate');
  const [selectedPoint, setSelectedPoint] = useState<number>(4); // default to Aug

  const chartWidth = Dimensions.get('window').width - 64; // accounting for padding
  const chartHeight = 150;
  const paddingBottom = 24;
  const paddingTop = 12;

  // Calculate coordinates
  const points = trendData.map((d, index) => {
    const x = (index / (trendData.length - 1)) * (chartWidth - 20) + 10;
    const value = mode === 'rate' ? d.rate : d.compliant;
    const minVal = mode === 'rate' ? 70 : 100;
    const maxVal = mode === 'rate' ? 90 : 300;
    const y =
      chartHeight -
      paddingBottom -
      ((value - minVal) / (maxVal - minVal)) * (chartHeight - paddingBottom - paddingTop);
    return { x, y, data: d };
  });

  // Construct SVG Area and Line Paths
  const linePath = points.reduce(
    (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`,
    ''
  );

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${
    chartHeight - paddingBottom
  } L ${points[0].x} ${chartHeight - paddingBottom} Z`;

  const active = points[selectedPoint].data;

  return (
    <View style={styles.card}>
      {/* Header with Mode Toggle */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Compliance Trajectory</Text>
          <Text style={styles.subtitle}>
            {mode === 'rate' ? 'Statutory Pass Rate (%)' : 'Volume of Compliant Audits'}
          </Text>
        </View>

        <View style={styles.toggleRow}>
          <Pressable
            style={[styles.toggleBtn, mode === 'rate' && styles.toggleBtnActive]}
            onPress={() => setMode('rate')}
          >
            <Text style={[styles.toggleText, mode === 'rate' && styles.toggleTextActive]}>
              Rate %
            </Text>
          </Pressable>
          <Pressable
            style={[styles.toggleBtn, mode === 'volume' && styles.toggleBtnActive]}
            onPress={() => setMode('volume')}
          >
            <Text style={[styles.toggleText, mode === 'volume' && styles.toggleTextActive]}>
              Volume
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Selected Point Tooltip Banner */}
      <View style={styles.tooltipBanner}>
        <View style={styles.tooltipLeft}>
          <Text style={styles.tooltipMonth}>{active.month} 2026</Text>
          <Text style={styles.tooltipSub}>
            {mode === 'rate'
              ? `${active.rate}% Compliance Rate`
              : `${active.compliant} Compliant Commodities`}
          </Text>
        </View>
        <View style={styles.tooltipRight}>
          <Text style={styles.ratePill}>
            {active.rate >= 80 ? '✓ Above Benchmark' : 'Approaching Target'}
          </Text>
        </View>
      </View>

      {/* SVG Native Graph */}
      <View style={styles.svgContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          <Defs>
            <LinearGradient id="gradientRate" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
              <Stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </LinearGradient>
            <LinearGradient id="gradientVolume" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <Stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </LinearGradient>
          </Defs>

          {/* Grid lines */}
          <Line
            x1="0"
            y1={chartHeight - paddingBottom}
            x2={chartWidth}
            y2={chartHeight - paddingBottom}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
          <Line
            x1="0"
            y1={(chartHeight - paddingBottom + paddingTop) / 2}
            x2={chartWidth}
            y2={(chartHeight - paddingBottom + paddingTop) / 2}
            stroke="#f1f5f9"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Area Fill */}
          <Path
            d={areaPath}
            fill={mode === 'rate' ? 'url(#gradientRate)' : 'url(#gradientVolume)'}
          />

          {/* Line Stroke */}
          <Path
            d={linePath}
            fill="none"
            stroke={mode === 'rate' ? '#2563eb' : '#10b981'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points & Month Labels */}
          {points.map((p, i) => {
            const isSelected = selectedPoint === i;
            return (
              <React.Fragment key={p.data.month}>
                {/* Vertical guide line on active */}
                {isSelected && (
                  <Line
                    x1={p.x}
                    y1={paddingTop}
                    x2={p.x}
                    y2={chartHeight - paddingBottom}
                    stroke={mode === 'rate' ? '#bfdbfe' : '#a7f3d0'}
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Outer Ring */}
                <Circle
                  cx={p.x}
                  cy={p.y}
                  r={isSelected ? 6 : 4}
                  fill="#fff"
                  stroke={mode === 'rate' ? '#2563eb' : '#10b981'}
                  strokeWidth={isSelected ? 3 : 2}
                />

                {/* Month Label */}
                <SvgText
                  x={p.x}
                  y={chartHeight - 6}
                  fontSize="10"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  fill={isSelected ? '#0f172a' : '#94a3b8'}
                  textAnchor="middle"
                >
                  {p.data.month}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>

      {/* Clickable Month Selector Buttons */}
      <View style={styles.monthButtonRow}>
        {trendData.map((d, i) => (
          <Pressable
            key={d.month}
            style={[styles.monthBtn, selectedPoint === i && styles.monthBtnActive]}
            onPress={() => setSelectedPoint(i)}
          >
            <Text
              style={[
                styles.monthBtnText,
                selectedPoint === i && styles.monthBtnTextActive,
              ]}
            >
              {d.month}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Legend Footer */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
          <Text style={styles.legendLabel}>Compliant</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
          <Text style={styles.legendLabel}>Needs Review</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#f43f5e' }]} />
          <Text style={styles.legendLabel}>Violations</Text>
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
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radius.sm,
    padding: 2,
  },
  toggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  toggleBtnActive: {
    backgroundColor: '#fff',
    ...theme.shadows.sm,
  },
  toggleText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  toggleTextActive: {
    color: theme.colors.brand.primary,
  },
  tooltipBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radius.md,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tooltipLeft: {
    gap: 2,
  },
  tooltipMonth: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.text,
  },
  tooltipSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  tooltipRight: {},
  ratePill: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.emerald.text,
    backgroundColor: theme.colors.emerald.light,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  monthButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceSubtle,
  },
  monthBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 6,
  },
  monthBtnActive: {
    backgroundColor: theme.colors.brand.light,
  },
  monthBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSubtle,
  },
  monthBtnTextActive: {
    color: theme.colors.brand.primary,
    fontWeight: '800',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 10,
    paddingTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
});

