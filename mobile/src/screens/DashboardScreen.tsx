import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { ComplianceGraph } from '../components/ComplianceGraph';
import { mockInspections, liveActivity, commonViolations } from '../data';
import type { Inspection, TabRoute } from '../types';

export function DashboardScreen({
  onNavigate,
  onSelectInspection,
}: {
  onNavigate: (route: TabRoute) => void;
  onSelectInspection: (inspection: Inspection) => void;
}) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Officer Greeting Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerTop}>
          <View style={styles.badgeLive}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Zone 4 • Legal Metrology Active</Text>
          </View>
          <Text style={styles.officerId}>LM-DEL-408</Text>
        </View>

        <Text style={styles.greeting}>Good morning, Inspector Priya</Text>
        <Text style={styles.subtitle}>
          National packaged commodity inspection grid is synchronized. 12 pending scans in queue.
        </Text>

        <Pressable
          style={styles.newScanBtn}
          onPress={() => onNavigate('new_inspection')}
        >
          <MaterialCommunityIcons name="camera-plus" size={18} color="#fff" />
          <Text style={styles.newScanText}>Start New Package Inspection</Text>
        </Pressable>
      </View>

      {/* KPI Stats Grid */}
      <Text style={styles.sectionHeading}>INSPECTION METRICS (SIH 2024)</Text>
      <StatCard
        title="Total Audits Conducted"
        value="12,458"
        change="+12.4%"
        icon="clipboard-check-outline"
        tone="blue"
      />
      <StatCard
        title="Compliant Packages"
        value="8,921"
        change="+8.1%"
        icon="check-decagram-outline"
        tone="green"
      />
      <StatCard
        title="Needs Officer Review"
        value="2,314"
        change="+4.7%"
        icon="alert-circle-outline"
        tone="amber"
      />
      <StatCard
        title="Potential Violations"
        value="1,223"
        change="-2.3%"
        icon="shield-alert-outline"
        tone="red"
        isPositive={false}
      />

      {/* Compliance Trajectory Native Vector Graph */}
      <ComplianceGraph />

      {/* Live Activity Stream */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Live Enforcement Stream</Text>
            <Text style={styles.cardSub}>Recent field submissions</Text>
          </View>
          <MaterialCommunityIcons name="broadcast" size={18} color={theme.colors.brand.primary} />
        </View>

        <View style={styles.activityList}>
          {liveActivity.map((act) => (
            <View key={act.id} style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={{ flex: 1 }}>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityOfficer}>{act.officer}</Text>
                  <Text style={styles.activityTime}>{act.time}</Text>
                </View>
                <Text style={styles.activityAction}>
                  {act.action}: <Text style={{ fontWeight: '700' }}>{act.product}</Text>
                </Text>
              </View>
              <Badge status={act.status} size="sm" />
            </View>
          ))}
        </View>
      </View>

      {/* Common Violations */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Common Violations</Text>
            <Text style={styles.cardSub}>Legal Metrology Rules, 2011</Text>
          </View>
          <Text style={styles.violationCount}>90 Flags</Text>
        </View>

        <View style={styles.violationList}>
          {commonViolations.map((v) => (
            <View key={v.rule} style={styles.violationItem}>
              <View style={styles.violationTop}>
                <Text style={styles.violationTitle}>{v.title}</Text>
                <Text style={styles.violationRule}>{v.rule}</Text>
              </View>
              <View style={styles.violationTrack}>
                <View
                  style={[
                    styles.violationFill,
                    {
                      width: `${v.pct}%`,
                      backgroundColor:
                        v.severity === 'High'
                          ? theme.colors.rose.primary
                          : v.severity === 'Medium'
                          ? theme.colors.amber.primary
                          : theme.colors.brand.primary,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Inspections Table / Cards */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Recent Inspections</Text>
            <Text style={styles.cardSub}>Tap any record to inspect</Text>
          </View>
          <Pressable onPress={() => onNavigate('history')}>
            <Text style={styles.viewAllText}>View All</Text>
          </Pressable>
        </View>

        <View style={styles.recentList}>
          {mockInspections.slice(0, 4).map((item) => (
            <Pressable
              key={item.id}
              style={styles.recentItem}
              onPress={() => onSelectInspection(item)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.recentId}>{item.id}</Text>
                <Text style={styles.recentProduct}>{item.product}</Text>
                <Text style={styles.recentDate}>
                  {item.date} • {item.inspector}
                </Text>
              </View>

              <View style={styles.recentRight}>
                <Badge status={item.status} size="sm" />
                <Text style={styles.recentScore}>{item.score}% Score</Text>
              </View>
            </Pressable>
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
  banner: {
    backgroundColor: theme.colors.navy[900],
    borderRadius: theme.radius.xl,
    padding: 20,
    marginBottom: 20,
    ...theme.shadows.elevated,
  },
  bannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeLive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38bdf8',
  },
  liveText: {
    color: '#e0f2fe',
    fontSize: 10,
    fontWeight: '700',
  },
  officerId: {
    color: '#94a3b8',
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
  },
  subtitle: {
    fontSize: 12,
    color: '#cbd5e1',
    marginTop: 6,
    lineHeight: 18,
  },
  newScanBtn: {
    backgroundColor: theme.colors.brand.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: theme.radius.md,
    paddingVertical: 12,
    marginTop: 16,
  },
  newScanText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: theme.colors.textMuted,
    marginBottom: 10,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
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
  rateValue: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.brand.primary,
  },
  progressTrack: {
    height: 8,
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.brand.primary,
    borderRadius: 4,
  },
  rateDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  rateDetailText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSubtle,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.brand.primary,
    marginTop: 5,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activityOfficer: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.text,
  },
  activityTime: {
    fontSize: 10,
    color: theme.colors.textSubtle,
  },
  activityAction: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  violationCount: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.rose.primary,
    backgroundColor: theme.colors.rose.light,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
  },
  violationList: {
    gap: 10,
  },
  violationItem: {
    gap: 4,
  },
  violationTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  violationTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
  },
  violationRule: {
    fontSize: 11,
    color: theme.colors.textSubtle,
    fontFamily: 'monospace',
  },
  violationTrack: {
    height: 6,
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: 3,
    overflow: 'hidden',
  },
  violationFill: {
    height: '100%',
    borderRadius: 3,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.brand.primary,
  },
  recentList: {
    gap: 10,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSubtle,
  },
  recentId: {
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: theme.colors.brand.primary,
  },
  recentProduct: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 1,
  },
  recentDate: {
    fontSize: 11,
    color: theme.colors.textSubtle,
    marginTop: 2,
  },
  recentRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  recentScore: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
});

