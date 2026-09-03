import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Badge } from '../components/Badge';
import { CertificateModal } from '../components/CertificateModal';
import { mockInspections } from '../data';
import type { Inspection } from '../types';

export function ReportsScreen() {
  const [query, setQuery] = useState('');
  const [activeCert, setActiveCert] = useState<Inspection | null>(null);

  const reports = mockInspections.map((x) => ({
    reportId: `REP-${x.id.slice(4)}`,
    inspection: x,
    generatedDate: `${x.date}, 14:30 IST`,
  }));

  const filtered = reports.filter(
    (r) =>
      r.reportId.toLowerCase().includes(query.toLowerCase()) ||
      r.inspection.product.toLowerCase().includes(query.toLowerCase())
  );

  const handleDownload = (product: string) => {
    Alert.alert('PDF Exported', `Official compliance audit certificate for ${product} saved.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Compliance Reports</Text>
        <Text style={styles.subtitle}>
          Official certificates generated under Legal Metrology Rules, 2011.
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <MaterialCommunityIcons name="magnify" size={18} color={theme.colors.textSubtle} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search report ID or product..."
          placeholderTextColor={theme.colors.textSubtle}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* Reports List */}
      <View style={styles.list}>
        {filtered.map((item) => (
          <View key={item.reportId} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons name="file-document-outline" size={20} color={theme.colors.brand.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.reportId}>{item.reportId}</Text>
                <Text style={styles.productName}>{item.inspection.product}</Text>
                <Text style={styles.dateText}>Generated: {item.generatedDate}</Text>
              </View>
              <Badge status={item.inspection.status} size="sm" />
            </View>

            <View style={styles.actionRow}>
              <Pressable
                style={styles.viewBtn}
                onPress={() => setActiveCert(item.inspection)}
              >
                <MaterialCommunityIcons name="eye" size={15} color={theme.colors.brand.primary} />
                <Text style={styles.viewBtnText}>View Certificate</Text>
              </Pressable>

              <Pressable
                style={styles.downloadBtn}
                onPress={() => handleDownload(item.inspection.product)}
              >
                <MaterialCommunityIcons name="download" size={15} color="#fff" />
                <Text style={styles.downloadBtnText}>Export PDF</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      {/* Certificate Modal */}
      {activeCert && (
        <CertificateModal
          visible={Boolean(activeCert)}
          onClose={() => setActiveCert(null)}
          inspection={activeCert}
        />
      )}
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.text,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.brand.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportId: {
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '800',
    color: theme.colors.brand.primary,
  },
  productName: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 2,
  },
  dateText: {
    fontSize: 11,
    color: theme.colors.textSubtle,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceSubtle,
  },
  viewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.brand.primary,
  },
  downloadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.brand.primary,
  },
  downloadBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
});

