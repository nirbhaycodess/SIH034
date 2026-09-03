import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Badge } from '../components/Badge';
import { mockInspections } from '../data';
import type { Inspection } from '../types';

export function HistoryScreen({
  onSelectInspection,
}: {
  onSelectInspection: (inspection: Inspection) => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filteredInspections = useMemo(() => {
    return mockInspections.filter((item) => {
      const matchStatus =
        selectedStatus === 'All' || item.status.toUpperCase() === selectedStatus.toUpperCase();
      const matchQuery =
        item.product.toLowerCase().includes(query.toLowerCase()) ||
        item.id.toLowerCase().includes(query.toLowerCase()) ||
        item.inspector.toLowerCase().includes(query.toLowerCase());
      return matchStatus && matchQuery;
    });
  }, [query, selectedStatus]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Inspection History</Text>
        <Text style={styles.subtitle}>
          Audited packaged commodities under the Legal Metrology Act, 2009.
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <MaterialCommunityIcons name="magnify" size={18} color={theme.colors.textSubtle} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by commodity, ID, or officer..."
          placeholderTextColor={theme.colors.textSubtle}
          value={query}
          onChangeText={setQuery}
        />
        {query ? (
          <Pressable onPress={() => setQuery('')}>
            <MaterialCommunityIcons name="close-circle" size={16} color={theme.colors.textSubtle} />
          </Pressable>
        ) : null}
      </View>

      {/* Status Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
        {['All', 'COMPLIANT', 'NEEDS REVIEW', 'VIOLATION'].map((st) => {
          const isSelected = selectedStatus === st;
          return (
            <Pressable
              key={st}
              style={[styles.filterChip, isSelected && styles.filterChipActive]}
              onPress={() => setSelectedStatus(st)}
            >
              <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
                {st === 'All' ? 'All Records' : st}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Results Count */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>
          Showing {filteredInspections.length} recorded audit{filteredInspections.length === 1 ? '' : 's'}
        </Text>
      </View>

      {/* Inspections List */}
      <View style={styles.list}>
        {filteredInspections.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => onSelectInspection(item)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.insId}>{item.id}</Text>
              <Badge status={item.status} size="sm" />
            </View>

            <Text style={styles.productName}>{item.product}</Text>
            <Text style={styles.manufacturer}>{item.manufacturer}</Text>

            <View style={styles.scoreBarTrack}>
              <View
                style={[
                  styles.scoreBarFill,
                  {
                    width: `${item.score}%`,
                    backgroundColor:
                      item.score >= 85
                        ? theme.colors.emerald.primary
                        : item.score >= 70
                        ? theme.colors.amber.primary
                        : theme.colors.rose.primary,
                  },
                ]}
              />
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.scoreText}>{item.score}% Compliance Score</Text>
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
          </Pressable>
        ))}
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
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.text,
  },
  filterScroll: {
    gap: 6,
    paddingBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.navy[900],
    borderColor: theme.colors.navy[900],
  },
  filterText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  filterTextActive: {
    color: '#fff',
  },
  countRow: {
    marginVertical: 8,
  },
  countText: {
    fontSize: 11,
    color: theme.colors.textSubtle,
    fontWeight: '600',
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  insId: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.brand.primary,
  },
  productName: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.text,
  },
  manufacturer: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  scoreBarTrack: {
    height: 6,
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 12,
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  scoreText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.text,
  },
  dateText: {
    fontSize: 11,
    color: theme.colors.textSubtle,
  },
});

