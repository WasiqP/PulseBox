import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import BottomTab from '../components/BottomTab';
import Svg, { Path } from 'react-native-svg';
import { useClasses } from '../context/ClassesContext';

type Props = NativeStackScreenProps<RootStackParamList, 'MyClasses'>;

// ClassData is now imported from context

// Icons
const BookIcon = ({ size = 24, color = '#666' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const StudentsIcon = ({ size = 24, color = '#666' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const CalendarIcon = ({ size = 24, color = '#666' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16 2V6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M8 2V6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M3 10H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const MyClasses: React.FC<Props> = ({ navigation }) => {
  const { classes } = useClasses();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>My Classes</Text>
        </View>
        <Text style={styles.subtitle}>Manage your classes and students</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search classes..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Create New Class Button */}
      <Pressable
        style={styles.createClassBtn}
        android_ripple={{ color: 'rgba(160,96,255,0.1)' }}
        onPress={() => navigation.navigate('CreateClass')}
      >
        <View style={styles.createClassContent}>
          <View style={styles.plusIcon}>
            <Text style={styles.plusText}>+</Text>
          </View>
          <View style={styles.createClassText}>
            <Text style={styles.createClassTitle}>Create New Class</Text>
            <Text style={styles.createClassDesc}>Add a new class to manage</Text>
          </View>
        </View>
      </Pressable>

      {/* Classes List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredClasses.length === 0 ? (
          <View style={styles.emptyState}>
            <BookIcon size={64} color="#CCCCCC" />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No classes found' : 'No classes yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? 'Try adjusting your search'
                : 'Create your first class to get started'}
            </Text>
          </View>
        ) : (
          filteredClasses.map((classItem) => (
            <Pressable
              key={classItem.id}
              style={styles.classCard}
              android_ripple={{ color: 'rgba(160,96,255,0.08)' }}
              onPress={() => navigation.navigate('ClassDetails', { classId: classItem.id })}
            >
              <View style={styles.classIcon}>
                <BookIcon size={24} color="#A060FF" />
              </View>
              <View style={styles.classContent}>
                <Text style={styles.className}>{classItem.name}</Text>
                <Text style={styles.classSubject}>{classItem.subject} • {classItem.gradeLevel}</Text>
                <View style={styles.classInfo}>
                  <View style={styles.infoItem}>
                    <StudentsIcon size={16} color="#666" />
                    <Text style={styles.infoText}>{classItem.studentCount} students</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <CalendarIcon size={16} color="#666" />
                    <Text style={styles.infoText}>{classItem.schedule}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.classActions}>
                <Pressable
                  style={styles.actionBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    navigation.navigate('Attendance', { classId: classItem.id });
                  }}
                  android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
                >
                  <Text style={styles.actionEmoji}>✓</Text>
                </Pressable>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>

      <BottomTab navigation={navigation} currentRoute="MyClasses" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#000000',
  },
  createClassBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#A060FF',
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 20,
    shadowColor: '#A060FF',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  createClassContent: {
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
  createClassText: {
    flex: 1,
  },
  createClassTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: '#A060FF',
    marginBottom: 2,
  },
  createClassDesc: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  classCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  classIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  classContent: {
    flex: 1,
  },
  className: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
    marginBottom: 4,
  },
  classSubject: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  classInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
  },
  classActions: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionEmoji: {
    fontSize: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default MyClasses;

