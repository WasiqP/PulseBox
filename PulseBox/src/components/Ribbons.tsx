import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { theme } from '../theme';

interface RibbonsProps {
  isHovered?: boolean;
}

const Ribbons: React.FC<RibbonsProps> = ({ isHovered = false }) => {
  const [path1, setPath1] = useState('');
  const [path2, setPath2] = useState('');
  const [path3, setPath3] = useState('');
  const glowOpacity = useRef(new Animated.Value(0.6)).current;
  const animationFrame = useRef<number>(0);
  const startTime = useRef<number>(Date.now());

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // Generate ribbon path based on time
  const generateRibbonPath = (time: number, offset: number, width: number, speed: number = 1) => {
    const points: { x: number; y: number }[] = [];
    const segments = 20;
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = t * width;
      const wave = Math.sin(t * Math.PI * 3 + time * speed * 0.001) * 40;
      const curve = Math.sin(t * Math.PI) * 60;
      const y = offset + wave + curve;
      points.push({ x, y });
    }

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const cp1x = points[i - 1].x + (points[i].x - points[i - 1].x) / 3;
      const cp1y = points[i - 1].y;
      const cp2x = points[i].x - (points[i].x - points[i - 1].x) / 3;
      const cp2y = points[i].y;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i].x} ${points[i].y}`;
    }
    return path;
  };

  useEffect(() => {
    // Generate initial paths immediately
    const initialTime = Date.now() - startTime.current;
    setPath1(generateRibbonPath(initialTime, screenHeight * 0.2, screenWidth, 1));
    setPath2(generateRibbonPath(initialTime, screenHeight * 0.5, screenWidth, 0.8));
    setPath3(generateRibbonPath(initialTime, screenHeight * 0.75, screenWidth, 1.2));

    const animate = () => {
      const currentTime = Date.now() - startTime.current;
      
      setPath1(generateRibbonPath(currentTime, screenHeight * 0.2, screenWidth, 1));
      setPath2(generateRibbonPath(currentTime, screenHeight * 0.5, screenWidth, 0.8));
      setPath3(generateRibbonPath(currentTime, screenHeight * 0.75, screenWidth, 1.2));

      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);

    // Animate glow opacity
    const glowAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.4,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );
    glowAnim.start();

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      glowAnim.stop();
    };
  }, [screenWidth, screenHeight]);

  return (
    <View 
      style={[
        styles.container,
        { zIndex: isHovered ? 0 : 1 }
      ]}
      pointerEvents="none"
    >
      <Animated.View style={[styles.svgContainer, { opacity: glowOpacity }]}>
        <Svg width={screenWidth} height={screenHeight} style={styles.svg}>
          <Defs>
            {/* Gradient for ribbon 1 */}
            <LinearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={theme.primary} stopOpacity="0.9" />
              <Stop offset="50%" stopColor={theme.primaryAlt} stopOpacity="0.7" />
              <Stop offset="100%" stopColor={theme.primary} stopOpacity="0.9" />
            </LinearGradient>
            
            {/* Gradient for ribbon 2 */}
            <LinearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={theme.primaryAlt} stopOpacity="0.8" />
              <Stop offset="50%" stopColor={theme.primary} stopOpacity="0.6" />
              <Stop offset="100%" stopColor={theme.primaryAlt} stopOpacity="0.8" />
            </LinearGradient>
            
            {/* Gradient for ribbon 3 */}
            <LinearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={theme.primary} stopOpacity="0.7" />
              <Stop offset="50%" stopColor={theme.accent} stopOpacity="0.8" />
              <Stop offset="100%" stopColor={theme.primary} stopOpacity="0.7" />
            </LinearGradient>
          </Defs>
          
          {/* Ribbon 1 */}
          {path1 && (
            <Path
              d={path1}
              fill="url(#gradient1)"
              stroke={theme.primary}
              strokeWidth="3"
              opacity="0.8"
            />
          )}
          
          {/* Ribbon 2 */}
          {path2 && (
            <Path
              d={path2}
              fill="url(#gradient2)"
              stroke={theme.primaryAlt}
              strokeWidth="3"
              opacity="0.75"
            />
          )}
          
          {/* Ribbon 3 */}
          {path3 && (
            <Path
              d={path3}
              fill="url(#gradient3)"
              stroke={theme.primary}
              strokeWidth="3"
              opacity="0.8"
            />
          )}
        </Svg>
      </Animated.View>
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
    overflow: 'hidden',
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Add glow effect using shadow
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10, // For Android
  },
  svg: {
    width: '100%',
    height: '100%',
  },
});

export default Ribbons;

