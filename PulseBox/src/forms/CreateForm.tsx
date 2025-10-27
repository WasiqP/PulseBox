import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateForm'>;

const CreateForm: React.FC<Props> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const scrollViewRef = useRef<ScrollView>(null);

  const questions = [
    {
      title: 'What are you?',
      subtitle: 'Help us get to know you better',
      options: [
        { id: 'business_owner', title: 'Business Owner', description: 'Running your own business' },
        { id: 'freelancer', title: 'Freelancer', description: 'Independent professional' },
        { id: 'designer', title: 'Designer', description: 'Creative professional' },
        { id: 'customer_support', title: 'Customer Support', description: 'Supporting customers' },
        { id: 'developer', title: 'Developer', description: 'Building with code' },
        { id: 'student', title: 'Student', description: 'Learning and studying' },
        { id: 'teacher', title: 'Teacher', description: 'Educating others' },
        { id: 'other', title: 'Others', description: 'Something else' },
      ],
    },
    {
      title: 'What are you trying to collect feedback about?',
      subtitle: 'Select the type that best describes your needs',
      options: [
        { id: 'customer', title: 'Customer Feedback', description: 'Collect satisfaction ratings and reviews' },
        { id: 'product', title: 'Product Review', description: 'Gather opinions on your products' },
        { id: 'event', title: 'Event Feedback', description: 'Get insights on events or experiences' },
        { id: 'service', title: 'Service Quality', description: 'Measure service performance' },
        { id: 'research', title: 'Market Research', description: 'Collect data for analysis' },
        { id: 'other', title: 'Something Else', description: 'Create a custom form' },
      ],
    },
    {
      title: 'Who is your target audience?',
      subtitle: 'Who will be filling out this form?',
      options: [
        { id: 'customers', title: 'Customers', description: 'People who buy from you' },
        { id: 'users', title: 'Users', description: 'People using your product or service' },
        { id: 'employees', title: 'Employees', description: 'Internal team members' },
        { id: 'students', title: 'Students', description: 'Educational feedback' },
        { id: 'general', title: 'General Public', description: 'Anyone can respond' },
        { id: 'other', title: 'Specific Group', description: 'Targeted audience' },
      ],
    },
    {
      title: 'What\'s your main goal?',
      subtitle: 'What do you hope to achieve with this form?',
      options: [
        { id: 'improve', title: 'Improve Experience', description: 'Enhance user satisfaction' },
        { id: 'identify', title: 'Identify Problems', description: 'Find issues to fix' },
        { id: 'validate', title: 'Validate Ideas', description: 'Test new concepts' },
        { id: 'measure', title: 'Measure Performance', description: 'Track metrics and KPIs' },
        { id: 'engage', title: 'Engage Audience', description: 'Increase interaction' },
        { id: 'learn', title: 'Learn Preferences', description: 'Understand what people want' },
      ],
    },
    {
      title: 'What information do you want to collect?',
      subtitle: 'Select the primary data points you need',
      options: [
        { id: 'ratings', title: 'Ratings & Scores', description: 'Numeric or star ratings' },
        { id: 'opinions', title: 'Opinions & Comments', description: 'Written feedback' },
        { id: 'demographics', title: 'Demographics', description: 'Age, location, etc.' },
        { id: 'behavior', title: 'Behavioral Data', description: 'How people use your service' },
        { id: 'preferences', title: 'Preferences', description: 'What people prefer' },
        { id: 'all', title: 'Everything', description: 'Comprehensive data collection' },
      ],
    },
  ];

  const handleSelectOption = (optionId: string) => {
    const currentAnswers = answers[currentStep] || [];
    const isSelected = currentAnswers.includes(optionId);
    
    let updatedAnswers;
    if (isSelected) {
      // Remove if already selected
      updatedAnswers = {
        ...answers,
        [currentStep]: currentAnswers.filter((id: string) => id !== optionId)
      };
    } else {
      // Add to selection
      updatedAnswers = {
        ...answers,
        [currentStep]: [...currentAnswers, optionId]
      };
    }
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      // Scroll to top
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      // All questions answered, proceed to form builder
      navigation.navigate('FormBuilder', { answers });
    }
  };

  const hasSelection = answers[currentStep] && answers[currentStep].length > 0;

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Scroll to top
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      navigation.goBack();
    }
  };

  const currentQuestion = questions[currentStep];
  const selectedAnswers = answers[currentStep] || [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView ref={scrollViewRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${((currentStep + 1) / questions.length) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>Step {currentStep + 1} of {questions.length}</Text>
        </View>

        {/* Back Button */}
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>

        {/* Question Content */}
        <View style={styles.content}>
          <Text style={styles.questionTitle}>{currentQuestion.title}</Text>
          <Text style={styles.questionSubtitle}>{currentQuestion.subtitle}</Text>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers.includes(option.id);
              return (
                <Pressable
                  key={option.id}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  android_ripple={{ color: 'rgba(160,96,255,0.1)' }}
                  onPress={() => handleSelectOption(option.id)}
                >
                  <View style={styles.optionContent}>
                    <View style={styles.optionTextContainer}>
                      <Text style={styles.optionTitle}>{option.title}</Text>
                      <Text style={styles.optionDescription}>{option.description}</Text>
                    </View>
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && <View style={styles.checkboxInner} />}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Next/Continue Button */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.nextButton, !hasSelection && styles.nextButtonDisabled]}
              onPress={handleNext}
              android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
              disabled={!hasSelection}
            >
              <Text style={[styles.nextButtonText, !hasSelection && styles.nextButtonTextDisabled]}>
                {currentStep === questions.length - 1 ? 'Continue' : 'Next'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  progressContainer: {
    marginTop: 12,
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  backIcon: {
    fontSize: 24,
    color: theme.primary,
    fontFamily: 'Poppins-Regular',
  },
  content: {
    flex: 1,
  },
  questionTitle: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
    marginBottom: 12,
    lineHeight: 36,
  },
  questionSubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginBottom: 32,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 20,
    marginBottom: 12,
  },
  optionCardSelected: {
    backgroundColor: '#F0F0FF',
    borderColor: theme.primary,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  optionTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: '#000000',
    marginBottom: 6,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    lineHeight: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: theme.primary,
    backgroundColor: theme.primary,
  },
  checkboxInner: {
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    marginTop: 32,
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
  nextButtonTextDisabled: {
    color: '#999999',
  },
});

export default CreateForm;

