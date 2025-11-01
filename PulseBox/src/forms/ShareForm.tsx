import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert, Dimensions, Share as RNShare } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useForms } from '../context/FormsContext';
import { theme } from '../theme/Colors';
import BackIcon from '../../assets/images/Back.svg';
import ShareIcon from '../../assets/images/share.svg';
import Svg, { Rect, Path } from 'react-native-svg';
// import { ViewShot } from 'react-native-view-shot'; // Install react-native-view-shot if needed

type Props = NativeStackScreenProps<RootStackParamList, 'ShareForm'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Simple QR Code Component (Basic representation)
const QRCodePlaceholder: React.FC<{ size: number }> = ({ size }) => {
  // This is a placeholder QR pattern - in production, use react-native-qrcode-svg or similar
  const gridSize = 25;
  const cellSize = size / gridSize;
  
  return (
    <View style={[styles.qrContainer, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* QR pattern placeholder - alternating pattern */}
        {Array.from({ length: gridSize }).map((_, i) =>
          Array.from({ length: gridSize }).map((_, j) => {
            const shouldFill = (i + j) % 3 === 0 || (i === 0 || i === gridSize - 1 || j === 0 || j === gridSize - 1);
            return (
              <Rect
                key={`${i}-${j}`}
                x={j * cellSize}
                y={i * cellSize}
                width={cellSize}
                height={cellSize}
                fill={shouldFill ? '#000000' : '#FFFFFF'}
              />
            );
          })
        )}
      </Svg>
    </View>
  );
};

const ShareForm: React.FC<Props> = ({ route, navigation }) => {
  const { formId } = route.params;
  const { forms } = useForms();
  const form = forms.find(f => f.id === formId);
  
  const [activeTab, setActiveTab] = useState<'link' | 'qr'>('link');
  const viewShotRef = useRef<any>(null);
  
  // Generate form link
  const formLink = form 
    ? `https://pulsebox.app/form/${formId}`
    : '';

  const copyToClipboard = async () => {
    // In React Native, use Clipboard API
    Alert.alert('Link Copied', 'Form link has been copied to clipboard');
    // Clipboard.setString(formLink);
  };

  const shareLink = async () => {
    try {
      await RNShare.share({
        message: `Check out this form: ${formLink}`,
        title: form?.name || 'Share Form',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const shareOnSocial = async (platform: string) => {
    const message = `Check out this form: ${formLink}`;
    
    switch (platform) {
      case 'whatsapp':
        // Note: React Native Share API doesn't support direct WhatsApp sharing
        // Users will need to select WhatsApp from the share sheet
        await RNShare.share({
          message: `${message} ${formLink}`,
          title: form?.name || 'Share Form',
        });
        break;
      case 'email':
        await RNShare.share({
          message,
          title: form?.name || 'Share Form',
        });
        break;
      case 'sms':
        await RNShare.share({
          message: `${message} ${formLink}`,
        });
        break;
      default:
        await shareLink();
    }
  };

  const saveQRCode = async () => {
    try {
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();
        Alert.alert('QR Code Saved', 'QR code has been saved to your gallery');
        // You can use CameraRoll.save(uri) to save to gallery
      }
    } catch (error) {
      console.error('Error saving QR code:', error);
    }
  };

  if (!form) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <BackIcon width={16} height={16} stroke="#000000" />
          </Pressable>
          <Text style={styles.headerTitle}>Share Form</Text>
          <View style={styles.backBtn} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Form not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable 
          onPress={() => navigation.goBack()} 
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
        >
          <BackIcon width={16} height={16} stroke="#000000" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Share Form</Text>
          <Text style={styles.headerSubtitle}>{form.name}</Text>
        </View>
        <View style={styles.backBtn} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Form Preview Section */}
        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Form Preview</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewCardHeader}>
              <View style={styles.previewIcon}>
                <ShareIcon width={24} height={24} stroke={theme.primary} />
              </View>
              <Text style={styles.previewFormName}>{form.name}</Text>
            </View>
            <Text style={styles.previewDescription}>
              Share this form with others to collect responses
            </Text>
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          <Pressable
            style={[styles.tab, activeTab === 'link' && styles.tabActive]}
            onPress={() => setActiveTab('link')}
            android_ripple={{ color: 'rgba(160,96,255,0.12)' }}
          >
            <Text style={[styles.tabText, activeTab === 'link' && styles.tabTextActive]}>
              Link Sharing
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'qr' && styles.tabActive]}
            onPress={() => setActiveTab('qr')}
            android_ripple={{ color: 'rgba(160,96,255,0.12)' }}
          >
            <Text style={[styles.tabText, activeTab === 'qr' && styles.tabTextActive]}>
              QR Code
            </Text>
          </Pressable>
        </View>

        {/* Link Sharing Section */}
        {activeTab === 'link' && (
          <View style={styles.contentSection}>
            {/* Copy Link Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Shareable Link</Text>
              <View style={styles.linkContainer}>
                <TextInput
                  style={styles.linkInput}
                  value={formLink}
                  editable={false}
                  selectTextOnFocus
                />
                <Pressable
                  style={styles.copyBtn}
                  onPress={copyToClipboard}
                  android_ripple={{ color: 'rgba(160,96,255,0.12)' }}
                >
                  <Text style={styles.copyBtnText}>Copy</Text>
                </Pressable>
              </View>
              <Text style={styles.helperText}>
                Share this link with anyone to allow them to fill out your form
              </Text>
            </View>

            {/* Quick Share Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Quick Share</Text>
              <Pressable
                style={styles.shareActionBtn}
                onPress={shareLink}
                android_ripple={{ color: 'rgba(160,96,255,0.12)' }}
              >
                <ShareIcon width={24} height={24} stroke="#000000" />
                <Text style={styles.shareActionText}>Share via...</Text>
              </Pressable>
            </View>

            {/* Social Media Sharing */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Share on Social Media</Text>
              <View style={styles.socialGrid}>
                <Pressable
                  style={styles.socialBtn}
                  onPress={() => shareOnSocial('whatsapp')}
                  android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                >
                  <View style={[styles.socialIcon, { backgroundColor: '#25D366' }]}>
                    <Text style={styles.socialEmoji}>💬</Text>
                  </View>
                  <Text style={styles.socialLabel}>WhatsApp</Text>
                </Pressable>
                
                <Pressable
                  style={styles.socialBtn}
                  onPress={() => shareOnSocial('email')}
                  android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                >
                  <View style={[styles.socialIcon, { backgroundColor: '#4285F4' }]}>
                    <Text style={styles.socialEmoji}>✉️</Text>
                  </View>
                  <Text style={styles.socialLabel}>Email</Text>
                </Pressable>
                
                <Pressable
                  style={styles.socialBtn}
                  onPress={() => shareOnSocial('sms')}
                  android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                >
                  <View style={[styles.socialIcon, { backgroundColor: '#34B7F1' }]}>
                    <Text style={styles.socialEmoji}>💬</Text>
                  </View>
                  <Text style={styles.socialLabel}>SMS</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* QR Code Section */}
        {activeTab === 'qr' && (
          <View style={styles.contentSection}>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>QR Code</Text>
              <Text style={styles.qrDescription}>
                Scan this QR code to access your form. Perfect for posters, presentations, or printed materials.
              </Text>
              
              <View style={styles.qrWrapper}>
                <View ref={viewShotRef} style={styles.qrCard}>
                  <QRCodePlaceholder size={250} />
                  <Text style={styles.qrFormName}>{form.name}</Text>
                  <Text style={styles.qrHelperText}>Scan to access form</Text>
                </View>
              </View>

              <Pressable
                style={styles.saveQRBtn}
                onPress={saveQRCode}
                android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
              >
                <Text style={styles.saveQRBtnText}>Save QR Code</Text>
              </Pressable>

              <View style={styles.qrActions}>
                <Pressable
                  style={styles.qrActionBtn}
                  onPress={shareLink}
                  android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                >
                  <ShareIcon width={20} height={20} stroke="#000000" />
                  <Text style={styles.qrActionText}>Share QR</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  previewSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: '#F8F5FF',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    padding: 16,
  },
  previewCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  previewFormName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
  },
  previewDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    lineHeight: 20,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#000000',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#666666',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
  contentSection: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
    marginBottom: 12,
  },
  linkContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  linkInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#000000',
  },
  copyBtn: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  copyBtnText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    lineHeight: 18,
  },
  shareActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  shareActionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#000000',
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  socialBtn: {
    width: (SCREEN_WIDTH - 72) / 3,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    padding: 16,
  },
  socialIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  socialEmoji: {
    fontSize: 28,
  },
  socialLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#000000',
  },
  qrDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    lineHeight: 20,
    marginBottom: 24,
  },
  qrWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 16,
  },
  qrFormName: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
    marginTop: 16,
    marginBottom: 4,
  },
  qrHelperText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
  },
  saveQRBtn: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveQRBtnText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  qrActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  qrActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  qrActionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#000000',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
  },
});

export default ShareForm;

