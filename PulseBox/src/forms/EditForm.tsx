import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback, Modal, Pressable, PanResponder } from 'react-native';
import type { GestureResponderEvent, PanResponderGestureState } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useForms } from '../context/FormsContext';
import ShareIcon from '../../assets/images/share.svg';
import EditIcon from '../../assets/images/edit.svg';
import TrashIcon from '../../assets/images/trash.svg';
import SwapIcon from '../../assets/images/swap.svg';
import ArrowUp from '../../assets/images/arrow-up-white.svg';
import ArrowDown from '../../assets/images/arrow-down-white.svg';
import BackIcon from '../../assets/images/Back.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'EditForm'>;

interface QuestionItem {
  id: string;
  title: string;
}

const ITEM_HEIGHT = 96;

const EditForm: React.FC<Props> = ({ route, navigation }) => {
  const { formId } = route.params;
  const { forms, addForm, updateForm } = useForms();
  const form = useMemo(() => forms.find(f => f.id === formId), [forms, formId]);

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const trashScale = useRef(new Animated.Value(1)).current;
  const listOpacity = useRef(new Animated.Value(1)).current;
  const [pageStart, setPageStart] = useState(0);
  const PAGE_SIZE = 4;

  useEffect(() => {
    // derive questions from stored answers if present
    const derived: QuestionItem[] = (form?.answers?.questions as QuestionItem[] | undefined)
      || Array.from({ length: 6 }).map((_, i) => ({ id: `${i + 1}`, title: `Question ${i + 1}` }));
    setQuestions(derived);
  }, [form]);

  const handleDeleteByIndex = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
    setShowDeleteModal(true);
    setTimeout(() => setShowDeleteModal(false), 1600);
  };

  const swapQuestions = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= questions.length || toIndex === fromIndex) return;
    setQuestions(prev => {
      const copy = prev.slice();
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      // Save to form context
      if (form) {
        updateForm(formId, {
          answers: {
            ...form.answers,
            questions: copy
          }
        });
      }
      return copy;
    });
  };

  const QuestionRow: React.FC<{ q: QuestionItem; index: number }> = ({ q, index }) => {
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(1)).current;
    const [isDragging, setIsDragging] = useState(false);

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          setIsDragging(true);
          Animated.parallel([
            Animated.spring(scale, { toValue: 1.02, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0.95, duration: 120, useNativeDriver: true }),
          ]).start();
          Animated.spring(trashScale, { toValue: 1.2, friction: 4, useNativeDriver: true }).start();
        },
        onPanResponderMove: (_evt: GestureResponderEvent, gesture: PanResponderGestureState) => {
          translateX.setValue(gesture.dx);
          translateY.setValue(gesture.dy);
        },
        onPanResponderRelease: (_evt: GestureResponderEvent, gesture: PanResponderGestureState) => {
          Animated.parallel([
            Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 1, duration: 120, useNativeDriver: true }),
            Animated.spring(trashScale, { toValue: 1, useNativeDriver: true }),
          ]).start();

          if (gesture.dx < -80) {
            handleDeleteByIndex(index);
            return;
          }

          if (gesture.dx > 100 && gesture.dy < -60) {
            handleDeleteByIndex(index);
            return;
          }

          if (Math.abs(gesture.dy) > ITEM_HEIGHT / 2) {
            const direction = gesture.dy > 0 ? 1 : -1;
            swapQuestions(index, index + direction);
          }

          Animated.parallel([
            Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
          ]).start();
          setIsDragging(false);
        },
        onPanResponderTerminate: () => {
          setIsDragging(false);
          Animated.parallel([
            Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
            Animated.spring(trashScale, { toValue: 1, useNativeDriver: true }),
          ]).start();
        },
      })
    ).current;

    return (
      <Pressable onPress={() => navigation.navigate('QuestionsScreen', { formId, questionId: q.id })}>
        <Animated.View
          style={[
            styles.questionItem,
            { transform: [{ translateX }, { translateY }, { scale }], opacity },
            isDragging ? { zIndex: 9999, elevation: 9999 } : null,
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.qLeft}>
            <Text style={styles.qIndex}>{index + 1}</Text>
          </View>
          <View style={styles.qContent}>
            <Text style={styles.qTitle}>{q.title}</Text>
            <Text style={styles.qSub}>Tap to edit details</Text>
          </View>
          <View style={styles.qRight}>
            <View style={styles.plusCircle}><Text style={styles.plusText}>+</Text></View>
          </View>
        </Animated.View>
      </Pressable>
    );
  };

  if (!form) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}> 
        <Text style={{ fontSize: 16 }}>Form not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} android_ripple={{ color: 'rgba(0,0,0,0.05)', borderless: true }}>
          <BackIcon width={16} height={16} stroke="#000000" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.screenTitle}>Edit Your Forms</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.headerAction}><ShareIcon width={22} height={22} stroke="#000000" /></View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>        
        {/* Page Title */}
        <View style={styles.pageHead}>
          <Text style={styles.pageTitle}>{form.name}</Text>
          <Text style={styles.pageDesc}>Edit as You go. Your Questions are already created as Per your Requirement</Text>
        </View>

        {/* Toolbar Row */}
        <View style={styles.toolsRow}>
          <Animated.View style={[styles.trashTarget, { transform: [{ scale: trashScale }] }]}> 
            <TrashIcon width={30} height={30} stroke="#000000" />
          </Animated.View>
          <Pressable style={styles.addBtn} onPress={() => setQuestions(prev => [...prev, { id: (prev.length + 1).toString(), title: `Question ${prev.length + 1}` }])} android_ripple={{ color: 'rgba(0,0,0,0.06)' }}>
            <Text style={styles.addBtnText}>Add a Question</Text>
          </Pressable>
          <View style={{ flex: 1 }} />
          <Pressable style={styles.rowEndIcon} onPress={() => navigation.navigate('SwapQuestions', { formId })} android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}>
            <SwapIcon width={28} height={28} stroke="#000000" />
          </Pressable>
        </View>

        <Animated.View style={[styles.pagedList, { opacity: listOpacity }]}>
          <Text style={styles.sectionTitle}>Questions</Text>
          {questions.slice(pageStart, pageStart + PAGE_SIZE).map((q, i) => (
            <QuestionRow key={q.id} q={q} index={pageStart + i} />
          ))}
        </Animated.View>
      </View>

      {questions.length > PAGE_SIZE && (
        <View style={styles.pageControls}>
          <Pressable 
            onPress={() => {
              if (pageStart === 0) return;
              Animated.timing(listOpacity, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
                setPageStart(prev => Math.max(0, prev - PAGE_SIZE));
                Animated.timing(listOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
              });
            }}
            style={styles.pageBtn}
            android_ripple={pageStart === 0 ? undefined : { color: 'rgba(0,0,0,0.06)', borderless: true }}
            disabled={pageStart === 0}
          >
            <View style={pageStart === 0 ? styles.iconDisabled : null}>
              <ArrowUp width={46} height={46} stroke={pageStart === 0 ? "#CCCCCC" : "#000000"} />
            </View>
          </Pressable>
          <Pressable 
            onPress={() => {
              if (pageStart + PAGE_SIZE >= questions.length) return;
              Animated.timing(listOpacity, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
                setPageStart(prev => Math.min(questions.length - PAGE_SIZE, prev + PAGE_SIZE));
                Animated.timing(listOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
              });
            }}
            style={styles.pageBtn}
            android_ripple={pageStart + PAGE_SIZE >= questions.length ? undefined : { color: 'rgba(0,0,0,0.06)', borderless: true }}
            disabled={pageStart + PAGE_SIZE >= questions.length}
          >
            <View style={pageStart + PAGE_SIZE >= questions.length ? styles.iconDisabled : null}>
              <ArrowDown width={46} height={46} stroke={pageStart + PAGE_SIZE >= questions.length ? "#CCCCCC" : "#000000"} />
            </View>
          </Pressable>
        </View>
      )}

      {/* Delete toast */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowDeleteModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalIcon}>🗑️</Text>
              <Text style={styles.modalTitle}>Question Deleted</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerAction: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageHead: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
    marginBottom: 6,
  },
  pageDesc: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#000000',
    lineHeight: 18,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    overflow: 'visible',
  },
  toolsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  trashTarget: {
    padding: 6,
  },
  rowEndIcon: {
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 18,
    paddingBottom: 24,
  },
  scrollView: {
    overflow: 'visible',
  },
  pagedList: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 20,
  },
  pageControls: {
    position: 'absolute',
    bottom: 50,
    right: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 30,
  },
  pageBtn: {
    padding: 4,
    borderRadius: 8,
  },
  iconDisabled: {
    opacity: 0.3,
  },
  questionItem: {
    height: ITEM_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: 'transparent',
    elevation: 0,
  },
  qLeft: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  qIndex: {
    width: 28,
    height: 28,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#E6E9EF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#000000',
    overflow: 'hidden',
    includeFontPadding: false,
  },
  qContent: {
    flex: 1,
  },
  qTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: '#000000',
  },
  qSub: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#888888',
    marginTop: 2,
  },
  qRight: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#000000',
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
  },
  addBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 8,
    marginLeft: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  addBtnText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#000000',
  },
  sectionTitle: {
    display: 'none',
  },
});

export default EditForm;


