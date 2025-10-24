import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Home: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.brand}>
            <Text style={styles.brandPulse}>Pulse</Text>
            <Text style={styles.brandBox}>Box</Text>
          </Text>
          <Text style={styles.welcome}>Welcome to PulseBox!</Text>
        </View>
        
        <View style={styles.features}>
          <Text style={styles.sectionTitle}>Features</Text>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>🎬 Stream Movies</Text>
            <Text style={styles.featureDesc}>Watch the latest movies and TV shows</Text>
          </View>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>📱 Cross-Platform</Text>
            <Text style={styles.featureDesc}>Seamless syncing across all devices</Text>
          </View>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>🎯 Personalized</Text>
            <Text style={styles.featureDesc}>AI-powered recommendations just for you</Text>
          </View>
        </View>
        
        <View style={styles.actions}>
          <Pressable 
            style={styles.primaryBtn} 
            android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
            onPress={() => navigation.navigate('Onboarding01')}
          >
            <Text style={styles.primaryLabel}>Start Onboarding</Text>
          </Pressable>
          
          <Pressable 
            style={styles.secondaryBtn} 
            android_ripple={{ color: 'rgba(255,17,17,0.08)' }}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryLabel}>Go to Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  brand: {
    fontSize: 36,
    fontWeight: '800',
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  brandPulse: {
    color: theme.text,
  },
  brandBox: {
    color: theme.primary,
  },
  welcome: {
    fontSize: 18,
    color: theme.textDim,
    fontFamily: 'Poppins-Regular',
  },
  features: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: theme.text,
    marginBottom: 20,
  },
  featureCard: {
    backgroundColor: theme.card,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: theme.text,
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 14,
    color: theme.textDim,
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
  },
  actions: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
  primaryBtn: {
    backgroundColor: theme.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: theme.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  primaryLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
  secondaryBtn: {
    backgroundColor: theme.background,
    borderWidth: 2,
    borderColor: theme.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryLabel: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
});

export default Home;
