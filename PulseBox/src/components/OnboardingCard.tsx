import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

interface Props {
  Illustration: React.ComponentType<any>;
  title: string;
  description: string;
  step: number;
  total: number;
  onNext: () => void;
  nextLabel?: string;
  onSkip?: () => void; // Skip now rendered as a secondary full-width button
}

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const OnboardingCard: React.FC<Props> = ({ Illustration, title, description, step, total, onNext, nextLabel = 'Continue', onSkip }) => {
  // The original SVGs are 1024x768 (aspect 4:3). We'll scale to fit within a max area.
  const { illusWidth, illusHeight } = useMemo(() => {
    const aspect = 1024 / 768; // width / height = 4/3
    // Use available vertical space (roughly 55% of screen height allocated to illustrationZone) minus padding.
    const maxZoneHeight = SCREEN_HEIGHT * 0.55 - 60; // subtract some padding
    const maxZoneWidth = SCREEN_WIDTH - 56; // horizontal padding from screen style (28 * 2)
    // Start from width-limited size
    let w = Math.min(maxZoneWidth, 420); // cap so it doesn't get excessively large on tablets
    let h = w / aspect;
    if (h > maxZoneHeight) {
      h = maxZoneHeight;
      w = h * aspect;
    }
    // Ensure minimum reasonable size
    if (w < 220) {
      w = 220;
      h = w / aspect;
    }
    return { illusWidth: Math.round(w), illusHeight: Math.round(h) };
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.illustrationZone}>
        <Illustration width={illusWidth} height={illusHeight} />
      </View>
      <View style={styles.textZone}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{description}</Text>
        <View style={styles.pagination}>{Array.from({ length: total }).map((_, i) => <View key={i} style={[styles.dot, i + 1 === step && styles.dotActive]} />)}</View>
        <Pressable onPress={onNext} style={styles.primaryBtn} android_ripple={{ color: 'rgba(255,255,255,0.15)' }}>
          <Text style={styles.primaryLabel}>{nextLabel}</Text>
        </Pressable>
        {onSkip && (
          <Pressable onPress={onSkip} style={styles.secondaryBtn} android_ripple={{ color: 'rgba(255,0,0,0.08)' }}>
            <Text style={styles.secondaryLabel}>Skip</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.background, paddingHorizontal: 28, paddingTop: 40, paddingBottom: 32 },
  illustrationZone: { flex: 0.55, justifyContent: 'center', alignItems: 'center' },
  textZone: { flex: 0.45, alignItems: 'center' },
  illustrationWrap: { marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '800', color: theme.text, fontFamily: 'Poppins-Bold', textAlign: 'center', marginTop: 8 },
  desc: { fontSize: 14, lineHeight: 20, color: theme.textDim, textAlign: 'center', marginTop: 12, fontFamily: 'Poppins-Regular', paddingHorizontal: 8 },
  pagination: { flexDirection: 'row', gap: 8, marginTop: 24 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.border },
  dotActive: { width: 18, backgroundColor: theme.primary },
  primaryBtn: { marginTop: 28, backgroundColor: theme.primary, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 14, alignSelf: 'stretch', alignItems: 'center', shadowColor: theme.primary, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 6 }, shadowRadius: 16, elevation: 6 },
  primaryLabel: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', fontFamily: 'Poppins-Medium' },
  secondaryBtn: { marginTop: 16, backgroundColor: theme.background, borderWidth: 2, borderColor: theme.primary, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 14, alignSelf: 'stretch', alignItems: 'center' },
  secondaryLabel: { color: theme.primary, fontSize: 16, fontWeight: '600', fontFamily: 'Poppins-Medium' },
});

export default OnboardingCard;
