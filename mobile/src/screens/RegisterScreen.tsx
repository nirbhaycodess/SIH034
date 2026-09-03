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

export function RegisterScreen({
  onRegisterSuccess,
  onNavigateToLogin,
}: {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [designation, setDesignation] = useState('Legal Metrology Officer');
  const [badgeId, setBadgeId] = useState('');
  const [zone, setZone] = useState('Zone 4 — Delhi NCR');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Validation Error', 'Please provide full name and official email.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Password and confirmation password must match.');
      return;
    }
    if (!agreed) {
      Alert.alert('Statutory Declaration', 'You must agree to statutory officer authorization.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Registration Complete',
        `Account created for ${name}. You can now sign in with your credentials.`,
        [{ text: 'Sign In', onPress: onNavigateToLogin }]
      );
    }, 600);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Brand Header */}
      <View style={styles.brandHeader}>
        <View style={styles.logoBadge}>
          <MaterialCommunityIcons name="account-plus-outline" size={26} color="#fff" />
        </View>
        <Text style={styles.brandTitle}>Register Officer Profile</Text>
        <Text style={styles.brandSub}>
          Enroll official credentials into the Legal Metrology National Grid
        </Text>
      </View>

      {/* Form Card */}
      <View style={styles.card}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Inspector Rohan Mehta"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Official Government Email</Text>
          <TextInput
            style={styles.input}
            placeholder="rohan.mehta@gov.in"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Designation / Role</Text>
          <TextInput
            style={styles.input}
            value={designation}
            onChangeText={setDesignation}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Officer Badge / Service ID</Text>
          <TextInput
            style={[styles.input, styles.monoText]}
            placeholder="LM-DEL-512"
            value={badgeId}
            onChangeText={setBadgeId}
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Assigned Jurisdiction Zone</Text>
          <TextInput
            style={styles.input}
            value={zone}
            onChangeText={setZone}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        {/* Declaration agreement */}
        <Pressable
          style={styles.checkRow}
          onPress={() => setAgreed(!agreed)}
        >
          <MaterialCommunityIcons
            name={agreed ? 'checkbox-marked' : 'checkbox-blank-outline'}
            size={20}
            color={agreed ? theme.colors.brand.primary : theme.colors.textSubtle}
          />
          <Text style={styles.checkText}>
            I confirm statutory authorization under the Legal Metrology Act, 2009.
          </Text>
        </Pressable>

        <Pressable
          style={[styles.primaryBtn, loading && styles.btnDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <View style={styles.btnInner}>
              <MaterialCommunityIcons name="account-check-outline" size={18} color="#fff" />
              <Text style={styles.primaryBtnText}>Register Officer Profile</Text>
            </View>
          )}
        </Pressable>

        {/* Link to Sign In */}
        <View style={styles.loginFooter}>
          <Text style={styles.loginSub}>Already registered with an officer account?</Text>
          <Pressable onPress={onNavigateToLogin} style={styles.loginLinkBtn}>
            <Text style={styles.loginLinkText}>
              Sign in securely →
            </Text>
          </Pressable>
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
    padding: 20,
    paddingBottom: 40,
  },
  brandHeader: {
    alignItems: 'center',
    marginVertical: 18,
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.navy[900],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    ...theme.shadows.card,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.colors.text,
  },
  brandSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '600',
    marginTop: 3,
    textAlign: 'center',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: theme.colors.text,
    backgroundColor: theme.colors.surfaceSubtle,
  },
  monoText: {
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginVertical: 10,
  },
  checkText: {
    flex: 1,
    fontSize: 11,
    color: theme.colors.textMuted,
    lineHeight: 16,
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
  btnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  loginFooter: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceSubtle,
    alignItems: 'center',
    gap: 4,
  },
  loginSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  loginLinkBtn: {
    paddingVertical: 2,
  },
  loginLinkText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.brand.primary,
  },
});

