import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Badge } from '../components/Badge';
import { CertificateModal } from '../components/CertificateModal';
import { FontSizeAnalyzer } from '../components/FontSizeAnalyzer';
import type { Inspection } from '../types';

const defaultBoxes = [
  { id: 'name', label: 'Product Name', top: 30, left: 20, width: 160, height: 40, conf: 98, color: '#38bdf8' },
  { id: 'mfr', label: 'Manufacturer', top: 85, left: 20, width: 200, height: 45, conf: 94, color: '#34d399' },
  { id: 'qty', label: 'Net Quantity', top: 145, left: 20, width: 120, height: 35, conf: 99, color: '#a78bfa' },
  { id: 'mrp', label: 'MRP & Taxes', top: 190, left: 20, width: 130, height: 35, conf: 91, color: '#fbbf24' },
  { id: 'care', label: 'Customer Care', top: 235, left: 20, width: 180, height: 35, conf: 45, color: '#f87171' },
];

export function InspectionResultScreen({
  inspection,
  onBack,
}: {
  inspection: Inspection;
  onBack: () => void;
}) {
  const [activeBox, setActiveBox] = useState<string | null>('name');
  const [showCert, setShowCert] = useState(false);
  const [remarks, setRemarks] = useState(
    'Rule 6(1)(l) non-compliance flagged. Customer care helpline number missing from primary display panel.'
  );
  const [reviewedViolations, setReviewedViolations] = useState<Record<string, boolean>>({});

  const handleToggleBox = (id: string) => {
    setActiveBox((prev) => (prev === id ? null : id));
  };

  const handleReviewViolation = (id: string) => {
    setReviewedViolations((prev) => ({ ...prev, [id]: true }));
    Alert.alert('Flag Updated', `Violation ${id} marked as inspected by officer.`);
  };

  const handleSaveRemarks = () => {
    Alert.alert('Dossier Saved', 'Officer notes and inspection status recorded.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Back to Audits Navigation */}
      <Pressable style={styles.backRow} onPress={onBack}>
        <MaterialCommunityIcons name="arrow-left" size={18} color={theme.colors.brand.primary} />
        <Text style={styles.backText}>Return to Inspection Queue</Text>
      </Pressable>

      {/* Header Info */}
      <View style={styles.header}>
        <View style={styles.idRow}>
          <Text style={styles.insId}>{inspection.id}</Text>
          <Text style={styles.categoryBadge}>{inspection.category}</Text>
        </View>
        <Text style={styles.productTitle}>{inspection.product}</Text>
        <Text style={styles.mfrText}>{inspection.manufacturer}</Text>
      </View>

      {/* Compliance Score Hero Card */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreRow}>
          {/* Radial Circular Score Simulation */}
          <View style={styles.scoreGauge}>
            <Text style={styles.scorePercent}>{inspection.score}%</Text>
            <Text style={styles.scoreLabel}>SCORE</Text>
          </View>

          <View style={styles.scoreMeta}>
            <Badge status={inspection.status} size="md" />
            <Text style={styles.scoreTitle}>
              {inspection.score >= 85
                ? 'Conforms to Standards'
                : inspection.score >= 70
                ? 'Requires Officer Review'
                : 'Statutory Violations Flagged'}
            </Text>
            <Text style={styles.scoreDesc}>
              {inspection.violations.length} discrepancies against Legal Metrology Rules, 2011.
            </Text>
          </View>
        </View>

        <View style={styles.scoreDivider} />

        <View style={styles.confidenceRow}>
          <View style={styles.confItem}>
            <Text style={styles.confLabel}>OCR CONFIDENCE</Text>
            <Text style={styles.confValue}>94.2% (High)</Text>
          </View>
          <View style={styles.confItem}>
            <Text style={styles.confLabel}>INSPECTED BY</Text>
            <Text style={styles.confValue}>{inspection.inspector}</Text>
          </View>
        </View>
      </View>

      {/* Interactive Bounding Box Viewer */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Interactive Package OCR Detection</Text>
            <Text style={styles.cardSub}>Tap pills to highlight bounding boxes</Text>
          </View>
          <MaterialCommunityIcons name="crop-free" size={20} color={theme.colors.brand.primary} />
        </View>

        {/* Declaration Selector Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll}>
          {defaultBoxes.map((b) => {
            const isSelected = activeBox === b.id;
            return (
              <Pressable
                key={b.id}
                style={[
                  styles.pill,
                  isSelected && { backgroundColor: b.color, borderColor: b.color },
                ]}
                onPress={() => handleToggleBox(b.id)}
              >
                <Text style={[styles.pillText, isSelected && { color: '#fff' }]}>
                  {b.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Image with bounding box overlay */}
        <View style={styles.imageViewer}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80',
            }}
            style={styles.packageImg}
          />

          {/* Render Active Bounding Boxes */}
          {defaultBoxes.map((b) => {
            if (activeBox && activeBox !== b.id) return null;
            return (
              <View
                key={b.id}
                style={[
                  styles.boundingBox,
                  {
                    top: b.top,
                    left: b.left,
                    width: b.width,
                    height: b.height,
                    borderColor: b.color,
                  },
                ]}
              >
                <View style={[styles.boxTag, { backgroundColor: b.color }]}>
                  <Text style={styles.boxTagText}>{b.label} ({b.conf}%)</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Rule 6 Compliance Checklist */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Legal Metrology Compliance Checklist</Text>
        <Text style={styles.cardSub}>Mandatory Rule 6 declarations checklist</Text>

        <View style={styles.checklist}>
          {inspection.checks.map((c, i) => (
            <View key={i} style={styles.checkItem}>
              <View style={styles.checkLeft}>
                <MaterialCommunityIcons
                  name={
                    c.status === 'PASS'
                      ? 'check-circle'
                      : c.status === 'WARNING'
                      ? 'alert-circle'
                      : 'close-circle'
                  }
                  size={18}
                  color={
                    c.status === 'PASS'
                      ? theme.colors.emerald.primary
                      : c.status === 'WARNING'
                      ? theme.colors.amber.primary
                      : theme.colors.rose.primary
                  }
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.checkReq}>{c.requirement}</Text>
                  <Text style={styles.checkVal}>Detected: {c.detectedValue}</Text>
                </View>
              </View>
              <Badge status={c.status} size="sm" />
            </View>
          ))}
        </View>
      </View>

      {/* Font Size & PDP Readability Analysis (Rule 9 & Second Schedule) */}
      <FontSizeAnalyzer />

      {/* Supporting Photographic Evidence (Rule 29 Exhibits) */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Supporting Legal Exhibits</Text>
            <Text style={styles.cardSub}>Photographic evidence attached to case dossier</Text>
          </View>
          <View style={styles.exhibitBadge}>
            <MaterialCommunityIcons name="camera-outline" size={14} color={theme.colors.brand.primary} />
            <Text style={styles.exhibitBadgeText}>3 Photos Attached</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exhibitScroll}>
          <View style={styles.exhibitItem}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&auto=format&fit=crop&q=80' }}
              style={styles.exhibitImg}
            />
            <Text style={styles.exhibitTag}>PDP Front Panel</Text>
          </View>
          <View style={styles.exhibitItem}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80' }}
              style={styles.exhibitImg}
            />
            <Text style={styles.exhibitTag}>Back Declarations</Text>
          </View>
          <View style={styles.exhibitItem}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&auto=format&fit=crop&q=80' }}
              style={styles.exhibitImg}
            />
            <Text style={styles.exhibitTag}>Batch & Barcode</Text>
          </View>
        </ScrollView>
      </View>

      {/* Potential Violations Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Recorded Discrepancies</Text>
            <Text style={styles.cardSub}>Requires officer adjudication</Text>
          </View>
          <Badge status="VIOLATION" size="sm" />
        </View>

        <View style={styles.violationStack}>
          {inspection.violations.map((v) => {
            const isDone = Boolean(reviewedViolations[v.id]);
            return (
              <View key={v.id} style={styles.vCard}>
                <View style={styles.vHeader}>
                  <Text style={styles.vRule}>{v.rule}</Text>
                  <Text style={styles.vSeverity}>{v.severity} Severity</Text>
                </View>
                <Text style={styles.vTitle}>{v.title}</Text>
                <Text style={styles.vDesc}>{v.description}</Text>

                <Pressable
                  style={[styles.vActionBtn, isDone && styles.vActionDone]}
                  onPress={() => handleReviewViolation(v.id)}
                  disabled={isDone}
                >
                  <MaterialCommunityIcons
                    name={isDone ? 'check' : 'clipboard-edit-outline'}
                    size={15}
                    color={isDone ? '#fff' : theme.colors.brand.primary}
                  />
                  <Text style={[styles.vActionText, isDone && { color: '#fff' }]}>
                    {isDone ? 'Reviewed & Noted' : 'Review & Confirm Finding'}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      </View>

      {/* Officer Remarks & Adjudication */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Enforcement Officer Remarks</Text>
        <Text style={styles.cardSub}>Official observations appended to legal audit log</Text>

        <TextInput
          style={styles.remarksInput}
          multiline
          numberOfLines={3}
          value={remarks}
          onChangeText={setRemarks}
        />

        <View style={styles.remarksActionRow}>
          <Pressable style={styles.remarksPresetBtn} onPress={() => setRemarks('All mandatory declarations present. Recommend compliance clearance.')}>
            <Text style={styles.remarksPresetText}>+ Presets: Pass</Text>
          </Pressable>
          <Pressable style={styles.saveRemarksBtn} onPress={handleSaveRemarks}>
            <Text style={styles.saveRemarksText}>Save Log</Text>
          </Pressable>
        </View>
      </View>

      {/* Official Certificate Action Button */}
      <Pressable style={styles.certBtn} onPress={() => setShowCert(true)}>
        <MaterialCommunityIcons name="file-certificate" size={20} color="#fff" />
        <Text style={styles.certBtnText}>View Official Inspection Certificate</Text>
      </Pressable>

      {/* Certificate Modal */}
      <CertificateModal
        visible={showCert}
        onClose={() => setShowCert(false)}
        inspection={inspection}
      />
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
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  backText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.brand.primary,
  },
  header: {
    marginBottom: 16,
  },
  idRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  insId: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.brand.primary,
  },
  categoryBadge: {
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: theme.colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
    color: theme.colors.textMuted,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.colors.text,
  },
  mfrText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  scoreCard: {
    backgroundColor: theme.colors.navy[900],
    borderRadius: theme.radius.xl,
    padding: 18,
    marginBottom: 16,
    ...theme.shadows.elevated,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreGauge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  scorePercent: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
  },
  scoreLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#38bdf8',
    letterSpacing: 1,
  },
  scoreMeta: {
    flex: 1,
    gap: 4,
  },
  scoreTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
    marginTop: 2,
  },
  scoreDesc: {
    fontSize: 11,
    color: '#cbd5e1',
    lineHeight: 16,
  },
  scoreDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginVertical: 14,
  },
  confidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confItem: {
    gap: 2,
  },
  confLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#94a3b8',
  },
  confValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
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
  pillsScroll: {
    gap: 6,
    paddingBottom: 10,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceSubtle,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.text,
  },
  imageViewer: {
    height: 290,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0f172a',
    marginTop: 6,
  },
  packageImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  boundingBox: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  boxTag: {
    position: 'absolute',
    top: -18,
    left: 0,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  boxTagText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
  checklist: {
    gap: 10,
    marginTop: 10,
  },
  checkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSubtle,
  },
  checkLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    flex: 1,
    paddingRight: 8,
  },
  checkReq: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
  },
  checkVal: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  violationStack: {
    gap: 10,
    marginTop: 8,
  },
  vCard: {
    padding: 12,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.rose.light,
    borderWidth: 1,
    borderColor: theme.colors.rose.border,
  },
  vHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vRule: {
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: '800',
    color: theme.colors.rose.primary,
  },
  vSeverity: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.rose.text,
  },
  vTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 4,
  },
  vDesc: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 3,
    lineHeight: 16,
  },
  vActionBtn: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: theme.radius.sm,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.colors.brand.border,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vActionDone: {
    backgroundColor: theme.colors.emerald.primary,
    borderColor: theme.colors.emerald.primary,
  },
  vActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.brand.primary,
  },
  remarksInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: 10,
    fontSize: 12,
    color: theme.colors.text,
    backgroundColor: theme.colors.surfaceSubtle,
    marginTop: 10,
    textAlignVertical: 'top',
  },
  remarksActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  remarksPresetBtn: {
    paddingVertical: 4,
  },
  remarksPresetText: {
    fontSize: 11,
    color: theme.colors.brand.primary,
    fontWeight: '600',
  },
  saveRemarksBtn: {
    backgroundColor: theme.colors.brand.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
  },
  saveRemarksText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  certBtn: {
    backgroundColor: theme.colors.navy[900],
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
    ...theme.shadows.card,
  },
  certBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  exhibitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.brand.light,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
  },
  exhibitBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.brand.primary,
  },
  exhibitScroll: {
    marginTop: 10,
  },
  exhibitItem: {
    marginRight: 12,
    alignItems: 'center',
  },
  exhibitImg: {
    width: 100,
    height: 90,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  exhibitTag: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginTop: 4,
  },
});

