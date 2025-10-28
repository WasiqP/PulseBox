import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Modal, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import BottomTab from '../components/BottomTab';
import Svg, { Path } from 'react-native-svg';
import { useForms } from '../context/FormsContext';
import FormIcon from '../components/FormIcons';
import { PanResponder } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'MyForms'>;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Animated Trash Icon Component
const AnimatedTrashIcon = ({ size = 24, scaleValue }: { size?: number; scaleValue: any }) => {
  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <Svg width={size} height={size} viewBox="0 0 21 21" fill="none">
        <Path 
          d="M5.5 4.5h10v12a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2zm5-2a2 2 0 0 1 1.995 1.85l.005.15h-4a2 2 0 0 1 2-2zm-7 2h14m-9 3v8m4-8v8" 
          stroke="#000000" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </Svg>
    </Animated.View>
  );
};

// Plus Icon Component
const PlusIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Text style={{ fontSize: size, color: color, fontWeight: '300', fontFamily: 'Poppins-Light' }}>+</Text>
);

interface FormItemProps {
  form: any;
  onDelete: (id: string) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const FormItem = ({ form, onDelete, onDragStart, onDragEnd }: FormItemProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsDragging(true);
        onDragStart();
        
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1.05,
            friction: 8,
            tension: 100,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      },
      onPanResponderMove: (evt, gestureState) => {
        // Use dx/dy for relative movement
        translateX.setValue(gestureState.dx);
        translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (evt, gestureState) => {
        setIsDragging(false);
        onDragEnd();
        
        // Check if dropped near trash icon (top right area)
        const thresholdX = 100;
        const thresholdY = -50;
        
        if (gestureState.dx > thresholdX && gestureState.dy < thresholdY) {
          // Delete the form
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onDelete(form.id);
          });
        } else {
          // Return to original position
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 0,
              friction: 8,
              tension: 50,
              useNativeDriver: true,
            }),
            Animated.spring(translateY, {
              toValue: 0,
              friction: 8,
              tension: 50,
              useNativeDriver: true,
            }),
            Animated.spring(scale, {
              toValue: 1,
              friction: 8,
              tension: 50,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
        onDragEnd();
        
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            friction: 8,
            tension: 50,
            useNativeDriver: true,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            friction: 8,
            tension: 50,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            friction: 8,
            tension: 50,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
      },
    })
  ).current;

  return (
    <View style={isDragging ? { zIndex: 9999, elevation: 9999 } : {}}>
      <Animated.View
        style={[
          styles.formItem,
          {
            transform: [{ translateX }, { translateY }, { scale }],
            opacity,
          }
        ]}
        {...panResponder.panHandlers}
      >
      <View style={styles.iconPlaceholder}>
        <FormIcon iconId={form.iconId} size={20} color="#999999" />
      </View>
      <View style={styles.textPlaceholder}>
        <Text style={styles.placeholderLine1}>{form.name}</Text>
        <Text style={styles.placeholderLine2}>Created {new Date(form.createdAt).toLocaleDateString()}</Text>
      </View>
      <View style={styles.plusContainer}>
        <PlusIcon size={18} />
      </View>
    </Animated.View>
    </View>
  );
};

const MyForms: React.FC<Props> = ({ navigation, route }) => {
  const { forms, deleteForm } = useForms();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [trashScale] = useState(new Animated.Value(1));
  
  const handleDragStart = () => {
    // Scale up trash can
    Animated.spring(trashScale, {
      toValue: 1.2,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleDragEnd = () => {
    // Scale down trash can
    Animated.spring(trashScale, {
      toValue: 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleDelete = async (id: string) => {
    await deleteForm(id);
    setShowDeleteModal(true);
    setTimeout(() => {
      setShowDeleteModal(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header Section - Behind forms */}
      <View style={[styles.header, styles.headerBehind]}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Your Forms</Text>
          <View style={styles.deleteSection}>
            <AnimatedTrashIcon size={24} scaleValue={trashScale} />
          </View>
        </View>
        <Text style={styles.subtitle}>You can View your Created Forms here and Edit or Share them</Text>
      </View>
      
      <View style={styles.content}>
        {/* Forms List - Above header */}
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
        >
          {forms.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No Forms Yet</Text>
              <Text style={styles.emptySubtitle}>
                Create your first form to start collecting feedback
              </Text>
            </View>
          ) : (
            forms.map((form, index) => (
              <FormItem
                key={form.id}
                form={form}
                onDelete={handleDelete}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            ))
          )}
        </ScrollView>
      </View>
      
      {/* Success Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowDeleteModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalIcon}>🗑️</Text>
              <Text style={styles.modalTitle}>Form Deleted</Text>
              <Text style={styles.modalMessage}>
                The form has been successfully deleted.
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      
      <BottomTab navigation={navigation} currentRoute="MyForms" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    overflow: 'visible',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 0,
    overflow: 'visible',
    zIndex: 2,
    elevation: 2,
  },
  scrollContent: {
    flexGrow: 1,
    overflow: 'visible',
    paddingTop: 200, // Space for header
  },
  header: {
    marginBottom: 30,
  },
  headerBehind: {
    position: 'absolute',
    top: 80,
    left: 30,
    right: 30,
    zIndex: 1,
    elevation: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#000000',
    lineHeight: 24,
  },
  deleteSection: {
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  formItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 14,
  },
  iconPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textPlaceholder: {
    flex: 1,
  },
  placeholderLine1: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  placeholderLine2: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
  },
  plusContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: '#000000',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    textAlign: 'center',
  },
});

export default MyForms;
