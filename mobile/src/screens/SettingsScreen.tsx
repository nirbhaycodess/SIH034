import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  Pressable,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

export function SettingsScreen({
  onSignOut,
}: {
  onSignOut?: () => void;
}) {
  const [name, setName] = useState('Priya Sharma');
  const [email, setEmail] = useState('priya.sharma@gov.in');
  const [badgeId, setBadgeId] = useState('LM-DEL-408');
  const [zone, setZone] = useState('Zone 4 — Delhi NCR');

  const [alertHighRisk, setAlertHighRisk] = useState(true);
  const [alertAssignment, setAlertAssignment] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const [threshold, setThreshold] = useState('85% (Recommended)');

  const handleSave = () => {
    Alert.alert('Settings Saved', 'Officer preferences and workspace parameters updated.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings & Credentials</Text>
        <Text style={styles.subtitle}>
          Manage enforcement officer credentials and Legal Metrology ruleset.
        </Text>
      </View>

      {/* Profile Section */}
      <View style={styles.card}>
        <View style={styles.sectionTitleRow}>
          <MaterialCommunityIcons name="account-tie" size={20} color={theme.colors.brand.primary} />
          <Text style={styles.sectionTitle}>Officer Profile</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Full Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Official Government Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Officer Badge / Identification</Text>
          <TextInput style={[styles.input, styles.monoText]} value={badgeId} onChangeText={setBadgeId} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Jurisdiction / Enforcement Zone</Text>
          <TextInput style={styles.input} value={zone} onChangeText={setZone} />
        </View>
      </View>

      {/* Security Section */}
      <View style={styles.card}>
        <View style={styles.sectionTitleRow}>
          <MaterialCommunityIcons name="shield-lock-outline" size={20} color={theme.colors.emerald.text} />
          <Text style={styles.sectionTitle}>Security & 2FA</Text>
        </View>

        <View style={styles.securityBox}>
          <View style={{ flex: 1 }}>
            <Text style={styles.securityTitle}>Two-Factor Authentication (Govt e-Sign)</Text>
            <Text style={styles.securitySub}>NIC OTP mandatory on session start</Text>
          </View>
          <View style={styles.enforcedBadge}>
            <Text style={styles.enforcedText}>ACTIVE</Text>
          </View>
        </View>

        <View style={[styles.securityBox, { marginTop: 10 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.securityTitle}>Terminal Session</Text>
            <Text style={styles.securitySub}>Authorized Govt Network • IP 10.14.88.19</Text>
          </View>
        </View>
      </View>

      {/* Notification Preferences */}
      <View style={styles.card}>
        <View style={styles.sectionTitleRow}>
          <MaterialCommunityIcons name="bell-ring-outline" size={20} color={theme.colors.amber.dark} />
          <Text style={styles.sectionTitle}>Notification Alerts</Text>
        </View>

        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>High-Risk Violation Pings</Text>
            <Text style={styles.toggleSub}>Immediate alert when Rule 6(1)(l) or MRP flags occur</Text>
          </View>
          <Switch
            value={alertHighRisk}
            onValueChange={setAlertHighRisk}
            trackColor={{ false: theme.colors.border, true: theme.colors.brand.primary }}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>Queue Assignment Alerts</Text>
            <Text style={styles.toggleSub}>When new packages are routed to your zone</Text>
          </View>
          <Switch
            value={alertAssignment}
            onValueChange={setAlertAssignment}
            trackColor={{ false: theme.colors.border, true: theme.colors.brand.primary }}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>Weekly Compliance Summary</Text>
            <Text style={styles.toggleSub}>Every Monday morning at 09:00 IST</Text>
          </View>
          <Switch
            value={weeklyDigest}
            onValueChange={setWeeklyDigest}
            trackColor={{ false: theme.colors.border, true: theme.colors.brand.primary }}
          />
        </View>
      </View>

      {/* AI & Rulebook Preferences */}
      <View style={styles.card}>
        <View style={styles.sectionTitleRow}>
          <MaterialCommunityIcons name="tune" size={20} color={theme.colors.navy[900]} />
          <Text style={styles.sectionTitle}>AI Recognition & Metrology Rulebook</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Active Statutory Rulebook</Text>
          <View style={styles.readBox}>
            <Text style={styles.readText}>
              Legal Metrology (Packaged Commodities) Rules, 2011 (with 2024 Amendments)
            </Text>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>OCR Confidence Threshold</Text>
          <View style={styles.readBox}>
            <Text style={styles.readText}>{threshold}</Text>
          </View>
        </View>
      </View>

      {/* Save Button */}
      <Pressable style={styles.saveBtn} onPress={handleSave}>
        <MaterialCommunityIcons name="content-save-check" size={18} color="#fff" />
        <Text style={styles.saveBtnText}>Save Workspace Settings</Text>
      </Pressable>

      {/* Sign Out Button */}
      {onSignOut && (
        <Pressable
          style={styles.signOutBtn}
          onPress={onSignOut}
        >
          <MaterialCommunityIcons name="logout" size={18} color={theme.colors.rose.primary} />
          <Text style={styles.signOutBtnText}>Sign Out / Switch Officer Profile</Text>
        </Pressable>
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
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16,
    ...theme.shadows.card,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSubtle,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.text,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginBottom: 6,
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
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radius.md,
    padding: 12,
  },
  securityTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
  },
  securitySub: {
    fontSize: 10,
    color: theme.colors.textSubtle,
    marginTop: 2,
  },
  enforcedBadge: {
    backgroundColor: theme.colors.emerald.light,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.emerald.border,
  },
  enforcedText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.emerald.text,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSubtle,
  },
  toggleTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
  },
  toggleSub: {
    fontSize: 10,
    color: theme.colors.textSubtle,
    marginTop: 2,
  },
  readBox: {
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  readText: {
    fontSize: 12,
    color: theme.colors.text,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: theme.colors.brand.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
    ...theme.shadows.card,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  signOutBtn: {
    borderWidth: 1,
    borderColor: theme.colors.rose.border,
    backgroundColor: theme.colors.rose.light,
    borderRadius: theme.radius.md,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 30,
  },
  signOutBtnText: {
    color: theme.colors.rose.text,
    fontSize: 13,
    fontWeight: '800',
  },
});

