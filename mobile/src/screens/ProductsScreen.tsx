import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Badge } from '../components/Badge';
import { mockProducts } from '../data';
import type { Product } from '../types';

export function ProductsScreen({
  onInspectAgain,
}: {
  onInspectAgain: () => void;
}) {
  const [productsList, setProductsList] = useState<Product[]>(mockProducts);
  const [query, setQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [mfr, setMfr] = useState('');
  const [category, setCategory] = useState('Personal Care');

  const filtered = productsList.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase()) ||
      p.manufacturer.toLowerCase().includes(query.toLowerCase())
  );

  const handleRegisterProduct = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter a product name.');
      return;
    }
    const newProduct: Product = {
      id: `PRD-${productsList.length + 1}`,
      name,
      brand: brand || name.split(' ')[0],
      manufacturer: mfr || 'Domestic Packer Ltd.',
      category,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
      lastInspection: 'Just registered',
      status: 'DRAFT',
      violations: 0,
    };
    setProductsList([newProduct, ...productsList]);
    setShowAddModal(false);
    setName('');
    setBrand('');
    setMfr('');
    Alert.alert('Success', `Registered ${newProduct.name} into National Repository.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Product Repository</Text>
          <Pressable style={styles.addBtn} onPress={() => setShowAddModal(true)}>
            <MaterialCommunityIcons name="plus" size={16} color="#fff" />
            <Text style={styles.addBtnText}>Register SKU</Text>
          </Pressable>
        </View>
        <Text style={styles.subtitle}>
          National registered packaged commodities and compliance status.
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <MaterialCommunityIcons name="magnify" size={18} color={theme.colors.textSubtle} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by commodity, brand, or packer..."
          placeholderTextColor={theme.colors.textSubtle}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* Product Cards */}
      <View style={styles.list}>
        {filtered.map((item) => (
          <View key={item.id} style={styles.card}>
            {item.image && (
              <View style={styles.imgBox}>
                <Image source={{ uri: item.image }} style={styles.cardImg} />
                <View style={styles.catOverlay}>
                  <Text style={styles.catText}>{item.category}</Text>
                </View>
                <View style={styles.badgeOverlay}>
                  <Badge status={item.status} size="sm" />
                </View>
              </View>
            )}

            <View style={styles.cardBody}>
              <Text style={styles.skuId}>{item.id} • {item.brand}</Text>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.mfr}>{item.manufacturer}</Text>

              <View style={styles.metaRow}>
                <View>
                  <Text style={styles.metaLabel}>LAST INSPECTION</Text>
                  <Text style={styles.metaValue}>{item.lastInspection}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.metaLabel}>FLAGS</Text>
                  <Text style={[styles.metaValue, item.violations > 0 && { color: theme.colors.rose.primary }]}>
                    {item.violations} violations
                  </Text>
                </View>
              </View>

              <Pressable style={styles.inspectBtn} onPress={onInspectAgain}>
                <Text style={styles.inspectBtnText}>Inspect This Commodity</Text>
                <MaterialCommunityIcons name="arrow-right" size={14} color={theme.colors.brand.primary} />
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      {/* Register SKU Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Register New Commodity SKU</Text>
              <Pressable onPress={() => setShowAddModal(false)}>
                <MaterialCommunityIcons name="close" size={20} color={theme.colors.textMuted} />
              </Pressable>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Product Name</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Green Tea Leaf (250g)"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Brand</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. PurePulse"
                value={brand}
                onChangeText={setBrand}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Registered Manufacturer</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Organic Foods India Ltd."
                value={mfr}
                onChangeText={setMfr}
              />
            </View>

            <Pressable style={styles.saveBtn} onPress={handleRegisterProduct}>
              <Text style={styles.saveBtnText}>Save Commodity to Grid</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.brand.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.radius.md,
    gap: 4,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
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
    gap: 16,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    ...theme.shadows.card,
  },
  imgBox: {
    height: 140,
    backgroundColor: '#0f172a',
    position: 'relative',
  },
  cardImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.85,
  },
  catOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
  },
  catText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.text,
  },
  badgeOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  cardBody: {
    padding: 16,
  },
  skuId: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.brand.primary,
  },
  productName: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 2,
  },
  mfr: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radius.md,
    padding: 10,
    marginTop: 12,
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.textSubtle,
  },
  metaValue: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 2,
  },
  inspectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.brand.border,
    marginTop: 12,
  },
  inspectBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.brand.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: theme.radius.xl,
    padding: 20,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.text,
  },
  formGroup: {
    gap: 4,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  formInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: theme.colors.text,
  },
  saveBtn: {
    backgroundColor: theme.colors.brand.primary,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
});

