import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { samplePackages, mockInspections } from '../data';
import type { Inspection } from '../types';

const steps = [
  'Scanning package surface & perspective correction...',
  'Detecting mandatory declaration bounding boxes...',
  'Reading label information (OCR & Metrology text parser)...',
  'Checking compliance against Legal Metrology Rules, 2011...',
];

export function NewInspectionScreen({
  onInspectionComplete,
}: {
  onInspectionComplete: (inspection: Inspection) => void;
}) {
  const [imageUri, setImageUri] = useState<string>(samplePackages[0].uri);
  const [selectedSample, setSelectedSample] = useState<string>(samplePackages[0].id);
  const [scanning, setScanning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const chooseCamera = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert('Camera Permission Required', 'Please enable camera access in your settings.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.9,
    });
    if (!res.canceled && res.assets[0]?.uri) {
      setImageUri(res.assets[0].uri);
      setSelectedSample('');
    }
  };

  const chooseGallery = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert('Gallery Permission Required', 'Please enable photo library access.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
    });
    if (!res.canceled && res.assets[0]?.uri) {
      setImageUri(res.assets[0].uri);
      setSelectedSample('');
    }
  };

  const handleSelectSample = (sample: typeof samplePackages[0]) => {
    setSelectedSample(sample.id);
    setImageUri(sample.uri);
  };

  const runAiAnalysis = () => {
    setScanning(true);
    setStepIndex(0);

    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setScanning(false);
            // Match sample inspection or default to 00482
            const matchedInspection =
              mockInspections.find((x) => x.id === (samplePackages.find((s) => s.id === selectedSample)?.inspectionId)) ||
              mockInspections[0];
            onInspectionComplete(matchedInspection);
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTag}>
          <Text style={styles.headerTagText}>AI MULTI-MODAL INSPECTOR</Text>
        </View>
        <Text style={styles.title}>New Package Inspection</Text>
        <Text style={styles.subtitle}>
          Scan package label to extract declarations and check statutory conformity under Legal Metrology Rules, 2011.
        </Text>
      </View>

      {/* 1-Click SIH Sample Selector */}
      <View style={styles.card}>
        <View style={styles.sampleTitleRow}>
          <MaterialCommunityIcons name="lightning-bolt" size={18} color={theme.colors.brand.primary} />
          <Text style={styles.sampleTitle}>Smart India Hackathon Sample Presets</Text>
        </View>
        <Text style={styles.sampleSub}>
          Tap any pre-loaded commodity for instant presentation demonstration:
        </Text>

        <View style={styles.sampleRow}>
          {samplePackages.map((s) => {
            const isSelected = selectedSample === s.id;
            return (
              <Pressable
                key={s.id}
                style={[
                  styles.sampleBtn,
                  isSelected && styles.sampleBtnActive,
                ]}
                onPress={() => handleSelectSample(s)}
              >
                <Text
                  style={[
                    styles.sampleBtnText,
                    isSelected && styles.sampleBtnTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {s.name}
                </Text>
                <Text style={styles.sampleCategory}>{s.category}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Preview Card */}
      <View style={styles.previewCard}>
        <View style={styles.imageBox}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImg} />
          ) : (
            <View style={styles.noImgBox}>
              <MaterialCommunityIcons name="image-outline" size={48} color={theme.colors.textSubtle} />
              <Text style={styles.noImgText}>No image selected</Text>
            </View>
          )}

          {/* Scanning Overlay Animation */}
          {scanning && (
            <View style={styles.scanOverlay}>
              <View style={styles.scanLaser} />
              <View style={styles.scanPromptBox}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.scanPromptText}>{steps[stepIndex]}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Capture Buttons */}
        <View style={styles.btnRow}>
          <Pressable style={styles.secondaryBtn} onPress={chooseCamera} disabled={scanning}>
            <MaterialCommunityIcons name="camera" size={18} color={theme.colors.brand.primary} />
            <Text style={styles.secondaryBtnText}>Camera</Text>
          </Pressable>

          <Pressable style={styles.secondaryBtn} onPress={chooseGallery} disabled={scanning}>
            <MaterialCommunityIcons name="image-multiple" size={18} color={theme.colors.brand.primary} />
            <Text style={styles.secondaryBtnText}>Gallery</Text>
          </Pressable>
        </View>

        {/* Primary Action */}
        <Pressable
          style={[styles.primaryBtn, scanning && styles.btnDisabled]}
          onPress={runAiAnalysis}
          disabled={scanning || !imageUri}
        >
          {scanning ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.primaryBtnText}>Analyzing Package...</Text>
            </View>
          ) : (
            <View style={styles.loadingRow}>
              <MaterialCommunityIcons name="brain" size={20} color="#fff" />
              <Text style={styles.primaryBtnText}>Run Legal Metrology Audit</Text>
            </View>
          )}
        </Pressable>
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
  headerTag: {
    backgroundColor: theme.colors.brand.light,
    borderColor: theme.colors.brand.border,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  headerTagText: {
    color: theme.colors.brand.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
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
    lineHeight: 18,
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
  sampleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sampleTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.text,
  },
  sampleSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 3,
    marginBottom: 12,
  },
  sampleRow: {
    gap: 8,
  },
  sampleBtn: {
    padding: 10,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sampleBtnActive: {
    backgroundColor: theme.colors.brand.light,
    borderColor: theme.colors.brand.primary,
  },
  sampleBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
  },
  sampleBtnTextActive: {
    color: theme.colors.brand.primary,
  },
  sampleCategory: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  previewCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  imageBox: {
    height: 280,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
    position: 'relative',
    marginBottom: 14,
  },
  previewImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  noImgBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  noImgText: {
    color: theme.colors.textSubtle,
    fontSize: 12,
    fontWeight: '600',
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'space-between',
    padding: 16,
  },
  scanLaser: {
    height: 3,
    backgroundColor: '#38bdf8',
    borderRadius: 2,
    shadowColor: '#38bdf8',
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  scanPromptBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: theme.radius.md,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  scanPromptText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.brand.primary,
  },
  primaryBtn: {
    backgroundColor: theme.colors.brand.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.7,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

