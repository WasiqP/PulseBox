import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme';
import Svg, { Path } from 'react-native-svg';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

// SVG Icons
const HomeIcon = ({ size = 24, color = '#A060FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 22V12H15V22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const TransferIcon = ({ size = 24, color = '#A060FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const StatsIcon = ({ size = 24, color = '#A060FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 20V10M12 20V4M6 20V14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const SettingsIcon = ({ size = 24, color = '#A060FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2579 9.77251 19.9889C9.5799 19.7199 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.011 9.77251C4.28 9.5799 4.48564 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Form Type Icons
const ClipboardIcon = ({ size = 24, color = '#666' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5C15 3.89543 14.1046 3 13 3H11C9.89543 3 9 3.89543 9 5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const StarIcon = ({ size = 24, color = '#666' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const MessageIcon = ({ size = 24, color = '#666' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ChartIcon = ({ size = 24, color = '#666' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 3V21H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M7 16L10 13L14 17L21 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M18 16H21V13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const TargetIcon = ({ size = 24, color = '#666' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const TrophyIcon = ({ size = 24, color = '#666' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9H18C18 9 20 9.5 20 13C20 16 18 17 16 17H8C6 17 4 16 4 13C4 9.5 6 9 6 9Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M7 9V7C7 5.89543 7.89543 5 9 5H15C16.1046 5 17 5.89543 17 7V9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 17V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M8 21H16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const Home: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Lottie Animated Header */}
      <View style={styles.header}>
        {/* Animated Background */}
        <View style={styles.animatedBackground}>
          {/* Lottie animation placeholder - will be replaced with actual Lottie */}
          <View style={styles.lottieContainer}>
            <Text style={styles.lottiePlaceholder}>🎨</Text>
          </View>
        </View>
        
        {/* Header Content */}
        <View style={styles.headerContent}>
          <View style={styles.welcomeSection}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>Good morning!</Text>
              <View style={styles.waveAnimation}>
                <Text style={styles.waveEmoji}>👋</Text>
              </View>
            </View>
            <Text style={styles.welcomeText}>Ready to collect feedback?</Text>
            <Text style={styles.descriptionText}>Create forms that your customers will love</Text>
            
            {/* Animated Stats */}
            {/* <View style={styles.animatedStats}>
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Text style={styles.statEmoji}>📝</Text>
                </View>
                <View style={styles.statContent}>
                  <Text style={styles.statNumber}>12</Text>
                  <Text style={styles.statLabel}>Active Forms</Text>
                </View>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Text style={styles.statEmoji}>💬</Text>
                </View>
                <View style={styles.statContent}>
                  <Text style={styles.statNumber}>156</Text>
                  <Text style={styles.statLabel}>Responses</Text>
                </View>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Text style={styles.statEmoji}>📈</Text>
                </View>
                <View style={styles.statContent}>
                  <Text style={styles.statNumber}>+23</Text>
                  <Text style={styles.statLabel}>This Week</Text>
                </View>
              </View>
            </View> */}
          </View>
          
          {/* Animated Profile */}
          <View style={styles.profileContainer}>
            <View style={styles.profileCircle}>
              <View style={styles.profileInner}>
                <Text style={styles.profileInitial}>U</Text>
              </View>
              <View style={styles.profileRing} />
            </View>
            <View style={styles.statusIndicator}>
              <View style={styles.statusDot} />
            </View>
          </View>
        </View>
        
        {/* Quick Action Button */}
        {/* <View style={styles.quickActionContainer}>
          <Pressable style={styles.quickActionBtn} android_ripple={{ color: 'rgba(160,96,255,0.2)' }}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>+</Text>
            </View>
            <Text style={styles.actionText}>Create New Form</Text>
            <View style={styles.actionArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </Pressable>
        </View> */}
      </View>

      {/* White Content Area */}
      <View style={styles.contentArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header Section */}
          <View style={styles.contentHeader}>
            <Text style={styles.contentTitle}>My Forms</Text>
            <Text style={styles.contentSubtitle}>Manage your feedback forms</Text>
          </View>

          {/* Create New Form Button */}
          <Pressable 
            style={styles.createFormBtn} 
            android_ripple={{ color: 'rgba(160,96,255,0.1)' }}
            onPress={() => navigation.navigate('CreateForm')}
          >
            <View style={styles.createFormContent}>
              <View style={styles.plusIcon}>
                <Text style={styles.plusText}>+</Text>
              </View>
              <View style={styles.createFormText}>
                <Text style={styles.createFormTitle}>Create New Form</Text>
                <Text style={styles.createFormDesc}>Start collecting feedback</Text>
              </View>
            </View>
          </Pressable>

          {/* Forms List */}
          <View style={styles.formsSection}>
            <Text style={styles.sectionTitle}>Recent Forms</Text>
            <Text style={styles.createNewFormDesc}>Your Newly Published Forms will be shown Here. You can click on it to Review and Edit them</Text>
            
            {/* Forms Container */}
            <View style={styles.formsContainer}>
              {/* Card-Based Form Items */}
              <Pressable style={styles.formCard} android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
                <View style={styles.formCardIcon}>
                  <ClipboardIcon size={24} color="#666" />
                </View>
                <View style={styles.formCardContent}>
                  <Text style={styles.formCardTitle}>Customer Feedback</Text>
                  <Text style={styles.formCardSubtitle}>Collect customer satisfaction ratings</Text>
                </View>
                <View style={styles.formCardAction}>
                  <Text style={styles.formCardActionIcon}>+</Text>
                </View>
              </Pressable>

              <Pressable style={styles.formCard} android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
                <View style={styles.formCardIcon}>
                  <StarIcon size={24} color="#666" />
                </View>
                <View style={styles.formCardContent}>
                  <Text style={styles.formCardTitle}>Service Quality</Text>
                  <Text style={styles.formCardSubtitle}>Rate our service quality</Text>
                </View>
                <View style={styles.formCardAction}>
                  <Text style={styles.formCardActionIcon}>+</Text>
                </View>
              </Pressable>

              <Pressable style={styles.formCard} android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
                <View style={styles.formCardIcon}>
                  <MessageIcon size={24} color="#666" />
                </View>
                <View style={styles.formCardContent}>
                  <Text style={styles.formCardTitle}>Product Review</Text>
                  <Text style={styles.formCardSubtitle}>Share your product experience</Text>
                </View>
                <View style={styles.formCardAction}>
                  <Text style={styles.formCardActionIcon}>+</Text>
                </View>
              </Pressable>

              <Pressable style={styles.formCard} android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
                <View style={styles.formCardIcon}>
                  <ChartIcon size={24} color="#666" />
                </View>
                <View style={styles.formCardContent}>
                  <Text style={styles.formCardTitle}>Market Research</Text>
                  <Text style={styles.formCardSubtitle}>Gather market insights and trends</Text>
                </View>
                <View style={styles.formCardAction}>
                  <Text style={styles.formCardActionIcon}>+</Text>
                </View>
              </Pressable>

              <Pressable style={styles.formCard} android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
                <View style={styles.formCardIcon}>
                  <TargetIcon size={24} color="#666" />
                </View>
                <View style={styles.formCardContent}>
                  <Text style={styles.formCardTitle}>Event Feedback</Text>
                  <Text style={styles.formCardSubtitle}>Rate your event experience</Text>
                </View>
                <View style={styles.formCardAction}>
                  <Text style={styles.formCardActionIcon}>+</Text>
                </View>
              </Pressable>

              <Pressable style={[styles.formCard, styles.formCardLast]} android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
                <View style={styles.formCardIcon}>
                  <TrophyIcon size={24} color="#666" />
                </View>
                <View style={styles.formCardContent}>
                  <Text style={styles.formCardTitle}>Satisfaction Survey</Text>
                  <Text style={styles.formCardSubtitle}>Overall customer satisfaction</Text>
                </View>
                <View style={styles.formCardAction}>
                  <Text style={styles.formCardActionIcon}>+</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem}>
          <HomeIcon size={24} color="#A060FF" />
        </Pressable>
        <Pressable style={styles.navItem}>
          <TransferIcon size={24} color="#A060FF" />
        </Pressable>
        <Pressable style={styles.navItem}>
          <StatsIcon size={24} color="#A060FF" />
        </Pressable>
        <Pressable style={styles.navItem}>
          <SettingsIcon size={24} color="#A060FF" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Lottie Animated Header
  header: {
    backgroundColor: '#000000',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 25,
    height: '50%',
    position: 'relative',
    overflow: 'hidden',
  },
  // Animated Background
  animatedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  lottieContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.1,
  },
  lottiePlaceholder: {
    fontSize: 60,
    opacity: 0.3,
  },
  // Header Content
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20,
    zIndex: 1,
  },
  welcomeSection: {
    flex: 1,
    paddingTop: 20,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
    marginRight: 8,
  },
  waveAnimation: {
    transform: [{ rotate: '15deg' }],
  },
  waveEmoji: {
    fontSize: 20,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  descriptionText: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: 25,
  },
  // Animated Stats
  animatedStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(160,96,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statEmoji: {
    fontSize: 16,
  },
  statContent: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
  },
  // Animated Profile
  profileContainer: {
    alignItems: 'center',
    marginLeft: 20,
    position: 'relative',
  },
  profileCircle: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: '#F5F5F5',
    borderWidth: 3,
    borderColor: '#A060FF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  profileInner: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#A060FF',
  },
  profileRing: {
    position: 'absolute',
    width: 85,
    height: 85,
    borderRadius: 42.5,
    borderWidth: 2,
    borderColor: 'rgba(160,96,255,0.3)',
    top: -5,
    left: -5,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  // Quick Action Button
  quickActionContainer: {
    marginTop: 20,
    paddingHorizontal: 8,
  },
  quickActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(160,96,255,0.15)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(160,96,255,0.3)',
    justifyContent: 'space-between',
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#A060FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
    marginLeft: 16,
  },
  actionArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  // White Content Area - Positioned lower
  contentArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -110, // Overlap more with header
    paddingTop: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  // Content Header
  contentHeader: {
    marginBottom: 20,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  contentSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
  },
  // Create New Form Button
  createFormBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#A060FF',
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#A060FF',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  createFormContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  plusIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#A060FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  plusText: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
  },
  createFormText: {
    flex: 1,
  },
  createFormTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: '#A060FF',
    marginBottom: 2,
  },
  createFormDesc: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
  },
  createNewFormDesc: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginBottom: 4,
    paddingBottom: 10
  },
  // Forms Section
  formsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  // Forms Container
  formsContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
  },
  // Card-Based Form Items
  formCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
  },
  formCardLast: {
    marginBottom: 0,
  },
  formCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  formCardIconText: {
    fontSize: 24,
  },
  formCardContent: {
    flex: 1,
  },
  formCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: '#000000',
    marginBottom: 4,
  },
  formCardSubtitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    lineHeight: 18,
  },
  formCardAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  formCardActionIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '300',
    fontFamily: 'Poppins-Light',
  },
  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});

export default Home;
