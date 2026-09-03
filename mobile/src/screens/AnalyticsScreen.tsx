import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { StatCard } from '../components/StatCard';
import { ComplianceGraph } from '../components/ComplianceGraph';
import { CategoryBarChart } from '../components/CategoryBarChart';

const categoryStats = [
  { name: 'Food & Beverages', count: 520, rate: 84.6, color: theme.colors.emerald.primary },
  { name: 'Household Goods', count: 240, rate: 87.5, color: theme.colors.brand.primary },
  { name: 'Personal Care', count: 380, rate: 77.6, color: theme.colors.amber.primary },
  { name: 'Electronics', count: 144, rate: 64.5, color: theme.colors.rose.primary },
];

const leaderboard = [
  { rank: 1, name: 'Priya Sharma', audits: 482, rate: '86.4%' },
  { rank: 2, name: 'Rohan Mehta', audits: 420, rate: '88.1%' },
  { rank: 3, name: 'Vikram Singh', audits: 382, rate: '82.7%' },
];

export function AnalyticsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Enforcement Analytics</Text>
        <Text style={styles.subtitle}>
          Statistical intelligence and compliance tracking across zones.
        </Text>
      </View>

      {/* KPI Cards */}
      <StatCard
        title="Total Compliance Audits"
        value="12,458"
        change="+12.4%"
        icon="chart-timeline-variant"
        tone="blue"
      />
      <StatCard
        title="Average Compliance Rate"
        value="81.2%"
        change="+3.4%"
        icon="percent"
        tone="green"
      />

      {/* Category Bar Chart */}
      <CategoryBarChart />

      {/* Monthly Trajectory Graph */}
      <ComplianceGraph />

      {/* AI Enforcement Bulletin */}
      <View style={styles.bulletinCard}>
        <View style={styles.bulletinHeader}>
          <MaterialCommunityIcons name="creation" size={18} color="#38bdf8" />
          <Text style={styles.bulletinTitle}>AI ENFORCEMENT BULLETIN</Text>
        </View>

        <View style={styles.bulletinBox}>
          <Text style={styles.bulletinHighlight}>Personal Care Compliance Alert</Text>
          <Text style={styles.bulletinText}>
            22.4% of cosmetic labels omitted the mandatory customer care telephone/email under Rule 6(1)(l). Targeted retail audits recommended.
          </Text>
        </View>

        <View style={[styles.bulletinBox, { marginTop: 10 }]}>
          <Text style={styles.bulletinHighlight}>High Food Label Quality</Text>
          <Text style={styles.bulletinText}>
            Food & Beverage commodities achieved an 84.6% standard unit declaration pass rate this month.
          </Text>
        </View>
      </View>

      {/* Officer Leaderboard */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Officer Field Activity</Text>
          <Text style={styles.cardSub}>Zone 4 inspection throughput</Text>
        </View>

        <View style={styles.leadList}>
          {leaderboard.map((o) => (
            <View key={o.name} style={styles.leadItem}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{o.rank}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.officerName}>{o.name}</Text>
                <Text style={styles.officerSub}>{o.audits} completed inspections</Text>
              </View>
              <Text style={styles.officerRate}>{o.rate} Pass</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16,
    ...theme.shadows.card,
  },
  cardHeader: {
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.text,
  },
  cardSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  catList: {
    gap: 12,
  },
  catItem: {
    gap: 4,
  },
  catTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  catName: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
  },
  catRate: {
    fontSize: 11,
    fontWeight: '800',
  },
  catTrack: {
    height: 7,
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: 4,
    overflow: 'hidden',
  },
  catFill: {
    height: '100%',
    borderRadius: 4,
  },
  catCount: {
    fontSize: 10,
    color: theme.colors.textSubtle,
  },
  bulletinCard: {
    backgroundColor: theme.colors.navy[900],
    borderRadius: theme.radius.xl,
    padding: 16,
    marginBottom: 16,
    ...theme.shadows.elevated,
  },
  bulletinHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  bulletinTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#38bdf8',
    letterSpacing: 0.8,
  },
  bulletinBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: theme.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  bulletinHighlight: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
  },
  bulletinText: {
    fontSize: 11,
    color: '#cbd5e1',
    marginTop: 4,
    lineHeight: 16,
  },
  leadList: {
    gap: 10,
  },
  leadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSubtle,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.navy[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.navy[900],
  },
  officerName: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.text,
  },
  officerSub: {
    fontSize: 11,
    color: theme.colors.textSubtle,
  },
  officerRate: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.emerald.text,
  },
});

