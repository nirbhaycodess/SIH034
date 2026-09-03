import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Badge } from './Badge';
import type { Inspection } from '../types';

export function CertificateModal({
  visible,
  onClose,
  inspection,
}: {
  visible: boolean;
  onClose: () => void;
  inspection: Inspection;
}) {
  const handleDownload = () => {
    Alert.alert(
      'Certificate Exported',
      `Official compliance record for ${inspection.product} exported to PDF.`
    );
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Official Compliance Certificate</Text>
              <Text style={styles.headerSubtitle}>Dept of Consumer Affairs • Legal Metrology</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={20} color={theme.colors.textMuted} />
            </Pressable>
          </View>

          {/* Certificate Body */}
          <ScrollView contentContainerStyle={styles.body}>
            <View style={styles.certBox}>
              <View style={styles.certHeader}>
                <View style={styles.emblemBox}>
                  <MaterialCommunityIcons name="shield-check" size={28} color={theme.colors.brand.primary} />
                </View>
                <Text style={styles.certGovt}>GOVERNMENT OF INDIA</Text>
                <Text style={styles.certMainTitle}>Certificate of Package Inspection</Text>
                <Text style={styles.certLaw}>
                  Legal Metrology (Packaged Commodities) Rules, 2011
                </Text>
              </View>

              {/* Grid info */}
              <View style={styles.metaGrid}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>ID</Text>
                  <Text style={styles.metaValue}>{inspection.id}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>DATE</Text>
                  <Text style={styles.metaValue}>{inspection.date}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>SCORE</Text>
                  <Text style={[styles.metaValue, { color: theme.colors.brand.primary }]}>
                    {inspection.score}%
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>STATUS</Text>
                  <View style={{ marginTop: 2 }}>
                    <Badge status={inspection.status} size="sm" />
                  </View>
                </View>
              </View>

              {/* Product Info */}
              <View style={styles.productBlock}>
                <Text style={styles.blockLabel}>Commodity Inspected:</Text>
                <Text style={styles.blockValue}>{inspection.product}</Text>
                <Text style={[styles.blockLabel, { marginTop: 8 }]}>Manufacturer:</Text>
                <Text style={styles.blockValue}>{inspection.manufacturer}</Text>
              </View>

              {/* Rule Summary */}
              <View style={styles.rulesBlock}>
                <Text style={styles.blockLabel}>Rule 6 Declaration Findings:</Text>
                {inspection.checks.map((c, i) => (
                  <View key={i} style={styles.ruleItem}>
                    <Text style={styles.ruleText}>• {c.requirement}: {c.detectedValue}</Text>
                    <Badge status={c.status} size="sm" />
                  </View>
                ))}
              </View>

              {/* Verification & Seal */}
              <View style={styles.sealRow}>
                <View style={styles.qrBlock}>
                  <MaterialCommunityIcons name="qrcode" size={44} color={theme.colors.navy[900]} />
                  <Text style={styles.qrText}>DIGITALLY VERIFIED</Text>
                </View>
                <View style={styles.officerBlock}>
                  <Text style={styles.signText}>Priya Sharma</Text>
                  <Text style={styles.officerName}>{inspection.inspector}</Text>
                  <Text style={styles.officerTitle}>Enforcement Officer #LM-408</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <Pressable
              style={styles.noticeBtn}
              onPress={() => {
                Alert.alert(
                  'Editable Notice Exported',
                  `Statutory Show-Cause / Seizure Notice for ${inspection.product} generated in editable text format.`
                );
              }}
            >
              <MaterialCommunityIcons name="file-document-edit-outline" size={16} color={theme.colors.brand.primary} />
              <Text style={styles.noticeBtnText}>Notice (.txt)</Text>
            </Pressable>

            <Pressable style={styles.downloadBtn} onPress={handleDownload}>
              <MaterialCommunityIcons name="download" size={16} color="#fff" />
              <Text style={styles.downloadText}>PDF Report</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceSubtle,
  },
  body: {
    padding: 16,
  },
  certBox: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.borderStrong,
    padding: 16,
    backgroundColor: '#fff',
  },
  certHeader: {
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  emblemBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.brand.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  certGovt: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.textMuted,
  },
  certMainTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.text,
    marginTop: 2,
    textAlign: 'center',
  },
  certLaw: {
    fontSize: 10,
    color: theme.colors.textSubtle,
    marginTop: 2,
  },
  metaGrid: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: 12,
    padding: 10,
    marginTop: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.textSubtle,
  },
  metaValue: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 2,
  },
  productBlock: {
    marginTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  blockLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  blockValue: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 2,
  },
  rulesBlock: {
    marginTop: 12,
  },
  ruleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  ruleText: {
    fontSize: 11,
    color: theme.colors.text,
    flex: 1,
  },
  sealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  qrBlock: {
    alignItems: 'center',
  },
  qrText: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.navy[900],
    marginTop: 2,
  },
  officerBlock: {
    alignItems: 'flex-end',
  },
  signText: {
    fontStyle: 'italic',
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.brand.primary,
  },
  officerName: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 2,
  },
  officerTitle: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 8,
  },
  noticeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.brand.primary,
    backgroundColor: theme.colors.brand.light,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  noticeBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.brand.primary,
  },
  downloadBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: theme.colors.brand.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  downloadText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
});

