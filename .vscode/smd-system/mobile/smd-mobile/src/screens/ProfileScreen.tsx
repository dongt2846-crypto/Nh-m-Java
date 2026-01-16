import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabParamList, RootStackParamList } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userAPI, authAPI } from '../services/api';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  fullName: string;
  department: string;
  roles: Array<{ name: string }>;
}

export default function ProfileScreen() {
  type ProfileScreenNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'Profile'>,
    StackNavigationProp<RootStackParamList>
  >;
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  useEffect(() => {
    fetchProfile();
    loadSettings();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const notifications = await AsyncStorage.getItem('notifications_enabled');
      const offline = await AsyncStorage.getItem('offline_mode');
      
      if (notifications !== null) {
        setNotificationsEnabled(JSON.parse(notifications));
      }
      if (offline !== null) {
        setOfflineMode(JSON.parse(offline));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (key: string, value: boolean) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await authAPI.logout();
              await AsyncStorage.removeItem('token');
              navigation.navigate('Login');
            } catch (error) {
              console.error('Logout error:', error);
              // Still navigate to login even if API call fails
              await AsyncStorage.removeItem('token');
              navigation.navigate('Login');
            }
          },
        },
      ]
    );
  };

  const handleNotificationToggle = (value: boolean) => {
    setNotificationsEnabled(value);
    saveSettings('notifications_enabled', value);
  };

  const handleOfflineModeToggle = (value: boolean) => {
    setOfflineMode(value);
    saveSettings('offline_mode', value);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {profile?.fullName?.charAt(0)?.toUpperCase() || '👤'}
          </Text>
        </View>
        
        <Text style={styles.fullName}>{profile?.fullName || 'Unknown User'}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
        
        {profile?.roles && profile.roles.length > 0 && (
          <View style={styles.rolesContainer}>
            {profile.roles.map((role, index) => (
              <View key={index} style={styles.roleBadge}>
                <Text style={styles.roleText}>
                  {role.name.replace('_', ' ')}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Profile Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Information</Text>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Username</Text>
          <Text style={styles.infoValue}>{profile?.username}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Department</Text>
          <Text style={styles.infoValue}>{profile?.department || 'Not specified'}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Student ID</Text>
          <Text style={styles.infoValue}>{profile?.id}</Text>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive notifications about new syllabi and updates
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
            thumbColor={notificationsEnabled ? '#FFFFFF' : '#F3F4F6'}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Offline Mode</Text>
            <Text style={styles.settingDescription}>
              Download syllabi for offline viewing
            </Text>
          </View>
          <Switch
            value={offlineMode}
            onValueChange={handleOfflineModeToggle}
            trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
            thumbColor={offlineMode ? '#FFFFFF' : '#F3F4F6'}
          />
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionIcon}>📱</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionLabel}>App Version</Text>
            <Text style={styles.actionDescription}>1.0.0</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionIcon}>📋</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionLabel}>Terms of Service</Text>
            <Text style={styles.actionDescription}>View terms and conditions</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionIcon}>🔒</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionLabel}>Privacy Policy</Text>
            <Text style={styles.actionDescription}>How we protect your data</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionIcon}>❓</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionLabel}>Help & Support</Text>
            <Text style={styles.actionDescription}>Get help using the app</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  profileHeader: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#4F46E5',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  roleBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 4,
    marginVertical: 2,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  actionInfo: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionArrow: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});