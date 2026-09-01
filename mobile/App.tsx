import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { analyzeImage, type Analysis } from './src/api';

const API_URL = 'http://10.0.2.2:8000';
const labels: Record<string, string> = {
  product_name: 'Product name',
  manufacturer: 'Manufacturer',
  packer: 'Packer',
  importer: 'Importer',
  net_quantity: 'Net quantity',
  mrp: 'MRP',
  manufacturing_date: 'Manufacturing date',
  consumer_care: 'Consumer care',
  country_of_origin: 'Country of origin',
};

export default function App() {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset>();
  const [analysis, setAnalysis] = useState<Analysis>();
  const [loading, setLoading] = useState(false);

  async function chooseImage(useCamera: boolean) {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow image access in your device settings to scan a package.');
      return;
    }
    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.9 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.9 });
    if (!result.canceled) {
      setImage(result.assets[0]);
      setAnalysis(undefined);
    }
  }

  async function runAnalysis() {
    if (!image) return;
    setLoading(true);
    try {
      setAnalysis(await analyzeImage(API_URL, image.uri, image.fileName ?? 'package.jpg'));
    } catch (error) {
      Alert.alert('Could not analyze image', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.logo}><MaterialCommunityIcons name="shield-check" size={27} color="#fff" /></View>
          <View><Text style={styles.title}>PackSure AI</Text><Text style={styles.subtitle}>Declaration review workspace</Text></View>
        </View>
        <Text style={styles.heading}>New inspection</Text>
        <Text style={styles.copy}>Scan a clear front label to extract package declarations.</Text>
        <View style={styles.card}>
          {image ? <Image source={{ uri: image.uri }} style={styles.preview} /> : (
            <View style={styles.empty}><MaterialCommunityIcons name="image-search-outline" size={44} color="#2563eb" /><Text style={styles.emptyText}>No package image selected</Text></View>
          )}
          <View style={styles.actions}>
            <Pressable style={styles.secondary} onPress={() => chooseImage(true)}><MaterialCommunityIcons name="camera-outline" size={21} color="#1d4ed8" /><Text style={styles.secondaryText}>Camera</Text></Pressable>
            <Pressable style={styles.secondary} onPress={() => chooseImage(false)}><MaterialCommunityIcons name="image-outline" size={21} color="#1d4ed8" /><Text style={styles.secondaryText}>Gallery</Text></Pressable>
          </View>
          <Pressable style={[styles.primary, !image && styles.disabled]} disabled={!image || loading} onPress={runAnalysis}>
            {loading ? <ActivityIndicator color="#fff" /> : <><MaterialCommunityIcons name="brain" size={21} color="#fff" /><Text style={styles.primaryText}>Analyze declaration</Text></>}
          </Pressable>
        </View>
        {analysis && <View style={styles.card}><Text style={styles.resultTitle}>Extracted declarations</Text><Text style={styles.status}>OCR status: {analysis.ocr_status}</Text>{Object.entries(labels).map(([key, label]) => { const field = analysis.fields[key]; return <View style={styles.row} key={key}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{field?.value ?? 'Not detected'}</Text><Text style={styles.confidence}>{Math.round((field?.confidence ?? 0) * 100)}%</Text></View>; })}</View>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  container: { padding: 20, gap: 18 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  logo: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#1d4ed8', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  subtitle: { color: '#64748b', marginTop: 2 },
  heading: { fontSize: 28, fontWeight: '800', color: '#0f172a' },
  copy: { color: '#64748b', fontSize: 15 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 16, gap: 14, shadowColor: '#0f172a', shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  empty: { height: 210, borderRadius: 12, borderWidth: 1, borderColor: '#bfdbfe', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#eff6ff' },
  emptyText: { color: '#475569', fontWeight: '600' },
  preview: { height: 250, width: '100%', borderRadius: 12, resizeMode: 'cover' },
  actions: { flexDirection: 'row', gap: 10 },
  secondary: { flex: 1, borderWidth: 1, borderColor: '#bfdbfe', borderRadius: 10, padding: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7 },
  secondaryText: { color: '#1d4ed8', fontWeight: '700' },
  primary: { backgroundColor: '#1d4ed8', borderRadius: 10, minHeight: 50, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  disabled: { backgroundColor: '#94a3b8' },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  resultTitle: { fontSize: 19, fontWeight: '800', color: '#0f172a' },
  status: { color: '#64748b', fontSize: 13 },
  row: { borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingVertical: 10, gap: 3 },
  label: { color: '#64748b', fontSize: 12, fontWeight: '700' },
  value: { color: '#0f172a', fontSize: 15, fontWeight: '600' },
  confidence: { color: '#16a34a', fontSize: 12, fontWeight: '700' },
});
