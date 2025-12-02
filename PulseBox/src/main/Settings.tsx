import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import BottomTab from '../components/BottomTab';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const Settings: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
        
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <Pressable style={styles.settingItem} android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
              <Text style={styles.settingLabel}>Profile</Text>
              <Text style={styles.settingArrow}>›</Text>
            </Pressable>
            
            <Pressable style={styles.settingItem} android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
              <Text style={styles.settingLabel}>Edit Profile</Text>
              <Text style={styles.settingArrow}>›</Text>
            </Pressable>
            
            <Pressable style={styles.settingItem} android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingArrow}>›</Text>
            </Pressable>
          </View>
          
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>General</Text>
            
            <Pressable style={styles.settingItem} android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
              <Text style={styles.settingLabel}>Theme</Text>
              <Text style={styles.settingArrow}>›</Text>
            </Pressable>
            
            <Pressable style={styles.settingItem} android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
              <Text style={styles.settingLabel}>Language</Text>
              <Text style={styles.settingArrow}>›</Text>
            </Pressable>
            
            <Pressable style={styles.settingItem} android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
              <Text style={styles.settingLabel}>Help & Support</Text>
              <Text style={styles.settingArrow}>›</Text>
            </Pressable>
          </View>
          
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>About</Text>
            
            <Pressable style={styles.settingItem} android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
              <Text style={styles.settingLabel}>Terms of Service</Text>
              <Text style={styles.settingArrow}>›</Text>
            </Pressable>
            
            <Pressable style={styles.settingItem} android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
              <Text style={styles.settingLabel}>Privacy Policy</Text>
              <Text style={styles.settingArrow}>›</Text>
            </Pressable>
            
            <Pressable style={styles.settingItem} android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
              <Text style={styles.settingLabel}>App Version</Text>
              <Text style={styles.settingValue}>1.0.0</Text>
            </Pressable>
          </View>
          
          <Pressable 
            style={styles.logoutButton} 
            android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </ScrollView>
      </View>
      
      <BottomTab navigation={navigation} currentRoute="Settings" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginBottom: 32,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  settingsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: '#999999',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#000000',
  },
  settingArrow: {
    fontSize: 24,
    fontFamily: 'Poppins-Regular',
    color: '#999999',
  },
  settingValue: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
  },
  logoutButton: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
  },
});

export default Settings;

