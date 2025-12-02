import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import BackIcon from '../../assets/images/Back.svg';
import Svg, { Path } from 'react-native-svg';

type Props = NativeStackScreenProps<RootStackParamList, 'ClassDetails'>;

// Icons
const StudentsIcon = ({ size = 24, color = '#666' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ClassDetails: React.FC<Props> = ({ route, navigation }) => {
  const { classId } = route.params;
  
  // Mock class data - will be replaced with Firebase
  const classData = {
    id: classId,
    name: 'Mathematics 101',
    subject: 'Mathematics',
    gradeLevel: 'Grade 10',
    studentCount: 28,
    schedule: 'Mon, Wed, Fri - 9:00 AM',
    roomNumber: 'Room 205',
  };

  const quickActions = [
    {
      id: 'attendance',
      title: 'Mark Attendance',
      icon: '✓',
      color: '#4CAF50',
      onPress: () => navigation.navigate('Attendance', { classId }),
    },
    {
      id: 'students',
      title: 'View Students',
      icon: '👥',
      color: '#2196F3',
      onPress: () => navigation.navigate('Responses'), // Will navigate to Students screen
    },
    {
      id: 'assignment',
      title: 'Create Assignment',
      icon: '📝',
      color: '#A060FF',
      onPress: () => navigation.navigate('CreateAssignment', { classId }),
    },
    {
      id: 'grades',
      title: 'View Grades',
      icon: '📊',
      color: '#FF9800',
      onPress: () => navigation.navigate('Grading', { classId }),
    },
  ];

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
        <Text style={styles.headerTitle}>Class Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Class Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.className}>{classData.name}</Text>
          <Text style={styles.classSubject}>{classData.subject} • {classData.gradeLevel}</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <StudentsIcon size={20} color="#666" />
              <Text style={styles.infoText}>{classData.studentCount} Students</Text>
            </View>
            <Text style={styles.infoText}>•</Text>
            <Text style={styles.infoText}>{classData.schedule}</Text>
          </View>
          {classData.roomNumber && (
            <Text style={styles.roomText}>{classData.roomNumber}</Text>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <Pressable
                key={action.id}
                style={styles.quickActionCard}
                onPress={action.onPress}
                android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                  <Text style={styles.quickActionEmoji}>{action.icon}</Text>
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>No recent activity</Text>
            <Text style={styles.activitySubtext}>Activity will appear here</Text>
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
  infoCard: {
    backgroundColor: '#F8F5FF',
    borderWidth: 1,
    borderColor: '#E0D5FF',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 24,
  },
  className: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
    marginBottom: 8,
  },
  classSubject: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginRight: 8,
  },
  roomText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
  },
  quickActionsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionEmoji: {
    fontSize: 28,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
    textAlign: 'center',
  },
  activitySection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  activityCard: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  activityText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  activitySubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#999999',
  },
});

export default ClassDetails;

