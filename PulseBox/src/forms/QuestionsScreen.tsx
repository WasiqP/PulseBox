import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'QuestionsScreen'>;

const QuestionsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { formId, questionId } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Question {questionId}</Text>
      <Text style={styles.subtitle}>Form ID: {formId}</Text>
      <Pressable style={styles.btn} onPress={() => navigation.goBack()}>
        <Text style={styles.btnText}>Go Back</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  title: { fontSize: 22, fontWeight: '700', color: '#000000', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#555555', marginBottom: 20 },
  btn: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#000000', borderRadius: 8 },
  btnText: { color: '#FFFFFF' },
});

export default QuestionsScreen;


