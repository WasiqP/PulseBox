import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme';
import Ribbons from '../components/Ribbons';
import GradientBackground from '../components/GradientBackground';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  // Handle hover events (works on web via React Native Web)
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <View style={styles.screen}>
      <GradientBackground colors={[theme.primary, '#FFFFFF']} />
      <View style={styles.ribbonsContainer}>
        <Ribbons isHovered={isHovered} />
      </View>
      <View style={styles.brandRow}><Text style={styles.brand}><Text style={styles.brandPulse}>Pulse</Text><Text style={styles.brandBox}>Box</Text></Text></View>
      <View 
        style={styles.content}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* <Text style={styles.sub}>Welcome Back</Text> */}
        <Text style={styles.heading}>Welcome Back!</Text>
        <TextInput
          value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={theme.textDim}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
        />
        <TextInput
          value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor={theme.textDim}
            secureTextEntry
            style={styles.input}
        />
        <Pressable style={styles.primaryBtn} android_ripple={{ color: 'rgba(255,255,255,0.15)' }} onPress={() => navigation.replace('Home')}>
          <Text style={styles.primaryLabel}>Log In</Text>
        </Pressable>
        <Pressable onPress={() => {}} hitSlop={8}><Text style={styles.forgot}>Forgot Password?</Text></Pressable>
        <Text style={styles.socialHint}>Log In with socials</Text>
        <View style={styles.socialRow}>
          <Pressable style={styles.socialBtn} android_ripple={{ color: 'rgba(255,255,255,0.15)' }}><Text style={styles.socialText}>G</Text></Pressable>
          <Pressable style={styles.socialBtn} android_ripple={{ color: 'rgba(255,255,255,0.15)' }}><Text style={styles.socialText}>f</Text></Pressable>
        </View>
        <Pressable onPress={() => navigation.navigate('SignUp')}><Text style={styles.alt}>Don't have an account? <Text style={styles.altLink}>Sign Up</Text></Text></Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 32, paddingTop: 42, overflow: 'hidden', position: 'relative' },
  ribbonsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  brandRow: { marginBottom: 40, zIndex: 2, position: 'relative' },
  brand: { fontSize: 28, fontWeight: '800', fontFamily: 'Poppins-Bold' },
  brandPulse: { color: theme.text },
  brandBox: { color: theme.primary },
  content: { 
    flex: 1, 
    zIndex: 2,
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(160, 96, 255, 0.1)',
    // Glass liquid effect
    ...(Platform.OS === 'web' && {
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
    }),
  },
  sub: { fontSize: 18, fontFamily: 'Poppins-Regular', color: theme.text },
  heading: { fontSize: 64, fontWeight: '800', fontFamily: 'Poppins-Bold', color: theme.text, marginVertical: 12, lineHeight: 62, letterSpacing: -1 },
  input: { width: '100%', borderWidth: 1.5, borderColor: theme.primary, borderRadius: 6, paddingHorizontal: 14, paddingVertical: 14, fontSize: 14, fontFamily: 'Poppins-Regular', color: theme.text, marginTop: 14 },
  primaryBtn: { marginTop: 28, backgroundColor: theme.primary, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  primaryLabel: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins-Medium', fontWeight: '600' },
  forgot: { marginTop: 12, fontSize: 11, fontFamily: 'Poppins-Regular', color: theme.textDim, textAlign: 'center' },
  socialHint: { marginTop: 28, fontSize: 12, textAlign: 'center', color: theme.textDim, fontFamily: 'Poppins-Regular' },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 26, marginTop: 14 },
  socialBtn: { backgroundColor: theme.text, width: 110, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  socialText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  alt: { marginTop: 36, fontSize: 13, textAlign: 'center', color: theme.textDim, fontFamily: 'Poppins-Regular' },
  altLink: { color: theme.primary, fontFamily: 'Poppins-Medium' },
});

export default Login;
