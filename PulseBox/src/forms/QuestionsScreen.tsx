import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  Pressable, 
  Switch,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  Dimensions
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import { useForms } from '../context/FormsContext';
import BackIcon from '../../assets/images/Back.svg';
import ImageIcon from '../../assets/images/image.svg';
import RazerAudioIcon from '../../assets/images/razer-audio.svg';
import ShortTextIcon from '../../assets/images/short-text.svg';
import LongTextIcon from '../../assets/images/long-text.svg';
import McqIcon from '../../assets/images/mcq.svg';
import DropdownIcon from '../../assets/images/dropdown.svg';
import CheckboxesIcon from '../../assets/images/checkboxes.svg';
import RatingIcon from '../../assets/images/rating.svg';
import DateIcon from '../../assets/images/date.svg';
import NumberIcon from '../../assets/images/number.svg';
import EmailIcon from '../../assets/images/email.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'QuestionsScreen'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type QuestionType = 
  | 'shortText' 
  | 'longText' 
  | 'multipleChoice' 
  | 'checkbox' 
  | 'dropdown' 
  | 'rating' 
  | 'email' 
  | 'number' 
  | 'date';

export interface QuestionData {
  id: string;
  title: string;
  type: QuestionType;
  required: boolean;
  placeholder?: string;
  description?: string;
  maxLength?: number;
  options?: string[];
  imageUrl?: string;
  audioUrl?: string;
}

const QUESTION_TYPES: { id: QuestionType; label: string }[] = [
  { id: 'shortText', label: 'Short Answer' },
  { id: 'longText', label: 'Long Answer' },
  { id: 'multipleChoice', label: 'Multiple Choice' },
  { id: 'checkbox', label: 'Checkboxes' },
  { id: 'dropdown', label: 'Dropdown' },
  { id: 'rating', label: 'Rating' },
  { id: 'email', label: 'Email' },
  { id: 'number', label: 'Number' },
  { id: 'date', label: 'Date' },
];

const renderQuestionTypeIcon = (type: QuestionType, size: number = 24) => {
  const iconProps = { width: size, height: size, stroke: '#000000' };
  switch (type) {
    case 'shortText':
      return <ShortTextIcon {...iconProps} />;
    case 'longText':
      return <LongTextIcon {...iconProps} />;
    case 'multipleChoice':
      return <McqIcon {...iconProps} />;
    case 'checkbox':
      return <CheckboxesIcon {...iconProps} />;
    case 'dropdown':
      return <DropdownIcon {...iconProps} />;
    case 'rating':
      return <RatingIcon {...iconProps} />;
    case 'email':
      return <EmailIcon {...iconProps} />;
    case 'number':
      return <NumberIcon {...iconProps} />;
    case 'date':
      return <DateIcon {...iconProps} />;
    default:
      return null;
  }
};

const QuestionsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { formId, questionId } = route.params;
  const { forms, updateForm } = useForms();
  const form = forms.find(f => f.id === formId);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [questionData, setQuestionData] = useState<QuestionData>({
    id: questionId,
    title: '',
    type: 'shortText',
    required: true,
    placeholder: '',
    description: '',
    maxLength: undefined,
    options: [],
    imageUrl: undefined,
    audioUrl: undefined,
  });

  const [newOption, setNewOption] = useState('');
  const [showTypeModal, setShowTypeModal] = useState(false);

  useEffect(() => {
    // Load existing question data if available
    if (form?.answers?.questions) {
      const questions = form.answers.questions as QuestionData[];
      const existing = questions.find(q => q.id === questionId);
      if (existing) {
        setQuestionData(existing);
      }
    }
  }, [form, questionId]);

  useFocusEffect(
    React.useCallback(() => {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim])
  );

  const handleSave = async () => {
    if (!questionData.title.trim()) {
      Alert.alert('Required Field', 'Please enter a question title');
      return;
    }

    if (form) {
      const questions = (form.answers?.questions as QuestionData[]) || [];
      const existingIndex = questions.findIndex(q => q.id === questionId);
      
      const updated = existingIndex >= 0
        ? questions.map((q, i) => i === existingIndex ? questionData : q)
        : [...questions, questionData];

      await updateForm(formId, {
        answers: {
          ...form.answers,
          questions: updated,
        },
      });

      navigation.goBack();
    }
  };

  const addOption = () => {
    if (newOption.trim() && questionData.options) {
      setQuestionData(prev => ({
        ...prev,
        options: [...(prev.options || []), newOption.trim()],
      }));
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    if (questionData.options) {
      setQuestionData(prev => ({
        ...prev,
        options: prev.options?.filter((_, i) => i !== index) || [],
      }));
    }
  };

  const needsOptions = ['multipleChoice', 'checkbox', 'dropdown'].includes(questionData.type);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
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
          <Text style={styles.screenTitle}>Edit Question</Text>
        </View>
        <Pressable onPress={handleSave} style={styles.saveHeaderBtn}>
          <Text style={styles.saveHeaderText}>Save</Text>
        </Pressable>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Question Title */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Question Title *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your question..."
            placeholderTextColor="#999"
            value={questionData.title}
            onChangeText={(text) => setQuestionData(prev => ({ ...prev, title: text }))}
            multiline
          />
        </View>

        {/* Question Type */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Question Type</Text>
          <Pressable 
            style={styles.typeSelector}
            onPress={() => setShowTypeModal(true)}
            android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
          >
            <View style={styles.typeSelectorLeft}>
              {renderQuestionTypeIcon(questionData.type, 20)}
              <Text style={styles.typeSelectorText}>
                {QUESTION_TYPES.find(t => t.id === questionData.type)?.label}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Description (Optional)</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Add a helpful description or hint..."
            placeholderTextColor="#999"
            value={questionData.description}
            onChangeText={(text) => setQuestionData(prev => ({ ...prev, description: text }))}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Placeholder Text (Optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter placeholder text..."
            placeholderTextColor="#999"
            value={questionData.placeholder}
            onChangeText={(text) => setQuestionData(prev => ({ ...prev, placeholder: text }))}
          />
        </View>

        {/* Options for Multiple Choice, Checkbox, Dropdown */}
        {needsOptions && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Options</Text>
            {questionData.options?.map((option, index) => (
              <View key={index} style={styles.optionRow}>
                <Text style={styles.optionText}>{option}</Text>
                <Pressable 
                  onPress={() => removeOption(index)}
                  style={styles.removeOptionBtn}
                  android_ripple={{ color: 'rgba(160,96,255,0.12)', borderless: true }}
                >
                  <Text style={styles.removeOptionText}>×</Text>
                </Pressable>
              </View>
            ))}
            <View style={styles.addOptionRow}>
              <TextInput
                style={styles.optionInput}
                placeholder="Add option..."
                placeholderTextColor="#999"
                value={newOption}
                onChangeText={setNewOption}
                onSubmitEditing={addOption}
              />
              <Pressable 
                style={styles.addOptionBtn}
                onPress={addOption}
                android_ripple={{ color: 'rgba(160,96,255,0.12)' }}
              >
                <Text style={styles.addOptionText}>Add</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Max Length for Text Inputs */}
        {(questionData.type === 'shortText' || questionData.type === 'longText') && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Character Limit (Optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., 500"
              placeholderTextColor="#999"
              value={questionData.maxLength?.toString() || ''}
              onChangeText={(text) => {
                const num = parseInt(text, 10);
                setQuestionData(prev => ({ 
                  ...prev, 
                  maxLength: text === '' ? undefined : (isNaN(num) ? undefined : num)
                }));
              }}
              keyboardType="numeric"
            />
          </View>
        )}

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Settings</Text>
          
          {/* Required Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingLabel}>Required</Text>
              <Text style={styles.settingDesc}>User must answer this question</Text>
            </View>
            <Switch
              value={questionData.required}
              onValueChange={(value) => setQuestionData(prev => ({ ...prev, required: value }))}
              trackColor={{ false: '#E0E0E0', true: '#000000' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Media Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Media (Optional)</Text>
          
          {/* Image Upload */}
          <Pressable 
            style={styles.mediaBtn}
            onPress={() => Alert.alert('Image Upload', 'Image upload functionality coming soon')}
            android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
          >
            <ImageIcon width={28} height={28} stroke="#000000" />
            <View style={styles.mediaContent}>
              <Text style={styles.mediaLabel}>Add Reference Image</Text>
              <Text style={styles.mediaDesc}>Upload an image to help clarify the question</Text>
            </View>
            {questionData.imageUrl && <Text style={styles.mediaCheck}>✓</Text>}
          </Pressable>

          {/* Audio Upload */}
          <Pressable 
            style={styles.mediaBtn}
            onPress={() => Alert.alert('Audio Upload', 'Audio upload functionality coming soon')}
            android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
          >
            <RazerAudioIcon width={28} height={28} stroke="#000000" />
            <View style={styles.mediaContent}>
              <Text style={styles.mediaLabel}>Add Reference Audio</Text>
              <Text style={styles.mediaDesc}>Upload audio instructions or guidance</Text>
            </View>
            {questionData.audioUrl && <Text style={styles.mediaCheck}>✓</Text>}
      </Pressable>
    </View>

        {/* Save Button */}
        <Pressable 
          style={styles.saveBtn}
          onPress={handleSave}
          android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
        >
          <Text style={styles.saveBtnText}>Save Question</Text>
        </Pressable>
      </ScrollView>

      {/* Question Type Modal */}
      <Modal
        visible={showTypeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTypeModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowTypeModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Question Type</Text>
                <ScrollView 
                  style={styles.typeList}
                  showsVerticalScrollIndicator={true}
                >
                  {QUESTION_TYPES.map((type) => (
                    <Pressable
                      key={type.id}
                      style={[
                        styles.typeOption,
                        questionData.type === type.id && styles.typeOptionSelected
                      ]}
                      onPress={() => {
                        setQuestionData(prev => {
                          // Reset options when changing from option-based types
                          const wasOptionType = ['multipleChoice', 'checkbox', 'dropdown'].includes(prev.type);
                          const isOptionType = ['multipleChoice', 'checkbox', 'dropdown'].includes(type.id);
                          return {
                            ...prev,
                            type: type.id,
                            options: isOptionType && !wasOptionType ? [] : prev.options,
                          };
                        });
                        setShowTypeModal(false);
                      }}
                      android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                    >
                      <View style={styles.typeOptionIcon}>
                        {renderQuestionTypeIcon(type.id, 24)}
                      </View>
                      <Text style={[
                        styles.typeOptionLabel,
                        questionData.type === type.id && styles.typeOptionLabelSelected
                      ]}>
                        {type.label}
                      </Text>
                      {questionData.type === type.id && (
                        <Text style={styles.typeOptionCheck}>✓</Text>
                      )}
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Animated.View>
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
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
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
    marginRight: 10,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
  },
  saveHeaderBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  saveHeaderText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#A060FF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#000000',
    minHeight: 48,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  typeSelector: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeSelectorText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#000000',
    marginLeft: 12,
  },
  chevron: {
    fontSize: 24,
    color: '#000000',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#000000',
  },
  removeOptionBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0E0E0',
  },
  removeOptionText: {
    fontSize: 20,
    color: '#000000',
    lineHeight: 22,
  },
  addOptionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  optionInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#000000',
  },
  addOptionBtn: {
    backgroundColor: '#000000',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  addOptionText: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingLeft: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#000000',
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  mediaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  mediaContent: {
    flex: 1,
    marginLeft: 14,
  },
  mediaLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#000000',
    marginBottom: 4,
  },
  mediaDesc: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  mediaCheck: {
    fontSize: 20,
    color: '#000000',
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveBtnText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#000000',
    width: '90%',
    maxHeight: '70%',
    paddingVertical: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  typeList: {
    maxHeight: 400,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  typeOptionSelected: {
    backgroundColor: '#F5F5F5',
  },
  typeOptionIcon: {
    marginRight: 14,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeOptionLabel: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#000000',
  },
  typeOptionLabelSelected: {
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
  },
  typeOptionCheck: {
    fontSize: 20,
    color: '#000000',
    fontWeight: 'bold',
  },
});

export default QuestionsScreen;
