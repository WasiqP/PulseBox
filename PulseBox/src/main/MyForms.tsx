import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import BottomTab from '../components/BottomTab';

type Props = NativeStackScreenProps<RootStackParamList, 'MyForms'>;

const MyForms: React.FC<Props> = ({ navigation, route }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.title}>My Forms</Text>
        <Text style={styles.subtitle}>Manage your created forms</Text>
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.emptyState}>
            <Text style={styles.emoji}>📝</Text>
            <Text style={styles.emptyTitle}>No Forms Yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first form to start collecting feedback
            </Text>
          </View>
        </ScrollView>
      </View>
      
      <BottomTab navigation={navigation} currentRoute="MyForms" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginBottom: 32,
  },
  scrollContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default MyForms;

