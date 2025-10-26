import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App.tsx';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'GetStarted'>;

const GetStarted: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.centerContent}>
        <View style={styles.illustrationWrap}>
          <Image 
            source={require('../../assets/images/original_logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.welcome}>welcome to</Text>
        <Text style={styles.brand}>
          <Text style={styles.brandPulse}>Pulse</Text>
          <Text style={styles.brandBox}>Box</Text>
        </Text>
        <Text style={styles.subtitle}>Collect feedback & grow your business.</Text>
        <Text style={styles.meta}>Create custom forms, gather client insights, and make data-driven decisions to improve your services.</Text>
        <View style={styles.actionsRow}>
          <Pressable style={styles.primaryBtn} android_ripple={{ color: 'rgba(255,255,255,0.2)' }} onPress={() => navigation.navigate('Onboarding01')}>
            <Text style={styles.primaryLabel}>Get Started</Text>
          </Pressable>
            <Pressable style={styles.secondaryBtn} android_ripple={{ color: 'rgba(160,96,255,0.1)' }} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.secondaryLabel}>Log In</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { 
    flex: 1, 
    backgroundColor: theme.primary, 
    paddingHorizontal: 28 
  },
  centerContent: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 16 
  },
  illustrationWrap: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 8, 
    marginBottom: 4, 
    height: 260 
  },
  logo: { 
    width: 200, 
    height: 200
  },
  welcome: { 
    fontSize: 16, 
    color: theme.white, 
    fontFamily: 'Poppins-Regular', 
    textAlign: 'center', 
    marginTop: 18,
    opacity: 0.9
  },
  brand: { 
    fontSize: 48, 
    fontWeight: '800', 
    fontFamily: 'Poppins-Bold', 
    marginTop: 4, 
    textAlign: 'center' 
  },
  brandPulse: { 
    color: theme.white 
  },
  brandBox: { 
    color: theme.accent 
  },
  subtitle: { 
    marginTop: 8, 
    fontSize: 16, 
    color: theme.white, 
    fontFamily: 'Poppins-Medium', 
    textAlign: 'center',
    opacity: 0.95
  },
  meta: { 
    marginTop: 12, 
    fontSize: 14, 
    lineHeight: 20, 
    color: theme.white, 
    textAlign: 'center', 
    fontFamily: 'Poppins-Regular', 
    paddingHorizontal: 8,
    opacity: 0.85
  },
  actionsRow: { 
    flexDirection: 'row', 
    gap: 16, 
    marginTop: 32, 
    marginBottom: 20 
  },
  primaryBtn: { 
    flex: 1, 
    backgroundColor: theme.white, 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4
  },
  primaryLabel: { 
    color: theme.primary, 
    fontSize: 16, 
    fontWeight: '600', 
    fontFamily: 'Poppins-Medium' 
  },
  secondaryBtn: { 
    flex: 1, 
    borderWidth: 2, 
    borderColor: theme.white, 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  secondaryLabel: { 
    color: theme.white, 
    fontSize: 16, 
    fontWeight: '600', 
    fontFamily: 'Poppins-Medium' 
  },
});

export default GetStarted;
