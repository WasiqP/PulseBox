import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TextInput, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../theme';

// Form Icon Options
const FORM_ICONS = [
  { id: 'clipboard', name: 'Clipboard', Icon: ({ size = 28, color = '#666' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5C15 3.89543 14.1046 3 13 3H11C9.89543 3 9 3.89543 9 5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  )},
  { id: 'star', name: 'Star', Icon: ({ size = 28, color = '#666' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  )},
  { id: 'message', name: 'Message', Icon: ({ size = 28, color = '#666' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  )},
  { id: 'chart', name: 'Chart', Icon: ({ size = 28, color = '#666' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 3V21H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M7 16L10 13L14 17L21 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M18 16H21V13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  )},
  { id: 'target', name: 'Target', Icon: ({ size = 28, color = '#666' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  )},
  { id: 'trophy', name: 'Trophy', Icon: ({ size = 28, color = '#666' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 9H18C18 9 20 9.5 20 13C20 16 18 17 16 17H8C6 17 4 16 4 13C4 9.5 6 9 6 9Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M7 9V7C7 5.89543 7.89543 5 9 5H15C16.1046 5 17 5.89543 17 7V9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12 17V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M8 21H16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  )},
];

interface FormDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (formName: string, iconId: string) => void;
}

const FormDetailsModal: React.FC<FormDetailsModalProps> = ({ visible, onClose, onSave }) => {
  const [formName, setFormName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [showIcons, setShowIcons] = useState(false);

  const handleSave = () => {
    if (formName.trim() && selectedIcon) {
      onSave(formName.trim(), selectedIcon);
      setFormName('');
      setSelectedIcon(null);
      onClose();
    }
  };

  const selectedIconData = FORM_ICONS.find(icon => icon.id === selectedIcon);
  const SelectedIcon = selectedIconData?.Icon;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalOverlay} edges={['top', 'bottom']}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Publish Form</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>×</Text>
            </Pressable>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Form Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Form Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter form name..."
                placeholderTextColor="#999999"
                value={formName}
                onChangeText={setFormName}
                autoFocus
              />
            </View>

            {/* Icon Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Choose Icon</Text>
              <Pressable 
                style={styles.iconSelector}
                onPress={() => setShowIcons(!showIcons)}
              >
                <View style={styles.iconSelectorContent}>
                  {selectedIcon && SelectedIcon ? (
                    <>
                      <SelectedIcon size={24} color="#A060FF" />
                      <Text style={styles.iconSelectorText}>
                        {selectedIconData?.name}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.iconSelectorPlaceholder}>Select an icon</Text>
                  )}
                  <Text style={styles.dropdownArrow}>{showIcons ? '▼' : '▶'}</Text>
                </View>
              </Pressable>

              {showIcons && (
                <View style={styles.iconGrid}>
                  {FORM_ICONS.map((icon) => {
                    const IconComponent = icon.Icon;
                    const isSelected = icon.id === selectedIcon;
                    return (
                      <Pressable
                        key={icon.id}
                        style={[styles.iconOption, isSelected && styles.iconOptionSelected]}
                        onPress={() => {
                          setSelectedIcon(icon.id);
                          setShowIcons(false);
                        }}
                        android_ripple={{ color: 'rgba(160,96,255,0.1)' }}
                      >
                        <View style={[styles.iconOptionCircle, isSelected && styles.iconOptionCircleSelected]}>
                          <IconComponent size={32} color={isSelected ? '#FFFFFF' : '#666'} />
                        </View>
                        <Text style={[styles.iconOptionName, isSelected && styles.iconOptionNameSelected]}>
                          {icon.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          </View>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <Pressable 
              style={styles.cancelButton}
              onPress={onClose}
              android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable 
              style={[styles.saveButton, (!formName.trim() || !selectedIcon) && styles.saveButtonDisabled]}
              onPress={handleSave}
              android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
              disabled={!formName.trim() || !selectedIcon}
            >
              <Text style={[styles.saveButtonText, (!formName.trim() || !selectedIcon) && styles.saveButtonTextDisabled]}>
                Save & Publish
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 24,
    color: '#666666',
    fontFamily: 'Poppins-Regular',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: '#333333',
    marginBottom: 12,
  },
  input: {
    height: 56,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#000000',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconSelector: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 56,
    justifyContent: 'center',
  },
  iconSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  iconSelectorText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#A060FF',
    marginLeft: 12,
  },
  iconSelectorPlaceholder: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#999999',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 'auto',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 12,
  },
  iconOption: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
  },
  iconOptionSelected: {
    backgroundColor: '#F0F0FF',
  },
  iconOptionCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconOptionCircleSelected: {
    backgroundColor: '#A060FF',
  },
  iconOptionName: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#666666',
  },
  iconOptionNameSelected: {
    color: '#A060FF',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 52,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: '#000000',
  },
  saveButton: {
    flex: 1,
    height: 52,
    backgroundColor: theme.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
  },
  saveButtonTextDisabled: {
    color: '#999999',
  },
});

export default FormDetailsModal;

