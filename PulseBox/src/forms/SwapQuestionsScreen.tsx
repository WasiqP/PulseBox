import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Pressable, PanResponder } from 'react-native';
import type { GestureResponderEvent, PanResponderGestureState } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import { useForms } from '../context/FormsContext';
import BackIcon from '../../assets/images/Back.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'SwapQuestions'>;

interface QuestionItem {
  id: string;
  title: string;
}

const SwapQuestionsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { formId } = route.params;
  const { forms, updateForm } = useForms();
  const form = forms.find(f => f.id === formId);
  
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Derive questions from stored answers if present
    const derived: QuestionItem[] = (form?.answers?.questions as QuestionItem[] | undefined)
      || Array.from({ length: 6 }).map((_, i) => ({ id: `${i + 1}`, title: `Question ${i + 1}` }));
    setQuestions(derived);
  }, [form]);

  useFocusEffect(
    React.useCallback(() => {
      // Reset and fade in animation when screen comes into focus
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim])
  );

  const swapQuestions = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= questions.length || toIndex === fromIndex) return;
    setQuestions(prev => {
      const copy = prev.slice();
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
  };

  const handleSave = async () => {
    // Save the reordered questions back to the form
    if (form) {
      await updateForm(formId, {
        answers: {
          ...form.answers,
          questions: questions
        }
      });
      navigation.goBack();
    }
  };

  const SwapRow: React.FC<{ q: QuestionItem; index: number }> = ({ q, index }) => {
    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          Animated.parallel([
            Animated.spring(scale, { toValue: 1.02, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0.96, duration: 100, useNativeDriver: true }),
          ]).start();
        },
        onPanResponderMove: (_evt: GestureResponderEvent, gesture: PanResponderGestureState) => {
          translateY.setValue(gesture.dy);
        },
        onPanResponderRelease: (_evt: GestureResponderEvent, gesture: PanResponderGestureState) => {
          if (Math.abs(gesture.dy) > 28) {
            const direction = gesture.dy > 0 ? 1 : -1;
            swapQuestions(index, index + direction);
          }
          Animated.parallel([
            Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
            Animated.spring(opacity, { toValue: 1, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
          ]).start();
        },
        onPanResponderTerminate: () => {
          Animated.parallel([
            Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
            Animated.spring(opacity, { toValue: 1, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
          ]).start();
        },
      })
    ).current;

    return (
      <Animated.View
        style={[styles.swapItem, { transform: [{ translateY }, { scale }], opacity }]}
        {...panResponder.panHandlers}
      >
        <Text style={styles.swapIndex}>{index + 1}</Text>
        <Text style={styles.swapText}>{q.title}</Text>
      </Animated.View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable 
          onPress={() => navigation.goBack()} 
          style={styles.backBtn} 
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} 
          android_ripple={{ color: 'rgba(0,0,0,0.05)', borderless: true }}
        >
          <BackIcon width={16} height={16} stroke="#000000" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.screenTitle}>Reorder Questions</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Drag to Reorder</Text>
          <Text style={styles.infoDesc}>Long press and drag questions up or down to change their order</Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.swapList} 
          showsVerticalScrollIndicator={false}
        >
          {questions.map((q, i) => (
            <SwapRow key={`swap-${q.id}`} q={q} index={i} />
          ))}
        </ScrollView>

        <Pressable 
          style={styles.saveBtn} 
          onPress={handleSave} 
          android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
        >
          <Text style={styles.saveBtnText}>Save Order</Text>
        </Pressable>
      </View>
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
    borderColor: '#EFEFEF',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
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
  headerRight: {
    width: 32,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  infoSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#EFEFEF',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
    marginBottom: 8,
  },
  infoDesc: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    lineHeight: 20,
  },
  swapList: {
    paddingVertical: 6,
    flexGrow: 1,
  },
  swapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  swapIndex: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: 14,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#000000',
    backgroundColor: '#F5F5F5',
  },
  swapText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#000000',
  },
  saveBtn: {
    marginTop: 20,
    alignSelf: 'stretch',
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
});

export default SwapQuestionsScreen;

