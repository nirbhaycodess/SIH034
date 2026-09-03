import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

export function LoginScreen({
  onLoginSuccess,
  onNavigateToRegister,
}: {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
}) {
  const [email, setEmail] = useState('priya.sharma@gov.in');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 500);
  };

  const handleDemoSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 300);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Brand Header */}
      <View style={styles.brandHeader}>
        <View style={styles.logoBadge}>
          <MaterialCommunityIcons name="shield-check" size={28} color="#fff" />
        </View>
        <View style={styles.titleRow}>
          <Text style={styles.brandTitle}>PACKSURE</Text>
          <View style={styles.aiBadge}>
            <Text style={styles.aiText}>AI</Text>
          </View>
        </View>
        <Text style={styles.brandSub}>
          Legal Metrology Compliance Platform • Govt of India
        </Text>
      </View>

      {/* 1. DISTINCT DEMO LOGIN SECTION (Separated on top in distinct card) */}
      <View style={styles.demoCard}>
        <View style={styles.demoHeader}>
          <View style={styles.demoTag}>
            <MaterialCommunityIcons name="lightning-bolt" size={14} color="#38bdf8" />
            <Text style={styles.demoTagText}>SIH 2024 EVALUATOR ACCESS</Text>
          </View>
          <MaterialCommunityIcons name="creation" size={18} color="#38bdf8" />
        </View>

        <Text style={styles.demoTitle}>1-Click Evaluator Demo</Text>
        <Text style={styles.demoDesc}>
          Skip manual sign-in and immediately test Inspector Priya Sharma's live inspection command center with sample packages and reports.
        </Text>

        <Pressable
          style={styles.demoBtn}
          onPress={handleDemoSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <View style={styles.btnInner}>
              <Text style={styles.demoBtnText}>Sign In as Inspector Priya (1-Click Demo)</Text>
              <MaterialCommunityIcons name="arrow-right" size={16} color="#fff" />
            </View>
          )}
        </Pressable>
      </View>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR SIGN IN WITH CREDENTIALS</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* 2. OFFICER CREDENTIALS SIGN-IN CARD */}
      <View style={styles.card}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>Officer Sign In</Text>
          <Text style={styles.formSub}>Authorized personnel authentication</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Official Government Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.fieldLabel}>Password</Text>
            <Text style={styles.forgotText}>Forgot?</Text>
          </View>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <Pressable
          style={[styles.primaryBtn, loading && styles.btnDisabled]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <View style={styles.btnInner}>
              <MaterialCommunityIcons name="lock-outline" size={16} color="#fff" />
              <Text style={styles.primaryBtnText}>Sign In Securely</Text>
            </View>
          )}
        </Pressable>

        {/* Link to Register New Officer */}
        <View style={styles.registerFooter}>
          <Text style={styles.registerSub}>Don't have an officer account?</Text>
          <Pressable onPress={onNavigateToRegister} style={styles.registerLinkBtn}>
            <Text style={styles.registerLinkText}>
              Register New Officer Profile →
            </Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.footerNote}>
        Protected government enforcement environment • Legal Metrology Act, 2009
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  brandHeader: {
    alignItems: 'center',
    marginVertical: 18,
  },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.navy[900],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    ...theme.shadows.card,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  aiBadge: {
    backgroundColor: theme.colors.brand.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  aiText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  brandSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  demoCard: {
    backgroundColor: theme.colors.navy[900],
    borderRadius: theme.radius.xl,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    ...theme.shadows.elevated,
  },
  demoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  demoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  demoTagText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
  },
  demoDesc: {
    fontSize: 11,
    color: '#cbd5e1',
    lineHeight: 16,
    marginTop: 4,
    marginBottom: 14,
  },
  demoBtn: {
    backgroundColor: theme.colors.brand.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  demoBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textSubtle,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  formHeader: {
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.text,
  },
  formSub: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginBottom: 6,
  },
  forgotText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.brand.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: theme.colors.text,
    backgroundColor: theme.colors.surfaceSubtle,
  },
  primaryBtn: {
    backgroundColor: theme.colors.navy[900],
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  registerFooter: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceSubtle,
    alignItems: 'center',
    gap: 4,
  },
  registerSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  registerLinkBtn: {
    paddingVertical: 2,
  },
  registerLinkText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.brand.primary,
  },
  footerNote: {
    fontSize: 10,
    color: theme.colors.textSubtle,
    textAlign: 'center',
    marginTop: 20,
  },
});

