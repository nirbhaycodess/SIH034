import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from './src/theme';
import { mockInspections } from './src/data';
import type { Inspection, TabRoute } from './src/types';

// Screens
import { DashboardScreen } from './src/screens/DashboardScreen';
import { NewInspectionScreen } from './src/screens/NewInspectionScreen';
import { InspectionResultScreen } from './src/screens/InspectionResultScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { ProductsScreen } from './src/screens/ProductsScreen';
import { ReportsScreen } from './src/screens/ReportsScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [currentTab, setCurrentTab] = useState<TabRoute>('dashboard');
  const [selectedInspection, setSelectedInspection] = useState<Inspection>(mockInspections[0]);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSelectInspection = (inspection: Inspection) => {
    setSelectedInspection(inspection);
    setCurrentTab('result');
  };

  const handleInspectionComplete = (inspection: Inspection) => {
    setSelectedInspection(inspection);
    setCurrentTab('result');
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />
        {authView === 'login' ? (
          <LoginScreen
            onLoginSuccess={() => {
              setIsAuthenticated(true);
              setCurrentTab('dashboard');
            }}
            onNavigateToRegister={() => setAuthView('register')}
          />
        ) : (
          <RegisterScreen
            onRegisterSuccess={() => setAuthView('login')}
            onNavigateToLogin={() => setAuthView('login')}
          />
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      {/* Top Ministry Header */}
      <View style={styles.topHeader}>
        <View style={styles.headerBrand}>
          <View style={styles.logoBadge}>
            <MaterialCommunityIcons name="shield-check" size={20} color="#fff" />
          </View>
          <View>
            <View style={styles.logoRow}>
              <Text style={styles.brandTitle}>PACKINSPECT</Text>
              <View style={styles.aiPill}>
                <Text style={styles.aiText}>AI</Text>
              </View>
            </View>
            <Text style={styles.brandSub}>Legal Metrology Division</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          {/* Notification Bell */}
          <Pressable
            style={styles.actionIconBtn}
            onPress={() => setShowNotifications(true)}
          >
            <MaterialCommunityIcons name="bell-outline" size={20} color={theme.colors.text} />
            <View style={styles.notifDot} />
          </Pressable>

          {/* More menu */}
          <Pressable
            style={styles.actionIconBtn}
            onPress={() => setShowMoreModal(true)}
          >
            <MaterialCommunityIcons name="dots-vertical" size={20} color={theme.colors.text} />
          </Pressable>
        </View>
      </View>

      {/* Main Screen Body */}
      <View style={styles.body}>
        {currentTab === 'dashboard' && (
          <DashboardScreen
            onNavigate={(tab: TabRoute) => setCurrentTab(tab)}
            onSelectInspection={handleSelectInspection}
          />
        )}

        {currentTab === 'new_inspection' && (
          <NewInspectionScreen
            onInspectionComplete={handleInspectionComplete}
          />
        )}

        {currentTab === 'result' && (
          <InspectionResultScreen
            inspection={selectedInspection}
            onBack={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'history' && (
          <HistoryScreen
            onSelectInspection={handleSelectInspection}
          />
        )}

        {currentTab === 'products' && (
          <ProductsScreen
            onInspectAgain={() => setCurrentTab('new_inspection')}
          />
        )}

        {currentTab === 'reports' && <ReportsScreen />}
        {currentTab === 'analytics' && <AnalyticsScreen />}
        {currentTab === 'settings' && (
          <SettingsScreen onSignOut={() => setIsAuthenticated(false)} />
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        {/* Dashboard */}
        <Pressable
          style={styles.navItem}
          onPress={() => setCurrentTab('dashboard')}
        >
          <MaterialCommunityIcons
            name={currentTab === 'dashboard' ? 'view-dashboard' : 'view-dashboard-outline'}
            size={22}
            color={currentTab === 'dashboard' ? theme.colors.brand.primary : theme.colors.textMuted}
          />
          <Text
            style={[
              styles.navLabel,
              currentTab === 'dashboard' && styles.navLabelActive,
            ]}
          >
            Overview
          </Text>
        </Pressable>

        {/* History */}
        <Pressable
          style={styles.navItem}
          onPress={() => setCurrentTab('history')}
        >
          <MaterialCommunityIcons
            name={currentTab === 'history' ? 'clipboard-list' : 'clipboard-list-outline'}
            size={22}
            color={currentTab === 'history' ? theme.colors.brand.primary : theme.colors.textMuted}
          />
          <Text
            style={[
              styles.navLabel,
              currentTab === 'history' && styles.navLabelActive,
            ]}
          >
            History
          </Text>
        </Pressable>

        {/* Center Prominent Scan Button */}
        <Pressable
          style={styles.centerScanBtn}
          onPress={() => setCurrentTab('new_inspection')}
        >
          <View style={styles.centerScanInner}>
            <MaterialCommunityIcons name="camera-iris" size={28} color="#fff" />
          </View>
        </Pressable>

        {/* Products */}
        <Pressable
          style={styles.navItem}
          onPress={() => setCurrentTab('products')}
        >
          <MaterialCommunityIcons
            name={currentTab === 'products' ? 'package-variant' : 'package-variant-closed'}
            size={22}
            color={currentTab === 'products' ? theme.colors.brand.primary : theme.colors.textMuted}
          />
          <Text
            style={[
              styles.navLabel,
              currentTab === 'products' && styles.navLabelActive,
            ]}
          >
            Products
          </Text>
        </Pressable>

        {/* More / Settings */}
        <Pressable
          style={styles.navItem}
          onPress={() => setShowMoreModal(true)}
        >
          <MaterialCommunityIcons
            name={currentTab === 'settings' ? 'cog' : 'cog-outline'}
            size={22}
            color={
              currentTab === 'settings' || currentTab === 'reports' || currentTab === 'analytics'
                ? theme.colors.brand.primary
                : theme.colors.textMuted
            }
          />
          <Text
            style={[
              styles.navLabel,
              (currentTab === 'settings' || currentTab === 'reports' || currentTab === 'analytics') &&
                styles.navLabelActive,
            ]}
          >
            More
          </Text>
        </Pressable>
      </View>

      {/* Notifications Drawer Modal */}
      <Modal visible={showNotifications} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Inspection Alerts</Text>
                <Text style={styles.modalSub}>Zone 4 compliance feed</Text>
              </View>
              <Pressable onPress={() => setShowNotifications(false)}>
                <MaterialCommunityIcons name="close" size={20} color={theme.colors.textMuted} />
              </Pressable>
            </View>

            <View style={styles.notifList}>
              <View style={styles.notifItem}>
                <View style={[styles.notifIcon, { backgroundColor: theme.colors.rose.light }]}>
                  <MaterialCommunityIcons name="alert-decagram" size={18} color={theme.colors.rose.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifTitle}>Rule 6(1)(l) Flag on Shampoo Bottle</Text>
                  <Text style={styles.notifTime}>FreshGlow Herbal • 18m ago</Text>
                </View>
              </View>

              <View style={styles.notifItem}>
                <View style={[styles.notifIcon, { backgroundColor: theme.colors.emerald.light }]}>
                  <MaterialCommunityIcons name="check-circle-outline" size={18} color={theme.colors.emerald.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifTitle}>Batch Compliance Certificate Issued</Text>
                  <Text style={styles.notifTime}>Nature Harvest Oats • 45m ago</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* More Navigation Menu Modal */}
      <Modal visible={showMoreModal} animationType="fade" transparent>
        <Pressable style={styles.modalOverlay} onPress={() => setShowMoreModal(false)}>
          <View style={styles.moreCard}>
            <Text style={styles.moreTitle}>Workspace Navigation</Text>

            <Pressable
              style={styles.moreItem}
              onPress={() => {
                setCurrentTab('reports');
                setShowMoreModal(false);
              }}
            >
              <MaterialCommunityIcons name="file-document-outline" size={20} color={theme.colors.brand.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.moreItemText}>Compliance Reports</Text>
                <Text style={styles.moreItemSub}>Official certificates & statutory logs</Text>
              </View>
            </Pressable>

            <Pressable
              style={styles.moreItem}
              onPress={() => {
                setCurrentTab('analytics');
                setShowMoreModal(false);
              }}
            >
              <MaterialCommunityIcons name="chart-box-outline" size={20} color={theme.colors.emerald.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.moreItemText}>Analytics & Intelligence</Text>
                <Text style={styles.moreItemSub}>Category pass rates & violation trends</Text>
              </View>
            </Pressable>

            <Pressable
              style={styles.moreItem}
              onPress={() => {
                setCurrentTab('settings');
                setShowMoreModal(false);
              }}
            >
              <MaterialCommunityIcons name="tune" size={20} color={theme.colors.navy[900]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.moreItemText}>Settings & Credentials</Text>
                <Text style={styles.moreItemSub}>Officer profile & Metrology rulebook</Text>
              </View>
            </Pressable>

            <Pressable
              style={[styles.moreItem, { borderBottomWidth: 0 }]}
              onPress={() => {
                setShowMoreModal(false);
                setIsAuthenticated(false);
              }}
            >
              <MaterialCommunityIcons name="logout" size={20} color={theme.colors.rose.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.moreItemText, { color: theme.colors.rose.primary }]}>
                  Sign Out / Switch Officer
                </Text>
                <Text style={styles.moreItemSub}>Return to Login / Register screens</Text>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: '#fff',
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.navy[900],
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.text,
    letterSpacing: -0.3,
  },
  aiPill: {
    backgroundColor: theme.colors.brand.primary,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  aiText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
  },
  brandSub: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionIconBtn: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: theme.colors.rose.primary,
    position: 'absolute',
    top: 7,
    right: 7,
  },
  body: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 64,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingBottom: 4,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  navLabelActive: {
    color: theme.colors.brand.primary,
  },
  centerScanBtn: {
    top: -14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerScanInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: theme.colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
    gap: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.text,
  },
  modalSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  notifList: {
    gap: 12,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSubtle,
  },
  notifIcon: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
  },
  notifTime: {
    fontSize: 10,
    color: theme.colors.textSubtle,
    marginTop: 2,
  },
  moreCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
    gap: 8,
  },
  moreTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  moreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceSubtle,
  },
  moreItemText: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.text,
  },
  moreItemSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
});
