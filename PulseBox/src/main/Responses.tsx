import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import BottomTab from '../components/BottomTab';
import { useForms } from '../context/FormsContext';
import { theme } from '../theme/Colors';
import BackIcon from '../../assets/images/Back.svg';
import ShareIcon from '../../assets/images/share.svg';
import TrashIcon from '../../assets/images/trash.svg';
import StatsIcon from '../../assets/images/stats.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'Responses'>;

interface ResponseData {
  id: string;
  formId: string;
  formName: string;
  submittedAt: string;
  answers: Record<string, any>;
  isRead: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  isSaved: boolean;
}

const Responses: React.FC<Props> = ({ navigation }) => {
  const { forms } = useForms();
  const [filter, setFilter] = useState<'all' | 'unread' | 'favorites' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Mock responses data - In real app, this would come from context/API
  const [responses, setResponses] = useState<ResponseData[]>([]);

  const filteredResponses = useMemo(() => {
    let filtered = responses;

    // Apply filter
    switch (filter) {
      case 'unread':
        filtered = filtered.filter(r => !r.isRead);
        break;
      case 'favorites':
        filtered = filtered.filter(r => r.isFavorite);
        break;
      case 'archived':
        filtered = filtered.filter(r => r.isArchived);
        break;
      default:
        filtered = filtered.filter(r => !r.isArchived); // Don't show archived by default
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.formName.toLowerCase().includes(query) ||
        Object.values(r.answers).some(answer => 
          String(answer).toLowerCase().includes(query)
        )
      );
    }

    return filtered.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }, [responses, filter, searchQuery]);

  const toggleFavorite = (id: string) => {
    setResponses(prev => prev.map(r => 
      r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
    ));
  };

  const toggleArchive = (id: string) => {
    setResponses(prev => prev.map(r => 
      r.id === id ? { ...r, isArchived: !r.isArchived } : r
    ));
  };

  const toggleSave = (id: string) => {
    setResponses(prev => prev.map(r => 
      r.id === id ? { ...r, isSaved: !r.isSaved } : r
    ));
  };

  const markAsRead = (id: string) => {
    setResponses(prev => prev.map(r => 
      r.id === id ? { ...r, isRead: true } : r
    ));
  };

  const deleteResponse = (id: string) => {
    setResponses(prev => prev.filter(r => r.id !== id));
  };

  const ResponseCard: React.FC<{ response: ResponseData }> = ({ response }) => {
    const firstAnswer = Object.values(response.answers)[0];
    const preview = firstAnswer ? String(firstAnswer).substring(0, 100) : 'No answer provided';
    
    return (
      <Pressable
        style={[styles.responseCard, !response.isRead && styles.responseCardUnread]}
        onPress={() => markAsRead(response.id)}
        android_ripple={{ color: 'rgba(160,96,255,0.08)' }}
      >
        <View style={styles.responseHeader}>
          <View style={styles.responseHeaderLeft}>
            {!response.isRead && <View style={styles.unreadDot} />}
            <View style={styles.responseInfo}>
              <Text style={styles.responseFormName}>{response.formName}</Text>
              <Text style={styles.responseDate}>
                {new Date(response.submittedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          </View>
          <View style={styles.responseActions}>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                toggleFavorite(response.id);
              }}
              style={styles.actionBtn}
              android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
            >
              <Text style={[styles.actionIcon, response.isFavorite && styles.actionIconActive]}>
                ★
              </Text>
            </Pressable>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                toggleSave(response.id);
              }}
              style={styles.actionBtn}
              android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
            >
              <Text style={[styles.actionIcon, response.isSaved && styles.actionIconActive]}>
                {response.isSaved ? '✓' : '○'}
              </Text>
            </Pressable>
          </View>
        </View>
        <Text style={styles.responsePreview} numberOfLines={2}>
          {preview}
        </Text>
        <View style={styles.responseFooter}>
          <View style={styles.responseFooterLeft}>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                toggleArchive(response.id);
              }}
              style={styles.footerActionBtn}
              android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
            >
              <Text style={styles.footerActionText}>
                {response.isArchived ? 'Unarchive' : 'Archive'}
              </Text>
            </Pressable>
          </View>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              deleteResponse(response.id);
            }}
            style={styles.deleteBtn}
            android_ripple={{ color: 'rgba(255,0,0,0.1)', borderless: true }}
          >
            <TrashIcon width={18} height={18} stroke="#FF6B6B" />
          </Pressable>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Responses</Text>
          <Text style={styles.subtitle}>
            {filteredResponses.length} {filteredResponses.length === 1 ? 'response' : 'responses'}
          </Text>
        </View>
        <Pressable
          style={styles.filterBtn}
          onPress={() => setShowFilterModal(true)}
          android_ripple={{ color: 'rgba(160,96,255,0.12)', borderless: true }}
        >
          <StatsIcon width={24} height={24} stroke={theme.primary} />
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search responses..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <Pressable
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
          android_ripple={{ color: 'rgba(160,96,255,0.12)' }}
        >
          <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
            All
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterTab, filter === 'unread' && styles.filterTabActive]}
          onPress={() => setFilter('unread')}
          android_ripple={{ color: 'rgba(160,96,255,0.12)' }}
        >
          <Text style={[styles.filterTabText, filter === 'unread' && styles.filterTabTextActive]}>
            Unread
          </Text>
          {responses.filter(r => !r.isRead && !r.isArchived).length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {responses.filter(r => !r.isRead && !r.isArchived).length}
              </Text>
            </View>
          )}
        </Pressable>
        <Pressable
          style={[styles.filterTab, filter === 'favorites' && styles.filterTabActive]}
          onPress={() => setFilter('favorites')}
          android_ripple={{ color: 'rgba(160,96,255,0.12)' }}
        >
          <Text style={[styles.filterTabText, filter === 'favorites' && styles.filterTabTextActive]}>
            Favorites
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterTab, filter === 'archived' && styles.filterTabActive]}
          onPress={() => setFilter('archived')}
          android_ripple={{ color: 'rgba(160,96,255,0.12)' }}
        >
          <Text style={[styles.filterTabText, filter === 'archived' && styles.filterTabTextActive]}>
            Archived
          </Text>
        </Pressable>
      </View>

      {/* Responses List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredResponses.length === 0 ? (
          <View style={styles.emptyState}>
            <StatsIcon width={64} height={64} stroke="#CCCCCC" />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No responses found' : filter === 'archived' ? 'No archived responses' : 'No responses yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery 
                ? 'Try adjusting your search query'
                : filter === 'archived'
                ? 'Archived responses will appear here'
                : 'Responses to your forms will appear here'}
            </Text>
          </View>
        ) : (
          filteredResponses.map((response) => (
            <ResponseCard key={response.id} response={response} />
          ))
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowFilterModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Filter Responses</Text>
                <Text style={styles.modalSubtitle}>
                  Total: {responses.length} | 
                  Unread: {responses.filter(r => !r.isRead).length} | 
                  Favorites: {responses.filter(r => r.isFavorite).length}
                </Text>
                <Pressable
                  style={styles.modalCloseBtn}
                  onPress={() => setShowFilterModal(false)}
                  android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <BottomTab navigation={navigation} currentRoute="Responses" />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#000000',
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
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterTabActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  filterTabText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#666666',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: theme.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100,
  },
  responseCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  responseCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
    backgroundColor: '#F8F5FF',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.primary,
    marginRight: 12,
    marginTop: 6,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  responseHeaderLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  responseInfo: {
    flex: 1,
  },
  responseFormName: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
    marginBottom: 4,
  },
  responseDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
  },
  responseActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  actionIcon: {
    fontSize: 18,
    color: '#CCCCCC',
  },
  actionIconActive: {
    color: theme.primary,
  },
  responsePreview: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  responseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  responseFooterLeft: {
    flexDirection: 'row',
    gap: 12,
  },
  footerActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  footerActionText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: theme.primary,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE5E5',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#000000',
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#000000',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginBottom: 24,
  },
  modalCloseBtn: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
});

export default Responses;
