import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import BackIcon from '../../assets/images/Back.svg';
import { useClasses, ClassData } from '../context/ClassesContext';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateClass'>;

const CreateClass: React.FC<Props> = ({ navigation }) => {
  const { addClass } = useClasses();
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [schedule, setSchedule] = useState('');
  const [roomNumber, setRoomNumber] = useState('');

  const gradeLevels = ['Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 
                       'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

  const handleCreate = async () => {
    if (!className || !subject || !gradeLevel) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    // Create new class object
    const newClass: ClassData = {
      id: Date.now().toString(), // Simple ID generation - will be replaced with Firebase
      name: className,
      subject: subject,
      gradeLevel: gradeLevel,
      studentCount: 0, // Will be updated when students are added
      schedule: schedule || 'Not set',
      roomNumber: roomNumber || undefined,
      createdAt: new Date().toISOString(),
    };

    // Save to context (which saves to AsyncStorage)
    await addClass(newClass);

    Alert.alert('Success', 'Class created successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
        >
          <BackIcon width={24} height={24} stroke="#000000" />
        </Pressable>
        <Text style={styles.headerTitle}>Create New Class</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Class Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Mathematics 101"
              placeholderTextColor="#999"
              value={className}
              onChangeText={setClassName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subject *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Mathematics, English, Science"
              placeholderTextColor="#999"
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Grade Level *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gradeScroll}>
              {gradeLevels.map((grade) => (
                <Pressable
                  key={grade}
                  style={[
                    styles.gradeChip,
                    gradeLevel === grade && styles.gradeChipActive,
                  ]}
                  onPress={() => setGradeLevel(grade)}
                  android_ripple={{ color: 'rgba(160,96,255,0.1)' }}
                >
                  <Text
                    style={[
                      styles.gradeChipText,
                      gradeLevel === grade && styles.gradeChipTextActive,
                    ]}
                  >
                    {grade}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Schedule (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Mon, Wed, Fri - 9:00 AM"
              placeholderTextColor="#999"
              value={schedule}
              onChangeText={setSchedule}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Room Number (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Room 205"
              placeholderTextColor="#999"
              value={roomNumber}
              onChangeText={setRoomNumber}
            />
          </View>

          <Pressable
            style={styles.createBtn}
            onPress={handleCreate}
            android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
          >
            <Text style={styles.createBtnText}>Create Class</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#000000',
  },
  gradeScroll: {
    marginTop: 8,
  },
  gradeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
  },
  gradeChipActive: {
    backgroundColor: '#A060FF',
    borderColor: '#A060FF',
  },
  gradeChipText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#666666',
  },
  gradeChipTextActive: {
    color: '#FFFFFF',
  },
  createBtn: {
    backgroundColor: '#A060FF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#A060FF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  createBtnText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
});

export default CreateClass;

