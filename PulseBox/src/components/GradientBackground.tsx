import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { theme } from '../theme';

interface GradientBackgroundProps {
  colors?: string[];
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ 
  colors = [theme.primary, '#FFFFFF'] 
}) => {
  const { width, height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <Svg width={width} height={height} style={styles.svg}>
        <Defs>
          <LinearGradient id="backgroundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={colors[0]} stopOpacity="1" />
            <Stop offset="100%" stopColor={colors[1]} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#backgroundGradient)" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  svg: {
    width: '100%',
    height: '100%',
  },
});

export default GradientBackground;


