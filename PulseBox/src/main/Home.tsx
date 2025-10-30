import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { theme } from '../theme';
import Svg, { Path } from 'react-native-svg';
import BottomTab from '../components/BottomTab';
import { useForms } from '../context/FormsContext';
import FormIcon from '../components/FormIcons';
import ShareIcon from '../../assets/images/share.svg';
import EditIcon from '../../assets/images/edit.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

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
  const { forms } = useForms();

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
              {forms.length === 0 ? (
                <View style={styles.emptyFormsContainer}>
                  <Text style={styles.emptyFormsText}>No forms yet</Text>
                  <Text style={styles.emptyFormsSubtext}>Create your first form to get started</Text>
                </View>
              ) : (
                forms.map((form, index) => (
                  <Pressable 
                    key={form.id} 
                    style={[styles.formCard, index === forms.length - 1 && styles.formCardLast]} 
                    android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
                    onPress={() => navigation.navigate('EditForm', { formId: form.id })}
                  >
                    <View style={styles.formCardIcon}>
                      <FormIcon iconId={form.iconId} size={24} color="#666" />
                    </View>
                    <View style={styles.formCardContent}>
                      <Text style={styles.formCardTitle}>{form.name}</Text>
                      <Text style={styles.formCardSubtitle}>Created {new Date(form.createdAt).toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.actionsRow}>
                      <View style={styles.formCardAction}><EditIcon width={20} height={20} stroke="#000000" /></View>
                      <View style={[styles.formCardAction, { marginLeft: 8 }]}><ShareIcon width={20} height={20} stroke="#000000" /></View>
                    </View>
                  </Pressable>
                ))
              )}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <BottomTab navigation={navigation} currentRoute="Home" useSafeArea={false} />
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
  emptyFormsContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyFormsText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: '#000000',
    marginBottom: 4,
  },
  emptyFormsSubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
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
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formCardActionIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '300',
    fontFamily: 'Poppins-Light',
  },
});

export default Home;
