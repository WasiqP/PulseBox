import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'FormBuilder'>;

const questions = [
  {
    title: 'What are you trying to collect feedback about?',
  },
  {
    title: 'Who is your target audience?',
  },
  {
    title: 'What\'s your main goal?',
  },
  {
    title: 'What information do you want to collect?',
  },
];

const FormBuilder: React.FC<Props> = ({ navigation, route }) => {
  const { answers } = route.params || {};

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Form Builder</Text>
          <Text style={styles.subtitle}>This is where you'll build your form</Text>
          
          {answers && (
            <View style={styles.answersContainer}>
              <Text style={styles.answersTitle}>Your Answers</Text>
              {Object.entries(answers).map(([step, answerArray], index) => (
                <View key={index} style={styles.answerItem}>
                  <View style={styles.answerHeader}>
                    <View style={styles.stepBadge}>
                      <Text style={styles.stepBadgeText}>{parseInt(step) + 1}</Text>
                    </View>
                    <Text style={styles.answerLabel}>{questions[parseInt(step)].title}</Text>
                  </View>
                  <View style={styles.answerValueContainer}>
                    {Array.isArray(answerArray) && answerArray.length > 0 ? (
                      answerArray.map((answer: string, idx: number) => (
                        <Text key={idx} style={styles.answerValue}>
                          • {answer.charAt(0).toUpperCase() + answer.slice(1).replace(/_/g, ' ')}
                        </Text>
                      ))
                    ) : (
                      <Text style={styles.answerValue}>{String(answerArray || '')}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          <Pressable 
            style={styles.backButton}
            onPress={() => navigation.navigate('Home')}
            android_ripple={{ color: 'rgba(160,96,255,0.2)' }}
          >
            <Text style={styles.backButtonText}>Publish Form</Text>
          </Pressable>
          <Pressable 
            style={styles.cancelButton}
            onPress={() => navigation.navigate('Home')}
            android_ripple={{ color: 'rgba(160,96,255,0.2)' }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginBottom: 32,
  },
  answersContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  answersTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
    marginBottom: 16,
  },
  answerItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  answerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  answerLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#666666',
    lineHeight: 20,
  },
  answerValueContainer: {
    marginTop: 4,
    paddingLeft: 44,
  },
  answerValue: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: '#000000',
    marginBottom: 4,
    lineHeight: 22,
  },
  backButton: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
  cancelButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 12,
    marginTop: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
});

export default FormBuilder;

